"""
MongoDB Connection & Schema Indexing using PyMongo
"""
from pymongo import MongoClient, ASCENDING, DESCENDING
from flask import current_app

db = None
mongo_client = None

def init_db(app):
    global db, mongo_client
    mongo_uri = app.config.get("MONGO_URI", "mongodb://localhost:27017/supermarket_db")
    db_name = app.config.get("MONGO_DBNAME", "supermarket_db")

    try:
        mongo_client = MongoClient(mongo_uri, serverSelectionTimeoutMS=2000)
        db = mongo_client[db_name]
        create_indexes(db)
        print(f"[*] Connected to MongoDB Database: {db_name}")
    except Exception as e:
        print(f"[!] Warning: MongoDB connection failed: {e}. Fallback to simulated in-memory store.")

def create_indexes(database):
    """Ensure indexes exist for rapid filtering and lookups"""
    try:
        # Sales collection indexes
        database.sales.create_index([("invoiceId", ASCENDING)], unique=True)
        database.sales.create_index([("date", DESCENDING)])
        database.sales.create_index([("customerId", ASCENDING)])
        database.sales.create_index([("category", ASCENDING)])
        database.sales.create_index([("branch", ASCENDING)])
        database.sales.create_index([("salesExecutive", ASCENDING)])

        # Users collection indexes
        database.users.create_index([("email", ASCENDING)], unique=True)

        # Products collection index
        database.products.create_index([("sku", ASCENDING)], unique=True)
    except Exception as e:
        print(f"[!] Index creation notice: {e}")

def get_db():
    return db
