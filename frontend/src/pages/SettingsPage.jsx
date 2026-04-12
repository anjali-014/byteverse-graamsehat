// import React, { useState } from "react";
// import { useNavigate } from "react-router-dom";
// import { Sidebar, Topbar, sharedStyles } from "../components/Layout.jsx";
// import { getCurrentUser, logoutUser } from "./utils/auth.js";

// /* ─────────────────────────────────────────────
//    STYLES
// ───────────────────────────────────────────── */
// const pageStyles = `
//   .settings-layout {
//     display: grid;
//     grid-template-columns: 240px 1fr;
//     gap: 24px;
//     align-items: start;
//   }
//   @media (max-width: 900px) {
//     .settings-layout { grid-template-columns: 1fr; }
//   }

//   /* ── Nav sidebar ── */
//   .settings-nav {
//     background: #fff;
//     border-radius: 16px;
//     border: 1px solid var(--border);
//     box-shadow: var(--card-shadow);
//     overflow: hidden;
//     position: sticky;
//     top: 24px;
//   }
//   .settings-nav-item {
//     display: flex;
//     align-items: center;
//     gap: 12px;
//     padding: 13px 18px;
//     cursor: pointer;
//     font-size: 13.5px;
//     font-weight: 600;
//     color: var(--text-mid);
//     border-left: 3px solid transparent;
//     transition: all .18s;
//     font-family: 'DM Sans', sans-serif;
//   }
//   .settings-nav-item:hover { background: #f6fbf7; color: var(--text-dark); }
//   .settings-nav-item.active {
//     background: var(--green-pale);
//     color: var(--green-mid);
//     border-left-color: var(--green-bright);
//   }
//   .settings-nav-item .nav-ico {
//     width: 32px; height: 32px; border-radius: 8px;
//     display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0;
//   }
//   .settings-nav-item.active .nav-ico { background: rgba(37,160,69,0.15); }
//   .settings-nav-item:not(.active) .nav-ico { background: #f0f5f1; }
//   .settings-nav-divider { height: 1px; background: #f0f5f1; margin: 4px 0; }

//   /* ── Content panel ── */
//   .settings-panel {
//     background: #fff;
//     border-radius: 16px;
//     border: 1px solid var(--border);
//     box-shadow: var(--card-shadow);
//     overflow: hidden;
//     animation: fadeUp .35s ease both;
//   }
//   .settings-panel-header {
//     padding: 22px 24px 18px;
//     border-bottom: 1px solid #f0f5f1;
//   }
//   .settings-panel-title {
//     font-family: 'DM Serif Display', serif;
//     font-size: 20px;
//     color: var(--text-dark);
//     margin-bottom: 4px;
//   }
//   .settings-panel-sub { font-size: 13px; color: var(--text-muted); }
//   .settings-section { padding: 22px 24px; border-bottom: 1px solid #f0f5f1; }
//   .settings-section:last-child { border-bottom: none; }
//   .settings-section-label {
//     font-size: 11px; font-weight: 700; text-transform: uppercase;
//     letter-spacing: .07em; color: var(--text-muted); margin-bottom: 16px;
//   }

//   /* ── Row layouts ── */
//   .setting-row {
//     display: flex; align-items: center; justify-content: space-between;
//     padding: 13px 0; border-bottom: 1px solid #f8faf8;
//   }
//   .setting-row:last-child { border-bottom: none; }
//   .setting-label { font-size: 14px; font-weight: 600; color: var(--text-dark); }
//   .setting-desc  { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

//   /* ── Toggle switch ── */
//   .toggle-wrap { position: relative; width: 48px; height: 26px; flex-shrink: 0; }
//   .toggle-input { opacity: 0; width: 0; height: 0; position: absolute; }
//   .toggle-slider {
//     position: absolute; cursor: pointer; inset: 0;
//     background: #d1d9d4; border-radius: 26px; transition: background .25s;
//   }
//   .toggle-slider::before {
//     content: ''; position: absolute;
//     width: 20px; height: 20px; left: 3px; bottom: 3px;
//     background: #fff; border-radius: 50%;
//     transition: transform .25s;
//     box-shadow: 0 1px 4px rgba(0,0,0,0.18);
//   }
//   .toggle-input:checked + .toggle-slider { background: var(--green-mid); }
//   .toggle-input:checked + .toggle-slider::before { transform: translateX(22px); }

//   /* ── Select & Input ── */
//   .settings-select {
//     padding: 8px 14px; border-radius: 10px;
//     border: 1.5px solid var(--border); background: #f8faf8;
//     font-size: 13px; color: var(--text-dark);
//     font-family: 'DM Sans', sans-serif; cursor: pointer;
//     transition: border-color .18s; min-width: 160px;
//   }
//   .settings-select:focus { outline: none; border-color: var(--green-bright); background: #fff; }
//   .settings-input {
//     padding: 8px 14px; border-radius: 10px;
//     border: 1.5px solid var(--border); background: #f8faf8;
//     font-size: 13px; color: var(--text-dark);
//     font-family: 'DM Sans', sans-serif;
//     transition: border-color .18s; width: 220px;
//   }
//   .settings-input:focus { outline: none; border-color: var(--green-bright); background: #fff; }

//   /* ── Profile avatar ── */
//   .profile-avatar-wrap {
//     display: flex; align-items: center; gap: 20px; margin-bottom: 24px;
//   }
//   .profile-avatar {
//     width: 72px; height: 72px; border-radius: 50%;
//     background: linear-gradient(135deg, #25a045, #1a7a34);
//     display: flex; align-items: center; justify-content: center;
//     font-size: 26px; font-weight: 700; color: #fff; flex-shrink: 0;
//     border: 3px solid rgba(37,160,69,0.25);
//   }
//   .profile-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
//   .pf-group { display: flex; flex-direction: column; gap: 6px; }
//   .pf-label { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .05em; }
//   .pf-input {
//     padding: 10px 14px; border-radius: 10px;
//     border: 1.5px solid var(--border); background: #f8faf8;
//     font-size: 13.5px; color: var(--text-dark);
//     font-family: 'DM Sans', sans-serif; transition: border-color .18s;
//   }
//   .pf-input:focus { outline: none; border-color: var(--green-bright); background: #fff; }
//   .pf-input:disabled { opacity: .5; cursor: not-allowed; }

//   /* ── Danger zone ── */
//   .danger-zone {
//     background: #fff8f8; border-radius: 12px;
//     border: 1px solid rgba(198,40,40,0.2); padding: 18px 20px;
//   }
//   .danger-title { font-size: 14px; font-weight: 700; color: #c62828; margin-bottom: 4px; }
//   .danger-desc  { font-size: 13px; color: #b71c1c; opacity: .8; margin-bottom: 14px; }

//   /* ── Sync status ── */
//   .sync-dot {
//     width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0;
//   }
//   .sync-dot.green  { background: #4caf50; box-shadow: 0 0 0 3px rgba(76,175,80,.2); }
//   .sync-dot.yellow { background: #ffb300; box-shadow: 0 0 0 3px rgba(255,179,0,.2); }
//   .sync-dot.red    { background: #ef5350; box-shadow: 0 0 0 3px rgba(239,83,80,.2); }

