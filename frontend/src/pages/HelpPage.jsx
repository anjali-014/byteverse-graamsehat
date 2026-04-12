import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar, sharedStyles } from "../components/Layout.jsx";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const pageStyles = `
  .help-layout {
    display: grid;
    grid-template-columns: 1fr 320px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 1024px) {
    .help-layout { grid-template-columns: 1fr; }
  }

  /* ── Search bar ── */
  .help-search-wrap {
    background: linear-gradient(135deg, #1a7a34 0%, #25a045 100%);
    border-radius: 16px; padding: 28px 28px 24px;
    margin-bottom: 24px; position: relative; overflow: hidden;
  }
  .help-search-wrap::before {
    content: ''; position: absolute; top: -30px; right: -30px;
    width: 160px; height: 160px; border-radius: 50%;
    background: rgba(255,255,255,0.07);
  }
  .help-search-title { font-family: 'DM Serif Display',serif; font-size: 22px; color: #fff; margin-bottom: 6px; }
  .help-search-sub   { font-size: 13px; color: rgba(255,255,255,0.75); margin-bottom: 16px; }
  .help-search-input {
    width: 100%; padding: 12px 18px 12px 44px;
    border-radius: 12px; border: none;
    font-size: 14px; font-family: 'DM Sans', sans-serif;
    background: rgba(255,255,255,0.95); color: var(--text-dark);
    box-sizing: border-box;
  }
  .help-search-input:focus { outline: 2px solid rgba(255,255,255,0.6); }
  .help-search-icon {
    position: absolute; left: 44px; top: 50%; transform: translateY(-50%);
    font-size: 16px; pointer-events: none;
  }
  .search-input-wrap { position: relative; }

  /* ── Category cards ── */
  .help-cats {
    display: grid;
    grid-template-columns: repeat(3, 1fr);
    gap: 14px; margin-bottom: 24px;
  }
  @media (max-width: 700px) { .help-cats { grid-template-columns: 1fr 1fr; } }
  .help-cat-card {
    background: #fff; border-radius: 14px; border: 1px solid var(--border);
    padding: 18px 16px; cursor: pointer; transition: all .22s;
    box-shadow: var(--card-shadow); text-align: center;
  }
  .help-cat-card:hover {
    transform: translateY(-3px);
    box-shadow: 0 10px 28px rgba(13,58,28,0.12);
    border-color: var(--green-bright);
  }
  .help-cat-card.active { background: var(--green-pale); border-color: var(--green-bright); }
  .help-cat-ico  { font-size: 28px; margin-bottom: 8px; }
  .help-cat-name { font-size: 13px; font-weight: 700; color: var(--text-dark); margin-bottom: 3px; }
  .help-cat-count{ font-size: 11px; color: var(--text-muted); }

  /* ── FAQ accordion ── */
  .faq-item {
    background: #fff; border-radius: 12px; border: 1px solid var(--border);
    margin-bottom: 10px; overflow: hidden; transition: border-color .18s;
  }
  .faq-item.open { border-color: rgba(37,160,69,0.35); }
  .faq-question {
    display: flex; align-items: center; justify-content: space-between;
    padding: 16px 18px; cursor: pointer; gap: 12px;
  }
  .faq-question:hover { background: #f8faf8; }
  .faq-q-text { font-size: 14px; font-weight: 600; color: var(--text-dark); flex: 1; }
  .faq-chevron {
    font-size: 12px; color: var(--text-muted); flex-shrink: 0;
    transition: transform .25s; display: inline-block;
  }
  .faq-item.open .faq-chevron { transform: rotate(180deg); }
  .faq-answer {
    padding: 0 18px; max-height: 0; overflow: hidden;
    transition: max-height .3s ease, padding .3s ease;
    font-size: 13.5px; color: var(--text-mid); line-height: 1.7;
  }
  .faq-item.open .faq-answer { max-height: 400px; padding: 0 18px 16px; }

  /* ── Video guides ── */
  .video-card {
    background: #fff; border-radius: 14px; border: 1px solid var(--border);
    overflow: hidden; cursor: pointer; transition: all .22s; box-shadow: var(--card-shadow);
  }
  .video-card:hover { transform: translateY(-3px); box-shadow: 0 10px 28px rgba(13,58,28,0.12); }
  .video-thumb {
    height: 110px; display: flex; align-items: center; justify-content: center;
    font-size: 36px; position: relative;
  }
  .video-play {
    position: absolute; width: 44px; height: 44px; border-radius: 50%;
    background: rgba(255,255,255,0.92); display: flex; align-items: center;
    justify-content: center; font-size: 18px; box-shadow: 0 4px 12px rgba(0,0,0,0.15);
  }
  .video-info { padding: 12px 14px; }
  .video-title { font-size: 13px; font-weight: 700; color: var(--text-dark); margin-bottom: 4px; }
  .video-meta  { font-size: 11px; color: var(--text-muted); }
  .video-grid  { display: grid; grid-template-columns: repeat(2, 1fr); gap: 12px; }

  /* ── Contact card ── */
  .contact-card {
    background: #fff; border-radius: 14px; border: 1px solid var(--border);
    padding: 18px; box-shadow: var(--card-shadow); margin-bottom: 14px;
    display: flex; align-items: center; gap: 14px; cursor: pointer;
    transition: all .18s;
  }
  .contact-card:hover { border-color: var(--green-bright); background: var(--green-pale); }
  .contact-ico-wrap {
    width: 46px; height: 46px; border-radius: 12px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 20px;
  }
  .contact-label { font-size: 14px; font-weight: 700; color: var(--text-dark); }
  .contact-desc  { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  /* ── Steps guide ── */
  .guide-step {
    display: flex; gap: 14px; padding: 14px 0; border-bottom: 1px solid #f0f5f1;
  }
  .guide-step:last-child { border-bottom: none; }
  .guide-num {
    width: 30px; height: 30px; border-radius: 50%; background: var(--green-mid);
    color: #fff; font-size: 13px; font-weight: 700;
    display: flex; align-items: center; justify-content: center; flex-shrink: 0; margin-top: 2px;
  }
  .guide-title { font-size: 14px; font-weight: 700; color: var(--text-dark); margin-bottom: 4px; }
  .guide-desc  { font-size: 13px; color: var(--text-mid); line-height: 1.6; }

  /* ── Feedback form ── */
  .feedback-star {
    font-size: 28px; cursor: pointer; transition: transform .15s;
    filter: grayscale(1); opacity: .4;
  }
  .feedback-star.lit { filter: grayscale(0); opacity: 1; }
  .feedback-star:hover { transform: scale(1.2); }

  /* ── Tag badge ── */
  .help-tag {
    display: inline-block; padding: 3px 10px; border-radius: 50px;
    font-size: 11px; font-weight: 600; margin-right: 6px;
    background: var(--green-pale); color: var(--green-mid);
    border: 1px solid rgba(37,160,69,0.25);
  }

  /* ── Active filter chip ── */
  .cat-filter-chip {
    padding: 7px 16px; border-radius: 50px; font-size: 12.5px; font-weight: 600;
    cursor: pointer; border: 1.5px solid var(--border); background: #fff; color: var(--text-mid);
    font-family: 'DM Sans', sans-serif; transition: all .15s;
  }
  .cat-filter-chip.active { background: var(--green-mid); color: #fff; border-color: var(--green-mid); }
  .cat-filter-chip:hover:not(.active) { border-color: var(--green-bright); color: var(--green-mid); }
`;

