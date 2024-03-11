import numpy as np
from numpy.linalg import norm

from typing import List

import instructor
from pydantic import BaseModel, Field
from models import DAO, Extraction


class SimilarDocument(BaseModel):
    document: DAO
    similarityScore: float = Field(exclude=True)


class RAGOutput(BaseModel):
    extraction: Extraction


class RAGService:
    def __init__(self, repositoryService, completionService):
        self.repository = repositoryService
        self.completion = completionService
        self.documents = repositoryService.getAll()

    def retrieveDocumentsByEmbedding(self, queryEmbedding) -> List[DAO]:
        threshold = 0.5
        similarities = [
            SimilarDocument(
                document=doc,
                similarityScore=self.cosineSimilarity(
                    np.array(queryEmbedding), np.array(doc.embedding)
                ),
            )
            for doc in self.documents
        ]
        filteredDocs = list(
            filter(lambda doc: doc.similarityScore > threshold, similarities)
        )
        return [sDoc.document for sDoc in filteredDocs]

    def retrieveDocumentsByNames(self, titles: List[str]) -> List[DAO]:
        filteredDocs = list(filter(lambda doc: doc.title in titles, self.documents))
        return filteredDocs

    def generateResponse(
        self, query: str, retrievedDocs: List[DAO]
    ) -> instructor.Partial[Extraction]:
        context = " ".join(
            [doc.content for doc in retrievedDocs]
        )  # TODO: Many improvements here!
        response = self.completion.getCompletion(query, context)
        return response

    def processQuery(self, query: str, context=None) -> instructor.Partial[Extraction]:
        # if no context, do retrieval
        if context:
            embedding = self.completion.getEmbeddings(query)
            documents = self.retrieveDocumentsByEmbedding(embedding)
        else:
            documents = self.retrieveDocumentsByNames(context)

        return self.generateResponse(query, documents)

    def processEmbedding(self, query: str) -> List[DAO]:
        embedding = self.completion.getEmbeddings(query)
        chosenDocs = self.retrieveDocumentsByEmbedding(embedding)
        return chosenDocs

    def cosineSimilarity(self, A, B):
        return np.dot(A, B) / (norm(A) * norm(B))

    # def DAOtoEmbedding(self):
    #     for doc in self.documents:
    #         stringRep = doc.toString()
    #         self.completion.getEmbeddings(stringRep)
    #         # Push to DB
    #     return
