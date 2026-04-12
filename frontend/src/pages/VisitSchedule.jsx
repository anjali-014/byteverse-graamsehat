import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Topbar, sharedStyles } from "../components/Layout.jsx";
import { getCurrentUser, logoutUser } from "./utils/auth.js";

const pageStyles = `
  .schedule-grid { display: grid; grid-template-columns: 1fr 340px; gap: 24px; }
  .cal-grid {
    display: grid; grid-template-columns: repeat(7, 1fr); gap: 4px;
  }
  .cal-day-label { text-align:center; font-size:11px; font-weight:700; color:var(--text-muted); padding:8px 0; text-transform:uppercase; letter-spacing:.06em; }
  .cal-cell {
    min-height: 72px; border-radius: 10px; padding: 6px; cursor:pointer;
    border: 1.5px solid transparent; transition: all .18s; background: #fff;
    position: relative;
  }
  .cal-cell:hover { border-color: var(--green-bright); background: #f6fbf7; }
  .cal-cell.today { border-color: var(--green-bright); background: var(--green-pale); }
  .cal-cell.other-month { background: #f8f8f8; opacity: .5; cursor: default; }
  .cal-cell.has-visits { border-color: rgba(37,160,69,0.3); }
  .cal-day-num { font-size:13px; font-weight:700; color:var(--text-dark); margin-bottom:4px; }
  .cal-cell.today .cal-day-num { color:var(--green-mid); }
  .cal-dot { width:100%; height:5px; border-radius:3px; margin-bottom:2px; }
  .cal-dot-red    { background:#ef5350; }
  .cal-dot-yellow { background:#ffb300; }
  .cal-dot-green  { background:#4caf50; }

  .visit-list-item {
    display: flex; align-items: center; gap: 14px; padding: 14px 0;
    border-bottom: 1px solid #f0f5f1; cursor:pointer; transition: background .15s; border-radius:8px; padding-left:6px;
  }
  .visit-list-item:hover { background: #f6fbf7; }
  .visit-list-item:last-child { border-bottom:none; }
  .visit-time-badge {
    width: 56px; flex-shrink:0; text-align:center;
    background: var(--green-pale); border-radius:10px; padding:8px 6px;
    border: 1px solid rgba(37,160,69,0.18);
  }
  .visit-time-hr   { font-size:15px; font-weight:700; color:var(--green-mid); line-height:1; }
  .visit-time-ampm { font-size:10px; color:var(--text-muted); font-weight:600; }
  .visit-purpose   { font-size:12px; color:var(--text-muted); margin-top:2px; }
  .visit-type-chip {
    font-size:11px; font-weight:700; padding:3px 9px; border-radius:50px; flex-shrink:0;
  }
  .chip-anc      { background:#fce4ec; color:#c2185b; }
  .chip-postnatal{ background:#f3e5f5; color:#7b1fa2; }
  .chip-immuno   { background:#e8f5e9; color:#2e7d32; }
  .chip-followup { background:#fff8e1; color:#f57f17; }
  .chip-general  { background:#e3f2fd; color:#1565c0; }

  .week-strip {
    display: flex; gap: 8px; margin-bottom:20px; overflow-x:auto; padding-bottom:4px;
  }
  .week-day-btn {
    flex-shrink:0; width:54px; padding:10px 8px; border-radius:12px; text-align:center;
    cursor:pointer; border: 1.5px solid var(--border); background:#fff; transition:all .18s;
  }
  .week-day-btn:hover { border-color:var(--green-bright); }
  .week-day-btn.active { background:var(--green-mid); border-color:var(--green-mid); }
  .week-day-btn .wd-name { font-size:10px; font-weight:700; text-transform:uppercase; color:var(--text-muted); }
  .week-day-btn .wd-num  { font-size:18px; font-weight:700; color:var(--text-dark); }
  .week-day-btn.active .wd-name, .week-day-btn.active .wd-num { color:#fff; }
  .week-day-btn .wd-dot  { width:6px; height:6px; border-radius:50%; background:var(--green-bright); margin:4px auto 0; }
  .week-day-btn.active .wd-dot { background:rgba(255,255,255,0.6); }
`;

const VISIT_TYPES = [
  { label:'ANC Check',       cls:'chip-anc',       ico:'🤱' },
  { label:'Post-natal',      cls:'chip-postnatal',  ico:'👶' },
  { label:'Immunisation',    cls:'chip-immuno',     ico:'💉' },
  { label:'Follow-up',       cls:'chip-followup',   ico:'🔄' },
  { label:'General Visit',   cls:'chip-general',    ico:'🏠' },
];

