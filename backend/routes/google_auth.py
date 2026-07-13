import os
from datetime import timedelta

from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth
from dotenv import load_dotenv

from services.auth_service import get_user_by_email, register_user
from utils.auth import create_access_token

load_dotenv(override=True)

router = APIRouter(prefix="/api/auth", tags=["Google OAuth"])


# ==========================
# OAuth Configuration
# ==========================
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

oauth = OAuth()
oauth.register(
    name="google",
    client_id=GOOGLE_CLIENT_ID,
    client_secret=GOOGLE_CLIENT_SECRET,
    server_metadata_url="https://accounts.google.com/.well-known/openid-configuration",
    client_kwargs={
        "scope": "openid email profile"
    }
)


# ==========================
# Google Login (Redirect to Google)
# ==========================
@router.get("/google/login")
async def google_login(request: Request):
    """
    Redirect the user to Google's OAuth consent screen.
    """
    redirect_uri = request.url_for("google_callback")
    return await oauth.google.authorize_redirect(request, redirect_uri)


# ==========================
# Google Callback (Handle response from Google)
# ==========================
@router.get("/google/callback")
async def google_callback(request: Request):
    """
    Handle the OAuth callback from Google.

    Steps:
    1. Exchange authorization code for tokens
    2. Extract user info from Google
    3. Create or find user in MongoDB
    4. Generate JWT access token
    5. Redirect to frontend with token
    """
    token = await oauth.google.authorize_access_token(request)
    user_info = token.get("userinfo")

    if not user_info:
        return RedirectResponse(f"{FRONTEND_URL}/login?error=google_auth_failed")

    google_email = user_info.get("email")
    google_name = user_info.get("name", "Google User")

    # Check if user already exists
    existing_user = get_user_by_email(google_email)

    if existing_user:
        user_id = existing_user["_id"]
        full_name = existing_user["fullName"]
    else:
        # Auto-register Google user (no password needed)
        user_data = {
            "fullName": google_name,
            "email": google_email,
            "password": "__google_oauth__",
            "authProvider": "google"
        }
        user_id = register_user(user_data)
        full_name = google_name

    # Generate JWT
    expires_delta = timedelta(days=7)
    access_token = create_access_token(
        data={"sub": google_email},
        expires_delta=expires_delta
    )

    # Redirect to frontend callback page with token and user info
    import urllib.parse
    import json
    user_dict = {
        "id": str(user_id),
        "fullName": full_name,
        "email": google_email
    }
    user_json = urllib.parse.quote(json.dumps(user_dict))
    redirect_url = f"{FRONTEND_URL}/auth/callback?token={access_token}&user={user_json}"

    return RedirectResponse(redirect_url)
