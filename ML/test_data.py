import firebase_admin
from firebase_admin import credentials, db
import time

# Connect Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://flood-monitoring-489dd-default-rtdb.firebaseio.com"
})

# 10 varied readings in cm
test_readings = [20, 35, 42, 55, 48, 62, 70, 58, 45, 38]

for reading in test_readings:
    db.reference("floodHistory").push({
        "waterLevel": reading,
        "timestamp": int(time.time() * 1000)  # ✅ milliseconds fixed!
    })
    print(f"✅ Added: {reading} cm")
    time.sleep(1)

print("🎉 Done! Firebase now has 10 readings")