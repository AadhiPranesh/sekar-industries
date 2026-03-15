from pathlib import Path

import pandas as pd
from fastapi import FastAPI, HTTPException, Query
from fastapi.middleware.cors import CORSMiddleware

app = FastAPI()

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

BASE_DIR = Path(__file__).resolve().parent
BACKEND_DATA_DIR = BASE_DIR.parent / "backend" / "data"
DYNAMIC_DATA_PATH = BACKEND_DATA_DIR / "furniture_dynamic_dataset_365days_forward.csv"
STATIC_DATA_PATH = BACKEND_DATA_DIR / "static_dataset.csv"

dynamic_df = None
static_df = None

FRONTEND_TO_DATASET_PRODUCT_ID = {
    "BD-FL-PR-01": "P006",
    "BD-FL-SG-01": "P002",
    "BD-FL-ST-01": "P009",
    "BD-FL-DB-01": "P011",
    "BD-FL-CT-01": "P008",
    "BD-FL-NW-01": "P007",
    "CH-ST-VS-01": "P017",
    "CH-ST-ST-01": "P014",
    "CH-ST-WR-01": "P012",
    "CH-ST-RN-01": "P015",
    "CH-ST-LB-01": "P013",
    "CH-ST-NR-01": "P014",
    "CH-OF-ST-01": "P015",
    "CH-ST-VS-02": "P012",
    "CH-ST-LB-02": "P013",
    "TB-WD-TK-01": "P023",
    "TB-WD-MJ-01": "P020",
    "TB-WD-RC-01": "P023",
    "TB-WD-RC-02": "P023",
    "WK-MS-MV-01": "P016",
}


def resolve_dataset_product_id(product_id: str) -> str | None:
    if product_id in FRONTEND_TO_DATASET_PRODUCT_ID:
        return FRONTEND_TO_DATASET_PRODUCT_ID[product_id]

    if static_df is not None and product_id in set(static_df["product_id"].tolist()):
        return product_id

    return None


def build_monthly_sales(product_rows: pd.DataFrame) -> pd.DataFrame:
    monthly = (
        product_rows.sort_values("date")
        .groupby(pd.Grouper(key="date", freq="MS"))
        .agg(
            sales_qty=("sales_qty", "sum"),
            revenue=("revenue", "sum"),
            selling_price=("selling_price", "mean"),
            stock_end=("stock_end", "last"),
        )
        .reset_index()
    )
    return monthly


def get_same_month_last_year_quantity(monthly: pd.DataFrame, target_month: pd.Timestamp):
    last_year_month = target_month - pd.DateOffset(years=1)
    match = monthly.loc[monthly["date"] == last_year_month, "sales_qty"]
    if match.empty:
        return None
    return int(round(float(match.iloc[0])))


def estimate_next_month_sales(monthly: pd.DataFrame, same_month_last_year):
    recent_window = monthly["sales_qty"].tail(min(3, len(monthly)))
    recent_average = recent_window.mean() if not recent_window.empty else 0
    last_month_sales = float(monthly["sales_qty"].iloc[-1]) if not monthly.empty else 0
    previous_month_sales = float(monthly["sales_qty"].iloc[-2]) if len(monthly) > 1 else last_month_sales
    momentum = last_month_sales - previous_month_sales

    forecast = (recent_average * 0.6) + (last_month_sales * 0.25) + (momentum * 0.15)
    if same_month_last_year is not None:
        forecast = (forecast * 0.65) + (same_month_last_year * 0.35)

    return max(0, int(round(forecast)))


def minmax(series: pd.Series) -> pd.Series:
    rng = series.max() - series.min()
    if rng <= 0:
        return pd.Series([50.0] * len(series), index=series.index)
    return ((series - series.min()) / rng) * 100


def get_status(score: float) -> str:
    if score >= 80:
        return "Selling Fast"
    if score >= 60:
        return "Growing"
    if score >= 40:
        return "Steady Sales"
    if score >= 20:
        return "Slow Moving"
    return "Not Moving"

@app.on_event("startup")
def load_artifacts():
    global dynamic_df, static_df
    print("Loading backend CSV datasets for prediction service")

    try:
        dynamic_df = pd.read_csv(DYNAMIC_DATA_PATH)
        dynamic_df.columns = dynamic_df.columns.str.strip().str.lower()
        dynamic_df["product_id"] = dynamic_df["product_id"].astype(str).str.strip()
        dynamic_df["date"] = pd.to_datetime(dynamic_df["date"], format="%d-%m-%Y", errors="coerce")
        dynamic_df = dynamic_df.dropna(subset=["date"]).copy()

        static_df = pd.read_csv(STATIC_DATA_PATH)
        static_df.columns = static_df.columns.str.strip().str.lower()
        static_df["product_id"] = static_df["product_id"].astype(str).str.strip()

        print(f"Dynamic rows loaded: {len(dynamic_df)}")
        print(f"Static rows loaded: {len(static_df)}")

    except Exception as e:
        print(f"Startup Error: {e}")