//   /* ── Storage bar ── */
//   .storage-bar { height: 10px; background: #edf3ef; border-radius: 10px; overflow: hidden; margin: 10px 0 6px; }
//   .storage-fill { height: 100%; border-radius: 10px; background: linear-gradient(90deg, #25a045, #4caf50); transition: width .6s ease; }

//   /* ── Save toast ── */
//   .save-toast {
//     position: fixed; bottom: 32px; right: 32px;
//     background: var(--green-mid); color: #fff;
//     padding: 14px 22px; border-radius: 12px;
//     font-size: 14px; font-weight: 600;
//     box-shadow: 0 8px 24px rgba(37,160,69,0.35);
//     animation: slideUp .3s ease;
//     z-index: 999;
//   }
//   @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

//   /* ── Logout btn ── */
//   .btn-danger {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 10px 20px; border-radius: 10px;
//     background: #c62828; color: #fff; font-size: 13px;
//     font-weight: 700; border: none; cursor: pointer;
//     font-family: 'DM Sans', sans-serif; transition: background .18s;
//   }
//   .btn-danger:hover { background: #b71c1c; }
//   .btn-danger-outline {
//     display: inline-flex; align-items: center; gap: 8px;
//     padding: 10px 20px; border-radius: 10px;
//     background: transparent; color: #c62828;
//     font-size: 13px; font-weight: 700;
//     border: 1.5px solid rgba(198,40,40,0.4); cursor: pointer;
//     font-family: 'DM Sans', sans-serif; transition: all .18s;
//   }
//   .btn-danger-outline:hover { background: #ffebee; }
// `;

// /* ─────────────────────────────────────────────
//    NAV ITEMS
// ───────────────────────────────────────────── */
// const NAV = [
//   { key: "profile",       label: "Profile",           ico: "👤" },
//   { key: "notifications", label: "Notifications",     ico: "🔔" },
//   { key: "language",      label: "Language",          ico: "🌐" },
//   { key: "sync",          label: "Data & Sync",       ico: "🔄" },
//   { key: "appearance",    label: "Appearance",        ico: "🎨" },
//   { key: "privacy",       label: "Privacy & Security",ico: "🔒" },
//   { key: "account",       label: "Account",           ico: "⚙️" },
// ];

// /* ─────────────────────────────────────────────
//    COMPONENT
// ───────────────────────────────────────────── */
// export default function SettingsPage() {
//   const navigate = useNavigate();
//   const user = getCurrentUser() || {};

//   const [activeTab, setActiveTab] = useState("profile");
//   const [toast, setToast]         = useState(false);

//   /* Profile fields */
//   const [profile, setProfile] = useState({
//     name:    user.name    || "Anjali Sharma",
//     phone:   user.phone   || "9876543210",
//     village: user.village || "Bihta",
//     block:   user.block   || "Bihta Block",
//     district:user.district|| "Patna",
//     state:   user.state   || "Bihar",
//     empId:   user.empId   || "ASHA-BR-2024-0471",
//     phc:     user.phc     || "PHC Bihta",
//   });

//   /* Toggles */
//   const [notifs, setNotifs] = useState({
//     visitReminders: true,
//     vaccineAlerts:  true,
//     highRiskAlerts: true,
//     weeklyReport:   false,
//     smsAlerts:      true,
//     soundEnabled:   true,
//   });
//   const [privacy, setPrivacy] = useState({
//     twoFactor:       false,
//     shareData:       true,
//     offlineMode:     true,
//     autoLock:        true,
//   });
//   const [appearance, setAppearance] = useState({
//     language:  "hinglish",
//     fontSize:  "medium",
//     theme:     "light",
//     colorMode: "green",
//   });

//   const showToast = () => {
//     setToast(true);
//     setTimeout(() => setToast(false), 2500);
//   };

//   const handleLogout = () => {
//     if (window.confirm("क्या आप लॉग आउट करना चाहते हैं?")) {
//       if (logoutUser) logoutUser();
//       navigate("/login");
//     }
//   };

//   /* ── Toggle helper ── */
//   const Toggle = ({ checked, onChange }) => (
//     <label className="toggle-wrap">
//       <input type="checkbox" className="toggle-input" checked={checked} onChange={e => onChange(e.target.checked)} />
//       <span className="toggle-slider" />
//     </label>
//   );

//   /* ── Section renderers ── */
//   const renderProfile = () => (
//     <>
//       <div className="settings-section">
//         <div className="profile-avatar-wrap">
//           <div className="profile-avatar">
//             {profile.name.split(" ").map(n => n[0]).join("").slice(0, 2).toUpperCase()}
//           </div>
//           <div>
//             <div style={{ fontSize: 18, fontWeight: 700, color: "var(--text-dark)" }}>{profile.name}</div>
//             <div style={{ fontSize: 13, color: "var(--text-muted)", marginTop: 2 }}>{profile.empId}</div>
//             <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{profile.phc} · {profile.block}</div>
//             <span className="badge badge-green" style={{ marginTop: 8, display: "inline-flex" }}>✅ Verified ASHA Worker</span>
//           </div>
//         </div>

//         <div className="profile-form-grid">
//           {[
//             { label: "Full Name",   key: "name",     placeholder: "Your full name"  },
//             { label: "Phone",       key: "phone",    placeholder: "10-digit mobile" },
//             { label: "Village",     key: "village",  placeholder: "Your village"    },
//             { label: "Block",       key: "block",    placeholder: "Block name"      },
//             { label: "District",    key: "district", placeholder: "District"        },
//             { label: "State",       key: "state",    placeholder: "State",  disabled: true },
//             { label: "PHC Name",    key: "phc",      placeholder: "PHC name"        },
//             { label: "Employee ID", key: "empId",    placeholder: "ASHA ID", disabled: true },
//           ].map(f => (
//             <div key={f.key} className="pf-group">
//               <label className="pf-label">{f.label}</label>
//               <input
//                 className="pf-input"
//                 placeholder={f.placeholder}
//                 value={profile[f.key]}
//                 disabled={f.disabled}
//                 onChange={e => setProfile(p => ({ ...p, [f.key]: e.target.value }))}
//               />
//             </div>
//           ))}
//         </div>

//         <div style={{ marginTop: 20, display: "flex", gap: 10 }}>
//           <button className="btn-primary" onClick={showToast}>💾 Save Profile</button>
//           <button className="btn-secondary">📷 Change Photo</button>
//         </div>
//       </div>
//     </>
//   );

