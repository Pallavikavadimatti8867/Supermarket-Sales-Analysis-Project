from flask import Blueprint, request, jsonify
from database import get_db
from models import SaleModel
from utils.helpers import serialize_doc
from bson import ObjectId

sales_bp = Blueprint("sales", __name__)

@sales_bp.route("", methods=["GET"])
def get_sales():
    db = get_db()
    if db is None:
        return jsonify({"transactions": [], "total": 0}), 200

    query = {}
    # Filter parameters
    search = request.args.get("search", "").strip()
    branch = request.args.get("branch")
    category = request.args.get("category")
    executive = request.args.get("executive")
    start_date = request.args.get("startDate")
    end_date = request.args.get("endDate")

    if branch and branch != "all":
        query["branch"] = branch
    if category and category != "all":
        query["category"] = category
    if executive and executive != "all":
        query["salesExecutive"] = executive
    if start_date and end_date:
        query["date"] = {"$gte": start_date, "$lte": end_date}
    elif start_date:
        query["date"] = {"$gte": start_date}

    if search:
        query["$or"] = [
            {"invoiceId": {"$regex": search, "$options": "i"}},
            {"customerId": {"$regex": search, "$options": "i"}},
            {"productName": {"$regex": search, "$options": "i"}},
            {"category": {"$regex": search, "$options": "i"}},
            {"salesExecutive": {"$regex": search, "$options": "i"}}
        ]

    page = int(request.args.get("page", 1))
    limit = int(request.args.get("limit", 50))
    skip = (page - 1) * limit

    cursor = db.sales.find(query).sort("date", -1).skip(skip).limit(limit)
    records = list(cursor)
    total_count = db.sales.count_documents(query)

    return jsonify({
        "transactions": serialize_doc(records),
        "total": total_count,
        "page": page,
        "limit": limit
    }), 200

@sales_bp.route("/<id>", methods=["GET"])
def get_sale_by_id(id):
    db = get_db()
    if db is None:
        return jsonify({"error": "Database unavailable"}), 503

    query = {"_id": ObjectId(id)} if ObjectId.is_valid(id) else {"invoiceId": id}
    sale = db.sales.find_one(query)
    if not sale:
        return jsonify({"error": "Transaction not found"}), 404
    return jsonify(serialize_doc(sale)), 200

@sales_bp.route("", methods=["POST"])
def create_sale():
    data = request.get_json() or {}
    try:
        validated = SaleModel.validate_and_format(data)
    except ValueError as ve:
        return jsonify({"error": str(ve)}), 400

    db = get_db()
    if db is None:
        return jsonify({"error": "Database unavailable"}), 503

    res = db.sales.insert_one(validated)
    validated["_id"] = str(res.inserted_id)
    return jsonify({"success": True, "transaction": serialize_doc(validated)}), 201

@sales_bp.route("/<id>", methods=["PUT"])
def update_sale(id):
    data = request.get_json() or {}
    db = get_db()
    if db is None:
        return jsonify({"error": "Database unavailable"}), 503

    query = {"_id": ObjectId(id)} if ObjectId.is_valid(id) else {"invoiceId": id}
    update_data = {}
    for k in ["productName", "category", "unitPrice", "quantity", "discount", "paymentMethod", "branch", "customerRating"]:
        if k in data:
            update_data[k] = data[k]

    if "unitPrice" in update_data or "quantity" in update_data:
        p = float(update_data.get("unitPrice", 10))
        q = int(update_data.get("quantity", 1))
        disc = float(update_data.get("discount", 0))
        tot = round(p * q, 2)
        tax = round(tot * 0.05, 2)
        update_data["totalSales"] = tot
        update_data["tax"] = tax
        update_data["finalAmount"] = round(max(0, tot + tax - disc), 2)

    db.sales.update_one(query, {"$set": update_data})
    updated = db.sales.find_one(query)
    return jsonify({"success": True, "transaction": serialize_doc(updated)}), 200

@sales_bp.route("/<id>", methods=["DELETE"])
def delete_sale(id):
    db = get_db()
    if db is None:
        return jsonify({"error": "Database unavailable"}), 503

    query = {"_id": ObjectId(id)} if ObjectId.is_valid(id) else {"invoiceId": id}
    res = db.sales.delete_one(query)
    if res.deleted_count == 0:
        return jsonify({"error": "Transaction not found"}), 404
    return jsonify({"success": True, "message": "Transaction deleted"}), 200
