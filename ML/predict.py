import numpy as np
import joblib
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, db

# ── Load model ────────────────────────────────────────────
model = joblib.load("model.pkl")

# ── Connect to Firebase ───────────────────────────────────
cred = credentials.Certificate("serviceAccountKey.json")  # your firebase key
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://flood-monitoring-489dd-default-rtdb.firebaseio.com" # your firebase URL
})

# ── Fetch last 10 readings from Firebase ─────────────────
ref = db.reference("floodHistory")
data = ref.order_by_key().limit_to_last(10).get()

if not data:
    print("❌ No data in Firebase yet!")
    exit()

# Extract waterLevel values sorted by key
readings = [item["waterLevel"] / 100 for item in data.values()]
last_10 = np.array(readings)

print("📊 Last 10 live readings:", np.round(last_10, 3))

# ── Time features ─────────────────────────────────────────
now        = datetime.now()
next_hour  = now.hour
next_month = now.month

print(f"🕐 Current Hour: {next_hour}  |  Month: {next_month}")

# ── Build input (12 features) ─────────────────────────────
input_features = np.array([last_10.tolist() + [next_hour, next_month]])

# ── Predict ───────────────────────────────────────────────
predicted_level = model.predict(input_features)[0]

# ── Thresholds ────────────────────────────────────────────
DANGER_LEVEL  = 439.5
WARNING_LEVEL = 439.2

print(f"📈 Predicted Water Level (in ~15 min): {round(predicted_level, 3)} m")

if predicted_level >= DANGER_LEVEL:
    print("🚨 DANGER ALERT: Flood risk!")
elif predicted_level >= WARNING_LEVEL:
    print("⚠️  WARNING: Water level rising")
else:
    print("✅ NORMAL: Water level safe")