/* ─────────────────────────────────────────────
   DATA
───────────────────────────────────────────── */
const CATEGORIES = [
  { key: "all",      ico: "📚", name: "All Topics",      count: 24 },
  { key: "triage",   ico: "🤖", name: "AI Triage",       count: 6  },
  { key: "patients", ico: "👥", name: "Patients",        count: 5  },
  { key: "vaccine",  ico: "💉", name: "Immunisation",    count: 5  },
  { key: "schedule", ico: "📅", name: "Scheduling",      count: 4  },
  { key: "reports",  ico: "📊", name: "Reports",         count: 4  },
];

const FAQS = [
  {
    cat: "triage",
    q: "AI Triage कैसे काम करता है?",
    a: "GramSehat AI Claude पर आधारित है। आप लक्षण हिंदी या English में type या बोल सकते हैं। AI उन्हें analyze करके RED (आपातकाल), YELLOW (ध्यान दें), या GREEN (ठीक है) में classify करता है और step-by-step advice देता है।",
    tags: ["AI", "Triage"],
  },
  {
    cat: "triage",
    q: "क्या AI diagnosis 100% accurate है?",
    a: "नहीं — AI एक सहायक tool है, final decision आपका होगा। AI 70-95% accuracy के साथ काम करता है लेकिन clinical judgment हमेशा ज़रूरी है। RED cases में हमेशा PHC रेफर करें चाहे AI कुछ भी कहे।",
    tags: ["AI", "Accuracy"],
  },
  {
    cat: "triage",
    q: "Internet नहीं है तो AI काम करेगा?",
    a: "हाँ! Offline mode में एक local keyword-based triage engine काम करती है। यह AI जितनी smart नहीं है लेकिन basic RED/YELLOW/GREEN classification कर सकती है। Data automatically sync होगा जब internet आएगा।",
    tags: ["Offline", "AI"],
  },
  {
    cat: "triage",
    q: "Voice input कैसे use करें?",
    a: "AI Diagnosis page पर 🎤 microphone button दबाएं। Hindi में symptoms बोलें जैसे 'बुखार है, तीन दिन से, सिरदर्द भी है'। Chrome browser और Android phone पर सबसे अच्छा काम करता है।",
    tags: ["Voice", "Hindi"],
  },
  {
    cat: "patients",
    q: "नया patient कैसे add करें?",
    a: "My Patients page पर जाएं → '➕ New Patient' button दबाएं। नाम, उम्र, गाँव, phone number भरें। या 'Add via Triage' से सीधे triage करते हुए patient add करें। सभी data automatically save होगा।",
    tags: ["Patients"],
  },
  {
    cat: "patients",
    q: "Patient का triage status change कैसे करें?",
    a: "Patient को AI Diagnosis page पर ले जाएं (Diagnose button दबाएं)। नए symptoms describe करें — AI नया result देगा। Status automatically update हो जाएगा और health records में save होगा।",
    tags: ["Triage", "Update"],
  },
  {
    cat: "patients",
    q: "Patient का health record कहाँ देखें?",
    a: "Health Records page पर जाएं → बाईं list से patient select करें। Overview, Vitals, Timeline, और Medications tabs में सब मिलेगा। My Patients page पर भी '📋 Records' button है।",
    tags: ["Records"],
  },
  {
    cat: "vaccine",
    q: "बच्चे का vaccine due कैसे पता करें?",
    a: "Immunisation page पर जाएं → Children list में बच्चे का नाम देखें। 🔴 Urgent, 🟡 Due soon, 🟢 On track badges status दिखाते हैं। Due date और vaccine name भी show होता है।",
    tags: ["Vaccine", "Children"],
  },
  {
    cat: "vaccine",
    q: "Vaccine दिया — कैसे log करें?",
    a: "Immunisation page → '+ Log Vaccine' button → बच्चे का नाम, vaccine, और date भरें → Submit करें। Log automatically reports में भी आ जाएगा।",
    tags: ["Log", "Vaccine"],
  },
  {
    cat: "schedule",
    q: "Home visit schedule कैसे करें?",
    a: "Visit Schedule page → '➕ Schedule Visit' → Patient name, date, time और visit type (ANC/Post-natal/Immunisation आदि) भरें। Visit automatically calendar में आ जाएगी और reminder भी मिलेगा।",
    tags: ["Schedule", "Visit"],
  },
  {
    cat: "reports",
    q: "Monthly report कैसे submit करें?",
    a: "Reports page → 'Submit to ANM' button → जो reports submit करनी हैं वो choose करें → 'Submit All to ANM' दबाएं। Digital submission होगी, physical copy की ज़रूरत नहीं।",
    tags: ["Report", "ANM"],
  },
  {
    cat: "reports",
    q: "Report में data गलत दिख रहा है?",
    a: "Reports page का data real-time patient records से आता है। अगर data गलत है तो Health Records या Immunisation में जाकर correct करें — reports automatically update होंगी। Support के लिए नीचे contact करें।",
    tags: ["Report", "Error"],
  },
];

