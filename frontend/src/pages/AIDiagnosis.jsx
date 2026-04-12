import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Topbar, sharedStyles } from "../components/Layout.jsx";
import { getCurrentUser } from "./utils/auth.js";

/* ─────────────────────────────────────────────
   STYLES
───────────────────────────────────────────── */
const pageStyles = `
  .diag-layout {
    display: grid;
    grid-template-columns: 1fr 380px;
    gap: 24px;
    align-items: start;
  }
  @media (max-width: 1024px) {
    .diag-layout { grid-template-columns: 1fr; }
  }

  /* ── Chat bubble area ── */
  .chat-wrap {
    background: #fff;
    border-radius: 16px;
    border: 1px solid var(--border);
    box-shadow: var(--card-shadow);
    display: flex;
    flex-direction: column;
    min-height: 540px;
    overflow: hidden;
  }
  .chat-header {
    padding: 16px 20px;
    border-bottom: 1px solid #f0f5f1;
    display: flex;
    align-items: center;
    gap: 12px;
  }
  .chat-avatar {
    width: 40px; height: 40px; border-radius: 50%;
    background: linear-gradient(135deg, #25a045, #1a7a34);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; flex-shrink: 0;
  }
  .chat-messages {
    flex: 1;
    padding: 20px;
    display: flex;
    flex-direction: column;
    gap: 14px;
    overflow-y: auto;
    max-height: 420px;
  }
  .msg-row { display: flex; gap: 10px; align-items: flex-end; }
  .msg-row.user { flex-direction: row-reverse; }
  .msg-bubble {
    max-width: 76%;
    padding: 12px 16px;
    border-radius: 18px;
    font-size: 14px;
    line-height: 1.55;
    color: var(--text-dark);
  }
  .msg-bubble.ai {
    background: #f0f9f2;
    border: 1px solid rgba(37,160,69,0.18);
    border-bottom-left-radius: 4px;
  }
  .msg-bubble.user {
    background: var(--green-mid);
    color: #fff;
    border-bottom-right-radius: 4px;
  }
  .msg-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; flex-shrink: 0;
  }
  .msg-avatar.ai   { background: #e8f5e9; }
  .msg-avatar.user { background: var(--green-mid); color: #fff; font-weight: 700; font-size: 11px; }

  /* typing dots */
  .typing-dot {
    display: inline-block; width: 7px; height: 7px;
    border-radius: 50%; background: var(--green-mid);
    margin: 0 2px; animation: bounce 1.2s infinite;
  }
  .typing-dot:nth-child(2) { animation-delay: .2s; }
  .typing-dot:nth-child(3) { animation-delay: .4s; }
  @keyframes bounce { 0%,80%,100%{transform:translateY(0)} 40%{transform:translateY(-6px)} }

  /* ── Input bar ── */
  .chat-input-bar {
    padding: 14px 16px;
    border-top: 1px solid #f0f5f1;
    display: flex;
    gap: 10px;
    align-items: flex-end;
  }
  .chat-textarea {
    flex: 1;
    border: 1.5px solid var(--border);
    border-radius: 12px;
    padding: 10px 14px;
    font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    resize: none;
    min-height: 42px;
    max-height: 120px;
    color: var(--text-dark);
    transition: border-color .18s;
    background: #f8faf8;
  }
  .chat-textarea:focus { outline: none; border-color: var(--green-bright); background: #fff; }
  .chat-send-btn {
    width: 42px; height: 42px; border-radius: 12px;
    background: var(--green-mid); color: #fff;
    border: none; cursor: pointer; font-size: 18px;
    display: flex; align-items: center; justify-content: center;
    transition: background .18s; flex-shrink: 0;
  }
  .chat-send-btn:hover { background: #1a7a34; }
  .chat-send-btn:disabled { background: #a5d6b5; cursor: not-allowed; }

  /* ── Quick symptom chips ── */
  .symptom-chips { display: flex; flex-wrap: wrap; gap: 7px; padding: 0 20px 16px; }
  .symptom-chip {
    padding: 6px 14px; border-radius: 50px;
    font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1.5px solid var(--border);
    background: #fff; color: var(--text-mid);
    font-family: 'DM Sans', sans-serif;
    transition: all .15s;
  }
  .symptom-chip:hover { border-color: var(--green-bright); color: var(--green-mid); background: var(--green-pale); }

  /* ── Result panel ── */
  .result-panel {
    background: #fff; border-radius: 16px;
    border: 1px solid var(--border);
    box-shadow: var(--card-shadow);
    overflow: hidden;
    animation: fadeUp .4s ease both;
  }
  .result-hero {
    padding: 20px;
    display: flex; align-items: center; gap: 14px;
  }
  .result-level-badge {
    width: 56px; height: 56px; border-radius: 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 26px; flex-shrink: 0;
  }
  .result-section { padding: 16px 20px; border-top: 1px solid #f0f5f1; }
  .result-section-title {
    font-size: 11px; font-weight: 700; text-transform: uppercase;
    letter-spacing: .06em; color: var(--text-muted); margin-bottom: 10px;
  }
  .step-item { display: flex; gap: 10px; align-items: flex-start; margin-bottom: 10px; }
  .step-num {
    width: 22px; height: 22px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700; color: #fff; flex-shrink: 0; margin-top: 1px;
  }
  .symptom-tag {
    display: inline-block; padding: 4px 12px; border-radius: 50px;
    font-size: 12px; font-weight: 600; margin: 3px 4px 3px 0;
  }
  .conf-bar-wrap { height: 8px; background: #edf3ef; border-radius: 8px; overflow: hidden; margin-top: 6px; }
  .conf-bar-fill { height: 100%; border-radius: 8px; transition: width .8s ease; }
  .action-btn-row { display: flex; gap: 8px; padding: 16px 20px; border-top: 1px solid #f0f5f1; }

  /* ── Patient pill ── */
  .patient-pill {
    display: flex; align-items: center; gap: 8px;
    background: var(--green-pale); border: 1px solid rgba(37,160,69,0.25);
    border-radius: 50px; padding: 6px 14px 6px 8px; margin-bottom: 16px;
    width: fit-content;
  }
  .patient-pill-avatar {
    width: 28px; height: 28px; border-radius: 50%;
    background: var(--green-mid); color: #fff;
    display: flex; align-items: center; justify-content: center;
    font-size: 11px; font-weight: 700;
  }
  .empty-result {
    padding: 40px 20px; text-align: center; color: var(--text-muted);
  }
  .empty-result-ico { font-size: 44px; margin-bottom: 12px; }

  /* ── Voice button ── */
  .voice-btn {
    width: 42px; height: 42px; border-radius: 12px;
    background: #f0f9f2; color: var(--green-mid);
    border: 1.5px solid rgba(37,160,69,0.3); cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; transition: all .18s; flex-shrink: 0;
  }
  .voice-btn.recording {
    background: #ffebee; color: #c62828; border-color: rgba(198,40,40,0.4);
    animation: pulse 1s infinite;
  }
  @keyframes pulse { 0%,100%{transform:scale(1)} 50%{transform:scale(1.08)} }

  /* ── History sidebar list ── */
  .history-item {
    display: flex; align-items: center; gap: 10px; padding: 10px 0;
    border-bottom: 1px solid #f0f5f1; cursor: pointer;
  }
  .history-item:last-child { border-bottom: none; }
  .history-item:hover .history-name { color: var(--green-mid); }
`;

