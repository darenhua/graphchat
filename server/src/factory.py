# Flask and Mongo
from flask import Flask, jsonify
from flask_cors import CORS
from pymongo.mongo_client import MongoClient

# OpenAI
from openai import OpenAI
import instructor

# Env
from dotenv import load_dotenv
import os

load_dotenv()

from completion import CompletionService
from repository import Repository
from rag import RAGService


class Factory:
    def __init__(self):
        self.app = Flask(__name__)
        CORS(self.app)
        db_uri = os.environ["MONGO_DB_URL"]
        self.mongo_client = MongoClient(db_uri)
        self.instructor_client = instructor.patch(OpenAI())

    def create_app(self):
        return self.app

    def create_repo(self):
        return Repository(self.mongo_client)

    def create_completion(self):
        return CompletionService(self.instructor_client)

    def create_rag(self):
        repo = self.create_repo()
        completion = self.create_completion()
        return RAGService(repo, completion)
