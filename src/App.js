
// import { useEffect, useState, useMemo } from "react";
// import { ref, onValue, push } from "firebase/database";
// import { database } from "./firebase";

// import {
//   LineChart, Line, XAxis, YAxis, Tooltip,
//   ResponsiveContainer, ReferenceLine,
// } from "recharts";

// /* ─── STYLES ─── */
// const injectStyles = () => {
//   if (document.getElementById("fmd-styles")) return;
//   const s = document.createElement("style");
//   s.id = "fmd-styles";
//   s.textContent = `
//     @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

//     *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

//     :root {
//       --safe:       #0a9c6b;
//       --safe-bg:    #edfdf6;
//       --safe-bdr:   #9ee8cb;
//       --warn:       #c07c0a;
//       --warn-bg:    #fffbeb;
//       --warn-bdr:   #fcd478;
//       --danger:     #c8273e;
//       --danger-bg:  #fff1f3;
//       --danger-bdr: #fca5b0;
//       --accent:     #1a6fe8;
//       --accent-2:   #5b4ef8;
//       --accent-bg:  #eff4fe;
//       --accent-bdr: #b8d0fb;

//       --bg:         #f4f6f9;
//       --bg-2:       #ffffff;
//       --surface:    #ffffff;
//       --surface-2:  #f8fafc;
//       --panel:      rgba(255,255,255,0.92);

//       --border:     #e2e8f0;
//       --border-2:   #d1dae8;

//       --text:       #1e293b;
//       --text-hi:    #0f172a;
//       --text-mid:   #475569;
//       --text-low:   #94a3b8;
//       --text-xlow:  #b8c7d8;

//       --shadow-sm:  0 1px 3px rgba(15,23,42,0.07), 0 1px 2px rgba(15,23,42,0.04);
//       --shadow-md:  0 4px 12px rgba(15,23,42,0.08), 0 2px 4px rgba(15,23,42,0.04);
//       --shadow-lg:  0 8px 28px rgba(15,23,42,0.10), 0 4px 8px rgba(15,23,42,0.05);
//     }

//     @keyframes pulse-ring {
//       0%   { box-shadow: 0 0 0 0 currentColor; }
//       70%  { box-shadow: 0 0 0 7px transparent; }
//       100% { box-shadow: 0 0 0 0 transparent; }
//     }
//     @keyframes blink    { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
//     @keyframes fadeUp   { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
//     @keyframes dangerPulse {
//       0%,100%{ background: var(--danger-bg); }
//       50%    { background: #ffe4e8; }
//     }
//     @keyframes shimmer {
//       0%   { background-position: -400px 0; }
//       100% { background-position: 400px 0; }
//     }

//     /* ── BASE ── */
//     .fmd-page {
//       min-height: 100dvh; width: 100%;
//       background: var(--bg);
//       background-image:
//         radial-gradient(ellipse 70% 40% at 10% 0%, rgba(26,111,232,0.04) 0%, transparent 60%),
//         radial-gradient(ellipse 50% 35% at 90% 100%, rgba(91,78,248,0.03) 0%, transparent 55%);
//       font-family: 'Plus Jakarta Sans', sans-serif;
//       color: var(--text);
//       display: flex; flex-direction: column;
//       position: relative; overflow-x: hidden;
//     }

//     /* subtle dot grid */
//     .fmd-page::before {
//       content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
//       background-image: radial-gradient(circle, rgba(148,163,184,0.28) 1px, transparent 1px);
//       background-size: 28px 28px;
//       mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
//       -webkit-mask-image: radial-gradient(ellipse 80% 80% at 50% 50%, black 40%, transparent 100%);
//     }

//     /* ── HEADER ── */
//     .fmd-header {
//       position:relative; z-index:10; flex-shrink:0;
//       display:flex; align-items:center; justify-content:space-between;
//       padding: 0 24px;
//       height: 58px;
//       border-bottom: 1px solid var(--border);
//       background: rgba(255,255,255,0.88);
//       backdrop-filter: blur(14px);
//       -webkit-backdrop-filter: blur(14px);
//       box-shadow: 0 1px 0 var(--border), var(--shadow-sm);
//       animation: fadeUp 0.45s ease both;
//     }
//     .fmd-header-left  { display:flex; align-items:center; gap:14px; }
//     .fmd-logo {
//       width:34px; height:34px; border-radius:10px; flex-shrink:0;
//       background: linear-gradient(145deg, #dbeafe, #ede9fe);
//       border: 1px solid var(--accent-bdr);
//       display:flex; align-items:center; justify-content:center; font-size:16px;
//       box-shadow: 0 1px 3px rgba(26,111,232,0.12);
//     }
//     .fmd-wordmark      { display:flex; flex-direction:column; gap:1px; }
//     .fmd-title         { font-size:14px; font-weight:800; letter-spacing:-0.01em; color:var(--text-hi); }
//     .fmd-subtitle      { font-family:'JetBrains Mono',monospace; font-size:8.5px; color:var(--text-low); letter-spacing:0.14em; text-transform:uppercase; }
//     .fmd-header-divider{ width:1px; height:22px; background:var(--border); margin:0 4px; }

//     .fmd-nav-pill {
//       display:flex; align-items:center; gap:6px;
//       padding:5px 12px; border-radius:20px;
//       background:var(--accent-bg); border:1px solid var(--accent-bdr);
//       font-size:11px; font-weight:600; color:var(--accent); letter-spacing:0.01em;
//     }
//     .fmd-nav-dot { width:5px; height:5px; border-radius:50%; background:var(--safe); animation:blink 1.8s ease infinite; }

//     .fmd-header-right { display:flex; align-items:center; gap:16px; }
//     .fmd-location {
//       display:flex; align-items:center; gap:5px;
//       font-size:11px; font-weight:500; color:var(--text-mid);
//     }
//     .fmd-loc-badge {
//       padding:3px 9px; border-radius:5px;
//       background:var(--surface-2); border:1px solid var(--border);
//       font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:500;
//       color:var(--text-mid); letter-spacing:0.06em;
//     }
//     .fmd-time-block { display:flex; flex-direction:column; align-items:flex-end; gap:0; }
//     .fmd-time {
//       font-family:'JetBrains Mono',monospace; font-size:15px; font-weight:600;
//       color:var(--text-hi); letter-spacing:0.05em; line-height:1;
//     }
//     .fmd-time-label { font-family:'JetBrains Mono',monospace; font-size:7.5px; color:var(--text-low); letter-spacing:0.12em; text-transform:uppercase; margin-top:1px; }

//     /* ── ALERT BANNER ── */
//     .fmd-alert {
//       position:relative; z-index:9; flex-shrink:0;
//       display:flex; align-items:center; gap:10px;
//       padding: 9px 24px;
//       background: var(--danger-bg);
//       border-bottom: 1px solid var(--danger-bdr);
//       font-family:'JetBrains Mono',monospace; font-size:10px;
//       color: var(--danger); letter-spacing:0.06em;
//       font-weight:600;
//       animation: dangerPulse 2.5s ease infinite, fadeUp 0.3s ease both;
//     }
//     .fmd-alert-pip {
//       width:7px; height:7px; border-radius:50%;
//       background:var(--danger); flex-shrink:0;
//       animation: blink 0.85s ease infinite;
//     }
//     .fmd-alert-spacer { flex:1; }
//     .fmd-alert-action {
//       padding:4px 12px; border-radius:5px;
//       background:var(--danger); color:#fff;
//       font-size:9px; font-weight:700; letter-spacing:0.1em;
//       border:none; cursor:pointer;
//     }

//     /* ── BODY ── */
//     .fmd-body {
//       position:relative; z-index:2; flex:1;
//       display:grid; grid-template-columns:288px 1fr; gap:14px;
//       padding:16px 20px 14px;
//       animation: fadeUp 0.5s ease 0.1s both;
//     }

//     /* ── LEFT COLUMN ── */
//     .fmd-left { display:flex; flex-direction:column; gap:12px; }

//     /* ── CARDS ── */
//     .fmd-card {
//       background: var(--surface);
//       border: 1px solid var(--border);
//       border-radius:16px; padding:18px;
//       position:relative; overflow:hidden;
//       box-shadow: var(--shadow-sm);
//       transition: box-shadow 0.2s, border-color 0.2s;
//     }
//     .fmd-card:hover { box-shadow: var(--shadow-md); border-color:var(--border-2); }

//     .fmd-card-eyebrow {
//       font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:0.16em;
//       color:var(--text-low); text-transform:uppercase; margin-bottom:14px;
//       display:flex; align-items:center; gap:7px;
//     }
//     .fmd-eyebrow-bar {
//       display:inline-block; width:14px; height:2px; border-radius:2px;
//       background: linear-gradient(90deg,var(--accent),var(--accent-2));
//     }

//     /* level display */
//     .fmd-level-group {
//       display:flex; align-items:flex-start; gap:3px;
//       padding: 6px 0 14px; justify-content:center;
//     }
//     .fmd-level-int {
//       font-family:'JetBrains Mono',monospace; font-size:72px; font-weight:600;
//       line-height:1; color:var(--text-hi); letter-spacing:-4px;
//     }
//     .fmd-level-frac {
//       display:flex; flex-direction:column; justify-content:flex-end;
//       padding-bottom:9px; gap:1px;
//     }
//     .fmd-level-dec {
//       font-family:'JetBrains Mono',monospace; font-size:26px; font-weight:500;
//       color:var(--text-hi); letter-spacing:-1px;
//     }
//     .fmd-level-unit-tag {
//       font-family:'JetBrains Mono',monospace; font-size:10px;
//       color:var(--text-low); letter-spacing:0.08em; text-transform:uppercase;
//     }

//     /* gauge bar */
//     .fmd-gauge-wrap { margin: 0 0 14px; }
//     .fmd-gauge-track {
//       height:6px; border-radius:3px;
//       background: linear-gradient(90deg, #dcfce7 0%, #fef9c3 55%, #fee2e2 85%, #fecdd3 100%);
//       position:relative; overflow:hidden;
//       border: 1px solid var(--border);
//     }
//     .fmd-gauge-marker {
//       position:absolute; top:-3px; width:12px; height:12px;
//       border-radius:50%; border:2px solid #fff;
//       box-shadow: 0 1px 4px rgba(15,23,42,0.2);
//       transform:translateX(-50%);
//       transition: left 0.6s cubic-bezier(0.34,1.56,0.64,1);
//     }
//     .fmd-gauge-ticks {
//       display:flex; justify-content:space-between; margin-top:5px;
//       font-family:'JetBrains Mono',monospace; font-size:8px; color:var(--text-xlow);
//     }