/* ─────────────────────────────────────────────
   CONSTANTS
───────────────────────────────────────────── */
const QUICK_SYMPTOMS = [
  "बुखार (Fever)", "सिरदर्द (Headache)", "उल्टी (Vomiting)",
  "पेट दर्द (Stomach pain)", "खांसी (Cough)", "सांस में तकलीफ",
  "High BP", "कमज़ोरी (Weakness)", "बच्चे को टीका चाहिए",
];

const LEVEL_CONFIG = {
  RED: {
    bg: "#ffebee", color: "#c62828", border: "rgba(198,40,40,0.25)",
    badge: "#ffcdd2", label: "आपातकाल — Emergency", emoji: "🚨",
    stepColor: "#c62828", tagBg: "#ffebee", tagColor: "#c62828",
    confColor: "#ef5350",
  },
  YELLOW: {
    bg: "#fff8e1", color: "#f57f17", border: "rgba(245,127,23,0.25)",
    badge: "#ffecb3", label: "ध्यान दें — Monitor", emoji: "⚠️",
    stepColor: "#f57f17", tagBg: "#fff8e1", tagColor: "#f57f17",
    confColor: "#ffb300",
  },
  GREEN: {
    bg: "#e8f5e9", color: "#2e7d32", border: "rgba(46,125,50,0.25)",
    badge: "#c8e6c9", label: "ठीक है — Stable", emoji: "✅",
    stepColor: "#2e7d32", tagBg: "#e8f5e9", tagColor: "#2e7d32",
    confColor: "#4caf50",
  },
};

