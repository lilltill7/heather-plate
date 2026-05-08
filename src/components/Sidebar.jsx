const ITEMS = [
  { id: 'home',      icon: '⌂', label: 'Home' },
  { id: 'saved',     icon: '◻', label: 'Saved' },
  { id: 'favorites', icon: '♡', label: 'Faves' },
  { id: 'div1',      divider: true },
  { id: 'calendar',  icon: '◷', label: 'Plan' },
  { id: 'upload',    icon: '✦', label: 'Detect' },
  { id: 'div2',      divider: true },
  { id: 'settings',  icon: '⚙', label: 'Settings', bottom: true },
];

export default function Sidebar({ page, navigate }) {
  return (
    <div className="sidebar">
      <button className="sb-logo" onClick={() => navigate('home')}>
        The Heather Plate
      </button>

      {ITEMS.filter(i => !i.bottom).map(item =>
        item.divider
          ? <div key={item.id} className="sb-divider" />
          : (
            <button
              key={item.id}
              className={`sb-btn${page === item.id ? ' active' : ''}`}
              onClick={() => navigate(item.id)}
              title={item.label}
            >
              <span className="sb-icon">{item.icon}</span>
              <span className="sb-label">{item.label}</span>
            </button>
          )
      )}

      <button
        className={`sb-btn sb-bottom${page === 'settings' ? ' active' : ''}`}
        onClick={() => navigate('settings')}
        title="Settings"
      >
        <span className="sb-icon">⚙</span>
        <span className="sb-label">Settings</span>
      </button>
    </div>
  );
}
