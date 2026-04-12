import React, { useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
import { Sidebar, Topbar, sharedStyles } from "../components/Layout.jsx";
import { getCurrentUser, logoutUser } from "./utils/auth.js";

const pageStyles = `
  .records-layout { display: grid; grid-template-columns: 300px 1fr; gap: 20px; }
  .patient-list-item {
    display: flex; align-items: center; gap: 10px; padding: 12px 14px;
    border-radius: 10px; cursor: pointer; transition: all .18s; border: 1.5px solid transparent;
  }
  .patient-list-item:hover { background: #f6fbf7; }
  .patient-list-item.selected { background: var(--green-pale); border-color: rgba(37,160,69,0.3); }
  .record-tab-bar { display: flex; gap: 4px; margin-bottom: 20px; border-bottom: 2px solid #edf3ef; }
  .record-tab {
    padding: 10px 18px; font-size: 13px; font-weight: 600; color: var(--text-muted);
    cursor: pointer; border: none; background: none; font-family: 'DM Sans', sans-serif;
    border-bottom: 2px solid transparent; margin-bottom: -2px; transition: all .18s;
  }
  .record-tab.active { color: var(--green-mid); border-bottom-color: var(--green-bright); }
  .record-tab:hover  { color: var(--text-dark); }
  .vitals-grid { display: grid; grid-template-columns: repeat(3, 1fr); gap: 12px; margin-bottom:20px; }
  .vital-card {
    background: #f8faf8; border-radius: 12px; padding: 14px 16px; border: 1px solid var(--border);
  }
  .vital-label  { font-size: 11px; color: var(--text-muted); font-weight:600; text-transform:uppercase; letter-spacing:.06em; margin-bottom:4px; }
  .vital-value  { font-family:"'DM Serif Display',serif"; font-size:22px; color:var(--text-dark); font-weight:700; }
  .vital-unit   { font-size:12px; color:var(--text-muted); }
  .vital-trend  { font-size:11px; margin-top:4px; }
  .vital-trend.good { color:#2e7d32; }
  .vital-trend.warn { color:#f57f17; }

  .timeline-item { display:flex; gap:14px; padding:14px 0; border-bottom:1px solid #f0f5f1; }
  .timeline-item:last-child { border-bottom:none; }
  .timeline-dot {
    width:10px; height:10px; border-radius:50%; flex-shrink:0; margin-top:6px;
    border: 2px solid;
  }
  .timeline-dot.green  { background:#4caf50; border-color:#4caf50; box-shadow:0 0 0 4px #e8f5e9; }
  .timeline-dot.yellow { background:#ffb300; border-color:#ffb300; box-shadow:0 0 0 4px #fff8e1; }
  .timeline-dot.red    { background:#ef5350; border-color:#ef5350; box-shadow:0 0 0 4px #ffebee; }
  .timeline-line { width:2px; background:#edf3ef; height:100%; margin-left:4px; }
`;

const RECORDS = [
  {
    id:1, name:'Sunita Devi', age:28, gender:'Female', village:'Bihta', phone:'9876543210',
    triage:'RED', color:'#c62828', initials:'SD',
    vitals:{ bp:'140/90 mmHg', weight:'62 kg', temp:'98.6°F', pulse:'88 bpm', spo2:'98%', hb:'9.2 g/dL' },
    conditions:['Gestational Hypertension','3rd Trimester Pregnancy (32 weeks)'],
    allergies:['Penicillin'],
    timeline:[
      { date:'12 Apr 2026', type:'green',  title:'ANC Visit',           note:'BP slightly elevated. Advised rest and low-sodium diet.' },
      { date:'01 Apr 2026', type:'yellow', title:'Emergency Referral',  note:'Severe headache. Referred to PHC for further evaluation.' },
      { date:'15 Mar 2026', type:'green',  title:'Routine ANC',         note:'Normal findings. Iron and folic acid supplements given.' },
      { date:'01 Mar 2026', type:'green',  title:'ANC Registration',    note:'Registered for ANC. LMP: 15 Oct 2025. EDD: 22 Jul 2026.' },
    ],
    medications:['Iron-Folic Acid 100mg', 'Calcium 500mg', 'Labetalol 100mg (PHC prescribed)'],
  },
  {
    id:2, name:'Meena Kumari', age:24, gender:'Female', village:'Punpun', phone:'9876541234',
    triage:'YELLOW', color:'#e65100', initials:'MK',
    vitals:{ bp:'110/70 mmHg', weight:'54 kg', temp:'99.1°F', pulse:'82 bpm', spo2:'99%', hb:'10.8 g/dL' },
    conditions:['Post-natal (Day 15)','Mild fever'],
    allergies:[],
    timeline:[
      { date:'12 Apr 2026', type:'yellow', title:'Post-natal Visit',    note:'Mild fever 99.1°F. Breast-feeding established. Iron supplements continued.' },
      { date:'28 Mar 2026', type:'green',  title:'Delivery',            note:'Normal vaginal delivery at home. Healthy baby girl, 2.9 kg.' },
      { date:'15 Mar 2026', type:'green',  title:'ANC Visit',           note:'All parameters normal. Advised delivery at PHC.' },
    ],
    medications:['Iron-Folic Acid 60mg', 'Paracetamol 500mg (if needed)'],
  },
  {
    id:3, name:'Kamla Prasad', age:35, gender:'Female', village:'Phulwari', phone:'9876549876',
    triage:'GREEN', color:'#2e7d32', initials:'KP',
    vitals:{ bp:'118/76 mmHg', weight:'58 kg', temp:'98.2°F', pulse:'74 bpm', spo2:'99%', hb:'12.1 g/dL' },
    conditions:['Child immunisation (for son Arjun, 6 weeks)'],
    allergies:[],
    timeline:[
      { date:'12 Apr 2026', type:'green',  title:'Immunisation Visit',  note:'BCG, OPV-0 given to Arjun Kumar. No adverse reactions.' },
      { date:'01 Apr 2026', type:'green',  title:'Birth Registration',  note:'Child birth registered. Mother health good.' },
    ],
    medications:[],
  },
  {
    id:4, name:'Savitri Singh', age:42, gender:'Female', village:'Bihta', phone:'9876542345',
    triage:'YELLOW', color:'#7b1fa2', initials:'SS',
    vitals:{ bp:'126/82 mmHg', weight:'71 kg', temp:'98.4°F', pulse:'80 bpm', spo2:'98%', hb:'11.3 g/dL' },
    conditions:['Type 2 Diabetes','Hypertension'],
    allergies:['Sulfa drugs'],
    timeline:[
      { date:'10 Apr 2026', type:'yellow', title:'Diabetes Follow-up',  note:'FBS 168 mg/dL. Metformin dose reviewed. Dietary counselling.' },
      { date:'01 Mar 2026', type:'yellow', title:'Diagnosis',           note:'Diagnosed with T2DM at PHC. HbA1c 7.8%. Referred back for follow-up.' },
    ],
    medications:['Metformin 500mg BD', 'Amlodipine 5mg OD'],
  },
];

export default function HealthRecords() {
  const navigate = useNavigate();
  const location = useLocation();
  const prefillPatient = location.state?.patient;

  const [selected, setSelected] = useState(
    prefillPatient ? RECORDS.find(r=>r.name.toLowerCase().includes(prefillPatient.name?.toLowerCase().split(' ')[0]?.toLowerCase()||'')) || RECORDS[0] : RECORDS[0]
  );
  const [tab, setTab] = useState('overview');
  const [search, setSearch] = useState('');
  const [showAddModal, setShowAddModal] = useState(false);
  const [newNote, setNewNote] = useState({ title:'', note:'' });

  const filtered = RECORDS.filter(r => r.name.toLowerCase().includes(search.toLowerCase()) || r.village.toLowerCase().includes(search.toLowerCase()));

  const triageBadge = { RED:'badge-red', YELLOW:'badge-yellow', GREEN:'badge-green' };
  const triageLabel = { RED:'Critical', YELLOW:'Follow-up', GREEN:'Stable' };

  const vitalItems = selected ? [
    { label:'Blood Pressure', val:selected.vitals.bp,     warn: selected.vitals.bp.startsWith('14') || selected.vitals.bp.startsWith('13') },
    { label:'Weight',         val:selected.vitals.weight, warn:false },
    { label:'Temperature',    val:selected.vitals.temp,   warn: parseFloat(selected.vitals.temp) > 99 },
    { label:'Pulse',          val:selected.vitals.pulse,  warn:false },
    { label:'SpO₂',           val:selected.vitals.spo2,   warn:false },
    { label:'Haemoglobin',    val:selected.vitals.hb,     warn: parseFloat(selected.vitals.hb) < 10 },
  ] : [];

  const addNote = () => {
    if (!newNote.title) return;
    // In a real app, this would POST to backend
    setShowAddModal(false);
    setNewNote({ title:'', note:'' });
  };

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>
      <Sidebar />
      <Topbar page="Health Records" />

      <div className="d-layout">
        <div className="d-content">
          <div className="page-header">
            <div>
              <div className="page-title">📋 Health Records</div>
              <div className="page-subtitle">Patient medical history and vitals</div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-secondary" onClick={() => navigate('/mypatients')}>👥 All Patients</button>
              <button className="btn-primary" onClick={() => setShowAddModal(true)}>+ Add Note</button>
            </div>
          </div>

          <div className="records-layout">
            {/* Left — patient list */}
            <div>
              <div style={{ marginBottom:12 }}>
                <input className="gs-input" placeholder="🔍  Search patients…" value={search}
                  onChange={e=>setSearch(e.target.value)} style={{ borderRadius:50, padding:'9px 16px' }} />
              </div>
              <div className="d-card" style={{ overflow:'hidden' }}>
                <div className="d-card-body" style={{ padding:'8px 8px' }}>
                  {filtered.map(p => (
                    <div key={p.id} className={`patient-list-item ${selected?.id===p.id?'selected':''}`}
                      onClick={() => { setSelected(p); setTab('overview'); }}>
                      <div style={{ width:38, height:38, borderRadius:'50%', background:p.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:13, fontWeight:700, color:'#fff', flexShrink:0 }}>{p.initials}</div>
                      <div style={{ flex:1, minWidth:0 }}>
                        <div style={{ fontSize:13.5, fontWeight:700, color:'var(--text-dark)' }}>{p.name}</div>
                        <div style={{ fontSize:12, color:'var(--text-muted)' }}>{p.age} yrs · {p.village}</div>
                      </div>
                      <span className={`badge ${triageBadge[p.triage]}`} style={{ fontSize:10 }}>{triageLabel[p.triage]}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>

            {/* Right — record detail */}
            {selected && (
              <div>
                {/* Header card */}
                <div className="d-card" style={{ marginBottom:16 }}>
                  <div className="d-card-body" style={{ display:'flex', gap:16, alignItems:'center' }}>
                    <div style={{ width:56, height:56, borderRadius:'50%', background:selected.color, display:'flex', alignItems:'center', justifyContent:'center', fontSize:18, fontWeight:700, color:'#fff', flexShrink:0 }}>{selected.initials}</div>
                    <div style={{ flex:1 }}>
                      <div style={{ fontFamily:"'DM Serif Display',serif", fontSize:20, color:'var(--text-dark)', marginBottom:4 }}>{selected.name}</div>
                      <div style={{ fontSize:13, color:'var(--text-muted)' }}>{selected.age} yrs · {selected.gender} · {selected.village} · 📞 {selected.phone}</div>
                      <div style={{ display:'flex', gap:6, marginTop:8, flexWrap:'wrap' }}>
                        <span className={`badge ${triageBadge[selected.triage]}`}>{triageLabel[selected.triage]}</span>
                        {selected.conditions.map((c,i)=><span key={i} className="badge badge-blue">{c}</span>)}
                      </div>
                    </div>
                    <div style={{ display:'flex', gap:8 }}>
                      <button className="btn-secondary" onClick={() => navigate('/triage', { state:{ patient:selected } })}>🤖 Diagnose</button>
                      <button className="btn-secondary" onClick={() => navigate('/schedule', { state:{ patient:selected } })}>📅 Schedule</button>
                    </div>
                  </div>
                </div>

                {/* Tabs */}
                <div className="record-tab-bar">
                  {[
                    { key:'overview', label:'📊 Overview' },
                    { key:'vitals',   label:'🩺 Vitals' },
                    { key:'timeline', label:'📅 Timeline' },
                    { key:'meds',     label:'💊 Medications' },
                  ].map(t => (
                    <button key={t.key} className={`record-tab ${tab===t.key?'active':''}`} onClick={()=>setTab(t.key)}>{t.label}</button>
                  ))}
                </div>

                {tab === 'overview' && (
                  <div>
                    <div className="vitals-grid">
                      {vitalItems.map((v,i)=>(
                        <div key={i} className="vital-card">
                          <div className="vital-label">{v.label}</div>
                          <div className="vital-value" style={{ fontSize:18 }}>{v.val}</div>
                          <div className={`vital-trend ${v.warn?'warn':'good'}`}>{v.warn ? '⚠️ Monitor' : '✅ Normal'}</div>
                        </div>
                      ))}
                    </div>
                    {selected.allergies.length > 0 && (
                      <div style={{ background:'#fff8e1', border:'1px solid #ffecb3', borderRadius:12, padding:'12px 16px', marginBottom:16 }}>
                        <div style={{ fontWeight:700, color:'#f57f17', marginBottom:6 }}>⚠️ Allergies</div>
                        <div style={{ display:'flex', gap:6 }}>
                          {selected.allergies.map((a,i)=><span key={i} className="badge badge-yellow">{a}</span>)}
                        </div>
                      </div>
                    )}
                    <div className="d-card">
                      <div className="d-card-header"><div className="d-card-title">📝 Latest Notes</div></div>
                      <div className="d-card-body">
                        {selected.timeline.slice(0,3).map((t,i)=>(
                          <div key={i} className="timeline-item">
                            <div>
                              <div className={`timeline-dot ${t.type}`} />
                              {i < 2 && <div className="timeline-line" style={{ height:40, marginTop:6 }} />}
                            </div>
                            <div>
                              <div style={{ fontSize:11, color:'var(--text-muted)', marginBottom:2 }}>{t.date}</div>
                              <div style={{ fontWeight:700, color:'var(--text-dark)', marginBottom:4 }}>{t.title}</div>
                              <div style={{ fontSize:13, color:'var(--text-mid)', lineHeight:1.5 }}>{t.note}</div>
                            </div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'vitals' && (
                  <div className="d-card">
                    <div className="d-card-header"><div className="d-card-title">🩺 Vital Signs</div><button className="btn-primary" style={{ padding:'7px 14px', fontSize:12 }} onClick={() => setShowAddModal(true)}>+ Record Vitals</button></div>
                    <div className="d-card-body">
                      <div className="vitals-grid" style={{ gridTemplateColumns:'repeat(2,1fr)' }}>
                        {vitalItems.map((v,i)=>(
                          <div key={i} className="vital-card">
                            <div className="vital-label">{v.label}</div>
                            <div className="vital-value">{v.val}</div>
                            <div className={`vital-trend ${v.warn?'warn':'good'}`}>{v.warn ? '⚠️ Needs attention' : '✅ Normal range'}</div>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>
                )}

                {tab === 'timeline' && (
                  <div className="d-card">
                    <div className="d-card-header">
                      <div className="d-card-title">📅 Visit History</div>
                      <button className="btn-primary" style={{ padding:'7px 14px', fontSize:12 }} onClick={() => setShowAddModal(true)}>+ Add Note</button>
                    </div>
                    <div className="d-card-body">
                      {selected.timeline.map((t,i)=>(
                        <div key={i} className="timeline-item">
                          <div><div className={`timeline-dot ${t.type}`} /></div>
                          <div style={{ flex:1 }}>
                            <div style={{ display:'flex', alignItems:'center', justifyContent:'space-between', marginBottom:4 }}>
                              <div style={{ fontWeight:700, color:'var(--text-dark)' }}>{t.title}</div>
                              <div style={{ fontSize:11, color:'var(--text-muted)' }}>{t.date}</div>
                            </div>
                            <div style={{ fontSize:13, color:'var(--text-mid)', lineHeight:1.6, background:'#f8faf8', borderRadius:8, padding:'10px 12px' }}>{t.note}</div>
                          </div>
                        </div>
                      ))}
                    </div>
                  </div>
                )}

                {tab === 'meds' && (
                  <div className="d-card">
                    <div className="d-card-header"><div className="d-card-title">💊 Current Medications</div></div>
                    <div className="d-card-body">
                      {selected.medications.length === 0 ? (
                        <div style={{ textAlign:'center', padding:'32px 0', color:'var(--text-muted)' }}>No medications recorded</div>
                      ) : selected.medications.map((m,i)=>(
                        <div key={i} style={{ display:'flex', alignItems:'center', gap:12, padding:'12px 0', borderBottom: i<selected.medications.length-1?'1px solid #f0f5f1':'none' }}>
                          <div style={{ width:40, height:40, borderRadius:10, background:'#f3e5f5', display:'flex', alignItems:'center', justifyContent:'center', fontSize:18 }}>💊</div>
                          <div style={{ flex:1 }}>
                            <div style={{ fontWeight:700, color:'var(--text-dark)', fontSize:14 }}>{m}</div>
                            <div style={{ fontSize:12, color:'var(--text-muted)' }}>Prescribed · Active</div>
                          </div>
                          <span className="badge badge-green">Active</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>

      {showAddModal && (
        <div className="gs-modal-backdrop" onClick={e=>e.target.className==='gs-modal-backdrop'&&setShowAddModal(false)}>
          <div className="gs-modal">
            <div className="gs-modal-header">
              <div className="gs-modal-title">📝 Add Clinical Note</div>
              <button className="gs-modal-close" onClick={() => setShowAddModal(false)}>✕</button>
            </div>
            <div className="gs-modal-body">
              <div className="gs-form-group">
                <label className="gs-label">Visit Title *</label>
                <input className="gs-input" placeholder="e.g. ANC Visit, Follow-up" value={newNote.title} onChange={e=>setNewNote(n=>({...n,title:e.target.value}))} />
              </div>
              <div className="gs-form-group">
                <label className="gs-label">Notes</label>
                <textarea className="gs-textarea" placeholder="Clinical observations, advice given, referrals…" value={newNote.note} onChange={e=>setNewNote(n=>({...n,note:e.target.value}))} style={{ minHeight:120 }} />
              </div>
            </div>
            <div className="gs-modal-footer">
              <button className="btn-secondary" onClick={() => setShowAddModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={addNote}>💾 Save Note</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}