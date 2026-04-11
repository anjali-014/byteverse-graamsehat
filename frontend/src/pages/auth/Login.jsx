








import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { loginUser, setAuthUser } from "../utils/auth.js";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-deep:   #0d3a1c;
    --green-mid:    #1b6530;
    --green-bright: #25a045;
    --green-glow:   #3dcc66;
    --cream:        #fdfcf8;
    --cream-dark:   #f4f7f4;
    --border:       rgba(30,100,50,0.16);
    --text-dark:    #0f1e13;
    --text-mid:     #3a5942;
    --text-muted:   #7a9e82;
  }

  html, body, #root {
    height: 100%;
    font-family: 'DM Sans', sans-serif;
    background: var(--green-deep);
    overflow: hidden;
  }

  .gs-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 300;
    height: 62px;
    background: rgba(253,252,248,0.94);
    backdrop-filter: blur(18px) saturate(180%);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 44px;
    box-shadow: 0 2px 24px rgba(13,58,28,0.08);
  }
  .gs-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; cursor: pointer;
  }
  .gs-logo-leaf { font-size: 22px; }
  .gs-logo-name {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: var(--text-dark); letter-spacing: -.3px;
  }
  .gs-nav-links { display: flex; gap: 30px; }
  .gs-nav-links a {
    font-size: 13.5px; color: var(--text-mid); text-decoration: none;
    font-weight: 500; transition: color .2s;
  }
  .gs-nav-links a:hover { color: var(--green-mid); }
  .gs-nav-actions { display: flex; gap: 10px; }
  .gs-btn-nav-out {
    padding: 7px 20px; border: 2px solid var(--green-mid); border-radius: 50px;
    color: var(--green-mid); background: transparent;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .2s;
  }
  .gs-btn-nav-out:hover { background: #e6f4ea; }
  .gs-btn-nav-fill {
    padding: 7px 20px; border: none; border-radius: 50px;
    background: var(--green-mid); color: white;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .2s;
  }
  .gs-btn-nav-fill:hover { background: var(--green-deep); }

  .gs-main {
    display: grid; grid-template-columns: 1fr 1fr;
    height: 100vh; padding-top: 62px;
  }

  .gs-panel-photo {
    position: relative; overflow: hidden;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 52px 52px 56px;
  }
  .gs-photo-layer {
    position: absolute; inset: 0; z-index: 0;
    background-image: url('https://images.unsplash.com/photo-1584515933487-779824d29309?w=900&q=85&auto=format&fit=crop');
    background-size: cover;
    background-position: center 20%;
    animation: gs-slowzoom 14s ease-in-out infinite alternate;
  }
  @keyframes gs-slowzoom {
    from { transform: scale(1.0); }
    to   { transform: scale(1.08); }
  }
  .gs-photo-overlay {
    position: absolute; inset: 0; z-index: 1;
    background:
      linear-gradient(to bottom,
        rgba(8,28,14,0.10) 0%,
        rgba(8,28,14,0.25) 25%,
        rgba(8,28,14,0.60) 55%,
        rgba(8,28,14,0.90) 80%,
        rgba(8,28,14,0.97) 100%),
      linear-gradient(to right,
        rgba(8,28,14,0.20) 0%,
        transparent 60%);
  }
  .gs-glow-orb {
    position: absolute; z-index: 2;
    border-radius: 50%;
    filter: blur(70px);
    pointer-events: none;
    animation: gs-floatOrb 6s ease-in-out infinite;
  }
  .gs-orb1 {
    top: -80px; right: -60px;
    width: 340px; height: 340px;
    background: radial-gradient(circle, rgba(37,160,69,0.28), transparent 70%);
  }
  .gs-orb2 {
    bottom: 160px; left: -40px;
    width: 220px; height: 220px;
    background: radial-gradient(circle, rgba(61,204,102,0.18), transparent 70%);
    animation-delay: -3s;
  }
  @keyframes gs-floatOrb {
    0%,100% { transform: translateY(0) scale(1); opacity: .8; }
    50%      { transform: translateY(-18px) scale(1.06); opacity: 1; }
  }
  .gs-grain {
    position: absolute; inset: 0; z-index: 3; opacity: .04; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px;
  }
  .gs-vignette {
    position: absolute; inset: 0; z-index: 4; pointer-events: none;
    box-shadow: inset 0 0 100px rgba(8,28,14,0.55);
  }
  .gs-panel-content { position: relative; z-index: 10; }

  .gs-live-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.11);
    border: 1px solid rgba(255,255,255,0.22);
    backdrop-filter: blur(14px) saturate(160%);
    border-radius: 50px; padding: 6px 16px; margin-bottom: 24px;
    color: rgba(255,255,255,0.9); font-size: 11px; font-weight: 700;
    letter-spacing: .08em; width: fit-content;
    animation: gs-fadeUp .7s ease both;
  }
  .gs-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green-glow);
    box-shadow: 0 0 10px var(--green-glow);
    animation: gs-blink 1.9s ease-in-out infinite;
  }
  @keyframes gs-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .gs-panel-heading {
    font-family: 'DM Serif Display', serif;
    font-size: 42px; color: #fff; line-height: 1.18;
    margin-bottom: 14px;
    text-shadow: 0 3px 28px rgba(0,0,0,0.5);
    animation: gs-fadeUp .7s .1s ease both;
  }
  .gs-panel-heading em { font-style: italic; color: #80ffaa; }

  .gs-panel-sub {
    color: rgba(255,255,255,0.68); font-size: 14.5px; line-height: 1.65;
    margin-bottom: 32px; max-width: 310px;
    animation: gs-fadeUp .7s .18s ease both;
  }

  .gs-avatar-row {
    display: flex; align-items: center; margin-bottom: 26px;
    animation: gs-fadeUp .7s .24s ease both;
  }
  .gs-av {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,0.85);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff;
    margin-left: -10px; transition: transform .2s;
    position: relative; cursor: default;
  }
  .gs-av:first-child { margin-left: 0; }
  .gs-av:hover { transform: translateY(-4px) scale(1.12); z-index: 5; }
  .gs-av-note { margin-left: 14px; }
  .gs-av-note strong { display: block; font-size: 14px; color: #fff; font-weight: 700; }
  .gs-av-note span   { font-size: 12.5px; color: rgba(255,255,255,0.6); }

  .gs-pills { display: flex; flex-direction: column; gap: 10px; }
  .gs-pill {
    display: flex; align-items: center; gap: 13px;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(18px) saturate(150%);
    border-radius: 13px; padding: 12px 16px;
    transition: all .28s ease; cursor: default;
    animation: gs-fadeUp .7s ease both;
  }
  .gs-pill:hover {
    background: rgba(255,255,255,0.16);
    border-color: rgba(61,204,102,0.45);
    transform: translateX(5px);
    box-shadow: 0 4px 20px rgba(61,204,102,0.1);
  }
  .gs-pill:nth-child(1) { animation-delay: .30s; }
  .gs-pill:nth-child(2) { animation-delay: .38s; }
  .gs-pill:nth-child(3) { animation-delay: .46s; }
  .gs-pill-ico {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    background: rgba(61,204,102,0.18);
    border: 1px solid rgba(61,204,102,0.28);
  }
  .gs-pill-label { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-bottom: 2px; }
  .gs-pill-value { font-size: 13.5px; color: #fff; font-weight: 700; }

  .gs-panel-form {
    background: var(--cream);
    display: flex; align-items: center; justify-content: center;
    padding: 48px 56px; overflow-y: auto;
  }
  .gs-form-wrap {
    width: 100%; max-width: 400px;
    animation: gs-fadeUp .55s ease both;
  }
  .gs-form-title {
    font-family: 'DM Serif Display', serif;
    font-size: 31px; color: var(--text-dark); margin-bottom: 5px;
  }
  .gs-form-sub {
    font-size: 14px; color: var(--text-muted); margin-bottom: 30px;
  }
  .gs-form-sub a {
    color: var(--green-mid); font-weight: 600;
    text-decoration: none; transition: opacity .2s;
  }
  .gs-form-sub a:hover { opacity: .75; text-decoration: underline; }

  .gs-field { margin-bottom: 17px; }
  .gs-field label {
    display: block; font-size: 12px; font-weight: 700;
    color: var(--text-mid); margin-bottom: 7px;
    letter-spacing: .06em; text-transform: uppercase;
  }
  .gs-field input {
    width: 100%; padding: 12px 15px;
    border: 1.5px solid #d8e8db; border-radius: 11px;
    font-size: 14.5px; font-family: 'DM Sans', sans-serif;
    background: #fff; color: var(--text-dark); outline: none;
    transition: border-color .22s, box-shadow .22s, background .22s;
  }
  .gs-field input:focus {
    border-color: var(--green-bright);
    box-shadow: 0 0 0 4px rgba(37,160,69,0.11);
    background: #fafffc;
  }
  .gs-field input::placeholder { color: #b4c8b8; }

  .gs-forgot-row {
    display: flex; align-items: center;
    justify-content: space-between; margin-bottom: 14px;
  }
  .gs-check-wrap { display: flex; align-items: center; gap: 8px; }
  .gs-check-wrap input[type=checkbox] { width: 15px; height: 15px; accent-color: var(--green-mid); cursor: pointer; }
  .gs-check-wrap label { font-size: 13px; color: var(--text-mid); cursor: pointer; }
  .gs-forgot-link {
    font-size: 13px; color: var(--green-mid); font-weight: 600;
    text-decoration: none; transition: opacity .2s;
  }
  .gs-forgot-link:hover { opacity: .75; }

  .gs-btn-primary {
    width: 100%; padding: 14px; border: none; border-radius: 50px;
    background: linear-gradient(135deg, var(--green-mid) 0%, var(--green-bright) 100%);
    color: #fff; font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: all .25s; letter-spacing: .03em;
    box-shadow: 0 5px 18px rgba(27,101,48,0.32);
    position: relative; overflow: hidden;
  }
  .gs-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(27,101,48,0.42);
  }
  .gs-btn-primary:active { transform: translateY(0); }

  .gs-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 22px 0; color: #b4c8b8; font-size: 12.5px;
  }
  .gs-divider::before, .gs-divider::after {
    content: ''; flex: 1; height: 1px; background: #e4ede6;
  }

  .gs-btn-aadhaar {
    width: 100%; padding: 12px; border: 1.5px solid #d4e6d8; border-radius: 50px;
    background: #fff; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    color: var(--text-dark); display: flex; align-items: center;
    justify-content: center; gap: 9px; transition: all .22s;
  }
  .gs-btn-aadhaar:hover {
    background: #f0faf2; border-color: var(--green-bright);
    box-shadow: 0 3px 14px rgba(37,160,69,0.12);
  }
  .gs-aadhaar-icon {
    width: 22px; height: 22px; border-radius: 4px;
    background: linear-gradient(135deg, #ff6b35, #f7c59f);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 900; color: #fff; flex-shrink: 0;
  }

  .gs-terms {
    font-size: 12px; color: var(--text-muted); text-align: center;
    margin-top: 20px; line-height: 1.6;
  }
  .gs-terms a { color: var(--green-mid); text-decoration: none; font-weight: 500; }
  .gs-terms a:hover { text-decoration: underline; }

  .gs-trust-row {
    display: flex; align-items: center; justify-content: center;
    gap: 18px; margin-top: 22px; padding-top: 18px;
    border-top: 1px solid #e8eee9;
  }
  .gs-trust-item {
    display: flex; align-items: center; gap: 6px;
    font-size: 11.5px; color: var(--text-muted); font-weight: 500;
  }
  .gs-trust-item span { font-size: 14px; }

  @keyframes gs-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export default function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [remember, setRemember] = useState(false);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const handleLogin = async () => {
    setError("");
    if (!identifier || !password) {
      setError("Please enter your mobile number or ASHA ID and password.");
      return;
    }

    setLoading(true);
    try {
      const response = await loginUser(identifier.trim(), password);
      setAuthUser(response.data, remember);
      navigate("/homepage");
    } catch (err) {
      setError(err.message || "Login failed. Please try again.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="gs-nav">
        <a className="gs-logo" href="/signup">
          <span className="gs-logo-leaf">🌿</span>
          <span className="gs-logo-name">GraamSehat</span>
        </a>
        <div className="gs-nav-links">
          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">Services</a>
          <a href="#">Features</a>
          <a href="#">Contact</a>
        </div>
        <div className="gs-nav-actions">
          <button className="gs-btn-nav-out" onClick={() => window.location.href = '/login'}>Log in</button>
          <button className="gs-btn-nav-fill" onClick={() => window.location.href = '/signup'}>Sign up</button>
        </div>
      </nav>

      {/* MAIN */}
      <main className="gs-main">

        {/* LEFT: PHOTO PANEL */}
        <div className="gs-panel-photo">
          <div className="gs-photo-layer"></div>
          <div className="gs-photo-overlay"></div>
          <div className="gs-glow-orb gs-orb1"></div>
          <div className="gs-glow-orb gs-orb2"></div>
          <div className="gs-grain"></div>
          <div className="gs-vignette"></div>

          <div className="gs-panel-content">
            <div className="gs-live-badge">
              <span className="gs-live-dot"></span>
              AI-POWERED RURAL HEALTHCARE
            </div>

            <h1 className="gs-panel-heading">
              Welcome back,<br /><em>ASHA worker</em>
            </h1>
            <p className="gs-panel-sub">
              Log in to access your patient dashboard, health records and AI diagnosis tools — built for the field, works without internet.
            </p>

            <div className="gs-avatar-row">
              <div className="gs-av" style={{ background: '#1b6530' }}>S</div>
              <div className="gs-av" style={{ background: '#c62828' }}>R</div>
              <div className="gs-av" style={{ background: '#7b1fa2' }}>M</div>
              <div className="gs-av" style={{ background: '#e65100' }}>K</div>
              <div className="gs-av" style={{ background: '#0277bd' }}>A</div>
              <div className="gs-av-note">
                <strong>1,400+ Workers Active</strong>
                <span>Across Bihar &amp; Uttar Pradesh</span>
              </div>
            </div>

            <div className="gs-pills">
              <div className="gs-pill">
                <div className="gs-pill-ico">🏘️</div>
                <div>
                  <div className="gs-pill-label">Coverage</div>
                  <div className="gs-pill-value">247 Villages · 24/7 Active Support</div>
                </div>
              </div>
              <div className="gs-pill">
                <div className="gs-pill-ico">📶</div>
                <div>
                  <div className="gs-pill-label">Connectivity</div>
                  <div className="gs-pill-value">Offline-First · No Internet Needed</div>
                </div>
              </div>
              <div className="gs-pill">
                <div className="gs-pill-ico">🤖</div>
                <div>
                  <div className="gs-pill-label">AI Diagnoses This Month</div>
                  <div className="gs-pill-value">12,400+ Cases Supported</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM PANEL */}
        <div className="gs-panel-form">
          <div className="gs-form-wrap">
            <h2 className="gs-form-title">Log in to your account</h2>
            <p className="gs-form-sub">
              New to GraamSehat? <a href="/signup">Create a free account</a>
            </p>

            <div className="gs-field">
              <label>Mobile Number or ASHA ID</label>
              <input
                type="text"
                placeholder="e.g. 9876543210 or ASHA-UP-2034"
                autoComplete="username"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
              />
            </div>

            <div className="gs-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Enter your password"
                autoComplete="current-password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
              />
            </div>

            {error && (
              <div style={{ color: '#b91c1c', margin: '18px 0', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div className="gs-forgot-row">
              <div className="gs-check-wrap">
                <input
                  type="checkbox"
                  id="remember"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <label htmlFor="remember">Remember me</label>
              </div>
              <a className="gs-forgot-link" href="#">Forgot password?</a>
            </div>

            <button className="gs-btn-primary" onClick={handleLogin} disabled={loading}>
              {loading ? 'Signing in…' : 'Log In to Dashboard →'}
            </button>

            <div className="gs-divider">or continue with</div>

            <button className="gs-btn-aadhaar">
              <span className="gs-aadhaar-icon">Aa</span>
              Verify &amp; Log In with Aadhaar OTP
            </button>

            <p className="gs-terms">
              By logging in, you agree to GraamSehat's{" "}
              <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </p>

            <div className="gs-trust-row">
              <div className="gs-trust-item"><span>🔒</span> SSL Secured</div>
              <div className="gs-trust-item"><span>🏥</span> ABDM Compliant</div>
              <div className="gs-trust-item"><span>🇮🇳</span> Govt. of India</div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}
