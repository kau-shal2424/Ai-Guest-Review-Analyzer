from bson import ObjectId
from datetime import datetime
from database import reviews_collection


# ==========================
# Get All Reviews
# ==========================
def get_all_reviews():
    reviews = []

    for review in reviews_collection.find():
        review["_id"] = str(review["_id"])
        reviews.append(review)

    return reviews


# ==========================
# Get Review By ID
# ==========================
def get_review_by_id(review_id):
    review = reviews_collection.find_one(
        {"_id": ObjectId(review_id)}
    )

    if review:
        review["_id"] = str(review["_id"])

    return review


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
    result = reviews_collection.update_one(
        {"_id": ObjectId(review_id)},
        {"$set": data}
    )

    return result.modified_count


# ==========================
# Delete Review
# ==========================
def delete_review(review_id):
    result = reviews_collection.delete_one(
        {"_id": ObjectId(review_id)}
    )

    return result.deleted_count


# ==========================
# Search Reviews
# ==========================
def search_reviews(keyword):
    keyword = keyword.strip()

    query = {
        "review": {
            "$regex": keyword,
            "$options": "i"
        }
    }

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
def get_dashboard_stats():

    total_reviews = reviews_collection.count_documents({})

    positive_reviews = reviews_collection.count_documents(
        {"sentiment": "Positive"}
    )

    negative_reviews = reviews_collection.count_documents(
        {"sentiment": "Negative"}
    )

    neutral_reviews = reviews_collection.count_documents(
        {"sentiment": "Neutral"}
    )

    return {
        "totalReviews": total_reviews,
        "positive": positive_reviews,
        "negative": negative_reviews,
        "neutral": neutral_reviews
    }


# ==========================
# Filter Reviews
# ==========================
def filter_reviews(sentiment=None, theme=None):

    query = {}

    if sentiment:
        query["sentiment"] = sentiment

    if theme:
        query["theme"] = theme

    reviews = []

    for review in reviews_collection.find(query):
        review["_id"] = str(review["_id"])
        reviews.append(review)

    return reviews