@app.get("/dashboard/{product_id}")
def get_dashboard_data(product_id: str):
    global dynamic_df, static_df

    if dynamic_df is None or static_df is None:
        raise HTTPException(status_code=503, detail="Prediction dataset not loaded")

    dataset_product_id = resolve_dataset_product_id(product_id)
    if not dataset_product_id:
        raise HTTPException(status_code=404, detail=f"No dataset mapping found for {product_id}")

    product_rows = dynamic_df[dynamic_df["product_id"] == dataset_product_id].copy()
    if product_rows.empty:
        raise HTTPException(status_code=404, detail=f"No sales history found for {dataset_product_id}")

    monthly = build_monthly_sales(product_rows)
    if monthly.empty:
        raise HTTPException(status_code=404, detail=f"No monthly sales history found for {dataset_product_id}")

    last_row = monthly.iloc[-1]
    next_month = last_row["date"] + pd.DateOffset(months=1)
    same_month_last_year = get_same_month_last_year_quantity(monthly, next_month)
    predicted_quantity = estimate_next_month_sales(monthly, same_month_last_year)
    current_stock = int(product_rows.sort_values("date").iloc[-1]["stock_end"])
    current_price = float(last_row["selling_price"])
    history_graph = [
        {
            "date": row["date"].strftime("%b %Y"),
            "sales": int(round(row["sales_qty"])),
            "revenue": int(round(row["revenue"])),
        }
        for _, row in monthly.tail(12).iterrows()
    ]

    comparison_note = (
        f"Compared against {next_month.strftime('%b %Y')} last-year month."
        if same_month_last_year is not None
        else "Prediction available, but previous-year same-month comparison is not available in the dataset."
    )

    return {
        "product_id": product_id,
        "dataset_product_id": dataset_product_id,
        "source": "backend-csv",
        "current_price": current_price,
        "current_stock": current_stock,
        "history_graph": history_graph,
        "comparison": {
            "available": same_month_last_year is not None,
            "same_month_last_year_quantity": same_month_last_year,
            "note": comparison_note,
        },
        "prediction": {
            "date": next_month.strftime("%b %Y"),
            "predicted_quantity": predicted_quantity,
            "predicted_revenue": round(predicted_quantity * current_price, 2),
        },
    }


@app.get("/api/product-health")
def get_product_health():
    global dynamic_df, static_df

    if dynamic_df is None or static_df is None:
        raise HTTPException(status_code=503, detail="Prediction dataset not loaded")

    health_df = dynamic_df.copy()
    health_df["stock_turnover"] = health_df["sales_qty"] / health_df["stock_start"].replace(0, 1)

    agg = (
        health_df.groupby("product_id")
        .agg(
            total_sales=("sales_qty", "sum"),
            avg_profit=("profit", "mean"),
            avg_turnover=("stock_turnover", "mean"),
            total_revenue=("revenue", "sum"),
            avg_stock_end=("stock_end", "mean"),
        )
        .reset_index()
    )

    merged = pd.merge(
        agg,
        static_df[["product_id", "product_name"]],
        on="product_id",
        how="left",
    )

    merged["sales_score"] = minmax(merged["total_sales"])
    merged["profit_score"] = minmax(merged["avg_profit"])
    merged["turnover_score"] = minmax(merged["avg_turnover"])
    merged["health_score"] = (
        0.4 * merged["sales_score"]
        + 0.3 * merged["profit_score"]
        + 0.3 * merged["turnover_score"]
    ).round(1)
    merged["dashboard_status"] = merged["health_score"].apply(get_status)

    result = merged[
        [
            "product_id",
            "product_name",
            "total_sales",
            "avg_stock_end",
            "health_score",
            "dashboard_status",
        ]
    ].rename(
        columns={
            "total_sales": "sales_qty",
            "avg_stock_end": "stock_end",
        }
    )

    result["stock_end"] = result["stock_end"].round(1)
    return result.sort_values("health_score", ascending=False).to_dict(orient="records")