/* ─────────────────────────────────────────────
   TRIAGE ENGINE  (keyword-based local logic)
───────────────────────────────────────────── */
const RED_KEYWORDS = [
  "बेहोश", "unconscious", "seizure", "दौरा", "chest pain", "सीने में दर्द",
  "heavy bleeding", "ज़्यादा खून", "breathing difficulty", "सांस नहीं",
  "high bp", "bp 140", "bp 150", "bp 160", "eclampsia", "एक्लम्पसिया",
  "फिट", "fit", "stroke", "लकवा", "paralysis", "premature", "समय से पहले",
  "stillbirth", "dead baby", "baby not moving", "बच्चा नहीं हिल रहा",
];
const YELLOW_KEYWORDS = [
  "fever", "बुखार", "vomiting", "उल्टी", "diarrhea", "दस्त",
  "headache", "सिरदर्द", "swelling", "सूजन", "pale", "पीला",
  "weakness", "कमज़ोरी", "cough", "खांसी", "anemia", "खून की कमी",
  "bp 130", "bp 135", "follow up", "followup", "mild", "हल्का",
  "डायबिटीज़", "diabetes", "sugar",
];

function triageText(text) {
  const low = text.toLowerCase();
  for (const kw of RED_KEYWORDS) if (low.includes(kw)) return "RED";
  for (const kw of YELLOW_KEYWORDS) if (low.includes(kw)) return "YELLOW";
  return "GREEN";
}

const ADVICE = {
  RED: {
    steps: [
      "तुरंत PHC या अस्पताल ले जाएं।",
      "108 एम्बुलेंस कॉल करें अगर गाड़ी नहीं है।",
      "मरीज़ को लेटाएं, बाईं करवट पर।",
      "ANM / डॉक्टर को फ़ोन पर सूचित करें।",
      "रेफरल स्लिप बनाएं।",
    ],
    disease: "High-risk condition — तुरंत रेफर करें",
    medicines: ["कोई दवा खुद न दें — PHC पर ले जाएं।"],
  },
  YELLOW: {
    steps: [
      "24-48 घंटे में ANM या डॉक्टर को दिखाएं।",
      "पानी पिलाते रहें।",
      "बुखार हो तो पेरासिटामोल 500mg दें।",
      "नज़र रखें — लक्षण बिगड़ें तो तुरंत PHC।",
      "अगली विज़िट शेड्यूल करें।",
    ],
    disease: "Moderate symptoms — निगरानी ज़रूरी",
    medicines: ["Paracetamol 500mg — बुखार के लिए", "ORS — दस्त / उल्टी के लिए", "Iron-Folic Acid — यदि प्रेग्नेंसी है"],
  },
  GREEN: {
    steps: [
      "घर पर देखभाल करें।",
      "पौष्टिक खाना और पानी।",
      "नियमित ANC / चेकअप जारी रखें।",
      "आगामी टीकाकरण मिस न करें।",
    ],
    disease: "Normal / Routine case",
    medicines: ["Iron-Folic Acid (यदि गर्भवती)", "Vitamin supplements as advised"],
  },
};

