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
    Includes user breakdown, review metrics, sentiment %, time-based counts, and reviews over time data.
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
    ai_analyses = reviews_collection.count_documents({"response": {"$exists": True, "$ne": ""}})

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

    # Reviews Over Time Aggregations (Daily, Weekly, Monthly)
    daily_trend = []
    for i in range(6, -1, -1):
        d_start = (_start_of_day(now) - timedelta(days=i)).isoformat()
        d_end = (_start_of_day(now) - timedelta(days=i-1)).isoformat() if i > 0 else now.isoformat()
        c = reviews_collection.count_documents({"createdAt": {"$gte": d_start, "$lt": d_end}})
        d_label = (_start_of_day(now) - timedelta(days=i)).strftime("%b %d")
        daily_trend.append({"period": d_label, "count": c})

    weekly_trend = []
    for w in range(3, -1, -1):
        w_start = (_start_of_day(now) - timedelta(days=(w+1)*7)).isoformat()
        w_end = (_start_of_day(now) - timedelta(days=w*7)).isoformat()
        c = reviews_collection.count_documents({"createdAt": {"$gte": w_start, "$lt": w_end}})
        w_label = f"W{4-w}"
        weekly_trend.append({"period": w_label, "count": c})

    monthly_trend = []
    for m in range(5, -1, -1):
        m_start = (_start_of_day(now) - timedelta(days=(m+1)*30)).isoformat()
        m_end = (_start_of_day(now) - timedelta(days=m*30)).isoformat()
        c = reviews_collection.count_documents({"createdAt": {"$gte": m_start, "$lt": m_end}})
        m_label = (_start_of_day(now) - timedelta(days=m*30)).strftime("%b")
        monthly_trend.append({"period": m_label, "count": c})

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
            "aiAnalyses": ai_analyses,
            "todayReviews": today_reviews,
            "weeklyReviews": weekly_reviews,
            "monthlyReviews": monthly_reviews,
        },
        "recentSignups": recent_signups,
        "reviewsOverTime": {
            "daily": daily_trend,
            "weekly": weekly_trend,
            "monthly": monthly_trend,
        }
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
    Retrieve paginated list of users with role='user', supporting search across fullName, email, and authProvider.
    """
    query = {"role": "user"}
    if search:
        query["$or"] = [
            {"fullName": {"$regex": search, "$options": "i"}},
            {"email": {"$regex": search, "$options": "i"}},
            {"authProvider": {"$regex": search, "$options": "i"}},
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
        })

    return {
        "users": users,
        "total": total,
        "page": page,
        "limit": limit,
        "totalPages": (total + limit - 1) // limit,
    }


# ==========================
# Update User Active Status
# ==========================
@router.put("/users/{user_id}", dependencies=[Depends(get_current_admin)])
def update_user_status(user_id: str, data: dict):
    """
    Update a user's isActive status or profile fields.
    """
    update_data = {}

    if "isActive" in data:
        update_data["isActive"] = bool(data["isActive"])

    if "fullName" in data and data["fullName"]:
        update_data["fullName"] = data["fullName"].strip()

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
# Get All Reviews (Admin) with User Info & Property Metadata
# ==========================
@router.get("/reviews", dependencies=[Depends(get_current_admin)])
def get_all_reviews_admin(
    search: Optional[str] = Query(None),
    sentiment: Optional[str] = Query(None),
    page: int = Query(1, ge=1),
    limit: int = Query(10, ge=1, le=100),
):
    """
    Get all reviews system-wide with full user information, property metadata, rating, and AI confidence score.
    """
    query = {}
    if sentiment:
        query["sentiment"] = sentiment

    skip = (page - 1) * limit

    # Enhanced search across review text, theme, sentiment, or user email/fullName
    if search:
        # First find matching user IDs
        matching_users = list(users_collection.find({
            "$or": [
                {"fullName": {"$regex": search, "$options": "i"}},
                {"email": {"$regex": search, "$options": "i"}}
            ]
        }, {"_id": 1}))
        matching_uids = [str(u["_id"]) for u in matching_users]

        query["$or"] = [
            {"review": {"$regex": search, "$options": "i"}},
            {"theme": {"$regex": search, "$options": "i"}},
            {"sentiment": {"$regex": search, "$options": "i"}},
            {"hotel": {"$regex": search, "$options": "i"}},
            {"userId": {"$in": matching_uids}},
        ]

    total = reviews_collection.count_documents(query)
    reviews_raw = list(reviews_collection.find(query).skip(skip).limit(limit).sort("createdAt", -1))

    reviews = []
    for r in reviews_raw:
        rid = str(r["_id"])
        r["_id"] = rid

        # Metadata defaults if not present
        r["hotel"] = r.get("hotel", "Grand Palm Resort & Spa")
        r["rating"] = r.get("rating", 4.5 if r.get("sentiment") == "Positive" else 3.0 if r.get("sentiment") == "Neutral" else 1.5)
        r["aiConfidence"] = r.get("aiConfidence", 98.5 if r.get("response") else 95.0)

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
    themes = {item["_id"] or "General": item["count"] for item in theme_distribution}

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

    # --- Most active users (Top Contributors) ---
    active_users_pipeline = [
        {"$match": date_filter},
        {"$group": {"_id": "$userId", "reviewCount": {"$sum": 1}}},
        {"$sort": {"reviewCount": -1}},
        {"$limit": 10}
    ]
    top_users_raw = list(reviews_collection.aggregate(active_users_pipeline))
    top_users = []
    for tu in top_users_raw:
        if tu["_id"]:
            try:
                u = users_collection.find_one({"_id": ObjectId(tu["_id"])}, {"fullName": 1, "email": 1, "authProvider": 1})
                if u:
                    top_users.append({
                        "userId": tu["_id"],
                        "fullName": u.get("fullName", "Unknown"),
                        "email": u.get("email", ""),
                        "provider": u.get("authProvider", "local"),
                        "reviewCount": tu["reviewCount"]
                    })
            except Exception:
                pass

    # AI analytics
    total_ai_responses = reviews_collection.count_documents({**date_filter, "response": {"$exists": True, "$ne": ""}})
    ai_success_pct = round((total_ai_responses / total_reviews * 100), 1) if total_reviews > 0 else 100.0

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


# ==========================
# Full Export Data (CSV & PDF)
# ==========================
@router.get("/export-data", dependencies=[Depends(get_current_admin)])
def get_export_data():
    """
    Retrieve complete business datasets for CSV & PDF exports.
    Includes comprehensive user dataset, full reviews dataset with property metadata, top contributors, and business summary.
    """
    now = _now_utc()
    today_start = _start_of_day(now).isoformat()
    week_start = (_start_of_day(now) - timedelta(days=7)).isoformat()

    # 1. Users Dataset
    users_raw = list(users_collection.find({"role": "user"}, {"password": 0}).sort("createdAt", -1))
    users_data = []
    total_reviews = reviews_collection.count_documents({})
    
    for u in users_raw:
        uid = str(u["_id"])
        user_reviews = list(reviews_collection.find({"userId": uid}))
        r_count = len(user_reviews)
        ai_count = sum(1 for r in user_reviews if r.get("response"))
        pos_c = sum(1 for r in user_reviews if r.get("sentiment") == "Positive")
        neu_c = sum(1 for r in user_reviews if r.get("sentiment") == "Neutral")
        neg_c = sum(1 for r in user_reviews if r.get("sentiment") == "Negative")

        last_rev = ""
        if user_reviews:
            sorted_revs = sorted(user_reviews, key=lambda x: x.get("createdAt", ""), reverse=True)
            last_rev = sorted_revs[0].get("createdAt", "")

        # Only compute averages for users who actually have reviews
        if r_count > 0:
            avg_sent_val = "Positive" if pos_c >= neu_c and pos_c >= neg_c else "Neutral" if neu_c >= neg_c else "Negative"
            confidences = [r.get("confidence") for r in user_reviews if r.get("confidence") is not None]
            avg_conf = f"{round(sum(confidences) / len(confidences), 1)}%" if confidences else "N/A"
        else:
            avg_sent_val = ""
            avg_conf = ""

        users_data.append({
            "id": uid,
            "fullName": u.get("fullName", "Unknown"),
            "email": u.get("email", ""),
            "authProvider": u.get("authProvider", "local"),
            "role": u.get("role", "user"),
            "status": "Active" if u.get("isActive", True) else "Suspended",
            "emailVerified": True,
            "createdAt": u.get("createdAt", ""),
            "lastLogin": u.get("updatedAt", "") or "",
            "reviewsSubmitted": r_count,
            "aiAnalysesCount": ai_count,
            "positiveReviews": pos_c,
            "neutralReviews": neu_c,
            "negativeReviews": neg_c,
            "averageSentiment": avg_sent_val,
            "averageAiConfidence": avg_conf,
            "lastReviewDate": last_rev,
        })

    # 2. Reviews Dataset
    reviews_raw = list(reviews_collection.find({}).sort("createdAt", -1))
    reviews_data = []
    for r in reviews_raw:
        rid = str(r["_id"])
        u_info = {}
        if r.get("userId"):
            try:
                user_doc = users_collection.find_one({"_id": ObjectId(r["userId"])})
                if user_doc:
                    u_info = {
                        "name": user_doc.get("fullName", "Unknown"),
                        "email": user_doc.get("email", "")
                    }
            except Exception:
                pass
                
        # Use detected_rating from AI analysis if present, else leave blank
        detected_rating = r.get("detected_rating")
        reviews_data.append({
            "id": rid,
            "userName": u_info.get("name", ""),
            "userEmail": u_info.get("email", ""),
            "detectedRating": detected_rating if detected_rating is not None else "",
            "review": r.get("review", ""),
            "sentiment": r.get("sentiment", ""),
            "theme": r.get("theme", ""),
            "confidence": f"{r.get('confidence')}%" if r.get("confidence") is not None else "",
            "response": r.get("response", ""),
            "createdAt": r.get("createdAt", ""),
            "updatedAt": r.get("updatedAt", "")
        })

    # 3. Summary Metrics
    active_u = users_collection.count_documents({"role": "user", "isActive": True})
    suspended_u = users_collection.count_documents({"role": "user", "isActive": False})
    pos_r = reviews_collection.count_documents({"sentiment": "Positive"})
    neu_r = reviews_collection.count_documents({"sentiment": "Neutral"})
    neg_r = reviews_collection.count_documents({"sentiment": "Negative"})
    today_r = reviews_collection.count_documents({"createdAt": {"$gte": today_start}})
    weekly_r = reviews_collection.count_documents({"createdAt": {"$gte": week_start}})
    
    # Top theme
    theme_pipeline = [
        {"$group": {"_id": "$theme", "count": {"$sum": 1}}},
        {"$sort": {"count": -1}},
        {"$limit": 1}
    ]
    top_theme_res = list(reviews_collection.aggregate(theme_pipeline))
    top_theme = top_theme_res[0]["_id"] if top_theme_res and top_theme_res[0]["_id"] else "Experience"

    user_count = len(users_data)
    avg_reviews = round(total_reviews / user_count, 1) if user_count > 0 else 0

    # Top contributors list (ranked users)
    top_contributors = sorted(users_data, key=lambda x: x["reviewsSubmitted"], reverse=True)[:10]

    # Compute real average confidence from all reviews that have a confidence score
    all_confidences = list(reviews_collection.find(
        {"confidence": {"$exists": True, "$ne": None}},
        {"confidence": 1, "_id": 0}
    ))
    avg_confidence_val = ""
    if all_confidences:
        conf_vals = [doc["confidence"] for doc in all_confidences if isinstance(doc.get("confidence"), (int, float))]
        avg_confidence_val = f"{round(sum(conf_vals) / len(conf_vals), 1)}%" if conf_vals else ""

    # AI response coverage: percentage of reviews that have a response
    reviews_with_response = reviews_collection.count_documents({"response": {"$exists": True, "$ne": ""}})
    ai_coverage = f"{round((reviews_with_response / total_reviews) * 100)}%" if total_reviews > 0 else ""

    summary_data = {
        "totalUsers": user_count,
        "activeUsers": active_u,
        "suspendedUsers": suspended_u,
        "newUsers": user_count,
        "totalReviews": total_reviews,
        "positiveReviews": pos_r,
        "neutralReviews": neu_r,
        "negativeReviews": neg_r,
        "todayReviews": today_r,
        "weeklyReviews": weekly_r,
        "topTheme": top_theme,
        "avgReviewsPerUser": avg_reviews,
        "aiResponseCoverage": ai_coverage,
        "avgConfidenceScore": avg_confidence_val
    }

    return {
        "users": users_data,
        "reviews": reviews_data,
        "summary": summary_data,
        "topContributors": top_contributors
    }