//     /* prediction row */
//     .fmd-predict {
//       display:flex; align-items:center; gap:8px;
//       background: var(--accent-bg);
//       border: 1px solid var(--accent-bdr);
//       border-radius:10px; padding:9px 12px; margin-bottom:12px;
//       font-size:11px; color:var(--text-mid);
//     }
//     .fmd-predict-icon { font-size:13px; }
//     .fmd-predict-label { flex:1; font-weight:500; }
//     .fmd-predict-val {
//       font-family:'JetBrains Mono',monospace; color:var(--accent);
//       font-weight:600; font-size:13px;
//     }

//     /* status badge */
//     .fmd-status-badge {
//       display:flex; align-items:center; justify-content:center; gap:8px;
//       width:100%; padding:10px;
//       border-radius:10px; border:1px solid;
//       font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600;
//       letter-spacing:0.14em; text-transform:uppercase;
//       transition: all 0.3s ease;
//     }
//     .fmd-status-pip {
//       width:7px; height:7px; border-radius:50%; flex-shrink:0;
//       animation: pulse-ring 2s ease infinite;
//     }
//     .fmd-status-safe   { color:var(--safe);   background:var(--safe-bg);   border-color:var(--safe-bdr); }
//     .fmd-status-warn   { color:var(--warn);   background:var(--warn-bg);   border-color:var(--warn-bdr); }
//     .fmd-status-danger { color:var(--danger); background:var(--danger-bg); border-color:var(--danger-bdr); }

//     /* stats */
//     .fmd-stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
//     .fmd-stat {
//       background:var(--surface); border:1px solid var(--border);
//       border-radius:14px; padding:14px 16px;
//       display:flex; flex-direction:column; gap:5px;
//       box-shadow: var(--shadow-sm);
//       transition: box-shadow 0.2s, border-color 0.2s;
//       position:relative; overflow:hidden;
//     }
//     .fmd-stat::after {
//       content:''; position:absolute; top:0; left:0; right:0; height:3px;
//       border-radius:14px 14px 0 0;
//     }
//     .fmd-stat-min::after { background: linear-gradient(90deg, #a7f3d0, #6ee7b7); }
//     .fmd-stat-max::after { background: linear-gradient(90deg, #fca5a5, #f87171); }
//     .fmd-stat:hover { box-shadow:var(--shadow-md); border-color:var(--border-2); }
//     .fmd-stat-eyebrow { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:0.14em; color:var(--text-low); text-transform:uppercase; }
//     .fmd-stat-value { font-family:'JetBrains Mono',monospace; font-size:26px; font-weight:600; color:var(--text-hi); line-height:1.1; }
//     .fmd-stat-unit { font-size:12px; color:var(--text-low); font-weight:400; margin-left:2px; }
//     .fmd-stat-dash { font-size:18px; color:var(--text-xlow); }

//     /* ── GRAPH CARD ── */
//     .fmd-graph-card {
//       background: var(--surface);
//       border: 1px solid var(--border);
//       border-radius:16px; padding:20px 18px 14px;
//       display:flex; flex-direction:column; min-height:0;
//       box-shadow: var(--shadow-sm);
//       position:relative; overflow:hidden;
//     }
//     .fmd-graph-topbar {
//       display:flex; align-items:flex-start; justify-content:space-between;
//       gap:14px; margin-bottom:14px; flex-shrink:0; flex-wrap:wrap;
//     }
//     .fmd-graph-meta { display:flex; flex-direction:column; gap:9px; }
//     .fmd-graph-eyebrow {
//       font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:0.16em;
//       color:var(--text-low); text-transform:uppercase;
//       display:flex; align-items:center; gap:7px;
//     }
//     .fmd-graph-title {
//       font-size:16px; font-weight:700; color:var(--text-hi); letter-spacing:-0.01em;
//     }

//     /* date selector */
//     .fmd-date-row { display:flex; align-items:center; gap:8px; }
//     .fmd-live-pip { width:6px; height:6px; border-radius:50%; background:var(--safe); flex-shrink:0; animation:blink 1.6s ease infinite; }
//     .fmd-date-label {
//       font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--text-low);
//       letter-spacing:0.1em; text-transform:uppercase; white-space:nowrap;
//     }
//     .fmd-date-select {
//       font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.03em;
//       color:var(--accent); background:var(--accent-bg);
//       border:1px solid var(--accent-bdr); border-radius:8px;
//       padding:5px 28px 5px 10px; cursor:pointer; outline:none;
//       appearance:none; -webkit-appearance:none;
//       background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231a6fe8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
//       background-repeat:no-repeat; background-position:right 9px center;
//       transition: border-color 0.18s, background 0.18s; max-width:220px;
//     }
//     .fmd-date-select:hover, .fmd-date-select:focus { border-color:var(--accent); background-color:#dbeafe; }
//     .fmd-date-select option { background:#fff; color:#0f172a; }

//     /* legend */
//     .fmd-legend { display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
//     .fmd-legend-item { display:flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:8.5px; color:var(--text-low); white-space:nowrap; }
//     .fmd-legend-swatch { width:16px; height:3px; border-radius:2px; }

//     .fmd-chart-wrap { flex:1; min-height:180px; }

//     .fmd-no-data {
//       flex:1; min-height:160px; display:flex; flex-direction:column;
//       align-items:center; justify-content:center; gap:8px;
//       font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-xlow);
//     }
//     .fmd-no-data-icon { font-size:28px; margin-bottom:2px; }

//     /* ── TOOLTIP ── */
//     .fmd-tt {
//       background:#fff; border:1px solid var(--border-2);
//       border-radius:10px; padding:10px 14px;
//       font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-hi);
//       box-shadow: var(--shadow-lg);
//     }
//     .fmd-tt-time { font-size:9px; color:var(--text-low); margin-bottom:4px; display:block; letter-spacing:0.06em; }
//     .fmd-tt-row  { display:flex; align-items:baseline; gap:4px; }
//     .fmd-tt-val  { font-size:18px; font-weight:600; color:var(--accent); }
//     .fmd-tt-unit { font-size:10px; color:var(--text-low); }

//     /* ── STATUS STRIP (bottom of graph) ── */
//     .fmd-strip {
//       display:flex; gap:8px; margin-top:12px; flex-shrink:0;
//     }
//     .fmd-strip-item {
//       flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;
//       padding:8px 6px; border-radius:9px; border:1px solid var(--border);
//       background:var(--surface-2);
//     }
//     .fmd-strip-label { font-family:'JetBrains Mono',monospace; font-size:7.5px; color:var(--text-low); text-transform:uppercase; letter-spacing:0.12em; }
//     .fmd-strip-val   { font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; color:var(--text-hi); }
//     .fmd-strip-bar   { width:100%; height:3px; border-radius:2px; margin-top:2px; }

//     /* ── FOOTER ── */
//     .fmd-footer {
//       position:relative; z-index:2; flex-shrink:0;
//       display:flex; justify-content:space-between; align-items:center;
//       padding: 8px 20px 12px;
//       font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:0.1em;
//       color:var(--text-xlow);
//       border-top:1px solid var(--border);
//     }
//     .fmd-footer-left  { display:flex; align-items:center; gap:10px; }
//     .fmd-footer-right { display:flex; align-items:center; gap:10px; }
//     .fmd-footer-sep   { opacity:0.4; }
//     .fmd-footer-badge {
//       padding:2px 8px; border-radius:4px;
//       background:var(--accent-bg); border:1px solid var(--accent-bdr);
//       color:var(--accent); font-size:7.5px; font-weight:600; letter-spacing:0.1em;
//     }

//     /* ─────────────────────────────────
//        RESPONSIVE
//     ───────────────────────────────── */
//     @media (max-width: 640px) {
//       .fmd-header { padding: 0 14px; height:54px; }
//       .fmd-alert  { padding: 8px 14px; font-size:9px; }
//       .fmd-body {
//         grid-template-columns: 1fr; gap:10px;
//         padding: 12px 12px 10px; overflow-y:auto; min-height:0; flex:1;
//       }
//       .fmd-left { flex-direction:column; gap:10px; }
//       .fmd-level-int { font-size:58px; }
//       .fmd-level-dec { font-size:22px; }
//       .fmd-graph-card { min-height:300px; }
//       .fmd-graph-topbar { flex-direction:column; gap:10px; }
//       .fmd-legend { display:none; }
//       .fmd-date-select { max-width:100%; width:100%; }
//       .fmd-footer { flex-direction:column; gap:4px; text-align:center; }
//       .fmd-header-divider, .fmd-nav-pill { display:none; }
//     }

//     @media (min-width: 641px) and (max-width: 900px) {
//       .fmd-body {
//         grid-template-columns:1fr; padding:12px 16px;
//         overflow-y:auto; flex:1; min-height:0;
//       }
//       .fmd-left { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
//       .fmd-left > .fmd-card:first-child { grid-column:1 / -1; }
//       .fmd-graph-card { min-height:280px; }
//     }

//     @media (min-width: 901px) {
//       .fmd-body { grid-template-columns:272px 1fr; height:0; flex:1; min-height:0; }
//       .fmd-chart-wrap { min-height:0; }
//     }

//     .fmd-body::-webkit-scrollbar { width:4px; }
//     .fmd-body::-webkit-scrollbar-track { background:transparent; }
//     .fmd-body::-webkit-scrollbar-thumb { background:var(--border-2); border-radius:2px; }
//   `;
//   document.head.appendChild(s);
// };

// /* ─── helpers ─── */
// const cmToM    = (cm) => (cm / 100).toFixed(2);
// const splitNum = (v)  => { const [i, f] = v.split("."); return { i, f: "." + f }; };

// const fmtDateKey  = (ts) => new Date(ts).toLocaleDateString([], { day:"2-digit", month:"short", year:"numeric" });
// const fmtTimeOnly = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false }) : "";
// const todayKey    = ()   => fmtDateKey(Date.now());

