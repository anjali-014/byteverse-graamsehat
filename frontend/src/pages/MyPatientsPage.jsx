import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { Sidebar, Topbar, sharedStyles } from "../components/Layout.jsx";
import { getCurrentUser, logoutUser } from "./utils/auth.js";

const BACKEND_URL = import.meta.env.VITE_BACKEND_URL || 'http://localhost:3001';

const pageStyles = `
  .filter-bar {
    display: flex; gap: 10px; margin-bottom: 20px; flex-wrap: wrap; align-items: center;
  }
  .filter-chip {
    padding: 7px 16px; border-radius: 50px; font-size: 12.5px; font-weight: 600;
    cursor: pointer; border: 1.5px solid var(--border); background: #fff; color: var(--text-mid);
    transition: all .18s; font-family: 'DM Sans', sans-serif;
  }
  .filter-chip.active-green  { background: #e8f5e9; border-color: #4caf50; color: #2e7d32; }
  .filter-chip.active-yellow { background: #fff8e1; border-color: #ffb300; color: #f57f17; }
  .filter-chip.active-red    { background: #ffebee; border-color: #ef5350; color: #c62828; }
  .filter-chip.active-all    { background: var(--green-pale); border-color: var(--green-bright); color: var(--green-mid); }
  .filter-chip:hover         { border-color: var(--green-bright); }

  .patient-grid { display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 16px; }
  .patient-card {
    background: #fff; border-radius: 16px; border: 1px solid var(--border);
    box-shadow: var(--card-shadow); padding: 18px 20px;
    transition: transform .22s, box-shadow .22s; cursor: pointer;
    animation: fadeUp .45s ease both;
  }
  .patient-card:hover { transform: translateY(-4px); box-shadow: 0 10px 32px rgba(13,58,28,0.14); }
  .patient-card-top { display: flex; align-items: center; gap: 12px; margin-bottom: 12px; }
  .patient-card-avatar {
    width: 46px; height: 46px; border-radius: 50%; flex-shrink: 0;
    display: flex; align-items: center; justify-content: center;
    font-size: 16px; font-weight: 700; color: #fff;
  }
  .patient-card-name { font-size: 15px; font-weight: 700; color: var(--text-dark); }
  .patient-card-sub  { font-size: 12px; color: var(--text-muted); margin-top: 2px; }
  .patient-card-details { display: grid; grid-template-columns: 1fr 1fr; gap: 8px; margin-top: 10px; }
  .patient-card-detail { font-size: 12px; color: var(--text-muted); }
  .patient-card-detail strong { color: var(--text-mid); font-size: 13px; display: block; }
  .patient-card-footer {
    display: flex; align-items: center; justify-content: space-between;
    margin-top: 14px; padding-top: 12px; border-top: 1px solid #f0f5f1;
  }
  .patient-action-btn {
    padding: 6px 14px; border-radius: 50px; font-size: 12px; font-weight: 600;
    cursor: pointer; border: 1.5px solid var(--border); background: #fff; color: var(--text-mid);
    font-family: 'DM Sans', sans-serif; transition: all .18s;
  }
  .patient-action-btn:hover { background: var(--green-pale); border-color: var(--green-bright); color: var(--green-mid); }
  .empty-state {
    text-align: center; padding: 60px 20px; color: var(--text-muted);
  }
  .empty-state-ico { font-size: 48px; margin-bottom: 12px; }
  .empty-state-title { font-size: 18px; font-weight: 700; color: var(--text-dark); margin-bottom: 6px; }

  /* Grid form layout */
  .form-grid-2 { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
`;

const COLORS = ['#c62828','#1565c0','#2e7d32','#7b1fa2','#e65100','#00695c'];

