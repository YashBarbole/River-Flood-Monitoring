# # from flask import Flask, jsonify
# # from flask_cors import CORS
# # import pandas as pd
# # import numpy as np
# # import joblib

# # app = Flask(__name__)

# # # ✅ ENABLE CORS FOR ALL ROUTES
# # CORS(app)

# # # Load trained ML model
# # model = joblib.load("model.pkl")

# # DANGER_LEVEL = 439.5
# # WARNING_LEVEL = 439.2

# # @app.route("/predict", methods=["GET"])
# # def predict():
# #     df = pd.read_csv("data/river_level_FINAL.csv")
# #     df["Data Time"] = pd.to_datetime(df["Data Time"], dayfirst=True)

# #     levels = df["Data Value"].values
# #     last_levels = np.array([levels[-3:]])

# #     predicted = model.predict(last_levels)[0]

# #     status = "SAFE"
# #     if predicted >= DANGER_LEVEL:
# #         status = "DANGER"
# #     elif predicted >= WARNING_LEVEL:
# #         status = "WARNING"

# #     return jsonify({
# #         "predictedLevel": round(float(predicted), 2),
# #         "status": status
# #     })

# # if __name__ == "__main__":
# #     app.run(debug=True)

# from flask import Flask, jsonify
# from flask_cors import CORS
# import pandas as pd
# import numpy as np
# import joblib
# from datetime import datetime

# app = Flask(__name__)
# CORS(app)

# # Load model once at startup
# model = joblib.load("model.pkl")

# DANGER_LEVEL  = 439.5
# WARNING_LEVEL = 439.2
# WINDOW_SIZE   = 10

# @app.route("/predict", methods=["GET"])
# def predict():
#     # Load fresh data every call (picks up new Firebase-written CSV or live data)
#     df = pd.read_csv("data/river_level_FINAL.csv")
#     df["Data Time"] = pd.to_datetime(df["Data Time"], dayfirst=True)
#     df = df.sort_values("Data Time").reset_index(drop=True)
#     df["Data Value"] = df["Data Value"].astype(float)

#     levels = df["Data Value"].values

#     # Last 10 readings
#     last_10 = levels[-WINDOW_SIZE:]

#     # Time features
#     now        = datetime.now()
#     next_hour  = now.hour
#     next_month = now.month

#     # Build input (12 features — must match training)
#     input_features = np.array([last_10.tolist() + [next_hour, next_month]])

#     # Predict
#     predicted = model.predict(input_features)[0]

#     # Status
#     if predicted >= DANGER_LEVEL:
#         status = "DANGER"
#     elif predicted >= WARNING_LEVEL:
#         status = "WARNING"
#     else:
#         status = "SAFE"

#     return jsonify({
#         "predictedLevel": round(float(predicted), 2),
#         "status": status,
#         "last10Readings": [round(float(v), 3) for v in last_10],
#         "usedHour": next_hour,
#         "usedMonth": next_month
#     })

# if __name__ == "__main__":
#     app.run(debug=True)

from flask import Flask, jsonify
from flask_cors import CORS
import numpy as np
import joblib
from datetime import datetime
import firebase_admin
from firebase_admin import credentials, db

app = Flask(__name__)
CORS(app)

# Load model
model = joblib.load("model.pkl")

# Connect Firebase
cred = credentials.Certificate("serviceAccountKey.json")
firebase_admin.initialize_app(cred, {
    "databaseURL": "https://flood-monitoring-489dd-default-rtdb.firebaseio.com"
})

DANGER_LEVEL  = 439.5
WARNING_LEVEL = 439.2

@app.route("/predict", methods=["GET"])
def predict():
    # ✅ Fetch last 10 from Firebase
    ref = db.reference("floodHistory")
    data = ref.order_by_key().limit_to_last(10).get()

    if not data or len(data) < 10:
        return jsonify({"error": "Not enough data yet"}), 400

    # Extract values
    readings = [item["waterLevel"] / 100 for item in data.values()]
    last_10 = np.array(readings)

    # Time features
    now = datetime.now()
    input_features = np.array([last_10.tolist() + [now.hour, now.month]])

    # Predict
    predicted = float(model.predict(input_features)[0])

    if predicted >= DANGER_LEVEL:
        status = "DANGER"
    elif predicted >= WARNING_LEVEL:
        status = "WARNING"
    else:
        status = "SAFE"

    return jsonify({
        "predictedLevel": round(predicted, 2),
        "status": status
    })

if __name__ == "__main__":
    app.run(debug=True)