// const CustomTooltip = ({ active, payload }) => {
//   if (!active || !payload?.length) return null;
//   const e = payload[0].payload;
//   return (
//     <div className="fmd-tt">
//       <span className="fmd-tt-time">{e.dateKey} · {fmtTimeOnly(e.timestamp)}</span>
//       <div className="fmd-tt-row">
//         <span className="fmd-tt-val">{e.level}</span>
//         <span className="fmd-tt-unit">metres</span>
//       </div>
//     </div>
//   );
// };

// /* ─── GAUGE ─── */
// const GaugeBar = ({ levelM, maxM = 1 }) => {
//   const pct  = Math.min(100, (levelM / maxM) * 100);
//   const color = levelM >= 0.70 ? "#c8273e" : levelM >= 0.40 ? "#c07c0a" : "#0a9c6b";
//   return (
//     <div className="fmd-gauge-wrap">
//       <div className="fmd-gauge-track">
//         <div
//           className="fmd-gauge-marker"
//           style={{ left:`${pct}%`, background:color }}
//         />
//       </div>
//       <div className="fmd-gauge-ticks">
//         <span>0 m</span><span>0.25</span><span>0.50</span><span>0.75</span><span>1.00 m</span>
//       </div>
//     </div>
//   );
// };

// /* ─── APP ─── */
// function App() {
//   const [waterLevel,     setWaterLevel]     = useState(0);
//   const [allHistory,     setAllHistory]     = useState([]);
//   const [selectedDate,   setSelectedDate]   = useState(todayKey());
//   const [status,         setStatus]         = useState("SAFE");
//   const [time,           setTime]           = useState(new Date());
//   const [predictedLevel, setPredictedLevel] = useState(null);

//   useEffect(() => { injectStyles(); }, []);

//   /* LIVE DATA */
//   useEffect(() => {
//     const liveRef = ref(database, "floodData");
//     onValue(liveRef, (snapshot) => {
//       const data = snapshot.val();
//       if (data?.waterLevel !== undefined) setWaterLevel(data.waterLevel);
//     });
//   }, []);

//   /* AUTO-LOG */
//   useEffect(() => {
//     if (waterLevel === 0) return;
//     push(ref(database, "floodHistory"), { waterLevel, timestamp: Date.now() });
//   }, [waterLevel]);

//   /* HISTORY */
//   useEffect(() => {
//     onValue(ref(database, "floodHistory"), (snapshot) => {
//       const data = snapshot.val();
//       if (!data) return;
//       const formatted = Object.values(data)
//         .filter(item => item.waterLevel !== undefined && item.timestamp !== undefined)
//         .sort((a, b) => a.timestamp - b.timestamp)
//         .map((item) => ({
//           level:     parseFloat(cmToM(item.waterLevel)),
//           timestamp: item.timestamp,
//           dateKey:   fmtDateKey(item.timestamp),
//           label:     fmtTimeOnly(item.timestamp),
//         }));
//       setAllHistory(formatted);
//     });
//   }, []);

//   /* ML PREDICTION */
//   useEffect(() => {
//     const fetchPrediction = async () => {
//       try {
//         const res  = await fetch("http://127.0.0.1:5000/predict");
//         const data = await res.json();
//         setPredictedLevel(data.predictedLevel);
//       } catch (e) { console.error("ML API Error:", e); }
//     };
//     fetchPrediction();
//     const id = setInterval(fetchPrediction, 10000);
//     return () => clearInterval(id);
//   }, []);

//   /* STATUS */
//   useEffect(() => {
//     const m = waterLevel / 100;
//     setStatus(m >= 0.70 ? "DANGER" : m >= 0.40 ? "WARNING" : "SAFE");
//   }, [waterLevel]);

//   /* CLOCK */
//   useEffect(() => {
//     const id = setInterval(() => setTime(new Date()), 1000);
//     return () => clearInterval(id);
//   }, []);

//   /* ── DERIVED ── */
//   const availableDates = useMemo(() => {
//     const seen = new Set(); const out = [];
//     allHistory.forEach(h => { if (!seen.has(h.dateKey)) { seen.add(h.dateKey); out.push(h.dateKey); } });
//     return out.reverse();
//   }, [allHistory]);

//   useEffect(() => {
//     if (availableDates.length && !availableDates.includes(selectedDate))
//       setSelectedDate(availableDates[0]);
//   }, [availableDates, selectedDate]);

//   const history = useMemo(
//     () => allHistory.filter(h => h.dateKey === selectedDate),
//     [allHistory, selectedDate],
//   );

//   const minLevel     = history.length ? Math.min(...history.map(h => h.level)) : null;
//   const maxLevel     = history.length ? Math.max(...history.map(h => h.level)) : null;
//   const avgLevel     = history.length ? (history.reduce((s,h)=>s+h.level,0)/history.length).toFixed(2) : null;
//   const tickInterval = Math.max(1, Math.floor(history.length / 8));

//   const today       = todayKey();
//   const levelStr    = cmToM(waterLevel);
//   const { i, f }   = splitNum(levelStr);
//   const levelM      = waterLevel / 100;

//   const statusClass = status === "SAFE" ? "fmd-status-safe" : status === "WARNING" ? "fmd-status-warn" : "fmd-status-danger";
//   const statusColor = status === "SAFE" ? "#0a9c6b" : status === "WARNING" ? "#c07c0a" : "#c8273e";
//   const lineColor   = status === "SAFE" ? "#1a6fe8" : status === "WARNING" ? "#c07c0a" : "#c8273e";

//   return (
//     <div className="fmd-page">

//       {/* HEADER */}
//       <header className="fmd-header">
//         <div className="fmd-header-left">
//           <div className="fmd-logo">🌊</div>
//           <div className="fmd-wordmark">
//             <span className="fmd-title">Flood Monitor</span>
//             <span className="fmd-subtitle">Real-time · ML-Assisted</span>
//           </div>
//           <div className="fmd-header-divider" />
//           <div className="fmd-nav-pill">
//             <span className="fmd-nav-dot" />
//             Live Monitoring
//           </div>
//         </div>

//         <div className="fmd-header-right">
//           <span className="fmd-loc-badge">📍 Solapur, MH</span>
//           <div className="fmd-time-block">
//             <span className="fmd-time">
//               {time.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false })}
//             </span>
//             <span className="fmd-time-label">Local Time</span>
//           </div>
//         </div>
//       </header>

//       {/* ALERT */}
//       {status === "DANGER" && (
//         <div className="fmd-alert">
//           <span className="fmd-alert-pip" />
//           ⚠ FLOOD RISK DETECTED — TAKE IMMEDIATE ACTION
//           <span className="fmd-alert-spacer" />
//           <button className="fmd-alert-action">DETAILS</button>
//         </div>
//       )}

//       {/* BODY */}
//       <div className="fmd-body">

//         {/* ─ LEFT ─ */}
//         <div className="fmd-left">

//           {/* MAIN LEVEL CARD */}
//           <div className="fmd-card">
//             <div className="fmd-card-eyebrow">
//               <span className="fmd-eyebrow-bar" />
//               Current Water Level
//             </div>

//             <div className="fmd-level-group">
//               <span className="fmd-level-int">{i}</span>
//               <div className="fmd-level-frac">
//                 <span className="fmd-level-dec">{f}</span>
//                 <span className="fmd-level-unit-tag">metres</span>
//               </div>
//             </div>

//             <GaugeBar levelM={levelM} />

//             {predictedLevel !== null && (
//               <div className="fmd-predict">
//                 <span className="fmd-predict-icon">🔮</span>
//                 <span className="fmd-predict-label">ML Forecast</span>
//                 <span className="fmd-predict-val">{predictedLevel} m</span>
//               </div>
//             )}

//             <div
//               className={`fmd-status-badge ${statusClass}`}
//             >
//               <span
//                 className="fmd-status-pip"
//                 style={{ background: statusColor, color: statusColor }}
//               />
//               {status === "SAFE" ? "Safe Level" : status === "WARNING" ? "Warning Level" : "Danger Level"}
//             </div>
//           </div>

//           {/* STAT CARDS */}
//           <div className="fmd-stats-grid">
//             <div className="fmd-stat fmd-stat-min">
//               <span className="fmd-stat-eyebrow">{selectedDate === today ? "Today" : "Day"} Min</span>
//               {minLevel !== null
//                 ? <span className="fmd-stat-value">{minLevel}<span className="fmd-stat-unit">m</span></span>
//                 : <span className="fmd-stat-dash">—</span>
//               }
//             </div>
//             <div className="fmd-stat fmd-stat-max">
//               <span className="fmd-stat-eyebrow">{selectedDate === today ? "Today" : "Day"} Max</span>
//               {maxLevel !== null
//                 ? <span className="fmd-stat-value">{maxLevel}<span className="fmd-stat-unit">m</span></span>
//                 : <span className="fmd-stat-dash">—</span>
//               }
//             </div>
//           </div>
//         </div>

//         {/* ─ RIGHT: GRAPH ─ */}
//         <div className="fmd-graph-card">
//           <div className="fmd-graph-topbar">
//             <div className="fmd-graph-meta">
//               <div className="fmd-graph-eyebrow">
//                 <span className="fmd-eyebrow-bar" />
//                 Water Level Trend
//               </div>
//               <div className="fmd-graph-title">
//                 {selectedDate === today ? "Today's Readings" : selectedDate}
//               </div>
//               <div className="fmd-date-row">
//                 {selectedDate === today && <span className="fmd-live-pip" />}
//                 <span className="fmd-date-label">Date:</span>
//                 <select
//                   className="fmd-date-select"
//                   value={selectedDate}
//                   onChange={(e) => setSelectedDate(e.target.value)}
//                 >
//                   {availableDates.length === 0 && <option disabled>Waiting for data…</option>}
//                   {availableDates.map((d) => {
//                     const count = allHistory.filter(h => h.dateKey === d).length;
//                     return (
//                       <option key={d} value={d}>
//                         {d === today ? `TODAY (${count} pts)` : `${d} (${count} pts)`}
//                       </option>
//                     );
//                   })}
//                 </select>
//               </div>
//             </div>

