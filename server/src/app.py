from factory import Factory
from flask import request, make_response
from pydantic.json import pydantic_encoder
import json

factory = Factory()
app = factory.create_app()
rag = factory.create_rag()


@app.route("/")
def main():
    query = request.args.get("query", "")

    extractions = rag.processQuery(query)

    res = make_response(extractions.model_dump_json())
    res.headers["Content-Type"] = "application/json"

    return res, 200


@app.route("/embeddings")
def embeddings():
    query = request.args.get("query", "")

    retrievedDocs = rag.processEmbedding(query)

    res = make_response(json.dumps(retrievedDocs, default=pydantic_encoder))
    res.headers["Content-Type"] = "application/json"

    return res, 200
