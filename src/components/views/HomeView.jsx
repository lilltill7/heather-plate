import MiniCalendar from '../MiniCalendar';

const MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];

export default function HomeView({ recipes = [], calendar = {}, navigate, toggleFav, openCalModal, openDayModal }) {
  const recent = [...recipes].sort((a, b) => b.ts - a.ts).slice(0, 8);
  const favs   = recipes.filter(r => r.fav).slice(0, 5);
  const featured = favs[0] || recent[0];

  const today = new Date();
  const upcoming = [];
  for (let i = 0; i < 14; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dk = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    (calendar[dk] || []).forEach(m => {
      const r = recipes.find(x => x.id === m.id);
      if (r) upcoming.push({ d, r, dk });
    });
  }

  return (
    <div className="home-wrap" style={{ height: 'calc(100vh - 56px)' }}>
      {/* ── FEED ── */}
      <div className="home-feed">
        {featured && (
          <div className="hero-band" onClick={() => navigate('detail', { detailId: featured.id })}>
            <div className="hero-band-deco" />
            <div className="hero-band-deco2" />
            <div className="hero-emoji">{featured.e}</div>
            <div className="hero-text">
              <div className="hero-eyebrow">⭐ Featured Recipe</div>
              <div className="hero-title-h">{featured.n}</div>
              <div className="hero-chips">
                <span className="hero-chip">⏱ {featured.time}</span>
                <span className="hero-chip">👤 Serves {featured.srv}</span>
                <span className="hero-chip">{featured.diff}</span>
              </div>
              <div className="hero-actions">
                <button
                  className="hero-btn-p"
                  onClick={e => { e.stopPropagation(); navigate('detail', { detailId: featured.id }); }}
                >
                  View Recipe →
                </button>
                <button
                  className="hero-btn-s"
                  onClick={e => { e.stopPropagation(); openCalModal(featured.id); }}
                >
                  Schedule
                </button>
              </div>
            </div>
          </div>
        )}

        {/* Stat tiles */}
        <div className="stat-grid">
          <div className="stat-card" onClick={() => navigate('saved')}>
            <div className="stat-card-icon">◻</div>
            <div className="stat-card-val">{recipes.length}</div>
            <div className="stat-card-key">Saved Recipes</div>
          </div>
          <div className="stat-card" onClick={() => navigate('favorites')}>
            <div className="stat-card-icon">♡</div>
            <div className="stat-card-val">{recipes.filter(r => r.fav).length}</div>
            <div className="stat-card-key">Favourites</div>
          </div>
          <div className="stat-card" onClick={() => navigate('calendar')}>
            <div className="stat-card-icon">◷</div>
            <div className="stat-card-val">{upcoming.length}</div>
            <div className="stat-card-key">Meals Planned</div>
          </div>
        </div>

        {/* Horizontal scroll of recent cards */}
        <div style={{ marginBottom: 28 }}>
          <div className="feed-label">Recently Added</div>
          <div className="h-scroll">
            {recent.map(r => (
              <div key={r.id} className="tall-card" onClick={() => navigate('detail', { detailId: r.id })}>
                <div className="tall-card-art" style={{ background: r.c1 }}>
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 40% 40%, ${r.c2}, transparent 70%)` }} />
                  <span style={{ position: 'relative', zIndex: 1, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>{r.e}</span>
                </div>
                <div className="tall-card-body">
                  <div className="tall-card-name">{r.n}</div>
                  <div className="tall-card-foot">
                    <span className="tall-card-time">⏱ {r.time}</span>
                    <span
                      style={{ fontSize: 13, cursor: 'pointer', color: r.fav ? 'var(--rust)' : 'rgba(0,0,0,0.15)' }}
                      onClick={e => { e.stopPropagation(); toggleFav(r.id); }}
                    >
                      {r.fav ? '❤' : '♡'}
                    </span>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Favourites list */}
        {favs.length > 0 && (
          <div>
            <div className="feed-label">Favourites</div>
            {favs.map(r => (
              <div
                key={r.id}
                style={{ display: 'flex', alignItems: 'center', gap: 12, padding: '10px 0', borderBottom: '1px solid rgba(226,217,204,0.5)', cursor: 'pointer' }}
                onClick={() => navigate('detail', { detailId: r.id })}
              >
                <div style={{ width: 40, height: 40, borderRadius: 8, background: r.c1, display: 'flex', alignItems: 'center', justifyContent: 'center', fontSize: 20, flexShrink: 0 }}>
                  {r.e}
                </div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div style={{ fontFamily: 'var(--B)', fontStyle: 'italic', fontSize: 13, color: 'var(--ink)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{r.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink3)', fontWeight: 300, marginTop: 2 }}>{r.time} · {r.diff}</div>
                </div>
                <button
                  style={{ fontSize: 11, padding: '5px 10px', background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 6, cursor: 'pointer', color: 'var(--ink2)', fontFamily: 'var(--O)' }}
                  onClick={e => { e.stopPropagation(); openCalModal(r.id); }}
                >
                  Schedule
                </button>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── ASIDE ── */}
      <div className="home-aside">
        <div className="aside-section">
          <div className="aside-label">This Month</div>
          <MiniCalendar calendar={calendar} onDayClick={openDayModal} />
        </div>

        {upcoming.length > 0 && (
          <div className="aside-section">
            <div className="aside-label">Coming Up</div>
            {upcoming.slice(0, 4).map(({ d, r }, i) => (
              <div key={i} className="aside-recipe-row" onClick={() => navigate('calendar')}>
                <div className="aside-art" style={{ background: r.c1 }}>{r.e}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="aside-rname">{r.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 1 }}>{MONTHS[d.getMonth()]} {d.getDate()}</div>
                </div>
              </div>
            ))}
          </div>
        )}

        <div>
          <div className="aside-label">Quick Actions</div>
          {[
            { label: '✦ Detect recipe from video →', page: 'upload', opts: {} },
            { label: '+ Create recipe manually →',   page: 'edit',   opts: {} },
          ].map(({ label, page, opts }) => (
            <button
              key={page}
              onClick={() => navigate(page, opts)}
              style={{ fontFamily: 'var(--O)', fontSize: 12, fontWeight: 400, background: 'var(--bg)', border: '1px solid var(--line)', borderRadius: 8, padding: '10px 14px', cursor: 'pointer', color: 'var(--ink2)', textAlign: 'left', width: '100%', marginBottom: 6, transition: 'all 0.15s', display: 'block' }}
              onMouseOver={e => { e.currentTarget.style.borderColor = 'var(--gold)'; e.currentTarget.style.color = 'var(--gold)'; }}
              onMouseOut={e => { e.currentTarget.style.borderColor = 'var(--line)'; e.currentTarget.style.color = 'var(--ink2)'; }}
            >
              {label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