export default function MyPatients() {
  const navigate = useNavigate();
  const [patients, setPatients] = useState([]);
  const [filter, setFilter] = useState('all');
  const [search, setSearch] = useState('');
  const [showModal, setShowModal] = useState(false);
  const [selectedPatient, setSelectedPatient] = useState(null);
  const [loading, setLoading] = useState(true);
  const [form, setForm] = useState({ name:'', age:'', gender:'Female', village:'', phone:'', condition:'', notes:'' });

  const currentUser = getCurrentUser();

  useEffect(() => {
    fetchPatients();
  }, []);

  const fetchPatients = async () => {
    try {
      const block = currentUser?.block || 'Bihta';
      const res = await fetch(`${BACKEND_URL}/api/dashboard/summary?block=${block}`);
      if (res.ok) {
        const data = await res.json();
        const cases = data.recentCases || [];
        const mapped = cases.map((c, i) => ({
          id: c.id,
          name: c.patient_name || `Patient ${i + 1}`,
          age: c.age || (25 + (i % 20)),
          gender: c.gender || 'Female',
          village: c.village_tag || c.asha_village || 'Unknown',
          phone: c.phone || '—',
          status: c.triage_result === 'RED' ? 'critical' : c.triage_result === 'YELLOW' ? 'followup' : 'stable',
          triage: c.triage_result,
          color: COLORS[i % COLORS.length],
          symptoms: c.symptoms || [],
          lastVisit: c.client_timestamp ? new Date(c.client_timestamp).toLocaleDateString('en-IN') : '—',
          initials: (c.patient_name || `P${i+1}`).split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
        }));
        setPatients(mapped);
      }
    } catch (err) {
      console.warn('Fetch error', err);
      // Show sample data if API fails
      setPatients([
        { id:1, name:'Sunita Devi',    age:28, gender:'Female', village:'Bihta',     phone:'9876543210', status:'critical', triage:'RED',    color:'#c62828', symptoms:['high BP','headache'], lastVisit:'10 Apr 2026', initials:'SD' },
        { id:2, name:'Meena Kumari',   age:24, gender:'Female', village:'Punpun',    phone:'9876541234', status:'followup', triage:'YELLOW', color:'#e65100', symptoms:['fever','cough'],      lastVisit:'08 Apr 2026', initials:'MK' },
        { id:3, name:'Kamla Prasad',   age:35, gender:'Female', village:'Phulwari',  phone:'9876549876', status:'stable',   triage:'GREEN',  color:'#2e7d32', symptoms:['routine check'],      lastVisit:'05 Apr 2026', initials:'KP' },
        { id:4, name:'Savitri Singh',  age:42, gender:'Female', village:'Bihta',     phone:'9876542345', status:'followup', triage:'YELLOW', color:'#7b1fa2', symptoms:['diabetes','fatigue'], lastVisit:'09 Apr 2026', initials:'SS' },
        { id:5, name:'Rekha Yadav',    age:31, gender:'Female', village:'Neora',     phone:'9876545678', status:'stable',   triage:'GREEN',  color:'#00695c', symptoms:['ANC checkup'],        lastVisit:'11 Apr 2026', initials:'RY' },
        { id:6, name:'Geeta Kumari',   age:19, gender:'Female', village:'Bihta',     phone:'9876547890', status:'stable',   triage:'GREEN',  color:'#1565c0', symptoms:['immunisation'],       lastVisit:'12 Apr 2026', initials:'GK' },
      ]);
    }
    setLoading(false);
  };

  const filtered = patients.filter(p => {
    const matchFilter = filter === 'all' || p.triage === filter.toUpperCase() ||
      (filter === 'critical' && p.triage === 'RED') ||
      (filter === 'followup' && p.triage === 'YELLOW') ||
      (filter === 'stable' && p.triage === 'GREEN');
    const matchSearch = p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.village.toLowerCase().includes(search.toLowerCase());
    return matchFilter && matchSearch;
  });

  const triageLabel = { RED:'Critical', YELLOW:'Follow-up', GREEN:'Stable' };
  const triageBadge = { RED:'badge-red', YELLOW:'badge-yellow', GREEN:'badge-green' };

  const handleAddPatient = async () => {
    if (!form.name || !form.age) return;
    const newP = {
      id: Date.now(),
      name: form.name, age: parseInt(form.age), gender: form.gender,
      village: form.village || currentUser?.village || 'Unknown',
      phone: form.phone, status: 'stable', triage: 'GREEN',
      color: COLORS[patients.length % COLORS.length],
      symptoms: form.condition ? [form.condition] : [],
      lastVisit: new Date().toLocaleDateString('en-IN'),
      initials: form.name.split(' ').map(n=>n[0]).join('').slice(0,2).toUpperCase(),
    };
    setPatients(p => [...p, newP]);
    setShowModal(false);
    setForm({ name:'', age:'', gender:'Female', village:'', phone:'', condition:'', notes:'' });
  };

  return (
    <>
      <style>{sharedStyles + pageStyles}</style>
      <Sidebar patientCount={patients.length} />
      <Topbar page="My Patients" />

      <div className="d-layout">
        <div className="d-content">
          <div className="page-header">
            <div>
              <div className="page-title">👥 My Patients</div>
              <div className="page-subtitle">{patients.length} patients in your care</div>
            </div>
            <div style={{ display:'flex', gap:10 }}>
              <button className="btn-secondary" onClick={() => navigate('/newpatient')}>📋 Add via Triage</button>
              <button className="btn-primary" onClick={() => setShowModal(true)}>➕ New Patient</button>
            </div>
          </div>

          {/* Filters */}
          <div className="filter-bar">
            <input
              className="gs-input" style={{ maxWidth:260, borderRadius:50, padding:'8px 16px' }}
              placeholder="🔍  Search by name or village…"
              value={search} onChange={e => setSearch(e.target.value)}
            />
            {[
              { key:'all',      label:`All (${patients.length})`,                                       cls:'active-all'    },
              { key:'RED',      label:`🔴 Critical (${patients.filter(p=>p.triage==='RED').length})`,   cls:'active-red'    },
              { key:'YELLOW',   label:`🟡 Follow-up (${patients.filter(p=>p.triage==='YELLOW').length})`, cls:'active-yellow' },
              { key:'GREEN',    label:`🟢 Stable (${patients.filter(p=>p.triage==='GREEN').length})`,   cls:'active-green'  },
            ].map(f => (
              <button key={f.key} className={`filter-chip ${filter===f.key ? f.cls : ''}`} onClick={() => setFilter(f.key)}>
                {f.label}
              </button>
            ))}
          </div>

          {loading ? (
            <div className="empty-state"><div className="empty-state-ico">⏳</div><div className="empty-state-title">Loading patients…</div></div>
          ) : filtered.length === 0 ? (
            <div className="empty-state">
              <div className="empty-state-ico">🔍</div>
              <div className="empty-state-title">No patients found</div>
              <div style={{ marginBottom:20 }}>Try adjusting your search or filter</div>
              <button className="btn-primary" onClick={() => setShowModal(true)}>➕ Add New Patient</button>
            </div>
          ) : (
            <div className="patient-grid">
              {filtered.map((p, i) => (
                <div className="patient-card" key={p.id} style={{ animationDelay: `${i*0.05}s` }}
                  onClick={() => setSelectedPatient(p)}>
                  <div className="patient-card-top">
                    <div className="patient-card-avatar" style={{ background: p.color }}>{p.initials}</div>
                    <div style={{ flex:1, minWidth:0 }}>
                      <div className="patient-card-name">{p.name}</div>
                      <div className="patient-card-sub">{p.age} yrs · {p.gender} · {p.village}</div>
                    </div>
                    <span className={`badge ${triageBadge[p.triage]}`}>{triageLabel[p.triage]}</span>
                  </div>
                  <div className="patient-card-details">
                    <div className="patient-card-detail">
                      <span>Last Visit</span>
                      <strong>{p.lastVisit}</strong>
                    </div>
                    <div className="patient-card-detail">
                      <span>Phone</span>
                      <strong>{p.phone || '—'}</strong>
                    </div>
                    <div className="patient-card-detail" style={{ gridColumn:'1/-1' }}>
                      <span>Symptoms/Notes</span>
                      <strong>{p.symptoms.join(', ') || 'None recorded'}</strong>
                    </div>
                  </div>
                  <div className="patient-card-footer">
                    <button className="patient-action-btn" onClick={e => { e.stopPropagation(); navigate('/triage', { state: { patient: p } }); }}>🤖 Diagnose</button>
                    <button className="patient-action-btn" onClick={e => { e.stopPropagation(); navigate('/records', { state: { patient: p } }); }}>📋 Records</button>
                    <button className="patient-action-btn" onClick={e => { e.stopPropagation(); navigate('/schedule', { state: { patient: p } }); }}>📅 Schedule</button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Add Patient Modal */}
      {showModal && (
        <div className="gs-modal-backdrop" onClick={e => e.target.className === 'gs-modal-backdrop' && setShowModal(false)}>
          <div className="gs-modal">
            <div className="gs-modal-header">
              <div className="gs-modal-title">➕ Add New Patient</div>
              <button className="gs-modal-close" onClick={() => setShowModal(false)}>✕</button>
            </div>
            <div className="gs-modal-body">
              <div className="form-grid-2">
                <div className="gs-form-group">
                  <label className="gs-label">Full Name *</label>
                  <input className="gs-input" placeholder="e.g. Sunita Devi" value={form.name} onChange={e => setForm(f=>({...f,name:e.target.value}))} />
                </div>
                <div className="gs-form-group">
                  <label className="gs-label">Age *</label>
                  <input className="gs-input" type="number" placeholder="e.g. 28" value={form.age} onChange={e => setForm(f=>({...f,age:e.target.value}))} />
                </div>
                <div className="gs-form-group">
                  <label className="gs-label">Gender</label>
                  <select className="gs-select" value={form.gender} onChange={e => setForm(f=>({...f,gender:e.target.value}))}>
                    <option>Female</option><option>Male</option><option>Other</option>
                  </select>
                </div>
                <div className="gs-form-group">
                  <label className="gs-label">Village</label>
                  <input className="gs-input" placeholder="Village name" value={form.village} onChange={e => setForm(f=>({...f,village:e.target.value}))} />
                </div>
                <div className="gs-form-group">
                  <label className="gs-label">Phone Number</label>
                  <input className="gs-input" placeholder="10-digit mobile" value={form.phone} onChange={e => setForm(f=>({...f,phone:e.target.value}))} />
                </div>
                <div className="gs-form-group">
                  <label className="gs-label">Chief Complaint</label>
                  <input className="gs-input" placeholder="e.g. Fever, ANC check" value={form.condition} onChange={e => setForm(f=>({...f,condition:e.target.value}))} />
                </div>
              </div>
              <div className="gs-form-group">
                <label className="gs-label">Additional Notes</label>
                <textarea className="gs-textarea" placeholder="Any relevant history or notes…" value={form.notes} onChange={e => setForm(f=>({...f,notes:e.target.value}))} />
              </div>
            </div>
            <div className="gs-modal-footer">
              <button className="btn-secondary" onClick={() => setShowModal(false)}>Cancel</button>
              <button className="btn-primary" onClick={handleAddPatient}>➕ Add Patient</button>
            </div>
          </div>
        </div>
      )}

      {/* Patient Detail Modal */}
      {selectedPatient && (
        <div className="gs-modal-backdrop" onClick={e => e.target.className === 'gs-modal-backdrop' && setSelectedPatient(null)}>
          <div className="gs-modal" style={{ maxWidth:560 }}>
            <div className="gs-modal-header">
              <div style={{ display:'flex', alignItems:'center', gap:12 }}>
                <div className="patient-card-avatar" style={{ background: selectedPatient.color, width:44, height:44, borderRadius:'50%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:16, fontWeight:700, color:'#fff' }}>{selectedPatient.initials}</div>
                <div>
                  <div className="gs-modal-title">{selectedPatient.name}</div>
                  <div style={{ fontSize:12, color:'var(--text-muted)', marginTop:2 }}>{selectedPatient.age} yrs · {selectedPatient.gender} · {selectedPatient.village}</div>
                </div>
              </div>
              <button className="gs-modal-close" onClick={() => setSelectedPatient(null)}>✕</button>
            </div>
            <div className="gs-modal-body">
              <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr', gap:16, marginBottom:16 }}>
                {[
                  { label:'Triage Status', val:<span className={`badge ${triageBadge[selectedPatient.triage]}`}>{triageLabel[selectedPatient.triage]}</span> },
                  { label:'Last Visit', val:selectedPatient.lastVisit },
                  { label:'Phone', val:selectedPatient.phone || '—' },
                  { label:'Village', val:selectedPatient.village },
                ].map((d,i)=>(
                  <div key={i} style={{ background:'#f8faf8', borderRadius:10, padding:'12px 14px' }}>
                    <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, marginBottom:4 }}>{d.label}</div>
                    <div style={{ fontSize:14, fontWeight:600, color:'var(--text-dark)' }}>{d.val}</div>
                  </div>
                ))}
              </div>
              {selectedPatient.symptoms.length > 0 && (
                <div style={{ background:'#f8faf8', borderRadius:10, padding:'12px 14px' }}>
                  <div style={{ fontSize:11, color:'var(--text-muted)', fontWeight:600, marginBottom:8 }}>Symptoms / Complaints</div>
                  <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                    {selectedPatient.symptoms.map((s,i)=>(
                      <span key={i} style={{ background:'#fff', border:'1px solid var(--border)', borderRadius:50, padding:'4px 12px', fontSize:13, color:'var(--text-mid)' }}>{s}</span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            <div className="gs-modal-footer">
              <button className="btn-secondary" onClick={() => { setSelectedPatient(null); navigate('/records', { state:{ patient: selectedPatient } }); }}>📋 Health Records</button>
              <button className="btn-secondary" onClick={() => { setSelectedPatient(null); navigate('/schedule', { state:{ patient: selectedPatient } }); }}>📅 Schedule Visit</button>
              <button className="btn-primary" onClick={() => { setSelectedPatient(null); navigate('/triage', { state:{ patient: selectedPatient } }); }}>🤖 AI Diagnose</button>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
