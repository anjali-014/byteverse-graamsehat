import { useState, useRef } from "react";

/* ─────────────────────────────────────────────────
   MOCK DATA
───────────────────────────────────────────────── */
const PATNA_DOCTORS = [
  { id: 1, name: "Dr. Rajesh Kumar", specialty: "General Physician", hospital: "PMCH, Patna", address: "Ashok Rajpath, Patna – 800004", phone: "0612-2300000", dist: "2.1 km", avail: "Mon–Sat, 10am–4pm" },
  { id: 2, name: "Dr. Sunita Verma", specialty: "Gynaecologist & Obstetrician", hospital: "NMCH, Patna", address: "Agamkuan, Patna – 800007", phone: "0612-2631056", dist: "3.4 km", avail: "Mon–Fri, 9am–2pm" },
  { id: 3, name: "Dr. Amit Singh", specialty: "Internal Medicine", hospital: "Ruban Memorial Hospital", address: "Bailey Road, Patna – 800014", phone: "0612-2570500", dist: "4.8 km", avail: "Daily, 8am–8pm" },
];

const REMEDIES = {
  green: [
    { icon: "💧", title: "Stay Hydrated", desc: "Drink 8–10 glasses of water daily. ORS sachets help if mild dehydration." },
    { icon: "🌿", title: "Tulsi-Ginger Tea", desc: "Boil 5 tulsi leaves + ginger in water. Drink twice a day to relieve common cold & cough." },
    { icon: "😴", title: "Rest & Sleep", desc: "Ensure 8 hours of rest. Avoid heavy physical work for 2 days." },
    { icon: "🥗", title: "Light Diet", desc: "Khichdi, dal-chawal, fruits. Avoid spicy or oily food until symptoms reduce." },
    { icon: "🌡️", title: "Monitor Temperature", desc: "Check fever twice a day. If above 101°F for 2+ days, escalate immediately." },
  ],
  yellow: [
    { icon: "💊", title: "Paracetamol 500mg", desc: "Take every 6–8 hours for fever/pain. Do not exceed 4 tablets/day. Available at govt. health centre." },
    { icon: "🧂", title: "ORS Solution", desc: "Mix 1 ORS packet in 1 litre clean water. Give every hour in small sips." },
    { icon: "📋", title: "Monitor Daily", desc: "Record BP and temperature morning & evening. Share readings with supervisor." },
    { icon: "🏥", title: "Visit PHC", desc: "Schedule visit to Primary Health Centre within 48 hours for proper check-up." },
    { icon: "📵", title: "Avoid Self-Medication", desc: "No antibiotics without prescription. No aspirin for children under 12." },
    { icon: "🤱", title: "If Pregnant", desc: "Ensure iron-folic acid tablet daily. No missed ANC visits. Contact ANM immediately if pain/bleeding." },
  ],
};

/* ── Default mock patient shown on load ── */
const DEFAULT_PATIENT = {
  name: "Sunita Devi",
  phone: "9876543210",
  age: "28",
  gender: "Female",
  symptoms: "High BP, severe headache since 3 days, 3rd trimester pregnancy, swelling in feet",
};

function runAITriage(symptoms) {
  const s = symptoms.toLowerCase();
  const critical = ["chest pain","unconscious","seizure","heavy bleeding","can't breathe",
    "stroke","paralysis","high bp","eclampsia","premature","heart","सीने में दर्द",
    "बेहोशी","दौरा","ज्यादा खून"];
  const moderate = ["fever","vomiting","diarrhea","weakness","headache","anaemia",
    "swelling","pain","infection","wound","बुखार","उल्टी","दस्त","कमजोरी",
    "सिरदर्द","सूजन","दर्द"];
  let triageLevel = "green";
  if (critical.some(k => s.includes(k))) triageLevel = "red";
  else if (moderate.some(k => s.includes(k))) triageLevel = "yellow";
  const confidence = triageLevel === "red" ? 94 : triageLevel === "yellow" ? 87 : 91;
  const metrics = {
    riskScore: triageLevel === "red" ? 82 : triageLevel === "yellow" ? 54 : 18,
    urgency: triageLevel === "red" ? "High" : triageLevel === "yellow" ? "Moderate" : "Low",
    predictedDiag: triageLevel === "red" ? "Acute" : triageLevel === "yellow" ? "Moderate" : "Mild",
    matchedSymptoms: triageLevel === "red" ? 6 : triageLevel === "yellow" ? 4 : 2,
    recommendation: triageLevel === "red" ? "Doctor" : triageLevel === "yellow" ? "PHC" : "Home Care",
  };
  const aiNote = {
    red: "🤖 AI model detected high-risk indicators in reported symptoms. Immediate medical evaluation is strongly recommended. Do not delay.",
    yellow: "🤖 Symptoms suggest moderate concern. Close monitoring and PHC visit within 48 hours advised. Start basic remedies.",
    green: "🤖 No critical indicators found. Symptoms appear manageable with home care. Reassess if symptoms worsen.",
  };
  return { triageLevel, confidence, metrics, aiNote };
}

/* ─────────────────────────────────────────────────
   VOICE HOOK
───────────────────────────────────────────────── */
function useSpeech() {
  const SR = typeof window !== "undefined" && (window.SpeechRecognition || window.webkitSpeechRecognition);
  const ref = useRef(null);
  const [active, setActive] = useState(null);
  function stop() { if (ref.current) { try { ref.current.stop(); } catch (_) {} ref.current = null; } setActive(null); }
  function start(key, cb) {
    if (!SR) { alert("Voice input needs Chrome/Edge with mic access."); return; }
    if (active === key) { stop(); return; }
    stop();
    const r = new SR(); r.lang = "hi-IN"; r.interimResults = true; r.continuous = false;
    ref.current = r; setActive(key);
    r.onresult = e => { let t = ""; for (let i = e.resultIndex; i < e.results.length; i++) t += e.results[i][0].transcript; cb(t); };
    r.onerror = () => stop(); r.onend = () => { ref.current = null; setActive(null); };
    try { r.start(); } catch (_) { stop(); }
  }
  return { active, start, stop };
}