//             <div className="fmd-legend">
//               <div className="fmd-legend-item">
//                 <div className="fmd-legend-swatch" style={{ background:"#f59e0b" }} />
//                 <span>WARN 0.40 m</span>
//               </div>
//               <div className="fmd-legend-item">
//                 <div className="fmd-legend-swatch" style={{ background:"#ef4444" }} />
//                 <span>CRIT 0.70 m</span>
//               </div>
//               <div className="fmd-legend-item">
//                 <div className="fmd-legend-swatch" style={{ background: lineColor }} />
//                 <span>Level</span>
//               </div>
//             </div>
//           </div>

//           {history.length === 0 ? (
//             <div className="fmd-no-data">
//               <span className="fmd-no-data-icon">📭</span>
//               <span>No data for {selectedDate}</span>
//             </div>
//           ) : (
//             <>
//               <div className="fmd-chart-wrap">
//                 <ResponsiveContainer width="100%" height="100%">
//                   <LineChart data={history} margin={{ left:0, right:14, top:8, bottom:30 }}>
//                     <XAxis
//                       dataKey="label"
//                       interval={tickInterval}
//                       tick={{ fontFamily:"JetBrains Mono,monospace", fontSize:8, fill:"#94a3b8" }}
//                       axisLine={{ stroke:"#e2e8f0" }}
//                       tickLine={false}
//                       angle={-30}
//                       textAnchor="end"
//                       height={44}
//                     />
//                     <YAxis
//                       tick={{ fontFamily:"JetBrains Mono,monospace", fontSize:9, fill:"#94a3b8" }}
//                       axisLine={false} tickLine={false} width={38}
//                       tickFormatter={(v) => `${v}m`}
//                     />
//                     <Tooltip
//                       content={<CustomTooltip />}
//                       cursor={{ stroke:"rgba(26,111,232,0.1)", strokeWidth:1 }}
//                     />
//                     <ReferenceLine y={0.40} stroke="#f59e0b" strokeDasharray="5 4" strokeWidth={1.5} strokeOpacity={0.7} />
//                     <ReferenceLine y={0.70} stroke="#ef4444" strokeDasharray="5 4" strokeWidth={1.5} strokeOpacity={0.7} />
//                     <Line
//                       type="monotone" dataKey="level"
//                       stroke={lineColor} strokeWidth={2}
//                       dot={{ r:2.5, fill:lineColor, strokeWidth:0 }}
//                       activeDot={{ r:5, fill:lineColor, stroke:"rgba(26,111,232,0.2)", strokeWidth:5 }}
//                       isAnimationActive={false}
//                     />
//                   </LineChart>
//                 </ResponsiveContainer>
//               </div>

//               {/* STRIP */}
//               <div className="fmd-strip">
//                 <div className="fmd-strip-item">
//                   <span className="fmd-strip-label">Min</span>
//                   <span className="fmd-strip-val">{minLevel ?? "—"}<span style={{fontSize:9,color:"#94a3b8",marginLeft:2}}>m</span></span>
//                   <div className="fmd-strip-bar" style={{background:"linear-gradient(90deg,#a7f3d0,#6ee7b7)"}} />
//                 </div>
//                 <div className="fmd-strip-item">
//                   <span className="fmd-strip-label">Avg</span>
//                   <span className="fmd-strip-val">{avgLevel ?? "—"}<span style={{fontSize:9,color:"#94a3b8",marginLeft:2}}>m</span></span>
//                   <div className="fmd-strip-bar" style={{background:"linear-gradient(90deg,#bfdbfe,#93c5fd)"}} />
//                 </div>
//                 <div className="fmd-strip-item">
//                   <span className="fmd-strip-label">Max</span>
//                   <span className="fmd-strip-val">{maxLevel ?? "—"}<span style={{fontSize:9,color:"#94a3b8",marginLeft:2}}>m</span></span>
//                   <div className="fmd-strip-bar" style={{background:"linear-gradient(90deg,#fca5a5,#f87171)"}} />
//                 </div>
//                 <div className="fmd-strip-item">
//                   <span className="fmd-strip-label">Points</span>
//                   <span className="fmd-strip-val">{history.length}</span>
//                   <div className="fmd-strip-bar" style={{background:"linear-gradient(90deg,#c7d2fe,#a5b4fc)"}} />
//                 </div>
//               </div>
//             </>
//           )}
//         </div>

//       </div>

//       {/* FOOTER */}
//       <footer className="fmd-footer">
//         <div className="fmd-footer-left">
//           <span className="fmd-footer-badge">FMD v2.2</span>
//           <span className="fmd-footer-sep">·</span>
//           <span>Solapur District Early Warning System</span>
//         </div>
//         <div className="fmd-footer-right">
//           <span>LIVE + ML-ASSISTED</span>
//           <span className="fmd-footer-sep">·</span>
//           <span>{today}</span>
//         </div>
//       </footer>
//     </div>
//   );
// }

// export default App;
import { useEffect, useState, useMemo } from "react";
import { ref, onValue, push } from "firebase/database";
import { database } from "./firebase";

import {
  LineChart, Line, XAxis, YAxis, Tooltip,
  ResponsiveContainer, ReferenceLine, Area, AreaChart,
} from "recharts";

/* ─────────────────────────────────────────────────────────
   CONFIG — set your river's base datum level here (metres)
   This is the absolute river bed / reference elevation.
   Sensor rise is added on top of this.
───────────────────────────────────────────────────────── */
const BASE_LEVEL_M = 435.72; // metres above sea level (from historical CSV min)
const WARN_RISE_M  = 0.40;   // rise threshold for WARNING
const DANGER_RISE_M = 0.70;  // rise threshold for DANGER

