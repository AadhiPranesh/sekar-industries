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


@app.get("/api/product-health")
def product_health():
    dynamic = pd.read_csv(DATA_DIR / "furniture_dynamic_dataset_365days_forward.csv")
    static = pd.read_csv(DATA_DIR / "static_dataset.csv")

    # Safe stock turnover per row
    dynamic["stock_turnover"] = dynamic["sales_qty"] / dynamic["stock_start"].replace(0, 1)

    # Aggregate per product over all days
    agg = dynamic.groupby("product_id").agg(
        total_sales=("sales_qty", "sum"),
        avg_profit=("profit", "mean"),
        avg_turnover=("stock_turnover", "mean"),
        total_revenue=("revenue", "sum"),
        avg_stock_end=("stock_end", "mean"),
    ).reset_index()

    # Merge with static data for product names
    merged = pd.merge(agg, static[["product_id", "product_name"]], on="product_id", how="left")

    # Min-max normalization helpers
    def minmax(series):
        rng = series.max() - series.min()
        return (series - series.min()) / rng * 100 if rng > 0 else pd.Series([50.0] * len(series), index=series.index)

    merged["sales_score"]    = minmax(merged["total_sales"])
    merged["profit_score"]   = minmax(merged["avg_profit"])
    merged["turnover_score"] = minmax(merged["avg_turnover"])

    # Weighted health score
    merged["health_score"] = (
        0.4 * merged["sales_score"] +
        0.3 * merged["profit_score"] +
        0.3 * merged["turnover_score"]
    ).round(1)

    # Status category
    def get_status(score):
        if score >= 80:   return "Selling Fast"
        elif score >= 60: return "Growing"
        elif score >= 40: return "Steady Sales"
        elif score >= 20: return "Slow Moving"
        else:             return "Not Moving"

    merged["dashboard_status"] = merged["health_score"].apply(get_status)

    result = merged[[
        "product_id", "product_name",
        "total_sales", "avg_stock_end",
        "health_score", "dashboard_status"
    ]].rename(columns={
        "total_sales": "sales_qty",
        "avg_stock_end": "stock_end"
    })

    result["stock_end"] = result["stock_end"].round(1)

    return result.sort_values("health_score", ascending=False).to_dict(orient="records")


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