//   const renderNotifications = () => (
//     <div className="settings-section">
//       <div className="settings-section-label">Visit & Patient Alerts</div>
//       {[
//         { key: "visitReminders", label: "Visit Reminders",       desc: "Remind me before scheduled home visits" },
//         { key: "vaccineAlerts",  label: "Vaccine Due Alerts",    desc: "Alert when a child's vaccine is due" },
//         { key: "highRiskAlerts", label: "High-Risk Alerts",      desc: "Notify for RED triage cases immediately" },
//         { key: "weeklyReport",   label: "Weekly Summary",        desc: "Email weekly performance report" },
//       ].map(n => (
//         <div key={n.key} className="setting-row">
//           <div>
//             <div className="setting-label">{n.label}</div>
//             <div className="setting-desc">{n.desc}</div>
//           </div>
//           <Toggle checked={notifs[n.key]} onChange={v => setNotifs(s => ({ ...s, [n.key]: v }))} />
//         </div>
//       ))}

//       <div className="settings-section-label" style={{ marginTop: 20 }}>Delivery Method</div>
//       {[
//         { key: "smsAlerts",   label: "SMS Alerts",     desc: "Send alerts via SMS to registered number" },
//         { key: "soundEnabled",label: "Sound & Vibration", desc: "Play sound for urgent notifications" },
//       ].map(n => (
//         <div key={n.key} className="setting-row">
//           <div>
//             <div className="setting-label">{n.label}</div>
//             <div className="setting-desc">{n.desc}</div>
//           </div>
//           <Toggle checked={notifs[n.key]} onChange={v => setNotifs(s => ({ ...s, [n.key]: v }))} />
//         </div>
//       ))}

//       <div style={{ marginTop: 20 }}>
//         <button className="btn-primary" onClick={showToast}>💾 Save Preferences</button>
//       </div>
//     </div>
//   );

//   const renderLanguage = () => (
//     <div className="settings-section">
//       <div className="settings-section-label">App Language</div>
//       <div className="setting-row">
//         <div>
//           <div className="setting-label">Display Language</div>
//           <div className="setting-desc">Choose how the app communicates with you</div>
//         </div>
//         <select className="settings-select" value={appearance.language}
//           onChange={e => setAppearance(a => ({ ...a, language: e.target.value }))}>
//           <option value="hinglish">Hinglish (हिंदी + English)</option>
//           <option value="hindi">हिंदी only</option>
//           <option value="english">English only</option>
//           <option value="bhojpuri">Bhojpuri</option>
//           <option value="maithili">Maithili</option>
//         </select>
//       </div>

//       <div className="settings-section-label" style={{ marginTop: 20 }}>AI Assistant Language</div>
//       <div className="setting-row">
//         <div>
//           <div className="setting-label">AI Response Language</div>
//           <div className="setting-desc">GramSehat AI will respond in this language</div>
//         </div>
//         <select className="settings-select">
//           <option>Hinglish (Recommended)</option>
//           <option>Hindi only</option>
//           <option>English only</option>
//         </select>
//       </div>

//       <div className="setting-row">
//         <div>
//           <div className="setting-label">Voice Input Language</div>
//           <div className="setting-desc">Language for mic / voice triage input</div>
//         </div>
//         <select className="settings-select">
//           <option>Hindi (hi-IN)</option>
//           <option>English (en-IN)</option>
//           <option>Bhojpuri</option>
//         </select>
//       </div>

//       <div style={{ marginTop: 20 }}>
//         <button className="btn-primary" onClick={showToast}>💾 Save Language</button>
//       </div>
//     </div>
//   );

//   const renderSync = () => {
//     const storage = 68; // mock %
//     return (
//       <div className="settings-section">
//         <div className="settings-section-label">Sync Status</div>
//         {[
//           { label: "Patient Records",    status: "green",  text: "Synced 2 min ago"    },
//           { label: "Immunisation Logs",  status: "green",  text: "Synced 5 min ago"    },
//           { label: "Visit Schedule",     status: "green",  text: "Synced 12 min ago"   },
//           { label: "Reports & Analytics",status: "yellow", text: "Pending — 3 records" },
//           { label: "Triage History",     status: "green",  text: "Synced just now"     },
//         ].map((s, i) => (
//           <div key={i} className="setting-row">
//             <div style={{ display: "flex", alignItems: "center", gap: 10 }}>
//               <div className={`sync-dot ${s.status}`} />
//               <div>
//                 <div className="setting-label">{s.label}</div>
//                 <div className="setting-desc">{s.text}</div>
//               </div>
//             </div>
//             <button className="btn-secondary" style={{ fontSize: 12, padding: "6px 12px" }}>Sync</button>
//           </div>
//         ))}

//         <div className="settings-section-label" style={{ marginTop: 20 }}>Offline Storage</div>
//         <div style={{ fontSize: 13, color: "var(--text-mid)", display: "flex", justifyContent: "space-between" }}>
//           <span>Used: 136 MB</span><span>Total: 200 MB</span>
//         </div>
//         <div className="storage-bar">
//           <div className="storage-fill" style={{ width: `${storage}%` }} />
//         </div>
//         <div style={{ fontSize: 12, color: "var(--text-muted)" }}>{storage}% of offline storage used</div>

//         <div className="settings-section-label" style={{ marginTop: 20 }}>Sync Settings</div>
//         {[
//           { key: "offlineMode", label: "Offline Mode",   desc: "Save data locally when no internet" },
//         ].map(n => (
//           <div key={n.key} className="setting-row">
//             <div>
//               <div className="setting-label">{n.label}</div>
//               <div className="setting-desc">{n.desc}</div>
//             </div>
//             <Toggle checked={privacy[n.key]} onChange={v => setPrivacy(s => ({ ...s, [n.key]: v }))} />
//           </div>
//         ))}

//         <div style={{ marginTop: 16, display: "flex", gap: 10 }}>
//           <button className="btn-primary" onClick={showToast}>🔄 Sync All Now</button>
//           <button className="btn-secondary">🗑️ Clear Cache</button>
//         </div>
//       </div>
//     );
//   };

//   const renderAppearance = () => (
//     <div className="settings-section">
//       <div className="settings-section-label">Display</div>
//       <div className="setting-row">
//         <div>
//           <div className="setting-label">Theme</div>
//           <div className="setting-desc">Light or dark mode for the app</div>
//         </div>
//         <select className="settings-select" value={appearance.theme}
//           onChange={e => setAppearance(a => ({ ...a, theme: e.target.value }))}>
//           <option value="light">Light</option>
//           <option value="dark">Dark</option>
//           <option value="system">System Default</option>
//         </select>
//       </div>

//       <div className="setting-row">
//         <div>
//           <div className="setting-label">Font Size</div>
//           <div className="setting-desc">Adjust text size for readability</div>
//         </div>
//         <select className="settings-select" value={appearance.fontSize}
//           onChange={e => setAppearance(a => ({ ...a, fontSize: e.target.value }))}>
//           <option value="small">Small</option>
//           <option value="medium">Medium (Default)</option>
//           <option value="large">Large</option>
//           <option value="xlarge">Extra Large</option>
//         </select>
//       </div>

