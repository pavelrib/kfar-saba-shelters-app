const LEGEND_ITEMS = [
  { icon: '/icons/shelter-underground.png', label: 'מקלט תת-קרקעי' },
  { icon: '/icons/shelter-above.png', label: 'מקלט עילי / גינה' },
  { icon: '/icons/kindergarten.png', label: 'גן ילדים' },
]

export function MapLegend() {
  return (
    <div style={{
      position: 'absolute', top: 10, left: 10, zIndex: 10,
      background: 'rgba(255,255,255,0.92)', borderRadius: 8,
      padding: '8px 12px', boxShadow: '0 2px 8px rgba(0,0,0,0.15)',
      display: 'flex', flexDirection: 'column', gap: 5,
    }}>
      {LEGEND_ITEMS.map(({ icon, label }) => (
        <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 8, fontSize: 13 }}>
          <img src={icon} alt={label} style={{ width: 28, height: 28, objectFit: 'contain' }} />
          <span>{label}</span>
        </div>
      ))}
    </div>
  )
}
