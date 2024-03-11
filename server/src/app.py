import os
import sys

sys.path.append(os.path.dirname(__file__))
from factory import Factory
from flask import request, Response, jsonify, stream_with_context, make_response
from pydantic.json import pydantic_encoder
import json

factory = Factory()
app = factory.create_app()
rag = factory.create_rag()


@app.route("/")
def main():
    return jsonify({"msg": "Health check good!"}), 200


@stream_with_context
@app.route("/completion")
def completion():
    query = request.args.get("query")
    context = request.args.getlist("context")

    extractions = rag.processQuery(query, context=context)

    def eventStream():
        for chunk in extractions:
            chunk_json = chunk.model_dump_json()
            yield f"event:message\ndata: {chunk_json}\n\n"
        yield "event: end\ndata: stream\n\n"

    return Response(eventStream(), mimetype="text/event-stream")
    # res = make_response(eventStream())
    # res.headers["mimetype"] = "text/event-stream"

    # return res, 200


@app.route("/embeddings")
def embeddings():
    query = request.args.get("query")

    retrievedDocs = rag.processEmbedding(query)

    res = make_response(json.dumps(retrievedDocs, default=pydantic_encoder))
    res.headers["Content-Type"] = "application/json"

    return res, 200
