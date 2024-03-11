""" setup.py
One-time migration class for inserting data into the mongo db.

Dynamically generates data using gpt-3.5.
"""

from typing import List
from uuid import uuid4
from models import Subfield, SyntheticData, DAO


class DataCreator:
    def __init__(self, client, repositoryService):
        self.client = client
        self.subfields: List[str] = []
        self.repo = repositoryService

    def brainstormSubfields(self) -> Subfield:
        existing = "\n".join(self.subfields)
        prompt = f"Generate one subfield or idea in Graph Theory or Network Analysis. EXCLUDE THE FOLLOWING SUBFIELDS FROM YOUR RESPONSE: {existing}. The subfields I listed above are the ideas I am already considering, you can use them as inspiration to generate ideas but do not repeat any subfields. Be creative and find introductory, fundamental, and cutting edge ideas in Graph Theory research and university lectures."

        return self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_model=Subfield,
            max_retries=3,
            messages=[
                {
                    "role": "system",
                    "content": "You are a world class mathematician specializing in Graph Theory and Network Analysis. You will exactly follow the instructions listed in the user's prompt. You will not output any content that I tell you to exclude in the prompt.",
                },
                {"role": "user", "content": prompt},
            ],
        )

    def createIdea(self, qty: int) -> List[Subfield]:
        newData: List[Subfield] = []

        for i in range(qty):
            subfield = self.brainstormSubfields()
            self.subfields.append(subfield.title)
            newData.append(subfield)

        return newData

    def elaborateData(self, subfield: str) -> SyntheticData:
        prompt = f"Expand on the idea of {subfield} from Graph Theory or Network Analysis. Be creative and explain the concept of {subfield} like an introduction level college professor."

        return self.client.chat.completions.create(
            model="gpt-3.5-turbo",
            response_model=SyntheticData,
            max_retries=3,
            messages=[
                {
                    "role": "system",
                    "content": "You are a world class mathematician specializing in Graph Theory and Network Analysis. You will exactly follow the instructions listed in the user's prompt. You will output concise and engaging content.",
                },
                {"role": "user", "content": prompt},
            ],
        )

    def generateEmbeddings(self, dao: DAO) -> List[int]:
        stringRep = dao.toString()
        res = self.client.embeddings.create(
            input=stringRep, model="text-embedding-3-small"
        )
        return res.data[0].embedding

    def publishData(self, qty: int):
        # Get ideas that are already generated from DB so no repeats
        daos = self.repo.getAll()
        existingSubfields = [dao.title for dao in daos]
        self.subfields = [*self.subfields, *existingSubfields]

        # Get new ideas
        newIdeas = self.createIdea(qty)
        newData: List[DAO] = []
        for i, idea in enumerate(newIdeas):
            uuid = self.get_uuid()

            details = self.elaborateData(idea.title)
            newData.append(
                DAO(
                    _id=uuid,
                    title=idea.title,
                    content=details.content,
                    related=details.related,
                    difficulty=details.difficulty,
                    embedding=[],
                )
            )
            print(f"Generated {i}")

        for dao in newData:
            dao.embedding = self.generateEmbeddings(dao)

        # Insert
        for dao in newData:
            self.repo.insertDocument(dao)
        return

    def get_uuid(self) -> str:
        return str(uuid4())
