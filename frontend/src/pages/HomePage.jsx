




import React, { useState, useRef, useEffect } from "react";
import {useNavigate } from "react-router-dom";
import { getCurrentUser, logoutUser } from "./utils/auth.js";

const styles = `
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
    text-decoration: none;
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
    font-size: 15px;
    background: rgba(255,255,255,0.06);
  }
  .d-nav-item.active .d-nav-ico {
    background: rgba(61,204,102,0.22);
  }
  .d-nav-badge {
    margin-left: auto; background: var(--green-bright);
    color: #fff; font-size: 10px; font-weight: 700;
    padding: 2px 7px; border-radius: 50px;
  }

  /* User card at bottom of sidebar */
  .d-sidebar-user {
    margin: 0 12px;
    padding: 12px 14px;
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
  .d-sidebar-user-chevron { color: rgba(255,255,255,0.4); font-size: 12px; }

  /* Profile dropdown */
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
  .d-dd-header {
    padding: 14px 16px; background: var(--green-pale);
    border-bottom: 1px solid #d8eadb;
  }
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

  .d-topbar-greeting {
    font-size: 13.5px; color: var(--text-mid); font-weight: 500;
  }
  .d-topbar-greeting strong { color: var(--green-mid); font-weight: 700; }

  .d-topbar-notif {
    width: 38px; height: 38px; border-radius: 50%;
    display: flex; align-items: center; justify-content: center;
    background: #fff; border: 1.5px solid #ddeae0;
    cursor: pointer; transition: all .2s; position: relative;
    font-size: 16px;
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
    border: 2px solid var(--green-pale); transition: all .2s;
    flex-shrink: 0;
  }
  .d-topbar-avatar:hover { border-color: var(--green-bright); transform: scale(1.05); }

  /* ─── MAIN CONTENT ────────────────────────────── */
  .d-layout {
    margin-left: var(--sidebar-w);
    padding-top: 64px;
    min-height: 100vh;
  }
  .d-content { padding: 28px 32px 48px; }

  /* ─── HERO GREETING BANNER ────────────────────── */
  .d-hero {
    border-radius: 20px; overflow: hidden;
    position: relative; margin-bottom: 28px;
    min-height: 168px;
    display: flex; align-items: flex-end;
    padding: 28px 36px;
  }
  .d-hero-bg {
    position: absolute; inset: 0;
    background-image: url('https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=1200&q=85&auto=format&fit=crop');
    background-size: cover; background-position: center 35%;
  }
  .d-hero-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(90deg,
      rgba(8,28,14,0.88) 0%,
      rgba(8,28,14,0.55) 55%,
      rgba(8,28,14,0.20) 100%);
  }
  .d-hero-content { position: relative; z-index: 2; flex: 1; }
  .d-hero-greeting {
    font-size: 13px; color: rgba(255,255,255,0.65); font-weight: 500;
    margin-bottom: 6px; letter-spacing: .04em;
  }
  .d-hero-name {
    font-family: 'DM Serif Display', serif;
    font-size: 32px; color: #fff; line-height: 1.15; margin-bottom: 10px;
  }
  .d-hero-name em { font-style: italic; color: #80ffaa; }
  .d-hero-meta {
    display: flex; align-items: center; gap: 16px; flex-wrap: wrap;
  }
  .d-hero-tag {
    display: flex; align-items: center; gap: 6px;
    background: rgba(255,255,255,0.12);
    border: 1px solid rgba(255,255,255,0.2);
    border-radius: 50px; padding: 5px 12px;
    font-size: 12px; color: rgba(255,255,255,0.85); font-weight: 500;
  }
  .d-hero-right { position: relative; z-index: 2; }
  .d-hero-btn {
    padding: 11px 22px; border: none; border-radius: 50px;
    background: linear-gradient(135deg, var(--green-mid), var(--green-bright));
    color: #fff; font-size: 13.5px; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    box-shadow: 0 4px 16px rgba(27,101,48,0.4);
    transition: all .22s;
  }
  .d-hero-btn:hover { transform: translateY(-2px); box-shadow: 0 8px 24px rgba(27,101,48,0.5); }

  /* ─── STATS ROW ───────────────────────────────── */
  .d-stats-row {
    display: grid; grid-template-columns: repeat(4, 1fr);
    gap: 16px; margin-bottom: 24px;
  }
  .d-stat-card {
    background: #fff; border-radius: 16px;
    padding: 20px 22px;
    box-shadow: var(--card-shadow);
    border: 1px solid var(--border);
    transition: transform .22s, box-shadow .22s;
    animation: fadeUp .55s ease both;
  }
  .d-stat-card:hover { transform: translateY(-3px); box-shadow: 0 8px 32px rgba(13,58,28,0.12); }
  .d-stat-card:nth-child(1) { animation-delay: .05s; }
  .d-stat-card:nth-child(2) { animation-delay: .10s; }
  .d-stat-card:nth-child(3) { animation-delay: .15s; }
  .d-stat-card:nth-child(4) { animation-delay: .20s; }

  .d-stat-top { display: flex; align-items: center; justify-content: space-between; margin-bottom: 12px; }
  .d-stat-ico {
    width: 42px; height: 42px; border-radius: 11px;
    display: flex; align-items: center; justify-content: center;
    font-size: 19px;
  }
  .d-stat-ico.green { background: rgba(37,160,69,0.12); border: 1px solid rgba(37,160,69,0.2); }
  .d-stat-ico.blue  { background: rgba(2,119,189,0.10); border: 1px solid rgba(2,119,189,0.18); }
  .d-stat-ico.amber { background: rgba(255,152,0,0.12); border: 1px solid rgba(255,152,0,0.2); }
  .d-stat-ico.rose  { background: rgba(233,30,99,0.10); border: 1px solid rgba(233,30,99,0.18); }
  .d-stat-trend {
    font-size: 11.5px; font-weight: 600; padding: 3px 8px; border-radius: 50px;
  }
  .d-stat-trend.up   { background: #e8f5e9; color: #2e7d32; }
  .d-stat-trend.down { background: #fff3e0; color: #e65100; }
  .d-stat-val {
    font-family: 'DM Serif Display', serif;
    font-size: 30px; color: var(--text-dark); line-height: 1;
    margin-bottom: 4px;
  }
  .d-stat-label { font-size: 13px; color: var(--text-muted); font-weight: 500; }

  /* ─── TWO-COL GRID ────────────────────────────── */
  .d-grid-2 { display: grid; grid-template-columns: 1.55fr 1fr; gap: 20px; margin-bottom: 24px; }
  .d-grid-3 { display: grid; grid-template-columns: repeat(3, 1fr); gap: 20px; margin-bottom: 24px; }

  .d-card {
    background: #fff; border-radius: 16px;
    box-shadow: var(--card-shadow); border: 1px solid var(--border);
    overflow: hidden;
    animation: fadeUp .55s ease both;
  }
  .d-card-header {
    display: flex; align-items: center; justify-content: space-between;
    padding: 18px 22px 14px;
    border-bottom: 1px solid #edf3ef;
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

  /* Patient list */
  .d-patient-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid #f0f5f1;
    transition: background .15s; cursor: pointer; border-radius: 8px;
    padding-left: 6px; padding-right: 6px;
  }
  .d-patient-item:last-child { border-bottom: none; }
  .d-patient-item:hover { background: #f6fbf7; }
  .d-patient-avatar {
    width: 38px; height: 38px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; font-weight: 700; color: #fff;
  }
  .d-patient-info { flex: 1; min-width: 0; }
  .d-patient-name { font-size: 13.5px; font-weight: 600; color: var(--text-dark); }
  .d-patient-meta { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .d-patient-status {
    font-size: 11px; font-weight: 600; padding: 3px 10px; border-radius: 50px;
    flex-shrink: 0;
  }
  .d-patient-status.critical { background: #ffebee; color: #c62828; }
  .d-patient-status.stable   { background: #e8f5e9; color: #2e7d32; }
  .d-patient-status.followup { background: #fff8e1; color: #f57f17; }
  .d-patient-status.new      { background: #e3f2fd; color: #1565c0; }

  /* Activity feed */
  .d-activity-item {
    display: flex; gap: 12px; padding: 10px 0;
    border-bottom: 1px solid #f0f5f1;
  }
  .d-activity-item:last-child { border-bottom: none; }
  .d-activity-dot {
    width: 32px; height: 32px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 13px; margin-top: 2px;
  }
  .d-activity-dot.green  { background: #e8f5e9; }
  .d-activity-dot.blue   { background: #e3f2fd; }
  .d-activity-dot.amber  { background: #fff8e1; }
  .d-activity-dot.rose   { background: #fce4ec; }
  .d-activity-text { font-size: 13px; color: var(--text-mid); line-height: 1.5; flex: 1; }
  .d-activity-text strong { color: var(--text-dark); font-weight: 600; }
  .d-activity-time { font-size: 11.5px; color: var(--text-muted); flex-shrink: 0; margin-top: 3px; }

  /* Quick action tiles */
  .d-quick-tile {
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; gap: 10px;
    padding: 22px 16px; border-radius: 14px;
    background: #fff; border: 1.5px solid var(--border);
    cursor: pointer; transition: all .22s; text-align: center;
    box-shadow: var(--card-shadow);
    animation: fadeUp .55s ease both;
  }
  .d-quick-tile:hover {
    border-color: var(--green-bright);
    background: #f6fbf7;
    transform: translateY(-3px);
    box-shadow: 0 8px 28px rgba(37,160,69,0.13);
  }
  .d-quick-tile-ico {
    width: 48px; height: 48px; border-radius: 13px;
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
    background: var(--green-pale);
    border: 1px solid rgba(37,160,69,0.18);
  }
  .d-quick-tile-label { font-size: 13px; font-weight: 600; color: var(--text-dark); }
  .d-quick-tile-sub   { font-size: 11.5px; color: var(--text-muted); }

  /* Upcoming visits */
  .d-visit-item {
    display: flex; align-items: center; gap: 12px;
    padding: 10px 0; border-bottom: 1px solid #f0f5f1;
  }
  .d-visit-item:last-child { border-bottom: none; }
  .d-visit-date {
    width: 44px; height: 44px; border-radius: 11px;
    background: var(--green-pale); border: 1px solid rgba(37,160,69,0.18);
    display: flex; flex-direction: column; align-items: center;
    justify-content: center; flex-shrink: 0;
  }
  .d-visit-date-num { font-size: 15px; font-weight: 700; color: var(--green-mid); line-height: 1; }
  .d-visit-date-mon { font-size: 9px; font-weight: 600; color: var(--text-muted); text-transform: uppercase; }
  .d-visit-info { flex: 1; }
  .d-visit-name  { font-size: 13.5px; font-weight: 600; color: var(--text-dark); }
  .d-visit-meta  { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .d-visit-time  { font-size: 12px; color: var(--green-mid); font-weight: 600; flex-shrink: 0; }

  /* AI alert card */
  .d-ai-alert {
    background: linear-gradient(135deg, #0d3a1c 0%, #1b6530 100%);
    border-radius: 16px; padding: 20px 24px;
    display: flex; gap: 16px; align-items: flex-start;
    box-shadow: 0 8px 28px rgba(13,58,28,0.22);
    margin-bottom: 24px;
    animation: fadeUp .55s .1s ease both;
  }
  .d-ai-ico {
    width: 44px; height: 44px; border-radius: 12px; flex-shrink: 0;
    background: rgba(61,204,102,0.18);
    border: 1px solid rgba(61,204,102,0.3);
    display: flex; align-items: center; justify-content: center;
    font-size: 22px;
  }
  .d-ai-content { flex: 1; }
  .d-ai-label { font-size: 10px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase; color: #3dcc66; margin-bottom: 5px; }
  .d-ai-title { font-family: 'DM Serif Display', serif; font-size: 17px; color: #fff; margin-bottom: 6px; }
  .d-ai-desc  { font-size: 13px; color: rgba(255,255,255,0.68); line-height: 1.5; }
  .d-ai-btn {
    padding: 9px 18px; border: none; border-radius: 50px;
    background: rgba(61,204,102,0.22); color: #80ffaa;
    font-size: 13px; font-weight: 700; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .2s;
    border: 1px solid rgba(61,204,102,0.28); white-space: nowrap;
    align-self: center; flex-shrink: 0;
  }
  .d-ai-btn:hover { background: rgba(61,204,102,0.32); }

  @keyframes fadeUp {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;



// ── MOCK DATA ──────────────────────────────────────

const currentUser = getCurrentUser();
const user = {
  name: currentUser?.name || "ASHA Worker",
  id: currentUser?.ashaId || currentUser?.id || "ASHA-BR-1042",
  village: currentUser?.village || "Bodh Gaya Block",
  initials: currentUser?.name
    ? currentUser.name
        .split(" ")
        .filter(Boolean)
        .slice(0, 2)
        .map((segment) => segment[0].toUpperCase())
        .join("")
    : "AS",
};

const patients = [
  { id: 1, name: "Sunita Devi",    age: 32, village: "Tekari",    status: "critical", color: "#c62828", issue: "High BP · 3rd trimester" },
  { id: 2, name: "Meena Kumari",   age: 24, village: "Gaya",      status: "followup", color: "#7b1fa2", issue: "Post-natal checkup due" },
  { id: 3, name: "Radha Yadav",    age: 19, village: "Amas",      status: "new",      color: "#0277bd", issue: "First ANC registration" },
  { id: 4, name: "Savitri Singh",  age: 45, village: "Wazirganj", status: "stable",   color: "#2e7d32", issue: "Diabetes monitoring" },
  { id: 5, name: "Kamla Prasad",   age: 28, village: "Konch",     status: "stable",   color: "#e65100", issue: "Child immunisation" },
];

const activities = [
  { icon: "💊", color: "green",  text: <><strong>Sunita Devi</strong> prescribed Iron-Folic Acid via AI diagnosis</>,  time: "9 min ago" },
  { icon: "📋", color: "blue",   text: <><strong>New patient</strong> Radha Yadav added to your roster</>,             time: "1 hr ago" },
  { icon: "⚠️", color: "amber",  text: <><strong>Alert:</strong> Meena Kumari missed post-natal visit (Day 14)</>,     time: "2 hr ago" },
  { icon: "🤖", color: "green",  text: <><strong>AI flagged</strong> possible anaemia in 2 patients — review needed</>, time: "3 hr ago" },
  { icon: "✅", color: "green",  text: <><strong>Immunisation</strong> drive report submitted for April</>,             time: "Yesterday" },
  { icon: "💬", color: "rose",   text: <><strong>Supervisor</strong> Anjali Ma'am sent you a message</>,               time: "Yesterday" },
];

const visits = [
  { day: "12", mon: "Apr", name: "Sunita Devi",   purpose: "ANC Check · High Risk", time: "10:00 AM" },
  { day: "13", mon: "Apr", name: "Meena Kumari",  purpose: "Post-natal Day 15",      time: "11:30 AM" },
  { day: "14", mon: "Apr", name: "Kamla Prasad",  purpose: "Child Immunisation",     time: "9:00 AM"  },
  { day: "15", mon: "Apr", name: "Savitri Singh", purpose: "Diabetes Follow-up",     time: "3:00 PM"  },
];

const quickActions = [
  { ico: "➕", label: "New Patient",     sub: "Add to roster"   },
  { ico: "🤖", label: "AI Diagnosis",    sub: "Smart check"     },
  { ico: "💉", label: "Immunisation",    sub: "Log vaccine"     },
  { ico: "📤", label: "Submit Report",   sub: "Monthly data"    },
  { ico: "📞", label: "Helpline",        sub: "Call supervisor" },
  { ico: "📦", label: "Medicine Stock",  sub: "Check inventory" },
];

const navItems = [
  { ico: "🏠", label: "Dashboard",      active: true, route: "/homepage" },
  { ico: "👥", label: "My Patients",    badge: "23", route: "/homepage" },
  { ico: "🤖", label: "AI Diagnosis", route: "/dashboard" },
  { ico: "📅", label: "Visit Schedule", route: "/homepage" },
  { ico: "💉", label: "Immunisation", route: "/homepage" },
  { ico: "📋", label: "Health Records", route: "/homepage" },
  { ico: "📊", label: "Reports", route: "/homepage" },
];

const bottomNav = [
  { ico: "⚙️", label: "Settings"  },
  { ico: "❓", label: "Help"      },
];

export default function Dashboard() {

  const navigate = useNavigate();
  const [dropdown, setDropdown] = useState(false);
  const dropRef = useRef(null);
  const [stats, setStats] = useState({
    green: 0,
    yellow: 0,
    red: 0,
    total: 0
  });

  

  useEffect(() => {
    function handle(e) {
      if (dropRef.current && !dropRef.current.contains(e.target)) setDropdown(false);
    }
    document.addEventListener("mousedown", handle);
    return () => document.removeEventListener("mousedown", handle);
  }, []);

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const currentUser = getCurrentUser();
        const block = currentUser?.block || 'Bihta';
        const res = await fetch(`${BACKEND_URL}/api/dashboard/summary?block=${block}`);
        if (res.ok) {
          const data = await res.json();
          const totals = data.totals || [];
          const green = totals.find(t => t.triage_result === 'GREEN')?.count || 0;
          const yellow = totals.find(t => t.triage_result === 'YELLOW')?.count || 0;
          const red = totals.find(t => t.triage_result === 'RED')?.count || 0;
          setStats({ green, yellow, red, total: green + yellow + red });
        }
      } catch (err) {
        console.warn('Failed to fetch dashboard stats:', err);
      }
    };
    fetchStats();
  }, []);

  const greeting = () => {
    const h = new Date().getHours();
    if (h < 12) return "Good morning";
    if (h < 17) return "Good afternoon";
    return "Good evening";
  };

  const handleLogout = () => {
    logoutUser();
    navigate('/login');
  };

  const handleNavClick = (route) => {
    navigate(route);
  };

  return (
    <>
      <style>{styles}</style>

      {/* ── SIDEBAR ── */}
      <aside className="d-sidebar">
        <a className="d-sidebar-logo" href="#">
          <span className="d-sidebar-logo-leaf">🌿</span>
          <span className="d-sidebar-logo-name">GraamSehat</span>
        </a>

        <nav className="d-nav">
          <div className="d-nav-section">Main Menu</div>
          {navItems.map((item) => (
            <button key={item.label} className={`d-nav-item${item.active ? " active" : ""}`} onClick={() => handleNavClick(item.route)}>
              <span className="d-nav-ico">{item.ico}</span>
              {item.label}
              {item.badge && <span className="d-nav-badge">{item.badge}</span>}
            </button>
          ))}

          <div className="d-nav-section" style={{ marginTop: 12 }}>Support</div>
          {bottomNav.map((item) => (
            <button key={item.label} className="d-nav-item">
              <span className="d-nav-ico">{item.ico}</span>
              {item.label}
            </button>
          ))}
        </nav>

        {/* User card + dropdown */}
        <div className="d-sidebar-user" ref={dropRef} onClick={() => setDropdown(p => !p)}>
          <div className="d-sidebar-avatar">{user.initials}</div>
          <div className="d-sidebar-user-info">
            <div className="d-sidebar-user-name">{user.name}</div>
            <div className="d-sidebar-user-role">{user.id}</div>
          </div>
          <span className="d-sidebar-user-chevron">▲</span>

          {dropdown && (
            <div className="d-profile-dropdown">
              <div className="d-dd-header">
                <div className="d-dd-name">{user.name}</div>
                <div className="d-dd-id">{user.id} · {user.village}</div>
              </div>
              {[
                { ico: "👤", label: "View Profile" },
                { ico: "⚙️", label: "Account Settings" },
                { ico: "🔔", label: "Notifications" },
                { ico: "🌐", label: "Language / भाषा" },
              ].map(item => (
                <button key={item.label} className="d-dd-item">
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

      {/* ── TOPBAR ──  */}
      <header className="d-topbar">
        <div className="d-topbar-breadcrumb">
          GraamSehat &nbsp;›&nbsp; <strong>Dashboard</strong>
        </div>
        <div className="d-topbar-search">
          <span style={{ color: "#b4c8b8", fontSize: 15 }}>🔍</span>
          <input placeholder="Search patients, records…" />
        </div>
        <div className="d-topbar-right">
          <span className="d-topbar-greeting">
            {greeting()}, <strong>{user.name.split(" ")[0]}</strong> 👋
          </span>
          <div className="d-topbar-notif">
            🔔
            <span className="d-notif-dot" />
          </div>
          <div className="d-topbar-avatar" onClick={() => setDropdown(p => !p)}>
            {user.initials}
          </div>
        </div>
      </header> 



      {/* ── MAIN ── */}
      <div className="d-layout">
        <div className="d-content">

          {/* HERO */}
          <div className="d-hero">
            <div className="d-hero-bg" />
            <div className="d-hero-overlay" />
            <div className="d-hero-content">
              <div className="d-hero-greeting">🌿 &nbsp;{greeting()}, ASHA Worker</div>
              <div className="d-hero-name">
                Namaste, <em>{user.name.split(" ")[0]}</em>!
              </div>
              <div className="d-hero-meta">
                <div className="d-hero-tag">📍 {user.village}</div>
                <div className="d-hero-tag">🪪 {user.id}</div>
                <div className="d-hero-tag">📅 {new Date().toLocaleDateString("en-IN", { weekday: "long", day: "numeric", month: "long" })}</div>
              </div>
            </div>
            <div className="d-hero-right">
              <button className="d-hero-btn" onClick={() => navigate("/newpatient")}>
                + New Patient
              </button>
            </div>
          </div>

          {/* AI ALERT */}
          <div className="d-ai-alert">
            <div className="d-ai-ico">🤖</div>
            <div className="d-ai-content">
              <div className="d-ai-label">AI Insight · Today</div>
              <div className="d-ai-title">2 patients may need urgent follow-up</div>
              <div className="d-ai-desc">
                Sunita Devi (high BP + 3rd trimester) and Meena Kumari (missed post-natal Day 14) have been flagged by the AI diagnostic engine. Tap to review.
              </div>
            </div>
            <button className="d-ai-btn">Review Now →</button>
          </div>

          {/* STATS */}
          <div className="d-stats-row">
            {[
              { ico: "�", color: "green", val: stats.green,  label: "Green Cases",       trend: "Safe",  dir: "up" },
              { ico: "🟡", color: "amber", val: stats.yellow, label: "Yellow Cases",     trend: "Monitor", dir: "up" },
              { ico: "🔴", color: "rose",  val: stats.red,    label: "Red Cases",        trend: "Urgent", dir: "down" },
              { ico: "📊", color: "blue",  val: stats.total,  label: "Total Cases",      trend: "Today", dir: "up" },
            ].map((s, i) => (
              <div className="d-stat-card" key={i} style={{ animationDelay: `${i * 0.06}s` }}>
                <div className="d-stat-top">
                  <div className={`d-stat-ico ${s.color}`}>{s.ico}</div>
                  <span className={`d-stat-trend ${s.dir}`}>{s.trend}</span>
                </div>
                <div className="d-stat-val">{s.val}</div>
                <div className="d-stat-label">{s.label}</div>
              </div>
            ))}
          </div>

          {/* QUICK ACTIONS */}
          <div className="d-grid-3" style={{ gridTemplateColumns: "repeat(6,1fr)", marginBottom: 24 }}>
            {quickActions.map((a, i) => (
              <div className="d-quick-tile" key={i} style={{ animationDelay: `${0.1 + i * 0.05}s` }}>
                <div className="d-quick-tile-ico">{a.ico}</div>
                <div className="d-quick-tile-label">{a.label}</div>
                <div className="d-quick-tile-sub">{a.sub}</div>
              </div>
            ))}
          </div>

          {/* PATIENT LIST + ACTIVITY */}
          <div className="d-grid-2">
            {/* Patients */}
            <div className="d-card" style={{ animationDelay: ".12s" }}>
              <div className="d-card-header">
                <div className="d-card-title">👥 Recent Patients</div>
                <button className="d-card-action">View all →</button>
              </div>
              <div className="d-card-body">
                {patients.map(p => (
                  <div className="d-patient-item" key={p.id}>
                    <div className="d-patient-avatar" style={{ background: p.color }}>
                      {p.name.split(" ").map(n => n[0]).join("").slice(0, 2)}
                    </div>
                    <div className="d-patient-info">
                      <div className="d-patient-name">{p.name}</div>
                      <div className="d-patient-meta">Age {p.age} · {p.village} · {p.issue}</div>
                    </div>
                    <span className={`d-patient-status ${p.status}`}>{p.status}</span>
                  </div>
                ))}
              </div>
            </div>

            {/* Activity */}
            <div className="d-card" style={{ animationDelay: ".18s" }}>
              <div className="d-card-header">
                <div className="d-card-title">🕐 Recent Activity</div>
                <button className="d-card-action">See all</button>
              </div>
              <div className="d-card-body">
                {activities.map((a, i) => (
                  <div className="d-activity-item" key={i}>
                    <div className={`d-activity-dot ${a.color}`}>{a.icon}</div>
                    <div className="d-activity-text">{a.text}</div>
                    <div className="d-activity-time">{a.time}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* UPCOMING VISITS */}
          <div className="d-card" style={{ animationDelay: ".22s" }}>
            <div className="d-card-header">
              <div className="d-card-title">📅 Upcoming Home Visits</div>
              <button className="d-card-action">Full schedule →</button>
            </div>
            <div className="d-card-body" style={{ display: "grid", gridTemplateColumns: "repeat(2,1fr)", gap: "0 32px" }}>
              {visits.map((v, i) => (
                <div className="d-visit-item" key={i}>
                  <div className="d-visit-date">
                    <div className="d-visit-date-num">{v.day}</div>
                    <div className="d-visit-date-mon">{v.mon}</div>
                  </div>
                  <div className="d-visit-info">
                    <div className="d-visit-name">{v.name}</div>
                    <div className="d-visit-meta">{v.purpose}</div>
                  </div>
                  <div className="d-visit-time">{v.time}</div>
                </div>
              ))}
            </div>
          </div>

        </div>
      </div>
    </>
  );
}