/* ─────────────────────────────────────────────────
   STYLES
───────────────────────────────────────────────── */
const S = `
@import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');
*,*::before,*::after{box-sizing:border-box;margin:0;padding:0}
:root{
  --g-deep:#0d3a1c;--g-mid:#1b6530;--g-bright:#25a045;--g-glow:#3dcc66;--g-pale:#e8f5ec;
  --border:rgba(30,100,50,0.13);--text:#0f1e13;--muted:#7a9e82;--mid:#3a5942;
  --shadow:0 2px 20px rgba(13,58,28,0.08);--sidebar:220px;
}
html,body{height:100%;font-family:'DM Sans',sans-serif;background:#f0f5f1;color:var(--text)}

/* SIDEBAR */
.sb{position:fixed;top:0;left:0;bottom:0;width:var(--sidebar);z-index:200;background:var(--g-deep);display:flex;flex-direction:column;padding:0 0 20px;box-shadow:4px 0 32px rgba(0,0,0,.18)}
.sb-logo{display:flex;align-items:center;gap:10px;padding:20px 20px 18px;border-bottom:1px solid rgba(255,255,255,.08);text-decoration:none}
.sb-logo-name{font-family:'DM Serif Display',serif;font-size:20px;color:#fff}
.sb-nav{flex:1;padding:14px 10px;overflow-y:auto}
.sb-section{font-size:10px;font-weight:700;letter-spacing:.12em;text-transform:uppercase;color:rgba(255,255,255,.3);padding:12px 10px 5px}
.sb-item{display:flex;align-items:center;gap:10px;padding:9px 10px;border-radius:10px;font-size:13px;font-weight:500;color:rgba(255,255,255,.62);cursor:pointer;margin-bottom:2px;border:none;background:none;width:100%;text-align:left;font-family:'DM Sans',sans-serif;transition:all .2s}
.sb-item:hover{background:rgba(255,255,255,.08);color:#fff}
.sb-item.active{background:rgba(61,204,102,.18);color:#80ffaa;font-weight:600;border:1px solid rgba(61,204,102,.22)}
.sb-ico{width:30px;height:30px;border-radius:7px;display:flex;align-items:center;justify-content:center;font-size:13px;background:rgba(255,255,255,.06);flex-shrink:0}
.sb-item.active .sb-ico{background:rgba(61,204,102,.22)}
.sb-badge{margin-left:auto;background:var(--g-bright);color:#fff;font-size:10px;font-weight:700;padding:2px 7px;border-radius:50px}
.sb-user{margin:0 10px;padding:10px 12px;background:rgba(255,255,255,.07);border:1px solid rgba(255,255,255,.1);border-radius:12px;display:flex;align-items:center;gap:10px}
.sb-av{width:34px;height:34px;border-radius:50%;background:linear-gradient(135deg,var(--g-bright),var(--g-glow));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;flex-shrink:0}
.sb-uname{font-size:12px;font-weight:700;color:#fff}
.sb-urole{font-size:10px;color:rgba(255,255,255,.42)}

/* TOPBAR */
.tb{position:fixed;top:0;left:var(--sidebar);right:0;z-index:100;height:58px;background:rgba(253,252,248,.96);backdrop-filter:blur(18px);border-bottom:1px solid var(--border);display:flex;align-items:center;padding:0 28px;gap:14px;box-shadow:0 2px 20px rgba(13,58,28,.06)}
.tb-bc{font-size:13px;color:var(--muted);font-weight:500}
.tb-bc strong{color:var(--text);font-weight:700}
.tb-search{flex:1;max-width:300px;margin-left:20px;display:flex;align-items:center;gap:8px;background:#fff;border:1.5px solid #ddeae0;border-radius:50px;padding:7px 14px}
.tb-search input{border:none;outline:none;font-size:13px;font-family:'DM Sans',sans-serif;color:var(--text);background:transparent;width:100%}
.tb-search input::placeholder{color:#b4c8b8}
.tb-right{margin-left:auto;display:flex;align-items:center;gap:10px}
.tb-greet{font-size:13px;color:var(--mid);font-weight:500}
.tb-greet strong{color:var(--g-mid);font-weight:700}
.tb-notif{width:36px;height:36px;border-radius:50%;display:flex;align-items:center;justify-content:center;background:#fff;border:1.5px solid #ddeae0;cursor:pointer;position:relative;font-size:15px}
.tb-dot{position:absolute;top:5px;right:5px;width:7px;height:7px;border-radius:50%;background:#ef5350;border:2px solid white}
.tb-av{width:36px;height:36px;border-radius:50%;background:linear-gradient(135deg,var(--g-bright),var(--g-glow));display:flex;align-items:center;justify-content:center;font-size:13px;font-weight:700;color:#fff;cursor:pointer;border:2px solid var(--g-pale)}

/* LAYOUT */
.layout{margin-left:var(--sidebar);padding-top:58px;min-height:100vh}
.content{padding:24px 28px 60px}

/* PAGE HEADER */
.pg-header{display:flex;align-items:center;justify-content:space-between;margin-bottom:24px}
.pg-title{font-family:'DM Serif Display',serif;font-size:26px;color:var(--text)}
.pg-title span{color:var(--g-mid);font-style:italic}
.pg-sub{font-size:13px;color:var(--muted);margin-top:3px}
.pg-btn{display:flex;align-items:center;gap:8px;padding:10px 20px;border-radius:50px;border:none;background:linear-gradient(135deg,var(--g-mid),var(--g-bright));font-size:13px;font-weight:700;color:#fff;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 4px 16px rgba(27,101,48,.3);transition:all .2s}
.pg-btn:hover{transform:translateY(-1px);box-shadow:0 6px 22px rgba(27,101,48,.4)}

/* PATIENT CARD */
.pat-card{background:#fff;border-radius:18px;border:1px solid var(--border);box-shadow:var(--shadow);padding:22px 26px;margin-bottom:20px;display:flex;align-items:center;gap:22px;animation:fadeUp .5s ease both}
.pat-av{width:64px;height:64px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:22px;font-weight:700;color:#fff;flex-shrink:0;background:linear-gradient(135deg,var(--g-mid),var(--g-bright))}
.pat-name{font-family:'DM Serif Display',serif;font-size:22px;color:var(--text);line-height:1.2}
.pat-meta{display:flex;gap:10px;flex-wrap:wrap;margin-top:8px}
.pat-tag{display:flex;align-items:center;gap:5px;font-size:12px;color:var(--mid);font-weight:500;background:#f0f7f1;border-radius:50px;padding:4px 11px;border:1px solid #d8eadb}
.pat-symp{margin-top:10px;font-size:13px;color:var(--mid);line-height:1.55}
.pat-symp strong{color:var(--text);font-weight:600}

/* AI BANNER */
.ai-banner{background:linear-gradient(135deg,#0d3a1c,#1b6530);border-radius:14px;padding:18px 22px;display:flex;gap:14px;align-items:center;margin-bottom:20px;animation:fadeUp .5s .05s ease both}
.ai-ico{width:42px;height:42px;border-radius:11px;flex-shrink:0;background:rgba(61,204,102,.18);border:1px solid rgba(61,204,102,.3);display:flex;align-items:center;justify-content:center;font-size:20px}
.ai-label{font-size:10px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:#3dcc66;margin-bottom:4px}
.ai-title{font-family:'DM Serif Display',serif;font-size:16px;color:#fff}
.ai-sub{font-size:12px;color:rgba(255,255,255,.6);margin-top:2px}
.ai-conf{margin-left:auto;text-align:right;flex-shrink:0}
.ai-conf-val{font-family:'DM Serif Display',serif;font-size:28px;color:#80ffaa;line-height:1}
.ai-conf-lbl{font-size:11px;color:rgba(255,255,255,.5);margin-top:2px}

/* METRICS STRIP */
.metrics-strip{background:#fff;border-radius:16px;border:1px solid var(--border);box-shadow:var(--shadow);padding:18px 22px;margin-bottom:20px;animation:fadeUp .5s .1s ease both}
.metrics-title{font-size:13.5px;font-weight:700;color:var(--text);margin-bottom:14px;display:flex;align-items:center;gap:8px}
.metrics-grid{display:grid;grid-template-columns:repeat(5,1fr);gap:12px}
.metric{text-align:center;padding:12px 8px;border-radius:12px;background:#f8fbf8;border:1px solid #e0eee3}
.metric-val{font-family:'DM Serif Display',serif;font-size:22px;line-height:1;margin-bottom:4px}
.metric-val.green{color:#15803d}
.metric-val.yellow{color:#92400e}
.metric-val.red{color:#991b1b}
.metric-lbl{font-size:10.5px;color:var(--muted);font-weight:500}

/* SECTION LABEL */
.sec-label{font-size:11px;font-weight:700;letter-spacing:.1em;text-transform:uppercase;color:var(--muted);margin-bottom:12px;display:flex;align-items:center;gap:8px}
.sec-label::after{content:'';flex:1;height:1px;background:var(--border)}

/* TRIAGE CARDS */
.triage-row{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-bottom:24px}
.tc{border-radius:18px;padding:22px;cursor:pointer;transition:all .25s;position:relative;overflow:hidden;animation:fadeUp .5s ease both}
.tc::before{content:'';position:absolute;top:0;left:0;right:0;height:4px;border-radius:18px 18px 0 0}
.tc:hover{transform:translateY(-3px)}
.tc.green{background:#f0faf3;border:1.5px solid #86efac}
.tc.green::before{background:linear-gradient(90deg,#22c55e,#4ade80)}
.tc.green:hover{box-shadow:0 12px 36px rgba(34,197,94,.18)}
.tc.green.sel{background:#dcfce7;border-color:#22c55e;box-shadow:0 0 0 3px rgba(34,197,94,.18)}
.tc.yellow{background:#fffbeb;border:1.5px solid #fcd34d}
.tc.yellow::before{background:linear-gradient(90deg,#f59e0b,#fbbf24)}
.tc.yellow:hover{box-shadow:0 12px 36px rgba(245,158,11,.18)}
.tc.yellow.sel{background:#fef9c3;border-color:#f59e0b;box-shadow:0 0 0 3px rgba(245,158,11,.18)}
.tc.red{background:#fff1f2;border:1.5px solid #fca5a5}
.tc.red::before{background:linear-gradient(90deg,#ef4444,#f87171)}
.tc.red:hover{box-shadow:0 12px 36px rgba(239,68,68,.18)}
.tc.red.sel{background:#fee2e2;border-color:#ef4444;box-shadow:0 0 0 3px rgba(239,68,68,.18)}
.tc-icon{width:48px;height:48px;border-radius:14px;display:flex;align-items:center;justify-content:center;font-size:22px;margin-bottom:14px}
.tc.green .tc-icon{background:rgba(34,197,94,.14);border:1px solid rgba(34,197,94,.22)}
.tc.yellow .tc-icon{background:rgba(245,158,11,.14);border:1px solid rgba(245,158,11,.22)}
.tc.red .tc-icon{background:rgba(239,68,68,.14);border:1px solid rgba(239,68,68,.22)}
.tc-badge{display:inline-flex;align-items:center;gap:5px;padding:4px 12px;border-radius:50px;font-size:11px;font-weight:700;letter-spacing:.04em;margin-bottom:10px}
.tc.green .tc-badge{background:#dcfce7;color:#15803d}
.tc.yellow .tc-badge{background:#fef9c3;color:#92400e}
.tc.red .tc-badge{background:#fee2e2;color:#991b1b}
.tc-title{font-family:'DM Serif Display',serif;font-size:18px;margin-bottom:6px}
.tc.green .tc-title{color:#14532d}
.tc.yellow .tc-title{color:#78350f}
.tc.red .tc-title{color:#7f1d1d}
.tc-desc{font-size:12.5px;line-height:1.55}
.tc.green .tc-desc{color:#166534}
.tc.yellow .tc-desc{color:#92400e}
.tc.red .tc-desc{color:#9f1239}
.tc-symptoms{margin-top:12px;padding-top:10px;border-top:1px solid rgba(0,0,0,.07)}
.tc-tag{display:inline-block;font-size:11px;padding:3px 9px;border-radius:50px;margin:3px 3px 0 0;font-weight:500}
.tc.green .tc-tag{background:rgba(34,197,94,.12);color:#15803d}
.tc.yellow .tc-tag{background:rgba(245,158,11,.12);color:#92400e}
.tc.red .tc-tag{background:rgba(239,68,68,.12);color:#991b1b}
.tc-note{margin-top:12px;padding:10px 12px;border-radius:10px;font-size:11.5px;line-height:1.5}
.tc.green .tc-note{background:rgba(34,197,94,.09);color:#166534}
.tc.yellow .tc-note{background:rgba(245,158,11,.09);color:#92400e}
.tc.red .tc-note{background:rgba(239,68,68,.09);color:#991b1b}
.tc-check{position:absolute;top:14px;right:14px;width:24px;height:24px;border-radius:50%;display:flex;align-items:center;justify-content:center;font-size:12px}
.tc.green .tc-check{background:#22c55e;color:#fff}
.tc.yellow .tc-check{background:#f59e0b;color:#fff}
.tc.red .tc-check{background:#ef4444;color:#fff}

/* RESULT PANEL */
.result-panel{border-radius:18px;overflow:hidden;margin-bottom:22px;animation:fadeUp .5s .2s ease both;border:1px solid var(--border);box-shadow:0 4px 28px rgba(13,58,28,.1)}

/* DOCTOR CARDS */
.dr-header{background:linear-gradient(135deg,#7f1d1d,#991b1b);padding:20px 24px;display:flex;align-items:center;gap:14px}
.dr-hico{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.dr-htitle{font-family:'DM Serif Display',serif;font-size:18px;color:#fff}
.dr-hsub{font-size:12px;color:rgba(255,255,255,.6);margin-top:3px}
.dr-alert{margin-left:auto;background:rgba(255,255,255,.15);border:1px solid rgba(255,255,255,.25);border-radius:50px;padding:5px 14px;font-size:11.5px;font-weight:700;color:#fff;flex-shrink:0;animation:pulse 2s infinite}
@keyframes pulse{0%,100%{opacity:1}50%{opacity:.7}}
.dr-body{background:#fff;padding:20px 24px}
.dr-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.dr-card{border-radius:14px;border:1.5px solid #fee2e2;background:#fff9f9;padding:16px;transition:all .2s;cursor:pointer}
.dr-card:hover{border-color:#ef4444;box-shadow:0 6px 24px rgba(239,68,68,.12);transform:translateY(-2px)}
.dr-dist{display:inline-block;background:#fee2e2;color:#991b1b;font-size:10px;font-weight:700;padding:2px 9px;border-radius:50px;margin-bottom:8px}
.dr-name{font-size:14px;font-weight:700;color:var(--text);margin-bottom:2px}
.dr-spec{font-size:12px;color:var(--muted);margin-bottom:8px}
.dr-hosp{font-size:12.5px;color:var(--mid);font-weight:600;margin-bottom:4px}
.dr-addr{font-size:11.5px;color:var(--muted);margin-bottom:10px;line-height:1.4}
.dr-avail{font-size:11px;color:#15803d;font-weight:600;background:#dcfce7;border-radius:50px;padding:3px 10px;display:inline-block;margin-bottom:10px}
.dr-call{width:100%;padding:9px;border:none;border-radius:9px;background:linear-gradient(135deg,#991b1b,#dc2626);color:#fff;font-size:13px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
.dr-call:hover{box-shadow:0 4px 14px rgba(220,38,38,.4)}

/* REMEDIES */
.rem-header{padding:20px 24px;display:flex;align-items:center;gap:14px}
.rem-header.green-bg{background:linear-gradient(135deg,#14532d,#166534)}
.rem-header.yellow-bg{background:linear-gradient(135deg,#78350f,#92400e)}
.rem-hico{width:44px;height:44px;border-radius:12px;background:rgba(255,255,255,.14);border:1px solid rgba(255,255,255,.22);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.rem-htitle{font-family:'DM Serif Display',serif;font-size:18px;color:#fff}
.rem-hsub{font-size:12px;color:rgba(255,255,255,.6);margin-top:3px}
.rem-body{background:#fff;padding:20px 24px}
.rem-grid{display:grid;grid-template-columns:repeat(3,1fr);gap:14px}
.rem-card{border-radius:14px;padding:16px;border:1.5px solid;transition:all .2s;animation:fadeUp .5s ease both}
.rem-card.green-c{border-color:#bbf7d0;background:#f0fdf4}
.rem-card.green-c:hover{border-color:#22c55e;box-shadow:0 4px 18px rgba(34,197,94,.14)}
.rem-card.yellow-c{border-color:#fde68a;background:#fffbeb}
.rem-card.yellow-c:hover{border-color:#f59e0b;box-shadow:0 4px 18px rgba(245,158,11,.14)}
.rem-ico{font-size:22px;margin-bottom:10px}
.rem-title{font-size:13.5px;font-weight:700;margin-bottom:5px}
.rem-card.green-c .rem-title{color:#14532d}
.rem-card.yellow-c .rem-title{color:#78350f}
.rem-desc{font-size:12px;line-height:1.55}
.rem-card.green-c .rem-desc{color:#166534}
.rem-card.yellow-c .rem-desc{color:#92400e}

/* AI NOTE */
.ai-note{padding:16px 20px;background:#fff;border-radius:14px;border:1px solid var(--border);box-shadow:var(--shadow);font-size:13px;color:var(--mid);line-height:1.6;animation:fadeUp .5s .3s ease both}

/* MODAL */
.mo-overlay{position:fixed;inset:0;z-index:1000;background:rgba(5,20,10,.62);backdrop-filter:blur(6px);display:flex;align-items:center;justify-content:center;padding:20px;animation:ovFade .22s ease both}
@keyframes ovFade{from{opacity:0}to{opacity:1}}
.mo-card{background:#fff;border-radius:20px;width:100%;max-width:520px;box-shadow:0 24px 64px rgba(5,20,10,.3);border:1px solid var(--border);overflow:hidden;animation:cardSlide .28s cubic-bezier(.22,.9,.36,1) both}
@keyframes cardSlide{from{opacity:0;transform:translateY(28px) scale(.97)}to{opacity:1;transform:translateY(0) scale(1)}}
.mo-header{display:flex;align-items:center;gap:14px;padding:20px 24px 18px;background:linear-gradient(135deg,#0d3a1c,#1b6530)}
.mo-hico{width:44px;height:44px;border-radius:12px;background:rgba(61,204,102,.18);border:1px solid rgba(61,204,102,.3);display:flex;align-items:center;justify-content:center;font-size:20px;flex-shrink:0}
.mo-htitle{font-family:'DM Serif Display',serif;font-size:18px;color:#fff}
.mo-hsub{font-size:12px;color:rgba(255,255,255,.55);margin-top:3px}
.mo-close{margin-left:auto;width:32px;height:32px;border-radius:50%;background:rgba(255,255,255,.1);border:none;color:rgba(255,255,255,.7);font-size:16px;cursor:pointer;display:flex;align-items:center;justify-content:center;font-family:'DM Sans',sans-serif;transition:all .2s}
.mo-close:hover{background:rgba(255,255,255,.2);color:#fff}
.mo-body{padding:22px 24px 18px}
.mo-field{margin-bottom:17px}
.mo-label{display:flex;align-items:center;gap:6px;font-size:12.5px;font-weight:600;color:var(--mid);margin-bottom:7px}
.mo-req{color:#e53935}
.mo-wrap{display:flex;align-items:center;border:1.5px solid #d4e6d9;border-radius:11px;background:#fff;overflow:hidden;transition:border-color .2s,box-shadow .2s}
.mo-wrap:focus-within{border-color:var(--g-bright);box-shadow:0 0 0 3px rgba(37,160,69,.1)}
.mo-wrap.err{border-color:#e53935}
.mo-inp{flex:1;border:none;outline:none;padding:11px 14px;font-size:13.5px;font-family:'DM Sans',sans-serif;color:var(--text);background:transparent}
.mo-inp::placeholder{color:#b4c8b8}
.mo-mic{width:42px;height:42px;border:none;border-left:1px solid #e8f0eb;background:transparent;cursor:pointer;display:flex;align-items:center;justify-content:center;font-size:15px;transition:background .2s;flex-shrink:0}
.mo-mic:hover{background:#f0faf2}
.mo-hint{font-size:11px;color:var(--muted);margin-top:4px}
.mo-err{font-size:11.5px;color:#e53935;margin-top:4px;display:flex;align-items:center;gap:4px}
.mo-pills{display:flex;gap:8px;flex-wrap:wrap}
.mo-pill{padding:7px 15px;border-radius:50px;border:1.5px solid #d4e6d9;font-size:12.5px;font-weight:600;color:var(--mid);cursor:pointer;transition:all .18s;background:#fff;font-family:'DM Sans',sans-serif}
.mo-pill:hover{border-color:var(--g-bright);color:var(--g-mid)}
.mo-pill.sel{background:var(--g-pale);border-color:var(--g-bright);color:var(--g-mid)}
.mo-ta-wrap{border:1.5px solid #d4e6d9;border-radius:11px;background:#fff;overflow:hidden;transition:border-color .2s,box-shadow .2s}
.mo-ta-wrap:focus-within{border-color:var(--g-bright);box-shadow:0 0 0 3px rgba(37,160,69,.1)}
.mo-ta-wrap.err{border-color:#e53935}
.mo-ta{width:100%;border:none;outline:none;padding:11px 14px;font-size:13.5px;font-family:'DM Sans',sans-serif;color:var(--text);background:transparent;resize:none;min-height:88px;line-height:1.55;display:block}
.mo-ta::placeholder{color:#b4c8b8}
.mo-ta-foot{display:flex;align-items:center;justify-content:space-between;padding:8px 12px;border-top:1px solid #edf3ef;background:#fafcfa}
.mo-wave{display:flex;gap:3px;align-items:center;height:18px}
.mo-wave span{width:3px;background:var(--g-bright);border-radius:2px;animation:wav 1s ease infinite}
.mo-wave span:nth-child(1){animation-delay:0s;height:5px}
.mo-wave span:nth-child(2){animation-delay:.15s;height:11px}
.mo-wave span:nth-child(3){animation-delay:.3s;height:17px}
.mo-wave span:nth-child(4){animation-delay:.45s;height:11px}
.mo-wave span:nth-child(5){animation-delay:.6s;height:5px}
@keyframes wav{0%,100%{opacity:.3}50%{opacity:1}}
.mo-speak-btn{display:flex;align-items:center;gap:6px;padding:6px 14px 6px 10px;border-radius:50px;background:var(--g-pale);border:1.5px solid rgba(37,160,69,.22);color:var(--g-mid);font-size:12px;font-weight:600;cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
.mo-speak-btn:hover{background:#d6f0dc;border-color:var(--g-bright)}
.mo-speak-btn.on{background:#fff0f0;border-color:#ef5350;color:#c62828}
.mo-footer{padding:14px 24px 22px;border-top:1px solid #edf3ef;display:flex;gap:12px}
.mo-cancel{flex:1;padding:11px;border-radius:10px;border:1.5px solid #ddeae0;background:#fff;font-size:13.5px;font-weight:600;color:var(--mid);cursor:pointer;font-family:'DM Sans',sans-serif;transition:all .2s}
.mo-cancel:hover{background:#f4faf5;border-color:var(--g-bright)}
.mo-submit{flex:2;padding:11px;border-radius:10px;border:none;background:linear-gradient(135deg,var(--g-mid),var(--g-bright));color:#fff;font-size:13.5px;font-weight:700;cursor:pointer;font-family:'DM Sans',sans-serif;box-shadow:0 4px 16px rgba(27,101,48,.3);transition:all .22s}
.mo-submit:hover{transform:translateY(-1px);box-shadow:0 8px 24px rgba(27,101,48,.42)}

/* LOADING */
.loading-wrap{display:flex;flex-direction:column;align-items:center;justify-content:center;padding:72px 24px;text-align:center}
.loading-ring{width:64px;height:64px;border-radius:50%;border:4px solid #e8f5ec;border-top-color:var(--g-bright);animation:spin 1s linear infinite;margin-bottom:20px}
@keyframes spin{to{transform:rotate(360deg)}}
.loading-title{font-family:'DM Serif Display',serif;font-size:20px;color:var(--text);margin-bottom:6px}
.loading-sub{font-size:13px;color:var(--muted)}

@keyframes fadeUp{from{opacity:0;transform:translateY(14px)}to{opacity:1;transform:translateY(0)}}
`;