const TODAY = new Date();
const today_d = TODAY.getDate();
const today_m = TODAY.getMonth();
const today_y = TODAY.getFullYear();

function pad(n){ return String(n).padStart(2,'0'); }

const DAYS = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

const initVisits = [
  { id:1, date:`${today_y}-${pad(today_m+1)}-${pad(today_d)}`,    time:'10:00', ampm:'AM', name:'Sunita Devi',    purpose:'ANC Check · High Risk',    type:'ANC Check' },
  { id:2, date:`${today_y}-${pad(today_m+1)}-${pad(today_d+1)}`,  time:'11:30', ampm:'AM', name:'Meena Kumari',   purpose:'Post-natal Day 15',         type:'Post-natal' },
  { id:3, date:`${today_y}-${pad(today_m+1)}-${pad(today_d+2)}`,  time:'9:00',  ampm:'AM', name:'Kamla Prasad',   purpose:'Child Immunisation',         type:'Immunisation' },
  { id:4, date:`${today_y}-${pad(today_m+1)}-${pad(today_d+3)}`,  time:'3:00',  ampm:'PM', name:'Savitri Singh',  purpose:'Diabetes Follow-up',         type:'Follow-up' },
  { id:5, date:`${today_y}-${pad(today_m+1)}-${pad(today_d+5)}`,  time:'10:30', ampm:'AM', name:'Rekha Yadav',    purpose:'ANC Check · 2nd Trimester',  type:'ANC Check' },
  { id:6, date:`${today_y}-${pad(today_m+1)}-${pad(today_d+7)}`,  time:'2:00',  ampm:'PM', name:'Geeta Kumari',   purpose:'BCG Immunisation',           type:'Immunisation' },
];

