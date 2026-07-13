from fastapi import APIRouter, Depends, HTTPException, status
from bson import ObjectId
from datetime import datetime, timezone

from models.user import UserProfileUpdate, PasswordChange, NotificationSettings, ThemeSettings
from utils.auth import get_current_user, hash_password, verify_password
from database import db

router = APIRouter(prefix="/api/settings", tags=["Settings"])

users_collection = db["users"]
reviews_collection = db["reviews"]
notifications_collection = db["notifications"]
user_settings_collection = db["user_settings"]


def _get_settings_doc(user_id: str) -> dict:
    """Get or create settings document for a user."""
    doc = user_settings_collection.find_one({"userId": user_id})
    if not doc:
        default = {
            "userId": user_id,
            "theme": "light",
            "notifications": {
                "criticalReviews": True,
                "weeklyReport": True,
                "aiSuggestions": False,
                "platformUpdates": False,
                "securityAlerts": True,
                "marketing": False,
            },
            "createdAt": datetime.now(timezone.utc).isoformat(),
            "updatedAt": datetime.now(timezone.utc).isoformat(),
        }
        user_settings_collection.insert_one(default)
        doc = user_settings_collection.find_one({"userId": user_id})
    if doc:
        doc["_id"] = str(doc["_id"])
    return doc


# ==========================
# GET Settings (profile + prefs)
# ==========================
@router.get("")
def get_settings(current_user: dict = Depends(get_current_user)):
    """
    Return the current user's profile (from users collection)
    and their settings (from user_settings collection).
    """
    user_id = current_user["_id"]
    settings_doc = _get_settings_doc(user_id)

    return {
        "profile": {
            "id": user_id,
            "fullName": current_user.get("fullName", ""),
            "email": current_user.get("email", ""),
            "phone": current_user.get("phone", ""),
            "bio": current_user.get("bio", ""),
            "role": current_user.get("role", "user"),
            "authProvider": current_user.get("authProvider", "local"),
            "isActive": current_user.get("isActive", True),
            "createdAt": current_user.get("createdAt", ""),
            "updatedAt": current_user.get("updatedAt", ""),
        },
        "theme": settings_doc.get("theme", "light"),
        "notifications": settings_doc.get("notifications", {}),
    }


# ==========================
# PUT Profile Update
# ==========================
@router.put("/profile")
def update_profile(
    data: UserProfileUpdate,
    current_user: dict = Depends(get_current_user)
):
    """
    Update the current user's profile fields: fullName, phone, bio.
    """
    update_data = {"updatedAt": datetime.utcnow().isoformat()}

    if data.fullName is not None:
        update_data["fullName"] = data.fullName.strip()
    if data.phone is not None:
        update_data["phone"] = data.phone.strip()
    if data.bio is not None:
        update_data["bio"] = data.bio.strip()

    users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": update_data}
    )

    return {"message": "Profile updated successfully"}


# ==========================
# PUT Change Password
# ==========================
@router.put("/password")
def change_password(
    data: PasswordChange,
    current_user: dict = Depends(get_current_user)
):
    """
    Change password: verify current, validate new, hash and save.
    """
    if data.newPassword != data.confirmPassword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New passwords do not match"
        )

    if len(data.newPassword) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="New password must be at least 8 characters"
        )

    # Get raw user doc (with password hash)
    raw_user = users_collection.find_one({"_id": ObjectId(current_user["_id"])})
    if not raw_user:
        raise HTTPException(status_code=404, detail="User not found")

    # Verify current password
    if not verify_password(data.currentPassword, raw_user.get("password", "")):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Current password is incorrect"
        )

    # Hash and save new password
    new_hashed = hash_password(data.newPassword)
    users_collection.update_one(
        {"_id": ObjectId(current_user["_id"])},
        {"$set": {"password": new_hashed, "updatedAt": datetime.utcnow().isoformat()}}
    )

    return {"message": "Password changed successfully"}


# ==========================
# PUT Notification Preferences
# ==========================
@router.put("/notifications")
def update_notifications(
    data: NotificationSettings,
    current_user: dict = Depends(get_current_user)
):
    """
    Save notification preference toggles to the user_settings collection.
    """
    user_id = current_user["_id"]
    _get_settings_doc(user_id)  # ensure document exists

    user_settings_collection.update_one(
        {"userId": user_id},
        {
            "$set": {
                "notifications": {
                    "criticalReviews": data.criticalReviews,
                    "weeklyReport": data.weeklyReport,
                    "aiSuggestions": data.aiSuggestions,
                    "platformUpdates": data.platformUpdates,
                    "securityAlerts": data.securityAlerts,
                    "marketing": data.marketing,
                },
                "updatedAt": datetime.utcnow().isoformat(),
            }
        }
    )

    return {"message": "Notification preferences saved"}


# ==========================
# PUT Theme Preference
# ==========================
@router.put("/theme")
def update_theme(
    data: ThemeSettings,
    current_user: dict = Depends(get_current_user)
):
    """
    Save theme preference (light/dark/system) to user_settings.
    """
    if data.theme not in ["light", "dark", "system"]:
        raise HTTPException(status_code=400, detail="Invalid theme value")

    user_id = current_user["_id"]
    _get_settings_doc(user_id)  # ensure document exists

    user_settings_collection.update_one(
        {"userId": user_id},
        {"$set": {"theme": data.theme, "updatedAt": datetime.utcnow().isoformat()}}
    )

    return {"message": "Theme preference saved"}


# ==========================
# DELETE Account
# ==========================
@router.delete("/account", status_code=204)
def delete_account(current_user: dict = Depends(get_current_user)):
    """
    Permanently delete the current user's account, their reviews,
    notifications, and settings documents.
    """
    user_id = current_user["_id"]

    users_collection.delete_one({"_id": ObjectId(user_id)})
    reviews_collection.delete_many({"userId": user_id})
    notifications_collection.delete_many({"userId": user_id})
    user_settings_collection.delete_many({"userId": user_id})

    return
