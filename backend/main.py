import pandas as pd
from prophet import Prophet
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pathlib import Path

BASE_DIR = Path(__file__).resolve().parent
DATA_DIR = BASE_DIR / "data"

app = FastAPI()

# Enable CORS for frontend
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
    ],
    allow_origin_regex=r"https?://(localhost|127\.0\.0\.1)(:\d+)?$",
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Load dataset
df = pd.read_csv(DATA_DIR / "furniture_dynamic_dataset_365days_forward.csv")

# Convert date
df["date"] = pd.to_datetime(df["date"], format="%d-%m-%Y")

# Select product
product_df = df[df["product_id"] == "P001"]

prophet_df = product_df[["date", "sales_qty"]]
prophet_df = prophet_df.rename(columns={"date": "ds", "sales_qty": "y"})

# Train model
model = Prophet()
model.fit(prophet_df)


@app.get("/demand")
def demand_prediction():
    future = model.make_future_dataframe(periods=30)
    forecast = model.predict(future)

    result = forecast[["ds", "yhat"]].tail(30)

    return result.to_dict(orient="records")


@app.get("/combo")
def combo_offer():
    dynamic = pd.read_csv(DATA_DIR / "furniture_dynamic_dataset_365days_forward.csv")
    static = pd.read_csv(DATA_DIR / "static_dataset.csv")

    sales_summary = dynamic.groupby("product_id")["sales_qty"].sum().reset_index()

    merged = pd.merge(sales_summary, static, on="product_id")

    # Get top 3 best-sellers and bottom 3 worst-sellers
    sorted_by_sales = merged.sort_values(by="sales_qty", ascending=False)
    top_3 = sorted_by_sales.head(3)
    bottom_3 = sorted_by_sales.tail(3).sort_values(by="sales_qty", ascending=True)

    combos = []
    for i in range(3):
        high_product = top_3.iloc[i]
        low_product = bottom_3.iloc[i]
        
        combo_price = (high_product["selling_price"] + low_product["selling_price"]) * 0.9
        
        combos.append({
            "combo_id": i + 1,
            "product_1": high_product["product_name"],
            "product_1_id": high_product["product_id"],
            "product_1_category": high_product["category"],
            "product_1_price": int(high_product["selling_price"]),
            "product_2": low_product["product_name"],
            "product_2_id": low_product["product_id"],
            "product_2_category": low_product["category"],
            "product_2_price": int(low_product["selling_price"]),
            "combo_price": round(combo_price, 2),
            "discount": round((high_product["selling_price"] + low_product["selling_price"]) * 0.1, 2)
        })
    
    return combos
