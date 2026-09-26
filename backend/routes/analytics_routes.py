from flask import Blueprint, jsonify
from database import get_db
from services.analytics_service import AnalyticsService

analytics_bp = Blueprint("analytics", __name__)

@analytics_bp.route("/dashboard", methods=["GET"])
def get_dashboard_analytics():
    db = get_db()
    if db is None:
        return jsonify({"kpis": {}, "monthly": [], "categories": []}), 200

    sales = list(db.sales.find({}))
    kpis = AnalyticsService.compute_dashboard_kpis(sales)
    monthly = AnalyticsService.get_monthly_analysis(sales)
    categories = AnalyticsService.get_category_breakdown(sales)
    products = AnalyticsService.get_product_performance(sales)

    return jsonify({
        "kpis": kpis,
        "monthly": monthly,
        "categories": categories,
        "topProducts": products["top10"]
    }), 200

@analytics_bp.route("/monthly", methods=["GET"])
def get_monthly_trend():
    db = get_db()
    sales = list(db.sales.find({})) if db is not None else []
    return jsonify(AnalyticsService.get_monthly_analysis(sales)), 200

@analytics_bp.route("/categories", methods=["GET"])
def get_category_metrics():
    db = get_db()
    sales = list(db.sales.find({})) if db is not None else []
    return jsonify(AnalyticsService.get_category_breakdown(sales)), 200
