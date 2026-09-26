from flask import Blueprint, request, jsonify
from database import get_db

auth_bp = Blueprint("auth", __name__)

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "")

    if not email:
        return jsonify({"error": "Email is required"}), 400

    db = get_db()
    user = None
    if db is not None:
        user = db.users.find_one({"email": email})

    # Default fallback accounts for internship demo if MongoDB is being initialized
    if not user:
        if email == "admin@supermarket.com":
            user = {
                "id": "USR-001",
                "email": "admin@supermarket.com",
                "name": "Eleanor Vance (Admin)",
                "role": "admin",
                "branch": "Branch A"
            }
        elif "jenkins" in email:
            user = {
                "id": "USR-002",
                "email": "sarah.jenkins@supermarket.com",
                "name": "Sarah Jenkins",
                "role": "executive",
                "branch": "Branch A"
            }
        else:
            return jsonify({"error": "Invalid email address or user not found"}), 401

    return jsonify({
        "success": True,
        "token": "mock-jwt-token-2026",
        "user": {
            "id": user.get("id", str(user.get("_id"))),
            "email": user.get("email"),
            "name": user.get("name"),
            "role": user.get("role", "executive"),
            "branch": user.get("branch", "Branch A")
        }
    }), 200

@auth_bp.route("/users", methods=["GET"])
def get_users():
    return jsonify([
        {"email": "admin@supermarket.com", "name": "Eleanor Vance", "role": "admin"},
        {"email": "sarah.jenkins@supermarket.com", "name": "Sarah Jenkins", "role": "executive"},
        {"email": "david.kim@supermarket.com", "name": "David Kim", "role": "executive"},
        {"email": "emily.chen@supermarket.com", "name": "Emily Chen", "role": "executive"},
        {"email": "marcus.vance@supermarket.com", "name": "Marcus Vance", "role": "executive"},
        {"email": "aisha.patel@supermarket.com", "name": "Aisha Patel", "role": "executive"}
    ])