const VIDEOS = [
  { ico: "🤖", title: "AI Triage कैसे करें",     dur: "2:34", bg: "#e8f5e9" },
  { ico: "👶", title: "Vaccine Schedule Guide",    dur: "3:12", bg: "#e3f2fd" },
  { ico: "📋", title: "Patient Records add करें", dur: "1:58", bg: "#fce4ec" },
  { ico: "📊", title: "Monthly Report Submit",     dur: "2:15", bg: "#fff8e1" },
];

const GUIDES = [
  { title: "पहली बार login",             desc: "App open करें → Login करें → Language choose करें → Dashboard देखें।" },
  { title: "नए patient का triage",       desc: "My Patients → Add via Triage → लक्षण बताएं → Result save करें।" },
  { title: "Home visit schedule करें",   desc: "Visit Schedule → Schedule Visit → Date/Time/Type भरें → Save।" },
  { title: "Vaccine log करें",           desc: "Immunisation → Log Vaccine → Child, vaccine, date भरें → Submit।" },
  { title: "Monthly report भेजें",       desc: "Reports → Submit to ANM → Reports select करें → Submit All।" },
];

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function HelpPage() {
  const navigate = useNavigate();

  const [search,       setSearch]       = useState("");
  const [activeCat,    setActiveCat]    = useState("all");
  const [openFaq,      setOpenFaq]      = useState(null);
  const [activeSection,setActiveSection]= useState("faq");
  const [stars,        setStars]        = useState(0);
  const [feedback,     setFeedback]     = useState("");
  const [feedbackSent, setFeedbackSent] = useState(false);

  /* filtered FAQs */
  const faqs = FAQS.filter(f => {
    const matchCat = activeCat === "all" || f.cat === activeCat;
    const matchSearch = !search || f.q.toLowerCase().includes(search.toLowerCase()) || f.a.toLowerCase().includes(search.toLowerCase());
    return matchCat && matchSearch;
  });

  const sendFeedback = () => {
    if (!stars) return;
    setFeedbackSent(true);
    setFeedback("");
    setStars(0);
  };

  const SECTIONS = [
    { key: "faq",     label: "❓ FAQs"         },
    { key: "videos",  label: "🎬 Video Guides"  },
    { key: "guide",   label: "📖 Quick Start"   },
    { key: "contact", label: "📞 Contact"       },
  ];

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>
      <Sidebar />
      <Topbar page="Help & Support" />

      <div className="d-layout">
        <div className="d-content">

          {/* ── Hero search ── */}
          <div className="help-search-wrap">
            <div className="help-search-title">🙏 हम यहाँ हैं — मदद के लिए</div>
            <div className="help-search-sub">आप क्या जानना चाहते हैं? Hindi या English में type करें।</div>
            <div className="search-input-wrap" style={{ position: "relative" }}>
              <span style={{ position: "absolute", left: 14, top: "50%", transform: "translateY(-50%)", fontSize: 16 }}>🔍</span>
              <input
                className="help-search-input"
                placeholder="e.g. 'vaccine kaise log karen', 'triage result', 'report submit'…"
                value={search}
                onChange={e => { setSearch(e.target.value); setActiveSection("faq"); }}
                style={{ paddingLeft: 44 }}
              />
            </div>
          </div>

          {/* ── Category cards ── */}
          <div className="help-cats">
            {CATEGORIES.map(c => (
              <div
                key={c.key}
                className={`help-cat-card ${activeCat === c.key ? "active" : ""}`}
                onClick={() => { setActiveCat(c.key); setSearch(""); setActiveSection("faq"); }}
              >
                <div className="help-cat-ico">{c.ico}</div>
                <div className="help-cat-name">{c.name}</div>
                <div className="help-cat-count">{c.count} articles</div>
              </div>
            ))}
          </div>

          <div className="help-layout">
            {/* ── LEFT: Main content ── */}
            <div>
              {/* Section tabs */}
              <div style={{ display: "flex", gap: 8, marginBottom: 20, flexWrap: "wrap" }}>
                {SECTIONS.map(s => (
                  <button key={s.key} className={`cat-filter-chip ${activeSection === s.key ? "active" : ""}`}
                    onClick={() => setActiveSection(s.key)}>
                    {s.label}
                  </button>
                ))}
              </div>

              {/* ── FAQs ── */}
              {activeSection === "faq" && (
                <div>
                  <div style={{ marginBottom: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
                    <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark)" }}>
                      {faqs.length} {faqs.length === 1 ? "result" : "results"} found
                    </div>
                    {search && (
                      <button className="btn-secondary" style={{ fontSize: 12, padding: "6px 12px" }}
                        onClick={() => setSearch("")}>Clear search ✕</button>
                    )}
                  </div>

                  {faqs.length === 0 ? (
                    <div style={{ textAlign: "center", padding: "48px 20px", color: "var(--text-muted)" }}>
                      <div style={{ fontSize: 44, marginBottom: 12 }}>🔍</div>
                      <div style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: 16, marginBottom: 6 }}>
                        कोई result नहीं मिला
                      </div>
                      <div style={{ marginBottom: 20 }}>Try different keywords या नीचे contact करें।</div>
                      <button className="btn-primary" onClick={() => setActiveSection("contact")}>
                        📞 Contact Support
                      </button>
                    </div>
                  ) : (
                    faqs.map((f, i) => (
                      <div key={i} className={`faq-item ${openFaq === i ? "open" : ""}`}>
                        <div className="faq-question" onClick={() => setOpenFaq(openFaq === i ? null : i)}>
                          <div className="faq-q-text">{f.q}</div>
                          <span className="faq-chevron">▼</span>
                        </div>
                        <div className="faq-answer">
                          <div style={{ marginBottom: 10 }}>{f.a}</div>
                          <div>
                            {f.tags.map((t, j) => <span key={j} className="help-tag">{t}</span>)}
                          </div>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              )}

              {/* ── Video Guides ── */}
              {activeSection === "videos" && (
                <div>
                  <div style={{ fontSize: 14, fontWeight: 700, color: "var(--text-dark)", marginBottom: 16 }}>
                    🎬 Tutorial Videos — Hindi में
                  </div>
                  <div className="video-grid">
                    {VIDEOS.map((v, i) => (
                      <div key={i} className="video-card">
                        <div className="video-thumb" style={{ background: v.bg }}>
                          <span style={{ fontSize: 44 }}>{v.ico}</span>
                          <div className="video-play">▶️</div>
                        </div>
                        <div className="video-info">
                          <div className="video-title">{v.title}</div>
                          <div className="video-meta">⏱ {v.dur} · Hindi</div>
                        </div>
                      </div>
                    ))}
                  </div>

                  <div className="d-card" style={{ marginTop: 20 }}>
                    <div className="d-card-header">
                      <div className="d-card-title">📺 More Resources</div>
                    </div>
                    <div className="d-card-body">
                      {[
                        { ico: "📄", label: "ASHA Worker Handbook (PDF)",     tag: "Official" },
                        { ico: "📋", label: "NHP Immunisation Schedule Chart", tag: "NHP" },
                        { ico: "📊", label: "MCP Card Filling Guide",          tag: "Training" },
                        { ico: "🏥", label: "JSSK Scheme Guide",              tag: "Government" },
                      ].map((r, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 12, padding: "12px 0", borderBottom: i < 3 ? "1px solid #f0f5f1" : "none" }}>
                          <div style={{ width: 38, height: 38, borderRadius: 10, background: "#f0f9f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 18, flexShrink: 0 }}>{r.ico}</div>
                          <div style={{ flex: 1 }}>
                            <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-dark)" }}>{r.label}</div>
                          </div>
                          <span className="badge badge-green">{r.tag}</span>
                          <button className="btn-secondary" style={{ fontSize: 12, padding: "6px 12px" }}>📥 Download</button>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Quick Start Guide ── */}
              {activeSection === "guide" && (
                <div>
                  <div className="d-card" style={{ marginBottom: 20 }}>
                    <div className="d-card-header">
                      <div className="d-card-title">📖 Quick Start Guide</div>
                      <span className="badge badge-green">5 Steps</span>
                    </div>
                    <div className="d-card-body">
                      {GUIDES.map((g, i) => (
                        <div key={i} className="guide-step">
                          <div className="guide-num">{i + 1}</div>
                          <div>
                            <div className="guide-title">{g.title}</div>
                            <div className="guide-desc">{g.desc}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="d-card">
                    <div className="d-card-header">
                      <div className="d-card-title">⚡ Keyboard Shortcuts & Tips</div>
                    </div>
                    <div className="d-card-body">
                      {[
                        { tip: "🎤 Voice Input",     desc: "Mic button → Hindi में symptoms बोलें → Auto-fill होगा" },
                        { tip: "⚡ Quick Chips",     desc: "AI page पर quick symptom buttons से 1-tap select करें" },
                        { tip: "🔄 Offline First",   desc: "Internet नहीं है? App काम करती रहेगी — बाद में sync होगा" },
                        { tip: "📱 Add to Home",     desc: "Browser → Menu → 'Add to Home Screen' से app shortcut बनाएं" },
                        { tip: "🔴 RED = 108",       desc: "RED triage आए तो AI page पर 108 button दिखेगा — 1 tap call" },
                      ].map((t, i) => (
                        <div key={i} style={{ display: "flex", gap: 12, padding: "11px 0", borderBottom: i < 4 ? "1px solid #f0f5f1" : "none" }}>
                          <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dark)", minWidth: 130 }}>{t.tip}</div>
                          <div style={{ fontSize: 13, color: "var(--text-mid)" }}>{t.desc}</div>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              )}

              {/* ── Contact ── */}
              {activeSection === "contact" && (
                <div>
                  <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 12, marginBottom: 20 }}>
                    {[
                      { ico: "📞", label: "Helpline",       desc: "1800-XXX-XXXX · Free · 9am–6pm",  bg: "#e8f5e9", action: "tel:1800000000" },
                      { ico: "💬", label: "WhatsApp",       desc: "+91 98765 43210 · 24x7",           bg: "#e8f9f0", action: "#" },
                      { ico: "📧", label: "Email Support",  desc: "help@gramsehat.in · Reply in 24hr",bg: "#e3f2fd", action: "mailto:help@gramsehat.in" },
                      { ico: "🏥", label: "Block ANM",      desc: "Contact your block-level ANM",     bg: "#fce4ec", action: "#" },
                    ].map((c, i) => (
                      <a key={i} href={c.action} className="contact-card" style={{ textDecoration: "none" }}>
                        <div className="contact-ico-wrap" style={{ background: c.bg }}>{c.ico}</div>
                        <div>
                          <div className="contact-label">{c.label}</div>
                          <div className="contact-desc">{c.desc}</div>
                        </div>
                      </a>
                    ))}
                  </div>

                  {/* Feedback */}
                  <div className="d-card">
                    <div className="d-card-header">
                      <div className="d-card-title">⭐ Rate Your Experience</div>
                    </div>
                    <div className="d-card-body">
                      {feedbackSent ? (
                        <div style={{ textAlign: "center", padding: "24px 0" }}>
                          <div style={{ fontSize: 44, marginBottom: 10 }}>🙏</div>
                          <div style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: 16 }}>शुक्रिया!</div>
                          <div style={{ color: "var(--text-muted)", fontSize: 13 }}>आपका feedback हमें बेहतर बनने में मदद करेगा।</div>
                        </div>
                      ) : (
                        <>
                          <div style={{ fontSize: 13.5, color: "var(--text-mid)", marginBottom: 14 }}>
                            GramSehat app आपको कितनी useful लगी?
                          </div>
                          <div style={{ display: "flex", gap: 8, marginBottom: 18 }}>
                            {[1, 2, 3, 4, 5].map(s => (
                              <span key={s} className={`feedback-star ${s <= stars ? "lit" : ""}`}
                                onClick={() => setStars(s)}>⭐</span>
                            ))}
                          </div>
                          <textarea
                            className="gs-textarea"
                            placeholder="कोई सुझाव या problem? यहाँ लिखें…"
                            value={feedback}
                            onChange={e => setFeedback(e.target.value)}
                            style={{ minHeight: 90, marginBottom: 14 }}
                          />
                          <button className="btn-primary" onClick={sendFeedback} disabled={!stars}>
                            📨 Submit Feedback
                          </button>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT sidebar ── */}
            <div>
              {/* Popular topics */}
              <div className="d-card" style={{ marginBottom: 16 }}>
                <div className="d-card-header">
                  <div className="d-card-title">🔥 Popular Topics</div>
                </div>
                <div className="d-card-body" style={{ padding: "8px 16px 16px" }}>
                  {[
                    { q: "AI triage कैसे करें?",        cat: "triage"   },
                    { q: "Vaccine due कैसे देखें?",      cat: "vaccine"  },
                    { q: "Monthly report कैसे submit?",  cat: "reports"  },
                    { q: "Offline mode काम करेगा?",      cat: "triage"   },
                    { q: "Patient health record कहाँ?",  cat: "patients" },
                  ].map((t, i) => (
                    <div key={i}
                      style={{ padding: "10px 0", borderBottom: i < 4 ? "1px solid #f0f5f1" : "none", cursor: "pointer" }}
                      onClick={() => { setSearch(t.q.slice(0, 20)); setActiveCat(t.cat); setActiveSection("faq"); }}>
                      <div style={{ fontSize: 13, fontWeight: 600, color: "var(--green-mid)" }}>→ {t.q}</div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Emergency contacts */}
              <div className="d-card" style={{ marginBottom: 16, border: "1px solid rgba(198,40,40,0.2)", background: "#fff8f8" }}>
                <div className="d-card-header" style={{ borderBottom: "1px solid rgba(198,40,40,0.1)" }}>
                  <div className="d-card-title" style={{ color: "#c62828" }}>🚨 Emergency Contacts</div>
                </div>
                <div className="d-card-body">
                  {[
                    { label: "Ambulance",        num: "108",  color: "#c62828" },
                    { label: "Police",           num: "100",  color: "#1565c0" },
                    { label: "Women Helpline",   num: "1091", color: "#7b1fa2" },
                    { label: "Child Helpline",   num: "1098", color: "#e65100" },
                    { label: "Health Helpline",  num: "104",  color: "#2e7d32" },
                  ].map((c, i) => (
                    <a key={i} href={`tel:${c.num}`}
                      style={{ display: "flex", alignItems: "center", justifyContent: "space-between", padding: "10px 0", borderBottom: i < 4 ? "1px solid #f5eded" : "none", textDecoration: "none" }}>
                      <div style={{ fontSize: 13, color: "var(--text-mid)", fontWeight: 600 }}>{c.label}</div>
                      <div style={{ fontSize: 16, fontWeight: 700, color: c.color }}>{c.num} 📞</div>
                    </a>
                  ))}
                </div>
              </div>

              {/* Quick navigation */}
              <div className="d-card">
                <div className="d-card-header">
                  <div className="d-card-title">🧭 Quick Navigate</div>
                </div>
                <div className="d-card-body" style={{ padding: "8px 12px 12px" }}>
                  {[
                    { ico: "🤖", label: "AI Diagnosis",   path: "/triage"       },
                    { ico: "👥", label: "My Patients",    path: "/mypatients"   },
                    { ico: "📅", label: "Visit Schedule", path: "/visitschedule"},
                    { ico: "💉", label: "Immunisation",   path: "/immunisation" },
                    { ico: "📊", label: "Reports",        path: "/reports"      },
                    { ico: "⚙️", label: "Settings",       path: "/settings"     },
                  ].map((n, i) => (
                    <div key={i}
                      style={{ display: "flex", alignItems: "center", gap: 10, padding: "9px 6px", borderRadius: 8, cursor: "pointer", transition: "background .15s" }}
                      onClick={() => navigate(n.path)}
                      onMouseEnter={e => e.currentTarget.style.background = "#f6fbf7"}
                      onMouseLeave={e => e.currentTarget.style.background = "transparent"}
                    >
                      <div style={{ width: 30, height: 30, borderRadius: 8, background: "#f0f9f2", display: "flex", alignItems: "center", justifyContent: "center", fontSize: 14, flexShrink: 0 }}>{n.ico}</div>
                      <div style={{ fontSize: 13.5, fontWeight: 600, color: "var(--text-dark)" }}>{n.label}</div>
                      <div style={{ marginLeft: "auto", fontSize: 12, color: "var(--text-muted)" }}>→</div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}