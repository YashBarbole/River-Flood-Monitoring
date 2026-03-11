# import pandas as pd
# import numpy as np
# import joblib

# # Load trained model
# model = joblib.load("model.pkl")

# # Load datasheet
# df = pd.read_csv("data/river_level_FINAL.csv")

# # Convert & sort (safety)
# df["Data Time"] = pd.to_datetime(df["Data Time"], dayfirst=True)
# df = df.sort_values("Data Time")

# # Take last 3 REAL readings from datasheet
# levels = df["Data Value"].values
# last_levels = np.array([levels[-3:]])

# # Predict next water level
# predicted_level = model.predict(last_levels)[0]

# # Thresholds
# DANGER_LEVEL = 439.5
# WARNING_LEVEL = 439.2

# print("📊 Last 3 readings:", last_levels[0])
# print("📈 Predicted Water Level:", round(predicted_level, 3))

# if predicted_level >= DANGER_LEVEL:
#     print("🚨 DANGER ALERT: Flood risk!")
# elif predicted_level >= WARNING_LEVEL:
#     print("⚠️ WARNING: Water level rising")
# else:
#     print("✅ NORMAL: Water level safe")

import pandas as pd
import numpy as np
import joblib
from datetime import datetime

# Load trained model
model = joblib.load("model.pkl")

# Load and sort data
df = pd.read_csv("data/river_level_FINAL.csv")
df["Data Time"] = pd.to_datetime(df["Data Time"], dayfirst=True)
df = df.sort_values("Data Time").reset_index(drop=True)
df["Data Value"] = df["Data Value"].astype(float)

levels = df["Data Value"].values

# ── Take last 10 readings ────────────────────────────────
WINDOW_SIZE = 10
last_10 = levels[-WINDOW_SIZE:]

# ── Time features: use current hour & month ───────────────
now        = datetime.now()
next_hour  = now.hour
next_month = now.month

# ── Build input (must match training: 12 features) ────────
input_features = np.array([last_10.tolist() + [next_hour, next_month]])

# ── Predict ───────────────────────────────────────────────
predicted_level = model.predict(input_features)[0]

# ── Thresholds ────────────────────────────────────────────
DANGER_LEVEL  = 439.5
WARNING_LEVEL = 439.2

print("📊 Last 10 readings:", np.round(last_10, 3))
print(f"🕐 Current Hour: {next_hour}  |  Month: {next_month}")
print(f"📈 Predicted Water Level: {round(predicted_level, 3)} m")

if predicted_level >= DANGER_LEVEL:
    print("🚨 DANGER ALERT: Flood risk!")
elif predicted_level >= WARNING_LEVEL:
    print("⚠️  WARNING: Water level rising")
else:
    print("✅ NORMAL: Water level safe")