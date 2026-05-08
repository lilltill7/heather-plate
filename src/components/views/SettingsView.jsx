const ACCENT_COLORS = [
  '#b5863a', '#4a7c59', '#b85c38',
  '#6b4c7a', '#c4647a', '#3a6b8a', '#7a6b3a',
];

export default function SettingsView({ settings, setSettings, recipes = [], showToast }) {
  const tab = settings.settingsTab || 'appearance';
  const setTab = (t) => setSettings(s => ({ ...s, settingsTab: t }));

  const exportData = () => {
    const blob = new Blob(
      [JSON.stringify({ recipes }, null, 2)],
      { type: 'application/json' }
    );
    const a = document.createElement('a');
    a.href = URL.createObjectURL(blob);
    a.download = 'heather_plate_recipes.json';
    a.click();
    showToast('Exported ✓');
  };

  return (
    <div className="settings-layout" style={{ height: 'calc(100vh - 56px)' }}>
      {/* ── NAV ── */}
      <div className="settings-nav">
        <div className="settings-nav-label">Preferences</div>
        {[
          { key: 'appearance', label: 'Appearance', icon: '◌' },
          { key: 'data',       label: 'Data & Export', icon: '◻' },
          { key: 'ai',         label: 'AI Integration', icon: '✦' },
        ].map(({ key, label, icon }) => (
          <div
            key={key}
            className={`settings-nav-item${tab === key ? ' active' : ''}`}
            onClick={() => setTab(key)}
          >
            <span>{icon}</span>{label}
          </div>
        ))}
      </div>

      {/* ── CONTENT ── */}
      <div className="settings-content">

        {/* APPEARANCE */}
        {tab === 'appearance' && (
          <>
            <div className="set-group">
              <div className="set-group-title">Accent Colour</div>
              <div className="swatch-grid">
                {ACCENT_COLORS.map(c => (
                  <div
                    key={c}
                    className={`col-swatch${settings.accent === c ? ' on' : ''}`}
                    style={{ background: c }}
                    onClick={() => setSettings(s => ({ ...s, accent: c }))}
                  />
                ))}
              </div>
            </div>

            <div className="set-group">
              <div className="set-group-title">Display</div>
              <div className="set-row">
                <div className="set-row-info">
                  <div className="set-row-label">Compact card view</div>
                  <div className="set-row-sub">Smaller recipe cards in the grid</div>
                </div>
                <button
                  className={`toggle ${settings.compact ? 'on' : 'off'}`}
                  onClick={() => setSettings(s => ({ ...s, compact: !s.compact }))}
                />
              </div>
            </div>
          </>
        )}

        {/* DATA */}
        {tab === 'data' && (
          <div className="set-group">
            <div className="set-group-title">Data Management</div>
            <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink3)', marginBottom: 16 }}>
              {recipes.length} recipes stored locally in your browser.
            </div>
            <div style={{ display: 'flex', gap: 8, flexWrap: 'wrap' }}>
              <button
                onClick={exportData}
                style={{ fontFamily: 'var(--O)', fontSize: 11, background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 8, padding: '9px 16px', cursor: 'pointer', color: 'var(--ink2)' }}
              >
                ↑ Export JSON
              </button>
              <button
                onClick={() => {
                  if (window.confirm('Clear all local data? This cannot be undone.')) {
                    localStorage.clear();
                    window.location.reload();
                  }
                }}
                style={{ fontFamily: 'var(--O)', fontSize: 11, background: 'none', border: '1px solid rgba(184,92,56,0.2)', borderRadius: 8, padding: '9px 16px', cursor: 'pointer', color: 'var(--rust)' }}
              >
                Clear All Data
              </button>
            </div>
          </div>
        )}

        {/* AI */}
        {tab === 'ai' && (
          <div className="set-group">
            <div className="set-group-title">Gemini AI Integration</div>
            <div style={{ fontSize: 13, fontWeight: 300, color: 'var(--ink2)', marginBottom: 16, lineHeight: 1.7 }}>
              The Heather Plate uses Google Gemini AI for video recipe detection.
              Currently running on <strong>mock data</strong>. To enable real detection:
            </div>
            <ol style={{ fontSize: 13, fontWeight: 300, color: 'var(--ink2)', lineHeight: 2, paddingLeft: 18, marginBottom: 16 }}>
              <li>Go to <strong>aistudio.google.com</strong> and create an API key</li>
              <li>Create a <code style={{ fontFamily: 'monospace', color: 'var(--plum)' }}>.env</code> file in your project root</li>
              <li>Add: <code style={{ fontFamily: 'monospace', color: 'var(--plum)' }}>REACT_APP_GEMINI_KEY=your_key</code></li>
              <li>Restart <code style={{ fontFamily: 'monospace', color: 'var(--plum)' }}>npm start</code></li>
            </ol>
            <div style={{
              padding: '12px 14px', background: process.env.REACT_APP_GEMINI_KEY ? 'rgba(74,124,89,0.08)' : 'rgba(107,76,122,0.05)',
              border: `1px solid ${process.env.REACT_APP_GEMINI_KEY ? 'rgba(74,124,89,0.2)' : 'rgba(107,76,122,0.15)'}`,
              borderRadius: 8, fontSize: 12, fontWeight: 300,
              color: process.env.REACT_APP_GEMINI_KEY ? 'var(--sage)' : 'var(--plum)',
            }}>
              {process.env.REACT_APP_GEMINI_KEY ? '✅ API key detected — real detection enabled.' : '⚠ No API key found — using mock data.'}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
