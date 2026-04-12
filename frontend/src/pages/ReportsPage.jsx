import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar, sharedStyles } from "../components/Layout.jsx";
import { getCurrentUser, logoutUser } from "./utils/auth.js";

const pageStyles = `
  .report-card { background:#fff; border-radius:16px; border:1px solid var(--border); box-shadow:var(--card-shadow); padding:22px; animation:fadeUp .5s ease both; }
  .bar-chart { display:flex; align-items:flex-end; gap:10px; height:140px; margin-top:12px; }
  .bar-col { display:flex; flex-direction:column; align-items:center; gap:4px; flex:1; }
  .bar-fill { width:100%; border-radius:6px 6px 0 0; min-height:4px; transition:height .5s ease; cursor:pointer; }
  .bar-label { font-size:10px; color:var(--text-muted); font-weight:600; }
  .bar-val   { font-size:11px; font-weight:700; color:var(--text-dark); }
  .donut-wrap { position:relative; width:140px; height:140px; flex-shrink:0; }
  .donut-label { position:absolute; inset:0; display:flex; flex-direction:column; align-items:center; justify-content:center; }
  .donut-num  { font-family:"'DM Serif Display',serif"; font-size:28px; color:var(--text-dark); font-weight:700; }
  .donut-sub  { font-size:11px; color:var(--text-muted); }
  .legend-item { display:flex; align-items:center; gap:8px; font-size:12.5px; color:var(--text-mid); margin-bottom:6px; }
  .legend-dot  { width:12px; height:12px; border-radius:3px; flex-shrink:0; }
  .metric-row {
    display:flex; align-items:center; justify-content:space-between;
    padding:12px 0; border-bottom:1px solid #f0f5f1;
  }
  .metric-row:last-child { border-bottom:none; }
  .metric-label { font-size:13.5px; color:var(--text-mid); font-weight:500; }
  .metric-val   { font-size:15px; font-weight:700; color:var(--text-dark); }
  .metric-trend { font-size:11px; font-weight:600; padding:2px 8px; border-radius:50px; }
  .trend-up   { background:#e8f5e9; color:#2e7d32; }
  .trend-down { background:#ffebee; color:#c62828; }
  .tab-row { display:flex; gap:6px; margin-bottom:20px; }
  .report-tab { padding:8px 18px; border-radius:50px; font-size:13px; font-weight:600; cursor:pointer; border:1.5px solid var(--border); background:#fff; color:var(--text-mid); font-family:'DM Sans',sans-serif; transition:all .18s; }
  .report-tab.active { background:var(--green-mid); color:#fff; border-color:var(--green-mid); }
  .report-tab:hover:not(.active) { border-color:var(--green-bright); color:var(--green-mid); }
`;

const MONTHLY_DATA = [
  { month:'Oct', anc:8,  immuno:12, followup:5,  total:25 },
  { month:'Nov', anc:11, immuno:9,  followup:7,  total:27 },
  { month:'Dec', anc:7,  immuno:14, followup:4,  total:25 },
  { month:'Jan', anc:13, immuno:11, followup:9,  total:33 },
  { month:'Feb', anc:10, immuno:16, followup:6,  total:32 },
  { month:'Mar', anc:15, immuno:13, followup:11, total:39 },
  { month:'Apr', anc:9,  immuno:8,  followup:7,  total:24 },
];

const METRICS = [
  { label:'Total Home Visits (This Month)',  val:'24',  trend:'+18%', up:true  },
  { label:'ANC Visits Completed',           val:'9',   trend:'+12%', up:true  },
  { label:'Immunisation Sessions',          val:'8',   trend:'-5%',  up:false },
  { label:'High-Risk Cases Identified',     val:'3',   trend:'+2',   up:false },
  { label:'Referrals Made to PHC',          val:'2',   trend:'Same', up:true  },
  { label:'Deliveries Attended',            val:'1',   trend:'+1',   up:true  },
  { label:'Children Fully Immunised',       val:'4',   trend:'+1',   up:true  },
  { label:'Mothers on Iron Supplements',    val:'11',  trend:'+3',   up:true  },
];

const TRIAGE_BREAKDOWN = { GREEN: 56, YELLOW: 31, RED: 13 };

