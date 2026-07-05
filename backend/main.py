# pyrefly: ignore [missing-import]

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from routes.reviews import router as reviews_router

app = FastAPI(
    title="AI Guest Review Analyzer API",
    version="1.0.0",
    description="Backend API for AI Guest Review Analyzer"
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["https://ai-guest-review-analyzer-frontend.onrender.com/"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Root Endpoint
@app.get("/")
def home():
    return {
        "message": "AI Guest Review Analyzer API is running 🚀"
    }

# Register API Routes
app.include_router(reviews_router)