def build_product_summaries() -> pd.DataFrame:
    if dynamic_df is None or static_df is None:
        return pd.DataFrame()

    sales_summary = (
        dynamic_df.sort_values("date")
        .groupby("product_id")
        .agg(
            total_sales=("sales_qty", "sum"),
            total_revenue=("revenue", "sum"),
            current_stock=("stock_end", "last"),
            last_price=("selling_price", "last"),
        )
        .reset_index()
    )

    merged = pd.merge(
        sales_summary,
        static_df,
        on="product_id",
        how="left",
        suffixes=("", "_static"),
    )

    predicted_quantities = []
    for _, row in merged.iterrows():
        product_rows = dynamic_df[dynamic_df["product_id"] == row["product_id"]].copy()
        monthly = build_monthly_sales(product_rows)
        if monthly.empty:
            predicted_quantities.append(0)
            continue

        next_month = monthly.iloc[-1]["date"] + pd.DateOffset(months=1)
        same_month_last_year = get_same_month_last_year_quantity(monthly, next_month)
        predicted_quantities.append(estimate_next_month_sales(monthly, same_month_last_year))

    merged["predicted_next_month_qty"] = predicted_quantities
    merged["effective_price"] = merged["selling_price"].fillna(merged["last_price"]).fillna(0)
    return merged


def build_combo_item(row: pd.Series):
    return {
        "product_id": row["product_id"],
        "product_name": row.get("product_name", "Unknown Product"),
        "category": row.get("category", "General"),
        "brand": row.get("brand", ""),
        "material": row.get("material", ""),
        "selling_price": float(row.get("effective_price", 0)),
        "current_stock": int(round(float(row.get("current_stock", 0)))),
        "total_sales": int(round(float(row.get("total_sales", 0)))),
        "predicted_next_month_qty": int(round(float(row.get("predicted_next_month_qty", 0)))),
    }

@app.get("/combo")
def get_combo_offers(product_id: str | None = Query(default=None, description="Optional dataset product_id filter")):
    if dynamic_df is None or static_df is None:
        raise HTTPException(status_code=503, detail="Prediction dataset not loaded")

    summary = build_product_summaries()
    if summary.empty:
        return []

    top = summary.sort_values(["predicted_next_month_qty", "total_sales"], ascending=False).reset_index(drop=True)
    slow = summary.sort_values(["predicted_next_month_qty", "current_stock"], ascending=[True, False]).reset_index(drop=True)

    combos = []
    used_pairs = set()
    max_combos = min(3, len(top), len(slow))

    for i in range(max_combos):
        fast_item = top.iloc[i]

        slow_item = None
        for _, candidate in slow.iterrows():
            if candidate["product_id"] != fast_item["product_id"]:
                slow_item = candidate
                break

        if slow_item is None:
            continue

        pair_key = tuple(sorted([fast_item["product_id"], slow_item["product_id"]]))
        if pair_key in used_pairs:
            continue
        used_pairs.add(pair_key)

        item1 = build_combo_item(fast_item)
        item2 = build_combo_item(slow_item)

        original_price = item1["selling_price"] + item2["selling_price"]
        discount_rate = min(0.12 + (i * 0.02), 0.18)
        combo_price = round(original_price * (1 - discount_rate), 2)
        discount_amount = max(0, original_price - combo_price)
        discount_percent = int(round((discount_amount / original_price) * 100)) if original_price else 0

        combo = {
            "combo_id": i + 1,
            "id": f"COMBO{i + 1:03d}",
            "name": f"{item1['category']} + {item2['category']} Smart Bundle",
            "description": f"{item1['product_name']} + {item2['product_name']}",
            "items": [item1["product_id"], item2["product_id"]],
            "product_1": item1["product_name"],
            "product_1_id": item1["product_id"],
            "product_1_category": item1["category"],
            "product_1_price": int(round(item1["selling_price"])),
            "product_2": item2["product_name"],
            "product_2_id": item2["product_id"],
            "product_2_category": item2["category"],
            "product_2_price": int(round(item2["selling_price"])),
            "combo_price": combo_price,
            "originalPrice": int(round(original_price)),
            "discountedPrice": combo_price,
            "discount": discount_percent,
            "prediction_context": {
                "product_1": {
                    "total_sales": item1["total_sales"],
                    "predicted_next_month_qty": item1["predicted_next_month_qty"],
                    "current_stock": item1["current_stock"],
                },
                "product_2": {
                    "total_sales": item2["total_sales"],
                    "predicted_next_month_qty": item2["predicted_next_month_qty"],
                    "current_stock": item2["current_stock"],
                },
            },
            "product_details": {
                item1["product_id"]: item1,
                item2["product_id"]: item2,
            },
        }
        combos.append(combo)

    if product_id:
        product_id = product_id.strip()
        combos = [c for c in combos if product_id in c.get("items", [])]

        product_match = summary[summary["product_id"] == product_id]
        if not product_match.empty:
            details = build_combo_item(product_match.iloc[0])
            return {
                "search_product_id": product_id,
                "search_product_details": details,
                "combos": combos,
            }

        return {
            "search_product_id": product_id,
            "search_product_details": None,
            "combos": combos,
        }

    return combos