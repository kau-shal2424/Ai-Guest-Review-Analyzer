# pyrefly: ignore [missing-import]
from pydantic import BaseModel

class AnalyzeRequest(BaseModel):
    review: str