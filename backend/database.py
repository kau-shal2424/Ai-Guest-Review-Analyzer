import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv()

# Get MongoDB URI
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not found in .env")

# Create MongoDB client
client = MongoClient(MONGO_URI)

# Select database
db = client["ai_guest_review_db"]

# Select collection
reviews_collection = db["reviews"]