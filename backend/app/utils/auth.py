import os
from datetime import datetime, timedelta, timezone
from dotenv import load_dotenv

load_dotenv(override=True)

# ==========================
# Configuration
# ==========================
SECRET_KEY = os.getenv("SECRET_KEY", "change-this-secret-key")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 60


import bcrypt

# ==========================
# Password Hashing
# ==========================
def hash_password(password: str) -> str:
    """Hash a plain-text password using bcrypt."""
    salt = bcrypt.gensalt()
    hashed = bcrypt.hashpw(password.encode("utf-8"), salt)
    return hashed.decode("utf-8")


def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a plain-text password against a hashed password."""
    try:
        return bcrypt.checkpw(plain_password.encode("utf-8"), hashed_password.encode("utf-8"))
    except Exception:
        return False


from jose import jwt, JWTError, ExpiredSignatureError
from fastapi.security import OAuth2PasswordBearer
from fastapi import Depends, HTTPException, status

oauth2_scheme = OAuth2PasswordBearer(tokenUrl="/api/auth/login", auto_error=False)

# ==========================
# JWT Token Management
# ==========================
def create_access_token(data: dict, expires_delta: timedelta = None) -> str:
    """
    Create a JWT access token with an expiration time.
    Payload will include email, role, and userId.
    """
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.now(timezone.utc) + expires_delta
    else:
        # Default to 7 days
        expire = datetime.now(timezone.utc) + timedelta(days=7)
    
    to_encode.update({"exp": int(expire.timestamp())})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt


def decode_access_token(token: str) -> dict:
    """Decode and validate a JWT access token."""
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except JWTError:
        return {}


def verify_token(token: str) -> dict:
    """
    Decode and verify a JWT access token.
    Raises HTTPException (401 Unauthorized) if token is invalid or expired.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Not authenticated",
            headers={"WWW-Authenticate": "Bearer"},
        )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        return payload
    except ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token",
            headers={"WWW-Authenticate": "Bearer"},
        )


# ==========================
# FastAPI Dependency
# ==========================
def get_current_user(token: str = Depends(oauth2_scheme)) -> dict:
    """
    FastAPI dependency to extract and validate the current user
    from the Authorization header (Bearer token).
    """
    payload = verify_token(token)
    
    # We support either payload["email"] or payload["sub"]
    email: str = payload.get("email") or payload.get("sub")
    if email is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid token payload",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    # Import locally to avoid circular dependency
    from services.auth_service import get_user_by_email
    user = get_user_by_email(email)
    if user is None:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User not found or account deactivated",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    if not user.get("isActive", True):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="User account is inactive",
            headers={"WWW-Authenticate": "Bearer"},
        )
        
    return user


def get_current_admin(current_user: dict = Depends(get_current_user)) -> dict:
    """
    FastAPI dependency that enforces the current user has the 'admin' role.
    Raises HTTPException (403 Forbidden) if the user is not an admin.
    """
    role = current_user.get("role")
    if role != "admin":
        raise HTTPException(
            status_code=status.HTTP_403_FORBIDDEN,
            detail="Access forbidden: Admin role required"
        )
    return current_user
