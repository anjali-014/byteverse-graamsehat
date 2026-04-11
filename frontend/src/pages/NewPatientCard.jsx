import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";


const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-deep:   #0d3a1c;
    --green-mid:    #1b6530;
    --green-bright: #25a045;
    --green-glow:   #3dcc66;
    --green-pale:   #e8f5ec;
    --border:       rgba(30,100,50,0.14);
    --text-dark:    #0f1e13;
    --text-mid:     #3a5942;
    --text-muted:   #7a9e82;
  }

  body { font-family: 'DM Sans', sans-serif; }

  /* ── OVERLAY ── */
  .np-overlay {
    position: fixed; inset: 0; z-index: 1000;
    background: rgba(5, 20, 10, 0.65);
    backdrop-filter: blur(7px);
    display: flex; align-items: center; justify-content: center;
    padding: 20px;
    animation: ovFade .22s ease both;
  }
  @keyframes ovFade { from { opacity: 0; } to { opacity: 1; } }

  /* ── CARD ── */
  .np-card {
    background: #fff;
    border-radius: 22px;
    width: 100%; max-width: 530px;
    box-shadow: 0 28px 72px rgba(5, 20, 10, 0.32);
    border: 1px solid var(--border);
    overflow: hidden;
    animation: cardSlide .3s cubic-bezier(.22, .9, .36, 1) both;
  }
  @keyframes cardSlide {
    from { opacity: 0; transform: translateY(30px) scale(.97); }
    to   { opacity: 1; transform: translateY(0)   scale(1); }
  }

  /* ── HEADER ── */
  .np-header {
    display: flex; align-items: center; gap: 14px;
    padding: 20px 24px 18px;
    background: linear-gradient(135deg, #0d3a1c 0%, #1b6530 100%);
  }
  .np-header-ico {
    width: 46px; height: 46px; border-radius: 13px; flex-shrink: 0;
    background: rgba(61, 204, 102, 0.18);
    border: 1px solid rgba(61, 204, 102, 0.32);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .np-header-title {
    font-family: 'DM Serif Display', serif;
    font-size: 19px; color: #fff; line-height: 1.2;
  }
  .np-header-sub {
    font-size: 12px; color: rgba(255,255,255,.56); margin-top: 3px;
  }
  .np-close {
    margin-left: auto; width: 32px; height: 32px; border-radius: 50%;
    background: rgba(255,255,255,.1); border: none;
    color: rgba(255,255,255,.7); font-size: 17px;
    cursor: pointer; display: flex; align-items: center;
    justify-content: center; transition: all .2s; flex-shrink: 0;
    font-family: 'DM Sans', sans-serif;
  }
  .np-close:hover { background: rgba(255,255,255,.22); color: #fff; }

  /* ── BODY ── */
  .np-body { padding: 22px 24px 18px; }

  /* ── FIELD ── */
  .np-field { margin-bottom: 18px; }
  .np-label {
    display: flex; align-items: center; gap: 6px;
    font-size: 12.5px; font-weight: 600; color: var(--text-mid);
    margin-bottom: 7px;
  }
  .np-label-req { color: #e53935; font-size: 13px; }

  /* ── INPUT WRAP ── */
  .np-input-wrap {
    display: flex; align-items: center;
    border: 1.5px solid #d4e6d9; border-radius: 11px;
    background: #fff; overflow: hidden;
    transition: border-color .2s, box-shadow .2s;
  }
  .np-input-wrap:focus-within {
    border-color: var(--green-bright);
    box-shadow: 0 0 0 3px rgba(37,160,69,.10);
  }
  .np-input-wrap.error { border-color: #e53935; }

  .np-input {
    flex: 1; border: none; outline: none;
    padding: 11px 14px; font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-dark); background: transparent;
  }
  .np-input::placeholder { color: #b4c8b8; }

  /* ── MIC BUTTON (inline) ── */
  .np-mic {
    width: 42px; height: 42px; border: none;
    border-left: 1px solid #e8f0eb;
    background: transparent; cursor: pointer;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; transition: background .2s; flex-shrink: 0;
    border-radius: 0 9px 9px 0;
  }
  .np-mic:hover { background: #f0faf2; }
  .np-mic.listening { background: #fff0f0; animation: micPulse 1s infinite; }
  @keyframes micPulse {
    0%,100% { background: #fff0f0; }
    50%      { background: #ffe0e0; }
  }

  /* ── VOICE HINT ── */
  .np-voice-hint {
    display: flex; align-items: center; gap: 5px;
    font-size: 11px; color: var(--text-muted); margin-top: 5px;
  }

  /* ── GENDER PILLS ── */
  .np-pills { display: flex; gap: 8px; flex-wrap: wrap; }
  .np-pill {
    padding: 7px 16px; border-radius: 50px;
    border: 1.5px solid #d4e6d9;
    font-size: 12.5px; font-weight: 600; color: var(--text-mid);
    cursor: pointer; transition: all .18s;
    background: #fff; font-family: 'DM Sans', sans-serif;
  }
  .np-pill:hover { border-color: var(--green-bright); color: var(--green-mid); }
  .np-pill.selected {
    background: var(--green-pale);
    border-color: var(--green-bright);
    color: var(--green-mid);
  }

  /* ── TEXTAREA WRAP ── */
  .np-textarea-wrap {
    border: 1.5px solid #d4e6d9; border-radius: 11px;
    background: #fff; overflow: hidden;
    transition: border-color .2s, box-shadow .2s;
  }
  .np-textarea-wrap:focus-within {
    border-color: var(--green-bright);
    box-shadow: 0 0 0 3px rgba(37,160,69,.10);
  }
  .np-textarea-wrap.error { border-color: #e53935; }

  .np-textarea {
    width: 100%; border: none; outline: none;
    padding: 11px 14px; font-size: 13.5px;
    font-family: 'DM Sans', sans-serif;
    color: var(--text-dark); background: transparent;
    resize: none; min-height: 88px; line-height: 1.55; display: block;
  }
  .np-textarea::placeholder { color: #b4c8b8; }

  .np-textarea-footer {
    display: flex; align-items: center; justify-content: space-between;
    padding: 8px 12px; border-top: 1px solid #edf3ef; background: #fafcfa;
  }

  /* ── WAVE DOTS ── */
  .np-voice-dots { display: flex; gap: 3px; align-items: center; height: 18px; }
  .np-voice-dots span {
    width: 3px; background: var(--green-bright); border-radius: 2px;
    animation: waveDot 1s ease infinite;
  }
  .np-voice-dots span:nth-child(1) { animation-delay: 0s;    height: 5px; }
  .np-voice-dots span:nth-child(2) { animation-delay: .15s;  height: 11px; }
  .np-voice-dots span:nth-child(3) { animation-delay: .30s;  height: 17px; }
  .np-voice-dots span:nth-child(4) { animation-delay: .45s;  height: 11px; }
  .np-voice-dots span:nth-child(5) { animation-delay: .60s;  height: 5px; }
  @keyframes waveDot {
    0%,100% { opacity: .3; }
    50%      { opacity: 1; }
  }

  /* ── BIG MIC BUTTON ── */
  .np-mic-big {
    display: flex; align-items: center; gap: 6px;
    padding: 6px 14px 6px 10px; border-radius: 50px;
    background: var(--green-pale);
    border: 1.5px solid rgba(37,160,69,.22);
    color: var(--green-mid); font-size: 12px; font-weight: 600;
    cursor: pointer; transition: all .2s;
    font-family: 'DM Sans', sans-serif;
  }
  .np-mic-big:hover { background: #d6f0dc; border-color: var(--green-bright); }
  .np-mic-big.active {
    background: #fff0f0; border-color: #ef5350; color: #c62828;
  }

  /* ── ERROR TEXT ── */
  .np-error-text {
    font-size: 11.5px; color: #e53935; margin-top: 5px;
    display: flex; align-items: center; gap: 4px;
  }

  /* ── FOOTER ── */
  .np-footer {
    padding: 14px 24px 22px; border-top: 1px solid #edf3ef;
    display: flex; gap: 12px; align-items: center;
  }
  .np-cancel {
    flex: 1; padding: 11px; border-radius: 10px;
    border: 1.5px solid #ddeae0; background: #fff;
    font-size: 13.5px; font-weight: 600; color: var(--text-mid);
    cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .2s;
  }
  .np-cancel:hover { background: #f4faf5; border-color: var(--green-bright); color: var(--green-mid); }

  .np-submit {
    flex: 2; padding: 11px; border-radius: 10px; border: none;
    background: linear-gradient(135deg, var(--green-mid), var(--green-bright));
    color: #fff; font-size: 13.5px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 16px rgba(27,101,48,.3); transition: all .22s;
  }
  .np-submit:hover { transform: translateY(-1px); box-shadow: 0 8px 24px rgba(27,101,48,.42); }
  .np-submit:active { transform: translateY(0); }
  .np-submit:disabled { opacity: .55; cursor: not-allowed; transform: none; box-shadow: none; }

  /* ── SUCCESS VIEW ── */
  .np-success {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; padding: 52px 28px 44px; text-align: center;
    animation: cardSlide .3s ease both;
  }
  .np-success-ring {
    width: 84px; height: 84px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-mid), var(--green-glow));
    display: flex; align-items: center; justify-content: center;
    font-size: 38px; margin-bottom: 22px;
    box-shadow: 0 8px 32px rgba(27,101,48,.32);
    animation: popIn .45s cubic-bezier(.22,.9,.36,1) both;
  }
  @keyframes popIn {
    from { transform: scale(.5); opacity: 0; }
    to   { transform: scale(1);  opacity: 1; }
  }
  .np-success-title {
    font-family: 'DM Serif Display', serif;
    font-size: 24px; color: var(--text-dark); margin-bottom: 10px;
  }
  .np-success-sub {
    font-size: 14px; color: var(--text-muted);
    line-height: 1.6; max-width: 310px;
  }
  .np-success-meta {
    margin-top: 18px; padding: 14px 20px;
    background: var(--green-pale); border-radius: 12px;
    border: 1px solid rgba(37,160,69,.18);
    font-size: 13px; color: var(--text-mid);
    display: flex; flex-direction: column; gap: 6px; width: 100%; max-width: 320px;
  }
  .np-success-meta-row { display: flex; justify-content: space-between; }
  .np-success-meta-key { color: var(--text-muted); font-weight: 500; }
  .np-success-meta-val { font-weight: 600; color: var(--text-dark); }
  .np-success-btn {
    margin-top: 28px; padding: 13px 36px; border: none; border-radius: 50px;
    background: linear-gradient(135deg, var(--green-mid), var(--green-bright));
    color: #fff; font-size: 14px; font-weight: 700;
    cursor: pointer; font-family: 'DM Sans', sans-serif;
    box-shadow: 0 4px 18px rgba(27,101,48,.32); transition: all .22s;
  }
  .np-success-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 28px rgba(27,101,48,.44); }
`;

// ─── WEB SPEECH HOOK ───────────────────────────────────────────────────
function useSpeech() {
  const SpeechRecognition =
    typeof window !== "undefined" &&
    (window.SpeechRecognition || window.webkitSpeechRecognition);

  const recogRef = useRef(null);
  const [activeField, setActiveField] = useState(null);

  function stop() {
    if (recogRef.current) {
      try { recogRef.current.stop(); } catch (_) {}
      recogRef.current = null;
    }
    setActiveField(null);
  }

  function start(fieldKey, onTranscript) {
    if (!SpeechRecognition) {
      alert("Voice input needs Chrome or Edge browser with microphone access.");
      return;
    }
    if (activeField === fieldKey) { stop(); return; }
    stop();

    const recog = new SpeechRecognition();
    recog.lang = "hi-IN";
    recog.interimResults = true;
    recog.continuous = false;
    recogRef.current = recog;
    setActiveField(fieldKey);

    recog.onresult = (e) => {
      let interim = "", final = "";
      for (let i = e.resultIndex; i < e.results.length; i++) {
        if (e.results[i].isFinal) final += e.results[i][0].transcript;
        else interim += e.results[i][0].transcript;
      }
      onTranscript(final || interim, !!final);
    };
    recog.onerror = () => stop();
    recog.onend   = () => { recogRef.current = null; setActiveField(null); };

    try { recog.start(); } catch (_) { stop(); }
  }

  return { activeField, start, stop };
}

// ─── MAIN COMPONENT ────────────────────────────────────────────────────
export default function NewPatientCard({ onClose, onSuccess }) {
  const navigate = useNavigate();
  const [view, setView]       = useState("form"); // "form" | "success"
  const [gender, setGender]   = useState("");
  const [errors, setErrors]   = useState({});
  const [form, setForm]       = useState({
    name: "", phone: "", age: "", symptoms: "",
  });

  const { activeField, start, stop } = useSpeech();

  // Close on Escape
  useEffect(() => {
    const handler = (e) => { if (e.key === "Escape") handleClose(); };
    document.addEventListener("keydown", handler);
    return () => document.removeEventListener("keydown", handler);
  }, []);

  function setField(key, val) {
    setForm((f) => ({ ...f, [key]: val }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  }

  function handleClose() {
  if (onClose) onClose();
}

  function validate() {
    const e = {};
    if (!form.name.trim())                    e.name     = "Patient name is required";
    if (!/^\d{10}$/.test(form.phone.trim()))  e.phone    = "Enter a valid 10-digit number";
    if (!form.symptoms.trim())                e.symptoms = "Please describe the symptoms";
    setErrors(e);
    return Object.keys(e).length === 0;
  }

  function handleSubmit() {
    if (!validate()) return;
    stop();
    setView("success");
    if (onSuccess) onSuccess({ ...form, gender });
  }

  // ── VOICE HELPERS ──
  function voiceName() {
    start("name", (txt) => setField("name", txt));
  }
  function voicePhone() {
    start("phone", (txt) => {
      const digits = txt.replace(/\D/g, "").slice(0, 10);
      setField("phone", digits);
    });
  }
  function voiceAge() {
    start("age", (txt) => {
      const num = txt.match(/\d+/);
      if (num) setField("age", num[0]);
    });
  }
  function voiceSymptoms() {
    start("symptoms", (txt) => setField("symptoms", txt));
  }

  // const [showModal, setShowModal] = useState(false);

  const micLabel = (field) => (activeField === field ? "⏹️" : "🎙️");
  const micClass = (field) => `np-mic${activeField === field ? " listening" : ""}`;

  return (
    <> 
      <style>{styles}</style>
      <div className="np-overlay" onClick={(e) => { if (e.target === e.currentTarget) handleClose(); }}>
        <div className="np-card">

          {/* ── FORM VIEW ── */}
          {view === "form" && (
            <>
              {/* Header */}
              <div className="np-header">
                <div className="np-header-ico">➕</div>
                <div>
                  <div className="np-header-title">Register New Patient</div>
                  <div className="np-header-sub">Fill in details or use voice input 🎙️</div>
                </div>
                {/* <button className="np-close" onClick={handleClose}>✕</button> */}

                <button
                  onClick={handleClose}
                  style={{
                    position: "absolute",
                    top: "15px",
                    right: "15px",
                    width: "36px",
                    height: "36px",
                    border: "none",
                    borderRadius: "50%",
                    background: "#f1f5f2",
                    fontSize: "18px",
                    fontWeight: "bold",
                    color: "#1b6530",
                    display: "flex",
                    alignItems: "center",
                    justifyContent: "center",
                    cursor: "pointer",
                  }}
                >
                  ✖
                </button>
                </div>

              {/* Body */}
              <div className="np-body">

                {/* NAME */}
                <div className="np-field">
                  <label className="np-label">
                    👤 Patient Name <span className="np-label-req">*</span>
                  </label>
                  <div className={`np-input-wrap${errors.name ? " error" : ""}`}>
                    <input
                      className="np-input"
                      value={form.name}
                      onChange={(e) => setField("name", e.target.value)}
                      placeholder="e.g. Anita Devi"
                      autoComplete="off"
                    />
                    <button className={micClass("name")} onClick={voiceName} title="Speak name">
                      {micLabel("name")}
                    </button>
                  </div>
                  {errors.name
                    ? <div className="np-error-text">⚠️ {errors.name}</div>
                    : <div className="np-voice-hint">🎤 Tap mic and say the patient's full name</div>
                  }
                </div>

                {/* PHONE */}
                <div className="np-field">
                  <label className="np-label">
                    📱 Phone Number <span className="np-label-req">*</span>
                  </label>
                  <div className={`np-input-wrap${errors.phone ? " error" : ""}`}>
                    <input
                      className="np-input"
                      value={form.phone}
                      onChange={(e) => setField("phone", e.target.value.replace(/\D/g,"").slice(0,10))}
                      placeholder="10-digit mobile number"
                      type="tel"
                      maxLength={10}
                      autoComplete="off"
                    />
                    <button className={micClass("phone")} onClick={voicePhone} title="Speak phone number">
                      {micLabel("phone")}
                    </button>
                  </div>
                  {errors.phone
                    ? <div className="np-error-text">⚠️ {errors.phone}</div>
                    : <div className="np-voice-hint">🎤 Say digits clearly, e.g. "9876543210"</div>
                  }
                </div>

                {/* AGE + GENDER */}
                <div style={{ display: "grid", gridTemplateColumns: "1fr 1.7fr", gap: 14, marginBottom: 18 }}>
                  <div className="np-field" style={{ marginBottom: 0 }}>
                    <label className="np-label">🎂 Age</label>
                    <div className="np-input-wrap">
                      <input
                        className="np-input"
                        value={form.age}
                        onChange={(e) => setField("age", e.target.value)}
                        placeholder="Years"
                        type="number"
                        min={1}
                        max={120}
                      />
                      <button className={micClass("age")} onClick={voiceAge} title="Speak age">
                        {micLabel("age")}
                      </button>
                    </div>
                  </div>
                  <div className="np-field" style={{ marginBottom: 0 }}>
                    <label className="np-label">⚧ Gender</label>
                    <div className="np-pills">
                      {["Female", "Male", "Other"].map((g) => (
                        <button
                          key={g}
                          className={`np-pill${gender === g ? " selected" : ""}`}
                          onClick={() => setGender(g)}
                        >
                          {g}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>

                {/* SYMPTOMS */}
                <div className="np-field" style={{ marginBottom: 4 }}>
                  <label className="np-label">
                    🩺 Symptoms / Complaints <span className="np-label-req">*</span>
                  </label>
                  <div className={`np-textarea-wrap${errors.symptoms ? " error" : ""}`}>
                    <textarea
                      className="np-textarea"
                      value={form.symptoms}
                      onChange={(e) => setField("symptoms", e.target.value)}
                      placeholder="Describe symptoms… e.g. headache, fever since 2 days, weakness, dizziness"
                    />
                    <div className="np-textarea-footer">
                      <div style={{ display: "flex", alignItems: "center", gap: 8, flex: 1 }}>
                        {activeField === "symptoms" ? (
                          <>
                            <div className="np-voice-dots">
                              <span /><span /><span /><span /><span />
                            </div>
                            <span style={{ fontSize: 11.5, color: "var(--green-mid)", fontWeight: 600 }}>
                              Listening…
                            </span>
                          </>
                        ) : (
                          <span style={{ fontSize: 11.5, color: "var(--text-muted)" }}>
                            Tap mic to speak symptoms in Hindi or English
                          </span>
                        )}
                      </div>
                      <button
                        className={`np-mic-big${activeField === "symptoms" ? " active" : ""}`}
                        onClick={voiceSymptoms}
                      >
                        <span style={{ fontSize: 14 }}>
                          {activeField === "symptoms" ? "⏹️" : "🎙️"}
                        </span>
                        {activeField === "symptoms" ? "Stop" : "Speak"}
                      </button>
                    </div>
                  </div>
                  {errors.symptoms && (
                    <div className="np-error-text">⚠️ {errors.symptoms}</div>
                  )}
                </div>

              </div>

              {/* Footer */}
              <div className="np-footer">
                <button className="np-cancel" onClick={handleClose}>Cancel</button>
                <button className="np-submit" onClick={handleSubmit}>
                  Register Patient →
                </button>
              </div>
            </>
          )}

          {/* ── SUCCESS VIEW ── */}
          {view === "success" && (
            <div className="np-success">
              <div className="np-success-ring">✅</div>
              <div className="np-success-title">{form.name} Registered!</div>
              <div className="np-success-sub">
                Patient has been added to your roster successfully. You can now start their health record.
              </div>

              {/* Summary card */}
              <div className="np-success-meta">
                <div className="np-success-meta-row">
                  <span className="np-success-meta-key">Name</span>
                  <span className="np-success-meta-val">{form.name}</span>
                </div>
                <div className="np-success-meta-row">
                  <span className="np-success-meta-key">Phone</span>
                  <span className="np-success-meta-val">{form.phone}</span>
                </div>
                {form.age && (
                  <div className="np-success-meta-row">
                    <span className="np-success-meta-key">Age</span>
                    <span className="np-success-meta-val">{form.age} yrs</span>
                  </div>
                )}
                {gender && (
                  <div className="np-success-meta-row">
                    <span className="np-success-meta-key">Gender</span>
                    <span className="np-success-meta-val">{gender}</span>
                  </div>
                )}
                <div className="np-success-meta-row" style={{ alignItems: "flex-start" }}>
                  <span className="np-success-meta-key">Symptoms</span>
                  <span className="np-success-meta-val" style={{ maxWidth: 190, textAlign: "right", lineHeight: 1.4 }}>
                    {form.symptoms}
                  </span>
                </div>
              </div>
              <button
                className="np-success-btn"
                onClick={() => navigate("/dashboard")}
              >
                Dashboard →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}



// import React, { useState, useEffect, useRef } from "react";
// import { useNavigate } from "react-router-dom";

// /* ───────────── STYLES ───────────── */
// const styles = `
// @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display&family=DM+Sans:wght@300;400;500;600;700&display=swap');

// *{box-sizing:border-box;margin:0;padding:0}
// body{font-family:'DM Sans',sans-serif;background:#f0f5f1}

// :root{
//   --green-mid:#1b6530;
//   --green-bright:#25a045;
//   --green-pale:#e8f5ec;
//   --border:rgba(30,100,50,0.14);
//   --text-dark:#0f1e13;
//   --text-muted:#7a9e82;
// }

// /* CARD */
// .card{
//   max-width:520px;
//   margin:60px auto;
//   background:#fff;
//   border-radius:18px;
//   overflow:hidden;
//   box-shadow:0 20px 60px rgba(0,0,0,0.15);
// }

// /* HEADER */
// .header{
//   display:flex;
//   align-items:center;
//   padding:20px;
//   background:linear-gradient(135deg,#0d3a1c,#1b6530);
//   color:white;
// }

// .close{
//   margin-left:auto;
//   background:white;
//   border:none;
//   border-radius:50%;
//   width:30px;
//   height:30px;
//   cursor:pointer;
// }

// /* BODY */
// .body{padding:20px}

// .field{margin-bottom:15px}

// .label{font-size:13px;font-weight:600;margin-bottom:5px}

// .input{
//   width:100%;
//   padding:10px;
//   border:1px solid #ddd;
//   border-radius:8px;
// }

// /* BUTTONS */
// .footer{
//   display:flex;
//   gap:10px;
//   padding:15px;
// }

// .cancel{
//   flex:1;
//   padding:10px;
//   border:1px solid #ddd;
//   border-radius:8px;
//   cursor:pointer;
// }

// .submit{
//   flex:2;
//   padding:10px;
//   border:none;
//   border-radius:8px;
//   background:linear-gradient(135deg,var(--green-mid),var(--green-bright));
//   color:white;
//   font-weight:bold;
//   cursor:pointer;
// }
// `;

// /* ───────────── COMPONENT ───────────── */
// export default function NewPatientCard() {
//   const navigate = useNavigate();

//   const [form, setForm] = useState({
//     name: "",
//     phone: "",
//     age: "",
//     symptoms: "",
//   });

//   const [gender, setGender] = useState("");
//   const [errors, setErrors] = useState({});

//   function setF(key, val) {
//     setForm((prev) => ({ ...prev, [key]: val }));
//   }

//   function validate() {
//     let err = {};

//     if (!form.name.trim()) err.name = "Name required";
//     if (!/^\d{10}$/.test(form.phone)) err.phone = "Invalid phone";
//     if (!form.symptoms.trim()) err.symptoms = "Enter symptoms";

//     setErrors(err);
//     return Object.keys(err).length === 0;
//   }

//   function handleSubmit() {
//     if (!validate()) return;

//     console.log("Patient:", { ...form, gender });

//     // redirect after submit
//     navigate("/");
//   }

//   return (
//     <>
//       <style>{styles}</style>

//       <div className="card">

//         {/* HEADER */}
//         <div className="header">
//           <h3>Register Patient</h3>
//           <button className="close" onClick={() => navigate("/")}>✕</button>
//         </div>

//         {/* FORM */}
//         <form onSubmit={(e) => { e.preventDefault(); handleSubmit(); }}>
//           <div className="body">

//             {/* NAME */}
//             <div className="field">
//               <div className="label">Name *</div>
//               <input
//                 className="input"
//                 value={form.name}
//                 onChange={(e) => setF("name", e.target.value)}
//               />
//               {errors.name && <p>{errors.name}</p>}
//             </div>

//             {/* PHONE */}
//             <div className="field">
//               <div className="label">Phone *</div>
//               <input
//                 className="input"
//                 value={form.phone}
//                 onChange={(e) =>
//                   setF("phone", e.target.value.replace(/\D/g, "").slice(0, 10))
//                 }
//               />
//               {errors.phone && <p>{errors.phone}</p>}
//             </div>

//             {/* AGE */}
//             <div className="field">
//               <div className="label">Age</div>
//               <input
//                 className="input"
//                 value={form.age}
//                 onChange={(e) => setF("age", e.target.value)}
//               />
//             </div>

//             {/* GENDER */}
//             <div className="field">
//               <div className="label">Gender</div>
//               <select
//                 className="input"
//                 value={gender}
//                 onChange={(e) => setGender(e.target.value)}
//               >
//                 <option value="">Select</option>
//                 <option>Female</option>
//                 <option>Male</option>
//                 <option>Other</option>
//               </select>
//             </div>

//             {/* SYMPTOMS */}
//             <div className="field">
//               <div className="label">Symptoms *</div>
//               <textarea
//                 className="input"
//                 value={form.symptoms}
//                 onChange={(e) => setF("symptoms", e.target.value)}
//               />
//               {errors.symptoms && <p>{errors.symptoms}</p>}
//             </div>

//           </div>

//           {/* FOOTER */}
//           <div className="footer">
//             <button type="button" className="cancel" onClick={() => navigate("/")}>
//               Cancel
//             </button>

//             <button type="submit" className="submit">
//               Submit →
//             </button>
//           </div>
//         </form>
//       </div>
//     </>
//   );
// }




// import { useState, useRef } from "react";

// const initialForm = {
//   name: "",
//   phone: "",
//   age: "",
//   gender: "",
//   symptoms: "",
// };

// function NewPatientModal({ onClose, onSubmit }) {
//   const [form, setForm] = useState(initialForm);
//   const [errors, setErrors] = useState({});
//   const [loading, setLoading] = useState(false);
//   const [listening, setListening] = useState(null); // field name currently being listened to
//   const recognitionRef = useRef(null);

//   const startVoice = (field) => {
//     if (!("webkitSpeechRecognition" in window || "SpeechRecognition" in window)) {
//       alert("Voice input not supported in this browser.");
//       return;
//     }
//     const SR = window.SpeechRecognition || window.webkitSpeechRecognition;
//     const recog = new SR();
//     recog.lang = field === "symptoms" ? "hi-IN" : "en-IN";
//     recog.interimResults = false;
//     recog.maxAlternatives = 1;
//     recog.onstart = () => setListening(field);
//     recog.onresult = (e) => {
//       const transcript = e.results[0][0].transcript;
//       setForm((f) => ({ ...f, [field]: transcript }));
//       setListening(null);
//     };
//     recog.onerror = () => setListening(null);
//     recog.onend = () => setListening(null);
//     recognitionRef.current = recog;
//     recog.start();
//   };

//   const validate = () => {
//     const e = {};
//     if (!form.name.trim()) e.name = "Patient name is required";
//     if (!/^\d{10}$/.test(form.phone)) e.phone = "Enter a valid 10-digit number";
//     if (!form.symptoms.trim()) e.symptoms = "Please describe symptoms";
//     return e;
//   };

//   const handleSubmit = () => {
//     const e = validate();
//     if (Object.keys(e).length) { setErrors(e); return; }
//     setLoading(true);
//     setTimeout(() => {
//       setLoading(false);
//       onSubmit(form);
//     }, 1800);
//   };

//   return (
//     <div style={overlay}>
//       <div style={modal}>
//         {/* Header */}
//         <div style={modalHeader}>
//           <div style={headerLeft}>
//             <div style={plusIcon}>＋</div>
//             <div>
//               <div style={{ fontSize: 18, fontWeight: 700, color: "#fff" }}>Register New Patient</div>
//               <div style={{ fontSize: 12.5, color: "#b6e8c8", marginTop: 2 }}>Fill details or use voice input 🎙️</div>
//             </div>
//           </div>
//           <button onClick={onClose} style={closeBtn}>✕</button>
//         </div>

//         {/* Body */}
//         <div style={modalBody}>
//           {/* Name */}
//           <Field label="Patient Name" required error={errors.name}>
//             <InputRow
//               placeholder="e.g. Anita Devi"
//               value={form.name}
//               onChange={(v) => { setForm((f) => ({ ...f, name: v })); setErrors((e) => ({ ...e, name: "" })); }}
//               listening={listening === "name"}
//               onMic={() => startVoice("name")}
//             />
//             <Hint>🎙️ Tap mic and say the patient's full name</Hint>
//           </Field>

//           {/* Phone */}
//           <Field label="Phone Number" required error={errors.phone}>
//             <InputRow
//               placeholder="10-digit mobile number"
//               value={form.phone}
//               onChange={(v) => { setForm((f) => ({ ...f, phone: v })); setErrors((e) => ({ ...e, phone: "" })); }}
//               listening={listening === "phone"}
//               onMic={() => startVoice("phone")}
//               type="tel"
//               maxLength={10}
//             />
//             <Hint>🎙️ Say digits clearly</Hint>
//           </Field>

//           {/* Age + Gender row */}
//           <div style={{ display: "flex", gap: 18, alignItems: "flex-start" }}>
//             <div style={{ flex: 1 }}>
//               <Field label="Age">
//                 <div style={{ position: "relative" }}>
//                   <input
//                     type="number"
//                     placeholder="Years"
//                     value={form.age}
//                     onChange={(e) => setForm((f) => ({ ...f, age: e.target.value }))}
//                     style={{ ...inputBase, paddingRight: 38, width: "100%", boxSizing: "border-box" }}
//                   />
//                   <MicBtn active={listening === "age"} onClick={() => startVoice("age")} />
//                 </div>
//               </Field>
//             </div>
//             <div style={{ flex: 2 }}>
//               <Field label="Gender">
//                 <div style={{ display: "flex", gap: 8, flexWrap: "wrap" }}>
//                   {["Female", "Male", "Other"].map((g) => (
//                     <button
//                       key={g}
//                       onClick={() => setForm((f) => ({ ...f, gender: g }))}
//                       style={{
//                         ...genderBtn,
//                         background: form.gender === g ? "#1a6e3c" : "#fff",
//                         color: form.gender === g ? "#fff" : "#333",
//                         borderColor: form.gender === g ? "#1a6e3c" : "#ddd",
//                       }}
//                     >
//                       {g}
//                     </button>
//                   ))}
//                 </div>
//               </Field>
//             </div>
//           </div>

//           {/* Symptoms */}
//           <Field label="Symptoms" required error={errors.symptoms}>
//             <div style={symptomsBox}>
//               <textarea
//                 placeholder="Describe symptoms… e.g. headache, fever since 2 days, weakness"
//                 value={form.symptoms}
//                 onChange={(e) => { setForm((f) => ({ ...f, symptoms: e.target.value })); setErrors((er) => ({ ...er, symptoms: "" })); }}
//                 style={symptomsInput}
//                 rows={4}
//               />
//               <div style={symptomsFooter}>
//                 <span style={{ fontSize: 12, color: "#888" }}>Speak in Hindi or English</span>
//                 <button
//                   onClick={() => startVoice("symptoms")}
//                   style={{
//                     ...speakBtn,
//                     background: listening === "symptoms" ? "#1a6e3c" : "#e8f5ee",
//                     color: listening === "symptoms" ? "#fff" : "#1a6e3c",
//                   }}
//                 >
//                   🎙️ {listening === "symptoms" ? "Listening…" : "Speak"}
//                 </button>
//               </div>
//             </div>
//           </Field>
//         </div>

//         {/* Footer */}
//         <div style={modalFooter}>
//           <button onClick={onClose} style={cancelBtn}>Cancel</button>
//           <button onClick={handleSubmit} style={submitBtn} disabled={loading}>
//             {loading ? (
//               <span style={{ display: "flex", alignItems: "center", gap: 8 }}>
//                 <span style={spinner} /> Running AI Triage…
//               </span>
//             ) : "Run AI Triage →"}
//           </button>
//         </div>
//       </div>
//     </div>
//   );
// }

// // ─── Triage Result Page ────────────────────────────────────────────────────────
// function TriageResultPage({ patient, onBack }) {
//   const risk = patient.symptoms.toLowerCase().includes("bp") || patient.symptoms.toLowerCase().includes("fever") ? "High" : "Medium";
//   const riskColor = risk === "High" ? "#e53e3e" : "#d69e2e";
//   const riskBg = risk === "High" ? "#fff5f5" : "#fffff0";

//   const recommendations = risk === "High"
//     ? ["Refer to PHC immediately", "Monitor BP every 2 hours", "Keep patient hydrated", "Inform supervisor"]
//     : ["Schedule follow-up within 3 days", "Advise rest and oral fluids", "Monitor temperature twice daily"];

//   return (
//     <div style={{ minHeight: "100vh", background: "#f0f7f3", fontFamily: "'DM Sans', sans-serif", padding: "0 0 40px" }}>
//       {/* Top bar */}
//       <div style={{ background: "#1a6e3c", padding: "16px 24px", display: "flex", alignItems: "center", gap: 12 }}>
//         <button onClick={onBack} style={{ background: "rgba(255,255,255,0.15)", border: "none", color: "#fff", borderRadius: 8, padding: "6px 14px", cursor: "pointer", fontSize: 14 }}>
//           ← Back
//         </button>
//         <span style={{ color: "#fff", fontWeight: 700, fontSize: 17 }}>AI Triage Result</span>
//       </div>

//       <div style={{ maxWidth: 560, margin: "28px auto", padding: "0 16px", display: "flex", flexDirection: "column", gap: 16 }}>

//         {/* Patient Card */}
//         <div style={card}>
//           <div style={{ display: "flex", justifyContent: "space-between", alignItems: "flex-start" }}>
//             <div>
//               <div style={{ fontSize: 13, color: "#888", marginBottom: 2 }}>Patient Registered</div>
//               <div style={{ fontSize: 20, fontWeight: 700, color: "#1a1a1a" }}>{patient.name || "Unknown"}</div>
//               <div style={{ fontSize: 13, color: "#555", marginTop: 4 }}>
//                 {patient.age ? `${patient.age} yrs` : "Age N/A"} &nbsp;·&nbsp; {patient.gender || "Gender N/A"} &nbsp;·&nbsp; {patient.phone}
//               </div>
//             </div>
//             <div style={{ background: "#e8f5ee", borderRadius: 10, padding: "6px 14px", fontSize: 12, fontWeight: 600, color: "#1a6e3c" }}>
//               ✓ Registered
//             </div>
//           </div>
//         </div>

//         {/* Risk Badge */}
//         <div style={{ ...card, background: riskBg, border: `1.5px solid ${riskColor}33` }}>
//           <div style={{ display: "flex", align: "center", gap: 12, alignItems: "center" }}>
//             <div style={{ width: 44, height: 44, borderRadius: "50%", background: riskColor, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 22, flexShrink: 0 }}>
//               {risk === "High" ? "⚠️" : "🔔"}
//             </div>
//             <div>
//               <div style={{ fontSize: 13, color: "#888" }}>AI Risk Assessment</div>
//               <div style={{ fontSize: 18, fontWeight: 700, color: riskColor }}>{risk} Priority</div>
//               <div style={{ fontSize: 12.5, color: "#666", marginTop: 2 }}>Based on reported symptoms</div>
//             </div>
//           </div>
//         </div>

//         {/* Symptoms Summary */}
//         <div style={card}>
//           <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 8 }}>🩺 Reported Symptoms</div>
//           <div style={{ fontSize: 14, color: "#333", lineHeight: 1.6, background: "#f7faf8", borderRadius: 8, padding: "10px 14px" }}>
//             {patient.symptoms}
//           </div>
//         </div>

//         {/* Recommendations */}
//         <div style={card}>
//           <div style={{ fontSize: 13, fontWeight: 600, color: "#555", marginBottom: 10 }}>📋 ASHA Recommendations</div>
//           {recommendations.map((r, i) => (
//             <div key={i} style={{ display: "flex", gap: 10, alignItems: "flex-start", marginBottom: 8 }}>
//               <div style={{ width: 22, height: 22, borderRadius: "50%", background: "#1a6e3c", color: "#fff", fontSize: 11, fontWeight: 700, display: "flex", alignItems: "center", justifyContent: "center", flexShrink: 0, marginTop: 1 }}>
//                 {i + 1}
//               </div>
//               <span style={{ fontSize: 14, color: "#333", lineHeight: 1.5 }}>{r}</span>
//             </div>
//           ))}
//         </div>

//         {/* Actions */}
//         <div style={{ display: "flex", gap: 12 }}>
//           <button style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "1.5px solid #1a6e3c", background: "#fff", color: "#1a6e3c", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
//             📤 Share Report
//           </button>
//           <button style={{ flex: 1, padding: "13px 0", borderRadius: 12, border: "none", background: "#1a6e3c", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
//             📅 Schedule Visit
//           </button>
//         </div>

//         <button onClick={onBack} style={{ padding: "13px 0", borderRadius: 12, border: "none", background: "#2d8653", color: "#fff", fontWeight: 600, fontSize: 14, cursor: "pointer" }}>
//           ← Return to Dashboard
//         </button>
//       </div>
//     </div>
//   );
// }

// // ─── Helper components ─────────────────────────────────────────────────────────
// function Field({ label, required, error, children }) {
//   return (
//     <div style={{ marginBottom: 18 }}>
//       <label style={{ fontSize: 14, fontWeight: 600, color: "#1a1a1a", display: "block", marginBottom: 6 }}>
//         {label} {required && <span style={{ color: "#e53e3e" }}>*</span>}
//       </label>
//       {children}
//       {error && <div style={{ color: "#e53e3e", fontSize: 12, marginTop: 4 }}>{error}</div>}
//     </div>
//   );
// }

// function InputRow({ value, onChange, placeholder, listening, onMic, type = "text", maxLength }) {
//   return (
//     <div style={{ position: "relative" }}>
//       <input
//         type={type}
//         placeholder={placeholder}
//         value={value}
//         onChange={(e) => onChange(e.target.value)}
//         maxLength={maxLength}
//         style={{ ...inputBase, paddingRight: 44, width: "100%", boxSizing: "border-box", borderColor: listening ? "#1a6e3c" : "#e2e8f0" }}
//       />
//       <MicBtn active={listening} onClick={onMic} />
//     </div>
//   );
// }

// function MicBtn({ active, onClick }) {
//   return (
//     <button
//       onClick={onClick}
//       style={{
//         position: "absolute", right: 10, top: "50%", transform: "translateY(-50%)",
//         background: active ? "#1a6e3c" : "#f0f0f0", border: "none", borderRadius: 6,
//         width: 28, height: 28, cursor: "pointer", fontSize: 14, display: "flex", alignItems: "center", justifyContent: "center",
//       }}
//     >
//       🎙️
//     </button>
//   );
// }

// function Hint({ children }) {
//   return <div style={{ fontSize: 12, color: "#94a3b8", marginTop: 4 }}>{children}</div>;
// }

// // ─── Styles ────────────────────────────────────────────────────────────────────
// const overlay = {
//   position: "fixed", inset: 0, background: "rgba(0,0,0,0.45)", backdropFilter: "blur(3px)",
//   display: "flex", alignItems: "center", justifyContent: "center", zIndex: 999, padding: 16,
// };
// const modal = {
//   background: "#fff", borderRadius: 20, width: "100%", maxWidth: 480,
//   boxShadow: "0 24px 64px rgba(0,0,0,0.18)", overflow: "hidden",
//   maxHeight: "92vh", display: "flex", flexDirection: "column",
// };
// const modalHeader = {
//   background: "linear-gradient(135deg, #1a6e3c, #2d8653)",
//   padding: "18px 20px", display: "flex", alignItems: "center", justifyContent: "space-between",
// };
// const headerLeft = { display: "flex", alignItems: "center", gap: 14 };
// const plusIcon = {
//   width: 42, height: 42, borderRadius: 12, background: "rgba(255,255,255,0.2)",
//   display: "flex", alignItems: "center", justifyContent: "center",
//   color: "#fff", fontSize: 22, fontWeight: 300,
// };
// const closeBtn = {
//   width: 32, height: 32, borderRadius: "50%", background: "rgba(255,255,255,0.15)",
//   border: "none", color: "#fff", cursor: "pointer", fontSize: 15,
//   display: "flex", alignItems: "center", justifyContent: "center",
// };
// const modalBody = { padding: "22px 20px", overflowY: "auto", flex: 1 };
// const modalFooter = {
//   padding: "14px 20px", borderTop: "1px solid #f0f0f0",
//   display: "flex", gap: 12,
// };
// const inputBase = {
//   width: "100%", padding: "11px 14px", borderRadius: 10,
//   border: "1.5px solid #e2e8f0", fontSize: 14, outline: "none",
//   fontFamily: "inherit", color: "#1a1a1a", background: "#fafafa",
// };
// const genderBtn = {
//   padding: "8px 16px", borderRadius: 20, border: "1.5px solid #ddd",
//   cursor: "pointer", fontSize: 13, fontWeight: 500, fontFamily: "inherit",
//   transition: "all 0.15s",
// };
// const symptomsBox = {
//   border: "1.5px solid #e2e8f0", borderRadius: 12, overflow: "hidden", background: "#fafafa",
// };
// const symptomsInput = {
//   width: "100%", padding: "12px 14px", border: "none", outline: "none",
//   fontSize: 14, fontFamily: "inherit", resize: "none", background: "transparent",
//   boxSizing: "border-box", color: "#1a1a1a",
// };
// const symptomsFooter = {
//   display: "flex", justifyContent: "space-between", alignItems: "center",
//   padding: "8px 12px", borderTop: "1px solid #f0f0f0",
// };
// const speakBtn = {
//   padding: "7px 16px", borderRadius: 20, border: "none", cursor: "pointer",
//   fontSize: 13, fontWeight: 600, fontFamily: "inherit",
// };
// const cancelBtn = {
//   flex: 1, padding: "13px 0", borderRadius: 12, border: "1.5px solid #ddd",
//   background: "#fff", color: "#555", fontWeight: 600, fontSize: 14,
//   cursor: "pointer", fontFamily: "inherit",
// };
// const submitBtn = {
//   flex: 2, padding: "13px 0", borderRadius: 12, border: "none",
//   background: "linear-gradient(135deg, #1a6e3c, #2d8653)", color: "#fff",
//   fontWeight: 700, fontSize: 14, cursor: "pointer", fontFamily: "inherit",
//   display: "flex", alignItems: "center", justifyContent: "center", gap: 8,
// };
// const spinner = {
//   width: 16, height: 16, border: "2px solid rgba(255,255,255,0.3)",
//   borderTop: "2px solid #fff", borderRadius: "50%",
//   animation: "spin 0.7s linear infinite", display: "inline-block",
// };
// const card = {
//   background: "#fff", borderRadius: 14, padding: "16px 18px",
//   boxShadow: "0 2px 12px rgba(0,0,0,0.06)",
// };

// // ─── Main export ───────────────────────────────────────────────────────────────
// export default function NewPatientCard() {
//   const [showModal, setShowModal] = useState(false);
//   const [triageResult, setTriageResult] = useState(null);

//   const handleSubmit = (formData) => {
//     setShowModal(false);
//     setTriageResult(formData);
//   };

//   if (triageResult) {
//     return <TriageResultPage patient={triageResult} onBack={() => setTriageResult(null)} />;
//   }

//   return (
//     <div style={{ fontFamily: "'DM Sans', sans-serif" }}>
//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=DM+Sans:wght@400;500;600;700&display=swap');
//         @keyframes spin { to { transform: rotate(360deg); } }
//         @keyframes fadeIn { from { opacity:0; transform:scale(0.96) translateY(10px); } to { opacity:1; transform:scale(1) translateY(0); } }
//       `}</style>

//       {/* Demo trigger button styled like the dashboard */}
//       <div style={{ padding: 24, background: "#f0f7f3", minHeight: "100vh", display: "flex", flexDirection: "column", alignItems: "flex-start", gap: 16 }}>
//         <div style={{ fontSize: 13, color: "#888" }}>GraamSehat › Dashboard</div>
//         <button
//           onClick={() => setShowModal(true)}
//           style={{
//             background: "linear-gradient(135deg, #1a6e3c, #2d8653)",
//             color: "#fff", border: "none", borderRadius: 12,
//             padding: "12px 22px", fontSize: 15, fontWeight: 700,
//             cursor: "pointer", boxShadow: "0 4px 14px rgba(26,110,60,0.3)",
//             fontFamily: "inherit",
//           }}
//         >
//           + New Patient
//         </button>
//       </div>

//       {showModal && (
//         <div style={{ animation: "fadeIn 0.22s ease" }}>
//           <NewPatientModal onClose={() => setShowModal(false)} onSubmit={handleSubmit} />
//         </div>
//       )}
//     </div>
//   );
// }