//       <div className="settings-section-label" style={{ marginTop: 20 }}>Colour Theme</div>
//       <div style={{ display: "flex", gap: 12, flexWrap: "wrap", marginBottom: 8 }}>
//         {[
//           { key: "green",  color: "#25a045", label: "Forest Green (Default)" },
//           { key: "blue",   color: "#1565c0", label: "Sky Blue" },
//           { key: "purple", color: "#7b1fa2", label: "Violet" },
//           { key: "orange", color: "#e65100", label: "Sunrise" },
//         ].map(c => (
//           <div key={c.key}
//             onClick={() => setAppearance(a => ({ ...a, colorMode: c.key }))}
//             style={{
//               width: 36, height: 36, borderRadius: "50%", background: c.color, cursor: "pointer",
//               border: appearance.colorMode === c.key ? `3px solid ${c.color}` : "3px solid transparent",
//               boxShadow: appearance.colorMode === c.key ? `0 0 0 3px ${c.color}40` : "none",
//               transition: "all .2s",
//             }}
//             title={c.label}
//           />
//         ))}
//       </div>

//       <div style={{ marginTop: 20 }}>
//         <button className="btn-primary" onClick={showToast}>💾 Save Appearance</button>
//       </div>
//     </div>
//   );

//   const renderPrivacy = () => (
//     <div className="settings-section">
//       <div className="settings-section-label">Security</div>
//       {[
//         { key: "twoFactor", label: "Two-Factor Authentication", desc: "Require OTP on every login" },
//         { key: "autoLock",  label: "Auto-Lock",                 desc: "Lock app after 5 minutes of inactivity" },
//       ].map(n => (
//         <div key={n.key} className="setting-row">
//           <div>
//             <div className="setting-label">{n.label}</div>
//             <div className="setting-desc">{n.desc}</div>
//           </div>
//           <Toggle checked={privacy[n.key]} onChange={v => setPrivacy(s => ({ ...s, [n.key]: v }))} />
//         </div>
//       ))}

//       <div className="setting-row">
//         <div>
//           <div className="setting-label">Change Password</div>
//           <div className="setting-desc">Update your login password</div>
//         </div>
//         <button className="btn-secondary" style={{ fontSize: 12, padding: "7px 14px" }}>Change →</button>
//       </div>

//       <div className="settings-section-label" style={{ marginTop: 20 }}>Data Privacy</div>
//       {[
//         { key: "shareData", label: "Share Anonymous Data", desc: "Help improve GramSehat by sharing usage data (no patient info)" },
//       ].map(n => (
//         <div key={n.key} className="setting-row">
//           <div>
//             <div className="setting-label">{n.label}</div>
//             <div className="setting-desc">{n.desc}</div>
//           </div>
//           <Toggle checked={privacy[n.key]} onChange={v => setPrivacy(s => ({ ...s, [n.key]: v }))} />
//         </div>
//       ))}

//       <div className="setting-row">
//         <div>
//           <div className="setting-label">Download My Data</div>
//           <div className="setting-desc">Export all your patient records and activity logs</div>
//         </div>
//         <button className="btn-secondary" style={{ fontSize: 12, padding: "7px 14px" }}>📥 Export</button>
//       </div>

//       <div style={{ marginTop: 20 }}>
//         <button className="btn-primary" onClick={showToast}>💾 Save Privacy Settings</button>
//       </div>
//     </div>
//   );

//   const renderAccount = () => (
//     <>
//       <div className="settings-section">
//         <div className="settings-section-label">Account Info</div>
//         {[
//           { label: "Email",         val: user.email  || "anjali.sharma@gramsehat.in" },
//           { label: "Employee ID",   val: profile.empId },
//           { label: "Account Type",  val: "ASHA Worker — Primary" },
//           { label: "Member Since",  val: "January 2024" },
//           { label: "Last Login",    val: new Date().toLocaleDateString("en-IN", { day: "numeric", month: "short", year: "numeric" }) },
//         ].map((r, i) => (
//           <div key={i} className="setting-row">
//             <div className="setting-label">{r.label}</div>
//             <div style={{ fontSize: 13, color: "var(--text-mid)", fontWeight: 600 }}>{r.val}</div>
//           </div>
//         ))}
//       </div>

//       <div className="settings-section">
//         <div className="settings-section-label">App Info</div>
//         {[
//           { label: "App Version",   val: "v2.4.1" },
//           { label: "Build",         val: "2026.04.12" },
//           { label: "Server Region", val: "Asia South (Mumbai)" },
//         ].map((r, i) => (
//           <div key={i} className="setting-row">
//             <div className="setting-label">{r.label}</div>
//             <div style={{ fontSize: 13, color: "var(--text-muted)" }}>{r.val}</div>
//           </div>
//         ))}
//         <div style={{ marginTop: 14 }}>
//           <button className="btn-secondary" onClick={showToast}>🔄 Check for Updates</button>
//         </div>
//       </div>

//       <div className="settings-section">
//         <div className="settings-section-label" style={{ color: "#c62828" }}>Danger Zone</div>
//         <div className="danger-zone">
//           <div style={{ display: "flex", alignItems: "center", justifyContent: "space-between", marginBottom: 16 }}>
//             <div>
//               <div className="danger-title">🚪 Log Out</div>
//               <div className="danger-desc">You will need to log in again to access the app.</div>
//             </div>
//             <button className="btn-danger-outline" onClick={handleLogout}>Log Out</button>
//           </div>
//           <div style={{ borderTop: "1px solid rgba(198,40,40,0.15)", paddingTop: 16, display: "flex", alignItems: "center", justifyContent: "space-between" }}>
//             <div>
//               <div className="danger-title">🗑️ Delete Account</div>
//               <div className="danger-desc">Permanently delete your account and all data. This cannot be undone.</div>
//             </div>
//             <button className="btn-danger"
//               onClick={() => window.confirm("Are you sure? This cannot be undone.") && navigate("/login")}>
//               Delete
//             </button>
//           </div>
//         </div>
//       </div>
//     </>
//   );

//   const PANELS = {
//     profile:       { title: "Profile Settings",         sub: "Update your personal and work information",          render: renderProfile       },
//     notifications: { title: "Notification Preferences", sub: "Control when and how you receive alerts",            render: renderNotifications },
//     language:      { title: "Language & Region",         sub: "Choose your preferred language and AI response mode",render: renderLanguage      },
//     sync:          { title: "Data & Sync",               sub: "Manage offline storage and data synchronisation",    render: renderSync          },
//     appearance:    { title: "Appearance",                sub: "Customise how the app looks and feels",              render: renderAppearance    },
//     privacy:       { title: "Privacy & Security",        sub: "Control your data, security, and account access",   render: renderPrivacy       },
//     account:       { title: "Account & App Info",        sub: "Account details, app version, and danger zone",     render: renderAccount       },
//   };

//   const active = PANELS[activeTab];

//   return (
//     <>
//       <style>{sharedStyles + pageStyles}</style>
//       <Sidebar />
//       <Topbar page="Settings" />

//       <div className="d-layout">
//         <div className="d-content">
//           <div className="page-header">
//             <div>
//               <div className="page-title">⚙️ Settings</div>
//               <div className="page-subtitle">Manage your profile, preferences, and account</div>
//             </div>
//           </div>

