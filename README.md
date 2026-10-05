# Supermarket Sales Analysis Dashboard (Full-Stack BI System)

An engineering internship-level supermarket sales analysis and intelligence platform. The system connects a modern interactive web dashboard with a Python Flask REST backend, MongoDB database, and Pandas/NumPy analytics engine.

---

## 🌟 Key Features

1. **Role-Based Access Control (RBAC)**
   - **System Admin**: Full access to all transactions, create/update/delete permissions, data cleaning engine, dataset reset, cross-executive benchmarking.
   - **Sales Executives**: Authentication via email ID, real-time transaction recording with auto-calculation formulas, personal performance tracking, target milestones.

2. **Real-Time Financial Calculations**
   - Automatically computes:
     $$\text{Total Sales} = \text{Unit Price} \times \text{Quantity}$$
     $$\text{Tax (5\% GST)} = \text{Total Sales} \times 0.05$$
     $$\text{Final Amount} = \text{Total Sales} + \text{Tax} - \text{Discount}$$

3. **Live Interactive KPI Metrics & Chart.js Visualizations**
   - 8 High-Impact KPI Cards: Total Sales, Total Transactions, Products Sold, Average Order Value (AOV), Unique Customers, Total Discounts, Total Tax, and Average Customer Rating.
   - 13 Interactive Chart.js Visualizations:
     - Sales Trend Over Time (Daily line chart with gradient fill)
     - Monthly Revenue & Month-over-Month (MoM) Growth
     - Sales Distribution by Product Department Category
     - Top 10 Best-Selling Products by Revenue
     - Payment Method Breakdown (Ewallet, Cash, Credit Card)
     - Customer Loyalty Segmentation (Member vs Normal)
     - Gender Demographic Split (Female vs Male)
     - Branch Performance (Yangon, Mandalay, Naypyitaw)
     - Sales Executive Revenue & Target Attainment
     - Units Sold by Category
     - Customer Rating Histogram (1.0 to 5.0 stars)
     - Units vs Revenue Volume-Value Analysis

4. **Complete Sales Management (CRUD)**
   - Create, Read, Update, Delete with safety modals
   - Multi-criteria filter drawer (Date range, Branch, Category, Payment, Rating)
   - Pagination (10, 25, 50, 100 per page) and multi-column sorting
   - Printable official supermarket sales invoice receipts

5. **Automated ETL Data Cleaning & Ingest Pipeline**
   - Pandas-equivalent data quality audit detecting duplicate invoice keys, formula calculation drift, out-of-bounds ratings, and missing values.
   - One-click cleaning engine to re-calculate formulas, impute missing values, and deduplicate records.
   - CSV Sales File Importer with live validation report.

6. **Enterprise Reports & Export Hub**
   - Instant export of filtered data to CSV and Microsoft Excel (.xls).
   - Print-ready PDF report layouts for executive financial reviews.

---

## 🏗️ Project Architecture & Directory Layout

```
supermarket-sales-analysis/
├── backend/
│   ├── app.py                      # Flask application factory & blueprint registration
│   ├── config.py                   # Environment settings & MongoDB credentials
│   ├── database.py                 # PyMongo client initialization & index creation
│   ├── models.py                   # Document validation schemas & business math
│   ├── routes/
│   │   ├── auth_routes.py          # /api/auth (Login via Email ID, user list)
│   │   ├── sales_routes.py         # /api/sales (CRUD endpoints, search, filtering)
│   │   ├── analytics_routes.py     # /api/analytics (KPIs, monthly trends, categories)
│   │   ├── products_routes.py      # /api/products (Catalog listing)
│   │   ├── reports_routes.py       # /api/reports (CSV & Excel report generation)
│   │   └── cleaning_routes.py      # /api/cleaning (Data quality audit & ETL cleaning)
│   ├── services/
│   │   ├── analytics_service.py    # Pandas & NumPy vectorized aggregation engine
│   │   └── cleaning_service.py     # Pandas deduplication, imputation & formula fix
│   └── utils/
│       └── helpers.py              # BSON ObjectId serialization and helpers
├── src/                            # Modern React SPA with Chart.js & Tailwind CSS
├── data/
│   └── supermarket_sales.csv       # 1,020+ realistic supermarket transaction rows
├── requirements.txt                # Python backend dependencies
├── README.md                       # Comprehensive guide & viva presentation docs
└── package.json                    # Node.js dependencies
```

---

## 🚀 Local Setup & Installation in VS Code

### Prerequisites
- Node.js (v18+)
- Python (v3.9+)
- MongoDB (Local community server OR free MongoDB Atlas cloud cluster)
- Visual Studio Code

### 1. Clone Repository & Open in VS Code
```bash
git clone https://github.com/your-username/supermarket-sales-analysis.git
cd supermarket-sales-analysis
code .
```

### 2. Configure Python Backend
```bash
# Create and activate Python virtual environment
python -m venv venv

# Windows (Command Prompt / PowerShell):
venv\Scripts\activate

# macOS / Linux:
source venv/bin/activate

# Install required Python packages
pip install -r requirements.txt
```

### 3. Configure MongoDB
Create a `.env` file in the project root:
```env
MONGO_URI="mongodb://localhost:27017/supermarket_db"
# Or MongoDB Atlas:
# MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/supermarket_db?retryWrites=true&w=majority"
MONGO_DBNAME="supermarket_db"
SECRET_KEY="supermarket-secret-jwt-key"
PORT=5000
```

### 4. Run the Full-Stack Application
In VS Code, open two terminals:

**Terminal 1 (Flask REST API):**
```bash
cd backend
python app.py
# Server starts at: http://127.0.0.1:5000
```

**Terminal 2 (Frontend Client):**
```bash
npm install
npm run dev
# Dashboard launches at: http://localhost:3000
```

---

## 🔑 Demo Login Accounts

| Role | Email ID | Password | Access Level |
|---|---|---|---|
| **System Admin** | `admin@supermarket.com` | `admin123` | Full CRUD, Deletion, Data Cleaning, Global Reports |
| **Sales Executive** | `sarah.jenkins@supermarket.com` | `exec123` | Branch A transactions, personal performance module |
| **Sales Executive** | `david.kim@supermarket.com` | `exec123` | Branch B transactions, personal performance module |
| **Sales Executive** | `emily.chen@supermarket.com` | `exec123` | Branch A transactions, personal performance module |

---

## 📊 Sample Dataset Specifications
The included dataset (`data/supermarket_sales.csv`) contains **1,020+ realistic sales transactions** featuring:
- 6 Retail Departments: Health & Beauty, Electronic Accessories, Home & Lifestyle, Sports & Travel, Food & Beverages, Fashion Accessories
- 3 Physical Supermarket Branches: Branch A (Yangon), Branch B (Mandalay), Branch C (Naypyitaw)
- Realistic payment distributions: Ewallet, Cash, and Credit card
- Mathematical consistency across all columns: Unit Price × Quantity = Total Sales; Final Amount = Total Sales + 5% Tax - Discount.

---

## 📤 GitHub Upload Instructions
```bash
git init
git add .
git commit -m "feat: complete Supermarket Sales Analysis Dashboard with Flask, MongoDB, Pandas and React"
git branch -M main
git remote add origin https://github.com/<your-github-username>/supermarket-sales-analysis.git
git push -u origin main
```
