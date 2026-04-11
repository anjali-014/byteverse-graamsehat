const TRIAGE_CONFIG = {
  GREEN: {
    color: '#27ae60',
    bg: '#eafaf1',
    emoji: '✅',
    hindi: 'सुरक्षित',
    action: 'Ghar par dekhbhal karein. 2 din mein sudhar nahi to PHC jayein.',
    actionHindi: 'घर पर देखभाल करें।'
  },
  YELLOW: {
    color: '#f39c12',
    bg: '#fef9e7',
    emoji: '⚠️',
    hindi: 'सावधान',
    action: 'Aaj PHC jayein. Thoda zaruri hai.',
    actionHindi: 'आज PHC जाएं।'
  },
  RED: {
    color: '#e74c3c',
    bg: '#fdedec',
    emoji: '🚨',
    hindi: 'खतरा',
    action: 'ABHI PHC jayein! Ek minute bhi mat rukein.',
    actionHindi: 'अभी PHC जाएं!'
  }
};

export default function TriageCard({ result, transcribedText }) {
  if (!result || !result.level) return null;

  const cfg = TRIAGE_CONFIG[result.level];

  return (
    <div style={{
      background: cfg.bg,
      border: `3px solid ${cfg.color}`,
      borderRadius: 16,
      padding: 24,
      marginTop: 24,
      textAlign: 'center'
    }}>
      {/* Big emoji */}
      <div style={{ fontSize: 64 }}>{cfg.emoji}</div>

      {/* Level label */}
      <div style={{
        fontSize: 28,
        fontWeight: 'bold',
        color: cfg.color,
        marginTop: 8
      }}>
        {result.level} — {cfg.hindi}
      </div>

      {/* Hard override badge */}
      {result.hardOverride && (
        <div style={{
          background: '#e74c3c',
          color: 'white',
          borderRadius: 8,
          padding: '4px 12px',
          display: 'inline-block',
          fontSize: 12,
          marginTop: 8
        }}>
          ⚡ Danger sign detected
        </div>
      )}

      {/* Action */}
      <p style={{
        fontSize: 18,
        marginTop: 16,
        color: '#2c3e50',
        fontWeight: '500'
      }}>
        {cfg.action}
      </p>

      <p style={{ fontSize: 20, color: cfg.color, fontWeight: 'bold' }}>
        {cfg.actionHindi}
      </p>

      {/* Confidence */}
      <p style={{ fontSize: 12, color: '#999', marginTop: 16 }}>
        Confidence: {(result.confidence * 100).toFixed(1)}% |
        Symptoms detected: {result.activeSymptoms}
      </p>

      {/* What was heard */}
      {transcribedText && (
        <p style={{
          fontSize: 12,
          color: '#aaa',
          marginTop: 4,
          fontStyle: 'italic'
        }}>
          "{transcribedText}"
        </p>
      )}
    </div>
  );
}