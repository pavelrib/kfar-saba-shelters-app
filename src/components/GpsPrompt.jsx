export function GpsPrompt({ message }) {
  return (
    <div style={{
      position: 'absolute', top: 12, right: 12, zIndex: 10,
      background: '#fff3cd', border: '1px solid #ffc107',
      borderRadius: 8, padding: '10px 14px',
      fontSize: 14, maxWidth: 260, boxShadow: '0 2px 6px rgba(0,0,0,0.15)',
    }}>
      {message || 'אפשר גישה למיקום לחישוב המרחק'}
    </div>
  )
}
