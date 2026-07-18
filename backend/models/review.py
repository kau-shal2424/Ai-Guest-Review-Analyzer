from pydantic import BaseModel, Field


class Review(BaseModel):
    review: str = Field(..., min_length=5, max_length=10000)