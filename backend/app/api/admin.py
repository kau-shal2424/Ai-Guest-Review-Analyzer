from fastapi import APIRouter, Depends, HTTPException, status, Query
from bson import ObjectId
from datetime import datetime, timedelta, timezone
from typing import List, Optional

from models.user import UserResponse
from utils.auth import get_current_admin
from database import db

router = APIRouter(prefix="/api/admin", tags=["Admin Operations"])

users_collection = db["users"]
reviews_collection = db["reviews"]


def _now_utc():
    return datetime.now(timezone.utc)


def _start_of_day(dt: datetime) -> datetime:
    return dt.replace(hour=0, minute=0, second=0, microsecond=0)


# ==========================
# Admin Dashboard Statistics
# ==========================
@router.get("/dashboard", dependencies=[Depends(get_current_admin)])
def admin_dashboard_stats():
    """
    Get comprehensive system-wide dashboard stats for administrators.
    Includes user breakdown, review metrics, sentiment %, and time-based counts.
    """
    now = _now_utc()
    today_start = _start_of_day(now).isoformat()
    week_start = (_start_of_day(now) - timedelta(days=7)).isoformat()
    month_start = (_start_of_day(now) - timedelta(days=30)).isoformat()

    # User counts
    total_users = users_collection.count_documents({"role": "user"})
    total_admins = users_collection.count_documents({"role": "admin"})
    active_users = users_collection.count_documents({"role": "user", "isActive": True})
    active_admins = users_collection.count_documents({"role": "admin", "isActive": True})
    inactive_users = users_collection.count_documents({"role": "user", "isActive": False})
    inactive_admins = users_collection.count_documents({"role": "admin", "isActive": False})

    # Review counts
    total_reviews = reviews_collection.count_documents({})
    positive_reviews = reviews_collection.count_documents({"sentiment": "Positive"})
    negative_reviews = reviews_collection.count_documents({"sentiment": "Negative"})
    neutral_reviews = reviews_collection.count_documents({"sentiment": "Neutral"})

    # Time-based review counts
    today_reviews = reviews_collection.count_documents({"createdAt": {"$gte": today_start}})
    weekly_reviews = reviews_collection.count_documents({"createdAt": {"$gte": week_start}})
    monthly_reviews = reviews_collection.count_documents({"createdAt": {"$gte": month_start}})

    # Recent signups (last 5 users by createdAt desc)
    recent_signups_raw = list(
        users_collection.find({}, {"password": 0}).sort("createdAt", -1).limit(5)
    )
    recent_signups = []
    for u in recent_signups_raw:
        recent_signups.append({
            "id": str(u["_id"]),
            "fullName": u.get("fullName", ""),
            "email": u.get("email", ""),
            "role": u.get("role", "user"),
            "createdAt": u.get("createdAt", ""),
            "isActive": u.get("isActive", True),
        })

    # Sentiment percentages
    pos_pct = round((positive_reviews / total_reviews * 100), 1) if total_reviews > 0 else 0
    neg_pct = round((negative_reviews / total_reviews * 100), 1) if total_reviews > 0 else 0
    neu_pct = round((neutral_reviews / total_reviews * 100), 1) if total_reviews > 0 else 0

    return {
        "users": {
            "totalUsers": total_users,
            "totalAdmins": total_admins,
            "activeUsers": active_users,
            "activeAdmins": active_admins,
            "inactiveUsers": inactive_users,
            "inactiveAdmins": inactive_admins,
        },
        "reviews": {
            "total": total_reviews,
            "positive": positive_reviews,
            "negative": negative_reviews,
            "neutral": neutral_reviews,
            "positivePercent": pos_pct,
            "negativePercent": neg_pct,
            "neutralPercent": neu_pct,
            "todayReviews": today_reviews,
            "weeklyReviews": weekly_reviews,
            "monthlyReviews": monthly_reviews,
        },
        "recentSignups": recent_signups,
    }


