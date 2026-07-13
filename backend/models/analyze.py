# pyrefly: ignore [missing-import]
from pydantic import BaseModel, Field

class AnalyzeRequest(BaseModel):
    review: str = Field(..., min_length=5, max_length=5000)