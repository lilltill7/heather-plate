import { useState } from 'react';

export default function SavedView({ recipes = [], navigate, toggleFav, openCalModal, favOnly = false }) {
  const [q, setQ] = useState('');

  let list = favOnly ? recipes.filter(r => r.fav) : [...recipes];
  list = list.sort((a, b) => b.ts - a.ts);
  if (q.trim()) {
    const lower = q.toLowerCase();
    list = list.filter(r =>
      r.n.toLowerCase().includes(lower) ||
      (r.tags || []).join(' ').toLowerCase().includes(lower)
    );
  }

  return (
    <div style={{ height: 'calc(100vh - 56px)', overflowY: 'auto', padding: 28 }}>
      <div style={{ fontFamily: 'var(--I)', fontSize: 32, color: 'var(--ink)', marginBottom: 20 }}>
        {favOnly ? 'Favourites' : 'All Recipes'}
      </div>

      <div className="stat-grid" style={{ marginBottom: 24 }}>
        <div className="stat-card">
          <div className="stat-card-val">{list.length}</div>
          <div className="stat-card-key">Total</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-val">{list.filter(r => r.src === 'AI').length}</div>
          <div className="stat-card-key">AI Generated</div>
        </div>
        <div className="stat-card">
          <div className="stat-card-val">{list.filter(r => r.diff === 'Easy').length}</div>
          <div className="stat-card-key">Easy</div>
        </div>
      </div>

      <div className="idx-search" style={{ marginBottom: 20, borderRadius: 8 }}>
        <span className="idx-search-icon">⌕</span>
        <input
          placeholder="Search recipes…"
          value={q}
          onChange={e => setQ(e.target.value)}
        />
      </div>

      {list.length === 0 ? (
        <div style={{ textAlign: 'center', padding: '60px 20px', color: 'var(--ink3)' }}>
          <div style={{ fontSize: 36, marginBottom: 12, opacity: 0.4 }}>◻</div>
          <div style={{ fontFamily: 'var(--B)', fontStyle: 'italic', fontSize: 18, color: 'var(--ink2)', marginBottom: 8 }}>
            {favOnly ? 'No favourites yet' : q ? 'No results' : 'No recipes yet'}
          </div>
          <div style={{ fontSize: 12, fontWeight: 300, marginBottom: 18 }}>
            {favOnly ? 'Heart a recipe to save it here.' : q ? 'Try a different search term.' : 'Add your first recipe to get started.'}
          </div>
          {!favOnly && (
            <button
              onClick={() => navigate('upload')}
              style={{ fontFamily: 'var(--O)', fontSize: 11, fontWeight: 500, background: 'var(--gold)', color: 'white', border: 'none', cursor: 'pointer', padding: '10px 20px', borderRadius: 8 }}
            >
              + Add Recipe
            </button>
          )}
        </div>
      ) : (
        <div className="list-grid">
          {list.map(r => {
            const diffCls = r.diff === 'Easy' ? 'chip-e' : r.diff === 'Hard' ? 'chip-h' : 'chip-m';
            return (
              <div key={r.id} className="tall-card" onClick={() => navigate('detail', { detailId: r.id })}>
                <div className="tall-card-art" style={{ background: r.c1, height: 160 }}>
                  <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 40% 40%, ${r.c2}, transparent 70%)` }} />
                  <span style={{ position: 'relative', zIndex: 1, fontSize: 52, filter: 'drop-shadow(0 4px 12px rgba(0,0,0,0.15))' }}>{r.e}</span>
                </div>
                <div className="tall-card-body">
                  <div style={{ fontSize: 9, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: r.src === 'AI' ? 'var(--plum)' : 'var(--sage)', marginBottom: 4 }}>
                    {r.src === 'AI' ? '✦ AI' : '▷ Video'}
                  </div>
                  <div className="tall-card-name">{r.n}</div>
                  <div className="tall-card-foot">
                    <span className={`chip ${diffCls}`}>{r.diff}</span>
                    <div style={{ display: 'flex', gap: 6 }}>
                      <span
                        style={{ fontSize: 13, cursor: 'pointer', color: r.fav ? 'var(--rust)' : 'rgba(0,0,0,0.15)' }}
                        onClick={e => { e.stopPropagation(); toggleFav(r.id); }}
                      >
                        {r.fav ? '❤' : '♡'}
                      </span>
                      <span
                        style={{ fontSize: 13, cursor: 'pointer', color: 'rgba(0,0,0,0.15)' }}
                        onClick={e => { e.stopPropagation(); openCalModal(r.id); }}
                      >
                        ◷
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
