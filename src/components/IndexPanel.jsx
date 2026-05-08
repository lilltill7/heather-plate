import { useState } from 'react';

export default function IndexPanel({ show, recipes = [], detailId, onSelect, onToggleFav, onAdd }) {
  const [tab, setTab] = useState('all');
  const [q, setQ] = useState('');

  let list = [...recipes].sort((a, b) => b.ts - a.ts);
  if (tab === 'fav') list = list.filter(r => r.fav);
  if (tab === 'ai')  list = list.filter(r => r.src === 'AI');
  if (q.trim()) {
    const lower = q.toLowerCase();
    list = list.filter(r =>
      r.n.toLowerCase().includes(lower) ||
      (r.tags || []).join(' ').toLowerCase().includes(lower)
    );
  }

  return (
    <div className={`index-panel${show ? '' : ' hidden'}`}>
      <div className="idx-header">
        <div className="idx-title">Recipes</div>
        <div className="idx-search">
          <span className="idx-search-icon">⌕</span>
          <input
            placeholder="Search…"
            value={q}
            onChange={e => setQ(e.target.value)}
          />
        </div>
      </div>

      <div className="idx-tabs">
        {[['all','All'],['fav','Favourites'],['ai','AI']].map(([key, label]) => (
          <button
            key={key}
            className={`idx-tab${tab === key ? ' active' : ''}`}
            onClick={() => setTab(key)}
          >
            {label}
          </button>
        ))}
      </div>

      <div className="idx-list">
        {list.length === 0 && (
          <div style={{ padding: '20px', textAlign: 'center', fontSize: 12, color: 'var(--ink3)' }}>
            No recipes found
          </div>
        )}
        {list.map(r => (
          <div
            key={r.id}
            className={`idx-item${detailId === r.id ? ' active' : ''}`}
            onClick={() => onSelect(r.id)}
          >
            <div className="idx-art" style={{ background: r.c1 }}>{r.e}</div>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="idx-name">{r.n}</div>
              <div className="idx-meta">{r.time} · {r.diff} · {r.src}</div>
            </div>
            <button
              className={`idx-fav${r.fav ? ' on' : ''}`}
              onClick={e => { e.stopPropagation(); onToggleFav(r.id); }}
            >
              {r.fav ? '❤' : '♡'}
            </button>
          </div>
        ))}
      </div>

      <button className="idx-add-btn" onClick={onAdd}>
        + New Recipe
      </button>
    </div>
  );
}