/* ─── STYLES ─── */
const injectStyles = () => {
  if (document.getElementById("fmd-styles")) return;
  const s = document.createElement("style");
  s.id = "fmd-styles";
  s.textContent = `
    @import url('https://fonts.googleapis.com/css2?family=JetBrains+Mono:wght@400;500;600;700&family=Plus+Jakarta+Sans:wght@400;500;600;700;800&display=swap');

    *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

    /* ── LIGHT THEME (default) ── */
    :root {
      --safe:         #0a9c6b;
      --safe-bg:      #edfdf6;
      --safe-bdr:     #9ee8cb;
      --warn:         #c07c0a;
      --warn-bg:      #fffbeb;
      --warn-bdr:     #fcd478;
      --danger:       #c8273e;
      --danger-bg:    #fff1f3;
      --danger-bdr:   #fca5b0;
      --accent:       #1a6fe8;
      --accent-2:     #5b4ef8;
      --accent-bg:    #eff4fe;
      --accent-bdr:   #b8d0fb;
      --rise-color:   #7c3aed;
      --rise-bg:      #f5f3ff;
      --rise-bdr:     #c4b5fd;
      --base-color:   #0369a1;
      --base-bg:      #f0f9ff;
      --base-bdr:     #7dd3fc;

      --bg:           #f0f4f9;
      --bg-2:         #ffffff;
      --surface:      #ffffff;
      --surface-2:    #f8fafc;
      --panel:        rgba(255,255,255,0.92);

      --border:       #e2e8f0;
      --border-2:     #d1dae8;
      --text:         #1e293b;
      --text-hi:      #0f172a;
      --text-mid:     #475569;
      --text-low:     #94a3b8;
      --text-xlow:    #b8c7d8;

      --shadow-sm:    0 1px 3px rgba(15,23,42,0.07), 0 1px 2px rgba(15,23,42,0.04);
      --shadow-md:    0 4px 12px rgba(15,23,42,0.09), 0 2px 4px rgba(15,23,42,0.04);
      --shadow-lg:    0 8px 28px rgba(15,23,42,0.11), 0 4px 8px rgba(15,23,42,0.05);
      --dot-color:    rgba(148,163,184,0.3);
    }

    /* ── DARK THEME ── */
    .dark {
      --safe:         #10d9a0;
      --safe-bg:      rgba(16,217,160,0.08);
      --safe-bdr:     rgba(16,217,160,0.25);
      --warn:         #f4b942;
      --warn-bg:      rgba(244,185,66,0.08);
      --warn-bdr:     rgba(244,185,66,0.25);
      --danger:       #f04f6a;
      --danger-bg:    rgba(240,79,106,0.08);
      --danger-bdr:   rgba(240,79,106,0.28);
      --accent:       #4fc3f7;
      --accent-2:     #818cf8;
      --accent-bg:    rgba(79,195,247,0.08);
      --accent-bdr:   rgba(79,195,247,0.2);
      --rise-color:   #a78bfa;
      --rise-bg:      rgba(167,139,250,0.08);
      --rise-bdr:     rgba(167,139,250,0.2);
      --base-color:   #38bdf8;
      --base-bg:      rgba(56,189,248,0.08);
      --base-bdr:     rgba(56,189,248,0.2);

      --bg:           #07101c;
      --bg-2:         #0b1829;
      --surface:      rgba(255,255,255,0.035);
      --surface-2:    rgba(255,255,255,0.02);
      --panel:        rgba(11,24,41,0.92);

      --border:       rgba(255,255,255,0.07);
      --border-2:     rgba(79,195,247,0.12);
      --text:         #c8d8ea;
      --text-hi:      #eaf2fb;
      --text-mid:     #7a9ab8;
      --text-low:     #3d5570;
      --text-xlow:    #2a3f57;

      --shadow-sm:    0 1px 3px rgba(0,0,0,0.3);
      --shadow-md:    0 4px 12px rgba(0,0,0,0.35);
      --shadow-lg:    0 8px 28px rgba(0,0,0,0.45);
      --dot-color:    rgba(79,195,247,0.06);
    }

    @keyframes pulse-ring { 0%{box-shadow:0 0 0 0 currentColor;} 70%{box-shadow:0 0 0 7px transparent;} 100%{box-shadow:0 0 0 0 transparent;} }
    @keyframes blink      { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
    @keyframes fadeUp     { from{opacity:0;transform:translateY(10px);} to{opacity:1;transform:translateY(0);} }
    @keyframes dangerPulse{ 0%,100%{background:var(--danger-bg);} 50%{background:rgba(240,79,106,0.14);} }
    @keyframes sweep      { 0%{transform:translateY(-100vh);} 100%{transform:translateY(100vh);} }
    @keyframes riseUp     { from{opacity:0;transform:scaleY(0);transform-origin:bottom;} to{opacity:1;transform:scaleY(1);} }

    /* ── BASE ── */
    .fmd-page {
      min-height: 100dvh; width: 100%;
      background: var(--bg);
      background-image:
        radial-gradient(ellipse 70% 40% at 10% 0%, rgba(26,111,232,0.05) 0%, transparent 60%),
        radial-gradient(ellipse 50% 35% at 90% 100%, rgba(91,78,248,0.04) 0%, transparent 55%);
      font-family: 'Plus Jakarta Sans', sans-serif;
      color: var(--text);
      display: flex; flex-direction: column;
      position: relative; overflow-x: hidden;
      transition: background 0.35s, color 0.35s;
    }
    .dark.fmd-page {
      background-image:
        radial-gradient(ellipse 80% 50% at 20% -10%, rgba(79,195,247,0.055) 0%, transparent 60%),
        radial-gradient(ellipse 60% 40% at 80% 110%, rgba(129,140,248,0.04) 0%, transparent 60%);
    }
    .fmd-page::before {
      content:''; position:fixed; inset:0; pointer-events:none; z-index:0;
      background-image: radial-gradient(circle, var(--dot-color) 1px, transparent 1px);
      background-size: 28px 28px;
    }
    .dark .fmd-sweep {
      position: fixed; top:0; left:0; right:0; height:1px;
      background: linear-gradient(90deg,transparent,rgba(79,195,247,0.18),transparent);
      animation: sweep 10s linear infinite; pointer-events:none; z-index:1;
    }
    .fmd-sweep { display: none; }
    .dark .fmd-sweep { display: block; }

    /* ── HEADER ── */
    .fmd-header {
      position:relative; z-index:10; flex-shrink:0;
      display:flex; align-items:center; justify-content:space-between;
      padding: 0 24px; height: 58px;
      border-bottom: 1px solid var(--border);
      background: var(--panel);
      backdrop-filter: blur(14px); -webkit-backdrop-filter: blur(14px);
      box-shadow: var(--shadow-sm);
      animation: fadeUp 0.45s ease both;
      transition: background 0.35s, border-color 0.35s;
    }
    .fmd-header-left  { display:flex; align-items:center; gap:14px; }
    .fmd-logo {
      width:34px; height:34px; border-radius:10px; flex-shrink:0;
      background: linear-gradient(145deg, rgba(79,195,247,0.15), rgba(129,140,248,0.15));
      border: 1px solid var(--accent-bdr);
      display:flex; align-items:center; justify-content:center; font-size:16px;
    }
    .fmd-wordmark     { display:flex; flex-direction:column; gap:1px; }
    .fmd-title        { font-size:14px; font-weight:800; letter-spacing:-0.01em; color:var(--text-hi); }
    .fmd-subtitle     { font-family:'JetBrains Mono',monospace; font-size:8.5px; color:var(--text-low); letter-spacing:0.14em; text-transform:uppercase; }
    .fmd-header-divider { width:1px; height:22px; background:var(--border); margin:0 4px; }

    .fmd-nav-pill {
      display:flex; align-items:center; gap:6px;
      padding:5px 12px; border-radius:20px;
      background:var(--accent-bg); border:1px solid var(--accent-bdr);
      font-size:11px; font-weight:600; color:var(--accent); letter-spacing:0.01em;
    }
    .fmd-nav-dot { width:5px; height:5px; border-radius:50%; background:var(--safe); animation:blink 1.8s ease infinite; }

    .fmd-header-right { display:flex; align-items:center; gap:12px; }
    .fmd-loc-badge {
      padding:3px 9px; border-radius:5px;
      background:var(--surface-2); border:1px solid var(--border);
      font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:500;
      color:var(--text-mid); letter-spacing:0.06em;
    }
    .fmd-time-block { display:flex; flex-direction:column; align-items:flex-end; gap:0; }
    .fmd-time {
      font-family:'JetBrains Mono',monospace; font-size:15px; font-weight:600;
      color:var(--text-hi); letter-spacing:0.05em; line-height:1;
    }
    .fmd-time-label { font-family:'JetBrains Mono',monospace; font-size:7.5px; color:var(--text-low); letter-spacing:0.12em; text-transform:uppercase; margin-top:1px; }

    /* ── THEME TOGGLE ── */
    .fmd-theme-toggle {
      width:38px; height:22px; border-radius:11px; border:none;
      cursor:pointer; position:relative; flex-shrink:0;
      background: var(--border-2);
      transition: background 0.3s;
      box-shadow: inset 0 1px 3px rgba(0,0,0,0.15);
    }
    .fmd-theme-toggle.dark-active { background: rgba(79,195,247,0.3); }
    .fmd-theme-toggle::before {
      content: ''; position:absolute; top:3px; left:3px;
      width:16px; height:16px; border-radius:50%;
      background:#fff; box-shadow: 0 1px 3px rgba(0,0,0,0.25);
      transition: transform 0.3s cubic-bezier(0.34,1.56,0.64,1), background 0.3s;
    }
    .fmd-theme-toggle.dark-active::before {
      transform: translateX(16px);
      background: #4fc3f7;
    }
    .fmd-theme-toggle-wrap {
      display:flex; align-items:center; gap:7px;
      font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--text-low);
    }
    .fmd-theme-icon { font-size:13px; }

    /* ── ALERT BANNER ── */
    .fmd-alert {
      position:relative; z-index:9; flex-shrink:0;
      display:flex; align-items:center; gap:10px;
      padding: 9px 24px;
      background: var(--danger-bg);
      border-bottom: 1px solid var(--danger-bdr);
      font-family:'JetBrains Mono',monospace; font-size:10px;
      color: var(--danger); letter-spacing:0.06em; font-weight:600;
      animation: dangerPulse 2.5s ease infinite, fadeUp 0.3s ease both;
    }
    .fmd-alert-pip { width:7px; height:7px; border-radius:50%; background:var(--danger); flex-shrink:0; animation:blink 0.85s ease infinite; }
    .fmd-alert-spacer { flex:1; }
    .fmd-alert-action {
      padding:4px 12px; border-radius:5px;
      background:var(--danger); color:#fff;
      font-size:9px; font-weight:700; letter-spacing:0.1em;
      border:none; cursor:pointer;
    }

    /* ── BODY ── */
    .fmd-body {
      position:relative; z-index:2; flex:1;
      display:grid; grid-template-columns:310px 1fr; gap:14px;
      padding:16px 20px 14px;
      animation: fadeUp 0.5s ease 0.1s both;
    }

    /* ── LEFT COLUMN ── */
    .fmd-left { display:flex; flex-direction:column; gap:12px; }

    /* ── CARDS ── */
    .fmd-card {
      background: var(--surface);
      border: 1px solid var(--border);
      border-radius:16px; padding:18px;
      position:relative; overflow:hidden;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.2s, border-color 0.2s, background 0.35s;
    }
    .fmd-card:hover { box-shadow: var(--shadow-md); border-color:var(--border-2); }

    .fmd-card-eyebrow {
      font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:0.16em;
      color:var(--text-low); text-transform:uppercase; margin-bottom:14px;
      display:flex; align-items:center; gap:7px;
    }
    .fmd-eyebrow-bar {
      display:inline-block; width:14px; height:2px; border-radius:2px;
      background: linear-gradient(90deg,var(--accent),var(--accent-2));
    }

    /* ── DUAL LEVEL DISPLAY ── */
    .fmd-total-level {
      display:flex; align-items:flex-start; gap:3px;
      padding: 4px 0 0; justify-content:center;
    }
    .fmd-level-int {
      font-family:'JetBrains Mono',monospace; font-size:60px; font-weight:700;
      line-height:1; color:var(--text-hi); letter-spacing:-3px;
    }
    .fmd-level-frac {
      display:flex; flex-direction:column; justify-content:flex-end;
      padding-bottom:7px; gap:1px;
    }
    .fmd-level-dec {
      font-family:'JetBrains Mono',monospace; font-size:24px; font-weight:500;
      color:var(--text-hi); letter-spacing:-1px;
    }
    .fmd-level-unit-tag {
      font-family:'JetBrains Mono',monospace; font-size:9px;
      color:var(--text-low); letter-spacing:0.08em; text-transform:uppercase;
    }
    .fmd-level-label {
      text-align:center; font-family:'JetBrains Mono',monospace;
      font-size:8.5px; color:var(--text-low); letter-spacing:0.14em;
      text-transform:uppercase; margin-bottom:12px;
    }

    /* Breakdown row: base + rise */
    .fmd-breakdown {
      display:grid; grid-template-columns:1fr auto 1fr; gap:6px;
      align-items:center; margin: 10px 0 14px;
    }
    .fmd-bd-item {
      display:flex; flex-direction:column; gap:4px;
      padding:10px 12px; border-radius:12px; border:1px solid;
    }
    .fmd-bd-base { background:var(--base-bg); border-color:var(--base-bdr); }
    .fmd-bd-rise { background:var(--rise-bg); border-color:var(--rise-bdr); }
    .fmd-bd-label {
      font-family:'JetBrains Mono',monospace; font-size:7.5px;
      letter-spacing:0.16em; text-transform:uppercase;
    }
    .fmd-bd-base .fmd-bd-label { color:var(--base-color); }
    .fmd-bd-rise .fmd-bd-label { color:var(--rise-color); }
    .fmd-bd-value {
      font-family:'JetBrains Mono',monospace; font-size:20px; font-weight:600; line-height:1;
    }
    .fmd-bd-base .fmd-bd-value { color:var(--base-color); }
    .fmd-bd-rise .fmd-bd-value { color:var(--rise-color); }
    .fmd-bd-unit { font-size:10px; font-weight:400; color:var(--text-low); margin-left:1px; }
    .fmd-bd-plus {
      display:flex; align-items:center; justify-content:center;
      font-family:'JetBrains Mono',monospace; font-size:18px; font-weight:700;
      color:var(--text-xlow);
    }

    /* rise indicator arrow */
    .fmd-rise-indicator {
      display:flex; align-items:center; gap:6px;
      padding:7px 11px; border-radius:9px;
      background:var(--rise-bg); border:1px solid var(--rise-bdr);
      margin-bottom:12px;
    }
    .fmd-rise-arrow { font-size:14px; }
    .fmd-rise-text {
      flex:1; font-size:11px; font-weight:600; color:var(--rise-color);
    }
    .fmd-rise-val {
      font-family:'JetBrains Mono',monospace; font-size:13px; font-weight:700;
      color:var(--rise-color);
    }

    /* gauge bar */
    .fmd-gauge-wrap { margin: 0 0 12px; }
    .fmd-gauge-track {
      height:6px; border-radius:3px;
      background: linear-gradient(90deg, #dcfce7 0%, #fef9c3 55%, #fee2e2 85%, #fecdd3 100%);
      position:relative; overflow:visible;
      border: 1px solid var(--border);
    }
    .dark .fmd-gauge-track {
      background: linear-gradient(90deg, rgba(16,217,160,0.25) 0%, rgba(244,185,66,0.25) 55%, rgba(240,79,106,0.3) 85%, rgba(240,79,106,0.4) 100%);
    }
    .fmd-gauge-fill {
      position:absolute; left:0; top:0; bottom:0; border-radius:3px;
      transition: width 0.6s cubic-bezier(0.34,1.56,0.64,1);
    }
    .fmd-gauge-marker {
      position:absolute; top:-4px; width:14px; height:14px;
      border-radius:50%; border:2px solid var(--surface);
      box-shadow: 0 1px 4px rgba(15,23,42,0.25);
      transform:translateX(-50%);
      transition: left 0.6s cubic-bezier(0.34,1.56,0.64,1);
      z-index:2;
    }
    .fmd-gauge-ticks {
      display:flex; justify-content:space-between; margin-top:6px;
      font-family:'JetBrains Mono',monospace; font-size:8px; color:var(--text-xlow);
    }

    /* prediction row */
    .fmd-predict {
      display:flex; align-items:center; gap:8px;
      background: var(--accent-bg); border: 1px solid var(--accent-bdr);
      border-radius:10px; padding:9px 12px; margin-bottom:12px;
      font-size:11px; color:var(--text-mid);
    }
    .fmd-predict-icon { font-size:13px; }
    .fmd-predict-label { flex:1; font-weight:500; }
    .fmd-predict-val {
      font-family:'JetBrains Mono',monospace; color:var(--accent);
      font-weight:600; font-size:13px;
    }

    /* status badge */
    .fmd-status-badge {
      display:flex; align-items:center; justify-content:center; gap:8px;
      width:100%; padding:10px;
      border-radius:10px; border:1px solid;
      font-family:'JetBrains Mono',monospace; font-size:11px; font-weight:600;
      letter-spacing:0.14em; text-transform:uppercase;
      transition: all 0.3s ease;
    }
    .fmd-status-pip { width:7px; height:7px; border-radius:50%; flex-shrink:0; animation:pulse-ring 2s ease infinite; }
    .fmd-status-safe   { color:var(--safe);   background:var(--safe-bg);   border-color:var(--safe-bdr); }
    .fmd-status-warn   { color:var(--warn);   background:var(--warn-bg);   border-color:var(--warn-bdr); }
    .fmd-status-danger { color:var(--danger); background:var(--danger-bg); border-color:var(--danger-bdr); }

    /* stats */
    .fmd-stats-grid { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
    .fmd-stat {
      background:var(--surface); border:1px solid var(--border);
      border-radius:14px; padding:14px 16px;
      display:flex; flex-direction:column; gap:5px;
      box-shadow: var(--shadow-sm);
      transition: box-shadow 0.2s, border-color 0.2s, background 0.35s;
      position:relative; overflow:hidden;
    }
    .fmd-stat::after {
      content:''; position:absolute; top:0; left:0; right:0; height:3px;
      border-radius:14px 14px 0 0;
    }
    .fmd-stat-min::after { background: linear-gradient(90deg,#a7f3d0,#6ee7b7); }
    .fmd-stat-max::after { background: linear-gradient(90deg,#fca5a5,#f87171); }
    .fmd-stat:hover { box-shadow:var(--shadow-md); border-color:var(--border-2); }
    .fmd-stat-eyebrow { font-family:'JetBrains Mono',monospace; font-size:8px; letter-spacing:0.14em; color:var(--text-low); text-transform:uppercase; }
    .fmd-stat-value { font-family:'JetBrains Mono',monospace; font-size:26px; font-weight:600; color:var(--text-hi); line-height:1.1; }
    .fmd-stat-unit { font-size:12px; color:var(--text-low); font-weight:400; margin-left:2px; }
    .fmd-stat-dash { font-size:18px; color:var(--text-xlow); }

    /* ── GRAPH CARD ── */
    .fmd-graph-card {
      background: var(--surface); border: 1px solid var(--border);
      border-radius:16px; padding:20px 18px 14px;
      display:flex; flex-direction:column; min-height:0;
      box-shadow: var(--shadow-sm);
      position:relative; overflow:hidden;
      transition: background 0.35s, border-color 0.35s;
    }
    .fmd-graph-topbar {
      display:flex; align-items:flex-start; justify-content:space-between;
      gap:14px; margin-bottom:14px; flex-shrink:0; flex-wrap:wrap;
    }
    .fmd-graph-meta { display:flex; flex-direction:column; gap:9px; }
    .fmd-graph-eyebrow {
      font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:0.16em;
      color:var(--text-low); text-transform:uppercase;
      display:flex; align-items:center; gap:7px;
    }
    .fmd-graph-title { font-size:16px; font-weight:700; color:var(--text-hi); letter-spacing:-0.01em; }

    /* chart tab switcher */
    .fmd-chart-tabs { display:flex; gap:6px; }
    .fmd-chart-tab {
      padding:4px 12px; border-radius:6px; border:1px solid var(--border);
      font-family:'JetBrains Mono',monospace; font-size:9px; font-weight:600;
      letter-spacing:0.08em; cursor:pointer; color:var(--text-low);
      background:transparent; text-transform:uppercase;
      transition: all 0.2s;
    }
    .fmd-chart-tab.active {
      background:var(--accent-bg); border-color:var(--accent-bdr);
      color:var(--accent);
    }

    /* date selector */
    .fmd-date-row { display:flex; align-items:center; gap:8px; }
    .fmd-live-pip { width:6px; height:6px; border-radius:50%; background:var(--safe); flex-shrink:0; animation:blink 1.6s ease infinite; }
    .fmd-date-label { font-family:'JetBrains Mono',monospace; font-size:9px; color:var(--text-low); letter-spacing:0.1em; text-transform:uppercase; white-space:nowrap; }
    .fmd-date-select {
      font-family:'JetBrains Mono',monospace; font-size:10px; letter-spacing:0.03em;
      color:var(--accent); background:var(--accent-bg);
      border:1px solid var(--accent-bdr); border-radius:8px;
      padding:5px 28px 5px 10px; cursor:pointer; outline:none;
      appearance:none; -webkit-appearance:none;
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%231a6fe8' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
      background-repeat:no-repeat; background-position:right 9px center;
      transition: border-color 0.18s; max-width:220px;
    }
    .dark .fmd-date-select {
      background-image:url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='10' height='6'%3E%3Cpath d='M1 1l4 4 4-4' stroke='%234fc3f7' stroke-width='1.5' fill='none' stroke-linecap='round'/%3E%3C/svg%3E");
    }
    .fmd-date-select:hover, .fmd-date-select:focus { border-color:var(--accent); }
    .fmd-date-select option { background: var(--bg-2); color: var(--text-hi); }

    /* legend */
    .fmd-legend { display:flex; gap:14px; align-items:center; flex-wrap:wrap; }
    .fmd-legend-item { display:flex; align-items:center; gap:5px; font-family:'JetBrains Mono',monospace; font-size:8.5px; color:var(--text-low); white-space:nowrap; }
    .fmd-legend-swatch { width:16px; height:3px; border-radius:2px; }
    .fmd-chart-wrap { flex:1; min-height:180px; }
    .fmd-no-data {
      flex:1; min-height:160px; display:flex; flex-direction:column;
      align-items:center; justify-content:center; gap:8px;
      font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-xlow);
    }
    .fmd-no-data-icon { font-size:28px; margin-bottom:2px; }

    /* ── TOOLTIP ── */
    .fmd-tt {
      background:var(--bg-2); border:1px solid var(--border-2);
      border-radius:10px; padding:10px 14px;
      font-family:'JetBrains Mono',monospace; font-size:11px; color:var(--text-hi);
      box-shadow: var(--shadow-lg);
    }
    .fmd-tt-time { font-size:9px; color:var(--text-low); margin-bottom:6px; display:block; letter-spacing:0.06em; }
    .fmd-tt-row  { display:flex; align-items:baseline; gap:4px; margin-bottom:3px; }
    .fmd-tt-label{ font-size:8px; color:var(--text-low); letter-spacing:0.1em; text-transform:uppercase; min-width:36px; }
    .fmd-tt-val  { font-size:15px; font-weight:600; }
    .fmd-tt-unit { font-size:9px; color:var(--text-low); }
    .fmd-tt-divider { border:none; border-top:1px solid var(--border); margin:5px 0; }
    .fmd-tt-total-val { font-size:15px; font-weight:700; color:var(--accent); }

    /* ── STRIP ── */
    .fmd-strip { display:flex; gap:8px; margin-top:12px; flex-shrink:0; }
    .fmd-strip-item {
      flex:1; display:flex; flex-direction:column; align-items:center; gap:3px;
      padding:8px 6px; border-radius:9px; border:1px solid var(--border);
      background:var(--surface-2); transition: background 0.35s;
    }
    .fmd-strip-label { font-family:'JetBrains Mono',monospace; font-size:7.5px; color:var(--text-low); text-transform:uppercase; letter-spacing:0.12em; }
    .fmd-strip-val   { font-family:'JetBrains Mono',monospace; font-size:12px; font-weight:600; color:var(--text-hi); }
    .fmd-strip-bar   { width:100%; height:3px; border-radius:2px; margin-top:2px; }

    /* ── FOOTER ── */
    .fmd-footer {
      position:relative; z-index:2; flex-shrink:0;
      display:flex; justify-content:space-between; align-items:center;
      padding: 8px 20px 12px;
      font-family:'JetBrains Mono',monospace; font-size:8.5px; letter-spacing:0.1em;
      color:var(--text-xlow); border-top:1px solid var(--border);
      transition: border-color 0.35s;
    }
    .fmd-footer-left  { display:flex; align-items:center; gap:10px; }
    .fmd-footer-right { display:flex; align-items:center; gap:10px; }
    .fmd-footer-sep   { opacity:0.4; }
    .fmd-footer-badge {
      padding:2px 8px; border-radius:4px;
      background:var(--accent-bg); border:1px solid var(--accent-bdr);
      color:var(--accent); font-size:7.5px; font-weight:600; letter-spacing:0.1em;
    }

    /* ─── RESPONSIVE ─── */
    @media (max-width: 640px) {
      .fmd-header { padding: 0 14px; height:54px; }
      .fmd-alert  { padding: 8px 14px; font-size:9px; }
      .fmd-body { grid-template-columns:1fr; gap:10px; padding:12px 12px 10px; overflow-y:auto; min-height:0; flex:1; }
      .fmd-left { flex-direction:column; gap:10px; }
      .fmd-level-int { font-size:50px; }
      .fmd-level-dec { font-size:20px; }
      .fmd-graph-card { min-height:300px; }
      .fmd-graph-topbar { flex-direction:column; gap:10px; }
      .fmd-legend { display:none; }
      .fmd-date-select { max-width:100%; width:100%; }
      .fmd-footer { flex-direction:column; gap:4px; text-align:center; }
      .fmd-header-divider, .fmd-nav-pill { display:none; }
      .fmd-breakdown { grid-template-columns:1fr auto 1fr; }
    }
    @media (min-width: 641px) and (max-width: 900px) {
      .fmd-body { grid-template-columns:1fr; padding:12px 16px; overflow-y:auto; flex:1; min-height:0; }
      .fmd-left { display:grid; grid-template-columns:1fr 1fr; gap:10px; }
      .fmd-left > .fmd-card:first-child { grid-column:1 / -1; }
      .fmd-graph-card { min-height:280px; }
    }
    @media (min-width: 901px) {
      .fmd-body { grid-template-columns:310px 1fr; height:0; flex:1; min-height:0; }
      .fmd-chart-wrap { min-height:0; }
    }
    .fmd-body::-webkit-scrollbar { width:4px; }
    .fmd-body::-webkit-scrollbar-track { background:transparent; }
    .fmd-body::-webkit-scrollbar-thumb { background:var(--border-2); border-radius:2px; }
  `;
  document.head.appendChild(s);
};

