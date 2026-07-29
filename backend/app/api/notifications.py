from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone

from utils.auth import get_current_user
from database import db

router = APIRouter(prefix="/api/notifications", tags=["Notifications"])

notifications_collection = db["notifications"]


def _serialize(n: dict) -> dict:
    n["_id"] = str(n["_id"])
    return n


# ==========================
# Get User Notifications
# ==========================
@router.get("")
def get_notifications(current_user: dict = Depends(get_current_user)):
    """
    Get the current user's 20 most recent notifications.
    """
    user_id = current_user["_id"]
    docs = list(
        notifications_collection.find({"userId": user_id})
        .sort("createdAt", -1)
        .limit(20)
    )
    return [_serialize(n) for n in docs]


# ==========================
# Get Unread Count
# ==========================
@router.get("/count")
def get_unread_count(current_user: dict = Depends(get_current_user)):
    """
    Return number of unread notifications for the current user.
    """
    user_id = current_user["_id"]
    count = notifications_collection.count_documents({"userId": user_id, "read": False})
    return {"count": count}


# ==========================
# Mark One as Read
# ==========================
@router.put("/{notification_id}/read")
def mark_notification_read(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Mark a single notification as read.
    """
    try:
        result = notifications_collection.update_one(
            {"_id": ObjectId(notification_id), "userId": current_user["_id"]},
            {"$set": {"read": True}}
        )
        if result.matched_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        return {"message": "Marked as read"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==========================
# Mark All as Read
# ==========================
@router.put("/read-all")
def mark_all_read(current_user: dict = Depends(get_current_user)):
    """
    Mark all of the current user's notifications as read.
    """
    notifications_collection.update_many(
        {"userId": current_user["_id"], "read": False},
        {"$set": {"read": True}}
    )
    return {"message": "All notifications marked as read"}


# ==========================
# Delete Notification
# ==========================
@router.delete("/{notification_id}", status_code=204)
def delete_notification(
    notification_id: str,
    current_user: dict = Depends(get_current_user)
):
    """
    Delete a notification by ID.
    """
    try:
        result = notifications_collection.delete_one(
            {"_id": ObjectId(notification_id), "userId": current_user["_id"]}
        )
        if result.deleted_count == 0:
            raise HTTPException(status_code=404, detail="Notification not found")
        return
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))


# ==========================
# Create Notification (Internal helper — not exposed publicly)
# Called by other services to insert a notification
# ==========================
def create_notification(user_id: str, title: str, message: str, type: str = "info"):
    """
    Internal function to create a notification for a user.
    type: 'info', 'success', 'warning', 'error', 'review', 'admin'
    """
    notifications_collection.insert_one({
        "userId": user_id,
        "title": title,
        "message": message,
        "type": type,
        "read": False,
        "createdAt": datetime.now(timezone.utc).isoformat()
    })
