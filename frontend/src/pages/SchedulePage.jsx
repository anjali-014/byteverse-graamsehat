import { useNavigate } from "react-router-dom";

export default function SchedulePage() {
  const navigate = useNavigate();

  return (
    <div style={{ padding: '32px', maxWidth: '900px', margin: '0 auto' }}>
      <h1 style={{ marginBottom: '16px', fontSize: '32px' }}>Visit Schedule</h1>
      <p style={{ marginBottom: '24px', fontSize: '16px', color: '#375a3c' }}>
        Here you can view your upcoming village visits and appointments. This placeholder can be replaced with schedule widgets and calendar views.
      </p>
      <button
        onClick={() => navigate('/homepage')}
        style={{ padding: '12px 20px', borderRadius: '999px', background: '#16a34a', color: '#fff', border: 'none', cursor: 'pointer' }}
      >
        Back to Dashboard
      </button>
    </div>
  );
}
