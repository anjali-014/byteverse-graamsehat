





import { useState, useEffect, useRef } from "react";
import { useNavigate } from "react-router-dom";

const whyCards = [
  { icon: "👩‍⚕️", title: "ASHA Workers Lack Tools", desc: "Most ASHA workers rely on paper records and memory. GraamSehat gives them AI-powered digital support right in the field." },
  { icon: "🏘️", title: "Villagers Depend on Them", desc: "In rural India, ASHA workers are the first point of contact for millions. Their accuracy directly impacts patient lives." },
  { icon: "⏱️", title: "Delays Can Be Dangerous", desc: "Without quick triage, critical cases go undetected. Our AI provides instant guidance to prevent life-threatening delays." },
];

const steps = [
  { emoji: "🎤", num: "01", title: "Speak Symptoms", desc: "Describe patient symptoms in Hindi, Bhojpuri, or local language — no typing needed.", tag: "Voice Input", tagColor: "#166534", tagBg: "#dcfce7" },
  { emoji: "🤖", num: "02", title: "AI Analyzes Offline", desc: "Our on-device AI processes symptoms instantly — even with no internet connection in the village.", tag: "Offline AI", tagColor: "#1d4ed8", tagBg: "#dbeafe" },
  { emoji: "🚨", num: "03", title: "Get Instant Result", desc: "Receive a clear Red / Yellow / Green triage code with recommended action and next steps.", tag: "Instant Triage", tagColor: "#b45309", tagBg: "#fef3c7" },
];

const features = [
  { icon: "🎙️", title: "Voice Input", desc: "Speak symptoms naturally in local language — no text entry required." },
  { icon: "📡", title: "Works Offline", desc: "Full AI functionality even in areas with zero network coverage." },
  { icon: "🌐", title: "Multi-Language", desc: "Hindi, Bhojpuri, and regional languages supported out of the box." },
  { icon: "🚨", title: "Emergency Alerts", desc: "One-tap escalation to the nearest PHC or specialist facility." },
];

const testimonials = [
  { q: "GraamSehat ne mera kaam bahut aasaan kar diya. Ab main patients ko sahi guidance de sakti hoon.", name: "Sunita Devi", role: "ASHA Worker, Patna", av: "S", bg: "#16a34a" },
  { q: "The AI suggestions are very accurate. I trust GraamSehat for every patient I visit in my village.", name: "Rekha Sharma", role: "ASHA Worker, Varanasi", av: "R", bg: "#1d4ed8" },
  { q: "Even without internet, the app works! It is truly made for village health workers like us.", name: "Meena Yadav", role: "ASHA Worker, Lucknow", av: "M", bg: "#9333ea" },
];

