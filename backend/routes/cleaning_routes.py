from flask import Blueprint, jsonify, request
from database import get_db
from services.cleaning_service import DataCleaningService
from utils.helpers import serialize_doc

cleaning_bp = Blueprint("cleaning", __name__)

@cleaning_bp.route("/audit", methods=["GET"])
def audit_data():
    db = get_db()
    sales = list(db.sales.find({})) if db is not None else []
    report = DataCleaningService.audit_and_clean_data(sales)
    # Exclude full records from audit overview
    report.pop("cleanedRecords", None)
    return jsonify(report), 200

@cleaning_bp.route("/clean", methods=["POST"])
def run_cleaning_pipeline():
    db = get_db()
    if db is None:
        return jsonify({"error": "Database unavailable"}), 503

    sales = list(db.sales.find({}))
    report = DataCleaningService.audit_and_clean_data(sales)
    cleaned_records = report.pop("cleanedRecords", [])

    # Replace collection with cleaned dataset
    if cleaned_records:
        db.sales.delete_many({})
        db.sales.insert_many(cleaned_records)

    return jsonify({
        "success": True,
        "message": f"Dataset scrubbed. Removed {report['duplicatesRemoved']} duplicates.",
        "report": report
    }), 200