# ==========================
# Get Users List (role=user only)
# ==========================
@router.get("/users", dependencies=[Depends(get_current_admin)])
def get_users(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """
    Retrieve paginated list of users with role='user', with optional search.
    Also returns reviewCount per user.
    """
    query = {"role": "user"}
    if search:
        query["$or"] = [
            {"fullName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]

    skip = (page - 1) * limit
    total = users_collection.count_documents(query)
    cursor = users_collection.find(query, {"password": 0}).skip(skip).limit(limit).sort("createdAt", -1)

    users = []
    for u in cursor:
        uid = str(u["_id"])
        review_count = reviews_collection.count_documents({"userId": uid})
        users.append({
            "id": uid,
            "fullName": u.get("fullName", ""),
            "email": u.get("email", ""),
            "role": u.get("role", "user"),
            "authProvider": u.get("authProvider", "local"),
            "profileImage": u.get("profileImage", ""),
            "isActive": u.get("isActive", True),
            "createdAt": u.get("createdAt"),
            "updatedAt": u.get("updatedAt"),
            "reviewCount": review_count,
            "phone": u.get("phone", ""),
            "bio": u.get("bio", ""),
        })

    return {
        "users": users,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit,
    }


# ==========================
# Get Admins List (role=admin only)
# ==========================
@router.get("/admins", dependencies=[Depends(get_current_admin)])
def get_admins(
    search: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """
    Retrieve paginated list of admins with role='admin', with optional search.
    """
    query = {"role": "admin"}
    if search:
        query["$or"] = [
            {"fullName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
        ]

    skip = (page - 1) * limit
    total = users_collection.count_documents(query)
    cursor = users_collection.find(query, {"password": 0}).skip(skip).limit(limit).sort("createdAt", -1)

    admins = []
    for u in cursor:
        uid = str(u["_id"])
        admins.append({
            "id": uid,
            "fullName": u.get("fullName", ""),
            "email": u.get("email", ""),
            "role": u.get("role", "admin"),
            "authProvider": u.get("authProvider", "local"),
            "profileImage": u.get("profileImage", ""),
            "isActive": u.get("isActive", True),
            "createdAt": u.get("createdAt"),
            "updatedAt": u.get("updatedAt"),
            "phone": u.get("phone", ""),
        })

    return {
        "users": admins,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit,
    }


# ==========================
# Update User Role & Active Status
# ==========================
@router.put("/users/{user_id}", dependencies=[Depends(get_current_admin)])
def update_user_status(user_id: str, data: dict):
    """
    Update a user's role, isActive status, or profile fields.
    """
    update_data = {}

    if "role" in data:
        role = data["role"]
        if role not in ["user", "admin"]:
            raise HTTPException(status_code=400, detail="Invalid role specified")
        update_data["role"] = role

    if "isActive" in data:
        update_data["isActive"] = bool(data["isActive"])

    if "fullName" in data and data["fullName"]:
        update_data["fullName"] = data["fullName"].strip()

    if "email" in data and data["email"]:
        update_data["email"] = data["email"].lower().strip()

    if not update_data:
        raise HTTPException(status_code=400, detail="No valid update fields provided")

    update_data["updatedAt"] = datetime.utcnow().isoformat()

    try:
        res = users_collection.update_one(
            {"_id": ObjectId(user_id)},
            {"$set": update_data}
        )
        if res.matched_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        return {"message": "User updated successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid user ID or database error: {str(e)}")


# ==========================
# Delete User
# ==========================
@router.delete("/users/{user_id}", status_code=204, dependencies=[Depends(get_current_admin)])
def delete_user(user_id: str):
    """
    Delete a user and their associated reviews from the system.
    """
    try:
        res = users_collection.delete_one({"_id": ObjectId(user_id)})
        if res.deleted_count == 0:
            raise HTTPException(status_code=404, detail="User not found")
        # Also delete user's reviews
        reviews_collection.delete_many({"userId": user_id})
        return
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Invalid user ID or database error: {str(e)}")


# ==========================
# Get All Reviews (Admin) with User Info
# ==========================
@router.get("/reviews", dependencies=[Depends(get_current_admin)])
def get_all_reviews_admin(
    search: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """
    Get all reviews system-wide with full user information joined.
    """
    query = {}
    if sentiment:
        query["sentiment"] = sentiment
    if search:
        query["$or"] = [
            {"review": {"$regex": search, "$options": "i"}},
            {"theme": {"$regex": search, "$options": "i"}},
        ]

    skip = (page - 1) * limit
    total = reviews_collection.count_documents(query)
    reviews_raw = list(reviews_collection.find(query).skip(skip).limit(limit).sort("createdAt", -1))

    reviews = []
    for r in reviews_raw:
        rid = str(r["_id"])
        r["_id"] = rid

        # Fetch user info
        user_info = {}
        user_review_count = 0
        if r.get("userId"):
            try:
                u = users_collection.find_one({"_id": ObjectId(r["userId"])}, {"password": 0})
                if u:
                    user_info = {
                        "fullName": u.get("fullName", "Unknown"),
                        "email": u.get("email", ""),
                        "role": u.get("role", "user"),
                        "isActive": u.get("isActive", True),
                        "profileImage": u.get("profileImage", ""),
                    }
                    user_review_count = reviews_collection.count_documents({"userId": r["userId"]})
            except Exception:
                pass

        r["userInfo"] = user_info
        r["userReviewCount"] = user_review_count
        reviews.append(r)

    return {
        "reviews": reviews,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit,
    }


# ==========================
# Admin Advanced Analytics
# ==========================
@router.get("/analytics", dependencies=[Depends(get_current_admin)])
def get_analytics(
    period: Optional[str] = Query("all", description="all, today, week, month, year")
):
    """
    Advanced metrics for administration dashboard with date filtering.
    """
    now = _now_utc()
    date_filter = {}

    if period == "today":
        start = _start_of_day(now).isoformat()
        date_filter = {"createdAt": {"$gte": start}}
    elif period == "week":
        start = (_start_of_day(now) - timedelta(days=7)).isoformat()
        date_filter = {"createdAt": {"$gte": start}}
    elif period == "month":
        start = (_start_of_day(now) - timedelta(days=30)).isoformat()
        date_filter = {"createdAt": {"$gte": start}}
    elif period == "year":
        start = (_start_of_day(now) - timedelta(days=365)).isoformat()
        date_filter = {"createdAt": {"$gte": start}}

    # --- Theme distribution ---
    pipeline_theme = [
        {"$match": date_filter},
        {"$group": {"_id": "$theme", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}}
    ]
    theme_distribution = list(reviews_collection.aggregate(pipeline_theme))
    themes = {item["_id"] or "Unknown": item["count"] for item in theme_distribution}

    # --- Sentiment distribution ---
    pipeline_sentiment = [
        {"$match": date_filter},
        {"$group": {"_id": "$sentiment", "count": {"$sum": 1}}}
    ]
    sentiment_distribution = list(reviews_collection.aggregate(pipeline_sentiment))
    sentiments = {item["_id"] or "Neutral": item["count"] for item in sentiment_distribution}

    # --- User stats ---
    total_users = users_collection.count_documents({"role": "user"})
    total_admins = users_collection.count_documents({"role": "admin"})
    active_users = users_collection.count_documents({"role": "user", "isActive": True})
    inactive_users = users_collection.count_documents({"role": "user", "isActive": False})

    # New users in period
    user_filter = {}
    if date_filter:
        user_filter = {"createdAt": date_filter.get("createdAt", {})}
    new_users = users_collection.count_documents({**user_filter, "role": "user"}) if date_filter else total_users

    # --- Review counts ---
    total_reviews = reviews_collection.count_documents(date_filter)

    # Daily reviews (last 7 days for chart)
    daily_pipeline = []
    for i in range(6, -1, -1):
        day_start = (_start_of_day(now) - timedelta(days=i)).isoformat()
        day_end = (_start_of_day(now) - timedelta(days=i-1)).isoformat() if i > 0 else now.isoformat()
        count = reviews_collection.count_documents({"createdAt": {"$gte": day_start, "$lt": day_end}})
        day_label = (_start_of_day(now) - timedelta(days=i)).strftime("%b %d")
        daily_pipeline.append({"date": day_label, "count": count})

    # --- Most active users ---
    active_users_pipeline = [
        {"$match": date_filter},
        {"$group": {"_id": "$userId", "reviewCount": {"$sum": 1}}},
        {"$sort": {"reviewCount": -1}},
        {"$limit": 5}
    ]
    top_users_raw = list(reviews_collection.aggregate(active_users_pipeline))
    top_users = []
    for tu in top_users_raw:
        if tu["_id"]:
            try:
                u = users_collection.find_one({"_id": ObjectId(tu["_id"])}, {"fullName": 1, "email": 1})
                if u:
                    top_users.append({
                        "userId": tu["_id"],
                        "fullName": u.get("fullName", "Unknown"),
                        "email": u.get("email", ""),
                        "reviewCount": tu["reviewCount"]
                    })
            except Exception:
                pass

    # AI analytics (based on reviews with response field)
    total_ai_responses = reviews_collection.count_documents({**date_filter, "response": {"$exists": True, "$ne": ""}})
    ai_success_pct = round((total_ai_responses / total_reviews * 100), 1) if total_reviews > 0 else 0

    return {
        "period": period,
        "users": {
            "total": total_users,
            "newUsers": new_users,
            "active": active_users,
            "inactive": inactive_users,
            "admins": total_admins,
        },
        "reviews": {
            "total": total_reviews,
            "daily": daily_pipeline,
        },
        "sentiments": sentiments,
        "themes": themes,
        "topUsers": top_users,
        "ai": {
            "totalResponses": total_ai_responses,
            "successPercent": ai_success_pct,
        },
        "totalUsers": total_users,
        "activeUsers": active_users,
        "totalReviews": total_reviews,
        "generatedAt": now.isoformat()
    }
