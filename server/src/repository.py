from typing import List
from models import DAO, UpdateObject


class Repository:
    def __init__(self, client):
        self.client = client
        self.database = self.client["rag-demo"]
        self.collectionName = "synthetic-corpus"

    def getAll(self) -> List[DAO]:
        corpus = self.database[self.collectionName]
        documents = corpus.find()
        daos = [DAO(**document) for document in documents]
        return daos

    def insertDocument(self, dao: DAO):
        corpus = self.database[self.collectionName]
        corpus.insert_one(dao.model_dump())
        return

    def updateDocument(self, update_id: str, update: UpdateObject):
        corpus = self.database[self.collectionName]
        document = update.model_dump()
        corpus.update_one({"_id": update_id}, {"$set": document})
        return