/* ─── helpers ─── */
const cmToM     = (cm)  => (cm / 100).toFixed(2);
const splitNum  = (v)   => { const [i, f] = v.split("."); return { i, f: "." + f }; };

const fmtDateKey  = (ts) => new Date(ts).toLocaleDateString([], { day:"2-digit", month:"short", year:"numeric" });
const fmtTimeOnly = (ts) => ts ? new Date(ts).toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false }) : "";
const todayKey    = ()   => fmtDateKey(Date.now());

/* ─── CUSTOM TOOLTIP ─── */
const CustomTooltip = ({ active, payload }) => {
  if (!active || !payload?.length) return null;
  const e = payload[0].payload;
  const totalLevel = (BASE_LEVEL_M + e.rise).toFixed(2);
  return (
    <div className="fmd-tt">
      <span className="fmd-tt-time">{e.dateKey} · {fmtTimeOnly(e.timestamp)}</span>
      <div className="fmd-tt-row">
        <span className="fmd-tt-label">Base</span>
        <span className="fmd-tt-val" style={{color:"var(--base-color)"}}>{BASE_LEVEL_M.toFixed(2)}</span>
        <span className="fmd-tt-unit">m</span>
      </div>
      <div className="fmd-tt-row">
        <span className="fmd-tt-label">Rise</span>
        <span className="fmd-tt-val" style={{color:"var(--rise-color)"}}>+{e.rise.toFixed(2)}</span>
        <span className="fmd-tt-unit">m</span>
      </div>
      <hr className="fmd-tt-divider" />
      <div className="fmd-tt-row">
        <span className="fmd-tt-label">Total</span>
        <span className="fmd-tt-total-val">{totalLevel}</span>
        <span className="fmd-tt-unit">m</span>
      </div>
    </div>
  );
};

