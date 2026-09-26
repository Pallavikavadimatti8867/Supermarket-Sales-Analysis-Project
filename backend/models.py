"""
Data Document Models and Validation Schemas for Supermarket Sales System
"""
from datetime import datetime

class SaleModel:
    @staticmethod
    def validate_and_format(data):
        required_fields = ["productName", "category", "unitPrice", "quantity", "customerId", "salesExecutive"]
        for f in required_fields:
            if f not in data or data[f] is None:
                raise ValueError(f"Missing required sales field: {f}")

        unit_price = float(data.get("unitPrice", 0))
        quantity = int(data.get("quantity", 1))
        if unit_price <= 0:
            raise ValueError("Unit price must be positive.")
        if quantity <= 0:
            raise ValueError("Quantity must be at least 1.")

        # Business Logic Formulas:
        # Total Sales = Unit Price * Quantity
        total_sales = round(unit_price * quantity, 2)
        # Tax = 5% of Total Sales
        tax = round(total_sales * 0.05, 2)
        discount = float(data.get("discount", 0.0))
        # Final Amount = Total Sales + Tax - Discount
        final_amount = round(max(0.0, total_sales + tax - discount), 2)

        now = datetime.utcnow()
        invoice_id = data.get("invoiceId") or f"INV-2026-{int(datetime.now().timestamp())}"

        return {
            "invoiceId": invoice_id,
            "date": data.get("date", now.strftime("%Y-%m-%d")),
            "time": data.get("time", now.strftime("%H:%M")),
            "customerId": data.get("customerId", "CUST-WALKIN"),
            "customerType": data.get("customerType", "Normal"),
            "gender": data.get("gender", "Female"),
            "productId": data.get("productId", "PRD-CUSTOM"),
            "productName": str(data["productName"]).strip(),
            "category": str(data["category"]).strip(),
            "unitPrice": unit_price,
            "quantity": quantity,
            "totalSales": total_sales,
            "tax": tax,
            "discount": discount,
            "finalAmount": final_amount,
            "paymentMethod": data.get("paymentMethod", "Cash"),
            "branch": data.get("branch", "Branch A"),
            "city": data.get("city", "Yangon"),
            "salesExecutive": str(data["salesExecutive"]).strip(),
            "customerRating": float(data.get("customerRating", 4.5)),
            "updatedAt": now.isoformat()
        }

class UserModel:
    @staticmethod
    def format_user(user_doc):
        return {
            "id": str(user_doc.get("_id", user_doc.get("id"))),
            "email": user_doc.get("email"),
            "name": user_doc.get("name"),
            "role": user_doc.get("role", "executive"),
            "branch": user_doc.get("branch", "Branch A"),
            "phone": user_doc.get("phone", "")
        }
