from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends, status

from models.review import Review
from models.analyze import AnalyzeRequest
from utils.auth import get_current_user

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
def get_reviews(current_user: dict = Depends(get_current_user)):
    user_id = None if current_user.get("role") == "admin" else current_user["_id"]
    return get_all_reviews(user_id=user_id)


# ==========================
# Search Reviews
# ==========================
@router.get("/reviews/search")
def search(q: str, current_user: dict = Depends(get_current_user)):
    user_id = None if current_user.get("role") == "admin" else current_user["_id"]
    return search_reviews(q, user_id=user_id)


# ==========================
# Filter Reviews
# ==========================
@router.get("/reviews/filter")
def filter_review(
    sentiment: Optional[str] = Query(None),
    theme: Optional[str] = Query(None),
    current_user: dict = Depends(get_current_user)
):
    user_id = None if current_user.get("role") == "admin" else current_user["_id"]
    return filter_reviews(sentiment, theme, user_id=user_id)


# ==========================
# Get Review By ID
# ==========================
@router.get("/reviews/{review_id}")
def get_review(review_id: str, current_user: dict = Depends(get_current_user)):
    review = get_review_by_id(review_id)
    if not review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )

    # Ownership validation
    if current_user.get("role") != "admin" and review.get("userId") != current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not own this review"
        )

    return review


# ==========================
# Create Review
# ==========================
@router.post("/reviews", status_code=201)
def add_review(review: Review, current_user: dict = Depends(get_current_user)):
    review_data = {
        "review": review.review,
        "userId": current_user["_id"]
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
def edit_review(review_id: str, review: Review, current_user: dict = Depends(get_current_user)):
    db_review = get_review_by_id(review_id)
    if not db_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )

    # Ownership validation
    if current_user.get("role") != "admin" and db_review.get("userId") != current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not own this review"
        )

    updated = update_review(
        review_id,
        {
            "review": review.review
        }
    )

    if updated == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found or no changes made"
        )

    return {
        "message": "Review updated successfully"
    }


# ==========================
# Delete Review
# ==========================
@router.delete("/reviews/{review_id}", status_code=204)
def remove_review(review_id: str, current_user: dict = Depends(get_current_user)):
    db_review = get_review_by_id(review_id)
    if not db_review:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )

    # Ownership validation
    if current_user.get("role") != "admin" and db_review.get("userId") != current_user["_id"]:
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access denied: You do not own this review"
        )

    deleted = delete_review(review_id)
    if deleted == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found"
        )

    return


# ==========================
# Dashboard Statistics
# ==========================
@router.get("/dashboard")
def dashboard(current_user: dict = Depends(get_current_user)):
    user_id = None if current_user.get("role") == "admin" else current_user["_id"]
    return get_dashboard_stats(user_id=user_id)


# ==========================
# Analyze Review
# ==========================
@router.post("/analyze")
def analyze_review(data: AnalyzeRequest, current_user: dict = Depends(get_current_user)):
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
        "response": response_message,
        "userId": current_user["_id"]
    }

    review_id = save_analyzed_review(review_data)

    return {
        "message": "Review analyzed and saved successfully.",
        "id": review_id,
        "sentiment": sentiment,
        "theme": theme,
        "response": response_message
    }