export default function LandingPage() {
  const navigate = useNavigate();
  const [scrollY, setScrollY] = useState(0);
  const [caseStats, setCaseStats] = useState({
    green: 0,
    yellow: 0,
    red: 0,
    total: 0
  });
  const revealRefs = useRef([]);

  useEffect(() => {
    const fn = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", fn, { passive: true });
    return () => window.removeEventListener("scroll", fn);
  }, []);

  // Fetch case statistics
  useEffect(() => {
    const fetchCaseStats = async () => {
      try {
        const response = await fetch('http://localhost:3001/api/stats/cases');
        const data = await response.json();
        if (data.success) {
          setCaseStats(data.data);
        }
      } catch (error) {
        console.warn('Failed to fetch case statistics:', error);
      }
    };

    fetchCaseStats();

    // Listen for case updates
    const handleCaseUpdate = () => {
      console.log('Case statistics updated, refreshing...');
      fetchCaseStats();
    };

    window.addEventListener('caseStatsUpdate', handleCaseUpdate);

    return () => {
      window.removeEventListener('caseStatsUpdate', handleCaseUpdate);
    };
  }, []);

  useEffect(() => {
    const obs = new IntersectionObserver(
      (entries) => entries.forEach((e) => {
        if (e.isIntersecting) {
          e.target.style.opacity = "1";
          e.target.style.transform = "translateY(0)";
        }
      }),
      { threshold: 0.1 }
    );
    revealRefs.current.forEach((el) => {
      if (el) {
        el.style.opacity = "0";
        el.style.transform = "translateY(30px)";
        el.style.transition = "opacity 0.65s ease, transform 0.65s ease";
        obs.observe(el);
      }
    });
    return () => obs.disconnect();
  }, []);

  const r = (el) => { if (el && !revealRefs.current.includes(el)) revealRefs.current.push(el); };

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Plus+Jakarta+Sans:wght@300;400;500;600;700;800&display=swap');
        *, *::before, *::after { box-sizing: border-box; margin: 0; padding: 0; }
        html { scroll-behavior: smooth; }
        body { font-family: 'Plus Jakarta Sans', sans-serif; background: #fff; }

        /* NAV */
        .lp-nav { position: fixed; top:0; left:0; right:0; z-index:1000; background:#fff; padding:0 60px; transition: box-shadow 0.3s; }
        .lp-nav.scrolled { box-shadow: 0 2px 20px rgba(22,163,74,0.08); }
        .lp-nav-inner { max-width:1160px; margin:0 auto; height:68px; display:flex; align-items:center; gap:32px; }
        .lp-logo { display:flex; align-items:center; gap:10px; font-weight:800; font-size:19px; color:#166534; cursor:pointer; flex-shrink:0; }
        .lp-nav-links { display:flex; gap:4px; flex:1; list-style:none; }
        .lp-nl { background:none; border:none; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:500; color:#4b7a52; cursor:pointer; padding:8px 14px; border-radius:100px; transition:background 0.2s, color 0.2s; }
        .lp-nl:hover { background:#f0fdf4; color:#166534; }
        .lp-nav-auth { display:flex; gap:10px; flex-shrink:0; }
        .lp-btn-login { background:transparent; border:1.5px solid #16a34a; color:#16a34a; padding:9px 22px; border-radius:100px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.2s; }
        .lp-btn-login:hover { background:#f0fdf4; }
        .lp-btn-signup { background:#16a34a; color:#fff; border:none; padding:10px 22px; border-radius:100px; font-family:'Plus Jakarta Sans',sans-serif; font-size:14px; font-weight:600; cursor:pointer; transition:background 0.2s; }
        .lp-btn-signup:hover { background:#15803d; }

        /* ── HERO — FULL-BLEED PHOTO BACKGROUND ── */
        .lp-hero {
          position: relative;
          min-height: 100vh;
          padding: 0 60px;
          display: flex;
          align-items: center;
          overflow: hidden;
        }
        .lp-hero-bg-photo {
          position: absolute;
          inset: 0;
          z-index: 0;
        }
        .lp-hero-bg-photo img {
          width: 100%; height: 100%;
          object-fit: cover;
          object-position: center 25%;
          display: block;
          animation: lp-ken-burns 20s ease-in-out infinite alternate;
          transform-origin: center center;
        }
        @keyframes lp-ken-burns {
          from { transform: scale(1) translateX(0px); }
          to   { transform: scale(1.07) translateX(-14px); }
        }
        .lp-hero-bg-photo::before {
          content: '';
          position: absolute;
          inset: 0;
          background: linear-gradient(
            to right,
            rgba(240,253,244,0.98) 0%,
            rgba(220,252,231,0.95) 20%,
            rgba(187,247,208,0.80) 38%,
            rgba(134,239,172,0.35) 55%,
            rgba(0,0,0,0.04)       72%,
            rgba(0,0,0,0.10)       100%
          );
          z-index: 1;
        }
        .lp-hero-bg-photo::after {
          content: '';
          position: absolute;
          inset: 0;
          background:
            linear-gradient(to bottom, rgba(10,40,18,0.22) 0%, transparent 16%),
            linear-gradient(to top,    rgba(10,40,18,0.32) 0%, transparent 22%);
          z-index: 2;
        }
        .lp-hero-inner {
          position: relative;
          z-index: 3;
          max-width: 1160px;
          margin: 0 auto;
          width: 100%;
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 60px;
          align-items: center;
          padding: 120px 0 80px;
        }
        .lp-hero-left {
          animation: lp-fadeslide-up 0.9s 0.1s cubic-bezier(0.22,1,0.36,1) both;
        }
        @keyframes lp-fadeslide-up {
          from { opacity:0; transform: translateY(28px); }
          to   { opacity:1; transform: translateY(0); }
        }
        .lp-badge { display:inline-flex; align-items:center; gap:8px; background:rgba(255,255,255,0.82); backdrop-filter:blur(8px); border:1px solid #bbf7d0; color:#166534; font-size:12px; font-weight:700; letter-spacing:0.08em; text-transform:uppercase; padding:6px 16px; border-radius:100px; margin-bottom:24px; }
        .lp-badge-dot { width:7px; height:7px; border-radius:50%; background:#22c55e; animation: lp-blink 1.6s ease-in-out infinite; }
        @keyframes lp-blink { 0%,100%{opacity:1;} 50%{opacity:0.25;} }
        .lp-h1 { font-size:clamp(32px,4.5vw,54px); font-weight:800; line-height:1.1; color:#14532d; margin-bottom:20px; letter-spacing:-0.02em; }
        .lp-h1 span { color:#16a34a; }
        .lp-hero-p { font-size:17px; line-height:1.75; color:#3a6647; margin-bottom:36px; font-weight:400; max-width:460px; }
        .lp-hero-btns { display:flex; gap:14px; flex-wrap:wrap; margin-bottom:40px; }
        .lp-btn-green { background:#16a34a; color:#fff; border:none; padding:14px 32px; border-radius:100px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:700; cursor:pointer; transition:background 0.2s, transform 0.15s, box-shadow 0.2s; }
        .lp-btn-green:hover { background:#15803d; transform:translateY(-2px); box-shadow:0 8px 28px rgba(22,163,74,0.4); }
        .lp-btn-outline { background:rgba(255,255,255,0.65); backdrop-filter:blur(8px); border:1.5px solid #16a34a; color:#16a34a; padding:14px 32px; border-radius:100px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; transition:all 0.2s; }
        .lp-btn-outline:hover { background:rgba(255,255,255,0.9); transform:translateY(-2px); }
        .lp-trust-row { display:flex; align-items:center; gap:12px; }
        .lp-avatars { display:flex; }
        .lp-av { width:34px; height:34px; border-radius:50%; border:2px solid #fff; margin-left:-8px; display:flex; align-items:center; justify-content:center; font-size:12px; font-weight:800; color:#fff; }
        .lp-av:first-child { margin-left:0; }
        .lp-trust-text { font-size:13px; color:#3a6647; font-weight:500; }

        /* Right side — 3 glassmorphic stat cards on the photo */
        .lp-hero-right {
          position: relative;
          height: 460px;
          animation: lp-fadeslide-up 0.9s 0.35s cubic-bezier(0.22,1,0.36,1) both;
        }
        .lp-float1, .lp-float2, .lp-float3 {
          position: absolute;
          background: rgba(255,255,255,0.16);
          backdrop-filter: blur(22px);
          -webkit-backdrop-filter: blur(22px);
          border: 1px solid rgba(255,255,255,0.42);
          border-radius: 18px;
          padding: 16px 22px;
          display: flex; gap: 14px; align-items: center;
          box-shadow: 0 8px 32px rgba(0,0,0,0.14), inset 0 1px 0 rgba(255,255,255,0.45);
        }
        .lp-float1 {
          top: 40px; right: 0;
          min-width: 200px;
          animation: lp-card-in 0.7s 0.6s cubic-bezier(0.22,1,0.36,1) both,
                     lp-float-a 5s 1.2s ease-in-out infinite;
        }
        .lp-float2 {
          top: 50%; right: 0;
          transform: translateY(-50%);
          min-width: 220px;
          animation: lp-card-in 0.7s 0.75s cubic-bezier(0.22,1,0.36,1) both,
                     lp-float-b 6s 1.8s ease-in-out infinite;
        }
        .lp-float3 {
          bottom: 40px; right: 0;
          min-width: 210px;
          animation: lp-card-in 0.7s 0.9s cubic-bezier(0.22,1,0.36,1) both,
                     lp-float-c 5.5s 2.2s ease-in-out infinite;
        }
        @keyframes lp-card-in {
          from { opacity:0; transform: translateX(24px) scale(0.95); }
          to   { opacity:1; transform: translateX(0) scale(1); }
        }
        @keyframes lp-float-a {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-8px); }
        }
        @keyframes lp-float-b {
          0%,100% { transform: translateY(-50%); }
          50%      { transform: translateY(calc(-50% - 7px)); }
        }
        @keyframes lp-float-c {
          0%,100% { transform: translateY(0px); }
          50%      { transform: translateY(-6px); }
        }
        .lp-float-icon, .lp-float3-icon {
          width: 40px; height: 40px;
          border-radius: 12px;
          background: rgba(255,255,255,0.28);
          border: 1px solid rgba(255,255,255,0.45);
          display: flex; align-items: center; justify-content: center;
          font-size: 18px; flex-shrink: 0;
        }
        .lp-float-num { font-size: 15px; font-weight: 700; color: #fff; line-height: 1.2; text-shadow: 0 1px 6px rgba(0,0,0,0.25); }
        .lp-float-sub { font-size: 11px; color: rgba(255,255,255,0.82); margin-top: 2px; }

        /* SECTIONS */
        .lp-section { padding:100px 60px; }
        .lp-section-alt { padding:100px 60px; background:#f8fdf9; }
        .lp-section-inner { max-width:1160px; margin:0 auto; }
        .lp-section-tag { display:inline-block; font-size:12px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:#16a34a; margin-bottom:14px; }
        .lp-h2 { font-size:clamp(24px,3.2vw,40px); font-weight:800; line-height:1.2; color:#14532d; margin-bottom:16px; letter-spacing:-0.015em; }
        .lp-section-p { font-size:16px; line-height:1.75; color:#4b7a52; max-width:580px; margin-bottom:0; }

        /* WHY */
        .lp-why-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:56px; }
        .lp-why-card { background:#fff; border:1px solid #e8f5e9; border-radius:20px; padding:32px 28px; transition:transform 0.2s, box-shadow 0.2s; }
        .lp-why-card:hover { transform:translateY(-5px); box-shadow:0 12px 40px rgba(22,163,74,0.09); }
        .lp-why-icon { width:52px; height:52px; border-radius:16px; background:#f0fdf4; border:1px solid #bbf7d0; display:flex; align-items:center; justify-content:center; font-size:24px; margin-bottom:20px; }
        .lp-why-title { font-size:16px; font-weight:700; color:#14532d; margin-bottom:8px; }
        .lp-why-desc { font-size:14px; line-height:1.7; color:#6b9270; }

        /* HOW */
        .lp-how-wrap { position:relative; margin-top:56px; }
        .lp-how-line { position:absolute; top:40px; left:16.5%; right:16.5%; height:2px; background:linear-gradient(90deg,#bbf7d0,#22c55e,#bbf7d0); z-index:0; }
        .lp-how-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:0; position:relative; z-index:1; }
        .lp-how-card { text-align:center; padding:0 28px; }
        .lp-how-circle { width:80px; height:80px; border-radius:50%; background:#fff; border:3px solid #22c55e; display:flex; align-items:center; justify-content:center; font-size:32px; margin:0 auto 20px; box-shadow:0 0 0 6px #dcfce7; }
        .lp-how-num-badge { position:absolute; top:-8px; right:-8px; width:22px; height:22px; background:#16a34a; border-radius:50%; font-size:10px; font-weight:800; color:#fff; display:flex; align-items:center; justify-content:center; }
        .lp-how-title { font-size:16px; font-weight:700; color:#14532d; margin-bottom:10px; }
        .lp-how-desc { font-size:14px; line-height:1.65; color:#4b7a52; margin-bottom:14px; }
        .lp-how-tag { display:inline-flex; align-items:center; font-size:12px; font-weight:700; padding:5px 14px; border-radius:100px; border:1.5px solid; }

        /* FEATURES */
        .lp-feat-grid { display:grid; grid-template-columns:repeat(4,1fr); gap:20px; margin-top:56px; }
        .lp-feat-card { background:#fff; border:1px solid #e8f5e9; border-radius:20px; padding:28px 22px; transition:transform 0.2s, box-shadow 0.2s; }
        .lp-feat-card:hover { transform:translateY(-4px); box-shadow:0 10px 32px rgba(22,163,74,0.09); }
        .lp-feat-icon { width:48px; height:48px; border-radius:14px; background:#f0fdf4; border:1px solid #bbf7d0; display:flex; align-items:center; justify-content:center; font-size:22px; margin-bottom:16px; }
        .lp-feat-title { font-size:15px; font-weight:700; color:#14532d; margin-bottom:7px; }
        .lp-feat-desc { font-size:13px; line-height:1.65; color:#6b9270; }

        /* TRUST */
        .lp-trust-grid { display:grid; grid-template-columns:1fr 1fr; gap:60px; align-items:center; }
        .lp-trust-stat { display:flex; gap:14px; align-items:flex-start; margin-bottom:24px; }
        .lp-trust-icon { width:44px; height:44px; border-radius:12px; background:#f0fdf4; border:1px solid #bbf7d0; display:flex; align-items:center; justify-content:center; font-size:20px; flex-shrink:0; }
        .lp-trust-num { font-size:28px; font-weight:800; color:#16a34a; line-height:1; }
        .lp-trust-label { font-size:13px; color:#4b7a52; margin-top:4px; }
        .lp-quote { background:#f0fdf4; border-left:4px solid #22c55e; border-radius:0 16px 16px 0; padding:20px 24px; margin-top:32px; }
        .lp-quote-text { font-size:14px; color:#4b7a52; line-height:1.7; font-style:italic; margin-bottom:10px; }
        .lp-quote-name { font-size:13px; font-weight:700; color:#166534; }
        .lp-photo-grid { display:grid; grid-template-columns:1fr 1fr; gap:16px; }
        .lp-photo-tall { grid-row:1/3; border-radius:20px; background:linear-gradient(140deg,#dcfce7,#bbf7d0); border:3px solid #fff; box-shadow:0 4px 20px rgba(22,163,74,0.1); display:flex; flex-direction:column; align-items:center; justify-content:center; gap:8px; min-height:280px; }
        .lp-photo-sq { border-radius:16px; background:#f0fdf4; border:3px solid #fff; box-shadow:0 4px 16px rgba(22,163,74,0.07); display:flex; align-items:center; justify-content:center; height:130px; }

        /* TESTIMONIALS */
        .lp-testi-grid { display:grid; grid-template-columns:repeat(3,1fr); gap:24px; margin-top:56px; }
        .lp-testi-card { background:#fff; border:1px solid #e8f5e9; border-radius:20px; padding:28px; transition:transform 0.2s; }
        .lp-testi-card:hover { transform:translateY(-4px); }
        .lp-testi-q { font-size:48px; font-weight:800; color:#dcfce7; line-height:1; margin-bottom:8px; }
        .lp-testi-text { font-size:14px; line-height:1.75; color:#4b7a52; margin-bottom:20px; }
        .lp-testi-author { display:flex; align-items:center; gap:12px; }
        .lp-testi-av { width:44px; height:44px; border-radius:50%; display:flex; align-items:center; justify-content:center; font-size:16px; font-weight:800; color:#fff; flex-shrink:0; }
        .lp-testi-name { font-size:14px; font-weight:700; color:#14532d; }
        .lp-testi-role { font-size:12px; color:#6b9270; }

        /* CTA */
        .lp-cta { background:linear-gradient(135deg,#166534,#16a34a,#22c55e); padding:100px 60px; text-align:center; }
        .lp-cta-inner { max-width:640px; margin:0 auto; }
        .lp-cta-tag { font-size:12px; font-weight:700; letter-spacing:0.1em; text-transform:uppercase; color:rgba(255,255,255,0.7); margin-bottom:20px; }
        .lp-cta-h2 { font-size:clamp(26px,4vw,46px); font-weight:800; color:#fff; margin-bottom:16px; letter-spacing:-0.015em; }
        .lp-cta-p { font-size:16px; color:rgba(255,255,255,0.8); margin-bottom:40px; line-height:1.65; }
        .lp-cta-btns { display:flex; gap:14px; justify-content:center; flex-wrap:wrap; }
        .lp-btn-white { background:#fff; color:#16a34a; border:none; padding:16px 36px; border-radius:100px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:800; cursor:pointer; transition:transform 0.15s; }
        .lp-btn-white:hover { transform:translateY(-2px); }
        .lp-btn-outline-w { background:transparent; color:#fff; border:1.5px solid rgba(255,255,255,0.5); padding:16px 32px; border-radius:100px; font-family:'Plus Jakarta Sans',sans-serif; font-size:15px; font-weight:600; cursor:pointer; transition:background 0.2s; }
        .lp-btn-outline-w:hover { background:rgba(255,255,255,0.1); }

        /* FOOTER */
        .lp-footer { background:#f0fdf4; border-top:1px solid #dcfce7; padding:40px 60px; text-align:center; }
        .lp-footer-logo { font-size:18px; font-weight:800; color:#166534; margin-bottom:8px; }
        .lp-footer-tag { font-size:14px; color:#4b7a52; margin-bottom:6px; }
        .lp-footer-copy { font-size:12px; color:#6b9270; }

        /* RESPONSIVE */
        @media (max-width:1024px) {
          .lp-nav { padding:0 24px; }
          .lp-hero { padding:0 28px; }
          .lp-hero-inner { grid-template-columns:1fr; gap:40px; padding:110px 0 60px; }
          .lp-hero-right { display:none; }
          .lp-hero-bg-photo::before { background: linear-gradient(to right, rgba(240,253,244,0.97) 0%, rgba(220,252,231,0.93) 40%, rgba(187,247,208,0.70) 70%, rgba(134,239,172,0.25) 100%); }
          .lp-section, .lp-section-alt { padding:70px 28px; }
          .lp-why-grid { grid-template-columns:1fr; }
          .lp-how-line { display:none; }
          .lp-how-grid { grid-template-columns:1fr; gap:32px; }
          .lp-how-card { text-align:left; display:flex; gap:20px; align-items:flex-start; padding:0; }
          .lp-how-circle { margin:0; flex-shrink:0; }
          .lp-feat-grid { grid-template-columns:1fr 1fr; }
          .lp-trust-grid { grid-template-columns:1fr; }
          .lp-photo-grid { display:none; }
          .lp-testi-grid { grid-template-columns:1fr; }
          .lp-cta { padding:70px 28px; }
          .lp-footer { padding:32px 24px; }
        }
        @media (max-width:600px) {
          .lp-nav-links { display:none; }
          .lp-feat-grid { grid-template-columns:1fr; }
          .lp-hero-btns, .lp-cta-btns { flex-direction:column; }
          .lp-btn-green, .lp-btn-outline, .lp-btn-white, .lp-btn-outline-w { width:100%; text-align:center; }
        }
      `}</style>

      <div style={{ fontFamily:"'Plus Jakarta Sans',sans-serif", background:"#fff", color:"#1a2e1a", overflowX:"hidden" }}>

        {/* ── NAV ── */}
        <nav className={`lp-nav ${scrollY > 10 ? "scrolled" : ""}`}>
          <div className="lp-nav-inner">
            <div className="lp-logo">
              <span style={{ fontSize:24 }}>🌿</span> GraamSehat
            </div>
            <ul className="lp-nav-links">
              {["Home","About Us","Services","Features","Contact"].map(l => (
                <li key={l}><button className="lp-nl">{l}</button></li>
              ))}
            </ul>
            <div className="lp-nav-auth">
              <button className="lp-btn-login" onClick={() => navigate("/login")}>Log in</button>
              <button className="lp-btn-signup" onClick={() => navigate("/register")}>Sign up</button>
            </div>
          </div>
        </nav>

        {/* ── HERO ── */}
        <section className="lp-hero">

          {/* Full-bleed background photo — ::before = left gradient, ::after = vignette */}
          <div className="lp-hero-bg-photo">
            <img
              src="https://res.cloudinary.com/dvravcbwk/image/upload/q_auto/f_auto/v1775946191/WhatsApp_Image_2026-04-12_at_3.50.50_AM_egom86.jpg"
              alt="ASHA worker providing healthcare in rural India"
            />
          </div>

          <div className="lp-hero-inner">

            {/* LEFT — text on bright gradient zone */}
            <div className="lp-hero-left">
              <div className="lp-badge"><span className="lp-badge-dot" /> AI-Powered Rural Healthcare</div>
              <h1 className="lp-h1">Empowering Rural <span>Healthcare</span> with AI</h1>
              <p className="lp-hero-p">Helping ASHA workers provide faster, smarter care in villages — even without internet.</p>
              <div className="lp-hero-btns">
                <button className="lp-btn-green" onClick={() => navigate("/register")}>Get Started →</button>
                <button className="lp-btn-outline" onClick={() => navigate("/login")}>Log In</button>
              </div>
              <div className="lp-trust-row">
                <div className="lp-avatars">
                  {[["#16a34a","S"],["#1d4ed8","R"],["#9333ea","M"],["#dc2626","K"]].map(([bg,l],i)=>(
                    <div key={l} className="lp-av" style={{ background:bg, marginLeft:i===0?0:-8 }}>{l}</div>
                  ))}
                </div>
                <span className="lp-trust-text">1,400+ ASHA workers already using GraamSehat</span>
              </div>
            </div>

            {/* RIGHT — 3 glassmorphic cards floating on the photo */}
            <div className="lp-hero-right">

              {/* Card 1 — Villages */}
              <div className="lp-float1">
                <div className="lp-float-icon">
                  <span style={{ width:10,height:10,borderRadius:"50%",background:"#4ade80",display:"block",
                    boxShadow:"0 0 0 3px rgba(74,222,128,0.3)", animation:"lp-blink 1.6s ease-in-out infinite" }} />
                </div>
                <div>
                  <div className="lp-float-num">247 Villages</div>
                  <div className="lp-float-sub">24/7 Active Support</div>
                </div>
              </div>

              {/* Card 2 — Rural Outreach */}
              <div className="lp-float2">
                <div className="lp-float3-icon">🏥</div>
                <div>
                  <div className="lp-float-num">Rural Outreach</div>
                  <div className="lp-float-sub">Field-first Care</div>
                </div>
              </div>

              {/* Card 3 — Workers count */}
              <div className="lp-float3">
                <div className="lp-avatars">
                  {[["#16a34a","S"],["#1d4ed8","R"],["#9333ea","M"]].map(([bg,l],i)=>(
                    <div key={l} className="lp-av" style={{ background:bg,width:28,height:28,fontSize:11,marginLeft:i===0?0:-7 }}>{l}</div>
                  ))}
                </div>
                <div>
                  <div className="lp-float-num">1,400+ Workers</div>
                  <div className="lp-float-sub">Across Bihar & UP</div>
                </div>
              </div>

            </div>

          </div>
        </section>

        {/* ── WHY ── */}
        <section className="lp-section-alt">
          <div className="lp-section-inner" ref={r}>
            <span className="lp-section-tag">Why GraamSehat?</span>
            <h2 className="lp-h2">The Problem We're Solving</h2>
            <p className="lp-section-p">India's 900,000 ASHA workers are the backbone of rural healthcare — but they're working without the tools they need.</p>
            <div className="lp-why-grid" ref={r}>
              {whyCards.map(c => (
                <div className="lp-why-card" key={c.title}>
                  <div className="lp-why-icon">{c.icon}</div>
                  <div className="lp-why-title">{c.title}</div>
                  <div className="lp-why-desc">{c.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── HOW IT WORKS ── */}
        <section className="lp-section">
          <div className="lp-section-inner" ref={r}>
            <span className="lp-section-tag">How It Works</span>
            <h2 className="lp-h2">3 Simple Steps</h2>
            <p className="lp-section-p">Designed to be easy enough for any ASHA worker — even first-time smartphone users.</p>
            <div className="lp-how-wrap" ref={r}>
              <div className="lp-how-line" />
              <div className="lp-how-grid">
                {steps.map(s => (
                  <div className="lp-how-card" key={s.title}>
                    <div style={{ position:"relative", display:"inline-block" }}>
                      <div className="lp-how-circle">{s.emoji}</div>
                      <div className="lp-how-num-badge">{s.num}</div>
                    </div>
                    <div>
                      <div className="lp-how-title">{s.title}</div>
                      <div className="lp-how-desc">{s.desc}</div>
                      <div className="lp-how-tag" style={{ color:s.tagColor, borderColor:s.tagColor, background:s.tagBg }}>{s.tag}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </section>

        {/* ── FEATURES ── */}
        <section className="lp-section-alt">
          <div className="lp-section-inner" ref={r}>
            <span className="lp-section-tag">Features</span>
            <h2 className="lp-h2">Built for the Village</h2>
            <p className="lp-section-p">Every feature designed around the real constraints ASHA workers face daily.</p>
            <div className="lp-feat-grid" ref={r}>
              {features.map(f => (
                <div className="lp-feat-card" key={f.title}>
                  <div className="lp-feat-icon">{f.icon}</div>
                  <div className="lp-feat-title">{f.title}</div>
                  <div className="lp-feat-desc">{f.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── TRUST ── */}
        <section className="lp-section">
          <div className="lp-section-inner" ref={r}>
            <div className="lp-trust-grid">
              <div>
                <span className="lp-section-tag">Trusted by ASHA Workers</span>
                <h2 className="lp-h2">Built for Real Village Healthcare Needs</h2>
                <p className="lp-section-p" style={{ marginBottom:36 }}>We work directly with ASHA workers, ANMs, and PHC staff to make sure GraamSehat works in real conditions — dusty hands, low light, no data.</p>
                {[
                  { icon:"🟢", num:caseStats.green.toLocaleString(), label:"Green cases (Normal care needed)" },
                  { icon:"🟡", num:caseStats.yellow.toLocaleString(), label:"Yellow cases (Medical attention needed)" },
                  { icon:"🔴", num:caseStats.red.toLocaleString(), label:"Red cases (Emergency care needed)" },
                  { icon:"📊", num:caseStats.total.toLocaleString(), label:"Total cases triaged in last 30 days" },
                ].map(s => (
                  <div className="lp-trust-stat" key={s.num}>
                    <div className="lp-trust-icon">{s.icon}</div>
                    <div><div className="lp-trust-num">{s.num}</div><div className="lp-trust-label">{s.label}</div></div>
                  </div>
                ))}
                <div className="lp-quote">
                  <div className="lp-quote-text">"GraamSehat ne mera kaam bahut aasaan kar diya. Ab main patients ko sahi guidance de sakti hoon."</div>
                  <div className="lp-quote-name">— Sunita Devi, ASHA Worker, Patna</div>
                </div>
              </div>
              <div className="lp-photo-grid">
                <div className="lp-photo-tall"><span style={{ fontSize:80 }}>👩‍⚕️</span><span style={{ fontSize:13,fontWeight:700,color:"#166534" }}>ASHA at Work</span></div>
                <div>
                  <div className="lp-photo-sq" style={{ marginBottom:16 }}><span style={{ fontSize:44 }}>🏘️</span></div>
                  <div className="lp-photo-sq"><span style={{ fontSize:44 }}>👨‍👩‍👧</span></div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* ── TESTIMONIALS ── */}
        <section className="lp-section-alt">
          <div className="lp-section-inner" ref={r}>
            <span className="lp-section-tag">Testimonials</span>
            <h2 className="lp-h2">What ASHA Workers Say</h2>
            <div className="lp-testi-grid" ref={r}>
              {testimonials.map(t => (
                <div className="lp-testi-card" key={t.name}>
                  <div className="lp-testi-q">"</div>
                  <p className="lp-testi-text">{t.q}</p>
                  <div className="lp-testi-author">
                    <div className="lp-testi-av" style={{ background:t.bg }}>{t.av}</div>
                    <div><div className="lp-testi-name">{t.name}</div><div className="lp-testi-role">{t.role}</div></div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* ── CTA ── */}
        <section className="lp-cta" ref={r}>
          <div className="lp-cta-inner">
            <div className="lp-cta-tag">🌿 Start Today</div>
            <h2 className="lp-cta-h2">Start Helping Your Village Today</h2>
            <p className="lp-cta-p">Join 1,400+ ASHA workers delivering better healthcare with GraamSehat. Free to use. Easy to learn.</p>
            <div className="lp-cta-btns">
              <button className="lp-btn-white" onClick={() => navigate("/register")}>Login as ASHA Worker →</button>
              <button className="lp-btn-outline-w" onClick={() => navigate("/login")}>Already have an account?</button>
            </div>
          </div>
        </section>

        {/* ── FOOTER ── */}
        <footer className="lp-footer">
          <div className="lp-footer-logo">🌿 GraamSehat</div>
          <p className="lp-footer-tag">ग्राम स्वास्थ्य सहायक — Empowering Rural Health</p>
          <p className="lp-footer-copy">© 2024 GraamSehat. Made with ❤️ for rural India.</p>
        </footer>
      </div>
    </>
  );
}