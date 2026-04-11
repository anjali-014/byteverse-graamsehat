// Visual-only card for RED cases — no text, just icons
// ASHA shows this to the family — works without literacy

const DANGER_ICONS = [
  { icon: '🏥', label: 'Hospital' },
  { icon: '🚗', label: 'Go now' },
  { icon: '⏰', label: 'Urgent' },
  { icon: '👨‍⚕️', label: 'Doctor' },
];

export default function DangerFlashcard({ show }) {
  if (!show) return null;

  return (
    <div style={{
      background: '#e74c3c',
      borderRadius: 16,
      padding: 24,
      marginTop: 16,
      textAlign: 'center',
      border: '4px solid #c0392b'
    }}>
      <p style={{ color: 'white', fontSize: 14, marginBottom: 16 }}>
        📋 Yeh card family ko dikhayein / Show this card to the family
      </p>

      {/* Big red arrow */}
      <div style={{ fontSize: 80 }}>🏥</div>
      <div style={{ fontSize: 60, marginTop: 8 }}>⬆️</div>
      <div style={{ fontSize: 48, color: 'white', fontWeight: 'bold' }}>
        ABHI JAO
      </div>

      {/* Icon grid */}
      <div style={{
        display: 'flex',
        justifyContent: 'center',
        gap: 24,
        marginTop: 20
      }}>
        {DANGER_ICONS.map(({ icon, label }) => (
          <div key={label} style={{ color: 'white', textAlign: 'center' }}>
            <div style={{ fontSize: 40 }}>{icon}</div>
            <div style={{ fontSize: 11, marginTop: 4 }}>{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}