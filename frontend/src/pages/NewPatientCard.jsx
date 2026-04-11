import { useState, useEffect, useRef } from "react";


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

              <button className="np-success-btn" onClick={handleClose}>
                Back to Dashboard →
              </button>
            </div>
          )}

        </div>
      </div>
    </>
  );
}