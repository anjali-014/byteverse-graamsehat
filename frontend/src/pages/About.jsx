import React, { useState, useEffect, useRef } from "react";

const styles = `
  @import url('https://fonts.googleapis.com/css2?family=DM+Serif+Display:ital@0;1&family=DM+Sans:opsz,wght@9..40,300;9..40,400;9..40,500;9..40,600;9..40,700&display=swap');

  *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }

  :root {
    --green-deep:    #0d3a1c;
    --green-mid:     #1b6530;
    --green-bright:  #25a045;
    --green-glow:    #3dcc66;
    --green-pale:    #e8f5ec;
    --green-light:   #f2faf4;
    --cream:         #fdfcf8;
    --border:        rgba(30,100,50,0.14);
    --text-dark:     #0f1e13;
    --text-mid:      #3a5942;
    --text-muted:    #7a9e82;
    --card-shadow:   0 2px 24px rgba(13,58,28,0.07);
  }

  html, body, #root {
    font-family: 'DM Sans', sans-serif;
    background: var(--cream);
    color: var(--text-dark);
    scroll-behavior: smooth;
  }

  /* ── NAVBAR ── */
  .ab-nav {
    position: fixed; top: 0; left: 0; right: 0; z-index: 300;
    height: 64px;
    background: rgba(253,252,248,0.96);
    backdrop-filter: blur(20px) saturate(180%);
    border-bottom: 1px solid var(--border);
    display: flex; align-items: center; justify-content: space-between;
    padding: 0 52px;
    box-shadow: 0 2px 20px rgba(13,58,28,0.07);
  }
  .ab-logo {
    display: flex; align-items: center; gap: 10px;
    text-decoration: none; cursor: pointer;
  }
  .ab-logo-leaf { font-size: 22px; }
  .ab-logo-name {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: var(--text-dark); letter-spacing: -.3px;
  }
  .ab-nav-links { display: flex; gap: 32px; }
  .ab-nav-links a {
    font-size: 13.5px; color: var(--text-mid); text-decoration: none;
    font-weight: 500; transition: color .2s; position: relative;
  }
  .ab-nav-links a.active { color: var(--green-mid); font-weight: 700; }
  .ab-nav-links a.active::after {
    content: ''; position: absolute; bottom: -4px; left: 0; right: 0;
    height: 2px; background: var(--green-bright); border-radius: 2px;
  }
  .ab-nav-links a:hover { color: var(--green-mid); }
  .ab-nav-actions { display: flex; gap: 10px; }
  .ab-btn-out {
    padding: 8px 22px; border: 2px solid var(--green-mid); border-radius: 50px;
    color: var(--green-mid); background: transparent;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .2s;
  }
  .ab-btn-out:hover { background: var(--green-pale); }
  .ab-btn-fill {
    padding: 8px 22px; border: none; border-radius: 50px;
    background: var(--green-mid); color: white;
    font-size: 13.5px; font-weight: 600; cursor: pointer;
    font-family: 'DM Sans', sans-serif; transition: all .2s;
  }
  .ab-btn-fill:hover { background: var(--green-deep); }

  /* ── PAGE WRAPPER ── */
  .ab-page { padding-top: 64px; }

  /* ── HERO ── */
  .ab-hero {
    position: relative; overflow: hidden;
    padding: 88px 52px 80px;
    background: var(--green-light);
    border-bottom: 1px solid var(--border);
  }
  .ab-hero-bg-circle {
    position: absolute; border-radius: 50%; pointer-events: none;
  }
  .ab-hero-bg-circle.c1 {
    width: 600px; height: 600px;
    top: -200px; right: -120px;
    background: radial-gradient(circle, rgba(37,160,69,0.10) 0%, transparent 70%);
  }
  .ab-hero-bg-circle.c2 {
    width: 400px; height: 400px;
    bottom: -160px; left: -80px;
    background: radial-gradient(circle, rgba(13,58,28,0.07) 0%, transparent 70%);
  }
  .ab-hero-inner {
    position: relative; z-index: 2;
    max-width: 1100px; margin: 0 auto;
    display: grid; grid-template-columns: 1fr 1fr; gap: 60px; align-items: center;
  }
  .ab-hero-badge {
    display: inline-flex; align-items: center; gap: 8px;
    background: rgba(37,160,69,0.12);
    border: 1px solid rgba(37,160,69,0.25);
    border-radius: 50px; padding: 6px 16px; margin-bottom: 22px;
    color: var(--green-mid); font-size: 11px; font-weight: 700;
    letter-spacing: .09em; text-transform: uppercase; width: fit-content;
    animation: ab-fadeUp .6s ease both;
  }
  .ab-hero-badge-dot {
    width: 7px; height: 7px; border-radius: 50%;
    background: var(--green-bright);
    box-shadow: 0 0 8px rgba(37,160,69,0.5);
    animation: ab-blink 2s ease-in-out infinite;
  }
  @keyframes ab-blink { 0%,100%{opacity:1} 50%{opacity:.3} }

  .ab-hero-title {
    font-family: 'DM Serif Display', serif;
    font-size: 50px; line-height: 1.12; color: var(--text-dark);
    margin-bottom: 20px;
    animation: ab-fadeUp .6s .08s ease both;
  }
  .ab-hero-title em { font-style: italic; color: var(--green-mid); }
  .ab-hero-title span {
    position: relative; display: inline-block;
  }
  .ab-hero-title span::after {
    content: '';
    position: absolute; bottom: 2px; left: 0; right: 0;
    height: 3px; background: var(--green-glow); border-radius: 2px;
    opacity: 0.5;
  }
  .ab-hero-desc {
    font-size: 15.5px; color: var(--text-mid); line-height: 1.75;
    margin-bottom: 32px; max-width: 480px;
    animation: ab-fadeUp .6s .14s ease both;
  }
  .ab-hero-cta {
    display: flex; gap: 12px; flex-wrap: wrap;
    animation: ab-fadeUp .6s .2s ease both;
  }
  .ab-btn-primary {
    padding: 13px 28px; border: none; border-radius: 50px;
    background: linear-gradient(135deg, var(--green-mid), var(--green-bright));
    color: #fff; font-size: 14px; font-weight: 700;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    box-shadow: 0 5px 18px rgba(27,101,48,0.3);
    transition: all .25s;
  }
  .ab-btn-primary:hover { transform: translateY(-2px); box-shadow: 0 10px 28px rgba(27,101,48,0.42); }
  .ab-btn-ghost {
    padding: 13px 28px; border: 2px solid var(--border); border-radius: 50px;
    background: #fff; color: var(--text-mid);
    font-size: 14px; font-weight: 600;
    font-family: 'DM Sans', sans-serif; cursor: pointer;
    transition: all .22s;
  }
  .ab-btn-ghost:hover { border-color: var(--green-bright); color: var(--green-mid); background: var(--green-pale); }

  /* Hero right — image collage */
  .ab-hero-visual {
    position: relative; height: 380px;
    animation: ab-fadeUp .6s .1s ease both;
  }
  .ab-hero-img {
    position: absolute; border-radius: 18px; overflow: hidden;
    box-shadow: 0 12px 40px rgba(13,58,28,0.16);
  }
  .ab-hero-img img { width: 100%; height: 100%; object-fit: cover; display: block; }
  .ab-hero-img.main {
    width: 280px; height: 320px; top: 0; right: 60px;
  }
  .ab-hero-img.sub {
    width: 200px; height: 190px; bottom: 0; right: 0;
    border: 4px solid #fff;
  }
  .ab-hero-float-badge {
    position: absolute; top: 28px; left: 0; z-index: 10;
    background: #fff; border-radius: 14px;
    padding: 12px 16px; box-shadow: 0 8px 28px rgba(13,58,28,0.14);
    border: 1px solid var(--border);
    display: flex; align-items: center; gap: 10px;
    animation: ab-floatY 4s ease-in-out infinite;
  }
  @keyframes ab-floatY {
    0%,100% { transform: translateY(0); }
    50%      { transform: translateY(-8px); }
  }
  .ab-float-ico {
    width: 38px; height: 38px; border-radius: 10px;
    background: var(--green-pale); display: flex; align-items: center;
    justify-content: center; font-size: 18px; flex-shrink: 0;
    border: 1px solid rgba(37,160,69,0.2);
  }
  .ab-float-val { font-size: 17px; font-weight: 700; color: var(--text-dark); line-height: 1; }
  .ab-float-lbl { font-size: 11px; color: var(--text-muted); margin-top: 2px; }

  .ab-hero-float-badge2 {
    position: absolute; bottom: 60px; left: 10px; z-index: 10;
    background: var(--green-deep); border-radius: 14px;
    padding: 12px 16px; box-shadow: 0 8px 28px rgba(13,58,28,0.22);
    display: flex; align-items: center; gap: 10px;
    animation: ab-floatY 4s 1.5s ease-in-out infinite;
  }
  .ab-float-val2 { font-size: 15px; font-weight: 700; color: #fff; }
  .ab-float-lbl2 { font-size: 11px; color: rgba(255,255,255,0.55); margin-top: 2px; }

  /* ── SECTION COMMONS ── */
  .ab-section { padding: 80px 52px; }
  .ab-section.alt { background: var(--green-light); border-top: 1px solid var(--border); border-bottom: 1px solid var(--border); }
  .ab-section.dark {
    background: var(--green-deep);
    border-top: none; border-bottom: none;
  }
  .ab-inner { max-width: 1100px; margin: 0 auto; }

  .ab-section-eyebrow {
    display: inline-flex; align-items: center; gap: 8px;
    font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: var(--green-mid); margin-bottom: 14px;
  }
  .ab-section-eyebrow.light { color: #3dcc66; }
  .ab-section-title {
    font-family: 'DM Serif Display', serif;
    font-size: 38px; line-height: 1.18; color: var(--text-dark); margin-bottom: 14px;
  }
  .ab-section-title.light { color: #fff; }
  .ab-section-title em { font-style: italic; color: var(--green-mid); }
  .ab-section-title.light em { color: #80ffaa; }
  .ab-section-sub {
    font-size: 15px; color: var(--text-muted); line-height: 1.7; max-width: 520px;
    margin-bottom: 48px;
  }
  .ab-section-sub.light { color: rgba(255,255,255,0.6); }

  /* ── MISSION SPLIT ── */
  .ab-mission-grid {
    display: grid; grid-template-columns: 1fr 1fr; gap: 64px; align-items: center;
  }
  .ab-mission-img {
    border-radius: 20px; overflow: hidden;
    box-shadow: 0 16px 48px rgba(13,58,28,0.14);
    position: relative;
  }
  .ab-mission-img img { width: 100%; height: 380px; object-fit: cover; display: block; }
  .ab-mission-img-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to top, rgba(13,58,28,0.45) 0%, transparent 55%);
  }
  .ab-mission-img-caption {
    position: absolute; bottom: 20px; left: 20px; right: 20px;
    background: rgba(255,255,255,0.13);
    backdrop-filter: blur(14px);
    border: 1px solid rgba(255,255,255,0.22);
    border-radius: 12px; padding: 12px 16px;
    display: flex; align-items: center; gap: 10px;
  }
  .ab-mission-img-caption span { font-size: 20px; }
  .ab-mission-caption-text { font-size: 13px; color: #fff; font-weight: 600; }
  .ab-mission-caption-sub  { font-size: 11.5px; color: rgba(255,255,255,0.65); margin-top: 2px; }

  .ab-mission-points { display: flex; flex-direction: column; gap: 22px; margin-top: 28px; }
  .ab-mission-point {
    display: flex; gap: 14px; align-items: flex-start;
    padding: 16px 18px; border-radius: 14px;
    background: #fff; border: 1px solid var(--border);
    box-shadow: var(--card-shadow); transition: all .22s;
  }
  .ab-mission-point:hover {
    border-color: rgba(37,160,69,0.3); transform: translateX(5px);
    box-shadow: 0 6px 24px rgba(13,58,28,0.10);
  }
  .ab-mission-point-ico {
    width: 42px; height: 42px; border-radius: 11px; flex-shrink: 0;
    background: var(--green-pale); border: 1px solid rgba(37,160,69,0.2);
    display: flex; align-items: center; justify-content: center; font-size: 19px;
  }
  .ab-mission-point-title { font-size: 14px; font-weight: 700; color: var(--text-dark); margin-bottom: 4px; }
  .ab-mission-point-desc  { font-size: 13px; color: var(--text-muted); line-height: 1.55; }

  /* ── IMPACT NUMBERS ── */
  .ab-impact-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 24px;
  }
  .ab-impact-card {
    background: rgba(255,255,255,0.07);
    border: 1px solid rgba(255,255,255,0.12);
    border-radius: 18px; padding: 28px 24px;
    text-align: center; transition: all .25s;
    backdrop-filter: blur(10px);
  }
  .ab-impact-card:hover {
    background: rgba(255,255,255,0.12);
    border-color: rgba(61,204,102,0.3);
    transform: translateY(-4px);
  }
  .ab-impact-ico {
    font-size: 32px; margin-bottom: 12px; display: block;
  }
  .ab-impact-val {
    font-family: 'DM Serif Display', serif;
    font-size: 42px; color: #fff; line-height: 1; margin-bottom: 6px;
  }
  .ab-impact-val em { font-style: normal; color: #3dcc66; }
  .ab-impact-label { font-size: 13px; color: rgba(255,255,255,0.58); font-weight: 500; }

  /* ── FEATURES GRID ── */
  .ab-features-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
  }
  .ab-feature-card {
    background: #fff; border: 1px solid var(--border);
    border-radius: 18px; padding: 28px 26px;
    box-shadow: var(--card-shadow); transition: all .25s;
    position: relative; overflow: hidden;
  }
  .ab-feature-card::before {
    content: '';
    position: absolute; top: 0; left: 0; right: 0; height: 3px;
    background: linear-gradient(90deg, var(--green-mid), var(--green-glow));
    opacity: 0; transition: opacity .25s;
  }
  .ab-feature-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(13,58,28,0.12);
    border-color: rgba(37,160,69,0.25);
  }
  .ab-feature-card:hover::before { opacity: 1; }
  .ab-feature-ico {
    width: 52px; height: 52px; border-radius: 14px;
    background: var(--green-pale); border: 1px solid rgba(37,160,69,0.2);
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; margin-bottom: 16px;
  }
  .ab-feature-title { font-size: 15px; font-weight: 700; color: var(--text-dark); margin-bottom: 8px; }
  .ab-feature-desc  { font-size: 13.5px; color: var(--text-muted); line-height: 1.65; }

  /* ── TEAM ── */
  .ab-team-grid {
    display: grid; grid-template-columns: repeat(4, 1fr); gap: 22px;
  }
  .ab-team-card {
    background: #fff; border: 1px solid var(--border);
    border-radius: 18px; padding: 28px 20px 22px;
    text-align: center; box-shadow: var(--card-shadow);
    transition: all .25s;
  }
  .ab-team-card:hover {
    transform: translateY(-5px);
    box-shadow: 0 16px 40px rgba(13,58,28,0.12);
    border-color: rgba(37,160,69,0.25);
  }
  .ab-team-avatar {
    width: 72px; height: 72px; border-radius: 50%;
    margin: 0 auto 14px;
    display: flex; align-items: center; justify-content: center;
    font-size: 24px; font-weight: 700; color: #fff;
    border: 3px solid var(--green-pale);
    font-family: 'DM Serif Display', serif;
  }
  .ab-team-name  { font-size: 14.5px; font-weight: 700; color: var(--text-dark); margin-bottom: 4px; }
  .ab-team-role  { font-size: 12.5px; color: var(--green-mid); font-weight: 600; margin-bottom: 10px; }
  .ab-team-desc  { font-size: 12.5px; color: var(--text-muted); line-height: 1.6; }

  /* ── TIMELINE ── */
  .ab-timeline { position: relative; max-width: 700px; margin: 0 auto; }
  .ab-timeline::before {
    content: '';
    position: absolute; left: 22px; top: 0; bottom: 0;
    width: 2px; background: linear-gradient(to bottom, var(--green-bright), transparent);
  }
  .ab-timeline-item {
    display: flex; gap: 24px; padding-bottom: 36px; position: relative;
  }
  .ab-timeline-item:last-child { padding-bottom: 0; }
  .ab-timeline-dot {
    width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
    background: var(--green-pale); border: 3px solid var(--green-bright);
    display: flex; align-items: center; justify-content: center;
    font-size: 18px; z-index: 2; position: relative;
    box-shadow: 0 0 0 5px rgba(37,160,69,0.1);
  }
  .ab-timeline-content {
    background: #fff; border: 1px solid var(--border);
    border-radius: 14px; padding: 18px 20px;
    flex: 1; box-shadow: var(--card-shadow); transition: all .22s;
  }
  .ab-timeline-content:hover { border-color: rgba(37,160,69,0.28); box-shadow: 0 6px 24px rgba(13,58,28,0.10); }
  .ab-timeline-year {
    font-size: 11px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: var(--green-mid); margin-bottom: 5px;
  }
  .ab-timeline-title { font-size: 15px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px; }
  .ab-timeline-desc  { font-size: 13px; color: var(--text-muted); line-height: 1.6; }

  /* ── PARTNERS ── */
  .ab-partners-row {
    display: flex; align-items: center; justify-content: center;
    flex-wrap: wrap; gap: 16px; margin-top: 40px;
  }
  .ab-partner-pill {
    display: flex; align-items: center; gap: 10px;
    background: #fff; border: 1.5px solid var(--border);
    border-radius: 50px; padding: 10px 20px;
    font-size: 13.5px; font-weight: 600; color: var(--text-mid);
    box-shadow: var(--card-shadow); transition: all .22s; cursor: default;
  }
  .ab-partner-pill:hover {
    border-color: var(--green-bright); color: var(--green-mid);
    box-shadow: 0 6px 20px rgba(37,160,69,0.13); transform: translateY(-2px);
  }
  .ab-partner-pill span { font-size: 20px; }

  /* ── ASHA PLEDGE ── */
  .ab-pledge {
    background: linear-gradient(135deg, var(--green-deep) 0%, #0f4a22 100%);
    border-radius: 24px; padding: 52px 56px;
    display: flex; gap: 48px; align-items: center;
    box-shadow: 0 20px 60px rgba(13,58,28,0.25);
    position: relative; overflow: hidden;
  }
  .ab-pledge::before {
    content: '🌿';
    position: absolute; right: 40px; top: 30px;
    font-size: 120px; opacity: 0.06; pointer-events: none;
    line-height: 1;
  }
  .ab-pledge-left { flex: 1; position: relative; z-index: 2; }
  .ab-pledge-label {
    font-size: 10px; font-weight: 700; letter-spacing: .12em; text-transform: uppercase;
    color: #3dcc66; margin-bottom: 14px;
  }
  .ab-pledge-title {
    font-family: 'DM Serif Display', serif;
    font-size: 32px; color: #fff; line-height: 1.2; margin-bottom: 14px;
  }
  .ab-pledge-title em { font-style: italic; color: #80ffaa; }
  .ab-pledge-desc { font-size: 14px; color: rgba(255,255,255,0.65); line-height: 1.7; }
  .ab-pledge-right { display: flex; flex-direction: column; gap: 12px; position: relative; z-index: 2; }
  .ab-pledge-stat {
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.13);
    border-radius: 14px; padding: 16px 22px;
    min-width: 200px;
  }
  .ab-pledge-stat-val   { font-family: 'DM Serif Display', serif; font-size: 28px; color: #fff; }
  .ab-pledge-stat-val em { font-style: normal; color: #3dcc66; }
  .ab-pledge-stat-label { font-size: 12.5px; color: rgba(255,255,255,0.5); margin-top: 3px; }

  /* ── TESTIMONIALS ── */
  .ab-testimonials-grid {
    display: grid; grid-template-columns: repeat(3, 1fr); gap: 22px;
  }
  .ab-testi-card {
    background: #fff; border: 1px solid var(--border);
    border-radius: 18px; padding: 26px 24px;
    box-shadow: var(--card-shadow); transition: all .25s;
    position: relative;
  }
  .ab-testi-card:hover {
    transform: translateY(-4px);
    box-shadow: 0 14px 36px rgba(13,58,28,0.10);
    border-color: rgba(37,160,69,0.22);
  }
  .ab-testi-quote {
    font-size: 36px; line-height: 1; color: var(--green-pale);
    font-family: 'DM Serif Display', serif; margin-bottom: 8px;
  }
  .ab-testi-text {
    font-size: 14px; color: var(--text-mid); line-height: 1.75;
    margin-bottom: 20px; font-style: italic;
  }
  .ab-testi-footer { display: flex; align-items: center; gap: 12px; }
  .ab-testi-avatar {
    width: 42px; height: 42px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 14px; font-weight: 700; color: #fff;
    font-family: 'DM Serif Display', serif;
  }
  .ab-testi-name   { font-size: 13.5px; font-weight: 700; color: var(--text-dark); }
  .ab-testi-loc    { font-size: 12px; color: var(--text-muted); margin-top: 2px; }

  /* ── FOOTER ── */
  .ab-footer {
    background: var(--green-deep);
    padding: 56px 52px 32px;
    border-top: 1px solid rgba(255,255,255,0.06);
  }
  .ab-footer-inner { max-width: 1100px; margin: 0 auto; }
  .ab-footer-top {
    display: grid; grid-template-columns: 2fr 1fr 1fr 1fr; gap: 40px;
    padding-bottom: 40px; border-bottom: 1px solid rgba(255,255,255,0.08);
    margin-bottom: 28px;
  }
  .ab-footer-brand-logo {
    display: flex; align-items: center; gap: 10px; margin-bottom: 14px;
    text-decoration: none;
  }
  .ab-footer-brand-name {
    font-family: 'DM Serif Display', serif;
    font-size: 20px; color: #fff;
  }
  .ab-footer-brand-desc {
    font-size: 13.5px; color: rgba(255,255,255,0.5); line-height: 1.7;
    margin-bottom: 20px; max-width: 280px;
  }
  .ab-footer-badges { display: flex; flex-wrap: wrap; gap: 8px; }
  .ab-footer-badge {
    font-size: 11.5px; font-weight: 600;
    padding: 5px 12px; border-radius: 50px;
    background: rgba(255,255,255,0.08);
    border: 1px solid rgba(255,255,255,0.12);
    color: rgba(255,255,255,0.65);
  }
  .ab-footer-col-title {
    font-size: 12px; font-weight: 700; letter-spacing: .1em; text-transform: uppercase;
    color: rgba(255,255,255,0.45); margin-bottom: 16px;
  }
  .ab-footer-col-links { display: flex; flex-direction: column; gap: 10px; }
  .ab-footer-col-links a {
    font-size: 13.5px; color: rgba(255,255,255,0.6); text-decoration: none;
    transition: color .2s; font-weight: 500;
  }
  .ab-footer-col-links a:hover { color: #80ffaa; }
  .ab-footer-bottom {
    display: flex; align-items: center; justify-content: space-between;
    flex-wrap: wrap; gap: 12px;
  }
  .ab-footer-copy { font-size: 12.5px; color: rgba(255,255,255,0.35); }
  .ab-footer-bottom-links { display: flex; gap: 20px; }
  .ab-footer-bottom-links a {
    font-size: 12.5px; color: rgba(255,255,255,0.4); text-decoration: none;
    transition: color .2s;
  }
  .ab-footer-bottom-links a:hover { color: rgba(255,255,255,0.7); }

  /* Divider */
  .ab-divider {
    width: 48px; height: 3px; border-radius: 2px;
    background: linear-gradient(90deg, var(--green-bright), var(--green-glow));
    margin-bottom: 20px;
  }
  .ab-divider.light { background: linear-gradient(90deg, #3dcc66, rgba(61,204,102,0.3)); }

  @keyframes ab-fadeUp {
    from { opacity: 0; transform: translateY(22px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;

// ── DATA ──────────────────────────────────────────
const features = [
  { ico: "🤖", title: "AI-Powered Diagnosis",       desc: "Smart symptom checker and triage engine trained on rural health data. Works offline in low-connectivity villages." },
  { ico: "📋", title: "Digital Health Records",      desc: "Paperless patient files — ANC cards, immunisation records, chronic disease logs — all in one secure place." },
  { ico: "📶", title: "Offline-First Design",        desc: "All core features work without internet. Data syncs automatically when connectivity is restored." },
  { ico: "🌐", title: "Hindi & Regional Languages",  desc: "Full UI support in Hindi, Bhojpuri, and Maithili — designed for workers who are most comfortable in their mother tongue." },
  { ico: "💉", title: "Immunisation Tracker",        desc: "Auto-reminder system for child and maternal vaccines. Never miss a due date again with smart scheduling." },
  { ico: "📊", title: "Easy Reporting",              desc: "One-tap monthly reports auto-filled from your patient data. Submit directly to your ANM or block health officer." },
];

const team = [
  { initials: "AK", name: "Arjun Kumar",   role: "Founder & CEO",      color: "#1b6530", desc: "Former NHM programme officer, IIT Bombay. 8 years in rural health policy." },
  { initials: "PS", name: "Priya Singh",   role: "Chief Medical Officer", color: "#7b1fa2", desc: "MBBS, MPH (AIIMS). Designed ASHA training curricula across 3 states." },
  { initials: "RM", name: "Rahul Mishra",  role: "Lead Engineer",       color: "#0277bd", desc: "Ex-Google. Built offline-first apps for 2M+ users in emerging markets." },
  { initials: "SJ", name: "Sneha Jaiswal", role: "Head of Partnerships", color: "#e65100", desc: "NHM Bihar liaison. Bridging govt. schemes and grassroots health workers." },
];

const timeline = [
  { year: "2021", ico: "💡", title: "The Idea",          desc: "After visiting 40+ villages in Bihar, our founders realised ASHA workers had smartphones but no tools built for them. GraamSehat was born." },
  { year: "2022", ico: "🧪", title: "Pilot Launch",       desc: "50 ASHA workers in Gaya district piloted the first version. Immunisation coverage in pilot villages improved by 18% in 6 months." },
  { year: "2023", ico: "🚀", title: "State Rollout",      desc: "Expanded to Bihar & Uttar Pradesh with NHM support. Crossed 500 active workers and 10,000 patient records." },
  { year: "2024", ico: "🤖", title: "AI Diagnosis Engine", desc: "Launched the AI triage module trained on 2 lakh rural patient cases. Reduced misdiagnosis rate by 34% in pilot study." },
  { year: "2025", ico: "🏆", title: "National Recognition", desc: "Won MoHFW Digital Health Innovation Award. 1,400+ workers across 5 states. 2.8 lakh patients served." },
];

const testimonials = [
  {
    text: "Pehle har mahine ka report likhne mein 3 ghante lagte the. Ab 10 minute mein submit ho jaata hai. Mera kaam kitna aasaan ho gaya hai.",
    name: "Sunita Devi", loc: "ASHA Worker · Gaya, Bihar", color: "#1b6530",
  },
  {
    text: "AI wala feature bahut helpful hai. Ek baar ek bacche ko anemia tha, AI ne turant alert diya. Doctor ne confirm kiya baad mein. Life bachne se kam nahi tha.",
    name: "Rekha Yadav",  loc: "ASHA Worker · Varanasi, UP", color: "#c62828",
  },
  {
    text: "Network nahi hota gaon mein, phir bhi app kaam karta hai. Aur jab tower aata hai, sab sync ho jaata hai. Bahut badhiya design hai.",
    name: "Meena Kumari", loc: "ASHA Worker · Sitamarhi, Bihar", color: "#7b1fa2",
  },
];

const partners = [
  { ico: "🏛️", name: "Govt. of Bihar" },
  { ico: "🏛️", name: "NHM India" },
  { ico: "🏥", name: "AIIMS Patna" },
  { ico: "🇮🇳", name: "MoHFW" },
  { ico: "🌍", name: "WHO India" },
  { ico: "💊", name: "ABDM / NHA" },
];

export default function About() {
  return (
    <>
      <style>{styles}</style>

      {/* NAVBAR */}
      <nav className="ab-nav">
        <a className="ab-logo" href="#">
          <span className="ab-logo-leaf">🌿</span>
          <span className="ab-logo-name">GraamSehat</span>
        </a>
        <div className="ab-nav-links">
          <a href="#">Home</a>
          <a href="#" className="active">About Us</a>
          <a href="#">Services</a>
          <a href="#">Features</a>
          <a href="#">Contact</a>
        </div>
        <div className="ab-nav-actions">
          <button className="ab-btn-out">Log in</button>
          <button className="ab-btn-fill">Sign up</button>
        </div>
      </nav>

      <div className="ab-page">

        {/* ── HERO ── */}
        <section className="ab-hero">
          <div className="ab-hero-bg-circle c1" />
          <div className="ab-hero-bg-circle c2" />
          <div className="ab-inner">
            <div className="ab-hero-inner">
              <div>
                <div className="ab-hero-badge">
                  <span className="ab-hero-badge-dot" />
                  Our Mission
                </div>
                <h1 className="ab-hero-title">
                  Healthcare that reaches<br />
                  <em>every last</em> <span>village</span>
                </h1>
                <p className="ab-hero-desc">
                  GraamSehat is a technology platform built exclusively for ASHA workers — empowering India's frontline health heroes with AI tools, digital records, and offline-first features designed for life in the field.
                </p>
                <div className="ab-hero-cta">
                  <button className="ab-btn-primary">Join as ASHA Worker</button>
                  <button className="ab-btn-ghost">Watch Our Story</button>
                </div>
              </div>

              {/* Visual collage */}
              <div className="ab-hero-visual">
                <div className="ab-hero-img main">
                  <img src="https://images.unsplash.com/photo-1584515933487-779824d29309?w=600&q=85&auto=format&fit=crop" alt="ASHA worker" />
                </div>
                <div className="ab-hero-img sub">
                  <img src="https://images.unsplash.com/photo-1576091160550-2173dba999ef?w=400&q=85&auto=format&fit=crop" alt="Healthcare" />
                </div>
                <div className="ab-hero-float-badge">
                  <div className="ab-float-ico">👥</div>
                  <div>
                    <div className="ab-float-val">1,400+</div>
                    <div className="ab-float-lbl">Active ASHA Workers</div>
                  </div>
                </div>
                <div className="ab-hero-float-badge2">
                  <div className="ab-float-ico" style={{ background: "rgba(61,204,102,0.18)", border: "1px solid rgba(61,204,102,0.3)", width: 34, height: 34, borderRadius: 9, display: "flex", alignItems: "center", justifyContent: "center", fontSize: 16 }}>🏘️</div>
                  <div>
                    <div className="ab-float-val2">247 Villages Covered</div>
                    <div className="ab-float-lbl2">Bihar &amp; Uttar Pradesh</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── MISSION ── */}
        <section className="ab-section">
          <div className="ab-inner">
            <div className="ab-mission-grid">
              <div className="ab-mission-img">
                <img src="https://images.unsplash.com/photo-1559757148-5c350d0d3c56?w=700&q=85&auto=format&fit=crop" alt="Mission" />
                <div className="ab-mission-img-overlay" />
                <div className="ab-mission-img-caption">
                  <span>🌿</span>
                  <div>
                    <div className="ab-mission-caption-text">Swastha Bharat Abhiyaan</div>
                    <div className="ab-mission-caption-sub">Empowering frontline health workers since 2021</div>
                  </div>
                </div>
              </div>
              <div>
                <div className="ab-section-eyebrow">🎯 Our Mission</div>
                <div className="ab-divider" />
                <h2 className="ab-section-title">
                  Putting powerful tools in the hands of <em>real heroes</em>
                </h2>
                <p style={{ fontSize: 14.5, color: "var(--text-muted)", lineHeight: 1.75, marginBottom: 0 }}>
                  India's 10 lakh ASHA workers are the backbone of rural healthcare — yet they often work with paper registers, unreliable networks, and zero digital support. We're changing that.
                </p>
                <div className="ab-mission-points">
                  {[
                    { ico: "🎯", title: "Designed for the Field",       desc: "Every feature was co-designed with ASHA workers from Bihar and UP. Nothing is added that doesn't solve a real problem." },
                    { ico: "🆓", title: "Free for All ASHA Workers",    desc: "GraamSehat is 100% free for certified ASHA workers, forever. Funded by government partnerships and CSR grants." },
                    { ico: "🔒", title: "Privacy & ABDM Compliance",    desc: "All patient data is end-to-end encrypted and compliant with Ayushman Bharat Digital Mission guidelines." },
                  ].map((p, i) => (
                    <div className="ab-mission-point" key={i}>
                      <div className="ab-mission-point-ico">{p.ico}</div>
                      <div>
                        <div className="ab-mission-point-title">{p.title}</div>
                        <div className="ab-mission-point-desc">{p.desc}</div>
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── IMPACT NUMBERS (dark) ── */}
        <section className="ab-section dark">
          <div className="ab-inner" style={{ textAlign: "center" }}>
            <div className="ab-section-eyebrow light" style={{ justifyContent: "center" }}>📊 Our Impact</div>
            <div className="ab-divider light" style={{ margin: "0 auto 16px" }} />
            <h2 className="ab-section-title light" style={{ textAlign: "center", marginBottom: 8 }}>
              Numbers that <em>matter</em>
            </h2>
            <p className="ab-section-sub light" style={{ margin: "0 auto 48px", textAlign: "center" }}>
              Every number below is a family reached, a child vaccinated, a diagnosis made possible.
            </p>
            <div className="ab-impact-grid">
              {[
                { ico: "👥", val: "1,400", unit: "+", label: "Active ASHA Workers" },
                { ico: "🏘️", val: "247",   unit: "",  label: "Villages Covered" },
                { ico: "👶", val: "2.8L",  unit: "",  label: "Patients Served" },
                { ico: "🤖", val: "50K",   unit: "+", label: "AI Diagnoses Made" },
              ].map((s, i) => (
                <div className="ab-impact-card" key={i}>
                  <span className="ab-impact-ico">{s.ico}</span>
                  <div className="ab-impact-val">{s.val}<em>{s.unit}</em></div>
                  <div className="ab-impact-label">{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="ab-section alt">
          <div className="ab-inner">
            <div className="ab-section-eyebrow">⚙️ What We Offer</div>
            <div className="ab-divider" />
            <h2 className="ab-section-title">Built for how <em>ASHA workers</em> actually work</h2>
            <p className="ab-section-sub">Every feature solves a real problem our workers face in the field — not what someone imagined from an office.</p>
            <div className="ab-features-grid">
              {features.map((f, i) => (
                <div className="ab-feature-card" key={i} style={{ animationDelay: `${i * 0.07}s` }}>
                  <div className="ab-feature-ico">{f.ico}</div>
                  <div className="ab-feature-title">{f.title}</div>
                  <div className="ab-feature-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── JOURNEY TIMELINE ── */}
        <section className="ab-section">
          <div className="ab-inner">
            <div style={{ textAlign: "center", marginBottom: 48 }}>
              <div className="ab-section-eyebrow" style={{ justifyContent: "center" }}>📅 Our Journey</div>
              <div className="ab-divider" style={{ margin: "0 auto 16px" }} />
              <h2 className="ab-section-title" style={{ textAlign: "center" }}>From a village visit to a <em>national platform</em></h2>
              <p className="ab-section-sub" style={{ margin: "0 auto", textAlign: "center" }}>Five years of learning, building, and growing with the communities we serve.</p>
            </div>
            <div className="ab-timeline">
              {timeline.map((t, i) => (
                <div className="ab-timeline-item" key={i}>
                  <div className="ab-timeline-dot">{t.ico}</div>
                  <div className="ab-timeline-content">
                    <div className="ab-timeline-year">{t.year}</div>
                    <div className="ab-timeline-title">{t.title}</div>
                    <div className="ab-timeline-desc">{t.desc}</div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="ab-section alt">
          <div className="ab-inner">
            <div className="ab-section-eyebrow">💬 ASHA Workers Speak</div>
            <div className="ab-divider" />
            <h2 className="ab-section-title">In their own <em>words</em></h2>
            <p className="ab-section-sub">Real feedback from the women who use GraamSehat every day in the field.</p>
            <div className="ab-testimonials-grid">
              {testimonials.map((t, i) => (
                <div className="ab-testi-card" key={i}>
                  <div className="ab-testi-quote">"</div>
                  <div className="ab-testi-text">{t.text}</div>
                  <div className="ab-testi-footer">
                    <div className="ab-testi-avatar" style={{ background: t.color }}>
                      {t.name.split(" ").map(n => n[0]).join("").slice(0,2)}
                    </div>
                    <div>
                      <div className="ab-testi-name">{t.name}</div>
                      <div className="ab-testi-loc">{t.loc}</div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TEAM ── */}
        <section className="ab-section">
          <div className="ab-inner">
            <div className="ab-section-eyebrow">👥 Our Team</div>
            <div className="ab-divider" />
            <h2 className="ab-section-title">The people <em>behind</em> the mission</h2>
            <p className="ab-section-sub">A team of doctors, engineers, and public health professionals — united by one goal.</p>
            <div className="ab-team-grid">
              {team.map((m, i) => (
                <div className="ab-team-card" key={i}>
                  <div className="ab-team-avatar" style={{ background: m.color }}>{m.initials}</div>
                  <div className="ab-team-name">{m.name}</div>
                  <div className="ab-team-role">{m.role}</div>
                  <div className="ab-team-desc">{m.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── ASHA PLEDGE (CTA) ── */}
        <section className="ab-section" style={{ paddingTop: 0 }}>
          <div className="ab-inner">
            <div className="ab-pledge">
              <div className="ab-pledge-left">
                <div className="ab-pledge-label">🌿 Join the Mission</div>
                <div className="ab-pledge-title">
                  Are you an <em>ASHA Worker</em>?<br />GraamSehat is free for you.
                </div>
                <div className="ab-pledge-desc">
                  Join 1,400+ workers across Bihar and Uttar Pradesh who are delivering smarter, faster, and more dignified healthcare to their villages — with the help of technology.
                </div>
                <div style={{ display: "flex", gap: 12, marginTop: 24 }}>
                  <button className="ab-btn-primary" style={{ fontSize: 13.5 }}>Register Free →</button>
                  <button style={{ padding: "12px 22px", border: "1.5px solid rgba(255,255,255,0.22)", borderRadius: 50, background: "transparent", color: "rgba(255,255,255,0.75)", fontSize: 13.5, fontWeight: 600, cursor: "pointer", fontFamily: "'DM Sans', sans-serif", transition: "all .2s" }}>
                    Learn More
                  </button>
                </div>
              </div>
              <div className="ab-pledge-right">
                {[
                  { val: "100%", label: "Free for certified ASHA workers" },
                  { val: "5 Min", label: "Setup time to get started" },
                  { val: "24/7", label: "Offline access, anytime" },
                ].map((s, i) => (
                  <div className="ab-pledge-stat" key={i}>
                    <div className="ab-pledge-stat-val"><em>{s.val}</em></div>
                    <div className="ab-pledge-stat-label">{s.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── PARTNERS ── */}
        <section className="ab-section alt" style={{ paddingTop: 52, paddingBottom: 52 }}>
          <div className="ab-inner" style={{ textAlign: "center" }}>
            <div className="ab-section-eyebrow" style={{ justifyContent: "center" }}>🤝 Supported By</div>
            <p style={{ fontSize: 14, color: "var(--text-muted)", marginTop: 4 }}>
              Trusted and backed by India's leading health institutions and government bodies.
            </p>
            <div className="ab-partners-row">
              {partners.map((p, i) => (
                <div className="ab-partner-pill" key={i}>
                  <span>{p.ico}</span> {p.name}
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="ab-footer">
          <div className="ab-footer-inner">
            <div className="ab-footer-top">
              <div>
                <a className="ab-footer-brand-logo" href="#">
                  <span style={{ fontSize: 22 }}>🌿</span>
                  <span className="ab-footer-brand-name">GraamSehat</span>
                </a>
                <div className="ab-footer-brand-desc">
                  AI-powered healthcare tools for ASHA workers — built for rural India, free for all certified workers, trusted by the Government of India.
                </div>
                <div className="ab-footer-badges">
                  <span className="ab-footer-badge">🔒 ABDM Compliant</span>
                  <span className="ab-footer-badge">🇮🇳 Govt. of India</span>
                  <span className="ab-footer-badge">🏥 NHM Partner</span>
                </div>
              </div>
              {[
                { title: "Platform", links: ["Dashboard", "AI Diagnosis", "Patient Records", "Immunisation", "Reports"] },
                { title: "Company",  links: ["About Us", "Our Team", "Blog", "Careers", "Press"] },
                { title: "Support",  links: ["Help Centre", "Contact Us", "Privacy Policy", "Terms of Service", "Grievance"] },
              ].map(col => (
                <div key={col.title}>
                  <div className="ab-footer-col-title">{col.title}</div>
                  <div className="ab-footer-col-links">
                    {col.links.map(l => <a href="#" key={l}>{l}</a>)}
                  </div>
                </div>
              ))}
            </div>
            <div className="ab-footer-bottom">
              <div className="ab-footer-copy">© 2025 GraamSehat Technologies Pvt. Ltd. · Made with ❤️ for Rural India</div>
              <div className="ab-footer-bottom-links">
                <a href="#">Privacy</a>
                <a href="#">Terms</a>
                <a href="#">Cookies</a>
              </div>
            </div>
          </div>
        </footer>

      </div>
    </>
  );
}
