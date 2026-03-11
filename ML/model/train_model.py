# import pandas as pd
# import numpy as np
# from sklearn.linear_model import LinearRegression
# import joblib

# # Load CSV with correct encoding
# df = pd.read_csv("data/river_level_FINAL.csv")

# # Clean column names
# df.columns = df.columns.str.strip()

# # Convert time column
# df['Data Time'] = pd.to_datetime(df['Data Time'])

# # Extract water levels
# levels = df['Data Value'].values

# X = []
# y = []

# WINDOW_SIZE = 3

# for i in range(len(levels) - WINDOW_SIZE):
#     X.append(levels[i:i + WINDOW_SIZE])
#     y.append(levels[i + WINDOW_SIZE])

# X = np.array(X)
# y = np.array(y)

# # Train model
# model = LinearRegression()
# model.fit(X, y)

# # Save model
# joblib.dump(model, "model.pkl")

# print("✅ Model trained successfully and saved!")

import pandas as pd
import numpy as np
from sklearn.ensemble import RandomForestRegressor
from sklearn.metrics import mean_absolute_error
import joblib

print("📂 Loading CSV...")
df = pd.read_csv("data/river_level_FINAL.csv")
df.columns = df.columns.str.strip()

# Parse date and sort
df["Data Time"] = pd.to_datetime(df["Data Time"], dayfirst=True)
df = df.sort_values("Data Time").reset_index(drop=True)
df["Data Value"] = df["Data Value"].astype(float)

# ── NEW: Extract time features ──────────────────────────
df["hour"]  = df["Data Time"].dt.hour    # 0–23
df["month"] = df["Data Time"].dt.month   # 6–9 (June to Sept)

levels = df["Data Value"].values
hours  = df["hour"].values
months = df["month"].values

# ── Build training examples ──────────────────────────────
# Each example = last 10 water levels + hour + month of the prediction point
WINDOW_SIZE = 10

X = []
y = []

for i in range(len(levels) - WINDOW_SIZE):
    window      = levels[i : i + WINDOW_SIZE].tolist()   # 10 past readings
    next_hour   = hours[i + WINDOW_SIZE]                  # hour of what we're predicting
    next_month  = months[i + WINDOW_SIZE]                 # month of what we're predicting
    X.append(window + [next_hour, next_month])            # 12 features total
    y.append(levels[i + WINDOW_SIZE])

X = np.array(X)
y = np.array(y)

print(f"✅ Total training examples created: {len(X)}")

# ── Train / Test split (80% train, 20% test) ─────────────
split   = int(len(X) * 0.8)
X_train = X[:split];  y_train = y[:split]
X_test  = X[split:];  y_test  = y[split:]

# ── Train Random Forest ──────────────────────────────────
print("🌲 Training Random Forest model...")
model = RandomForestRegressor(n_estimators=100, random_state=42)
model.fit(X_train, y_train)

# ── Accuracy check ───────────────────────────────────────
predictions = model.predict(X_test)
mae = mean_absolute_error(y_test, predictions)
print(f"📊 Model Accuracy (MAE): {mae:.4f} meters")
print(f"   → On average, predictions are off by only {mae:.4f} m ({mae*100:.2f} cm)")

# ── Save model ───────────────────────────────────────────
joblib.dump(model, "model.pkl")
print("🎉 Model trained and saved as model.pkl")
