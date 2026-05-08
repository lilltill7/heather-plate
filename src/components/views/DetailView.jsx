import { useState } from 'react';

export default function DetailView({ recipes = [], detailId, navigate, toggleFav, deleteRecipe, openCalModal }) {
  const [checked, setChecked] = useState({});
  const r = recipes.find(x => x.id === detailId);

  if (!r) {
    return (
      <div style={{ padding: 40, textAlign: 'center', color: 'var(--ink3)' }}>
        Recipe not found.{' '}
        <button onClick={() => navigate('home')} style={{ color: 'var(--gold)', background: 'none', border: 'none', cursor: 'pointer' }}>
          ← Home
        </button>
      </div>
    );
  }

  const diffColor = r.diff === 'Easy' ? 'var(--sage)' : r.diff === 'Hard' ? 'var(--rust)' : 'var(--gold)';
  const related = recipes.filter(x => x.id !== r.id && (x.tags || []).some(t => (r.tags || []).includes(t))).slice(0, 3);

  const toggleCheck = (i) => setChecked(c => ({ ...c, [i]: !c[i] }));

  return (
    <div className="detail-layout" style={{ height: 'calc(100vh - 56px)' }}>
      {/* ── MAIN ── */}
      <div className="detail-main">
        <div className="detail-hero" style={{ background: r.c1 }}>
          <div style={{ position: 'absolute', inset: 0, background: `radial-gradient(circle at 35% 50%, ${r.c2}, transparent 60%)` }} />
          <div className="detail-hero-badge">
            {r.src === 'AI' ? '✦ AI Generated' : '▷ Video Detected'}
          </div>
          <div style={{ position: 'relative', zIndex: 1, fontSize: 96, filter: 'drop-shadow(0 8px 32px rgba(0,0,0,0.25))' }}>
            {r.e}
          </div>
        </div>

        <div className="detail-name">{r.n}</div>
        <div className="detail-sub">
          <span>{r.prep} prep</span>
          <span>{r.time} cook</span>
          <span>Serves {r.srv}</span>
          <span style={{ color: diffColor }}>{r.diff}</span>
        </div>

        <div className="d-section">
          <div className="d-section-label">Ingredients</div>
          {(r.ing || []).map((ing, i) => (
            <div
              key={i}
              className={`ing-item${checked[i] ? ' checked' : ''}`}
            >
              <input
                type="checkbox"
                checked={!!checked[i]}
                onChange={() => toggleCheck(i)}
              />
              {ing}
            </div>
          ))}
        </div>

        <div className="d-section">
          <div className="d-section-label">Method</div>
          {(r.steps || []).map((step, i) => (
            <div key={i} className="step-item">
              <div className="step-num">{i + 1}</div>
              <div className="step-text">{step}</div>
            </div>
          ))}
        </div>

        {r.notes && (
          <div className="d-section">
            <div className="d-section-label">Notes</div>
            <div className="note-block">{r.notes}</div>
          </div>
        )}
      </div>

      {/* ── ASIDE ── */}
      <div className="detail-aside">
        <div className="da-section">
          <div className="da-label">At a Glance</div>
          <div className="da-stat-grid">
            <div className="da-stat"><div className="da-stat-v">{r.prep}</div><div className="da-stat-k">Prep</div></div>
            <div className="da-stat"><div className="da-stat-v">{r.time}</div><div className="da-stat-k">Cook</div></div>
            <div className="da-stat"><div className="da-stat-v">{r.srv}</div><div className="da-stat-k">Serves</div></div>
            <div className="da-stat"><div className="da-stat-v" style={{ fontSize: 14, color: diffColor }}>{r.diff}</div><div className="da-stat-k">Level</div></div>
          </div>
          <div className="tag-row">
            {(r.tags || []).map(t => (
              <span key={t} className="tag">#{t}</span>
            ))}
          </div>
        </div>

        <div className="da-section">
          <div className="da-label">Actions</div>
          <button
            className={`da-action-btn${r.fav ? ' active-fav' : ''}`}
            onClick={() => toggleFav(r.id)}
          >
            {r.fav ? '❤ Saved to Favourites' : '♡ Add to Favourites'}
          </button>
          <button
            className="da-action-btn"
            onClick={() => openCalModal(r.id)}
          >
            ◷ Schedule on Calendar
          </button>
          <button
            className="da-action-btn"
            onClick={() => navigate('edit', { editRecipe: r })}
          >
            ✎ Edit Recipe
          </button>
          <button
            className="da-action-btn"
            style={{ color: 'var(--rust)', borderColor: 'rgba(184,92,56,0.2)' }}
            onClick={() => {
              if (window.confirm('Delete this recipe?')) deleteRecipe(r.id);
            }}
          >
            Delete Recipe
          </button>
        </div>

        {related.length > 0 && (
          <div className="da-section" style={{ border: 'none' }}>
            <div className="da-label">More Like This</div>
            {related.map(x => (
              <div key={x.id} className="aside-recipe-row" onClick={() => navigate('detail', { detailId: x.id })}>
                <div className="aside-art" style={{ background: x.c1 }}>{x.e}</div>
                <div style={{ flex: 1, minWidth: 0 }}>
                  <div className="aside-rname">{x.n}</div>
                  <div style={{ fontSize: 10, color: 'var(--ink3)', marginTop: 1 }}>{x.time}</div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
