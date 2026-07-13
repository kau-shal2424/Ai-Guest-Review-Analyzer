from fastapi import APIRouter, HTTPException, Depends, status
from datetime import datetime, timedelta

from models.user import UserCreate, UserLogin, UserResponse, TokenResponse
from services.auth_service import register_user, get_user_by_email, authenticate_user
from utils.auth import create_access_token, get_current_user
from utils.rate_limit import check_login_rate_limit

router = APIRouter(prefix="/api/auth", tags=["Authentication"])


# ==========================
# Register / Signup
# ==========================
@router.post("/register", status_code=201)
def register(user: UserCreate):
    """
    Register a new user.

    Steps:
    1. Validate input via UserCreate model.
    2. Check if password and confirmPassword match.
    3. Check if password is at least 8 characters.
    4. Check if email already exists.
    5. Call auth_service.register_user() to hash and save.
    6. Return success message and user details.
    """
    if user.password != user.confirmPassword:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Passwords do not match"
        )

    if len(user.password) < 8:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Password must be at least 8 characters long"
        )

    existing_user = get_user_by_email(user.email)
    if existing_user:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Email already registered"
        )

    role = user.role.lower().strip()
    if role not in ["user", "admin"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Role must be either 'user' or 'admin'"
        )

    user_data = {
        "fullName": user.fullName.strip(),
        "email": user.email.lower().strip(),
        "password": user.password
    }

    user_id = register_user(user_data, role=role)

    # Fetch the newly registered user to get full details
    from services.auth_service import get_user_by_id
    db_user = get_user_by_id(user_id)

    return {
        "message": "User registered successfully",
        "user": {
            "id": user_id,
            "fullName": db_user["fullName"],
            "email": db_user["email"],
            "role": db_user["role"],
            "authProvider": db_user["authProvider"],
            "profileImage": db_user.get("profileImage", ""),
            "isActive": db_user.get("isActive", True),
            "createdAt": db_user.get("createdAt"),
            "updatedAt": db_user.get("updatedAt")
        }
    }


# ==========================
# Login
# ==========================
@router.post("/login", response_model=TokenResponse, dependencies=[Depends(check_login_rate_limit)])
def login(user: UserLogin):
    """
    Authenticate user, generate access token, and return response.
    """
    db_user = authenticate_user(user.email, user.password)
    if not db_user:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid email or password"
        )

    if not db_user.get("isActive", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive"
        )

    # Generate JWT access token with 7 days expiration
    expires_delta = timedelta(days=7)
    
    # Payload: email, role, userId
    token_payload = {
        "email": db_user["email"],
        "role": db_user["role"],
        "userId": db_user["_id"]
    }
    
    access_token = create_access_token(
        data=token_payload,
        expires_delta=expires_delta
    )

    response_user = {
        "id": db_user["_id"],
        "fullName": db_user["fullName"],
        "email": db_user["email"],
        "role": db_user["role"],
        "authProvider": db_user["authProvider"],
        "profileImage": db_user.get("profileImage", ""),
        "isActive": db_user.get("isActive", True),
        "createdAt": db_user.get("createdAt"),
        "updatedAt": db_user.get("updatedAt")
    }

    return {
        "access_token": access_token,
        "token_type": "bearer",
        "user": response_user
    }


# ==========================
# Get Current User Profile
# ==========================
@router.get("/me", response_model=UserResponse)
def get_me(current_user: dict = Depends(get_current_user)):
    """
    Return the currently authenticated user's profile.
    """
    return {
        "id": current_user["_id"],
        "fullName": current_user["fullName"],
        "email": current_user["email"],
        "role": current_user["role"],
        "authProvider": current_user["authProvider"],
        "profileImage": current_user.get("profileImage", ""),
        "isActive": current_user.get("isActive", True),
        "createdAt": current_user.get("createdAt"),
        "updatedAt": current_user.get("updatedAt")
    }
