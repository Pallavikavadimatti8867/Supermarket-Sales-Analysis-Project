import os
from dotenv import load_dotenv

load_dotenv()

class Config:
    SECRET_KEY = os.environ.get("SECRET_KEY", "supermarket-analytics-secret-key-2026")
    MONGO_URI = os.environ.get("MONGO_URI", "mongodb://localhost:27017/supermarket_db")
    MONGO_DBNAME = os.environ.get("MONGO_DBNAME", "supermarket_db")
    DEBUG = os.environ.get("DEBUG", "True").lower() == "true"
    CORS_HEADERS = "Content-Type"