/* ─── GAUGE ─── */
const GaugeBar = ({ riseM }) => {
  const maxRise = 1.0;
  const pct     = Math.min(100, (riseM / maxRise) * 100);
  const warnPct = (WARN_RISE_M / maxRise) * 100;
  const dangerPct = (DANGER_RISE_M / maxRise) * 100;
  const color   = riseM >= DANGER_RISE_M ? "#c8273e" : riseM >= WARN_RISE_M ? "#c07c0a" : "#0a9c6b";
  const fillColor = riseM >= DANGER_RISE_M
    ? "linear-gradient(90deg,#a7f3d0,#fcd478,#fca5b0)"
    : riseM >= WARN_RISE_M
    ? "linear-gradient(90deg,#a7f3d0,#fcd478)"
    : "linear-gradient(90deg,#a7f3d0,#6ee7b7)";
  return (
    <div className="fmd-gauge-wrap">
      <div className="fmd-gauge-track">
        <div className="fmd-gauge-fill" style={{ width:`${pct}%`, background:fillColor, opacity:0.45 }} />
        {/* warn marker */}
        <div style={{
          position:"absolute", left:`${warnPct}%`, top:-3, bottom:-3,
          width:"1px", background:"#c07c0a", opacity:0.5
        }} />
        {/* danger marker */}
        <div style={{
          position:"absolute", left:`${dangerPct}%`, top:-3, bottom:-3,
          width:"1px", background:"#c8273e", opacity:0.5
        }} />
        <div className="fmd-gauge-marker" style={{ left:`${pct}%`, background:color }} />
      </div>
      <div className="fmd-gauge-ticks">
        <span>0 m rise</span><span>+0.25</span><span>+0.50</span><span>+0.75</span><span>+1.00 m</span>
      </div>
    </div>
  );
};

/* ─── THEME TOGGLE BUTTON ─── */
const ThemeToggle = ({ isDark, onToggle }) => (
  <div className="fmd-theme-toggle-wrap">
    <span className="fmd-theme-icon">{isDark ? "🌙" : "☀️"}</span>
    <button
      className={`fmd-theme-toggle${isDark ? " dark-active" : ""}`}
      onClick={onToggle}
      title={isDark ? "Switch to light mode" : "Switch to dark mode"}
    />
  </div>
);

