import { useEffect, useState } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebase";

import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
} from "recharts";

function App() {
  const [waterLevel, setWaterLevel] = useState(0);
  const [history, setHistory] = useState([]);
  const [status, setStatus] = useState("SAFE");
  const [time, setTime] = useState(new Date());

  /* LIVE DATA */
  useEffect(() => {
    const liveRef = ref(database, "floodData");
    onValue(liveRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.waterLevel !== undefined) {
        setWaterLevel(data.waterLevel);
      }
    });
  }, []);

  /* AUTO HISTORY LOGGING */
  useEffect(() => {
    if (waterLevel === 0) return;
    const historyRef = ref(database, "floodHistory");
    push(historyRef, {
      waterLevel,
      timestamp: Date.now(),
    });
  }, [waterLevel]);

  /* HISTORY DATA */
  useEffect(() => {
    const historyRef = ref(database, "floodHistory");
    onValue(historyRef, (snapshot) => {
      const data = snapshot.val();
      if (!data) return;

      const formatted = Object.values(data)
        .map((value, index) => ({
          index: index + 1,
          level: value.waterLevel,
        }))
        .filter(item => item.level !== undefined);

      setHistory(formatted);
    });
  }, []);

  /* STATUS LOGIC */
  useEffect(() => {
    if (waterLevel < 40) setStatus("SAFE");
    else if (waterLevel < 70) setStatus("WARNING");
    else setStatus("DANGER");
  }, [waterLevel]);

  /* LIVE CLOCK */
  useEffect(() => {
    const timer = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(timer);
  }, []);

  const statusColor =
    status === "SAFE"
      ? "#22c55e"
      : status === "WARNING"
      ? "#facc15"
      : "#ef4444";

  const minLevel = history.length ? Math.min(...history.map(h => h.level)) : "-";
  const maxLevel = history.length ? Math.max(...history.map(h => h.level)) : "-";

  return (
    <div style={styles.page}>

      {/* 🔒 FIXED SCREEN TOP-RIGHT */}
      <div style={styles.fixedTopRight}>
        <span style={styles.fixedLocation}>📍 Solapur, Maharashtra</span>
        <span style={styles.fixedTime}>{time.toLocaleTimeString()}</span>
      </div>

      <div style={styles.container}>

        {/* HEADER */}
        <div style={styles.headerCenter}>
          {/* <span style={styles.logo}>🌊</span> */}
          <h1 style={styles.heading}>Flood Monitoring Dashboard</h1>
        </div>

        {/* ALERT */}
        {status === "DANGER" && (
          <div style={styles.alert}>
            ⚠ Flood Risk Detected — Take Immediate Action
          </div>
        )}

        {/* MAIN CARD */}
        <div style={styles.mainCard}>
          <p style={styles.cardTitle}>Current Water Level</p>

          <div style={styles.levelRow}>
            <span style={styles.levelValue}>{waterLevel}</span>
            <span style={styles.unit}>cm</span>
          </div>

          <span style={{ ...styles.statusBadge, backgroundColor: statusColor }}>
            {status}
          </span>

          <div style={styles.minMaxRow}>
            <span>Min: {minLevel} cm</span>
            <span>Max: {maxLevel} cm</span>
          </div>
        </div>

        {/* GRAPH */}
        <div style={styles.graphCard}>
          <p style={styles.graphTitle}>Water Level Trend</p>

       <ResponsiveContainer width="100%" height={150}>
            <LineChart data={history}>
              <XAxis dataKey="index" />
              <YAxis />
              <Tooltip />
              <ReferenceLine y={40} stroke="#facc15" strokeDasharray="3 3" />
              <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" />
              <Line
                type="monotone"
                dataKey="level"
                stroke="#38bdf8"
                strokeWidth={3}
                dot={{ r: 3 }}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

      </div>
    </div>
  );
}

/* STYLES */
const styles = {
page: {
  height: "100vh",              // 👈 fixed height
  background: "radial-gradient(circle at top, #020617, #000)",
  fontFamily: "'Inter', system-ui, sans-serif",
  color: "#e5e7eb",
  overflow: "hidden",           // 👈 NO SCROLL
},

  fixedTopRight: {
    position: "fixed",
    top: "16px",
    right: "20px",
    display: "flex",
    flexDirection: "column",
    alignItems: "flex-end",
    fontSize: "12px",
    color: "#94a3b8",
    zIndex: 9999,
  },

  fixedLocation: { fontSize: "12px" },
  fixedTime: { fontSize: "11px", opacity: 0.8 },

container: {
  maxWidth: "420px",
  margin: "0 auto",
  padding: "16px",              // reduced from 24px
},

  headerCenter: {
    display: "flex",
    justifyContent: "center",
    gap: "10px",
    marginBottom: "16px",
  },

  logo: { fontSize: "28px" },
  heading: { fontSize: "20px", fontWeight: "600" },


alert: {
  background: "rgba(239,68,68,0.15)",
  border: "1px solid #ef4444",
  padding: "6px 10px",
  borderRadius: "10px",
  fontSize: "12px",
  marginBottom: "8px",          // reduced
},

mainCard: {
  background: "#020617",
  borderRadius: "16px",
  padding: "16px",              // reduced
  textAlign: "center",
  marginBottom: "10px",         // reduced
},


  cardTitle: { fontSize: "14px", color: "#94a3b8" },
  levelRow: { display: "flex", justifyContent: "center", gap: "6px" },
  levelValue: { fontSize: "46px", fontWeight: "600" },
  unit: { fontSize: "16px", color: "#94a3b8" },

  statusBadge: {
    padding: "6px 14px",
    borderRadius: "999px",
    fontSize: "12px",
    fontWeight: "600",
    color: "#020617",
    marginTop: "8px",
  },

  minMaxRow: {
    display: "flex",
    justifyContent: "space-between",
    fontSize: "12px",
    color: "#94a3b8",
    marginTop: "8px",
  },

graphCard: {
  background: "#020617",
  borderRadius: "16px",
  padding: "12px",              // reduced
},

  graphTitle: { fontSize: "14px", color: "#94a3b8" },

  heading: {
  fontSize: "18px",
  fontWeight: "600",
},
};

export default App;