function SimpleDonut({ data }) {
  const total = Object.values(data).reduce((a,b)=>a+b,0);
  const colors = { GREEN:'#4caf50', YELLOW:'#ffb300', RED:'#ef5350' };
  let cumulative = 0;
  const slices = Object.entries(data).map(([k,v]) => {
    const pct = (v/total)*100;
    const startAngle = (cumulative/100)*360;
    const endAngle   = ((cumulative+pct)/100)*360;
    cumulative += pct;
    return { key:k, pct, startAngle, endAngle, color:colors[k] };
  });

  // Simple SVG donut
  const cx=70, cy=70, r=55, inner=36;
  function describeArc(cx,cy,r,startAngle,endAngle) {
    const start = polarToCartesian(cx,cy,r,endAngle);
    const end   = polarToCartesian(cx,cy,r,startAngle);
    const large = endAngle-startAngle <= 180 ? 0 : 1;
    return `M ${start.x} ${start.y} A ${r} ${r} 0 ${large} 0 ${end.x} ${end.y}`;
  }
  function polarToCartesian(cx,cy,r,angleDeg) {
    const rad = (angleDeg-90)*Math.PI/180;
    return { x: cx+r*Math.cos(rad), y: cy+r*Math.sin(rad) };
  }

  return (
    <svg width={140} height={140} viewBox="0 0 140 140">
      <circle cx={cx} cy={cy} r={r} fill="none" stroke="#f0f5f1" strokeWidth={19} />
      {slices.map(s => (
        <path key={s.key} d={describeArc(cx,cy,r,s.startAngle,s.endAngle)}
          fill="none" stroke={s.color} strokeWidth={18} strokeLinecap="round" />
      ))}
      <text x={cx} y={cy-8} textAnchor="middle" fontSize={24} fontWeight={700} fill="#0f1e13" fontFamily="'DM Serif Display',serif">{total}</text>
      <text x={cx} y={cy+12} textAnchor="middle" fontSize={11} fill="#7a9e82">Total</text>
    </svg>
  );
}

