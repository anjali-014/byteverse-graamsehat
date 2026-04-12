import React, { useState, useRef, useEffect } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { getCurrentUser, logoutUser } from "../pages/utils/auth.js";

export const sharedStyles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-deep:    #0d3a1c;
    --green-mid:     #1b6530;
    --green-bright:  #25a045;
    --green-glow:    #3dcc66;
    --green-pale:    #e8f5ec;
    --cream:         #fdfcf8;
    --border:        rgba(30,100,50,0.14);
    --text-dark:     #0f1e13;
    --text-mid:      #3a5942;
    --text-muted:    #7a9e82;
    --card-shadow:   0 2px 20px rgba(13,58,28,0.08);
    --sidebar-w:     256px;
  }

  html, body, #root {
    height: 100%; font-family: 'DM Sans', sans-serif;
    background: #f0f5f1; color: var(--text-dark);
  }

  /* ─── SIDEBAR ─────────────────────────────────── */
  .d-sidebar {
    position: fixed; top: 0; left: 0; bottom: 0;
    width: var(--sidebar-w); z-index: 200;
    background: var(--green-deep);
    display: flex; flex-direction: column;
    padding: 0 0 24px;
    box-shadow: 4px 0 32px rgba(0,0,0,0.18);
  }
  .d-sidebar-logo {
    display: flex; align-items: center; gap: 10px;
    padding: 22px 24px 20px;
    border-bottom: 1px solid rgba(255,255,255,0.08);
    text-decoration: none; cursor: pointer; background: none; border-bottom: 1px solid rgba(255,255,255,0.08);
  }
  .d-sidebar-logo-leaf { font-size: 22px; }
  .d-sidebar-logo-name {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: #fff; letter-spacing: -.3px;
  }
  .d-nav { flex: 1; padding: 16px 12px; overflow-y: auto; }
  .d-nav-section {
    font-size: 10px; font-weight: 700; letter-spacing: .12em;
    text-transform: uppercase; color: rgba(255,255,255,0.35);
    padding: 14px 12px 6px;
  }
  .d-nav-item {
    display: flex; align-items: center; gap: 11px;
    padding: 10px 12px; border-radius: 10px;
    font-size: 13.5px; font-weight: 500; color: rgba(255,255,255,0.65);
    cursor: pointer; transition: all .2s; margin-bottom: 2px;
    text-decoration: none; border: none; background: none; width: 100%;
    text-align: left; font-family: 'DM Sans', sans-serif;
  }
  .d-nav-item:hover { background: rgba(255,255,255,0.08); color: #fff; }
  .d-nav-item.active {
    background: rgba(61,204,102,0.18);
    color: #80ffaa; font-weight: 600;
    border: 1px solid rgba(61,204,102,0.22);
  }
  .d-nav-item .d-nav-ico {
    width: 32px; height: 32px; border-radius: 8px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 15px; background: rgba(255,255,255,0.06);
  }
  .d-nav-item.active .d-nav-ico { background: rgba(61,204,102,0.22); }
  .d-nav-badge {
    margin-left: auto; background: var(--green-bright);
    color: #fff; font-size: 10px; font-weight: 700;
    padding: 2px 7px; border-radius: 50px;
  }
  .d-sidebar-user {
    margin: 0 12px; padding: 12px 14px;
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.10);
    border-radius: 12px;
    display: flex; align-items: center; gap: 10px;
    cursor: pointer; transition: background .2s; position: relative;
  }
  .d-sidebar-user:hover { background: rgba(255,255,255,0.11); }
  .d-sidebar-avatar {
    width: 36px; height: 36px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-bright), var(--green-glow));
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff; flex-shrink: 0;
  }
  .d-sidebar-user-info { flex: 1; min-width: 0; }
  .d-sidebar-user-name {
    font-size: 13px; font-weight: 700; color: #fff;
    white-space: nowrap; overflow: hidden; text-overflow: ellipsis;
  }
  .d-sidebar-user-role { font-size: 11px; color: rgba(255,255,255,0.45); }
  .d-profile-dropdown {
    position: absolute; bottom: calc(100% + 8px); left: 0; right: 0;
    background: #fff; border-radius: 12px;
    box-shadow: 0 8px 32px rgba(0,0,0,0.18);
    border: 1px solid var(--border);
    overflow: hidden; z-index: 500;
    animation: dd-fadeUp .18s ease both;
  }
  @keyframes dd-fadeUp {
    from { opacity: 0; transform: translateY(6px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  .d-dd-header { padding: 14px 16px; background: var(--green-pale); border-bottom: 1px solid #d8eadb; }
  .d-dd-name { font-size: 14px; font-weight: 700; color: var(--text-dark); }
  .d-dd-id   { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .d-dd-item {
    display: flex; align-items: center; gap: 10px;
    padding: 11px 16px; font-size: 13.5px; color: var(--text-mid);
    cursor: pointer; transition: background .15s; font-weight: 500;
    border: none; background: none; width: 100%;
    text-align: left; font-family: 'DM Sans', sans-serif;
  }
  .d-dd-item:hover { background: #f4faf5; color: var(--text-dark); }
  .d-dd-item.danger { color: #c62828; }
  .d-dd-item.danger:hover { background: #fff5f5; }
  .d-dd-divider { height: 1px; background: #edf3ef; margin: 4px 0; }

  /* ─── TOPBAR ──────────────────────────────────── */
  .d-topbar {
    position: fixed; top: 0;
    left: var(--sidebar-w); right: 0; z-index: 100;
    height: 64px;
    background: rgba(253,252,248,0.95);
    backdrop-filter: blur(18px) saturate(180%);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center;
    padding: 0 32px; gap: 16px;
    box-shadow: 0 2px 20px rgba(13,58,28,0.06);
  }
  .d-topbar-breadcrumb {
    font-size: 13px; color: var(--text-muted); font-weight: 500;
    display: flex; align-items: center; gap: 6px;
  }
  .d-topbar-breadcrumb strong { color: var(--text-dark); font-weight: 700; }
  .d-topbar-search {
    flex: 1; max-width: 360px; margin-left: 24px;
    display: flex; align-items: center; gap: 9px;
    background: #fff; border: 1.5px solid #ddeae0;
    border-radius: 50px; padding: 8px 16px;
    transition: border-color .2s, box-shadow .2s;
  }
  .d-topbar-search:focus-within {
    border-color: var(--green-bright);
    box-shadow: 0 0 0 3px rgba(37,160,69,0.10);
  }
  .d-topbar-search input {
    border: none; outline: none; font-size: 13.5px;
    font-family: 'DM Sans', sans-serif; color: var(--text-dark);
    background: transparent; width: 100%;
  }
  .d-topbar-search input::placeholder { color: #b4c8b8; }
  .d-topbar-right { margin-left: auto; display: flex; align-items: center; gap: 12px; }
  .d-topbar-greeting { font-size: 13.5px; color: var(--text-mid); font-weight: 500; }
  .d-topbar-greeting strong { color: var(--green-mid); font-weight: 700; }
  .d-topbar-notif {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: #fff; border: 1.5px solid #ddeae0;
    cursor: pointer; transition: all .2s; position: relative; font-size: 16px;
  }
  .d-topbar-notif:hover { background: var(--green-pale); border-color: var(--green-bright); }
  .d-notif-dot {
    position: absolute; top: 6px; right: 6px;
    width: 8px; height: 8px; border-radius: 50%;
    background: #ef5350; border: 2px solid white;
  }
  .d-topbar-avatar {
    width: 38px; height: 38px; border-radius: 50%;
    background: linear-gradient(135deg, var(--green-bright), var(--green-glow));
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff; cursor: pointer;
    border: 2px solid var(--green-pale); transition: all .2s; flex-shrink: 0;
  }
  .d-topbar-avatar:hover { border-color: var(--green-bright); transform: scale(1.05); }

  /* ─── LAYOUT ──────────────────────────────────── */
  .d-layout { margin-left: var(--sidebar-w); padding-top: 64px; min-height: 100vh; }
  .d-content { padding: 28px 32px 48px; }

  /* ─── CARDS ───────────────────────────────────── */
  .d-card {
    background: #fff; border-radius: 16px;
    box-shadow: var(--card-shadow); border: 1px solid var(--border);
    overflow: hidden; animation: fadeUp .55s ease both;
  }
  .d-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 22px 14px; border-bottom: 1px solid #edf3ef;
  }
  .d-card-title {
    font-size: 14px; font-weight: 700; color: var(--text-dark);
    display: flex; align-items: center; gap: 8px;
  }
  .d-card-action {
    font-size: 12.5px; color: var(--green-mid); font-weight: 600;
    cursor: pointer; text-decoration: none;
    background: none; border: none; font-family: 'DM Sans', sans-serif;
  }
  .d-card-action:hover { text-decoration: underline; }
  .d-card-body { padding: 16px 22px 20px; }

  /* ─── BUTTONS ─────────────────────────────────── */
  .btn-primary {
    padding: 10px 20px; border: none; border-radius: 50px;
    background: linear-gradient(135deg, var(--green-mid), var(--green-bright));
    color: #fff; font-size: 13.5px; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    box-shadow: 0 4px 14px rgba(27,101,48,0.35);
    transition: all .22s; display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-primary:hover { transform: translateY(-2px); box-shadow: 0 8px 22px rgba(27,101,48,0.45); }
  .btn-secondary {
    padding: 10px 20px; border: 1.5px solid var(--border); border-radius: 50px;
    background: #fff; color: var(--text-mid); font-size: 13.5px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer; transition: all .2s;
    display: inline-flex; align-items: center; gap: 8px;
  }
  .btn-secondary:hover { border-color: var(--green-bright); color: var(--green-mid); background: var(--green-pale); }

  /* ─── PAGE HEADER ─────────────────────────────── */
  .page-header {
    display: flex; align-items: center; justify-content: space-between;
    margin-bottom: 24px;
  }
  .page-title {
    font-family: 'DM Serif Display', serif;
    font-size: 26px; color: var(--text-dark); margin-bottom: 4px;
  }
  .page-subtitle { font-size: 13.5px; color: var(--text-muted); font-weight: 500; }

  /* ─── BADGE / STATUS ──────────────────────────── */
  .badge {
    font-size: 11px; font-weight: 700; padding: 3px 10px; border-radius: 50px;
    display: inline-flex; align-items: center; gap: 4px;
  }
  .badge-green   { background: #e8f5e9; color: #2e7d32; }
  .badge-yellow  { background: #fff8e1; color: #f57f17; }
  .badge-red     { background: #ffebee; color: #c62828; }
  .badge-blue    { background: #e3f2fd; color: #1565c0; }
  .badge-purple  { background: #f3e5f5; color: #7b1fa2; }
  .badge-gray    { background: #f5f5f5; color: #616161; }

  /* ─── TABLE ───────────────────────────────────── */
  .gs-table { width: 100%; border-collapse: collapse; }
  .gs-table th {
    text-align: left; font-size: 11px; font-weight: 700;
    text-transform: uppercase; letter-spacing: .08em;
    color: var(--text-muted); padding: 10px 14px;
    border-bottom: 2px solid #edf3ef; background: #fafcfa;
  }
  .gs-table td { padding: 12px 14px; font-size: 13.5px; color: var(--text-mid); border-bottom: 1px solid #f0f5f1; vertical-align: middle; }
  .gs-table tr:last-child td { border-bottom: none; }
  .gs-table tr:hover td { background: #f6fbf7; }
  .gs-table td strong { color: var(--text-dark); font-weight: 600; }

  /* ─── FORM ────────────────────────────────────── */
  .gs-form-group { margin-bottom: 18px; }
  .gs-label { font-size: 12.5px; font-weight: 600; color: var(--text-mid); margin-bottom: 6px; display: block; }
  .gs-input, .gs-select, .gs-textarea {
    width: 100%; padding: 10px 14px; border: 1.5px solid #ddeae0;
    border-radius: 10px; font-size: 13.5px; font-family: 'DM Sans', sans-serif;
    color: var(--text-dark); background: #fff; transition: border-color .2s, box-shadow .2s;
    outline: none;
  }
  .gs-input:focus, .gs-select:focus, .gs-textarea:focus {
    border-color: var(--green-bright); box-shadow: 0 0 0 3px rgba(37,160,69,0.10);
  }
  .gs-textarea { resize: vertical; min-height: 90px; }

  /* ─── MODAL ───────────────────────────────────── */
  .gs-modal-backdrop {
    position: fixed; inset: 0; background: rgba(0,0,0,0.45);
    z-index: 900; display: flex; align-items: center; justify-content: center;
    padding: 24px; animation: fadeIn .18s ease;
  }
  .gs-modal {
    background: #fff; border-radius: 20px; width: 100%; max-width: 520px;
    box-shadow: 0 24px 64px rgba(0,0,0,0.22); overflow: hidden;
    animation: slideUp .22s ease;
  }
  .gs-modal-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 20px 24px; border-bottom: 1px solid #edf3ef;
    background: var(--green-pale);
  }
  .gs-modal-title { font-family: 'DM Serif Display', serif; font-size: 18px; color: var(--text-dark); }
  .gs-modal-close {
    width: 32px; height: 32px; border-radius: 50%; background: rgba(0,0,0,0.06);
    border: none; cursor: pointer; font-size: 16px;
    display: flex; align-items: center; justify-content: center;
    transition: background .2s;
  }
  .gs-modal-close:hover { background: rgba(0,0,0,0.12); }
  .gs-modal-body { padding: 24px; }
  .gs-modal-footer {
    padding: 16px 24px; border-top: 1px solid #edf3ef;
    display: flex; gap: 10px; justify-content: flex-end;
  }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
  @keyframes fadeIn {
    from { opacity: 0; } to { opacity: 1; }
  }
  @keyframes slideUp {
    from { opacity: 0; transform: translateY(24px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

export function Sidebar({ activePage, patientCount = 0 }) {
  const navigate = useNavigate();
  const location = useLocation();
  const [dropdown, setDropdown] = useState(false);
  const dropRef = useRef(null);

  const currentUser = getCurrentUser();
  const user = {
    name: currentUser?.name || "ASHA Worker",
    id: currentUser?.ashaId || currentUser?.id || "ASHA-BR-1042",
    village: currentUser?.village || "Bodh Gaya Block",
    initials: currentUser?.name
      ? currentUser.name.split(" ").filter(Boolean).slice(0, 2).map(s => s[0].toUpperCase()).join("")
      : "AS",
  };

  const navItems = [
    { ico: "🏠", label: "Home",      route: "/homepage" },
    { ico: "👥", label: "My Patients",    badge: patientCount > 0 ? patientCount.toString() : null, route: "/mypatients" },
    { ico: "🤖", label: "AI Diagnosis",   route: "/aidiagnosis" },
    { ico: "📅", label: "Visit Schedule", route: "/visitschedule" },
    { ico: "💉", label: "Immunisation",   route: "/immunisation" },
    { ico: "📋", label: "Health Records", route: "/healthrecords" },
    { ico: "📊", label: "Reports",        route: "/reports" },
  ];

  useEffect(() => {
    function handle(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  return (
    <aside className="d-sidebar">
      <div className="d-sidebar-logo" onClick={() => navigate('/homepage')} style={{ border: 'none', borderBottom: '1px solid rgba(255,255,255,0.08)' }}>
        <span className="d-sidebar-logo-leaf">🌿</span>
        <span className="d-sidebar-logo-name">GraamSehat</span>
      </div>

      <nav className="d-nav">
        <div className="d-nav-section">Main Menu</div>
        {navItems.map((item) => (
          <button
            key={item.label}
            className={`d-nav-item${location.pathname === item.route ? " active" : ""}`}
            onClick={() => navigate(item.route)}
          >
            <span className="d-nav-ico">{item.ico}</span>
            {item.label}
            {item.badge && <span className="d-nav-badge">{item.badge}</span>}
          </button>
        ))}

        <div className="d-nav-section" style={{ marginTop: 12 }}>Support</div>
        <button className="d-nav-item" onClick={() => navigate('/settings')}>
          <span className="d-nav-ico">⚙️</span> Settings
        </button>
        <button className="d-nav-item" onClick={() => alert('Help Center: Call 104 or contact your ASHA Supervisor for assistance.')}>
          <span className="d-nav-ico">❓</span> Help
        </button>
      </nav>

      <div className="d-sidebar-user" ref={dropRef} onClick={() => setDropdown(p => !p)}>
        <div className="d-sidebar-avatar">{user.initials}</div>
        <div className="d-sidebar-user-info">
          <div className="d-sidebar-user-name">{user.name}</div>
          <div className="d-sidebar-user-role">{user.id}</div>
        </div>
        <span style={{ color: 'rgba(255,255,255,0.4)', fontSize: 12 }}>▲</span>

        {dropdown && (
          <div className="d-profile-dropdown">
            <div className="d-dd-header">
              <div className="d-dd-name">{user.name}</div>
              <div className="d-dd-id">{user.id} · {user.village}</div>
            </div>
            {[
              { ico: "👤", label: "View Profile", action: () => navigate('/profile') },
              { ico: "⚙️", label: "Account Settings", action: () => navigate('/settings') },
              { ico: "🔔", label: "Notifications", action: () => alert('Notification Settings: Configure your alert preferences here.') },
              { ico: "🌐", label: "Language / भाषा", action: () => alert('Language Setting: Switch between English and Hindi. Coming soon!') },
            ].map(item => (
              <button key={item.label} className="d-dd-item" onClick={item.action}>
                <span>{item.ico}</span> {item.label}
              </button>
            ))}
            <div className="d-dd-divider" />
            <button className="d-dd-item danger" onClick={handleLogout}>
              <span>🚪</span> Log Out
            </button>
          </div>
        )}
      </div>
    </aside>
  );
}

export function Topbar({ page, children }) {
  const navigate = useNavigate();
  const currentUser = getCurrentUser();
  const user = {
    name: currentUser?.name || "ASHA Worker",
    initials: currentUser?.name
      ? currentUser.name.split(" ").filter(Boolean).slice(0, 2).map(s => s[0].toUpperCase()).join("")
      : "AS",
  };
  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  return (
    <header className="d-topbar">
      <div className="d-topbar-breadcrumb">
        <span style={{ cursor: 'pointer', color: 'var(--text-muted)' }} onClick={() => navigate('/homepage')}>GraamSehat</span>
        &nbsp;›&nbsp; <strong>{page}</strong>
      </div>
      <div className="d-topbar-search">
        <span style={{ color: "#b4c8b8", fontSize: 15 }}>🔍</span>
        <input placeholder="Search patients, records…" />
      </div>
      <div className="d-topbar-right">
        {children}
        <span className="d-topbar-greeting">
          {greeting()}, <strong>{user.name.split(" ")[0]}</strong> 👋
        </span>
        <div className="d-topbar-notif">
          🔔 <span className="d-notif-dot" />
        </div>
        <div className="d-topbar-avatar">{user.initials}</div>
      </div>
    </header>
  );
}