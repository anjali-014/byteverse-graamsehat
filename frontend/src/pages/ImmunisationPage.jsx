import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar, sharedStyles } from "../components/Layout.jsx";
import { getCurrentUser, logoutUser } from "./utils/auth.js";
const pageStyles = `
  .immuno-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; margin-bottom: 24px; }
  .vaccine-row {
    display: flex; align-items: center; gap: 14px; padding: 13px 0;
    border-bottom: 1px solid #f0f5f1; transition: background .15s; border-radius: 8px;
    padding-left: 6px; padding-right: 6px; cursor: pointer;
  }
  .vaccine-row:hover { background: #f6fbf7; }
  .vaccine-row:last-child { border-bottom: none; }
  .vaccine-ico {
    width: 40px; height: 40px; border-radius: 11px; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center; font-size: 18px;
  }
  .vaccine-name   { font-size: 14px; font-weight: 700; color: var(--text-dark); }
  .vaccine-detail { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .progress-bar-wrap {
    height: 8px; background: #edf3ef; border-radius: 8px; overflow: hidden; margin-top: 8px;
  }
  .progress-bar-fill { height: 100%; border-radius: 8px; transition: width .5s ease; }
  .stat-mini { text-align: center; padding: 18px 16px; background: #fff; border-radius: 14px; border: 1px solid var(--border); }
  .stat-mini-val { font-family: 'DM Serif Display', serif; font-size: 28px; color: var(--text-dark); }
  .stat-mini-label { font-size: 12px; color: var(--text-muted); margin-top: 4px; }
  .child-row {
    display: flex; align-items: center; gap: 12px; padding: 12px 0; border-bottom: 1px solid #f0f5f1; cursor:pointer;
  }
  .child-row:hover { background: #f6fbf7; border-radius:8px; padding-left:6px; }
  .child-row:last-child { border-bottom: none; }
  .child-avatar {
    width: 36px; height: 36px; border-radius: 50%; background: linear-gradient(135deg, #42a5f5, #1565c0);
    display: flex; align-items: center; justify-content: center; font-size: 14px; font-weight: 700; color: #fff; flex-shrink:0;
  }
`;

const VACCINES = [
  { name:'BCG',           dose:'Birth dose',       age:'At birth',     icon:'💉', color:'#e8f5e9', done:12, total:12 },
  { name:'OPV-0',         dose:'Birth dose',       age:'At birth',     icon:'💊', color:'#e3f2fd', done:12, total:12 },
  { name:'Hepatitis B',   dose:'Birth dose',       age:'At birth',     icon:'🩺', color:'#fce4ec', done:11, total:12 },
  { name:'DPT-1',         dose:'Primary series',   age:'6 weeks',      icon:'💉', color:'#fff3e0', done:10, total:12 },
  { name:'OPV-1',         dose:'Primary series',   age:'6 weeks',      icon:'💊', color:'#e8f5e9', done:10, total:12 },
  { name:'Hib-1',         dose:'Primary series',   age:'6 weeks',      icon:'🩹', color:'#f3e5f5', done: 9, total:12 },
  { name:'Rotavirus-1',   dose:'Primary series',   age:'6 weeks',      icon:'💉', color:'#e0f2f1', done: 9, total:12 },
  { name:'DPT-2',         dose:'Primary series',   age:'10 weeks',     icon:'💉', color:'#fff3e0', done: 8, total:12 },
  { name:'Measles-1',     dose:'Primary',          age:'9 months',     icon:'💉', color:'#fce4ec', done: 7, total:12 },
  { name:'Vitamin A',     dose:'Supplementation',  age:'9 months',     icon:'🟡', color:'#fffde7', done: 8, total:12 },
  { name:'MMR',           dose:'Booster',          age:'15 months',    icon:'💉', color:'#f3e5f5', done: 6, total:12 },
  { name:'DPT Booster',   dose:'Booster',          age:'16–24 months', icon:'💉', color:'#e3f2fd', done: 5, total:12 },
];