export default function Reports() {
  const navigate = useNavigate();
  const [period, setPeriod] = useState('monthly');
  const [showExport, setShowExport] = useState(false);
  const maxTotal = Math.max(...MONTHLY_DATA.map(d=>d.total));

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>
      <Sidebar />
      <Topbar page="Reports" />

      <div className="d-layout">
        <div className="d-content">
          <div className="page-header">
            <div>
              <div className="page-title">📊 Reports & Analytics</div>
              <div className="page-subtitle">Monthly performance summary for Bihta Block</div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-secondary" onClick={() => setShowExport(true)}>📤 Export Report</button>
              <button className="btn-primary" onClick={() => setShowExport(true)}>📥 Submit to ANM</button>
            </div>
          </div>

          {/* Period tabs */}
          <div className="tab-row">
            {[{k:'weekly',label:'Weekly'},{k:'monthly',label:'Monthly'},{k:'quarterly',label:'Quarterly'}].map(t=>(
              <button key={t.k} className={`report-tab ${period===t.k?'active':''}`} onClick={()=>setPeriod(t.k)}>{t.label}</button>
            ))}
          </div>

          {/* Top row */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:20, marginBottom:20 }}>

            {/* Bar chart */}
            <div className="report-card" style={{ gridColumn:'1/3' }}>
              <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                <div style={{ fontSize:14, fontWeight:700, color:'var(--text-dark)' }}>📈 Visit Trends (Last 7 Months)</div>
                <div style={{ display:'flex', gap:12 }}>
                  {[{c:'#25a045',l:'ANC'},{c:'#2196f3',l:'Immuno'},{c:'#ffb300',l:'Follow-up'}].map(d=>(
                    <span key={d.l} style={{ display:'flex', alignItems:'center', gap:4, fontSize:11, color:'var(--text-muted)', fontWeight:600 }}>
                      <span style={{ width:10, height:10, borderRadius:3, background:d.c, display:'inline-block' }} />{d.l}
                    </span>
                  ))}
                </div>
              </div>
              <div className="bar-chart">
                {MONTHLY_DATA.map((d, i) => (
                  <div className="bar-col" key={i}>
                    <div className="bar-val">{d.total}</div>
                    <div style={{ flex:1, width:'100%', display:'flex', alignItems:'flex-end', gap:2 }}>
                      {[{val:d.anc,color:'#25a045'},{val:d.immuno,color:'#2196f3'},{val:d.followup,color:'#ffb300'}].map((b,j)=>(
                        <div key={j} style={{ flex:1, background:b.color, borderRadius:'4px 4px 0 0', height:`${(b.val/maxTotal)*100}%`, opacity:.85 }} />
                      ))}
                    </div>
                    <div className="bar-label">{d.month}</div>
                  </div>
                ))}
              </div>
            </div>

            {/* Donut */}
            <div className="report-card">
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text-dark)', marginBottom:12 }}>🎯 Case Triage Breakdown</div>
              <div style={{ display:'flex', flexDirection:'column', alignItems:'center', gap:16 }}>
                <SimpleDonut data={TRIAGE_BREAKDOWN} />
                <div style={{ width:'100%' }}>
                  {[
                    { k:'GREEN',  color:'#4caf50', label:'Green (Safe)',     pct:TRIAGE_BREAKDOWN.GREEN  },
                    { k:'YELLOW', color:'#ffb300', label:'Yellow (Monitor)', pct:TRIAGE_BREAKDOWN.YELLOW },
                    { k:'RED',    color:'#ef5350', label:'Red (Urgent)',     pct:TRIAGE_BREAKDOWN.RED    },
                  ].map(l=>(
                    <div key={l.k} className="legend-item">
                      <div className="legend-dot" style={{ background:l.color }} />
                      <span style={{ flex:1 }}>{l.label}</span>
                      <span style={{ fontWeight:700, color:'var(--text-dark)' }}>{l.pct}%</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>

          {/* Metrics table */}
          <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:20 }}>
            <div className="report-card">
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text-dark)', marginBottom:14 }}>📋 This Month's Metrics</div>
              {METRICS.map((m,i)=>(
                <div className="metric-row" key={i}>
                  <div className="metric-label">{m.label}</div>
                  <div style={{ display:'flex', alignItems:'center', gap:10 }}>
                    <div className="metric-val">{m.val}</div>
                    <span className={`metric-trend ${m.up?'trend-up':'trend-down'}`}>{m.trend}</span>
                  </div>
                </div>
              ))}
            </div>

            <div className="report-card">
              <div style={{ fontSize:14, fontWeight:700, color:'var(--text-dark)', marginBottom:14 }}>🏥 Programme Coverage</div>
              {[
                { label:'ANC Registration Coverage',    pct:82, color:'#25a045' },
                { label:'Institutional Delivery Rate',  pct:68, color:'#2196f3' },
                { label:'Full Immunisation Coverage',   pct:74, color:'#9c27b0' },
                { label:'Anaemia Treatment Coverage',   pct:59, color:'#ff7043' },
                { label:'Family Planning Counselled',   pct:45, color:'#00acc1' },
                { label:'High-Risk Pregnancies Tracked',pct:91, color:'#ef5350' },
              ].map((p,i)=>(
                <div key={i} style={{ marginBottom:14 }}>
                  <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                    <div style={{ fontSize:13, color:'var(--text-mid)', fontWeight:500 }}>{p.label}</div>
                    <div style={{ fontSize:13, fontWeight:700, color:'var(--text-dark)' }}>{p.pct}%</div>
                  </div>
                  <div style={{ height:8, background:'#edf3ef', borderRadius:8, overflow:'hidden' }}>
                    <div style={{ height:'100%', width:`${p.pct}%`, background:p.color, borderRadius:8, transition:'width .6s ease' }} />
                  </div>
                </div>
              ))}

              <div style={{ marginTop:20, padding:14, background:'var(--green-pale)', borderRadius:12, border:'1px solid rgba(37,160,69,0.2)' }}>
                <div style={{ fontSize:12, fontWeight:700, color:'var(--green-mid)', marginBottom:4 }}>📤 Monthly Report Status</div>
                <div style={{ fontSize:13, color:'var(--text-mid)' }}>April 2026 report — <strong style={{color:'var(--green-mid)'}}>Ready to submit</strong></div>
                <button className="btn-primary" style={{ marginTop:10, padding:'8px 16px', fontSize:12, width:'100%', justifyContent:'center' }} onClick={() => setShowExport(true)}>
                  Submit to Block ANM →
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showExport && (
        <div className="gs-modal-backdrop" onClick={e=>e.target.className==='gs-modal-backdrop'&&setShowExport(false)}>
          <div className="gs-modal">
            <div className="gs-modal-header">
              <div className="gs-modal-title">📤 Submit / Export Report</div>
              <button className="gs-modal-close" onClick={() => setShowExport(false)}>✕</button>
            </div>
            <div className="gs-modal-body">
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {[
                  { ico:'📊', title:'Monthly Activity Report', desc:'April 2026 — visits, immunisation, ANC data' },
                  { ico:'🤱', title:'MCP Card Summary',        desc:'Mother & child protection data' },
                  { ico:'💉', title:'Immunisation Register',   desc:'Vaccine coverage and due list' },
                  { ico:'📋', title:'High-Risk Pregnancy List',desc:'RED & YELLOW triage cases' },
                ].map((r,i)=>(
                  <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'14px 16px', background:'#f8faf8', borderRadius:12, border:'1px solid var(--border)', cursor:'pointer', transition:'all .18s' }}>
                    <div style={{ fontSize:24 }}>{r.ico}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontWeight:700, color:'var(--text-dark)', fontSize:13.5 }}>{r.title}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>{r.desc}</div>
                    </div>
                    <button className="btn-secondary" style={{ fontSize:12, padding:'6px 12px' }}>Download</button>
                  </div>
                ))}
              </div>
            </div>
            <div className="gs-modal-footer">
              <button className="btn-secondary" onClick={() => setShowExport(false)}>Close</button>
              <button className="btn-primary">📨 Submit All to ANM</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}