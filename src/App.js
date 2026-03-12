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
    @import url('https://fonts.googleapis.com/css2?family=IBM+Plex+Mono:wght@400;500;600&family=DM+Sans:wght@400;500;600;700&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    :root {
      --safe:     #10d9a0;
      --warn:     #f4b942;
      --danger:   #f04f6a;
      --accent:   #4fc3f7;
      --accent2:  #818cf8;
      --bg:       #07101c;
      --bg2:      #0b1829;
      --panel:    rgba(255,255,255,0.028);
      --panel-hov:rgba(255,255,255,0.045);
      --border:   rgba(79,195,247,0.10);
      --border2:  rgba(255,255,255,0.06);
      --muted:    #3d5570;
      --muted2:   #6b849e;
      --text:     #c8d8ea;
      --text-hi:  #eaf2fb;
    }

    @keyframes pulse-ring {
      0%   { box-shadow: 0 0 0 0 currentColor; }
      70%  { box-shadow: 0 0 0 8px transparent; }
      100% { box-shadow: 0 0 0 0 transparent; }
    }
    @keyframes blink { 0%,100% { opacity:1; } 50% { opacity:0.25; } }
    @keyframes sweep {
      0%   { transform: translateY(-100vh); }
      100% { transform: translateY(100vh); }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    @keyframes shimmer {
      0%   { background-position: -200% center; }
      100% { background-position: 200% center; }
    }
    @keyframes dangerPulse {
      0%,100% { background: rgba(240,79,106,0.06); }
      50%     { background: rgba(240,79,106,0.12); }
    }

    /* ── BASE ── */
    .fmd-page {
      min-height: 100dvh; width: 100%;
      background: var(--bg);
      background-image:
        radial-gradient(ellipse 80% 50% at 20% -10%, rgba(79,195,247,0.055) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 110%, rgba(129,140,248,0.04) 0%, transparent 60%);
      font-family: 'DM Sans', sans-serif;
      color: var(--text);
      display: flex; flex-direction: column;
      position: relative; overflow-x: hidden;
    }

    /* subtle grid */
    .fmd-page::before {
      content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
      background-image:
        linear-gradient(rgba(79,195,247,0.025) 1px, transparent 1px),
        linear-gradient(90deg, rgba(79,195,247,0.025) 1px, transparent 1px);
      background-size: 52px 52px;
    }

    .fmd-sweep {
      position: fixed; top:0; left:0; right:0; height:1px;
      background: linear-gradient(90deg,transparent,rgba(79,195,247,0.18),transparent);
      animation: sweep 10s linear infinite; pointer-events:none; z-index:1;
    }

    /* ── HEADER ── */
    .fmd-header {
      position:relative; z-index:10; flex-shrink:0;
      display:flex; align-items:center; justify-content:space-between;
      padding: 14px 20px 13px;
      border-bottom: 1px solid var(--border2);
      backdrop-filter: blur(12px);
      background: rgba(7,16,28,0.7);
      animation: fadeUp 0.5s ease both;
    }
    .fmd-header::after {
      content:''; position:absolute; bottom:-1px; left:0; right:0; height:1px;
      background: linear-gradient(90deg,transparent,rgba(79,195,247,0.2),transparent);
    }
    .fmd-header-left { display:flex; align-items:center; gap:12px; }
    .fmd-logo {
      width:32px; height:32px; border-radius:10px; flex-shrink:0;
      background: linear-gradient(135deg, rgba(79,195,247,0.2), rgba(129,140,248,0.2));
      border: 1px solid rgba(79,195,247,0.2);
      display:flex; align-items:center; justify-content:center; font-size:15px;
    }
    .fmd-header-text { display:flex; flex-direction:column; gap:1px; }
    .fmd-title { font-size:15px; font-weight:700; letter-spacing:0.02em; color:var(--text-hi); }
    .fmd-subtitle { font-family:'IBM Plex Mono',monospace; font-size:9px; color:var(--muted2); letter-spacing:0.12em; text-transform:uppercase; }
    .fmd-header-right { display:flex; flex-direction:column; align-items:flex-end; gap:1px; }
    .fmd-location { font-family:'IBM Plex Mono',monospace; font-size:9px; color:var(--accent); letter-spacing:0.08em; opacity:0.85; }
    .fmd-time { font-family:'IBM Plex Mono',monospace; font-size:14px; font-weight:600; color:var(--text-hi); letter-spacing:0.08em; }

    /* ── ALERT BANNER ── */
    .fmd-alert {
      position:relative; z-index:9; flex-shrink:0;
      display:flex; align-items:center; gap:10px;
      padding: 9px 20px;
      background: rgba(240,79,106,0.07);
      border-bottom: 1px solid rgba(240,79,106,0.2);
      font-family:'IBM Plex Mono',monospace; font-size:10px;
      color: #fca5a5; letter-spacing:0.05em;
      animation: dangerPulse 2s ease infinite, fadeUp 0.3s ease both;
    }
    .fmd-alert-pip {
      width:6px; height:6px; border-radius:50%;
      background:var(--danger); flex-shrink:0;
      animation: blink 0.9s ease infinite;
    }

    /* ── BODY ── */
    .fmd-body {
      position:relative; z-index:2; flex:1;
      display:grid; grid-template-columns:280px 1fr; gap:12px;
      padding:14px 18px 12px;
      animation: fadeUp 0.5s ease 0.1s both;
    }

    /* ── LEFT COLUMN ── */
    .fmd-left { display:flex; flex-direction:column; gap:10px; }

    /* ── CARDS ── */
    .fmd-card {
      background: var(--panel);
      border: 1px solid var(--border2);
      border-radius:16px; padding:16px;
      position:relative; overflow:hidden;
      transition: border-color 0.2s, background 0.2s;
    }
    .fmd-card:hover { background:var(--panel-hov); border-color:var(--border); }
    .fmd-card::before {
      content:''; position:absolute; top:0; left:16px; right:16px; height:1px;
      background: linear-gradient(90deg,transparent,rgba(79,195,247,0.18),transparent);
    }

    .fmd-card-eyebrow {
      font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:0.14em;
      color:var(--muted2); text-transform:uppercase; margin-bottom:12px;
      display:flex; align-items:center; gap:6px;
    }
    .fmd-card-eyebrow::before {
      content:''; display:inline-block; width:12px; height:1px;
      background: linear-gradient(90deg,var(--accent),transparent); opacity:0.6;
    }

    /* level display */
    .fmd-level-group { display:flex; align-items:flex-start; justify-content:center; gap:4px; padding:4px 0 8px; }
    .fmd-level-int { font-family:'IBM Plex Mono',monospace; font-size:68px; font-weight:600; line-height:1; color:var(--text-hi); letter-spacing:-3px; }
    .fmd-level-frac { display:flex; flex-direction:column; justify-content:flex-end; padding-bottom:7px; gap:0; }
    .fmd-level-dec { font-family:'IBM Plex Mono',monospace; font-size:24px; font-weight:500; color:var(--text-hi); letter-spacing:-1px; }
    .fmd-level-unit-tag { font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--muted2); letter-spacing:0.06em; }

    /* prediction row */
    .fmd-predict {
      display:flex; align-items:center; gap:8px;
      background: rgba(79,195,247,0.04);
      border: 1px solid rgba(79,195,247,0.1);
      border-radius:10px; padding:8px 12px; margin:4px 0 10px;
      font-family:'IBM Plex Mono',monospace; font-size:9.5px; color:var(--muted2);
      letter-spacing:0.04em;
    }
    .fmd-predict-icon { font-size:12px; }
    .fmd-predict-label { flex:1; }
    .fmd-predict-val { color:var(--accent); font-weight:600; font-size:12px; }

    /* status badge */
    .fmd-status-badge {
      display:flex; align-items:center; justify-content:center; gap:8px;
      width:100%; padding:9px;
      border-radius:10px; border:1px solid;
      font-family:'IBM Plex Mono',monospace; font-size:11px; font-weight:600;
      letter-spacing:0.14em; text-transform:uppercase;
      transition: all 0.3s ease;
    }
    .fmd-status-pip {
      width:7px; height:7px; border-radius:50%; flex-shrink:0;
      animation: pulse-ring 1.8s ease infinite;
    }
    .fmd-status-safe    { color:var(--safe);   background:rgba(16,217,160,0.07);   border-color:rgba(16,217,160,0.2); }
    .fmd-status-warn    { color:var(--warn);   background:rgba(244,185,66,0.07);   border-color:rgba(244,185,66,0.2); }
    .fmd-status-danger  { color:var(--danger); background:rgba(240,79,106,0.08);   border-color:rgba(240,79,106,0.25); }

    /* stats */
    .fmd-stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:8px; }
    .fmd-stat {
      background:var(--panel); border:1px solid var(--border2);
      border-radius:12px; padding:12px 14px;
      display:flex; flex-direction:column; gap:4px;
      transition: border-color 0.2s, background 0.2s;
    }
    .fmd-stat:hover { background:var(--panel-hov); border-color:var(--border); }
    .fmd-stat-eyebrow { font-family:'IBM Plex Mono',monospace; font-size:8.5px; letter-spacing:0.12em; color:var(--muted2); text-transform:uppercase; }
    .fmd-stat-value { font-family:'IBM Plex Mono',monospace; font-size:24px; font-weight:600; color:var(--text-hi); line-height:1.1; }
    .fmd-stat-unit { font-size:11px; color:var(--muted2); font-weight:400; margin-left:2px; }
    .fmd-stat-dash { font-size:18px; color:var(--muted); }

    /* ── GRAPH CARD ── */
    .fmd-graph-card {
      background:var(--panel); border:1px solid var(--border2);
      border-radius:16px; padding:16px 14px 10px;
      display:flex; flex-direction:column; min-height:0; position:relative; overflow:hidden;
    }
    .fmd-graph-card::before {
      content:''; position:absolute; top:0; left:16px; right:16px; height:1px;
      background: linear-gradient(90deg,transparent,rgba(79,195,247,0.18),transparent);
    }
    .fmd-graph-topbar {
      display:flex; align-items:flex-start; justify-content:space-between;
      gap:12px; margin-bottom:12px; flex-shrink:0; flex-wrap:wrap;
    }
    .fmd-graph-meta { display:flex; flex-direction:column; gap:8px; }
    .fmd-graph-eyebrow {
      font-family:'IBM Plex Mono',monospace; font-size:9px; letter-spacing:0.14em;
      color:var(--muted2); text-transform:uppercase;
      display:flex; align-items:center; gap:6px;
    }
    .fmd-graph-eyebrow::before {
      content:''; display:inline-block; width:12px; height:1px;
      background:linear-gradient(90deg,var(--accent),transparent); opacity:0.6;
    }

    /* date selector */
    .fmd-date-row { display:flex; align-items:center; gap:8px; }
    .fmd-live-pip { width:6px; height:6px; border-radius:50%; background:var(--safe); flex-shrink:0; animation:blink 1.6s ease infinite; }
    .fmd-date-label { font-family:'IBM Plex Mono',monospace; font-size:9px; color:var(--muted2); letter-spacing:0.1em; text-transform:uppercase; white-space:nowrap; }
    .fmd-date-select {
      font-family:'IBM Plex Mono',monospace; font-size:10px; letter-spacing:0.04em;
      color:var(--accent); background:rgba(79,195,247,0.06);
      border:1px solid rgba(79,195,247,0.2); border-radius:8px;
      padding:5px 28px 5px 10px; cursor:pointer; outline:none;
      appearance:none; -webkit-appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234fc3f7' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:right 9px center;
      transition: border-color 0.18s, background 0.18s;
      max-width:220px;
    }
    .fmd-date-select:hover, .fmd-date-select:focus { border-color:var(--accent); background-color:rgba(79,195,247,0.11); }
    .fmd-date-select option { background:#07101c; color:#eaf2fb; }

    /* legend */
    .fmd-legend { display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
    .fmd-legend-item { display:flex; align-items:center; gap:5px; font-family:'IBM Plex Mono',monospace; font-size:8.5px; color:var(--muted2); white-space:nowrap; }
    .fmd-legend-dash { width:16px; height:2px; border-radius:1px; }

    .fmd-chart-wrap { flex:1; min-height:180px; }

    .fmd-no-data {
      flex:1; min-height:160px; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:8px;
      font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--muted); opacity:0.5;
    }
    .fmd-no-data-icon { font-size:26px; margin-bottom:2px; }

    /* ── TOOLTIP ── */
    .fmd-tt {
      background:#07101c; border:1px solid rgba(79,195,247,0.18);
      border-radius:10px; padding:8px 13px;
      font-family:'IBM Plex Mono',monospace; font-size:11px; color:var(--text-hi);
      box-shadow: 0 8px 24px rgba(0,0,0,0.4);
    }
    .fmd-tt-time { font-size:9px; color:var(--muted2); margin-bottom:4px; display:block; letter-spacing:0.06em; }
    .fmd-tt-val { font-size:14px; font-weight:600; color:var(--accent); }

    /* ── FOOTER ── */
    .fmd-footer {
      position:relative; z-index:2; flex-shrink:0;
      display:flex; justify-content:center; align-items:center; gap:8px;
      padding:6px 0 10px;
      font-family:'IBM Plex Mono',monospace; font-size:8.5px; letter-spacing:0.1em;
      color:var(--muted); opacity:0.4;
    }
    .fmd-footer-sep { opacity:0.4; }

    /* ─────────────────────────────────────────
       RESPONSIVE — Mobile first
    ───────────────────────────────────────── */

    /* ≤ 640px : single column stack */
    @media (max-width: 640px) {
      .fmd-header { padding: 12px 14px 11px; }
      .fmd-alert  { padding: 8px 14px; font-size:9px; }

      .fmd-body {
        grid-template-columns: 1fr;
        gap: 10px;
        padding: 10px 12px 10px;
        overflow-y: auto;
        min-height: 0;
        flex: 1;
      }

      /* On mobile, left col becomes a flex row of two half-cards */
      .fmd-left { flex-direction: column; gap:10px; }

      /* shrink the big number */
      .fmd-level-int { font-size:52px; }
      .fmd-level-dec { font-size:20px; }

      .fmd-graph-card {
        min-height: 300px;
      }

      .fmd-graph-topbar { flex-direction: column; gap:10px; }
      .fmd-legend { display:none; } /* hide legend on very small screens */

      .fmd-date-select { max-width: 100%; width:100%; }

      .fmd-footer { gap:6px; font-size:8px; }
    }

    /* 641–900px : still stacked but wider */
    @media (min-width: 641px) and (max-width: 900px) {
      .fmd-body {
        grid-template-columns: 1fr;
        padding: 12px 16px;
        overflow-y:auto; flex:1; min-height:0;
      }
      .fmd-left {
        display:grid; grid-template-columns: 1fr 1fr; gap:10px;
      }
      /* main card spans both cols */
      .fmd-left > .fmd-card:first-child { grid-column: 1 / -1; }
      /* stats grid inside left-col stays 2-col */

      .fmd-graph-card { min-height:280px; }
    }

    /* ≥ 901px : original side-by-side, chart fills height */
    @media (min-width: 901px) {
      .fmd-body {
        grid-template-columns: 272px 1fr;
        height: 0; /* collapses to flex:1 */
        flex: 1; min-height:0;
      }
      .fmd-chart-wrap { min-height: 0; }
    }

    /* ── scrollbar ── */
    .fmd-body::-webkit-scrollbar { width:4px; }
    .fmd-body::-webkit-scrollbar-track { background:transparent; }
    .fmd-body::-webkit-scrollbar-thumb { background:rgba(79,195,247,0.15); border-radius:2px; }
  `;
  document.head.appendChild(s);
};

/* ─── helpers ─── */
const cmToM    = (cm) => (cm / 100).toFixed(2);
const splitNum = (v)  => { const [i, f] = v.split("."); return { i, f: "." + f }; };

const fmtDateKey  = (ts) => new Date(ts).toLocaleDateString([], { day:"2-digit", month:"short", year:"numeric" });
const fmtTimeOnly = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false }) : "";
const todayKey    = ()   => fmtDateKey(Date.now());

const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const e = payload[0].payload;
  return (
    <div className="fmd-tt">
      <span className="fmd-tt-time">{e.dateKey} · {fmtTimeOnly(e.timestamp)}</span>
      <span className="fmd-tt-val">{e.level} m</span>
    </div>
  );
};

/* ─── APP ─── */
function App() {
  const [waterLevel,     setWaterLevel]     = useState(0);
  const [allHistory,     setAllHistory]     = useState([]);
  const [selectedDate,   setSelectedDate]   = useState(todayKey());
  const [status,         setStatus]         = useState("SAFE");
  const [time,           setTime]           = useState(new Date());
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

  /* AUTO-LOG */
  useEffect(() => {
    if (waterLevel === 0) return;
    push(ref(database, "floodHistory"), { waterLevel, timestamp: Date.now() });
  }, [waterLevel]);

  /* HISTORY */
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
    const seen = new Set(); const out = [];
    allHistory.forEach(h => { if (!seen.has(h.dateKey)) { seen.add(h.dateKey); out.push(h.dateKey); } });
    return out.reverse();
  }, [allHistory]);

  useEffect(() => {
    if (availableDates.length && !availableDates.includes(selectedDate))
      setSelectedDate(availableDates[0]);
  }, [availableDates, selectedDate]);

  const history = useMemo(
    () => allHistory.filter(h => h.dateKey === selectedDate),
    [allHistory, selectedDate],
  );

  const minLevel     = history.length ? Math.min(...history.map(h => h.level)) : null;
  const maxLevel     = history.length ? Math.max(...history.map(h => h.level)) : null;
  const tickInterval = Math.max(1, Math.floor(history.length / 8));

  const today       = todayKey();
  const levelStr    = cmToM(waterLevel);
  const { i, f }   = splitNum(levelStr);

  const statusClass = status === "SAFE" ? "fmd-status-safe" : status === "WARNING" ? "fmd-status-warn" : "fmd-status-danger";
  const statusColor = status === "SAFE" ? "var(--safe)"    : status === "WARNING" ? "var(--warn)"    : "var(--danger)";

  return (
    <div className="fmd-page">
      <div className="fmd-sweep" />

      {/* HEADER */}
      <header className="fmd-header">
        <div className="fmd-header-left">
          <div className="fmd-logo">🌊</div>
          <div className="fmd-header-text">
            <span className="fmd-title">Flood Monitor</span>
            <span className="fmd-subtitle">Real-time · ML-Assisted</span>
          </div>
        </div>
        <div className="fmd-header-right">
          <span className="fmd-location">📍 Solapur, MH</span>
          <span className="fmd-time">{time.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false })}</span>
        </div>
      </header>

      {/* ALERT */}
      {status === "DANGER" && (
        <div className="fmd-alert">
          <span className="fmd-alert-pip" />
          FLOOD RISK DETECTED — TAKE IMMEDIATE ACTION
        </div>
      )}

      {/* BODY */}
      <div className="fmd-body">

        {/* ─ LEFT ─ */}
        <div className="fmd-left">

          {/* MAIN LEVEL CARD */}
          <div className="fmd-card">
            <div className="fmd-card-eyebrow">Current Water Level</div>

            <div className="fmd-level-group">
              <span className="fmd-level-int">{i}</span>
              <div className="fmd-level-frac">
                <span className="fmd-level-dec">{f}</span>
                <span className="fmd-level-unit-tag">metres</span>
              </div>
            </div>

            {predictedLevel !== null && (
              <div className="fmd-predict">
                <span className="fmd-predict-icon">🔮</span>
                <span className="fmd-predict-label">ML Forecast</span>
                <span className="fmd-predict-val">{predictedLevel} m</span>
              </div>
            )}

            <div
              className={`fmd-status-badge ${statusClass}`}
              style={{ color: statusColor }}
            >
              <span
                className="fmd-status-pip"
                style={{ background: statusColor, color: statusColor }}
              />
              {status === "SAFE" ? "Safe Level" : status === "WARNING" ? "Warning Level" : "Danger Level"}
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="fmd-stats-grid">
            <div className="fmd-stat">
              <span className="fmd-stat-eyebrow">{selectedDate === today ? "Today" : "Day"} Min</span>
              {minLevel !== null
                ? <span className="fmd-stat-value">{minLevel}<span className="fmd-stat-unit">m</span></span>
                : <span className="fmd-stat-dash">—</span>
              }
            </div>
            <div className="fmd-stat">
              <span className="fmd-stat-eyebrow">{selectedDate === today ? "Today" : "Day"} Max</span>
              {maxLevel !== null
                ? <span className="fmd-stat-value">{maxLevel}<span className="fmd-stat-unit">m</span></span>
                : <span className="fmd-stat-dash">—</span>
              }
            </div>
          </div>
        </div>

        {/* ─ RIGHT: GRAPH ─ */}
        <div className="fmd-graph-card">
          <div className="fmd-graph-topbar">
            <div className="fmd-graph-meta">
              <div className="fmd-graph-eyebrow">Water Level Trend</div>

              <div className="fmd-date-row">
                {selectedDate === today && <span className="fmd-live-pip" />}
                <span className="fmd-date-label">Date:</span>
                <select
                  className="fmd-date-select"
                  value={selectedDate}
                  onChange={(e) => setSelectedDate(e.target.value)}
                >
                  {availableDates.length === 0 && <option disabled>Waiting for data…</option>}
                  {availableDates.map((d) => {
                    const count = allHistory.filter(h => h.dateKey === d).length;
                    return (
                      <option key={d} value={d}>
                        {d === today ? `TODAY (${count} pts)` : `${d} (${count} pts)`}
                      </option>
                    );
                  })}
                </select>
              </div>
            </div>

            <div className="fmd-legend">
              <div className="fmd-legend-item">
                <div className="fmd-legend-dash" style={{ background:"#f4b942" }} />
                <span>WARN 0.40 m</span>
              </div>
              <div className="fmd-legend-item">
                <div className="fmd-legend-dash" style={{ background:"#f04f6a" }} />
                <span>CRIT 0.70 m</span>
              </div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="fmd-no-data">
              <span className="fmd-no-data-icon">📭</span>
              <span>No data for {selectedDate}</span>
            </div>
          ) : (
            <div className="fmd-chart-wrap">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart data={history} margin={{ left:0, right:12, top:6, bottom:28 }}>
                  <XAxis
                    dataKey="label"
                    interval={tickInterval}
                    tick={{ fontFamily:"IBM Plex Mono,monospace", fontSize:8, fill:"#3d5570" }}
                    axisLine={{ stroke:"rgba(79,195,247,0.07)" }}
                    tickLine={false}
                    angle={-30}
                    textAnchor="end"
                    height={44}
                  />
                  <YAxis
                    tick={{ fontFamily:"IBM Plex Mono,monospace", fontSize:9, fill:"#3d5570" }}
                    axisLine={false} tickLine={false} width={36}
                    tickFormatter={(v) => `${v}m`}
                  />
                  <Tooltip content={<CustomTooltip />} cursor={{ stroke:"rgba(79,195,247,0.12)", strokeWidth:1 }} />
                  <ReferenceLine y={0.40} stroke="#f4b942" strokeDasharray="5 4" strokeWidth={1} strokeOpacity={0.55} />
                  <ReferenceLine y={0.70} stroke="#f04f6a" strokeDasharray="5 4" strokeWidth={1} strokeOpacity={0.55} />
                  <Line
                    type="monotone" dataKey="level"
                    stroke="#4fc3f7" strokeWidth={2}
                    dot={{ r:2, fill:"#4fc3f7", strokeWidth:0 }}
                    activeDot={{ r:5, fill:"#4fc3f7", stroke:"rgba(79,195,247,0.25)", strokeWidth:5 }}
                    isAnimationActive={false}
                  />
                </LineChart>
              </ResponsiveContainer>
            </div>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <footer className="fmd-footer">
        <span>FMD v2.2</span>
        <span className="fmd-footer-sep">·</span>
        <span>LIVE + ML</span>
        <span className="fmd-footer-sep">·</span>
        <span>SOLAPUR DISTRICT</span>
      </footer>
    </div>
  );
}

export default App;