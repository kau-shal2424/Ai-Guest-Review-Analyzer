from bson import ObjectId
from datetime import datetime
from database import reviews_collection


# ==========================
# Get All Reviews
# ==========================
def get_all_reviews(user_id: str = None):
    reviews = []
    query = {"userId": user_id} if user_id else {}

    for review in reviews_collection.find(query):
        review["_id"] = str(review["_id"])
        reviews.append(review)

    return reviews


# ==========================
# Get Review By ID
# ==========================
def get_review_by_id(review_id):
    try:
        review = reviews_collection.find_one(
            {"_id": ObjectId(review_id)}
        )
        if review:
            review["_id"] = str(review["_id"])
        return review
    except Exception:
        return None


# ==========================
# Create Review
# ==========================
def create_review(data):
    result = reviews_collection.insert_one(data)
    return str(result.inserted_id)


# ==========================
# Update Review
# ==========================
def update_review(review_id, data):
    try:
        result = reviews_collection.update_one(
            {"_id": ObjectId(review_id)},
            {"$set": data}
        )
        return result.modified_count
    except Exception:
        return 0


# ==========================
# Delete Review
# ==========================
def delete_review(review_id):
    try:
        result = reviews_collection.delete_one(
            {"_id": ObjectId(review_id)}
        )
        return result.deleted_count
    except Exception:
        return 0


# ==========================
# Search Reviews
# ==========================
def search_reviews(keyword, user_id: str = None):
    keyword = keyword.strip()

    query = {
        "review": {
            "$regex": keyword,
            "$options": "i"
        }
    }
    if user_id:
        query["userId"] = user_id

    reviews = []

    for review in reviews_collection.find(query):
        review["_id"] = str(review["_id"])
        reviews.append(review)

    return reviews


# ==========================
# Save Analyzed Review
# ==========================
def save_analyzed_review(data):
    data["createdAt"] = datetime.utcnow().isoformat()
    result = reviews_collection.insert_one(data)
    return str(result.inserted_id)


# ==========================
# Dashboard Statistics
# ==========================
def get_dashboard_stats(user_id: str = None):
    query = {"userId": user_id} if user_id else {}

    total_reviews = reviews_collection.count_documents(query)

    pos_query = {"sentiment": "Positive"}
    neg_query = {"sentiment": "Negative"}
    neu_query = {"sentiment": "Neutral"}

    if user_id:
        pos_query["userId"] = user_id
        neg_query["userId"] = user_id
        neu_query["userId"] = user_id

    positive_reviews = reviews_collection.count_documents(pos_query)
    negative_reviews = reviews_collection.count_documents(neg_query)
    neutral_reviews = reviews_collection.count_documents(neu_query)

    return {
        "totalReviews": total_reviews,
        "positive": positive_reviews,
        "negative": negative_reviews,
        "neutral": neutral_reviews
    }


# ==========================
# Filter Reviews
# ==========================
def filter_reviews(sentiment=None, theme=None, user_id: str = None):
    query = {}

    if sentiment:
        query["sentiment"] = sentiment

    if theme:
        query["theme"] = theme

    if user_id:
        query["userId"] = user_id

    reviews = []

    for review in reviews_collection.find(query):
        review["_id"] = str(review["_id"])
        reviews.append(review)

    return reviews