# 🌊 Flood Monitoring & Prediction System

A real-time flood monitoring dashboard built using IoT, Firebase, and React, designed to track water levels, visualize trends, and support future flood prediction using machine learning.

---

## 📌 Overview

The Flood Monitoring System continuously collects water level data from sensors connected via a GSM/4G module.  
This data is stored in Firebase Realtime Database and visualized on a modern, single-screen React dashboard.

The system is designed to help in:
- Early flood detection
- Real-time monitoring
- Historical trend analysis
- Future flood risk prediction

---

## 🏗️ System Architecture

Water Level Sensor
↓
GSM / 4G Module
↓
Firebase Realtime Database
↓
React Dashboard
↓
(Planned) ML Prediction Module


---

## ⚙️ Tech Stack

### Frontend
- React.js
- Recharts (data visualization)
- Modern UI with single-screen layout

### Backend / Cloud
- Firebase Realtime Database

### IoT
- GSM / 4G Module
- Water Level Sensor

### Machine Learning (Planned)
- Python
- Scikit-learn
- Regression-based time series prediction

---

## ✨ Features

### ✅ Implemented
- Real-time water level monitoring
- Automatic history logging
- Live trend graph
- Status classification (SAFE / WARNING / DANGER)
- Min & Max water level tracking
- Threshold indicators on graph
- Flood alert banner for danger levels
- Fixed location display (Solapur, Maharashtra)
- Live system time display
- Single-page dashboard (no scrolling)

### 🔮 Planned
- ML-based water level prediction
- Rainfall data integration using Weather APIs
- Flood risk forecasting
- Prediction card on dashboard

---

## 🧠 Machine Learning Concept (Planned)

The prediction module will use historical river water-level data (e.g., NWIC datasets) to forecast short-term water level changes.

**Inputs**
- Previous water levels
- Time intervals
- Rainfall data (optional)

**Output**
- Predicted future water level
- Flood risk classification

---

## 🔐 Firebase Configuration

Firebase configuration is stored locally in `src/firebase.js` and is excluded from GitHub for security reasons.

Example:
```js
export const database = getDatabase(app);