/* ─────────────────────────────────────────────────
   MAIN COMPONENT
───────────────────────────────────────────────── */
export default function PatientDiagnosisDashboard() {
  // Boot directly into result view with the default mock patient
  const defaultTriage = runAITriage(DEFAULT_PATIENT.symptoms);

  const [showModal, setShowModal] = useState(false);
  const [view, setView] = useState("result");           // ← starts on "result"
  const [patient, setPatient] = useState(DEFAULT_PATIENT); // ← pre-loaded
  const [triage, setTriage] = useState(defaultTriage);
  const [selectedTriage, setSelectedTriage] = useState(defaultTriage.triageLevel);

  const [form, setForm] = useState({ name: "", phone: "", age: "", symptoms: "" });
  const [gender, setGender] = useState("");
  const [errors, setErrors] = useState({});
  const { active: micActive, start: micStart, stop: micStop } = useSpeech();

  function setF(k, v) { setForm(f => ({ ...f, [k]: v })); if (errors[k]) setErrors(e => ({ ...e, [k]: "" })); }

  function validate() {
    const e = {};
    if (!form.name.trim()) e.name = "Name is required";
    if (!/^\d{10}$/.test(form.phone.trim())) e.phone = "Enter valid 10-digit number";
    if (!form.symptoms.trim()) e.symptoms = "Please describe symptoms";
    setErrors(e); return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    micStop();
    setShowModal(false);
    setView("loading");
    setTimeout(() => {
      const result = runAITriage(form.symptoms);
      setPatient({ ...form, gender });
      setTriage(result);
      setSelectedTriage(result.triageLevel);
      setView("result");
      setForm({ name: "", phone: "", age: "", symptoms: "" });
      setGender("");
    }, 2200);
  }

  const initials = name => name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase();
  const metricColor = (k, v) => {
    if (k === "riskScore") return v > 70 ? "red" : v > 40 ? "yellow" : "green";
    if (k === "matchedSymptoms") return v >= 5 ? "red" : v >= 3 ? "yellow" : "green";
    return triage?.triageLevel === "red" ? "red" : triage?.triageLevel === "yellow" ? "yellow" : "green";
  };

  return (
    <>
      <style>{S}</style>

      {/* SIDEBAR */}
      <aside className="sb">
        <a className="sb-logo" href="#">
          <span style={{ fontSize: 20 }}>🌿</span>
          <span className="sb-logo-name">GraamSehat</span>
        </a>
        <nav className="sb-nav">
          <div className="sb-section">Main Menu</div>
          {[
            { ico: "🏠", label: "Home" },
            { ico: "👥", label: "My Patients", badge: "23", active: true },
            { ico: "🤖", label: "AI Diagnosis" },
            { ico: "📅", label: "Visit Schedule" },
            { ico: "💉", label: "Immunisation" },
            { ico: "📋", label: "Health Records" },
            { ico: "📊", label: "Reports" },
          ].map(item => (
            <button key={item.label} className={`sb-item${item.active ? " active" : ""}`}>
              <span className="sb-ico">{item.ico}</span>
              {item.label}
              {item.badge && <span className="sb-badge">{item.badge}</span>}
            </button>
          ))}
          <div className="sb-section" style={{ marginTop: 10 }}>Support</div>
          {[{ ico: "⚙️", label: "Settings" }, { ico: "❓", label: "Help" }].map(i => (
            <button key={i.label} className="sb-item"><span className="sb-ico">{i.ico}</span>{i.label}</button>
          ))}
        </nav>
        <div className="sb-user">
          <div className="sb-av">RS</div>
          <div><div className="sb-uname">Rekha Sharma</div><div className="sb-urole">ASHA-BR-1042</div></div>
        </div>
      </aside>

      {/* TOPBAR */}
      <header className="tb">
        <div className="tb-bc">GraamSehat &nbsp;›&nbsp; <strong>Patient Diagnosis</strong></div>
        <div className="tb-search">
          <span style={{ color: "#b4c8b8", fontSize: 14 }}>🔍</span>
          <input placeholder="Search patients, records…" />
        </div>
        <div className="tb-right">
          <span className="tb-greet">Good morning, <strong>Rekha</strong> 👋</span>
          <div className="tb-notif">🔔<span className="tb-dot" /></div>
          <div className="tb-av">RS</div>
        </div>
      </header>

      {/* MAIN */}
      <div className="layout">
        <div className="content">

          {/* PAGE HEADER */}
          <div className="pg-header">
            <div>
              <div className="pg-title">Patient <span>Diagnosis</span></div>
              <div className="pg-sub">AI-powered symptom triage for ASHA field workers</div>
            </div>
            <button className="pg-btn" onClick={() => setShowModal(true)}>
              ➕ &nbsp;Register New Patient
            </button>
          </div>

          {/* LOADING */}
          {view === "loading" && (
            <div className="loading-wrap" style={{ animation: "fadeUp .4s ease both" }}>
              <div className="loading-ring" />
              <div className="loading-title">AI Model Analysing Symptoms…</div>
              <div className="loading-sub">Running symptom pattern matching and risk assessment</div>
            </div>
          )}

          {/* RESULT */}
          {view === "result" && patient && triage && (
            <>
              {/* PATIENT SUMMARY */}
              <div className="pat-card">
                <div className="pat-av">{initials(patient.name)}</div>
                <div style={{ flex: 1 }}>
                  <div className="pat-name">{patient.name}</div>
                  <div className="pat-meta">
                    {patient.age && <div className="pat-tag">🎂 {patient.age} yrs</div>}
                    {patient.gender && <div className="pat-tag">⚧ {patient.gender}</div>}
                    <div className="pat-tag">📱 {patient.phone}</div>
                    <div className="pat-tag">📅 {new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" })}</div>
                    <div className="pat-tag">🪪 ASHA-BR-1042 · Bodh Gaya</div>
                  </div>
                  <div className="pat-symp"><strong>Reported Symptoms:</strong> {patient.symptoms}</div>
                </div>
              </div>

              {/* AI BANNER */}
              <div className="ai-banner">
                <div className="ai-ico">🤖</div>
                <div style={{ flex: 1 }}>
                  <div className="ai-label">GraamSehat AI · Symptom Support Tool</div>
                  <div className="ai-title">Analysis Complete — Triage Result Ready</div>
                  <div className="ai-sub">Based on reported symptoms and pattern matching against 10,000+ rural health cases</div>
                </div>
                <div className="ai-conf">
                  <div className="ai-conf-val">{triage.confidence}%</div>
                  <div className="ai-conf-lbl">Confidence</div>
                </div>
              </div>

              {/* METRICS */}
              <div className="metrics-strip">
                <div className="metrics-title">🧠 AI Analysis Breakdown</div>
                <div className="metrics-grid">
                  {[
                    { label: "Risk Score", val: triage.metrics.riskScore, key: "riskScore" },
                    { label: "Urgency", val: triage.metrics.urgency, key: "urgency" },
                    { label: "Diagnosis Type", val: triage.metrics.predictedDiag, key: "diag" },
                    { label: "Matched Symptoms", val: triage.metrics.matchedSymptoms, key: "matchedSymptoms" },
                    { label: "Recommendation", val: triage.metrics.recommendation, key: "rec" },
                  ].map(m => (
                    <div className="metric" key={m.label}>
                      <div className={`metric-val ${metricColor(m.key, m.val)}`}>{m.val}</div>
                      <div className="metric-lbl">{m.label}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* TRIAGE CARDS */}
              <div className="sec-label">Triage Assessment — Select to view details</div>
              <div className="triage-row">
                {/* GREEN */}
                <div className={`tc green${selectedTriage === "green" ? " sel" : ""}`} onClick={() => setSelectedTriage("green")} style={{ animationDelay: ".05s" }}>
                  {selectedTriage === "green" && <div className="tc-check">✓</div>}
                  <div className="tc-icon">🟢</div>
                  <div className="tc-badge">✅ SAFE</div>
                  <div className="tc-title">No Immediate Risk</div>
                  <div className="tc-desc">Symptoms are mild and manageable at home with basic care and monitoring.</div>
                  <div className="tc-symptoms">
                    {["Minor cold/cough", "Low-grade fever", "Fatigue", "Mild pain"].map(t => <span className="tc-tag" key={t}>{t}</span>)}
                  </div>
                  <div className="tc-note">Home remedies advised. Monitor for 2–3 days. No hospital visit needed.</div>
                </div>
                {/* YELLOW */}
                <div className={`tc yellow${selectedTriage === "yellow" ? " sel" : ""}`} onClick={() => setSelectedTriage("yellow")} style={{ animationDelay: ".10s" }}>
                  {selectedTriage === "yellow" && <div className="tc-check">✓</div>}
                  <div className="tc-icon">🟡</div>
                  <div className="tc-badge">⚠️ NEEDS ATTENTION</div>
                  <div className="tc-title">Monitor Closely</div>
                  <div className="tc-desc">Moderate symptoms detected. PHC visit recommended within 48 hours.</div>
                  <div className="tc-symptoms">
                    {["Persistent fever", "Vomiting", "Weakness", "Diarrhoea", "Swelling"].map(t => <span className="tc-tag" key={t}>{t}</span>)}
                  </div>
                  <div className="tc-note">Initiate basic remedies. Visit Primary Health Centre. Do not ignore.</div>
                </div>
                {/* RED */}
                <div className={`tc red${selectedTriage === "red" ? " sel" : ""}`} onClick={() => setSelectedTriage("red")} style={{ animationDelay: ".15s" }}>
                  {selectedTriage === "red" && <div className="tc-check">✓</div>}
                  <div className="tc-icon">🔴</div>
                  <div className="tc-badge">🚨 CRITICAL</div>
                  <div className="tc-title">Needs Doctor Now</div>
                  <div className="tc-desc">High-risk symptoms detected. Immediate medical attention required.</div>
                  <div className="tc-symptoms">
                    {["Chest pain", "Seizure", "High BP", "Severe bleeding", "Unconscious"].map(t => <span className="tc-tag" key={t}>{t}</span>)}
                  </div>
                  <div className="tc-note">Do NOT delay. Contact nearby doctor immediately. Call 108 if required.</div>
                </div>
              </div>

              {/* RESULT PANEL */}
              {triage.triageLevel === "red" && (
                <div className="result-panel">
                  <div className="dr-header">
                    <div className="dr-hico">🏥</div>
                    <div>
                      <div className="dr-htitle">Nearby Doctors — Patna</div>
                      <div className="dr-hsub">Verified doctors within 5 km · Contact immediately</div>
                    </div>
                    <div className="dr-alert">🚨 URGENT — Refer Now</div>
                  </div>
                  <div className="dr-body">
                    <div className="dr-grid">
                      {PATNA_DOCTORS.map(d => (
                        <div className="dr-card" key={d.id}>
                          <div className="dr-dist">📍 {d.dist}</div>
                          <div className="dr-name">{d.name}</div>
                          <div className="dr-spec">{d.specialty}</div>
                          <div className="dr-hosp">🏥 {d.hospital}</div>
                          <div className="dr-addr">📌 {d.address}</div>
                          <div className="dr-avail">🕐 {d.avail}</div>
                          <button className="dr-call" onClick={() => alert(`Calling ${d.name} at ${d.phone}…`)}>📞 &nbsp;{d.phone}</button>
                        </div>
                      ))}
                    </div>
                    <div style={{ marginTop: 16, padding: "13px 16px", background: "#fff9f9", border: "1px solid #fca5a5", borderRadius: 12, fontSize: 13, color: "#991b1b", display: "flex", alignItems: "center", gap: 10 }}>
                      <span style={{ fontSize: 18 }}>🚑</span>
                      <span><strong>Emergency:</strong> Call <strong>108</strong> for free ambulance service · Available 24/7 across Bihar</span>
                    </div>
                  </div>
                </div>
              )}

              {(triage.triageLevel === "green" || triage.triageLevel === "yellow") && (
                <div className="result-panel">
                  <div className={`rem-header ${triage.triageLevel === "green" ? "green-bg" : "yellow-bg"}`}>
                    <div className="rem-hico">{triage.triageLevel === "green" ? "🌿" : "⚕️"}</div>
                    <div>
                      <div className="rem-htitle">{triage.triageLevel === "green" ? "Recommended Home Remedies" : "Care Guidelines & Remedies"}</div>
                      <div className="rem-hsub">{triage.triageLevel === "green" ? "Follow these steps for quick recovery at home" : "Immediate steps to take before PHC visit"}</div>
                    </div>
                  </div>
                  <div className="rem-body">
                    <div className="rem-grid">
                      {REMEDIES[triage.triageLevel].map((r, i) => (
                        <div key={i} className={`rem-card ${triage.triageLevel === "green" ? "green-c" : "yellow-c"}`} style={{ animationDelay: `${.25 + i * .05}s` }}>
                          <div className="rem-ico">{r.icon}</div>
                          <div className="rem-title">{r.title}</div>
                          <div className="rem-desc">{r.desc}</div>
                        </div>
                      ))}
                    </div>
                    {triage.triageLevel === "yellow" && (
                      <div style={{ marginTop: 16, padding: "13px 16px", background: "#fffbeb", border: "1px solid #fcd34d", borderRadius: 12, fontSize: 13, color: "#92400e", display: "flex", alignItems: "center", gap: 10 }}>
                        <span style={{ fontSize: 18 }}>🏥</span>
                        <span><strong>PHC Visit:</strong> Schedule a visit to your nearest Primary Health Centre within <strong>48 hours</strong>. Carry this report.</span>
                      </div>
                    )}
                  </div>
                </div>
              )}

              {/* AI NOTE */}
              <div className="ai-note">{triage.aiNote[triage.triageLevel]}</div>

              {/* REGISTER ANOTHER */}
              <div style={{ textAlign: "center", marginTop: 28 }}>
                <button
                  onClick={() => setShowModal(true)}
                  style={{ padding: "11px 28px", borderRadius: 50, border: "none", background: "linear-gradient(135deg,var(--g-mid),var(--g-bright))", color: "#fff", fontSize: 13.5, fontWeight: 700, cursor: "pointer", fontFamily: "'DM Sans',sans-serif", boxShadow: "0 4px 16px rgba(27,101,48,.3)" }}
                >
                  + Register Another Patient
                </button>
              </div>
            </>
          )}
        </div>
      </div>

      {/* NEW PATIENT MODAL */}
      {showModal && (
        <div className="mo-overlay" onClick={e => { if (e.target === e.currentTarget) setShowModal(false); }}>
          <div className="mo-card">
            <div className="mo-header">
              <div className="mo-hico">➕</div>
              <div>
                <div className="mo-htitle">Register New Patient</div>
                <div className="mo-hsub">Fill details or use voice input 🎙️</div>
              </div>
              <button className="mo-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="mo-body">
              {/* NAME */}
              <div className="mo-field">
                <label className="mo-label">👤 Patient Name <span className="mo-req">*</span></label>
                <div className={`mo-wrap${errors.name ? " err" : ""}`}>
                  <input className="mo-inp" value={form.name} onChange={e => setF("name", e.target.value)} placeholder="e.g. Anita Devi" autoComplete="off" />
                  <button className={`mo-mic${micActive === "name" ? " on" : ""}`} onClick={() => micStart("name", t => setF("name", t))}>
                    {micActive === "name" ? "⏹️" : "🎙️"}
                  </button>
                </div>
                {errors.name ? <div className="mo-err">⚠️ {errors.name}</div> : <div className="mo-hint">🎤 Tap mic and say the patient's full name</div>}
              </div>
              {/* PHONE */}
              <div className="mo-field">
                <label className="mo-label">📱 Phone Number <span className="mo-req">*</span></label>
                <div className={`mo-wrap${errors.phone ? " err" : ""}`}>
                  <input className="mo-inp" value={form.phone} onChange={e => setF("phone", e.target.value.replace(/\D/g, "").slice(0, 10))} placeholder="10-digit mobile number" type="tel" maxLength={10} />
                  <button className={`mo-mic${micActive === "phone" ? " on" : ""}`} onClick={() => micStart("phone", t => setF("phone", t.replace(/\D/g, "").slice(0, 10)))}>
                    {micActive === "phone" ? "⏹️" : "🎙️"}
                  </button>
                </div>
                {errors.phone ? <div className="mo-err">⚠️ {errors.phone}</div> : <div className="mo-hint">🎤 Say digits clearly</div>}
              </div>
              {/* AGE + GENDER */}
              <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: 14, marginBottom: 17 }}>
                <div>
                  <label className="mo-label">🎂 Age</label>
                  <div className="mo-wrap">
                    <input className="mo-inp" value={form.age} onChange={e => setF("age", e.target.value)} placeholder="Years" type="number" min={1} max={120} />
                    <button className={`mo-mic${micActive === "age" ? " on" : ""}`} onClick={() => micStart("age", t => { const n = t.match(/\d+/); if (n) setF("age", n[0]); })}>
                      {micActive === "age" ? "⏹️" : "🎙️"}
                    </button>
                  </div>
                </div>
                <div>
                  <label className="mo-label">⚧ Gender</label>
                  <div className="mo-pills">
                    {["Female", "Male", "Other"].map(g => (
                      <button key={g} className={`mo-pill${gender === g ? " sel" : ""}`} onClick={() => setGender(g)}>{g}</button>
                    ))}
                  </div>
                </div>
              </div>
              {/* SYMPTOMS */}
              <div className="mo-field" style={{ marginBottom: 4 }}>
                <label className="mo-label">🩺 Symptoms <span className="mo-req">*</span></label>
                <div className={`mo-ta-wrap${errors.symptoms ? " err" : ""}`}>
                  <textarea className="mo-ta" value={form.symptoms} onChange={e => setF("symptoms", e.target.value)} placeholder="Describe symptoms… e.g. headache, fever since 2 days, weakness" />
                  <div className="mo-ta-foot">
                    <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                      {micActive === "symptoms"
                        ? <><div className="mo-wave"><span /><span /><span /><span /><span /></div><span style={{ fontSize: 11.5, color: "var(--g-mid)", fontWeight: 600 }}>Listening…</span></>
                        : <span style={{ fontSize: 11.5, color: "var(--muted)" }}>Speak in Hindi or English</span>}
                    </div>
                    <button className={`mo-speak-btn${micActive === "symptoms" ? " on" : ""}`} onClick={() => micStart("symptoms", t => setF("symptoms", t))}>
                      <span style={{ fontSize: 14 }}>{micActive === "symptoms" ? "⏹️" : "🎙️"}</span>
                      {micActive === "symptoms" ? "Stop" : "Speak"}
                    </button>
                  </div>
                </div>
                {errors.symptoms && <div className="mo-err">⚠️ {errors.symptoms}</div>}
              </div>
            </div>
            <div className="mo-footer">
              <button className="mo-cancel" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="mo-submit" onClick={handleSubmit}>Run AI Triage →</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}