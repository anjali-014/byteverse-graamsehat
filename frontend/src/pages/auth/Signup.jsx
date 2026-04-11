import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { signupUser, setAuthUser } from "../utils/auth.js";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-deep:   #0d3a1c;
    --green-mid:    #1b6530;
    --green-bright: #25a045;
    --green-glow:   #3dcc66;
    --cream:        #fdfcf8;
    --border:       rgba(30,100,50,0.16);
    --text-dark:    #0f1e13;
    --text-mid:     #3a5942;
    --text-muted:   #7a9e82;
  }

  html, body, #root {
    height: 100%;
    font-family: 'DM Sans', sans-serif;
    background: var(--green-deep);
    overflow-x: hidden;
  }

  .gss-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 300;
    height: 62px;
    background: rgba(253,252,248,0.94);
    backdrop-filter: blur(18px) saturate(180%);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 44px;
    box-shadow: 0 2px 24px rgba(13,58,28,0.08);
  }
  .gss-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; cursor: pointer;
  }
  .gss-logo-leaf { font-size: 22px; }
  .gss-logo-name {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: var(--text-dark); letter-spacing: -.3px;
  }
  .gss-nav-links { display: flex; gap: 30px; }
  .gss-nav-links a {
    font-size: 13.5px; color: var(--text-mid); text-decoration: none;
    font-weight: 500; transition: color .2s;
  }
  .gss-nav-links a:hover { color: var(--green-mid); }
  .gss-nav-actions { display: flex; gap: 10px; }
  .gss-btn-nav-out {
    padding: 7px 20px; border: 2px solid var(--green-mid); border-radius: 50px;
    color: var(--green-mid); background: transparent;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .2s;
  }
  .gss-btn-nav-out:hover { background: #e6f4ea; }
  .gss-btn-nav-fill {
    padding: 7px 20px; border: none; border-radius: 50px;
    background: var(--green-mid); color: white;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .2s;
  }
  .gss-btn-nav-fill:hover { background: var(--green-deep); }

  .gss-main {
    display: grid; grid-template-columns: 1fr 1fr;
    min-height: 100vh; padding-top: 62px;
  }

  .gss-panel-photo {
    position: sticky; top: 62px;
    height: calc(100vh - 62px);
    overflow: hidden;
    display: flex; flex-direction: column; justify-content: flex-end;
    padding: 52px 52px 56px;
  }
  .gss-photo-layer {
    position: absolute; inset: 0; z-index: 0;
    background-image: url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=900&q=85&auto=format&fit=crop');
    background-size: cover;
    background-position: center 30%;
    animation: gss-slowzoom 16s ease-in-out infinite alternate;
  }
  @keyframes gss-slowzoom {
    from { transform: scale(1.0); }
    to   { transform: scale(1.09); }
  }
  .gss-photo-overlay {
    position: absolute; inset: 0; z-index: 1;
    background:
      linear-gradient(to bottom,
        rgba(8,28,14,0.08) 0%,
        rgba(8,28,14,0.28) 28%,
        rgba(8,28,14,0.65) 55%,
        rgba(8,28,14,0.92) 80%,
        rgba(8,28,14,0.97) 100%),
      linear-gradient(to right,
        rgba(8,28,14,0.18) 0%,
        transparent 55%);
  }
  .gss-glow-orb {
    position: absolute; z-index: 2;
    border-radius: 50%;
    filter: blur(70px); pointer-events: none;
    animation: gss-floatOrb 6s ease-in-out infinite;
  }
  .gss-orb1 {
    top: -100px; right: -80px;
    width: 360px; height: 360px;
    background: radial-gradient(circle, rgba(37,160,69,0.26), transparent 70%);
  }
  .gss-orb2 {
    bottom: 200px; left: -60px;
    width: 240px; height: 240px;
    background: radial-gradient(circle, rgba(61,204,102,0.16), transparent 70%);
    animation-delay: -3s;
  }
  @keyframes gss-floatOrb {
    0%,100% { transform: translateY(0) scale(1); opacity: .8; }
    50%      { transform: translateY(-20px) scale(1.06); opacity: 1; }
  }
  .gss-grain {
    position: absolute; inset: 0; z-index: 3; opacity: .04; pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 256 256' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
    background-size: 180px;
  }
  .gss-vignette {
    position: absolute; inset: 0; z-index: 4; pointer-events: none;
    box-shadow: inset 0 0 110px rgba(8,28,14,0.6);
  }
  .gss-panel-content { position: relative; z-index: 10; }

  .gss-live-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(255,255,255,0.11);
    border: 1px solid rgba(255,255,255,0.22);
    backdrop-filter: blur(14px) saturate(160%);
    border-radius: 50px; padding: 6px 16px; margin-bottom: 24px;
    color: rgba(255,255,255,0.9); font-size: 11px; font-weight: 700;
    letter-spacing: .08em; width: fit-content;
    animation: gss-fadeUp .7s ease both;
  }
  .gss-live-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green-glow);
    box-shadow: 0 0 10px var(--green-glow);
    animation: gss-blink 1.9s ease-in-out infinite;
  }
  @keyframes gss-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .gss-panel-heading {
    font-family: 'DM Serif Display', serif;
    font-size: 42px; color: #fff; line-height: 1.18;
    margin-bottom: 14px;
    text-shadow: 0 3px 28px rgba(0,0,0,0.5);
    animation: gss-fadeUp .7s .1s ease both;
  }
  .gss-panel-heading em { font-style: italic; color: #80ffaa; }

  .gss-panel-sub {
    color: rgba(255,255,255,0.68); font-size: 14.5px; line-height: 1.65;
    margin-bottom: 28px; max-width: 310px;
    animation: gss-fadeUp .7s .18s ease both;
  }

  .gss-avatar-row {
    display: flex; align-items: center; margin-bottom: 26px;
    animation: gss-fadeUp .7s .24s ease both;
  }
  .gss-av {
    width: 36px; height: 36px; border-radius: 50%;
    border: 2.5px solid rgba(255,255,255,0.85);
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff;
    margin-left: -10px; transition: transform .2s;
    position: relative; cursor: default;
  }
  .gss-av:first-child { margin-left: 0; }
  .gss-av:hover { transform: translateY(-4px) scale(1.12); z-index: 5; }
  .gss-av-note { margin-left: 14px; }
  .gss-av-note strong { display: block; font-size: 14px; color: #fff; font-weight: 700; }
  .gss-av-note span   { font-size: 12.5px; color: rgba(255,255,255,0.6); }

  .gss-pills { display: flex; flex-direction: column; gap: 10px; }
  .gss-pill {
    display: flex; align-items: center; gap: 13px;
    background: rgba(255,255,255,0.09);
    border: 1px solid rgba(255,255,255,0.15);
    backdrop-filter: blur(18px) saturate(150%);
    border-radius: 13px; padding: 12px 16px;
    transition: all .28s ease; cursor: default;
    animation: gss-fadeUp .7s ease both;
  }
  .gss-pill:hover {
    background: rgba(255,255,255,0.16);
    border-color: rgba(61,204,102,0.45);
    transform: translateX(5px);
    box-shadow: 0 4px 20px rgba(61,204,102,0.1);
  }
  .gss-pill:nth-child(1) { animation-delay: .30s; }
  .gss-pill:nth-child(2) { animation-delay: .38s; }
  .gss-pill:nth-child(3) { animation-delay: .46s; }
  .gss-pill:nth-child(4) { animation-delay: .54s; }
  .gss-pill-ico {
    width: 38px; height: 38px; border-radius: 10px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 18px;
    background: rgba(61,204,102,0.18);
    border: 1px solid rgba(61,204,102,0.28);
  }
  .gss-pill-label { font-size: 11px; color: rgba(255,255,255,0.5); font-weight: 500; margin-bottom: 2px; }
  .gss-pill-value { font-size: 13.5px; color: #fff; font-weight: 700; }

  .gss-panel-form {
    background: var(--cream);
    display: flex; align-items: flex-start; justify-content: center;
    padding: 52px 56px 60px; overflow-y: auto;
  }
  .gss-form-wrap {
    width: 100%; max-width: 400px;
    animation: gss-fadeUp .55s ease both;
  }
  .gss-form-title {
    font-family: 'DM Serif Display', serif;
    font-size: 31px; color: var(--text-dark); margin-bottom: 5px;
  }
  .gss-form-sub {
    font-size: 14px; color: var(--text-muted); margin-bottom: 28px;
  }
  .gss-form-sub a {
    color: var(--green-mid); font-weight: 600; text-decoration: none;
  }
  .gss-form-sub a:hover { text-decoration: underline; }

  .gss-section-label {
    font-size: 11px; font-weight: 700; letter-spacing: .1em;
    text-transform: uppercase; color: var(--text-muted);
    margin: 20px 0 12px; padding-bottom: 8px;
    border-bottom: 1px solid #e4ede6;
    display: flex; align-items: center; gap: 8px;
  }
  .gss-section-label span { font-size: 14px; }

  .gss-field { margin-bottom: 15px; }
  .gss-field label {
    display: block; font-size: 12px; font-weight: 700;
    color: var(--text-mid); margin-bottom: 6px;
    letter-spacing: .06em; text-transform: uppercase;
  }
  .gss-field input,
  .gss-field select {
    width: 100%; padding: 11.5px 15px;
    border: 1.5px solid #d8e8db; border-radius: 11px;
    font-size: 14.5px; font-family: 'DM Sans', sans-serif;
    background: #fff; color: var(--text-dark); outline: none;
    appearance: none; transition: border-color .22s, box-shadow .22s, background .22s;
  }
  .gss-field input:focus,
  .gss-field select:focus {
    border-color: var(--green-bright);
    box-shadow: 0 0 0 4px rgba(37,160,69,0.11);
    background: #fafffc;
  }
  .gss-field input::placeholder { color: #b4c8b8; }
  .gss-field-row { display: grid; grid-template-columns: 1fr 1fr; gap: 12px; }

  .gss-pwd-bar-wrap { margin-top: 6px; display: flex; gap: 4px; }
  .gss-pwd-seg {
    flex: 1; height: 3px; border-radius: 99px;
    background: #e0eae2; transition: background .3s;
  }
  .gss-pwd-hint { font-size: 11.5px; color: var(--text-muted); margin-top: 4px; }
  .gss-seg-weak   { background: #ef5350 !important; }
  .gss-seg-fair   { background: #ffa726 !important; }
  .gss-seg-good   { background: #66bb6a !important; }
  .gss-seg-strong { background: #2e7d32 !important; }

  .gss-check-wrap { display: flex; align-items: flex-start; gap: 9px; margin: 6px 0 16px; }
  .gss-check-wrap input[type=checkbox] { width: 15px; height: 15px; margin-top: 2px; accent-color: var(--green-mid); cursor: pointer; flex-shrink: 0; }
  .gss-check-wrap label { font-size: 13px; color: var(--text-mid); line-height: 1.5; cursor: pointer; }
  .gss-check-wrap a { color: var(--green-mid); font-weight: 600; text-decoration: none; }

  .gss-btn-primary {
    width: 100%; padding: 14px; border: none; border-radius: 50px;
    background: linear-gradient(135deg, var(--green-mid) 0%, var(--green-bright) 100%);
    color: #fff; font-size: 15px; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: all .25s; letter-spacing: .03em;
    box-shadow: 0 5px 18px rgba(27,101,48,0.32);
    position: relative; overflow: hidden;
  }
  .gss-btn-primary:hover {
    transform: translateY(-2px);
    box-shadow: 0 10px 28px rgba(27,101,48,0.42);
  }
  .gss-btn-primary:active { transform: translateY(0); }

  .gss-divider {
    display: flex; align-items: center; gap: 12px;
    margin: 20px 0; color: #b4c8b8; font-size: 12.5px;
  }
  .gss-divider::before, .gss-divider::after {
    content: ''; flex: 1; height: 1px; background: #e4ede6;
  }

  .gss-btn-aadhaar {
    width: 100%; padding: 12px; border: 1.5px solid #d4e6d8; border-radius: 50px;
    background: #fff; font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    color: var(--text-dark); display: flex; align-items: center;
    justify-content: center; gap: 9px; transition: all .22s;
  }
  .gss-btn-aadhaar:hover {
    background: #f0faf2; border-color: var(--green-bright);
    box-shadow: 0 3px 14px rgba(37,160,69,0.12);
  }
  .gss-aadhaar-icon {
    width: 22px; height: 22px; border-radius: 4px;
    background: linear-gradient(135deg, #ff6b35, #f7c59f);
    display: flex; align-items: center; justify-content: center;
    font-size: 12px; font-weight: 900; color: #fff; flex-shrink: 0;
  }

  .gss-trust-row {
    display: flex; align-items: center; justify-content: center;
    gap: 18px; margin-top: 22px; padding-top: 18px;
    border-top: 1px solid #e8eee9;
  }
  .gss-trust-item {
    display: flex; align-items: center; gap: 5px;
    font-size: 11.5px; color: var(--text-muted); font-weight: 500;
  }
  .gss-trust-item span { font-size: 14px; }

  @keyframes gss-fadeUp {
    from { opacity: 0; transform: translateY(20px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

function getPwdScore(val) {
  let score = 0;
  if (val.length >= 6) score++;
  if (val.length >= 10) score++;
  if (/[A-Z]/.test(val) && /[0-9]/.test(val)) score++;
  if (/[^A-Za-z0-9]/.test(val)) score++;
  return score;
}

const pwdColors = ['', 'gss-seg-weak', 'gss-seg-fair', 'gss-seg-good', 'gss-seg-strong'];
const pwdLabels = ['', 'Too short', 'Fair', 'Good', 'Strong 💪'];

export default function Signup() {
  const [firstName, setFirstName] = useState('');
  const [lastName, setLastName] = useState('');
  const [phone, setPhone] = useState('');
  const [ashaId, setAshaId] = useState('');
  const [stateValue, setStateValue] = useState('Bihar');
  const [district, setDistrict] = useState('Patna');
  const [village, setVillage] = useState('');
  const [pwd, setPwd] = useState('');
  const [agree, setAgree] = useState(false);
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);

  const navigate = useNavigate();

  const score = getPwdScore(pwd);
  const pwdHint = pwd.length === 0
    ? 'Use 8+ characters with letters & numbers'
    : (pwdLabels[score] || 'Too short');


  const handleRegister = async () => {
    setError('');
    if (!agree) {
      setError('Please accept Terms & Conditions.');
      return;
    }

    if (!firstName || !phone || !ashaId || !village || pwd.length < 8) {
      setError('Please complete all required fields and choose a strong password.');
      return;
    }

    setLoading(true);
    try {
      const response = await signupUser({
        firstName,
        lastName,
        phone,
        ashaId,
        state: stateValue,
        district,
        village,
        password: pwd,
      });

      setAuthUser(response.data, true);
      navigate('/homepage');
    } catch (err) {
      setError(err.message || 'Registration failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="gss-nav">
        <a className="gss-logo" href="/login">
          <span className="gss-logo-leaf">🌿</span>
          <span className="gss-logo-name">GraamSehat</span>
        </a>
        <div className="gss-nav-links">
          <a href="#">Home</a>
          <a href="#">About Us</a>
          <a href="#">Services</a>
          <a href="#">Features</a>
          <a href="#">Contact</a>
        </div>
        <div className="gss-nav-actions">
          <button className="gss-btn-nav-out" onClick={() => window.location.href = '/login'}>Log in</button>
          <button className="gss-btn-nav-fill" onClick={() => window.location.href = '/signup'}>Sign up</button>
        </div>
      </nav>

      <main className="gss-main">

        {/* LEFT: PHOTO PANEL */}
        <div className="gss-panel-photo">
          <div className="gss-photo-layer"></div>
          <div className="gss-photo-overlay"></div>
          <div className="gss-glow-orb gss-orb1"></div>
          <div className="gss-glow-orb gss-orb2"></div>
          <div className="gss-grain"></div>
          <div className="gss-vignette"></div>

          <div className="gss-panel-content">
            <div className="gss-live-badge">
              <span className="gss-live-dot"></span>
              JOIN THE MISSION
            </div>

            <h1 className="gss-panel-heading">
              Register as an<br /><em>ASHA Worker</em>
            </h1>
            <p className="gss-panel-sub">
              Join 1,400+ ASHA workers delivering AI-powered healthcare to villages across Bihar and Uttar Pradesh — free for all certified workers.
            </p>

            <div className="gss-avatar-row">
              <div className="gss-av" style={{ background: '#1b6530' }}>S</div>
              <div className="gss-av" style={{ background: '#c62828' }}>R</div>
              <div className="gss-av" style={{ background: '#7b1fa2' }}>M</div>
              <div className="gss-av" style={{ background: '#e65100' }}>K</div>
              <div className="gss-av-note">
                <strong>Free for Certified Workers</strong>
                <span>Supported by Govt. of India</span>
              </div>
            </div>

            <div className="gss-pills">
              <div className="gss-pill">
                <div className="gss-pill-ico">✅</div>
                <div>
                  <div className="gss-pill-label">Cost</div>
                  <div className="gss-pill-value">100% Free for All ASHA Workers</div>
                </div>
              </div>
              <div className="gss-pill">
                <div className="gss-pill-ico">🔒</div>
                <div>
                  <div className="gss-pill-label">Data Security</div>
                  <div className="gss-pill-value">End-to-End Encrypted · ABDM Compliant</div>
                </div>
              </div>
              <div className="gss-pill">
                <div className="gss-pill-ico">🌐</div>
                <div>
                  <div className="gss-pill-label">Availability</div>
                  <div className="gss-pill-value">Works Offline in Remote Villages</div>
                </div>
              </div>
              <div className="gss-pill">
                <div className="gss-pill-ico">🤖</div>
                <div>
                  <div className="gss-pill-label">AI-Powered Tools</div>
                  <div className="gss-pill-value">Smart Diagnosis &amp; Care Guidance</div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* RIGHT: FORM PANEL */}
        <div className="gss-panel-form">
          <div className="gss-form-wrap">
            <h2 className="gss-form-title">Create your account</h2>
            <p className="gss-form-sub">
              Already registered? <a href="/login">Log in here</a>
            </p>

            {/* PERSONAL INFO */}
            <div className="gss-section-label"><span>👤</span> Personal Information</div>

            <div className="gss-field-row">
              <div className="gss-field">
                <label>First Name</label>
                <input
                  type="text"
                  placeholder="Rekha"
                  autoComplete="given-name"
                  value={firstName}
                  onChange={(e) => setFirstName(e.target.value)}
                />
              </div>
              <div className="gss-field">
                <label>Last Name</label>
                <input
                  type="text"
                  placeholder="Sharma"
                  autoComplete="family-name"
                  value={lastName}
                  onChange={(e) => setLastName(e.target.value)}
                />
              </div>
            </div>

            <div className="gss-field">
              <label>Mobile Number</label>
              <input
                type="tel"
                placeholder="10-digit number"
                autoComplete="tel"
                maxLength={10}
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
              />
            </div>

            {/* WORKER DETAILS */}
            <div className="gss-section-label"><span>🏥</span> ASHA Worker Details</div>

            <div className="gss-field">
              <label>ASHA Worker ID</label>
              <input
                type="text"
                placeholder="e.g. ASHA-BR-1042"
                value={ashaId}
                onChange={(e) => setAshaId(e.target.value)}
              />
            </div>

            <div className="gss-field-row">
              <div className="gss-field">
                <label>State</label>
                <select
                  value={stateValue}
                  onChange={(e) => setStateValue(e.target.value)}
                >
                  <option value="Bihar">Bihar</option>
                  <option value="Uttar Pradesh">Uttar Pradesh</option>
                  <option value="Jharkhand">Jharkhand</option>
                  <option value="Madhya Pradesh">Madhya Pradesh</option>
                  <option value="Rajasthan">Rajasthan</option>
                  <option value="West Bengal">West Bengal</option>
                  <option value="Odisha">Odisha</option>
                </select>
              </div>
              <div className="gss-field">
                <label>District</label>
                <input
                  type="text"
                  placeholder="e.g. Gaya"
                  value={district}
                  onChange={(e) => setDistrict(e.target.value)}
                />
              </div>
            </div>

            <div className="gss-field">
              <label>Village / Block Name</label>
              <input
                type="text"
                placeholder="Your assigned area"
                value={village}
                onChange={(e) => setVillage(e.target.value)}
              />
            </div>

            {/* SECURITY */}
            <div className="gss-section-label"><span>🔒</span> Security</div>

            <div className="gss-field">
              <label>Password</label>
              <input
                type="password"
                placeholder="Create a strong password"
                autoComplete="new-password"
                value={pwd}
                onChange={(e) => setPwd(e.target.value)}
              />
              <div className="gss-pwd-bar-wrap">
                {[0, 1, 2, 3].map((i) => (
                  <div
                    key={i}
                    className={`gss-pwd-seg${i < score ? ` ${pwdColors[score]}` : ''}`}
                  />
                ))}
              </div>
              <div className="gss-pwd-hint">{pwdHint}</div>
            </div>

            {error && (
              <div style={{ color: '#b91c1c', margin: '18px 0', fontWeight: 600 }}>
                {error}
              </div>
            )}

            <div className="gss-check-wrap">
              <input
                type="checkbox"
                id="agree"
                checked={agree}
                onChange={(e) => setAgree(e.target.checked)}
              />
              <label htmlFor="agree">
                I agree to GraamSehat's <a href="#">Terms of Service</a>{' '}
                and <a href="#">Privacy Policy</a>. My data will be handled per ABDM guidelines.
              </label>
            </div>

            <button className="gss-btn-primary" onClick={handleRegister} disabled={loading}>
              {loading ? 'Registering…' : 'Register as ASHA Worker →'}
            </button>

            <div className="gss-divider">or register with</div>

            <button className="gss-btn-aadhaar">
              <span className="gss-aadhaar-icon">Aa</span>
              Register with Aadhaar OTP
            </button>

             


            <div className="gss-trust-row">
              <div className="gss-trust-item"><span>🔒</span> SSL Secured</div>
              <div className="gss-trust-item"><span>🏥</span> ABDM Compliant</div>
              <div className="gss-trust-item"><span>🇮🇳</span> Govt. of India</div>
            </div>
          </div>
        </div>

      </main>
    </>
  );
}