/* ─────────────────────────────────────────────
   AI CALL via Anthropic API
───────────────────────────────────────────── */
async function callClaudeAPI(messages, patientContext) {
  const systemPrompt = `You are GramSehat AI — an intelligent medical triage assistant for ASHA (Accredited Social Health Activist) workers in rural Bihar, India. 
You help ASHA workers assess patients and decide the urgency level.

Patient context: ${JSON.stringify(patientContext || {})}

Rules:
1. Always respond in a mix of simple Hindi and English (Hinglish) — ASHA workers understand both.
2. Always end your response with a JSON block like this (inside triple backticks, language "json"):
{
  "level": "RED" | "YELLOW" | "GREEN",
  "confidence": 75,
  "detectedSymptoms": ["symptom1", "symptom2"],
  "diseaseHint": "Possible condition in 3-4 words",
  "summary": "One line summary in Hindi"
}
3. RED = Emergency, refer immediately. YELLOW = Monitor, see doctor in 24-48 hrs. GREEN = Stable, home care.
4. Be empathetic, concise, and practical. Avoid medical jargon.
5. If asked about immunisation, give vaccine schedule advice.
6. Always consider pregnancy-related risks seriously.`;

  try {
    const response = await fetch("https://api.anthropic.com/v1/messages", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        model: "claude-sonnet-4-20250514",
        max_tokens: 1000,
        system: systemPrompt,
        messages: messages.map((m) => ({
          role: m.role,
          content: m.content,
        })),
      }),
    });
    const data = await response.json();
    const fullText = data.content?.map((c) => c.text || "").join("") || "";
    return fullText;
  } catch (err) {
    console.error("Claude API error:", err);
    return null;
  }
}

/* parse JSON block from Claude response */
function parseResult(text) {
  try {
    const match = text.match(/```json\s*([\s\S]*?)```/);
    if (match) return JSON.parse(match[1]);
  } catch (_) {}
  // fallback: local triage
  return null;
}

/* strip JSON block from display text */
function stripJSON(text) {
  return text.replace(/```json[\s\S]*?```/g, "").trim();
}

