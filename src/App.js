import { useEffect, useState, useMemo } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebase";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine,
} from "recharts";

/* ─── STYLES ─── */
const injectStyles = () => {
  if (document.getElementById("fmd-styles")) return;
  const s = document.createElement("style");
  s.id = "fmd-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=Space+Mono:wght@400;700&family=Syne:wght@600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --safe:   #00e5a0;
      --warn:   #f59e0b;
      --danger: #f43f5e;
      --accent: #38bdf8;
      --bg:     #020b18;
      --panel:  #040f1f;
      --border: rgba(56,189,248,0.12);
      --muted:  #4a6080;
      --text:   #cdd9e8;
    }

    @keyframes pulse-ring {
      0%   { transform: scale(0.9); opacity: 0.7; }
      70%  { transform: scale(1.35); opacity: 0; }
      100% { transform: scale(1.35); opacity: 0; }
    }
    @keyframes scanline {
      0%   { transform: translateY(-100%); }
      100% { transform: translateY(100vh); }
    }
    @keyframes blink { 0%,100% { opacity: 1; } 50% { opacity: 0; } }
    @keyframes fadeUp {
      from { opacity: 0; transform: translateY(10px); }
      to   { opacity: 1; transform: translateY(0); }
    }
    @keyframes slideIn {
      from { opacity: 0; transform: translateX(-6px); }
      to   { opacity: 1; transform: translateX(0); }
    }

    .fmd-page {
      height: 100vh; width: 100vw; overflow: hidden;
      background: var(--bg); font-family: 'Syne', sans-serif;
      color: var(--text); display: flex; flex-direction: column; position: relative;
    }
    .fmd-page::before {
      content: ''; position: fixed; inset: 0;
      background-image:
        linear-gradient(rgba(56,189,248,0.03) 1px, transparent 1px),
        linear-gradient(90deg, rgba(56,189,248,0.03) 1px, transparent 1px);
      background-size: 44px 44px; pointer-events: none; z-index: 0;
    }
    .fmd-scanline {
      position: fixed; top: 0; left: 0; right: 0; height: 2px;
      background: linear-gradient(90deg, transparent, rgba(56,189,248,0.2), transparent);
      animation: scanline 7s linear infinite; pointer-events: none; z-index: 1;
    }

    .fmd-header {
      position: relative; z-index: 2; flex-shrink: 0;
      display: flex; align-items: center; justify-content: space-between;
      padding: 13px 24px 11px; border-bottom: 1px solid var(--border);
      animation: fadeUp 0.5s ease both;
    }
    .fmd-header-left { display: flex; flex-direction: column; gap: 2px; }
    .fmd-title { font-size: 16px; font-weight: 800; letter-spacing: 0.06em; color: #e8f4ff; text-transform: uppercase; }
    .fmd-subtitle { font-family: 'Space Mono', monospace; font-size: 9px; color: var(--muted); letter-spacing: 0.14em; text-transform: uppercase; }
    .fmd-header-right { display: flex; flex-direction: column; align-items: flex-end; gap: 2px; }
    .fmd-location { font-family: 'Space Mono', monospace; font-size: 10px; color: var(--accent); letter-spacing: 0.06em; }
    .fmd-time { font-family: 'Space Mono', monospace; font-size: 14px; font-weight: 700; color: #e8f4ff; letter-spacing: 0.1em; }

    .fmd-alert {
      position: relative; z-index: 2; flex-shrink: 0;
      display: flex; align-items: center; gap: 10px;
      background: rgba(244,63,94,0.08); border-bottom: 1px solid rgba(244,63,94,0.35);
      border-left: 3px solid var(--danger); padding: 7px 24px;
      font-family: 'Space Mono', monospace; font-size: 10px; color: #fca5a5; letter-spacing: 0.06em;
      animation: fadeUp 0.3s ease both;
    }
    .fmd-alert-dot { width: 7px; height: 7px; border-radius: 50%; background: var(--danger); flex-shrink: 0; animation: blink 1s ease infinite; }

    .fmd-body {
      position: relative; z-index: 2; flex: 1; min-height: 0;
      display: grid; grid-template-columns: 300px 1fr; gap: 12px;
      padding: 12px 20px; animation: fadeUp 0.6s ease 0.1s both;
    }

    .fmd-left { display: flex; flex-direction: column; gap: 10px; min-height: 0; }
    .fmd-main-card {
      background: var(--panel); border: 1px solid var(--border);
      border-radius: 14px; padding: 16px 18px; position: relative; overflow: hidden; flex-shrink: 0;
    }
    .fmd-main-card::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent);
    }
    .fmd-card-label {
      font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.16em;
      color: var(--muted); text-transform: uppercase; margin-bottom: 10px;
      display: flex; align-items: center; gap: 8px;
    }
    .fmd-card-label::before { content: ''; display: inline-block; width: 16px; height: 1px; background: var(--accent); opacity: 0.5; }
    .fmd-level-block { display: flex; align-items: flex-end; justify-content: center; gap: 5px; margin-bottom: 4px; }
    .fmd-level-num { font-family: 'Space Mono', monospace; font-size: 64px; font-weight: 700; line-height: 1; color: #f0f9ff; letter-spacing: -2px; }
    .fmd-level-unit { font-family: 'Space Mono', monospace; font-size: 16px; color: var(--muted); padding-bottom: 8px; }
    .fmd-predict {
      display: flex; align-items: center; justify-content: center; gap: 8px;
      background: rgba(56,189,248,0.05); border: 1px solid rgba(56,189,248,0.12);
      border-radius: 8px; padding: 7px 12px; margin: 8px 0;
      font-family: 'Space Mono', monospace; font-size: 10px; color: var(--muted);
    }
    .fmd-predict-val { color: var(--accent); font-weight: 700; }
    .fmd-badge-row { display: flex; justify-content: center; margin: 8px 0 2px; }
    .fmd-badge {
      display: flex; align-items: center; gap: 8px; padding: 6px 20px; border-radius: 999px;
      font-family: 'Space Mono', monospace; font-size: 11px; font-weight: 700;
      letter-spacing: 0.12em; text-transform: uppercase;
    }
    .fmd-badge-ring { width: 8px; height: 8px; border-radius: 50%; }

    .fmd-stats-row { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; }
    .fmd-stat {
      background: rgba(56,189,248,0.04); border: 1px solid var(--border);
      border-radius: 10px; padding: 10px 14px; display: flex; flex-direction: column; gap: 3px;
    }
    .fmd-stat-label { font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.12em; color: var(--muted); text-transform: uppercase; }
    .fmd-stat-val { font-family: 'Space Mono', monospace; font-size: 22px; font-weight: 700; color: #e8f4ff; }
    .fmd-stat-unit { font-size: 11px; color: var(--muted); font-weight: 400; }

    /* GRAPH */
    .fmd-graph-card {
      background: var(--panel); border: 1px solid var(--border);
      border-radius: 14px; padding: 14px 12px 6px;
      position: relative; overflow: hidden;
      display: flex; flex-direction: column; min-height: 0;
    }
    .fmd-graph-card::after {
      content: ''; position: absolute; top: 0; left: 0; right: 0; height: 1px;
      background: linear-gradient(90deg, transparent, rgba(56,189,248,0.3), transparent);
    }
    .fmd-graph-header {
      display: flex; align-items: flex-start; justify-content: space-between;
      margin-bottom: 8px; flex-shrink: 0; gap: 10px;
    }
    .fmd-graph-header-left { display: flex; flex-direction: column; gap: 7px; min-width: 0; }
    .fmd-graph-title {
      font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.16em;
      color: var(--muted); text-transform: uppercase;
      display: flex; align-items: center; gap: 8px; flex-shrink: 0;
    }
    .fmd-graph-title::before { content: ''; display: inline-block; width: 16px; height: 1px; background: var(--accent); opacity: 0.5; }

    /* DATE DROPDOWN */
    .fmd-date-select-wrap {
      display: flex; align-items: center; gap: 8px;
      animation: slideIn 0.3s ease both;
    }
    .fmd-date-select-label {
      font-family: 'Space Mono', monospace; font-size: 9px;
      color: var(--muted); letter-spacing: 0.1em; white-space: nowrap; text-transform: uppercase;
    }
    .fmd-date-select {
      font-family: 'Space Mono', monospace; font-size: 10px; letter-spacing: 0.04em;
      color: var(--accent); background: rgba(56,189,248,0.07);
      border: 1px solid rgba(56,189,248,0.28); border-radius: 8px;
      padding: 4px 30px 4px 10px; cursor: pointer; outline: none;
      appearance: none; -webkit-appearance: none;
      background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6' viewBox='0 0 10 6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%2338bdf8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat: no-repeat; background-position: right 9px center;
      transition: border-color 0.18s, background-color 0.18s;
    }
    .fmd-date-select:hover, .fmd-date-select:focus {
      border-color: var(--accent); background-color: rgba(56,189,248,0.13);
    }
    .fmd-date-select option { background: #061428; color: #e8f4ff; }
    .fmd-live-dot {
      width: 6px; height: 6px; border-radius: 50%;
      background: var(--safe); flex-shrink: 0; animation: blink 1.4s ease infinite;
    }

    .fmd-legend { display: flex; gap: 12px; flex-shrink: 0; align-items: center; }
    .fmd-legend-item { display: flex; align-items: center; gap: 4px; font-family: 'Space Mono', monospace; font-size: 9px; color: var(--muted); }
    .fmd-legend-line { width: 14px; height: 2px; border-radius: 1px; }
    .fmd-chart-wrap { flex: 1; min-height: 0; }
    .fmd-no-data {
      flex: 1; display: flex; flex-direction: column; align-items: center; justify-content: center;
      gap: 8px; font-family: 'Space Mono', monospace; font-size: 11px; color: var(--muted); opacity: 0.45;
    }
    .fmd-no-data-icon { font-size: 28px; }

    .fmd-footer {
      position: relative; z-index: 2; flex-shrink: 0;
      display: flex; justify-content: center; gap: 8px; padding: 5px 0 7px;
      font-family: 'Space Mono', monospace; font-size: 9px; letter-spacing: 0.1em;
      color: var(--muted); opacity: 0.45;
    }
    .fmd-tooltip {
      background: #061428; border: 1px solid rgba(56,189,248,0.2);
      border-radius: 8px; padding: 7px 12px;
      font-family: 'Space Mono', monospace; font-size: 11px; color: #e8f4ff;
    }
    .fmd-tooltip-time { font-size: 9px; color: var(--muted); margin-bottom: 3px; display: block; }
  `;
  document.head.appendChild(s);
};

/* ─── helpers ─── */
const cmToM = (cm) => (cm / 100).toFixed(2);

const fmtDateKey = (ts) =>
  new Date(ts).toLocaleDateString([], { day: "2-digit", month: "short", year: "numeric" });

const fmtTimeOnly = (ts) =>
  ts ? new Date(ts).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit", hour12: false }) : "";

const todayKey = () => fmtDateKey(Date.now());

const CustomTooltip = ({ active, payload }) => {
  if (active && payload && payload.length) {
    const entry = payload[0].payload;
    return (
      <div className="fmd-tooltip">
        <span className="fmd-tooltip-time">{entry.dateKey} · {fmtTimeOnly(entry.timestamp)}</span>
        <span style={{ color: "#38bdf8" }}>{entry.level} m</span>
      </div>
    );
  }
  return null;
};

function App() {
  const [waterLevel, setWaterLevel]         = useState(0);
  const [allHistory, setAllHistory]         = useState([]);
  const [selectedDate, setSelectedDate]     = useState(todayKey());
  const [status, setStatus]                 = useState("SAFE");
  const [time, setTime]                     = useState(new Date());
  const [predictedLevel, setPredictedLevel] = useState(null);

  useEffect(() => { injectStyles(); }, []);

  /* LIVE DATA */
  useEffect(() => {
    const liveRef = ref(database, "floodData");
    onValue(liveRef, (snapshot) => {
      const data = snapshot.val();
      if (data?.waterLevel !== undefined) setWaterLevel(data.waterLevel);
    });
  }, []);

  /* AUTO HISTORY LOGGING */
  useEffect(() => {
    if (waterLevel === 0) return;
    push(ref(database, "floodHistory"), { waterLevel, timestamp: Date.now() });
  }, [waterLevel]);

  /* LOAD ALL HISTORY */
  useEffect(() => {
    onValue(ref(database, "floodHistory"), (snapshot) => {
      const data = snapshot.val();
      if (!data) return;
      const formatted = Object.values(data)
        .filter(item => item.waterLevel !== undefined && item.timestamp !== undefined)
        .sort((a, b) => a.timestamp - b.timestamp)
        .map((item) => ({
          level:     parseFloat(cmToM(item.waterLevel)),
          timestamp: item.timestamp,
          dateKey:   fmtDateKey(item.timestamp),
          label:     fmtTimeOnly(item.timestamp),
        }));
      setAllHistory(formatted);
    });
  }, []);

  /* ML PREDICTION */
  useEffect(() => {
    const fetchPrediction = async () => {
      try {
        const res  = await fetch("http://127.0.0.1:5000/predict");
        const data = await res.json();
        setPredictedLevel(data.predictedLevel);
      } catch (e) { console.error("ML API Error:", e); }
    };
    fetchPrediction();
    const id = setInterval(fetchPrediction, 10000);
    return () => clearInterval(id);
  }, []);

  /* STATUS */
  useEffect(() => {
    const m = waterLevel / 100;
    setStatus(m >= 0.70 ? "DANGER" : m >= 0.40 ? "WARNING" : "SAFE");
  }, [waterLevel]);

  /* CLOCK */
  useEffect(() => {
    const id = setInterval(() => setTime(new Date()), 1000);
    return () => clearInterval(id);
  }, []);

  /* ── DERIVED ── */
  const availableDates = useMemo(() => {
    const seen = new Set();
    const out  = [];
    allHistory.forEach(h => { if (!seen.has(h.dateKey)) { seen.add(h.dateKey); out.push(h.dateKey); } });
    return out.reverse(); // newest first
  }, [allHistory]);

  // useEffect(() => {
  //   if (availableDates.length && !availableDates.includes(selectedDate))
  //     setSelectedDate(availableDates[0]);
  // }, [availableDates]);
  useEffect(() => {
    if (availableDates.length && !availableDates.includes(selectedDate))
      setSelectedDate(availableDates[0]);
  }, [availableDates, selectedDate]);

  const history = useMemo(
    () => allHistory.filter(h => h.dateKey === selectedDate),
    [allHistory, selectedDate]
  );

  const minLevel     = history.length ? Math.min(...history.map(h => h.level)) : "—";
  const maxLevel     = history.length ? Math.max(...history.map(h => h.level)) : "—";
  const tickInterval = Math.max(1, Math.floor(history.length / 8));

  const statusColor  = status === "SAFE" ? "var(--safe)"  : status === "WARNING" ? "var(--warn)"  : "var(--danger)";
  const statusBg     = status === "SAFE" ? "rgba(0,229,160,0.1)" : status === "WARNING" ? "rgba(245,158,11,0.1)" : "rgba(244,63,94,0.1)";
  const statusBorder = status === "SAFE" ? "rgba(0,229,160,0.25)": status === "WARNING" ? "rgba(245,158,11,0.25)": "rgba(244,63,94,0.25)";
  const today        = todayKey();

  return (
    <div className="fmd-page">
      <div className="fmd-scanline" />

      <div className="fmd-header">
        <div className="fmd-header-left">
          <span className="fmd-title">Flood Monitor</span>
          <span className="fmd-subtitle">Real-time · ML-Assisted</span>
        </div>
        <div className="fmd-header-right">
          <span className="fmd-location">📍 Solapur, MH</span>
          <span className="fmd-time">{time.toLocaleTimeString()}</span>
        </div>
      </div>

      {status === "DANGER" && (
        <div className="fmd-alert">
          <span className="fmd-alert-dot" />
          FLOOD RISK DETECTED — TAKE IMMEDIATE ACTION
        </div>
      )}

      <div className="fmd-body">
        {/* LEFT */}
        <div className="fmd-left">
          <div className="fmd-main-card">
            <div className="fmd-card-label">Current Water Level</div>
            <div className="fmd-level-block">
              <span className="fmd-level-num">{cmToM(waterLevel)}</span>
              <span className="fmd-level-unit">m</span>
            </div>
            {predictedLevel !== null && (
              <div className="fmd-predict">
                <span>🔮</span><span>ML Predicted:</span>
                <span className="fmd-predict-val">{predictedLevel} m</span>
              </div>
            )}
            <div className="fmd-badge-row">
              <div className="fmd-badge" style={{ background: statusBg, border: `1px solid ${statusBorder}`, color: statusColor }}>
                <span className="fmd-badge-ring" style={{ background: statusColor, animation: status !== "SAFE" ? "pulse-ring 1.4s ease infinite" : "none" }} />
                {status}
              </div>
            </div>
          </div>

          <div className="fmd-stats-row">
            <div className="fmd-stat">
              <span className="fmd-stat-label">{selectedDate === today ? "Today" : "Day"} Min</span>
              <span className="fmd-stat-val">{minLevel}{minLevel !== "—" && <span className="fmd-stat-unit"> m</span>}</span>
            </div>
            <div className="fmd-stat">
              <span className="fmd-stat-label">{selectedDate === today ? "Today" : "Day"} Max</span>
              <span className="fmd-stat-val">{maxLevel}{maxLevel !== "—" && <span className="fmd-stat-unit"> m</span>}</span>
            </div>
          </div>
        </div>

        {/* RIGHT: graph */}
        <div className="fmd-graph-card">
          <div className="fmd-graph-header">
            <div className="fmd-graph-header-left">
              <div className="fmd-graph-title">Water Level Trend</div>

              {/* DATE DROPDOWN */}
              <div className="fmd-date-select-wrap">
                {selectedDate === today && <span className="fmd-live-dot" />}
                <span className="fmd-date-select-label">Date:</span>
                <select
                  className="fmd-date-select"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {availableDates.length === 0 && (
                    <option disabled>Waiting for data…</option>
                  )}
                  {availableDates.map((d) => {
                    const isToday = d === today;
                    const count   = allHistory.filter(h => h.dateKey === d).length;
                    return (
                      <option key={d} value={d}>
                        {isToday ? `TODAY  (${count} readings)` : `${d}  (${count} readings)`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="fmd-legend">
              <div className="fmd-legend-item">
                <div className="fmd-legend-line" style={{ background: "#f59e0b" }} /><span>WARN 0.40 m</span>
              </div>
              <div className="fmd-legend-item">
                <div className="fmd-legend-line" style={{ background: "#f43f5e" }} /><span>CRIT 0.70 m</span>
              </div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="fmd-no-data">
              <span className="fmd-no-data-icon">📭</span>
              <span>No data recorded for {selectedDate}</span>
            </div>
          ) : (
            <div className="fmd-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ left: 0, right: 10, top: 4, bottom: 24 }}>
                  <XAxis
                    dataKey="label"
                    interval={tickInterval}
                    tick={{ fontFamily: "Space Mono, monospace", fontSize: 8, fill: "#4a6080" }}
                    axisLine={{ stroke: "rgba(56,189,248,0.08)" }}
                    tickLine={false}
                    angle={-35}
                    textAnchor="end"
                    height={48}
                  />
                  <YAxis
                    tick={{ fontFamily: "Space Mono, monospace", fontSize: 9, fill: "#4a6080" }}
                    axisLine={false} tickLine={false} width={36}
                    tickFormatter={(v) => `${v}m`}
                  />
                  <Tooltip content={<CustomTooltip />} />
                  <ReferenceLine y={0.40} stroke="#f59e0b" strokeDasharray="4 3" strokeWidth={1.2} strokeOpacity={0.65} />
                  <ReferenceLine y={0.70} stroke="#f43f5e" strokeDasharray="4 3" strokeWidth={1.2} strokeOpacity={0.65} />
                  <Line
                    type="monotone" dataKey="level"
                    stroke="#38bdf8" strokeWidth={2.5}
                    dot={{ r: 2.5, fill: "#38bdf8", strokeWidth: 0 }}
                    activeDot={{ r: 5, fill: "#38bdf8", stroke: "rgba(56,189,248,0.3)", strokeWidth: 4 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>
      </div>

      <div className="fmd-footer">
        <span>FMD v2.1</span><span>·</span><span>LIVE + ML</span><span>·</span><span>SOLAPUR DISTRICT</span>
      </div>
    </div>
  );
}

export default App;