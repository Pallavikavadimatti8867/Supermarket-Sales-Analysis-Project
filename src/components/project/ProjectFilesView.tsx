import React, { useState } from 'react';
import {
  Folder,
  FileCode,
  Terminal,
  Database,
  BookOpen,
  Copy,
  Check,
  Download,
  GitBranch,
  HelpCircle,
  Server,
  Layers,
} from 'lucide-react';
import { useSales } from '../../context/SalesContext';
import { exportToCSV } from '../../utils/csvExport';

export const ProjectFilesView: React.FC = () => {
  const { transactions } = useSales();
  const [activeTab, setActiveTab] = useState<'architecture' | 'code' | 'viva' | 'setup'>('architecture');
  const [selectedFile, setSelectedFile] = useState<string>('backend/app.py');
  const [copied, setCopied] = useState(false);

  const fileContents: Record<string, { lang: string; code: string; desc: string }> = {
    'backend/app.py': {
      lang: 'python',
      desc: 'Main Flask server entry point, CORS configuration, Blueprint route registration, and error handlers.',
      code: `"""
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
`,
    },

    'backend/database.py': {
      lang: 'python',
      desc: 'PyMongo client setup, collection index creation, and aggregation query helpers.',
      code: `"""
MongoDB Database Connection & Index Management using PyMongo
"""
from pymongo import MongoClient, ASCENDING, DESCENDING
from flask import current_app

db = None
mongo_client = None

def init_db(app):
    global db, mongo_client
    mongo_uri = app.config.get("MONGO_URI", "mongodb://localhost:27017/supermarket_db")
    db_name = app.config.get("MONGO_DBNAME", "supermarket_db")

    mongo_client = MongoClient(mongo_uri)
    db = mongo_client[db_name]

    # Create Indexes for high-throughput query performance
    create_indexes(db)
    print(f"Connected to MongoDB: {db_name}")

def create_indexes(database):
    """Ensure indexes exist for rapid filtering and lookups"""
    # Sales collection indexes
    database.sales.create_index([("invoiceId", ASCENDING)], unique=True)
    database.sales.create_index([("date", DESCENDING)])
    database.sales.create_index([("customerId", ASCENDING)])
    database.sales.create_index([("category", ASCENDING)])
    database.sales.create_index([("branch", ASCENDING)])
    database.sales.create_index([("salesExecutive", ASCENDING)])

    # Users collection indexes
    database.users.create_index([("email", ASCENDING)], unique=True)

    # Products collection index
    database.products.create_index([("sku", ASCENDING)], unique=True)

def get_db():
    return db
`,
    },

    'backend/services/analytics_service.py': {
      lang: 'python',
      desc: 'High-performance statistical analysis using Pandas DataFrames and NumPy arrays.',
      code: `"""
Data Analysis Service utilizing Pandas and NumPy for Supermarket BI
"""
import pandas as pd
import numpy as np

class AnalyticsService:
    @staticmethod
    def compute_dashboard_kpis(sales_list):
        if not sales_list:
            return {}

        df = pd.DataFrame(sales_list)

        # Vectorized calculations via Pandas / NumPy
        total_sales = float(df['finalAmount'].sum())
        total_transactions = int(len(df))
        total_quantity = int(df['quantity'].sum())
        aov = float(df['finalAmount'].mean()) if total_transactions > 0 else 0.0
        unique_customers = int(df['customerId'].nunique())
        total_discount = float(df['discount'].sum())
        total_tax = float(df['tax'].sum())
        avg_rating = float(df['customerRating'].mean())

        return {
            "totalSales": round(total_sales, 2),
            "totalTransactions": total_transactions,
            "totalProductsSold": total_quantity,
            "averageOrderValue": round(aov, 2),
            "totalCustomers": unique_customers,
            "totalDiscount": round(total_discount, 2),
            "totalTax": round(total_tax, 2),
            "averageRating": round(avg_rating, 2)
        }

    @staticmethod
    def get_monthly_analysis(sales_list):
        df = pd.DataFrame(sales_list)
        df['date'] = pd.to_datetime(df['date'])
        df['month'] = df['date'].dt.to_period('M').astype(str)

        monthly = df.groupby('month').agg(
            sales=('finalAmount', 'sum'),
            transactions=('invoiceId', 'count'),
            quantity=('quantity', 'sum'),
            avg_rating=('customerRating', 'mean')
        ).reset_index()

        # Calculate Month-over-Month Growth % using np.diff
        monthly['growth'] = monthly['sales'].pct_change().fillna(0) * 100

        return monthly.to_dict(orient='records')

    @staticmethod
    def get_category_breakdown(sales_list):
        df = pd.DataFrame(sales_list)
        grouped = df.groupby('category').agg(
            sales=('finalAmount', 'sum'),
            quantity=('quantity', 'sum'),
            transactions=('invoiceId', 'count')
        ).reset_index().sort_values(by='sales', ascending=False)

        total_rev = grouped['sales'].sum()
        grouped['contributionPercent'] = (grouped['sales'] / total_rev * 100).round(1)

        return grouped.to_dict(orient='records')
`,
    },

    'backend/services/cleaning_service.py': {
      lang: 'python',
      desc: 'Pandas data cleaning pipeline for missing values, duplicates, and financial formula integrity.',
      code: `"""
Pandas Data Cleaning & Validation Pipeline
"""
import pandas as pd
import numpy as np

class DataCleaningService:
    @staticmethod
    def audit_and_clean_data(sales_data):
        df = pd.DataFrame(sales_data)
        initial_count = len(df)

        # 1. Audit missing values
        missing_count = int(df.isnull().sum().sum())

        # 2. Check and drop duplicate invoice IDs
        duplicate_count = int(df.duplicated(subset=['invoiceId']).sum())
        df = df.drop_duplicates(subset=['invoiceId'], keep='first')

        # 3. Handle Missing Values (Imputation)
        df['customerRating'] = df['customerRating'].fillna(df['customerRating'].mean().round(1))
        df['discount'] = df['discount'].fillna(0.0)

        # 4. Enforce Financial Arithmetic Integrity
        # Total Sales = Unit Price * Quantity
        df['totalSales'] = (df['unitPrice'] * df['quantity']).round(2)
        # Tax = 5% of Total Sales
        df['tax'] = (df['totalSales'] * 0.05).round(2)
        # Final Amount = Total Sales + Tax - Discount
        df['finalAmount'] = np.maximum(0, df['totalSales'] + df['tax'] - df['discount']).round(2)

        # 5. Type Casting
        df['quantity'] = df['quantity'].astype(int)
        df['unitPrice'] = df['unitPrice'].astype(float)
        df['customerRating'] = df['customerRating'].clip(lower=1.0, upper=5.0)

        quality_pct = round((len(df) / max(1, initial_count)) * 100, 1)

        return {
            "initialCount": initial_count,
            "cleanedCount": len(df),
            "duplicatesRemoved": duplicate_count,
            "missingImputed": missing_count,
            "qualityScore": quality_pct,
            "cleanedRecords": df.to_dict(orient='records')
        }
`,
    },

    'requirements.txt': {
      lang: 'plaintext',
      desc: 'Python package requirements for backend API development.',
      code: `Flask==3.0.3
Flask-CORS==4.0.1
pymongo==4.7.2
pandas==2.2.2
numpy==1.26.4
python-dotenv==1.0.1
gunicorn==22.0.0
pytest==8.2.1
`,
    },
  };

  const handleCopy = (code: string) => {
    navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="space-y-6">
      {/* Navigation Sub-Tabs */}
      <div className="bg-white border border-slate-200 rounded-xl p-2 shadow-xs flex flex-wrap items-center justify-between gap-2">
        <div className="flex flex-wrap items-center gap-1">
          {[
            { id: 'architecture', label: 'Architecture & System Design', icon: Layers },
            { id: 'code', label: 'VS Code Backend Code Explorer', icon: FileCode },
            { id: 'setup', label: 'Installation & MongoDB Guide', icon: Terminal },
            { id: 'viva', label: 'Internship Evaluation & Viva Guide', icon: BookOpen },
          ].map((tab) => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-3 py-1.5 text-xs font-medium rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? 'bg-slate-900 text-white'
                    : 'text-slate-600 hover:text-slate-900 hover:bg-slate-100'
                }`}
              >
                <Icon className="w-3.5 h-3.5" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>

        <button
          onClick={() =>
            exportToCSV(transactions, `supermarket_sales_dataset_1000plus.csv`)
          }
          className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-semibold text-emerald-700 bg-emerald-50 hover:bg-emerald-100 border border-emerald-200 rounded-lg transition-colors cursor-pointer"
        >
          <Download className="w-3.5 h-3.5" />
          <span>Download 1,000+ Sample CSV</span>
        </button>
      </div>

      {/* Tab 1: Architecture */}
      {activeTab === 'architecture' && (
        <div className="space-y-6">
          <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-4">
            <div>
              <h2 className="text-base font-bold text-slate-900">
                End-to-End System Architecture (Full-Stack Supermarket Analytics)
              </h2>
              <p className="text-xs text-slate-500">
                Designed for high throughput retail transaction processing, real-time KPI streaming, and analytics.
              </p>
            </div>

            {/* Diagram */}
            <div className="p-5 bg-slate-50 rounded-xl border border-slate-200 font-mono text-xs text-slate-700 space-y-3">
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-blue-600" />
                    <span>Frontend Client Tier</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li>• React 19 + TypeScript SPA</li>
                    <li>• Chart.js Interactive Visualizations</li>
                    <li>• Tailwind CSS Responsive Dashboard</li>
                    <li>• Role-Based Access (Admin/Executive)</li>
                    <li>• Fetch API client layer</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-emerald-600" />
                    <span>Flask REST API Tier</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li>• Python 3 + Flask + Flask-CORS</li>
                    <li>• Pandas & NumPy Analytics Engine</li>
                    <li>• ETL Data Cleaning Pipeline</li>
                    <li>• Route Blueprints (/api/sales, etc.)</li>
                    <li>• Input validation & error handlers</li>
                  </ul>
                </div>

                <div className="p-4 bg-white rounded-lg border border-slate-200 shadow-xs">
                  <div className="flex items-center gap-2 font-bold text-slate-900 mb-2">
                    <div className="w-2.5 h-2.5 rounded-full bg-purple-600" />
                    <span>Database Tier (MongoDB)</span>
                  </div>
                  <ul className="space-y-1 text-[11px] text-slate-600">
                    <li>• MongoDB / MongoDB Atlas</li>
                    <li>• Collections: sales, users, products</li>
                    <li>• Compound indexes on invoiceId & date</li>
                    <li>• PyMongo driver integration</li>
                    <li>• High performance aggregation pipelines</li>
                  </ul>
                </div>
              </div>
            </div>

            {/* Folder Layout */}
            <div className="pt-2">
              <h3 className="text-xs font-semibold text-slate-900 uppercase tracking-wider mb-2">
                Project Folder Directory
              </h3>
              <pre className="p-4 bg-slate-900 text-slate-100 rounded-xl text-xs overflow-x-auto font-mono">
{`supermarket-sales-analysis/
├── backend/
│   ├── app.py                      # Flask app initialization & blueprint routing
│   ├── config.py                   # Environment configuration & DB connection strings
│   ├── database.py                 # PyMongo connection & index management
│   ├── models.py                   # Data schemas (Sale, User, Product, Customer)
│   ├── routes/
│   │   ├── auth_routes.py          # /api/auth (Login with Email ID, sessions)
│   │   ├── sales_routes.py         # /api/sales (CRUD endpoints, search, filtering)
│   │   ├── analytics_routes.py     # /api/analytics (KPIs, trends, category aggregations)
│   │   ├── reports_routes.py       # /api/reports (Report generators & export endpoints)
│   │   └── cleaning_routes.py      # /api/cleaning (Data quality audit & ETL cleaning)
│   ├── services/
│   │   ├── analytics_service.py    # Pandas & NumPy statistical calculation engine
│   │   └── cleaning_service.py     # Data deduplication & formula integrity routines
│   └── utils/
│       └── helpers.py              # Math formatting, formula calculation, date parsers
├── frontend/
│   ├── index.html                  # HTML5 entry point
│   ├── src/                        # React SPA with Chart.js, Tailwind, & AuthContext
│   └── public/                     # Static assets & icons
├── data/
│   └── supermarket_sales.csv       # 1,020+ realistic supermarket transaction rows
├── requirements.txt                # Python backend dependencies
└── README.md                       # Complete documentation & internship guide`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 2: Code Explorer */}
      {activeTab === 'code' && (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* File Selector Sidebar */}
          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-xl p-4 shadow-xs space-y-2">
            <span className="text-xs font-semibold text-slate-500 uppercase tracking-wider block mb-2">
              VS Code Project Files
            </span>
            {Object.keys(fileContents).map((filePath) => {
              const isSelected = selectedFile === filePath;
              return (
                <button
                  key={filePath}
                  onClick={() => setSelectedFile(filePath)}
                  className={`w-full flex items-center justify-between p-2.5 rounded-lg text-left text-xs transition-colors cursor-pointer ${
                    isSelected
                      ? 'bg-slate-900 text-white font-medium'
                      : 'text-slate-700 hover:bg-slate-100'
                  }`}
                >
                  <div className="flex items-center gap-2 truncate">
                    <FileCode className="w-4 h-4 flex-shrink-0" />
                    <span className="truncate">{filePath}</span>
                  </div>
                </button>
              );
            })}
          </div>

          {/* Code Viewer Panel */}
          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-xl overflow-hidden shadow-xs flex flex-col">
            <div className="p-4 border-b border-slate-200 bg-slate-50 flex items-center justify-between">
              <div>
                <span className="font-mono text-xs font-semibold text-slate-900">{selectedFile}</span>
                <p className="text-[11px] text-slate-500 mt-0.5">{fileContents[selectedFile]?.desc}</p>
              </div>
              <button
                onClick={() => handleCopy(fileContents[selectedFile]?.code || '')}
                className="flex items-center gap-1 px-3 py-1 text-xs font-medium text-slate-700 bg-white border border-slate-200 hover:bg-slate-100 rounded-lg transition-colors cursor-pointer"
              >
                {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                <span>{copied ? 'Copied!' : 'Copy Code'}</span>
              </button>
            </div>

            <pre className="p-4 bg-slate-950 text-slate-200 font-mono text-xs overflow-x-auto flex-1 max-h-[500px]">
              <code>{fileContents[selectedFile]?.code}</code>
            </pre>
          </div>
        </div>
      )}

      {/* Tab 3: Setup & MongoDB Guide */}
      {activeTab === 'setup' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-5 text-xs text-slate-700">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Complete Setup & Installation Guide for VS Code & MongoDB
            </h2>
            <p className="text-xs text-slate-500">Step-by-step instructions to run the application locally.</p>
          </div>

          <div className="space-y-4">
            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Step 1: Clone Repository & Open in VS Code</h3>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs">
{`git clone https://github.com/your-username/supermarket-sales-analysis.git
cd supermarket-sales-analysis
code .`}
              </pre>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Step 2: Python Virtual Environment & Requirements</h3>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs">
{`# Create virtual environment
python -m venv venv

# Activate virtual environment
# Windows:
venv\\Scripts\\activate
# macOS/Linux:
source venv/bin/activate

# Install all backend dependencies
pip install -r requirements.txt`}
              </pre>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Step 3: MongoDB Configuration (Local or Atlas)</h3>
              <p className="text-slate-600">
                You can use a local MongoDB instance (`mongodb://localhost:27017`) or a free MongoDB Atlas cloud cluster.
              </p>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs">
{`# Create a .env file inside backend/ directory:
MONGO_URI="mongodb+srv://<username>:<password>@cluster0.mongodb.net/supermarket_db?retryWrites=true&w=majority"
MONGO_DBNAME="supermarket_db"
SECRET_KEY="supermarket-secret-jwt-key"
PORT=5000`}
              </pre>
            </div>

            <div className="p-4 bg-slate-50 rounded-xl border border-slate-200 space-y-2">
              <h3 className="font-bold text-slate-900 text-sm">Step 4: Launch Flask Backend & Frontend</h3>
              <pre className="p-3 bg-slate-900 text-slate-100 rounded-lg font-mono text-xs">
{`# Terminal 1: Run Python Flask Backend
cd backend
python app.py
# Backend running on http://127.0.0.1:5000

# Terminal 2: Run Frontend Client
npm install
npm run dev
# Dashboard running on http://localhost:3000`}
              </pre>
            </div>
          </div>
        </div>
      )}

      {/* Tab 4: Viva Guide */}
      {activeTab === 'viva' && (
        <div className="bg-white border border-slate-200 rounded-xl p-6 shadow-xs space-y-6">
          <div>
            <h2 className="text-base font-bold text-slate-900">
              Internship Viva & Technical Defense Presentation Guide
            </h2>
            <p className="text-xs text-slate-500">
              Key interview questions, design rationales, and technical concepts to explain during evaluation.
            </p>
          </div>

          <div className="space-y-4 text-xs">
            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                Q1: Why choose MongoDB over traditional SQL for this supermarket system?
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Answer:</strong> Supermarket transactions frequently have dynamic item attributes (discounts,
                varying tax categories, branch metadata, customer loyalty profiles). MongoDB's document-oriented JSON model
                provides schema flexibility, allowing transactions to store rich nested receipt objects while supporting
                fast write throughput and complex aggregation pipelines (`$group`, `$match`, `$project`) for real-time
                KPI generation without expensive multi-table joins.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                Q2: How are Pandas and NumPy utilized in the analytics pipeline?
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Answer:</strong> Rather than processing raw records with nested Python loops, we stream MongoDB
                documents into Pandas DataFrames. Using vectorized operations, Pandas calculates metrics like
                Month-over-Month growth (`pct_change()`), average customer lifetime value, Pareto category distributions,
                and correlation between discount rates and unit volumes in milliseconds. NumPy's `maximum` and array math
                ensure mathematical precision across currency calculations.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                Q3: How does the system enforce Role-Based Access Control (RBAC)?
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Answer:</strong> Users authenticate via their corporate Email ID. Admins receive global access
                enabling full CRUD, destructive operations (record deletion), cross-executive benchmarking, and dataset
                resetting. Sales Executives operate with restricted scopes: they can create new transactions and edit only
                records attributed to their own identity.
              </p>
            </div>

            <div className="p-4 bg-slate-50 border border-slate-200 rounded-xl space-y-2">
              <div className="font-bold text-slate-900 text-sm">
                Q4: Explain the automated Data Cleaning & Validation pipeline.
              </div>
              <p className="text-slate-600 leading-relaxed">
                <strong>Answer:</strong> Ingested CSV transactions undergo 4 validation gates:
                1) Primary key deduplication on Invoice IDs;
                2) Formula verification where `Total Amount = Unit Price × Quantity` and `Final Amount = Total + Tax - Discount`;
                3) Missing value imputation for ratings and customer segments;
                4) Range clamping to verify customer ratings remain between 1.0 and 5.0 stars.
              </p>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};