/* ─────────────────────────────────────────────
   COMPONENT
───────────────────────────────────────────── */
export default function AIDiagnosisPage() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillPatient = location.state?.patient;
  const currentUser = getCurrentUser();

  const [messages, setMessages] = useState([
    {
      role: "assistant",
      content: prefillPatient
        ? `नमस्ते! मैं GramSehat AI हूं। मैं देख रहा हूं कि आप **${prefillPatient.name}** के लिए जांच करना चाहते हैं। उनके लक्षण बताएं — हिंदी या English में।`
        : "नमस्ते! मैं GramSehat AI हूं — आपका AI सहायक। \n\nमरीज़ के लक्षण बताएं (हिंदी या English में) और मैं तुरंत triage करूंगा। आप नीचे दिए quick symptoms भी छू सकते हैं।",
      displayOnly: true,
    },
  ]);
  const [apiMessages, setApiMessages] = useState([]); // actual API history
  const [input, setInput] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [history, setHistory] = useState([]);
  const [recording, setRecording] = useState(false);
  const bottomRef = useRef(null);
  const textareaRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, loading]);

  /* auto-resize textarea */
  const handleInputChange = (e) => {
    setInput(e.target.value);
    const el = textareaRef.current;
    if (el) { el.style.height = "42px"; el.style.height = el.scrollHeight + "px"; }
  };

  const sendMessage = async (text) => {
    const trimmed = (text || input).trim();
    if (!trimmed || loading) return;

    const userMsg = { role: "user", content: trimmed };
    const newApiMsgs = [...apiMessages, userMsg];

    setMessages((prev) => [...prev, { role: "user", content: trimmed }]);
    setApiMessages(newApiMsgs);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "42px";
    setLoading(true);

    const patientCtx = prefillPatient
      ? { name: prefillPatient.name, age: prefillPatient.age, triage: prefillPatient.triage, symptoms: prefillPatient.symptoms }
      : { ashaWorker: currentUser?.name || "ASHA Worker", block: currentUser?.block || "Bihta" };

    const rawResponse = await callClaudeAPI(newApiMsgs, patientCtx);

    if (rawResponse) {
      const parsed = parseResult(rawResponse);
      const displayText = stripJSON(rawResponse);

      const assistantApiMsg = { role: "assistant", content: rawResponse };
      setApiMessages((prev) => [...prev, assistantApiMsg]);
      setMessages((prev) => [...prev, { role: "assistant", content: displayText }]);

      if (parsed) {
        const advice = ADVICE[parsed.level] || ADVICE.GREEN;
        const fullResult = { ...parsed, advice };
        setResult(fullResult);
        // save to history
        setHistory((h) => [
          { patient: prefillPatient?.name || "Patient", level: parsed.level, summary: parsed.summary, time: new Date().toLocaleTimeString("en-IN", { hour: "2-digit", minute: "2-digit" }) },
          ...h.slice(0, 4),
        ]);
      } else {
        // fallback local triage
        const level = triageText(trimmed);
        const advice = ADVICE[level];
        setResult({ level, confidence: 65, detectedSymptoms: [], diseaseHint: "Local assessment", summary: "Local triage applied", advice });
      }
    } else {
      // API failed — local fallback
      const level = triageText(trimmed);
      const advice = ADVICE[level];
      setResult({ level, confidence: 60, detectedSymptoms: [trimmed], diseaseHint: "Offline assessment", summary: trimmed, advice });
      setMessages((prev) => [...prev, {
        role: "assistant",
        content: "⚠️ AI से connection नहीं हुआ। Local triage किया गया है। कृपया internet check करें।",
      }]);
    }

    setLoading(false);
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(); }
  };

  /* Simulate voice — in production wire to Web Speech API */
  const toggleVoice = () => {
    if (!recording) {
      setRecording(true);
      if ("webkitSpeechRecognition" in window || "SpeechRecognition" in window) {
        const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
        const rec = new SR();
        rec.lang = "hi-IN";
        rec.interimResults = false;
        rec.onresult = (e) => { setInput(e.results[0][0].transcript); setRecording(false); };
        rec.onerror = () => setRecording(false);
        rec.onend = () => setRecording(false);
        rec.start();
      } else {
        setTimeout(() => setRecording(false), 2000);
      }
    } else {
      setRecording(false);
    }
  };

  const cfg = result ? LEVEL_CONFIG[result.level] : null;

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>
      <Sidebar />
      <Topbar page="AI Diagnosis" />

      <div className="d-layout">
        <div className="d-content">
          {/* Page header */}
          <div className="page-header">
            <div>
              <div className="page-title">🤖 AI Triage & Diagnosis</div>
              <div className="page-subtitle">
                Powered by Claude AI — describe symptoms in Hindi or English
              </div>
            </div>
            {prefillPatient && (
              <button className="btn-secondary" onClick={() => navigate("/mypatients")}>
                ← Back to Patients
              </button>
            )}
          </div>

          {/* Patient pill */}
          {prefillPatient && (
            <div className="patient-pill">
              <div className="patient-pill-avatar">
                {prefillPatient.initials || prefillPatient.name?.slice(0, 2).toUpperCase()}
              </div>
              <div>
                <div style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dark)" }}>
                  {prefillPatient.name}
                </div>
                <div style={{ fontSize: 11, color: "var(--text-muted)" }}>
                  {prefillPatient.age} yrs · {prefillPatient.village}
                </div>
              </div>
            </div>
          )}

          <div className="diag-layout">
            {/* ── LEFT: Chat ── */}
            <div>
              <div className="chat-wrap">
                {/* Chat header */}
                <div className="chat-header">
                  <div className="chat-avatar">🤖</div>
                  <div>
                    <div style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: 14 }}>
                      GramSehat AI
                    </div>
                    <div style={{ fontSize: 12, color: "#4caf50" }}>● Online — Ready to assess</div>
                  </div>
                  {result && (
                    <button
                      className="btn-secondary"
                      style={{ marginLeft: "auto", fontSize: 12, padding: "6px 14px" }}
                      onClick={() => { setMessages([{ role: "assistant", content: "नई जांच शुरू करें। लक्षण बताएं।", displayOnly: true }]); setApiMessages([]); setResult(null); }}
                    >
                      🔄 New Case
                    </button>
                  )}
                </div>

                {/* Messages */}
                <div className="chat-messages">
                  {messages.map((m, i) => (
                    <div key={i} className={`msg-row ${m.role === "user" ? "user" : ""}`}>
                      {m.role === "assistant" && (
                        <div className="msg-avatar ai">🤖</div>
                      )}
                      {m.role === "user" && (
                        <div className="msg-avatar user">
                          {(currentUser?.name || "A").slice(0, 1).toUpperCase()}
                        </div>
                      )}
                      <div className={`msg-bubble ${m.role === "assistant" ? "ai" : "user"}`}
                        style={{ whiteSpace: "pre-wrap" }}>
                        {m.content}
                      </div>
                    </div>
                  ))}

                  {loading && (
                    <div className="msg-row">
                      <div className="msg-avatar ai">🤖</div>
                      <div className="msg-bubble ai" style={{ padding: "14px 18px" }}>
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                        <span className="typing-dot" />
                      </div>
                    </div>
                  )}
                  <div ref={bottomRef} />
                </div>

                {/* Quick symptoms */}
                <div className="symptom-chips">
                  {QUICK_SYMPTOMS.map((s) => (
                    <button key={s} className="symptom-chip" onClick={() => sendMessage(s)}>
                      {s}
                    </button>
                  ))}
                </div>

                {/* Input bar */}
                <div className="chat-input-bar">
                  <button
                    className={`voice-btn ${recording ? "recording" : ""}`}
                    onClick={toggleVoice}
                    title="Voice input (Hindi)"
                  >
                    🎤
                  </button>
                  <textarea
                    ref={textareaRef}
                    className="chat-textarea"
                    rows={1}
                    placeholder="लक्षण बताएं… e.g. 'बुखार है, 3 दिन से, सिरदर्द भी है'"
                    value={input}
                    onChange={handleInputChange}
                    onKeyDown={handleKeyDown}
                  />
                  <button
                    className="chat-send-btn"
                    onClick={() => sendMessage()}
                    disabled={!input.trim() || loading}
                  >
                    ➤
                  </button>
                </div>
              </div>

              {/* Recent history */}
              {history.length > 0 && (
                <div className="d-card" style={{ marginTop: 20 }}>
                  <div className="d-card-header">
                    <div className="d-card-title">📜 Recent Assessments</div>
                  </div>
                  <div className="d-card-body" style={{ padding: "8px 16px 16px" }}>
                    {history.map((h, i) => (
                      <div key={i} className="history-item">
                        <div style={{
                          width: 32, height: 32, borderRadius: 8,
                          background: LEVEL_CONFIG[h.level]?.bg,
                          display: "flex", alignItems: "center", justifyContent: "center",
                          fontSize: 16, flexShrink: 0,
                        }}>
                          {LEVEL_CONFIG[h.level]?.emoji}
                        </div>
                        <div style={{ flex: 1, minWidth: 0 }}>
                          <div className="history-name" style={{ fontSize: 13, fontWeight: 700, color: "var(--text-dark)" }}>
                            {h.patient}
                          </div>
                          <div style={{ fontSize: 12, color: "var(--text-muted)", whiteSpace: "nowrap", overflow: "hidden", textOverflow: "ellipsis" }}>
                            {h.summary}
                          </div>
                        </div>
                        <div style={{ fontSize: 11, color: "var(--text-muted)", flexShrink: 0 }}>{h.time}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* ── RIGHT: Result panel ── */}
            <div>
              {!result ? (
                <div className="result-panel">
                  <div className="empty-result">
                    <div className="empty-result-ico">🩺</div>
                    <div style={{ fontWeight: 700, color: "var(--text-dark)", fontSize: 15, marginBottom: 6 }}>
                      Triage Result
                    </div>
                    <div style={{ fontSize: 13 }}>
                      Chat में लक्षण describe करें — AI यहाँ result दिखाएगा।
                    </div>
                  </div>
                </div>
              ) : (
                <div className="result-panel">
                  {/* Hero */}
                  <div className="result-hero" style={{ background: cfg.bg, borderBottom: `1px solid ${cfg.border}` }}>
                    <div className="result-level-badge" style={{ background: cfg.badge }}>
                      {cfg.emoji}
                    </div>
                    <div>
                      <div style={{ fontSize: 18, fontWeight: 700, color: cfg.color }}>
                        {cfg.label}
                      </div>
                      <div style={{ fontSize: 12, color: cfg.color, opacity: 0.8, marginTop: 2 }}>
                        {result.diseaseHint}
                      </div>
                    </div>
                  </div>

                  {/* Confidence */}
                  <div className="result-section">
                    <div className="result-section-title">AI Confidence</div>
                    <div style={{ display: "flex", justifyContent: "space-between", marginBottom: 6 }}>
                      <span style={{ fontSize: 13, color: "var(--text-mid)" }}>सटीकता</span>
                      <span style={{ fontSize: 13, fontWeight: 700, color: cfg.color }}>{result.confidence}%</span>
                    </div>
                    <div className="conf-bar-wrap">
                      <div className="conf-bar-fill" style={{ width: `${result.confidence}%`, background: cfg.confColor }} />
                    </div>
                  </div>

                  {/* Detected symptoms */}
                  {result.detectedSymptoms?.length > 0 && (
                    <div className="result-section">
                      <div className="result-section-title">पाए गए लक्षण</div>
                      <div>
                        {result.detectedSymptoms.map((s, i) => (
                          <span key={i} className="symptom-tag" style={{ background: cfg.bg, color: cfg.color }}>
                            {s}
                          </span>
                        ))}
                      </div>
                    </div>
                  )}

                  {/* Steps */}
                  <div className="result-section">
                    <div className="result-section-title">अभी क्या करें</div>
                    {result.advice?.steps?.map((step, i) => (
                      <div key={i} className="step-item">
                        <div className="step-num" style={{ background: cfg.stepColor }}>{i + 1}</div>
                        <div style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.55 }}>{step}</div>
                      </div>
                    ))}
                  </div>

                  {/* Medicines */}
                  {result.advice?.medicines?.length > 0 && (
                    <div className="result-section">
                      <div className="result-section-title">💊 दवाएं / Medicines</div>
                      {result.advice.medicines.map((m, i) => (
                        <div key={i} style={{ display: "flex", alignItems: "center", gap: 8, marginBottom: 6 }}>
                          <div style={{ width: 6, height: 6, borderRadius: "50%", background: cfg.stepColor, flexShrink: 0 }} />
                          <div style={{ fontSize: 13, color: "var(--text-mid)" }}>{m}</div>
                        </div>
                      ))}
                    </div>
                  )}

                  {/* Emergency call for RED */}
                  {result.level === "RED" && (
                    <div className="result-section" style={{ background: "#ffebee" }}>
                      <a
                        href="tel:108"
                        style={{
                          display: "flex", alignItems: "center", justifyContent: "center", gap: 10,
                          background: "#c62828", color: "#fff", borderRadius: 12,
                          padding: "14px 16px", textDecoration: "none", fontWeight: 700, fontSize: 16,
                        }}
                      >
                        🚨 108 एम्बुलेंस कॉल करें
                      </a>
                    </div>
                  )}

                  {/* Action buttons */}
                  <div className="action-btn-row">
                    <button
                      className="btn-secondary"
                      style={{ flex: 1, justifyContent: "center", fontSize: 12 }}
                      onClick={() => navigate("/schedule", { state: { patient: prefillPatient } })}
                    >
                      📅 Schedule Visit
                    </button>
                    <button
                      className="btn-primary"
                      style={{ flex: 1, justifyContent: "center", fontSize: 12 }}
                      onClick={() => navigate("/healthrecords", { state: { patient: prefillPatient } })}
                    >
                      📋 Save to Records
                    </button>
                  </div>
                </div>
              )}

              {/* Tips card */}
              <div className="d-card" style={{ marginTop: 16 }}>
                <div className="d-card-header">
                  <div className="d-card-title">💡 Tips for ASHA Workers</div>
                </div>
                <div className="d-card-body" style={{ fontSize: 13, color: "var(--text-mid)", lineHeight: 1.7 }}>
                  {[
                    "🔴 RED = तुरंत PHC / 108",
                    "🟡 YELLOW = 24-48 hrs में डॉक्टर",
                    "🟢 GREEN = घर पर देखभाल",
                    "हमेशा vitals note करें — BP, Temperature",
                    "Pregnancy में कोई भी RED symptom = तुरंत refer करें",
                  ].map((tip, i) => (
                    <div key={i} style={{ marginBottom: 6 }}>{tip}</div>
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