from typing import List, Optional
from enum import Enum
from pydantic import BaseModel, Field


class Difficulty(str, Enum):
    introductory = "introductory"
    medium = "medium"
    hard = "hard"


class Subfield(BaseModel):
    title: str = Field(description="The subfield/idea, less than 5 words")


class SyntheticData(BaseModel):
    content: str = Field(description="5 sentence explanation of the subfield")
    related: List[str] = Field(description="3 related ideas in Math/Graph Theory")
    difficulty: Difficulty


class DAO(BaseModel):
    _id: str
    title: str
    content: str
    related: List[str]
    difficulty: Difficulty
    embedding: List[float] = Field(exclude=True)

    def toString(self):
        relatedIdeas = ", \n".join(self.related)
        return f"Title: {self.title} \n Content: {self.content} \n Related Ideas: {relatedIdeas} \n Difficulty: {self.difficulty.value}"


class UpdateObject(BaseModel):
    embedding: Optional[List[float]]


class Extraction(BaseModel):
    answer: str = Field(description="The concise answer to the prompt.")
    keywords: List[str] = Field(
        description="List of one or two word keywords related to the answer."
    )
