# pyrefly: ignore [missing-import]
from fastapi import FastAPI, HTTPException
# pyrefly: ignore [missing-import]
from fastapi.middleware.cors import CORSMiddleware
from models.review import Review
from models.analyze import AnalyzeRequest

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

reviews = [
    {
        "id": 1,
        "review": "The room was clean and comfortable."
    },
    {
        "id": 2,
        "review": "Food quality was excellent."
    }
]

reviews = [
    {
        "id": 1,
        "review": "The room was clean and comfortable."
    },
    {
        "id": 2,
        "review": "Food quality was excellent."
    }
]

@app.get("/")
def home():
    return {
        "message": "AI Guest Review Analyzer API"
    }

@app.get("/api/reviews")
def get_reviews():
    return reviews
@app.get("/api/reviews/search")
def search_reviews(q: str):

    results = []

    for review in reviews:

        if q.lower() in review["review"].lower():
            results.append(review)

    return results

@app.get("/api/reviews/{review_id}")
def get_review(review_id: int):

    for review in reviews:
        if review["id"] == review_id:
            return review

    raise HTTPException(
        status_code=404,
        detail="Review not found"
    )
@app.post("/api/reviews", status_code=201)
def create_review(review: Review):

    reviews.append(
        {
            "id": review.id,
            "review": review.review
        }
    )

    return {
        "message": "Review created successfully",
        "review": review
    }
@app.put("/api/reviews/{review_id}")
def update_review(review_id: int, updated_review: Review):

    for review in reviews:

        if review["id"] == review_id:

            review["review"] = updated_review.review

            return {
                "message": "Review updated successfully",
                "review": review
            }

    raise HTTPException(
        status_code=404,
        detail="Review not found"
    )
@app.delete("/api/reviews/{review_id}", status_code=204)
def delete_review(review_id: int):

    for index, review in enumerate(reviews):

        if review["id"] == review_id:

            reviews.pop(index)

            return

    raise HTTPException(
        status_code=404,
        detail="Review not found"
    )
@app.post("/api/analyze")
def analyze_review(data: AnalyzeRequest):

    review_text = data.review.lower()

    sentiment = "Neutral"
    theme = "Experience"

    if "clean" in review_text:
        theme = "Cleanliness"

    elif "food" in review_text:
        theme = "Food"

    elif "host" in review_text:
        theme = "Host"

    elif "location" in review_text:
        theme = "Location"

    if any(word in review_text for word in ["good", "excellent", "great", "clean", "friendly"]):
        sentiment = "Positive"

    elif any(word in review_text for word in ["bad", "poor", "dirty", "worst"]):
        sentiment = "Negative"

    return {
        "sentiment": sentiment,
        "theme": theme,
        "response": "Thank you for your valuable feedback."
    }