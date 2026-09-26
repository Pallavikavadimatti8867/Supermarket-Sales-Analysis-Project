from flask import Blueprint, jsonify, Response, request
from database import get_db
import io
import csv

reports_bp = Blueprint("reports", __name__)

@reports_bp.route("/export/csv", methods=["GET"])
def export_sales_csv():
    db = get_db()
    sales = list(db.sales.find({})) if db is not None else []

    output = io.StringIO()
    writer = csv.writer(output)

    writer.writerow([
        "Invoice ID", "Date", "Customer ID", "Customer Type", "Gender",
        "Product Name", "Category", "Unit Price", "Quantity", "Tax", "Discount",
        "Total Sales", "Final Amount", "Payment Method", "Branch", "Sales Executive", "Rating"
    ])

    for s in sales:
        writer.writerow([
            s.get("invoiceId"), s.get("date"), s.get("customerId"), s.get("customerType"), s.get("gender"),
            s.get("productName"), s.get("category"), s.get("unitPrice"), s.get("quantity"), s.get("tax"),
            s.get("discount"), s.get("totalSales"), s.get("finalAmount"), s.get("paymentMethod"),
            s.get("branch"), s.get("salesExecutive"), s.get("customerRating")
        ])

    output.seek(0)
    return Response(
        output.getvalue(),
        mimetype="text/csv",
        headers={"Content-Disposition": "attachment;filename=supermarket_sales_export.csv"}
    )
