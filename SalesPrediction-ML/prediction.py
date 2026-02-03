import pandas as pd
import numpy as np
import joblib

from sklearn.ensemble import RandomForestRegressor
from sklearn.preprocessing import LabelEncoder
from sklearn.metrics import mean_absolute_error, mean_squared_error, r2_score

df = pd.read_excel("Furniture_Dataset.xlsx")

df["Month"] = pd.to_datetime(df["Month"], format="%b-%Y", errors="coerce")

if df["Month"].isna().any():
    raise ValueError("Month parsing failed")

df["Month_Num"] = df["Month"].dt.month
df["Year"] = df["Month"].dt.year

df["Product_Family"] = df["Product_ID"].apply(
    lambda x: "-".join(str(x).split("-")[:-1])
)

df = df.sort_values(
    by=["Product_Family", "Year", "Month_Num"]
).reset_index(drop=True)

le = LabelEncoder()
df["Product_Family_Encoded"] = le.fit_transform(df["Product_Family"])

FEATURES = [
    "Product_Family_Encoded",
    "Month_Num",
    "Year",
    "Price",
    "Discount",
    "Sales_Last_Month_Family_Qty",
    "Sales_2_Months_Ago_Family_Qty",
    "Last_Year_Total_Sales_Family_Qty",
]

TARGET = "Target_Quantity_Next_Month"

df = df.dropna(subset=FEATURES + [TARGET])
df = df[df[TARGET] >= 0]

unique_months = sorted(df["Month"].unique())
forecast_months = unique_months[-2:]

train_df = df[~df["Month"].isin(forecast_months)]
test_df = df[df["Month"].isin(forecast_months)]

if train_df.empty or test_df.empty:
    raise ValueError("Train/Test split failed")

X_train = train_df[FEATURES]
y_train = train_df[TARGET]

X_test = test_df[FEATURES]
y_test = test_df[TARGET]

model = RandomForestRegressor(
    n_estimators=400,
    max_depth=18,
    min_samples_split=4,
    min_samples_leaf=2,
    max_features="sqrt",
    random_state=42,
    n_jobs=-1
)

model.fit(X_train, y_train)

y_pred = model.predict(X_test)
y_pred = np.round(y_pred).astype(int)
y_pred[y_pred < 0] = 0

mae = mean_absolute_error(y_test, y_pred)
rmse = np.sqrt(mean_squared_error(y_test, y_pred))
r2 = r2_score(y_test, y_pred)

print("\nRANDOM FOREST LAST 2 MONTH FORECAST TEST")
print(f"MAE  : {mae:.2f}")
print(f"RMSE : {rmse:.2f}")
print(f"R²   : {r2:.3f}")

results = test_df[["Month", "Product_Family"]].copy()
results["Actual_Qty"] = y_test.values
results["Predicted_Qty"] = y_pred
results["Error"] = results["Predicted_Qty"] - results["Actual_Qty"]

print("\nSAMPLE FORECAST RESULTS")
print(results.head(20))

summary = (
    results.groupby("Product_Family")
    .agg(
        Avg_Actual=("Actual_Qty", "mean"),
        Avg_Predicted=("Predicted_Qty", "mean"),
        Avg_Error=("Error", "mean"),
    )
    .round(2)
)

print("\nPRODUCT-WISE FORECAST SUMMARY")
print(summary)

train_pred = model.predict(X_train)
train_r2 = r2_score(y_train, train_pred)
print(f"Training R² (Memory) : {train_r2:.3f}")

print("\nSAVING MODEL FOR PRODUCTION...")

artifacts = {
    "model": model,
    "encoder": le,
    "features": FEATURES
}

joblib.dump(artifacts, "furniture_sales_model.joblib")

print("Success!")