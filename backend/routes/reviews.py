from typing import Optional
from fastapi import APIRouter, HTTPException, Query

from models.review import Review
from models.analyze import AnalyzeRequest

from services.review_service import (
    get_all_reviews,
    get_review_by_id,
    create_review,
    update_review,
    delete_review,
    search_reviews,
    save_analyzed_review,
    get_dashboard_stats,
    filter_reviews,
)

router = APIRouter(prefix="/api", tags=["Reviews"])


# ==========================
# Home
# ==========================
@router.get("/")
def home():
    return {
        "message": "AI Guest Review Analyzer API"
    }


# ==========================
# Get All Reviews
# ==========================
@router.get("/reviews")
def get_reviews():
    return get_all_reviews()


# ==========================
# Search Reviews
# ==========================
@router.get("/reviews/search")
def search(q: str):
    return search_reviews(q)


# ==========================
# Filter Reviews
# ==========================
@router.get("/reviews/filter")
def filter_review(
    sentiment: Optional[str] = Query(None),
    theme: Optional[str] = Query(None)
):
    return filter_reviews(sentiment, theme)


# ==========================
# Get Review By ID
# ==========================
@router.get("/reviews/{review_id}")
def get_review(review_id: str):

    review = get_review_by_id(review_id)

    if not review:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    return review


# ==========================
# Create Review
# ==========================
@router.post("/reviews", status_code=201)
def add_review(review: Review):

    review_data = {
        "review": review.review
    }

    review_id = create_review(review_data)

    return {
        "message": "Review created successfully",
        "id": review_id
    }


# ==========================
# Update Review
# ==========================
@router.put("/reviews/{review_id}")
def edit_review(review_id: str, review: Review):

    updated = update_review(
        review_id,
        {
            "review": review.review
        }
    )

    if updated == 0:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    return {
        "message": "Review updated successfully"
    }


# ==========================
# Delete Review
# ==========================
@router.delete("/reviews/{review_id}", status_code=204)
def remove_review(review_id: str):

    deleted = delete_review(review_id)

    if deleted == 0:
        raise HTTPException(
            status_code=404,
            detail="Review not found"
        )

    return


# ==========================
# Dashboard Statistics
# ==========================
@router.get("/dashboard")
def dashboard():
    return get_dashboard_stats()


# ==========================
# Analyze Review
# ==========================
@router.post("/analyze")
def analyze_review(data: AnalyzeRequest):

    review_text = data.review.lower()

    sentiment = "Neutral"
    theme = "Experience"

    # Detect Theme
    if "clean" in review_text:
        theme = "Cleanliness"
    elif "food" in review_text:
        theme = "Food"
    elif "host" in review_text:
        theme = "Host"
    elif "location" in review_text:
        theme = "Location"

    # Detect Sentiment
    if any(word in review_text for word in ["good", "excellent", "great", "clean", "friendly"]):
        sentiment = "Positive"
    elif any(word in review_text for word in ["bad", "poor", "dirty", "worst"]):
        sentiment = "Negative"

    response_message = "Thank you for your valuable feedback."

    review_data = {
        "review": data.review,
        "sentiment": sentiment,
        "theme": theme,
        "response": response_message
    }

    review_id = save_analyzed_review(review_data)

    return {
        "message": "Review analyzed and saved successfully.",
        "id": review_id,
        "sentiment": sentiment,
        "theme": theme,
        "response": response_message
    }