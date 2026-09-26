"""
Pandas Data Cleaning & Validation Pipeline
"""
import pandas as pd
import numpy as np

class DataCleaningService:
    @staticmethod
    def audit_and_clean_data(sales_data):
        if not sales_data:
            return {
                "initialCount": 0,
                "cleanedCount": 0,
                "duplicatesRemoved": 0,
                "missingImputed": 0,
                "qualityScore": 100.0,
                "cleanedRecords": []
            }

        df = pd.DataFrame(sales_data)
        initial_count = len(df)

        # 1. Audit missing values
        missing_count = int(df.isnull().sum().sum())

        # 2. Check and drop duplicate invoice IDs
        duplicate_count = int(df.duplicated(subset=['invoiceId']).sum())
        df = df.drop_duplicates(subset=['invoiceId'], keep='first')

        # 3. Handle Missing Values (Imputation)
        if 'customerRating' in df.columns:
            df['customerRating'] = df['customerRating'].fillna(4.0)
        if 'discount' in df.columns:
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
