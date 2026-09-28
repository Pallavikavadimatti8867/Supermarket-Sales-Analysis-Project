import hashlib
import os
import re
from flask import Blueprint, request, jsonify
from database import get_db

auth_bp = Blueprint("auth", __name__)

# In-memory user store fallback if MongoDB is not running locally
LOCAL_USERS = {
    "admin@supermarket.com": {
        "id": "USR-001",
        "email": "admin@supermarket.com",
        "name": "Eleanor Vance (Admin)",
        "role": "admin",
        "branch": "Branch A",
        "password_hash": hashlib.sha256("admin123".encode()).hexdigest(),
    },
    "sarah.jenkins@supermarket.com": {
        "id": "USR-002",
        "email": "sarah.jenkins@supermarket.com",
        "name": "Sarah Jenkins",
        "role": "executive",
        "branch": "Branch A",
        "password_hash": hashlib.sha256("exec123".encode()).hexdigest(),
    },
}

def is_valid_email(email_str: str) -> bool:
    return bool(re.match(r"^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$", email_str.strip()))

@auth_bp.route("/register", methods=["POST"])
def register():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    role = data.get("role", "admin")
    name = data.get("name", "").strip()

    if not email:
        return jsonify({"error": "Email is required"}), 400
    if not is_valid_email(email):
        return jsonify({"error": "Please enter a valid real email address (e.g. name@gmail.com)"}), 400
    if len(password) < 6:
        return jsonify({"error": "Password must be at least 6 characters"}), 400

    if not name:
        username_part = email.split("@")[0]
        name = username_part.capitalize()

    pwd_hash = hashlib.sha256(password.encode()).hexdigest()

    db = get_db()
    if db is not None:
        existing = db.users.find_one({"email": email})
        if existing:
            return jsonify({"error": "Account with this email already exists"}), 409
        user_doc = {
            "email": email,
            "name": name,
            "role": role,
            "branch": "Branch A",
            "password_hash": pwd_hash,
        }
        res = db.users.insert_one(user_doc)
        user_doc["id"] = str(res.inserted_id)
    else:
        if email in LOCAL_USERS:
            return jsonify({"error": "Account with this email already exists"}), 409
        user_doc = {
            "id": f"USR-{len(LOCAL_USERS) + 1:03d}",
            "email": email,
            "name": name,
            "role": role,
            "branch": "Branch A",
            "password_hash": pwd_hash,
        }
        LOCAL_USERS[email] = user_doc

    return jsonify({
        "success": True,
        "message": "Account created successfully",
        "user": {
            "id": user_doc.get("id"),
            "email": user_doc.get("email"),
            "name": user_doc.get("name"),
            "role": user_doc.get("role"),
            "branch": user_doc.get("branch"),
        }
    }), 201

@auth_bp.route("/login", methods=["POST"])
def login():
    data = request.get_json() or {}
    email = data.get("email", "").strip().lower()
    password = data.get("password", "").strip()
    desired_role = data.get("role")

    if not email:
        return jsonify({"error": "Email address is required"}), 400

    if not is_valid_email(email):
        return jsonify({"error": "Please enter a valid real email address (e.g. name@gmail.com)"}), 400

    if not password:
        return jsonify({"error": "Password is required"}), 400

    db = get_db()
    user = None
    if db is not None:
        user = db.users.find_one({"email": email})
    else:
        user = LOCAL_USERS.get(email)

    pwd_hash = hashlib.sha256(password.encode()).hexdigest()

    # If user doesn't exist yet, auto-register for seamless experience
    if not user:
        username_part = email.split("@")[0]
        formatted_name = username_part.capitalize()
        assigned_role = desired_role if desired_role in ("admin", "executive") else "admin"

        new_user = {
            "id": f"USR-{len(LOCAL_USERS) + 10:03d}",
            "email": email,
            "name": formatted_name,
            "role": assigned_role,
            "branch": "Branch A",
            "password_hash": pwd_hash,
        }

        if db is not None:
            res = db.users.insert_one(new_user)
            new_user["id"] = str(res.inserted_id)
        else:
            LOCAL_USERS[email] = new_user

        user = new_user

    else:
        # Check password
        stored_hash = user.get("password_hash")
        if stored_hash and stored_hash != pwd_hash:
            return jsonify({"error": "Incorrect password for this email address"}), 401

        # Update role if explicitly requested
        if desired_role and desired_role != user.get("role"):
            user["role"] = desired_role
            if db is not None:
                db.users.update_one({"email": email}, {"$set": {"role": desired_role}})

    return jsonify({
        "success": True,
        "token": f"jwt-session-{user.get('id')}",
        "user": {
            "id": str(user.get("id", user.get("_id", "USR-001"))),
            "email": user.get("email"),
            "name": user.get("name"),
            "role": user.get("role", "admin"),
            "branch": user.get("branch", "Branch A"),
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