export default function VisitSchedule() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefill = location.state?.patient;

  const [visits, setVisits] = useState(initVisits);
  const [selectedDate, setSelectedDate] = useState(`${today_y}-${pad(today_m+1)}-${pad(today_d)}`);
  const [showModal, setShowModal] = useState(false);
  const [form, setForm] = useState({
    name: prefill?.name || '', date:'', time:'', ampm:'AM', purpose:'', type:'ANC Check'
  });

  const dayVisits = visits.filter(v => v.date === selectedDate).sort((a,b)=>a.time.localeCompare(b.time));

  // Build week strip (7 days from today)
  const weekDays = Array.from({length:7},(_,i)=>{
    const d = new Date(TODAY); d.setDate(today_d + i);
    return {
      key: `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`,
      name: DAYS[d.getDay()],
      num: d.getDate(),
      hasVisits: visits.some(v => v.date === `${d.getFullYear()}-${pad(d.getMonth()+1)}-${pad(d.getDate())}`),
    };
  });

  const upcoming = [...visits]
    .filter(v => v.date >= `${today_y}-${pad(today_m+1)}-${pad(today_d)}`)
    .sort((a,b)=>a.date.localeCompare(b.date)||a.time.localeCompare(b.time))
    .slice(0,10);

  const addVisit = () => {
    if (!form.name || !form.date || !form.time) return;
    setVisits(v => [...v, { id: Date.now(), ...form }]);
    setShowModal(false);
    setSelectedDate(form.date);
    setForm({ name:'', date:'', time:'', ampm:'AM', purpose:'', type:'ANC Check' });
  };

  const typeInfo = (t) => VISIT_TYPES.find(x=>x.label===t) || VISIT_TYPES[4];

  const displayDate = (dateStr) => {
    const [y,m,d] = dateStr.split('-').map(Number);
    return `${d} ${MONTHS[m-1]}`;
  };

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>
      <Sidebar />
      <Topbar page="Visit Schedule" />

      <div className="d-layout">
        <div className="d-content">
          <div className="page-header">
            <div>
              <div className="page-title">📅 Visit Schedule</div>
              <div className="page-subtitle">{upcoming.length} upcoming visits</div>
            </div>
            <button className="btn-primary" onClick={() => setShowModal(true)}>➕ Schedule Visit</button>
          </div>

          {/* Week strip */}
          <div className="week-strip">
            {weekDays.map(d => (
              <div key={d.key} className={`week-day-btn ${selectedDate === d.key ? 'active' : ''}`}
                onClick={() => setSelectedDate(d.key)}>
                <div className="wd-name">{d.name}</div>
                <div className="wd-num">{d.num}</div>
                {d.hasVisits && <div className="wd-dot" />}
              </div>
            ))}
          </div>

          <div className="schedule-grid">
            {/* Day visits */}
            <div className="d-card">
              <div className="d-card-header">
                <div className="d-card-title">🗓️ {displayDate(selectedDate)} — Visits</div>
                <button className="d-card-action" onClick={() => setShowModal(true)}>+ Add</button>
              </div>
              <div className="d-card-body">
                {dayVisits.length === 0 ? (
                  <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text-muted)' }}>
                    <div style={{ fontSize:36, marginBottom:10 }}>📭</div>
                    <div style={{ fontWeight:600, marginBottom:8 }}>No visits scheduled</div>
                    <button className="btn-primary" onClick={() => setShowModal(true)}>Schedule a Visit</button>
                  </div>
                ) : dayVisits.map((v, i) => (
                  <div className="visit-list-item" key={v.id}>
                    <div className="visit-time-badge">
                      <div className="visit-time-hr">{v.time}</div>
                      <div className="visit-time-ampm">{v.ampm}</div>
                    </div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div style={{ fontWeight:700, color:'var(--text-dark)', fontSize:14 }}>{v.name}</div>
                      <div className="visit-purpose">{v.purpose}</div>
                    </div>
                    <span className={`visit-type-chip ${typeInfo(v.type).cls}`}>{typeInfo(v.type).ico} {v.type}</span>
                    <button className="patient-action-btn" style={{ fontSize:12 }}
                      onClick={() => navigate('/triage', { state:{ patient:{ name: v.name } } })}>Start →</button>
                  </div>
                ))}
              </div>
            </div>

            {/* Upcoming sidebar */}
            <div>
              <div className="d-card">
                <div className="d-card-header">
                  <div className="d-card-title">📋 Upcoming Visits</div>
                </div>
                <div className="d-card-body" style={{ padding:'8px 16px 16px' }}>
                  {upcoming.map((v, i) => (
                    <div key={v.id} style={{ display:'flex', alignItems:'flex-start', gap:10, padding:'10px 0', borderBottom: i<upcoming.length-1?'1px solid #f0f5f1':'none', cursor:'pointer' }}
                      onClick={() => setSelectedDate(v.date)}>
                      <div style={{ flexShrink:0, width:40, height:40, borderRadius:10, background:'var(--green-pale)', border:'1px solid rgba(37,160,69,0.18)', display:'flex', flexDirection:'column', alignItems:'center', justifyContent:'center' }}>
                        <div style={{ fontSize:14, fontWeight:700, color:'var(--green-mid)', lineHeight:1 }}>{v.date.split('-')[2]}</div>
                        <div style={{ fontSize:9, fontWeight:600, color:'var(--text-muted)', textTransform:'uppercase' }}>{MONTHS[parseInt(v.date.split('-')[1])-1].slice(0,3)}</div>
                      </div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13, fontWeight:700, color:'var(--text-dark)' }}>{v.name}</div>
                        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{v.purpose} · {v.time} {v.ampm}</div>
                      </div>
                    </div>
                  ))}
                  {upcoming.length === 0 && (
                    <div style={{ textAlign:'center', padding:'24px 0', color:'var(--text-muted)' }}>No upcoming visits</div>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      {showModal && (
        <div className="gs-modal-backdrop" onClick={e => e.target.className==='gs-modal-backdrop'&&setShowModal(false)}>
          <div className="gs-modal">
            <div className="gs-modal-header">
              <div className="gs-modal-title">📅 Schedule New Visit</div>
              <button className="gs-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="gs-modal-body">
              <div className="gs-form-group">
                <label className="gs-label">Patient Name *</label>
                <input className="gs-input" placeholder="e.g. Sunita Devi" value={form.name} onChange={e=>setForm(f=>({...f,name:e.target.value}))} />
              </div>
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16 }}>
                <div className="gs-form-group">
                  <label className="gs-label">Date *</label>
                  <input className="gs-input" type="date" value={form.date} onChange={e=>setForm(f=>({...f,date:e.target.value}))} />
                </div>
                <div className="gs-form-group">
                  <label className="gs-label">Time *</label>
                  <input className="gs-input" type="time" value={form.time} onChange={e=>setForm(f=>({...f,time:e.target.value}))} />
                </div>
              </div>
              <div className="gs-form-group">
                <label className="gs-label">Visit Type</label>
                <select className="gs-select" value={form.type} onChange={e=>setForm(f=>({...f,type:e.target.value}))}>
                  {VISIT_TYPES.map(t => <option key={t.label}>{t.label}</option>)}
                </select>
              </div>
              <div className="gs-form-group">
                <label className="gs-label">Purpose / Notes</label>
                <input className="gs-input" placeholder="e.g. ANC 3rd trimester check, high BP monitoring" value={form.purpose} onChange={e=>setForm(f=>({...f,purpose:e.target.value}))} />
              </div>
            </div>
            <div className="gs-modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={addVisit}>📅 Schedule</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}