//           <div className="settings-layout">
//             {/* Left nav */}
//             <div className="settings-nav">
//               {NAV.map((n, i) => (
//                 <React.Fragment key={n.key}>
//                   {i === NAV.length - 1 && <div className="settings-nav-divider" />}
//                   <div
//                     className={`settings-nav-item ${activeTab === n.key ? "active" : ""}`}
//                     onClick={() => setActiveTab(n.key)}
//                   >
//                     <div className="nav-ico">{n.ico}</div>
//                     {n.label}
//                   </div>
//                 </React.Fragment>
//               ))}
//             </div>

//             {/* Right panel */}
//             <div className="settings-panel" key={activeTab}>
//               <div className="settings-panel-header">
//                 <div className="settings-panel-title">{active.title}</div>
//                 <div className="settings-panel-sub">{active.sub}</div>
//               </div>
//               {active.render()}
//             </div>
//           </div>
//         </div>
//       </div>

//       {toast && (
//         <div className="save-toast">✅ Settings saved successfully!</div>
//       )}
//     </>
//   );
// }



import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useTranslation } from "react-i18next";
import { Sidebar, Topbar, sharedStyles } from "../components/Layout.jsx";
import { getCurrentUser, logoutUser } from "./utils/auth.js";


const pageStyles = `
  .settings-layout {
    display: grid; grid-template-columns: 240px 1fr; gap: 24px; align-items: start;
  }
  @media (max-width: 900px) { .settings-layout { grid-template-columns: 1fr; } }

  .settings-nav {
    background: #fff; border-radius: 16px; border: 1px solid var(--border);
    box-shadow: var(--card-shadow); overflow: hidden; position: sticky; top: 24px;
  }
  .settings-nav-item {
    display: flex; align-items: center; gap: 12px; padding: 13px 18px;
    cursor: pointer; font-size: 13.5px; font-weight: 600; color: var(--text-mid);
    border-left: 3px solid transparent; transition: all .18s; font-family: 'DM Sans', sans-serif;
  }
  .settings-nav-item:hover { background: #f6fbf7; color: var(--text-dark); }
  .settings-nav-item.active { background: var(--green-pale); color: var(--green-mid); border-left-color: var(--green-bright); }
  .settings-nav-item .nav-ico { width: 32px; height: 32px; border-radius: 8px; display: flex; align-items: center; justify-content: center; font-size: 15px; flex-shrink: 0; }
  .settings-nav-item.active .nav-ico { background: rgba(37,160,69,0.15); }
  .settings-nav-item:not(.active) .nav-ico { background: #f0f5f1; }
  .settings-nav-divider { height: 1px; background: #f0f5f1; margin: 4px 0; }

  .settings-panel { background: #fff; border-radius: 16px; border: 1px solid var(--border); box-shadow: var(--card-shadow); overflow: hidden; animation: fadeUp .35s ease both; }
  .settings-panel-header { padding: 22px 24px 18px; border-bottom: 1px solid #f0f5f1; }
  .settings-panel-title { font-family: 'DM Serif Display', serif; font-size: 20px; color: var(--text-dark); margin-bottom: 4px; }
  .settings-panel-sub { font-size: 13px; color: var(--text-muted); }
  .settings-section { padding: 22px 24px; border-bottom: 1px solid #f0f5f1; }
  .settings-section:last-child { border-bottom: none; }
  .settings-section-label { font-size: 11px; font-weight: 700; text-transform: uppercase; letter-spacing: .07em; color: var(--text-muted); margin-bottom: 16px; }

  .setting-row { display: flex; align-items: center; justify-content: space-between; padding: 13px 0; border-bottom: 1px solid #f8faf8; }
  .setting-row:last-child { border-bottom: none; }
  .setting-label { font-size: 14px; font-weight: 600; color: var(--text-dark); }
  .setting-desc  { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  .toggle-wrap { position: relative; width: 48px; height: 26px; flex-shrink: 0; }
  .toggle-input { opacity: 0; width: 0; height: 0; position: absolute; }
  .toggle-slider { position: absolute; cursor: pointer; inset: 0; background: #d1d9d4; border-radius: 26px; transition: background .25s; }
  .toggle-slider::before { content: ''; position: absolute; width: 20px; height: 20px; left: 3px; bottom: 3px; background: #fff; border-radius: 50%; transition: transform .25s; box-shadow: 0 1px 4px rgba(0,0,0,0.18); }
  .toggle-input:checked + .toggle-slider { background: var(--green-mid); }
  .toggle-input:checked + .toggle-slider::before { transform: translateX(22px); }

  .settings-select { padding: 8px 14px; border-radius: 10px; border: 1.5px solid var(--border); background: #f8faf8; font-size: 13px; color: var(--text-dark); font-family: 'DM Sans', sans-serif; cursor: pointer; transition: border-color .18s; min-width: 160px; }
  .settings-select:focus { outline: none; border-color: var(--green-bright); background: #fff; }

  .profile-avatar-wrap { display: flex; align-items: center; gap: 20px; margin-bottom: 24px; }
  .profile-avatar { width: 72px; height: 72px; border-radius: 50%; background: linear-gradient(135deg, #25a045, #1a7a34); display: flex; align-items: center; justify-content: center; font-size: 26px; font-weight: 700; color: #fff; flex-shrink: 0; border: 3px solid rgba(37,160,69,0.25); }
  .profile-form-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
  .pf-group { display: flex; flex-direction: column; gap: 6px; }
  .pf-label { font-size: 12px; font-weight: 700; color: var(--text-muted); text-transform: uppercase; letter-spacing: .05em; }
  .pf-input { padding: 10px 14px; border-radius: 10px; border: 1.5px solid var(--border); background: #f8faf8; font-size: 13.5px; color: var(--text-dark); font-family: 'DM Sans', sans-serif; transition: border-color .18s; }
  .pf-input:focus { outline: none; border-color: var(--green-bright); background: #fff; }
  .pf-input:disabled { opacity: .5; cursor: not-allowed; }

  /* Language cards */
  .lang-card-grid { display: grid; grid-template-columns: repeat(3,1fr); gap: 12px; margin-bottom: 20px; }
  .lang-card {
    border: 2px solid var(--border); border-radius: 14px; padding: 16px 12px;
    text-align: center; cursor: pointer; transition: all .2s; background: #fff;
  }
  .lang-card:hover { border-color: var(--green-bright); background: var(--green-pale); }
  .lang-card.selected { border-color: var(--green-mid); background: var(--green-pale); box-shadow: 0 0 0 3px rgba(37,160,69,0.15); }
  .lang-card .lc-flag  { font-size: 28px; margin-bottom: 8px; }
  .lang-card .lc-name  { font-size: 14px; font-weight: 700; color: var(--text-dark); }
  .lang-card .lc-sub   { font-size: 11px; color: var(--text-muted); margin-top: 3px; }
  .lang-card .lc-check { font-size: 18px; color: var(--green-mid); margin-bottom: 6px; }

  .danger-zone { background: #fff8f8; border-radius: 12px; border: 1px solid rgba(198,40,40,0.2); padding: 18px 20px; }
  .danger-title { font-size: 14px; font-weight: 700; color: #c62828; margin-bottom: 4px; }
  .danger-desc  { font-size: 13px; color: #b71c1c; opacity: .8; margin-bottom: 14px; }

  .sync-dot { width: 8px; height: 8px; border-radius: 50%; flex-shrink: 0; }
  .sync-dot.green  { background: #4caf50; box-shadow: 0 0 0 3px rgba(76,175,80,.2); }
  .sync-dot.yellow { background: #ffb300; box-shadow: 0 0 0 3px rgba(255,179,0,.2); }
  .storage-bar { height: 10px; background: #edf3ef; border-radius: 10px; overflow: hidden; margin: 10px 0 6px; }
  .storage-fill { height: 100%; border-radius: 10px; background: linear-gradient(90deg, #25a045, #4caf50); transition: width .6s ease; }

  .save-toast { position: fixed; bottom: 32px; right: 32px; background: var(--green-mid); color: #fff; padding: 14px 22px; border-radius: 12px; font-size: 14px; font-weight: 600; box-shadow: 0 8px 24px rgba(37,160,69,0.35); animation: slideUp .3s ease; z-index: 999; }
  @keyframes slideUp { from { transform: translateY(20px); opacity: 0; } to { transform: translateY(0); opacity: 1; } }

  .btn-danger { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; background: #c62828; color: #fff; font-size: 13px; font-weight: 700; border: none; cursor: pointer; font-family: 'DM Sans', sans-serif; transition: background .18s; }
  .btn-danger:hover { background: #b71c1c; }
  .btn-danger-outline { display: inline-flex; align-items: center; gap: 8px; padding: 10px 20px; border-radius: 10px; background: transparent; color: #c62828; font-size: 13px; font-weight: 700; border: 1.5px solid rgba(198,40,40,0.4); cursor: pointer; font-family: 'DM Sans', sans-serif; transition: all .18s; }
  .btn-danger-outline:hover { background: #ffebee; }
`;

