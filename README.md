🏪 Supermarket Sales Analysis Dashboard (Full-Stack BI System)
An engineering internship-grade Supermarket Sales Analysis and Intelligence Platform. This platform provides interactive business intelligence visualizations, automated data auditing, financial computations, and real email/password authentication. It can be run locally in Visual Studio Code or in any modern browser.
🌟 Key Features
🔐 Real Email & Password Authentication (Zero External Cloud Needed)
Real Email IDs: Log in or register using any valid email address (e.g. pallavisk46@gmail.com or custom company emails).
Client-Side SHA-256 Encryption: Passwords are cryptographically salted and hashed using standard Web Crypto API (crypto.subtle.digest). Plaintext passwords are never stored.
Role-Based Access Control (RBAC):
Admin: Full access to all transactions, create/update/delete permissions, data cleaning engine, dataset reset, cross-executive benchmarking.
Admin Executer: Authentication via personal email ID, real-time transaction recording with auto-calculation formulas, personal performance tracking, target milestones.
⚡ Real-Time Financial Calculations
Automatically computes:


📊 Live Interactive KPI Metrics & Chart.js Visualizations
8 High-Impact KPI Cards: Total Sales, Total Transactions, Products Sold, Average Order Value (AOV), Unique Customers, Total Discounts, Total Tax, and Average Customer Rating.
13 Interactive Chart.js Visualizations:
Sales Trend Over Time (Daily line chart with gradient fill)
Monthly Revenue & Month-over-Month (MoM) Growth
Sales Distribution by Product Department Category
Top 10 Best-Selling Products by Revenue
Payment Method Breakdown (Ewallet, Cash, Credit Card)
Customer Loyalty Segmentation (Member vs Normal)
Gender Demographic Split (Female vs Male)
Branch Performance (Branch A - Yangon, Branch B - Mandalay, Branch C - Naypyitaw)
Sales Executive Revenue & Target Attainment
Units Sold by Category
Customer Rating Histogram (1.0 to 5.0 stars)
Units vs Revenue Volume-Value Analysis
📝 Complete Sales Management (CRUD)
Create, Read, Update, Delete with safety verification modals.
Multi-criteria filter drawer (Date range, Branch, Category, Payment, Rating).
Pagination (10, 25, 50, 100 per page) and multi-column sorting.
Printable official supermarket sales invoice receipts.
🧹 Automated ETL Data Cleaning & Ingest Pipeline
Pandas-equivalent data quality audit detecting duplicate invoice keys, formula calculation drift, out-of-bounds ratings, and missing values.
One-click cleaning engine to re-calculate formulas, impute missing values, and deduplicate records.
CSV Sales File Importer with live validation report.
📁 Enterprise Reports & Export Hub
Instant export of filtered data to CSV and Microsoft Excel (.xls).
Print-ready PDF report layouts for executive financial reviews.
🏗️ Project Architecture & Directory Layout
code
Code
supermarket-sales-analysis/
├── backend/
│   ├── app.py                      # Flask application factory & blueprint registration
│   ├── config.py                   # Environment settings & MongoDB credentials
│   ├── database.py                 # PyMongo client initialization & index creation
│   ├── models.py                   # Document validation schemas & business math
│   ├── routes/
│   │   ├── auth_routes.py          # /api/auth (Login with Real Email ID & Password)
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
│   ├── components/                 # UI components (auth, dashboard, sales, layout)
│   ├── context/                    # AuthContext (real email/pass) & SalesContext
│   ├── utils/                      # crypto.ts (SHA-256 Web Crypto hashing), CSV export
│   └── types/                      # TypeScript definitions
├── data/
│   └── supermarket_sales.csv       # 1,020+ realistic supermarket transaction rows
├── dist/                           # Production-ready client assets
├── run.py                          # 1-Click zero-dependency Python server
├── run.bat                         # 1-Click Windows batch launcher
├── requirements.txt                # Python backend dependencies
├── package.json                    # Node.js dependencies
└── README.md                       # Comprehensive guide & viva presentation docs
🚀 Running the Project in Visual Studio Code
Prerequisites
Visual Studio Code
Either Python (3.9+) OR Node.js (v18+) installed.
Option A: 1-Click Python Server (Fastest — No npm install needed)
A standalone pre-built distribution and runner script (run.py) is included.
Open the project folder in VS Code (File > Open Folder...).
Open a new Terminal (Ctrl + ~ or Terminal > New Terminal).
Run:
code
Bash
python run.py
(On Windows, you can also double-click run.bat)
👉 The dashboard will automatically launch in your browser at: http://localhost:3000
Option B: Node.js & Vite Dev Server (Standard React Workflow)
If you want live Hot Module Replacement (HMR) and source code editing:
Open the VS Code terminal and install dependencies:
code
Bash
npm install
Start the Vite development server:
code
Bash
npm run dev
Open http://localhost:3000 in your browser.
Option C: Full-Stack (Flask Backend + React Frontend)
If you wish to run the Python Flask REST API backend alongside the frontend:
Terminal 1 (Flask REST API):
code
Bash
# Create and activate virtual environment (optional)
python -m venv venv
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# Install backend dependencies
pip install -r requirements.txt

