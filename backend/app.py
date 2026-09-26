"""
Supermarket Sales Analysis System - Flask Backend Entry Point
"""
import os
from flask import Flask, jsonify
from flask_cors import CORS
from config import Config
from database import init_db
from routes.auth_routes import auth_bp
from routes.sales_routes import sales_bp
from routes.analytics_routes import analytics_bp
from routes.products_routes import products_bp
from routes.reports_routes import reports_bp
from routes.cleaning_routes import cleaning_bp

def create_app():
    app = Flask(__name__)
    app.config.from_object(Config)

    # Enable CORS for frontend client communication
    CORS(app, resources={r"/api/*": {"origins": "*"}})

    # Initialize PyMongo Connection and Indexes
    init_db(app)

    # Register API Blueprints
    app.register_blueprint(auth_bp, url_prefix="/api/auth")
    app.register_blueprint(sales_bp, url_prefix="/api/sales")
    app.register_blueprint(analytics_bp, url_prefix="/api/analytics")
    app.register_blueprint(products_bp, url_prefix="/api/products")
    app.register_blueprint(reports_bp, url_prefix="/api/reports")
    app.register_blueprint(cleaning_bp, url_prefix="/api/cleaning")

    @app.route("/api/health", methods=["GET"])
    def health_check():
        return jsonify({
            "status": "healthy",
            "service": "Supermarket Sales Analysis API",
            "version": "1.0.0"
        }), 200

    @app.errorhandler(404)
    def not_found(e):
        return jsonify({"error": "Resource not found"}), 404

    @app.errorhandler(500)
    def internal_error(e):
        return jsonify({"error": "Internal server error occurred"}), 500

    return app

if __name__ == "__main__":
    app = create_app()
    port = int(os.environ.get("PORT", 5000))
    app.run(host="0.0.0.0", port=port, debug=True)
