import pandas as pd
import joblib
import numpy as np
import os
import random
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from datetime import datetime, timedelta

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

model = None
encoder = None
df = None

def generate_mock_data(product_id: str):
    """Generates fake data when Excel is missing the product."""
    print(f"Generating MOCK DATA for {product_id}")
    
    base_price = 2500
    if "CH" in product_id: base_price = 1800
    elif "BD" in product_id: base_price = 5000
    elif "TB" in product_id: base_price = 3500
    elif "WK" in product_id: base_price = 1200

    history = []
    current_date = datetime.now()
    
    for i in range(5, -1, -1):
        month_date = current_date - timedelta(days=30 * i)
        qty = random.randint(10, 50)
        history.append({
            "date": month_date.strftime("%b %Y"),
            "sales": qty,
            "revenue": qty * base_price
        })

    predicted_qty = int(history[-1]['sales'] * random.uniform(0.9, 1.2))
    
    return {
        "product_id": product_id,
        "current_price": base_price,
        "current_stock": int(predicted_qty * 1.2),
        "history_graph": history,
        "prediction": {
            "date": (current_date + timedelta(days=30)).strftime("%b %Y"),
            "predicted_quantity": predicted_qty,
            "predicted_revenue": predicted_qty * base_price
        }
    }

@app.on_event("startup")
def load_artifacts():
    global model, encoder, df
    print("Loading")
    
    try:
        if os.path.exists("furniture_sales_model.joblib"):
            artifacts = joblib.load("furniture_sales_model.joblib")
            model = artifacts["model"]
            encoder = artifacts["encoder"]
            print("Model loaded.")

        filename = "Furniture_Dataset.xlsx"
        if os.path.exists(filename):
            print(f"Found Excel: {filename}")
            df = pd.read_excel(filename)
            
            df.columns = df.columns.str.strip().str.replace(" ", "_")
            
            if "Product_ID" in df.columns:
                df["Product_ID"] = df["Product_ID"].astype(str).str.strip()
                df["Product_Family"] = df["Product_ID"]
                
            if "Month" in df.columns:
                df["Month"] = pd.to_datetime(df["Month"], errors='coerce')
                df["Month_Num"] = df["Month"].dt.month
                df["Year"] = df["Month"].dt.year
                
            print("Dataset loaded and cleaned.")
            
        else:
            print(f"Warning: {filename} not found. All requests will return Mock Data.")

    except Exception as e:
        print(f"Startup Error: {e}")

@app.get("/dashboard/{product_id}")
def get_dashboard_data(product_id: str):
    global df, model, encoder
    
    parts = product_id.split('-')
    if len(parts) >= 4:
        target_family = "-".join(parts[:-1]) 
    else:
        target_family = product_id

    print(f"Searching for Family: {target_family} (Derived from {product_id})")

    if df is not None:
        product_data = df[df["Product_ID"] == target_family].copy()
        
        if not product_data.empty:
            try:
                product_data = product_data.sort_values("Month")
                last_row = product_data.iloc[-1]
                
                history_graph = []
                for _, row in product_data.tail(12).iterrows():
                    history_graph.append({
                        "date": row["Month"].strftime("%b %Y"),
                        "sales": int(row["Quantity"]),
                        "revenue": int(row["Quantity"] * row["Price"])
                    })

                next_month = last_row["Month"] + pd.DateOffset(months=1)
                
                try:
                    family_enc = encoder.transform([target_family])[0]
                except:
                    family_enc = 0

                input_df = pd.DataFrame([{
                    "Product_Family_Encoded": family_enc,
                    "Month_Num": next_month.month,
                    "Year": next_month.year,
                    "Price": last_row["Price"],
                    "Discount": 0.05,
                    "Sales_Last_Month_Family_Qty": last_row["Quantity"],
                    "Sales_2_Months_Ago_Family_Qty": last_row["Quantity"], 
                    "Last_Year_Total_Sales_Family_Qty": product_data["Quantity"].sum()
                }])

                if model:
                    pred_qty = int(max(0, round(model.predict(input_df)[0])))
                else:
                    pred_qty = int(last_row["Quantity"] * 1.05) 

                return {
                    "product_id": product_id,
                    "current_price": float(last_row["Price"]),
                    "current_stock": int(pred_qty * 1.1) + 5,
                    "history_graph": history_graph,
                    "prediction": {
                        "date": next_month.strftime("%b %Y"),
                        "predicted_quantity": pred_qty,
                        "predicted_revenue": round(pred_qty * last_row["Price"], 2)
                    }
                }
            except Exception as e:
                print(f"Error processing real data: {e}. Falling back to mock.")

    return generate_mock_data(product_id)