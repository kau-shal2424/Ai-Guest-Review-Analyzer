from typing import Optional
from fastapi import APIRouter, HTTPException, Query, Depends, status
import logging
from datetime import datetime

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
from services.gemini_service import analyze_with_gemini

logger = logging.getLogger("uvicorn.error")


def perform_analysis(review_text: str) -> dict:
    """
    Analyzes review text using Gemini AI with fallback to keyword matching.
    """
    ai_powered = False
    try:
        gemini_result = analyze_with_gemini(review_text)
        sentiment = gemini_result["sentiment"]
        theme = gemini_result["theme"]
        response_message = gemini_result["response"]
        ai_powered = True
        logger.info("Review analyzed using Google Gemini AI.")
        return {
            "sentiment": sentiment,
            "theme": theme,
            "response": response_message,
            "aiPowered": ai_powered,
            "overall_score": gemini_result.get("overall_score", 75),
            "confidence": gemini_result.get("confidence", 80),
            "emotion": gemini_result.get("emotion", "Neutral"),
            "detected_rating": gemini_result.get("detected_rating", 3),
            "summary": gemini_result.get("summary", ""),
            "pros": gemini_result.get("pros", []),
            "cons": gemini_result.get("cons", []),
            "pain_points": gemini_result.get("pain_points", []),
            "business_impact": gemini_result.get("business_impact", ""),
            "priority_level": gemini_result.get("priority_level", "Medium"),
            "expectations": gemini_result.get("expectations", []),
            "action_items": gemini_result.get("action_items", []),
            "keywords": gemini_result.get("keywords", []),
            "departments": gemini_result.get("departments", []),
            "reply": gemini_result.get("reply", response_message)
        }
    except Exception as gemini_error:
        logger.warning(f"Gemini AI unavailable, using keyword fallback. Reason: {gemini_error}")

        lower_text = review_text.lower()

        # Detect Theme
        theme = "Experience"
        if "clean" in lower_text:
            theme = "Cleanliness"
        elif "food" in lower_text:
            theme = "Food"
        elif "host" in lower_text:
            theme = "Host"
        elif "location" in lower_text:
            theme = "Location"

        # Detect Sentiment
        sentiment = "Neutral"
        if any(word in lower_text for word in ["good", "excellent", "great", "clean", "friendly"]):
            sentiment = "Positive"
        elif any(word in lower_text for word in ["bad", "poor", "dirty", "worst"]):
            sentiment = "Negative"

        response_message = "Thank you for your valuable feedback."

        overall_score = 75 if sentiment == "Neutral" else (92 if sentiment == "Positive" else 34)
        priority_level = "Medium" if sentiment == "Neutral" else ("Low" if sentiment == "Positive" else "High")
        emotion = "Neutral" if sentiment == "Neutral" else ("Appreciative" if sentiment == "Positive" else "Frustrated")
        detected_rating = 3 if sentiment == "Neutral" else (5 if sentiment == "Positive" else 1)

        return {
            "sentiment": sentiment,
            "theme": theme,
            "response": response_message,
            "aiPowered": ai_powered,
            "overall_score": overall_score,
            "confidence": 60,
            "emotion": emotion,
            "detected_rating": detected_rating,
            "summary": "Processed via local keyword analysis.",
            "pros": ["The room was clean and well-maintained."] if theme == "Cleanliness" else ["Good experience."],
            "cons": [],
            "pain_points": ["N/A"],
            "business_impact": "Neutral brand impact.",
            "priority_level": priority_level,
            "expectations": ["Expected a clean and comfortable lodging experience."],
            "action_items": ["Continue checking cleanliness standard levels regularly."],
            "keywords": [theme.lower()],
            "departments": [theme],
            "reply": response_message
        }

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
    analysis = perform_analysis(review.review)
    review_data = {
        "review": review.review,
        "sentiment": analysis["sentiment"],
        "theme": analysis["theme"],
        "response": analysis["response"],
        "userId": current_user["_id"],
        "aiPowered": analysis["aiPowered"],
        "overall_score": analysis.get("overall_score"),
        "confidence": analysis.get("confidence"),
        "emotion": analysis.get("emotion"),
        "detected_rating": analysis.get("detected_rating"),
        "summary": analysis.get("summary"),
        "pros": analysis.get("pros"),
        "cons": analysis.get("cons"),
        "pain_points": analysis.get("pain_points"),
        "business_impact": analysis.get("business_impact"),
        "priority_level": analysis.get("priority_level"),
        "expectations": analysis.get("expectations"),
        "action_items": analysis.get("action_items"),
        "keywords": analysis.get("keywords"),
        "departments": analysis.get("departments"),
        "reply": analysis.get("reply"),
    }
    review_id = save_analyzed_review(review_data)
    return {
        "message": "Review created successfully",
        "id": review_id,
        **analysis
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

    analysis = perform_analysis(review.review)
    
    updated_data = {
        "review": review.review,
        "sentiment": analysis["sentiment"],
        "theme": analysis["theme"],
        "response": analysis["response"],
        "aiPowered": analysis["aiPowered"],
        "overall_score": analysis.get("overall_score"),
        "confidence": analysis.get("confidence"),
        "emotion": analysis.get("emotion"),
        "detected_rating": analysis.get("detected_rating"),
        "summary": analysis.get("summary"),
        "pros": analysis.get("pros"),
        "cons": analysis.get("cons"),
        "pain_points": analysis.get("pain_points"),
        "business_impact": analysis.get("business_impact"),
        "priority_level": analysis.get("priority_level"),
        "expectations": analysis.get("expectations"),
        "action_items": analysis.get("action_items"),
        "keywords": analysis.get("keywords"),
        "departments": analysis.get("departments"),
        "reply": analysis.get("reply"),
        "updatedAt": datetime.utcnow().isoformat()
    }

    updated = update_review(review_id, updated_data)

    if updated == 0:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail="Review not found or no changes made"
        )

    # Fetch and return the fully updated review document (with _id matching the original)
    # so that the frontend's onUpdate handler receives the updated state with the _id.
    updated_review = get_review_by_id(review_id)
    return updated_review


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
    analysis = perform_analysis(data.review)
    
    review_data = {
        "review": data.review,
        "sentiment": analysis["sentiment"],
        "theme": analysis["theme"],
        "response": analysis["response"],
        "userId": current_user["_id"],
        "aiPowered": analysis["aiPowered"],
        "overall_score": analysis.get("overall_score"),
        "confidence": analysis.get("confidence"),
        "emotion": analysis.get("emotion"),
        "detected_rating": analysis.get("detected_rating"),
        "summary": analysis.get("summary"),
        "pros": analysis.get("pros"),
        "cons": analysis.get("cons"),
        "pain_points": analysis.get("pain_points"),
        "business_impact": analysis.get("business_impact"),
        "priority_level": analysis.get("priority_level"),
        "expectations": analysis.get("expectations"),
        "action_items": analysis.get("action_items"),
        "keywords": analysis.get("keywords"),
        "departments": analysis.get("departments"),
        "reply": analysis.get("reply"),
    }

    review_id = save_analyzed_review(review_data)

    return {
        "message": "Review analyzed and saved successfully.",
        "id": review_id,
        **analysis
    }