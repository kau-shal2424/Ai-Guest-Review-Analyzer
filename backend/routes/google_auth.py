import os
from datetime import timedelta
import logging

from fastapi import APIRouter, Request
from fastapi.responses import RedirectResponse
from authlib.integrations.starlette_client import OAuth

from utils.env_loader import load_env
from services.auth_service import get_user_by_email, register_user
from utils.auth import create_access_token

load_env()

router = APIRouter(prefix="/api/auth", tags=["Google OAuth"])

logger = logging.getLogger("uvicorn.error")

# ==========================
# OAuth Configuration
# ==========================
GOOGLE_CLIENT_ID = os.getenv("GOOGLE_CLIENT_ID")
GOOGLE_CLIENT_SECRET = os.getenv("GOOGLE_CLIENT_SECRET")
FRONTEND_URL = os.getenv("FRONTEND_URL", "http://localhost:5173")

# Diagnostic logging for Google OAuth config verification
if not GOOGLE_CLIENT_ID:
    logger.warning("GOOGLE_CLIENT_ID is not configured in .env!")
else:
    masked_id = GOOGLE_CLIENT_ID[:15] + "..." if len(GOOGLE_CLIENT_ID) > 15 else GOOGLE_CLIENT_ID
    logger.info(f"Google OAuth: loaded client ID: {masked_id} (len={len(GOOGLE_CLIENT_ID)})")

if not GOOGLE_CLIENT_SECRET:
    logger.warning("GOOGLE_CLIENT_SECRET is not configured in .env!")
else:
    if GOOGLE_CLIENT_SECRET.startswith("GOCSPX-"):
        masked_secret = "GOCSPX-******" + GOOGLE_CLIENT_SECRET[-4:]
    else:
        masked_secret = GOOGLE_CLIENT_SECRET[:4] + "******" + GOOGLE_CLIENT_SECRET[-4:]
    logger.info(f"Google OAuth: loaded client secret: {masked_secret} (len={len(GOOGLE_CLIENT_SECRET)})")

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
    redirect_uri = os.getenv("GOOGLE_REDIRECT_URI")
    if not redirect_uri:
        redirect_uri = str(request.url_for("google_callback"))
        
        # Behind reverse proxies (like Render), request.url_for might incorrectly use 'http' instead of 'https'.
        # We can fix this by checking if the request was forwarded as https.
        if request.headers.get("x-forwarded-proto") == "https":
            redirect_uri = redirect_uri.replace("http://", "https://")
            
    return await oauth.google.authorize_redirect(request, redirect_uri)



# ==========================
# Google Callback (Handle response from Google)
# ==========================
@router.get("/google/callback")
async def google_callback(request: Request):
    """
    Handle the OAuth callback from Google.

    Steps:
    1. Check for authorization errors (e.g. user cancelled)
    2. Exchange authorization code for tokens
    3. Extract user info from Google
    4. Create or find user in MongoDB
    5. Generate JWT access token
    6. Redirect to frontend with token
    """
    # Handle google authentication errors (like user clicked cancel)
    error_param = request.query_params.get("error")
    if error_param:
        import logging
        logging.getLogger("uvicorn.error").warning(f"Google auth error returned: {error_param}")
        return RedirectResponse(f"{FRONTEND_URL}/login?error={error_param}")

    try:
        token = await oauth.google.authorize_access_token(request)
        user_info = token.get("userinfo")
    except Exception as e:
        import logging
        logging.getLogger("uvicorn.error").error(f"Google authorization token exchange failed: {e}", exc_info=True)
        return RedirectResponse(f"{FRONTEND_URL}/login?error=auth_cancelled_or_failed")

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
