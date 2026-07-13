import os
from dotenv import load_dotenv
from pymongo import MongoClient

# Load environment variables
load_dotenv(override=True)

# Get MongoDB URI
MONGO_URI = os.getenv("MONGO_URI")

if not MONGO_URI:
    raise Exception("MONGO_URI not found in .env")

# Create MongoDB client with connection timeouts to prevent hanging
client = MongoClient(
    MONGO_URI,
    serverSelectionTimeoutMS=10000,   # 10s to find a server
    connectTimeoutMS=10000,           # 10s to establish connection
    socketTimeoutMS=20000,            # 20s for individual operations
    tls=True,
    tlsAllowInvalidCertificates=True, # Helps with SSL handshake issues in restricted networks
)

# Select database
db = client["ai_guest_review_db"]

# Select collection
reviews_collection = db["reviews"]