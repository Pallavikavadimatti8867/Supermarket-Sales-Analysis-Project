from flask import Blueprint, jsonify, request
from database import get_db
from utils.helpers import serialize_doc

products_bp = Blueprint("products", __name__)

@products_bp.route("", methods=["GET"])
def get_products():
    db = get_db()
    if db is None:
        return jsonify([]), 200

    products = list(db.products.find({}))
    return jsonify(serialize_doc(products)), 200
