from database import db
from utils.auth import hash_password
from bson import ObjectId
from datetime import datetime

# ==========================
# Users Collection
# ==========================
users_collection = db["users"]


# ==========================
# Register New User
# ==========================
def register_user(user_data: dict, role: str = "user") -> str:
    """
    Register a new user in the database.

    Steps:
    1. Hash the password.
    2. Normalize email.
    3. Add metadata/default fields.
    4. Insert user document into MongoDB.
    5. Return the new user's ID.
    """
    user_data["password"] = hash_password(user_data["password"])
    if "email" in user_data:
        user_data["email"] = user_data["email"].lower().strip()
    
    # Set default values if not already present
    user_data.setdefault("role", role)
    user_data.setdefault("authProvider", "local")
    user_data.setdefault("profileImage", "")
    user_data.setdefault("isActive", True)
    
    now_str = datetime.utcnow().isoformat()
    user_data["createdAt"] = now_str
    user_data["updatedAt"] = now_str
    
    result = users_collection.insert_one(user_data)
    return str(result.inserted_id)


def authenticate_user(email: str, password: str) -> dict | None:
    """
    Authenticate a user by email and password.
    """
    from utils.auth import verify_password
    user = get_user_by_email(email)
    if not user:
        return None

    # Check if the account is active
    if not user.get("isActive", True):
        return None

    if not verify_password(password, user.get("password", "")):
        return None

    return user


def get_user_by_id(user_id: str) -> dict | None:
    """
    Fetch a user document by its ObjectId.
    """
    try:
        user = users_collection.find_one({"_id": ObjectId(user_id)})
        if user:
            user["_id"] = str(user["_id"])
        return user
    except Exception:
        return None


def get_user_by_email(email: str) -> dict | None:
    """
    Fetch a user document by email address.
    """
    normalized_email = email.lower().strip() if email else ""
    user = users_collection.find_one({"email": normalized_email})
    if user:
        user["_id"] = str(user["_id"])
    return user


import secrets
from datetime import timedelta

def create_password_reset_token(email: str) -> str | None:
    """
    Generate a 1-hour secure password reset token and store it in MongoDB.
    Returns the token if user exists, else None.
    """
    user = get_user_by_email(email)
    if not user:
        return None
        
    token = secrets.token_urlsafe(32)
    expires = (datetime.utcnow() + timedelta(hours=1)).isoformat()
    
    users_collection.update_one(
        {"_id": ObjectId(user["_id"])},
        {"$set": {
            "resetToken": token,
            "resetTokenExpires": expires,
            "updatedAt": datetime.utcnow().isoformat()
        }}
    )
    return token


def get_user_by_reset_token(token: str) -> dict | None:
    """
    Find user with a valid, non-expired password reset token.
    """
    if not token:
        return None
        
    user = users_collection.find_one({"resetToken": token})
    if not user:
        return None
        
    expires_str = user.get("resetTokenExpires")
    if expires_str:
        try:
            expires_dt = datetime.fromisoformat(expires_str)
            if datetime.utcnow() > expires_dt:
                return None
        except Exception:
            return None
            
    user["_id"] = str(user["_id"])
    return user


def reset_user_password(token: str, new_password: str) -> bool:
    """
    Reset user's password using reset token.
    """
    user = get_user_by_reset_token(token)
    if not user:
        return False
        
    hashed = hash_password(new_password)
    users_collection.update_one(
        {"_id": ObjectId(user["_id"])},
        {
            "$set": {
                "password": hashed,
                "updatedAt": datetime.utcnow().isoformat()
            },
            "$unset": {
                "resetToken": "",
                "resetTokenExpires": ""
            }
        }
    )
    return True
