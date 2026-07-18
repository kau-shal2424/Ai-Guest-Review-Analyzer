# pyrefly: ignore [missing-import]

from utils.env_loader import load_env
load_env()

from fastapi import FastAPI, Request
from fastapi.responses import JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from starlette.middleware.sessions import SessionMiddleware

from routes.reviews import router as reviews_router
from routes.auth import router as auth_router
from routes.google_auth import router as google_auth_router
from routes.admin import router as admin_router
from routes.notifications import router as notifications_router
from routes.settings import router as settings_router

import os
import logging


# Set up logging
logger = logging.getLogger("uvicorn.error")

app = FastAPI(
    title="AI Guest Review Analyzer API",
    version="1.0.0",
    description="Backend API for AI Guest Review Analyzer"
)

# Session Middleware (required for Authlib OAuth)
app.add_middleware(
    SessionMiddleware,
    secret_key=os.getenv("SECRET_KEY", "change-this-secret-key")
)

# CORS Configuration
frontend_url = os.getenv("FRONTEND_URL", "http://localhost:5173")
origins = [origin.strip() for origin in frontend_url.split(",")]
# Ensure production Render URL is always allowed
render_url = "https://ai-guest-review-analyzer-frontend.onrender.com"
if render_url not in origins:
    origins.append(render_url)
if f"{render_url}/" not in origins:
    origins.append(f"{render_url}/")

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global Exception Handler to ensure CORS headers are returned on unhandled 500 errors
@app.exception_handler(Exception)
async def global_exception_handler(request: Request, exc: Exception):
    logger.error(f"Unhandled exception occurred: {exc}", exc_info=True)
    
    # Manually add CORS headers to error response because global exception handlers
    # run outside CORSMiddleware in Starlette/FastAPI's outermost layer.
    origin = request.headers.get("origin")
    headers = {}
    if origin:
        if origin in origins or "*" in origins:
            headers["Access-Control-Allow-Origin"] = origin
            headers["Access-Control-Allow-Credentials"] = "true"
            headers["Access-Control-Allow-Methods"] = "DELETE, GET, HEAD, OPTIONS, PATCH, POST, PUT"
            headers["Access-Control-Allow-Headers"] = "*"
            
    return JSONResponse(
        status_code=500,
        content={
            "detail": "Internal Server Error",
            "message": str(exc)
        },
        headers=headers
    )

# Root Endpoint
@app.get("/")
def home():
    return {
        "message": "AI Guest Review Analyzer API is running 🚀"
    }

# Register API Routes
app.include_router(reviews_router)
app.include_router(auth_router)
app.include_router(google_auth_router)
app.include_router(admin_router)
app.include_router(notifications_router)
app.include_router(settings_router)