/* ─── APP ─── */
function App() {
  const [waterLevel,     setWaterLevel]     = useState(0);
  const [allHistory,     setAllHistory]     = useState([]);
  const [selectedDate,   setSelectedDate]   = useState(todayKey());
  const [status,         setStatus]         = useState("SAFE");
  const [time,           setTime]           = useState(new Date());
  const [predictedLevel, setPredictedLevel] = useState(null);
  const [isDark,         setIsDark]         = useState(false);
  const [chartMode,      setChartMode]      = useState("rise"); // "rise" | "total"

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
        .map((item) => {
          const rise = parseFloat(cmToM(item.waterLevel));
          return {
            rise,
            total:     parseFloat((BASE_LEVEL_M + rise).toFixed(2)),
            level:     rise, // kept for legacy compat
            timestamp: item.timestamp,
            dateKey:   fmtDateKey(item.timestamp),
            label:     fmtTimeOnly(item.timestamp),
          };
        });
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

  /* STATUS — based on rise */
  useEffect(() => {
    const riseM = waterLevel / 100;
    setStatus(riseM >= DANGER_RISE_M ? "DANGER" : riseM >= WARN_RISE_M ? "WARNING" : "SAFE");
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

  const riseValues  = history.map(h => h.rise);
  const totalValues = history.map(h => h.total);

  const minRise  = riseValues.length  ? Math.min(...riseValues)  : null;
  const maxRise  = riseValues.length  ? Math.max(...riseValues)  : null;
  const avgRise  = riseValues.length  ? (riseValues.reduce((s,v)=>s+v,0)/riseValues.length).toFixed(2) : null;
  const minTotal = totalValues.length ? Math.min(...totalValues) : null;
  const maxTotal = totalValues.length ? Math.max(...totalValues) : null;
  const tickInterval = Math.max(1, Math.floor(history.length / 8));

  const today      = todayKey();
  const riseM      = waterLevel / 100;
  const riseStr    = riseM.toFixed(2);
  const totalLevel = (BASE_LEVEL_M + riseM).toFixed(2);
  const { i, f }   = splitNum(totalLevel);

  const statusClass = status === "SAFE" ? "fmd-status-safe" : status === "WARNING" ? "fmd-status-warn" : "fmd-status-danger";
  const statusColor = status === "SAFE" ? "var(--safe)" : status === "WARNING" ? "var(--warn)" : "var(--danger)";

  // chart config based on mode
  const chartDataKey   = chartMode === "rise" ? "rise" : "total";
  const chartColor     = chartMode === "rise" ? "var(--rise-color)" : "var(--accent)";
  const chartColorHex  = chartMode === "rise" ? "#7c3aed" : "#1a6fe8";
  const warnRef        = chartMode === "rise" ? WARN_RISE_M   : BASE_LEVEL_M + WARN_RISE_M;
  const dangerRef      = chartMode === "rise" ? DANGER_RISE_M : BASE_LEVEL_M + DANGER_RISE_M;

  return (
    <div className={`fmd-page${isDark ? " dark" : ""}`}>
      <div className="fmd-sweep" />

      {/* HEADER */}
      <header className="fmd-header">
        <div className="fmd-header-left">
          <div className="fmd-logo">🌊</div>
          <div className="fmd-wordmark">
            <span className="fmd-title">Flood Monitor</span>
            <span className="fmd-subtitle">Real-time · ML-Assisted</span>
          </div>
          <div className="fmd-header-divider" />
          <div className="fmd-nav-pill">
            <span className="fmd-nav-dot" />
            Live Monitoring
          </div>
        </div>
        <div className="fmd-header-right">
          <ThemeToggle isDark={isDark} onToggle={() => setIsDark(d => !d)} />
          <span className="fmd-loc-badge">📍 Solapur, MH</span>
          <div className="fmd-time-block">
            <span className="fmd-time">
              {time.toLocaleTimeString([], { hour:"2-digit", minute:"2-digit", second:"2-digit", hour12:false })}
            </span>
            <span className="fmd-time-label">Local Time</span>
          </div>
        </div>
      </header>

      {/* ALERT */}
      {status === "DANGER" && (
        <div className="fmd-alert">
          <span className="fmd-alert-pip" />
          ⚠ FLOOD RISK DETECTED — TAKE IMMEDIATE ACTION
          <span className="fmd-alert-spacer" />
          <button className="fmd-alert-action">DETAILS</button>
        </div>
      )}

      {/* BODY */}
      <div className="fmd-body">

        {/* ─ LEFT ─ */}
        <div className="fmd-left">

          {/* MAIN LEVEL CARD */}
          <div className="fmd-card">
            <div className="fmd-card-eyebrow">
              <span className="fmd-eyebrow-bar" />
              Actual Water Level
            </div>

            {/* TOTAL = BASE + RISE */}
            <div className="fmd-total-level">
              <span className="fmd-level-int">{i}</span>
              <div className="fmd-level-frac">
                <span className="fmd-level-dec">{f}</span>
                <span className="fmd-level-unit-tag">metres</span>
              </div>
            </div>
            <div className="fmd-level-label">Total Level (Base + Rise)</div>

            {/* BREAKDOWN */}
            <div className="fmd-breakdown">
              <div className="fmd-bd-item fmd-bd-base">
                <span className="fmd-bd-label">Base</span>
                <span className="fmd-bd-value">
                  {BASE_LEVEL_M.toFixed(2)}
                  <span className="fmd-bd-unit">m</span>
                </span>
              </div>
              <div className="fmd-bd-plus">+</div>
              <div className="fmd-bd-item fmd-bd-rise">
                <span className="fmd-bd-label">Rise</span>
                <span className="fmd-bd-value">
                  {riseStr}
                  <span className="fmd-bd-unit">m</span>
                </span>
              </div>
            </div>

            {/* GAUGE — shows rise */}
            <GaugeBar riseM={riseM} />

            {/* RISE INDICATOR */}
            <div className="fmd-rise-indicator">
              <span className="fmd-rise-arrow">{riseM > 0 ? "📈" : "➡️"}</span>
              <span className="fmd-rise-text">Sensor Rise from Base</span>
              <span className="fmd-rise-val">+{riseStr} m</span>
            </div>

            {/* ML PREDICTION */}
            {predictedLevel !== null && (
              <div className="fmd-predict">
                <span className="fmd-predict-icon">🔮</span>
                <span className="fmd-predict-label">ML Forecast (rise)</span>
                <span className="fmd-predict-val">+{predictedLevel} m</span>
              </div>
            )}

            {/* STATUS */}
            <div className={`fmd-status-badge ${statusClass}`}>
              <span className="fmd-status-pip" style={{ background: statusColor, color: statusColor }} />
              {status === "SAFE" ? "Safe Level" : status === "WARNING" ? "Warning Level" : "Danger Level"}
            </div>
          </div>

          {/* STAT CARDS */}
          <div className="fmd-stats-grid">
            <div className="fmd-stat fmd-stat-min">
              <span className="fmd-stat-eyebrow">{selectedDate === today ? "Today" : "Day"} Min Rise</span>
              {minRise !== null
                ? <span className="fmd-stat-value">+{minRise}<span className="fmd-stat-unit">m</span></span>
                : <span className="fmd-stat-dash">—</span>
              }
            </div>
            <div className="fmd-stat fmd-stat-max">
              <span className="fmd-stat-eyebrow">{selectedDate === today ? "Today" : "Day"} Max Rise</span>
              {maxRise !== null
                ? <span className="fmd-stat-value">+{maxRise}<span className="fmd-stat-unit">m</span></span>
                : <span className="fmd-stat-dash">—</span>
              }
            </div>
          </div>
        </div>

        {/* ─ RIGHT: GRAPH ─ */}
        <div className="fmd-graph-card">
          <div className="fmd-graph-topbar">
            <div className="fmd-graph-meta">
              <div className="fmd-graph-eyebrow">
                <span className="fmd-eyebrow-bar" />
                Water Level Trend
              </div>
              <div className="fmd-graph-title">
                {selectedDate === today ? "Today's Readings" : selectedDate}
              </div>
              <div style={{display:"flex", alignItems:"center", gap:10, flexWrap:"wrap"}}>
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
                {/* Chart mode tabs */}
                <div className="fmd-chart-tabs">
                  <button
                    className={`fmd-chart-tab${chartMode === "rise" ? " active" : ""}`}
                    onClick={() => setChartMode("rise")}
                  >Rise</button>
                  <button
                    className={`fmd-chart-tab${chartMode === "total" ? " active" : ""}`}
                    onClick={() => setChartMode("total")}
                  >Total</button>
                </div>
              </div>
            </div>

            <div className="fmd-legend">
              <div className="fmd-legend-item">
                <div className="fmd-legend-swatch" style={{ background:"#f59e0b" }} />
                <span>WARN {chartMode === "rise" ? `+${WARN_RISE_M}m` : `${(BASE_LEVEL_M+WARN_RISE_M).toFixed(2)}m`}</span>
              </div>
              <div className="fmd-legend-item">
                <div className="fmd-legend-swatch" style={{ background:"#ef4444" }} />
                <span>CRIT {chartMode === "rise" ? `+${DANGER_RISE_M}m` : `${(BASE_LEVEL_M+DANGER_RISE_M).toFixed(2)}m`}</span>
              </div>
              <div className="fmd-legend-item">
                <div className="fmd-legend-swatch" style={{ background: chartColorHex }} />
                <span>{chartMode === "rise" ? "Rise (m)" : "Total Level (m)"}</span>
              </div>
            </div>
          </div>

          {history.length === 0 ? (
            <div className="fmd-no-data">
              <span className="fmd-no-data-icon">📭</span>
              <span>No data for {selectedDate}</span>
            </div>
          ) : (
            <>
              <div className="fmd-chart-wrap">
                <ResponsiveContainer width="100%" height="100%">
                  <AreaChart data={history} margin={{ left:0, right:14, top:8, bottom:30 }}>
                    <defs>
                      <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                        <stop offset="5%"  stopColor={chartColorHex} stopOpacity={0.15} />
                        <stop offset="95%" stopColor={chartColorHex} stopOpacity={0.01} />
                      </linearGradient>
                    </defs>
                    <XAxis
                      dataKey="label"
                      interval={tickInterval}
                      tick={{ fontFamily:"JetBrains Mono,monospace", fontSize:8, fill:"#94a3b8" }}
                      axisLine={{ stroke:"var(--border)" }}
                      tickLine={false}
                      angle={-30}
                      textAnchor="end"
                      height={44}
                    />
                    <YAxis
                      tick={{ fontFamily:"JetBrains Mono,monospace", fontSize:9, fill:"#94a3b8" }}
                      axisLine={false} tickLine={false} width={48}
                      tickFormatter={(v) => chartMode === "rise" ? `+${v}m` : `${v}m`}
                    />
                    <Tooltip
                      content={<CustomTooltip />}
                      cursor={{ stroke:"rgba(99,102,241,0.12)", strokeWidth:1 }}
                    />
                    <ReferenceLine y={warnRef}   stroke="#f59e0b" strokeDasharray="5 4" strokeWidth={1.5} strokeOpacity={0.7} />
                    <ReferenceLine y={dangerRef} stroke="#ef4444" strokeDasharray="5 4" strokeWidth={1.5} strokeOpacity={0.7} />
                    <Area
                      type="monotone" dataKey={chartDataKey}
                      stroke={chartColorHex} strokeWidth={2}
                      fill="url(#areaGrad)"
                      dot={{ r:2.5, fill:chartColorHex, strokeWidth:0 }}
                      activeDot={{ r:5, fill:chartColorHex, stroke:"rgba(124,58,237,0.2)", strokeWidth:5 }}
                      isAnimationActive={false}
                    />
                  </AreaChart>
                </ResponsiveContainer>
              </div>

              {/* STRIP */}
              <div className="fmd-strip">
                <div className="fmd-strip-item">
                  <span className="fmd-strip-label">Min Rise</span>
                  <span className="fmd-strip-val">+{minRise ?? "—"}<span style={{fontSize:9,color:"var(--text-low)",marginLeft:2}}>m</span></span>
                  <div className="fmd-strip-bar" style={{background:"linear-gradient(90deg,#a7f3d0,#6ee7b7)"}} />
                </div>
                <div className="fmd-strip-item">
                  <span className="fmd-strip-label">Avg Rise</span>
                  <span className="fmd-strip-val">+{avgRise ?? "—"}<span style={{fontSize:9,color:"var(--text-low)",marginLeft:2}}>m</span></span>
                  <div className="fmd-strip-bar" style={{background:"linear-gradient(90deg,#c7d2fe,#a5b4fc)"}} />
                </div>
                <div className="fmd-strip-item">
                  <span className="fmd-strip-label">Max Rise</span>
                  <span className="fmd-strip-val">+{maxRise ?? "—"}<span style={{fontSize:9,color:"var(--text-low)",marginLeft:2}}>m</span></span>
                  <div className="fmd-strip-bar" style={{background:"linear-gradient(90deg,#fca5a5,#f87171)"}} />
                </div>
                <div className="fmd-strip-item">
                  <span className="fmd-strip-label">Max Total</span>
                  <span className="fmd-strip-val">{maxTotal ?? "—"}<span style={{fontSize:9,color:"var(--text-low)",marginLeft:2}}>m</span></span>
                  <div className="fmd-strip-bar" style={{background:"linear-gradient(90deg,#bfdbfe,#93c5fd)"}} />
                </div>
                <div className="fmd-strip-item">
                  <span className="fmd-strip-label">Points</span>
                  <span className="fmd-strip-val">{history.length}</span>
                  <div className="fmd-strip-bar" style={{background:"linear-gradient(90deg,#e0e7ff,#c7d2fe)"}} />
                </div>
              </div>
            </>
          )}
        </div>

      </div>

      {/* FOOTER */}
      <footer className="fmd-footer">
        <div className="fmd-footer-left">
          <span className="fmd-footer-badge">FMD v3.0</span>
          <span className="fmd-footer-sep">·</span>
          <span>Solapur District Early Warning System</span>
        </div>
        <div className="fmd-footer-right">
          <span>BASE {BASE_LEVEL_M} m · LIVE + ML</span>
          <span className="fmd-footer-sep">·</span>
          <span>{today}</span>
        </div>
      </footer>
    </div>
  );
}

export default App;