const CHILDREN = [
  { name:'Arjun Kumar',   age:'6 weeks',  mother:'Sunita Devi',   next:'OPV-1 due',    urgency:'red',    date:'12 Apr' },
  { name:'Priya Singh',   age:'3 months', mother:'Meena Kumari',  next:'DPT-2 due',    urgency:'yellow', date:'15 Apr' },
  { name:'Rahul Prasad',  age:'9 months', mother:'Kamla Prasad',  next:'Measles-1 due',urgency:'yellow', date:'18 Apr' },
  { name:'Sita Yadav',    age:'15 months',mother:'Savitri Singh', next:'MMR due',       urgency:'green',  date:'22 Apr' },
  { name:'Mohan Gupta',   age:'2 months', mother:'Rekha Yadav',   next:'Hib-1 done ✓', urgency:'green',  date:'Done'   },
  { name:'Lata Kumari',   age:'6 months', mother:'Geeta Kumari',  next:'Rotavirus-2',  urgency:'yellow', date:'20 Apr' },
];

export default function Immunisation() {
  const navigate = useNavigate();
  const [showModal, setShowModal] = useState(false);
  const [selectedChild, setSelectedChild] = useState(null);
  const [form, setForm] = useState({ child:'', mother:'', vaccine:'BCG', date:'', notes:'' });
  const [logs, setLogs] = useState([
    { child:'Arjun Kumar', vaccine:'BCG', date:'01 Apr 2026', by:'Anjali Sharma' },
    { child:'Priya Singh',  vaccine:'DPT-1', date:'28 Mar 2026', by:'Anjali Sharma' },
    { child:'Mohan Gupta',  vaccine:'Hib-1', date:'10 Apr 2026', by:'Anjali Sharma' },
  ]);

  const urgencyBadge = { red:'badge-red', yellow:'badge-yellow', green:'badge-green' };
  const urgencyLabel = { red:'Urgent', yellow:'Due soon', green:'On track' };

  const logVaccine = () => {
    if (!form.child || !form.vaccine || !form.date) return;
    setLogs(l => [{ child:form.child, vaccine:form.vaccine, date:new Date(form.date).toLocaleDateString('en-IN',{day:'numeric',month:'short',year:'numeric'}), by:'You' }, ...l]);
    setShowModal(false);
    setForm({ child:'', mother:'', vaccine:'BCG', date:'', notes:'' });
  };

  const totalDone = VACCINES.reduce((a,v)=>a+v.done,0);
  const totalTarget = VACCINES.reduce((a,v)=>a+v.total,0);

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>
      <Sidebar />
      <Topbar page="Immunisation" />

      <div className="d-layout">
        <div className="d-content">
          <div className="page-header">
            <div>
              <div className="page-title">💉 Immunisation Tracker</div>
              <div className="page-subtitle">National immunisation programme — vaccine monitoring</div>
            </div>
            <button className="btn-primary" onClick={() => setShowModal(true)}>+ Log Vaccine</button>
          </div>

          {/* Summary mini-stats */}
          <div style={{ display:'grid', gridTemplateColumns:'repeat(4,1fr)', gap:16, marginBottom:24 }}>
            {[
              { val:CHILDREN.length, label:'Children in roster', ico:'👶', color:'#e3f2fd' },
              { val:CHILDREN.filter(c=>c.urgency==='red').length, label:'Urgent / Overdue', ico:'🚨', color:'#ffebee' },
              { val:CHILDREN.filter(c=>c.urgency==='yellow').length, label:'Due this week', ico:'⏰', color:'#fff8e1' },
              { val:logs.length, label:'Vaccines logged', ico:'✅', color:'#e8f5e9' },
            ].map((s,i)=>(
              <div key={i} className="d-card" style={{ padding:'18px 20px', display:'flex', gap:14, alignItems:'center' }}>
                <div style={{ width:44,height:44,borderRadius:12,background:s.color,display:'flex',alignItems:'center',justifyContent:'center',fontSize:20,flexShrink:0 }}>{s.ico}</div>
                <div>
                  <div style={{ fontFamily:"'DM Serif Display', serif", fontSize:26, color:'var(--text-dark)' }}>{s.val}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)' }}>{s.label}</div>
                </div>
              </div>
            ))}
          </div>

          <div className="immuno-grid">
            {/* Children list */}
            <div className="d-card">
              <div className="d-card-header">
                <div className="d-card-title">👶 Children — Vaccine Status</div>
                <button className="d-card-action" onClick={() => setShowModal(true)}>+ Log</button>
              </div>
              <div className="d-card-body">
                {CHILDREN.map((c, i) => (
                  <div className="child-row" key={i} onClick={() => setSelectedChild(c)}>
                    <div className="child-avatar">{c.name.split(' ').map(n=>n[0]).join('').slice(0,2)}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, fontSize:13.5, color:'var(--text-dark)' }}>{c.name}</div>
                      <div style={{ fontSize:12, color:'var(--text-muted)' }}>Age: {c.age} · Mother: {c.mother}</div>
                      <div style={{ fontSize:12, color:'var(--text-mid)', marginTop:2, fontWeight:600 }}>{c.next}</div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <span className={`badge ${urgencyBadge[c.urgency]}`}>{urgencyLabel[c.urgency]}</span>
                      <div style={{ fontSize:11, color:'var(--text-muted)', marginTop:4 }}>{c.date}</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Vaccine schedule */}
            <div className="d-card">
              <div className="d-card-header">
                <div className="d-card-title">📋 Vaccine Schedule (NIP)</div>
                <span className="badge badge-green">{Math.round(totalDone/totalTarget*100)}% complete</span>
              </div>
              <div className="d-card-body">
                {VACCINES.slice(0,8).map((v, i) => (
                  <div className="vaccine-row" key={i}>
                    <div className="vaccine-ico" style={{ background: v.color }}>{v.icon}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="vaccine-name">{v.name}</div>
                      <div className="vaccine-detail">{v.dose} · {v.age}</div>
                      <div className="progress-bar-wrap">
                        <div className="progress-bar-fill" style={{ width:`${v.done/v.total*100}%`, background: v.done===v.total?'#4caf50':'#ffb300' }} />
                      </div>
                    </div>
                    <div style={{ textAlign:'right', flexShrink:0 }}>
                      <div style={{ fontSize:12, fontWeight:700, color:v.done===v.total?'#2e7d32':'#f57f17' }}>{v.done}/{v.total}</div>
                      <div style={{ fontSize:11, color:'var(--text-muted)' }}>given</div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Recent logs */}
          <div className="d-card">
            <div className="d-card-header">
              <div className="d-card-title">📝 Recent Vaccine Logs</div>
              <button className="d-card-action" onClick={() => setShowModal(true)}>+ Log new</button>
            </div>
            <div className="d-card-body" style={{ padding:0 }}>
              <table className="gs-table">
                <thead>
                  <tr>
                    <th>Child</th><th>Vaccine</th><th>Date Given</th><th>ASHA Worker</th><th>Action</th>
                  </tr>
                </thead>
                <tbody>
                  {logs.map((l,i) => (
                    <tr key={i}>
                      <td><strong>{l.child}</strong></td>
                      <td><span className="badge badge-green">💉 {l.vaccine}</span></td>
                      <td>{l.date}</td>
                      <td>{l.by}</td>
                      <td><button className="patient-action-btn">📄 View</button></td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="gs-modal-backdrop" onClick={e=>e.target.className==='gs-modal-backdrop'&&setShowModal(false)}>
          <div className="gs-modal">
            <div className="gs-modal-header">
              <div className="gs-modal-title">💉 Log Vaccine</div>
              <button className="gs-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="gs-modal-body">
              <div className="gs-form-group">
                <label className="gs-label">Child's Name *</label>
                <input className="gs-input" placeholder="e.g. Arjun Kumar" value={form.child} onChange={e=>setForm(f=>({...f,child:e.target.value}))} />
              </div>
              <div className="gs-form-group">
                <label className="gs-label">Mother's Name</label>
                <input className="gs-input" placeholder="e.g. Sunita Devi" value={form.mother} onChange={e=>setForm(f=>({...f,mother:e.target.value}))} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div className="gs-form-group">
                  <label className="gs-label">Vaccine *</label>
                  <select className="gs-select" value={form.vaccine} onChange={e=>setForm(f=>({...f,vaccine:e.target.value}))}>
                    {VACCINES.map(v=><option key={v.name}>{v.name}</option>)}
                  </select>
                </div>
                <div className="gs-form-group">
                  <label className="gs-label">Date Given *</label>
                  <input className="gs-input" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
                </div>
              </div>
              <div className="gs-form-group">
                <label className="gs-label">Notes / Observations</label>
                <textarea className="gs-textarea" placeholder="Any adverse reactions or observations…" value={form.notes} onChange={e=>setForm(f=>({...f,notes:e.target.value}))} />
              </div>
            </div>
            <div className="gs-modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={logVaccine}>💉 Log Vaccine</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