const LANG_OPTIONS = [
  { code: 'hinglish', flag: '🇮🇳', name: 'Hinglish', sub: 'हिंदी + English (Recommended)' },
  { code: 'hi',       flag: '🇮🇳', name: 'हिंदी',    sub: 'Hindi only' },
  { code: 'en',       flag: '🇬🇧', name: 'English',  sub: 'English only' },
];

export default function SettingsPage() {
  const navigate = useNavigate();
  const { t, i18n } = useTranslation();
  const user = getCurrentUser() || {};

  const [activeTab, setActiveTab] = useState("profile");
  const [toast, setToast] = useState(false);

  const [profile, setProfile] = useState({
    name: user.name || "Anjali Sharma", phone: user.phone || "9876543210",
    village: user.village || "Bihta", block: user.block || "Bihta Block",
    district: user.district || "Patna", state: user.state || "Bihar",
    empId: user.empId || "ASHA-BR-2024-0471", phc: user.phc || "PHC Bihta",
  });

  const [notifs, setNotifs] = useState({ visitReminders:true, vaccineAlerts:true, highRiskAlerts:true, weeklyReport:false, smsAlerts:true, soundEnabled:true });
  const [privacy, setPrivacy] = useState({ twoFactor:false, shareData:true, offlineMode:true, autoLock:true });
  const [appearance, setAppearance] = useState({ fontSize:"medium", theme:"light", colorMode:"green" });

  const showToast = () => { setToast(true); setTimeout(() => setToast(false), 2500); };

  const handleLogout = () => {
    if (window.confirm(t('auth.logoutConfirm'))) {
      if (logoutUser) logoutUser();
      navigate("/login");
    }
  };

  const changeLang = (code) => {
    i18n.changeLanguage(code);
    localStorage.setItem('gramsehat_lang', code);
  };

  const Toggle = ({ checked, onChange }) => (
    <label className="toggle-wrap">
      <input type="checkbox" className="toggle-input" checked={checked} onChange={e => onChange(e.target.checked)} />
      <span className="toggle-slider" />
    </label>
  );

  /* ── NAV ── */
  const NAV = [
    { key:"profile",       label: t('settings.nav.profile'),       ico:"👤" },
    { key:"notifications", label: t('settings.nav.notifications'), ico:"🔔" },
    { key:"language",      label: t('settings.nav.language'),      ico:"🌐" },
    { key:"sync",          label: t('settings.nav.sync'),          ico:"🔄" },
    { key:"appearance",    label: t('settings.nav.appearance'),    ico:"🎨" },
    { key:"privacy",       label: t('settings.nav.privacy'),       ico:"🔒" },
    { key:"account",       label: t('settings.nav.account'),       ico:"⚙️" },
  ];

  /* ── SECTION RENDERERS ── */
  const renderProfile = () => (
    <div className="settings-section">
      <div className="profile-avatar-wrap">
        <div className="profile-avatar">{profile.name.split(" ").map(n=>n[0]).join("").slice(0,2).toUpperCase()}</div>
        <div>
          <div style={{fontSize:18,fontWeight:700,color:"var(--text-dark)"}}>{profile.name}</div>
          <div style={{fontSize:13,color:"var(--text-muted)",marginTop:2}}>{profile.empId}</div>
          <div style={{fontSize:13,color:"var(--text-muted)"}}>{profile.phc} · {profile.block}</div>
          <span className="badge badge-green" style={{marginTop:8,display:"inline-flex"}}>✅ {t('settings.profile.verified')}</span>
        </div>
      </div>
      <div className="profile-form-grid">
        {[
          { label: t('settings.profile.fields.name'),     key:"name",     disabled:false },
          { label: t('settings.profile.fields.phone'),    key:"phone",    disabled:false },
          { label: t('settings.profile.fields.village'),  key:"village",  disabled:false },
          { label: t('settings.profile.fields.block'),    key:"block",    disabled:false },
          { label: t('settings.profile.fields.district'), key:"district", disabled:false },
          { label: t('settings.profile.fields.state'),    key:"state",    disabled:true  },
          { label: t('settings.profile.fields.phc'),      key:"phc",      disabled:false },
          { label: t('settings.profile.fields.empId'),    key:"empId",    disabled:true  },
        ].map(f => (
          <div key={f.key} className="pf-group">
            <label className="pf-label">{f.label}</label>
            <input className="pf-input" value={profile[f.key]} disabled={f.disabled}
              onChange={e => setProfile(p => ({...p,[f.key]:e.target.value}))} />
          </div>
        ))}
      </div>
      <div style={{marginTop:20,display:"flex",gap:10}}>
        <button className="btn-primary" onClick={showToast}>💾 {t('settings.profile.saveProfile')}</button>
        <button className="btn-secondary">📷 {t('settings.profile.changePhoto')}</button>
      </div>
    </div>
  );

  const renderNotifications = () => (
    <div className="settings-section">
      {[
        {key:"visitReminders", label:t('settings.notifications.visitReminders'), desc:t('settings.notifications.visitDesc')},
        {key:"vaccineAlerts",  label:t('settings.notifications.vaccineAlerts'),  desc:t('settings.notifications.vaccineDesc')},
        {key:"highRiskAlerts", label:t('settings.notifications.highRisk'),       desc:t('settings.notifications.highRiskDesc')},
        {key:"weeklyReport",   label:t('settings.notifications.weeklyReport'),   desc:t('settings.notifications.weeklyDesc')},
        {key:"smsAlerts",      label:t('settings.notifications.smsAlerts'),      desc:t('settings.notifications.smsDesc')},
        {key:"soundEnabled",   label:t('settings.notifications.sound'),          desc:t('settings.notifications.soundDesc')},
      ].map(n => (
        <div key={n.key} className="setting-row">
          <div><div className="setting-label">{n.label}</div><div className="setting-desc">{n.desc}</div></div>
          <Toggle checked={notifs[n.key]} onChange={v => setNotifs(s=>({...s,[n.key]:v}))} />
        </div>
      ))}
      <div style={{marginTop:20}}><button className="btn-primary" onClick={showToast}>💾 {t('settings.notifications.save')}</button></div>
    </div>
  );

  const renderLanguage = () => (
    <div className="settings-section">
      {/* Visual language card picker */}
      <div className="settings-section-label">{t('settings.language.displayLang')}</div>
      <p style={{fontSize:13,color:"var(--text-muted)",marginBottom:16}}>{t('settings.language.displayDesc')}</p>
      <div className="lang-card-grid">
        {LANG_OPTIONS.map(l => (
          <div key={l.code} className={`lang-card ${i18n.language === l.code ? 'selected' : ''}`}
            onClick={() => changeLang(l.code)}>
            {i18n.language === l.code && <div className="lc-check">✓</div>}
            <div className="lc-flag">{l.flag}</div>
            <div className="lc-name">{l.name}</div>
            <div className="lc-sub">{l.sub}</div>
          </div>
        ))}
      </div>

      {/* Quick switcher preview */}
      <div style={{background:"var(--green-pale)",border:"1px solid rgba(37,160,69,0.2)",borderRadius:12,padding:"14px 16px",marginBottom:20}}>
        <div style={{fontSize:12,fontWeight:700,color:"var(--green-mid)",marginBottom:8}}>🌐 Quick Language Switcher</div>
        <div style={{fontSize:13,color:"var(--text-mid)",marginBottom:10}}>
          This dropdown is available in the top bar on every page:
        </div>
        
      </div>

      <div className="settings-section-label" style={{marginTop:4}}>{t('settings.language.aiLang')}</div>
      <div className="setting-row">
        <div><div className="setting-label">{t('settings.language.aiLang')}</div><div className="setting-desc">{t('settings.language.aiDesc')}</div></div>
        <select className="settings-select">
          <option>Hinglish (Recommended)</option><option>Hindi only</option><option>English only</option>
        </select>
      </div>
      <div className="setting-row">
        <div><div className="setting-label">{t('settings.language.voiceLang')}</div><div className="setting-desc">{t('settings.language.voiceDesc')}</div></div>
        <select className="settings-select">
          <option>Hindi (hi-IN)</option><option>English (en-IN)</option>
        </select>
      </div>
      <div style={{marginTop:20}}><button className="btn-primary" onClick={showToast}>💾 {t('settings.language.save')}</button></div>
    </div>
  );

  const renderSync = () => {
    const storage = 68;
    return (
      <div className="settings-section">
        <div className="settings-section-label">{t('settings.sync.syncStatus')}</div>
        {[
          {label:t('settings.sync.items.patients'),    status:"green",  text:"Synced 2 min ago"},
          {label:t('settings.sync.items.immunisation'),status:"green",  text:"Synced 5 min ago"},
          {label:t('settings.sync.items.schedule'),    status:"green",  text:"Synced 12 min ago"},
          {label:t('settings.sync.items.reports'),     status:"yellow", text:"Pending — 3 records"},
          {label:t('settings.sync.items.triage'),      status:"green",  text:"Synced just now"},
        ].map((s,i) => (
          <div key={i} className="setting-row">
            <div style={{display:"flex",alignItems:"center",gap:10}}>
              <div className={`sync-dot ${s.status}`} />
              <div><div className="setting-label">{s.label}</div><div className="setting-desc">{s.text}</div></div>
            </div>
            <button className="btn-secondary" style={{fontSize:12,padding:"6px 12px"}}>Sync</button>
          </div>
        ))}
        <div className="settings-section-label" style={{marginTop:20}}>{t('settings.sync.storage')}</div>
        <div style={{fontSize:13,color:"var(--text-mid)",display:"flex",justifyContent:"space-between"}}>
          <span>{t('settings.sync.used',{used:136})}</span><span>{t('settings.sync.total',{total:200})}</span>
        </div>
        <div className="storage-bar"><div className="storage-fill" style={{width:`${storage}%`}} /></div>
        <div style={{fontSize:12,color:"var(--text-muted)"}}>{t('settings.sync.storageUsed',{pct:storage})}</div>
        <div style={{marginTop:16,display:"flex",gap:10}}>
          <button className="btn-primary" onClick={showToast}>🔄 {t('settings.sync.syncNow')}</button>
          <button className="btn-secondary">🗑️ {t('settings.sync.clearCache')}</button>
        </div>
      </div>
    );
  };

  const renderAppearance = () => (
    <div className="settings-section">
      <div className="setting-row">
        <div><div className="setting-label">{t('settings.appearance.theme')}</div><div className="setting-desc">{t('settings.appearance.themeDesc')}</div></div>
        <select className="settings-select" value={appearance.theme} onChange={e=>setAppearance(a=>({...a,theme:e.target.value}))}>
          <option value="light">{t('settings.appearance.themes.light')}</option>
          <option value="dark">{t('settings.appearance.themes.dark')}</option>
          <option value="system">{t('settings.appearance.themes.system')}</option>
        </select>
      </div>
      <div className="setting-row">
        <div><div className="setting-label">{t('settings.appearance.fontSize')}</div><div className="setting-desc">{t('settings.appearance.fontDesc')}</div></div>
        <select className="settings-select" value={appearance.fontSize} onChange={e=>setAppearance(a=>({...a,fontSize:e.target.value}))}>
          <option value="small">{t('settings.appearance.sizes.small')}</option>
          <option value="medium">{t('settings.appearance.sizes.medium')}</option>
          <option value="large">{t('settings.appearance.sizes.large')}</option>
          <option value="xlarge">{t('settings.appearance.sizes.xlarge')}</option>
        </select>
      </div>
      <div className="settings-section-label" style={{marginTop:20}}>{t('settings.appearance.colourTheme')}</div>
      <div style={{display:"flex",gap:12,flexWrap:"wrap",marginBottom:8}}>
        {[{key:"green",color:"#25a045"},{key:"blue",color:"#1565c0"},{key:"purple",color:"#7b1fa2"},{key:"orange",color:"#e65100"}].map(c=>(
          <div key={c.key} onClick={()=>setAppearance(a=>({...a,colorMode:c.key}))}
            style={{width:36,height:36,borderRadius:"50%",background:c.color,cursor:"pointer",border:appearance.colorMode===c.key?`3px solid ${c.color}`:"3px solid transparent",boxShadow:appearance.colorMode===c.key?`0 0 0 3px ${c.color}40`:"none",transition:"all .2s"}} />
        ))}
      </div>
      <div style={{marginTop:20}}><button className="btn-primary" onClick={showToast}>💾 {t('settings.appearance.save')}</button></div>
    </div>
  );

  const renderPrivacy = () => (
    <div className="settings-section">
      {[
        {key:"twoFactor",label:t('settings.privacy.twoFactor'), desc:t('settings.privacy.twoFactorDesc')},
        {key:"autoLock", label:t('settings.privacy.autoLock'),  desc:t('settings.privacy.autoLockDesc')},
      ].map(n=>(
        <div key={n.key} className="setting-row">
          <div><div className="setting-label">{n.label}</div><div className="setting-desc">{n.desc}</div></div>
          <Toggle checked={privacy[n.key]} onChange={v=>setPrivacy(s=>({...s,[n.key]:v}))} />
        </div>
      ))}
      <div className="setting-row">
        <div><div className="setting-label">{t('settings.privacy.changePass')}</div><div className="setting-desc">{t('settings.privacy.changePassDesc')}</div></div>
        <button className="btn-secondary" style={{fontSize:12,padding:"7px 14px"}}>Change →</button>
      </div>
      {[{key:"shareData",label:t('settings.privacy.shareData'),desc:t('settings.privacy.shareDataDesc')}].map(n=>(
        <div key={n.key} className="setting-row">
          <div><div className="setting-label">{n.label}</div><div className="setting-desc">{n.desc}</div></div>
          <Toggle checked={privacy[n.key]} onChange={v=>setPrivacy(s=>({...s,[n.key]:v}))} />
        </div>
      ))}
      <div className="setting-row">
        <div><div className="setting-label">{t('settings.privacy.downloadData')}</div><div className="setting-desc">{t('settings.privacy.downloadDesc')}</div></div>
        <button className="btn-secondary" style={{fontSize:12,padding:"7px 14px"}}>📥 Export</button>
      </div>
      <div style={{marginTop:20}}><button className="btn-primary" onClick={showToast}>💾 {t('settings.privacy.save')}</button></div>
    </div>
  );

  const renderAccount = () => (
    <>
      <div className="settings-section">
        {[
          {label:t('settings.account.email'),       val:user.email||"anjali.sharma@gramsehat.in"},
          {label:t('settings.account.empId'),        val:profile.empId},
          {label:t('settings.account.accountType'),  val:"ASHA Worker — Primary"},
          {label:t('settings.account.memberSince'),  val:"January 2024"},
          {label:t('settings.account.lastLogin'),    val:new Date().toLocaleDateString("en-IN",{day:"numeric",month:"short",year:"numeric"})},
        ].map((r,i)=>(
          <div key={i} className="setting-row">
            <div className="setting-label">{r.label}</div>
            <div style={{fontSize:13,color:"var(--text-mid)",fontWeight:600}}>{r.val}</div>
          </div>
        ))}
      </div>
      <div className="settings-section">
        {[
          {label:t('settings.account.appVersion'), val:"v2.4.1"},
          {label:t('settings.account.build'),       val:"2026.04.12"},
          {label:t('settings.account.serverRegion'),val:"Asia South (Mumbai)"},
        ].map((r,i)=>(
          <div key={i} className="setting-row">
            <div className="setting-label">{r.label}</div>
            <div style={{fontSize:13,color:"var(--text-muted)"}}>{r.val}</div>
          </div>
        ))}
        <div style={{marginTop:14}}><button className="btn-secondary" onClick={showToast}>🔄 {t('settings.account.checkUpdates')}</button></div>
      </div>
      <div className="settings-section">
        <div className="settings-section-label" style={{color:"#c62828"}}>{t('settings.account.dangerZone')}</div>
        <div className="danger-zone">
          <div style={{display:"flex",alignItems:"center",justifyContent:"space-between",marginBottom:16}}>
            <div>
              <div className="danger-title">🚪 {t('settings.account.logout')}</div>
              <div className="danger-desc">{t('settings.account.logoutDesc')}</div>
            </div>
            <button className="btn-danger-outline" onClick={handleLogout}>{t('settings.account.logout')}</button>
          </div>
          <div style={{borderTop:"1px solid rgba(198,40,40,0.15)",paddingTop:16,display:"flex",alignItems:"center",justifyContent:"space-between"}}>
            <div>
              <div className="danger-title">🗑️ {t('settings.account.deleteAccount')}</div>
              <div className="danger-desc">{t('settings.account.deleteDesc')}</div>
            </div>
            <button className="btn-danger" onClick={()=>window.confirm(t('settings.account.deleteConfirm'))&&navigate("/login")}>
              {t('common.delete')}
            </button>
          </div>
        </div>
      </div>
    </>
  );

  const PANELS = {
    profile:       { title:t('settings.profile.title'),        sub:t('settings.profile.sub'),        render:renderProfile       },
    notifications: { title:t('settings.notifications.title'),  sub:t('settings.notifications.sub'),  render:renderNotifications },
    language:      { title:t('settings.language.title'),       sub:t('settings.language.sub'),       render:renderLanguage      },
    sync:          { title:t('settings.sync.title'),           sub:t('settings.sync.sub'),           render:renderSync          },
    appearance:    { title:t('settings.appearance.title'),     sub:t('settings.appearance.sub'),     render:renderAppearance    },
    privacy:       { title:t('settings.privacy.title'),        sub:t('settings.privacy.sub'),        render:renderPrivacy       },
    account:       { title:t('settings.account.title'),        sub:t('settings.account.sub'),        render:renderAccount       },
  };

  const active = PANELS[activeTab];

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>
      <Sidebar />
      <Topbar page={t('settings.title')} />

      <div className="d-layout">
        <div className="d-content">
          <div className="page-header">
            <div>
              <div className="page-title">⚙️ {t('settings.title')}</div>
              <div className="page-subtitle">{t('settings.subtitle')}</div>
            </div>
            
          </div>

          <div className="settings-layout">
            <div className="settings-nav">
              {NAV.map((n,i) => (
                <React.Fragment key={n.key}>
                  {i === NAV.length - 1 && <div className="settings-nav-divider" />}
                  <div className={`settings-nav-item ${activeTab===n.key?"active":""}`} onClick={()=>setActiveTab(n.key)}>
                    <div className="nav-ico">{n.ico}</div>
                    {n.label}
                  </div>
                </React.Fragment>
              ))}
            </div>

            <div className="settings-panel" key={activeTab}>
              <div className="settings-panel-header">
                <div className="settings-panel-title">{active.title}</div>
                <div className="settings-panel-sub">{active.sub}</div>
              </div>
              {active.render()}
            </div>
          </div>
        </div>
      </div>

      {toast && <div className="save-toast">✅ {t('common.save')} — Done!</div>}
    </>
  );
}