import pandas as pd
import joblib
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

print("Loading model and data...")
try:
    artifacts = joblib.load("furniture_sales_model.joblib")
    model = artifacts["model"]
    encoder = artifacts["encoder"]

    df = pd.read_excel("Furniture_Dataset.xlsx")
    
    df["Month"] = pd.to_datetime(df["Month"], format="%b-%Y", errors="coerce")
    df["Month_Num"] = df["Month"].dt.month
    df["Year"] = df["Month"].dt.year
    
    df["Product_Family"] = df["Product_ID"].apply(lambda x: "-".join(str(x).split("-")[:-1]))
    
except Exception as e:
    print(f"Error loading files: {e}")

@app.get("/dashboard/{product_id}")
def get_dashboard_data(product_id: str):
    try:
        product_family = "-".join(product_id.split("-")[:-1])
        
        family_data = df[df["Product_Family"] == product_family].copy()
        
        if family_data.empty:
            raise HTTPException(status_code=404, detail="Product not found in history")

        history_df = family_data.groupby("Month")["Quantity"].sum().reset_index()
        history_df = history_df.sort_values("Month")
        
        graph_data = []
        for _, row in history_df.iterrows():
            graph_data.append({
                "date": row["Month"].strftime("%Y-%m-%d"),
                "sales": int(row["Quantity"])
            })

        last_month_date = history_df["Month"].max()
        sales_last_month = history_df[history_df["Month"] == last_month_date]["Quantity"].values[0]
        
        if len(history_df) >= 2:
            sales_2_ago = history_df.iloc[-2]["Quantity"]
        else:
            sales_2_ago = sales_last_month

        sales_last_year = history_df["Quantity"].tail(12).sum()
        
        current_price = family_data.iloc[-1]["Price"]
        
        try:
            family_encoded = encoder.transform([product_family])[0]
        except:
            family_encoded = 0

        next_month_date = last_month_date + pd.DateOffset(months=1)
        
        input_df = pd.DataFrame([{
            "Product_Family_Encoded": family_encoded,
            "Month_Num": next_month_date.month,
            "Year": next_month_date.year,
            "Price": current_price,
            "Discount": 0.05, 
            "Sales_Last_Month_Family_Qty": sales_last_month,
            "Sales_2_Months_Ago_Family_Qty": sales_2_ago,
            "Last_Year_Total_Sales_Family_Qty": sales_last_year
        }])

        pred_qty = model.predict(input_df)[0]
        pred_qty = int(round(pred_qty)) 
        
        pred_revenue = pred_qty * current_price

        return {
            "product_id": product_id,
            "current_price": current_price,
            "history_graph": graph_data, 
            "prediction": {
                "date": next_month_date.strftime("%Y-%m-%d"),
                "predicted_quantity": pred_qty,
                "predicted_revenue": round(pred_revenue, 2)
            }
        }

    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))