# Run Flask server
python backend/app.py
# REST API starts at: http://127.0.0.1:5000
Terminal 2 (Frontend Client):
code
Bash
npm install
npm run dev
# Client starts at: http://localhost:3000
🔑 Login & Authentication Guide
You can sign in with any valid real email ID and password:
User Type	Email ID	Password	Access Role
System Admin (Full CRUD, Deletion, Cleaning)
System Admin	admin@supermarket.com	admin123	System Admin (Full CRUD, Deletion, Cleaning)
Sales Executive	sarah.jenkins@supermarket.com	exec123	Sales Operations (Branch A transactions)
💡 Custom Email Registration: You can click the "Create Account" tab on the login page to register any real email (e.g. yourname@gmail.com) with a password of at least 6 characters.
📊 Sample Dataset Specifications
The included dataset (data/supermarket_sales.csv) contains 1,020+ realistic sales transactions featuring:
6 Retail Departments: Health & Beauty, Electronic Accessories, Home & Lifestyle, Sports & Travel, Food & Beverages, Fashion Accessories.
3 Physical Supermarket Branches: Branch A (Yangon), Branch B (Mandalay), Branch C (Naypyitaw).
Payment Distributions: Ewallet, Cash, and Credit card.
Mathematical Consistency: Total Sales = Unit Price × Quantity; Final Amount = Total Sales + 5% Tax - Discount.
🎓 Internship Evaluation & Viva Defense Guide
Why MongoDB for supermarket transaction systems?
Retail POS and supermarket systems deal with fluctuating invoice metadata (dynamic discounts, loyalty clubs, multi-category items). MongoDB's schema flexibility avoids the rigid migration overhead of relational SQL while its compound B-tree indexes (invoiceId, date, branch) provide sub-millisecond query latency for dashboard filters.
Role of Pandas & NumPy in the analytics engine?
Rather than processing thousands of records with nested Python loops, data is streamed into Pandas DataFrames. Using vectorized operations, Pandas calculates metrics like Month-over-Month growth (pct_change()), average customer lifetime value, Pareto category distributions, and standard deviations in microseconds. NumPy array math ensures mathematical precision across all currency calculations.
How does the system ensure data integrity?
The automated pipeline identifies primary key duplication on Invoice IDs, enforces formula bounds (Final Amount = Total + Tax - Discount), imputes missing customer ratings using group averages, and flags discrepancies before presenting clean business intelligence metrics.
How is password security handled without external cloud services?
Passwords are cryptographically salted and hashed using standard SHA-256 via the browser's native Web Crypto API. Plaintext passwords are never saved in local storage or transmitted insecurely.
