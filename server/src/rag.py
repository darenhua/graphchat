import numpy as np
from numpy.linalg import norm

from typing import List

from pydantic import BaseModel, Field
from models import DAO, Extraction


class SimilarDocument(BaseModel):
    document: DAO
    similarityScore: float = Field(exclude=True)


class RAGOutput(BaseModel):
    extraction: Extraction


class EmbeddingsOutput(BaseModel):
    documents: List[DAO]
    content: str


class RAGService:
    def __init__(self, repositoryService, completionService):
        self.repository = repositoryService
        self.completion = completionService
        self.documents = repositoryService.getAll()

    def retrieveDocuments(self, queryEmbedding) -> List[SimilarDocument]:
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
        print(filteredDocs)
        return filteredDocs

    def generateResponse(
        self, query: str, retrievedDocs: List[SimilarDocument]
    ) -> Extraction:
        context = " ".join(
            [doc.document.content for doc in retrievedDocs]
        )  # TODO: Many improvements here!
        response = self.completion.getCompletion(query, context)
        return response

    def processQuery(self, query: str) -> RAGOutput:
        embedding = self.completion.getEmbeddings(query)
        chosenDocs = self.retrieveDocuments(embedding)
        extraction: Extraction = self.generateResponse(query, chosenDocs)
        return RAGOutput(extraction=extraction)

    def processEmbedding(self, query: str) -> EmbeddingsOutput:
        embedding = self.completion.getEmbeddings(query)
        chosenDocs = self.retrieveDocuments(embedding)
        return chosenDocs

    def cosineSimilarity(self, A, B):
        return np.dot(A, B) / (norm(A) * norm(B))

    # def DAOtoEmbedding(self):
    #     for doc in self.documents:
    #         stringRep = doc.toString()
    #         self.completion.getEmbeddings(stringRep)
    #         # Push to DB
    #     return
