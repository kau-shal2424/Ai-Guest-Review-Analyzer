# pyrefly: ignore [missing-import]
from pydantic import BaseModel

class Review(BaseModel):
    id: int
    review: str