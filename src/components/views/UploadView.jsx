import { useState } from 'react';
import { detectRecipeFromUrl, mockDetect } from '../../services/mockAiService';

export default function UploadView({ navigate, saveRecipe, showToast }) {
  const [url, setUrl]           = useState('');
  const [status, setStatus]     = useState('idle'); // idle | loading | result
  const [progress, setProgress] = useState(0);
  const [detected, setDetected] = useState(null);

  const runDetection = async (fromFile = false) => {
    if (!fromFile && !url.trim()) { alert('Paste a video URL first'); return; }
    setStatus('loading');
    setProgress(0);

    const iv = setInterval(() => {
      setProgress(p => {
        if (p >= 90) { clearInterval(iv); return 90; }
        return p + Math.random() * 14;
      });
    }, 330);

    try {
      let recipe;
      if (process.env.REACT_APP_GEMINI_KEY) {
        recipe = await detectRecipeFromUrl(url);
      } else {
        recipe = await mockDetect();
      }
      clearInterval(iv);
      setProgress(100);
      setDetected(recipe);
      setStatus('result');
    } catch (err) {
      clearInterval(iv);
      console.error('Detection failed:', err);
      alert(`Detection failed: ${err.message}\n\nFalling back to mock data.`);
      const fallback = await mockDetect();
      setDetected(fallback);
      setStatus('result');
    }
  };

  const handleSave = () => {
    saveRecipe(detected);
    showToast('Recipe saved ✓');
    navigate('detail', { detailId: detected.id });
  };

  const handleEdit = () => {
    navigate('edit', { editRecipe: detected });
  };

  return (
    <div className="upload-layout" style={{ height: 'calc(100vh - 56px)' }}>
      {/* ── LEFT ── */}
      <div className="upload-left">
        <div className="upload-title">Detect a Recipe</div>
        <div className="upload-sub">
          Paste a video URL from YouTube, TikTok, or Instagram and Gemini AI will
          extract the full recipe — ingredients, steps, timings, and all.
        </div>

        <div className="url-row">
          <input
            className="url-input"
            value={url}
            onChange={e => setUrl(e.target.value)}
            placeholder="https://youtube.com/watch?v=…"
          />
          <button className="detect-btn" onClick={() => runDetection(false)}>
            ✦ Detect
          </button>
        </div>

        <div className="drop-area" onClick={() => document.getElementById('file-upload').click()}>
          <div className="drop-glyph">◈</div>
          <div className="drop-title">Or upload a video file</div>
          <div className="drop-sub">MP4 · MOV · WebM · up to 500 MB</div>
          <input
            type="file"
            id="file-upload"
            style={{ display: 'none' }}
            accept="video/*"
            onChange={() => runDetection(true)}
          />
        </div>

        <div style={{ paddingTop: 20, borderTop: '1px solid var(--line)', marginTop: 4 }}>
          <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink3)', marginBottom: 10 }}>
            No video? Create a recipe manually.
          </div>
          <button
            className="btn btn-outline"
            onClick={() => navigate('edit', {
              editRecipe: {
                id: 'new_' + Date.now(), n: '', e: '🍽️', tags: [],
                time: '', prep: '', diff: 'Easy', srv: 2, fav: false,
                ts: Date.now(), src: 'Manual', ing: [], steps: [],
                notes: '', c1: '#e8d5b0', c2: '#c8dbc9',
              },
            })}
          >
            ✎ Create Manually →
          </button>
        </div>

        <div className="gemini-info">
          <div className="gemini-info-title">🔌 Gemini AI Integration</div>
          <div className="gemini-info-text">
            {process.env.REACT_APP_GEMINI_KEY
              ? '✅ API key detected — using real Gemini detection.'
              : 'No API key found. Using mock data. Add REACT_APP_GEMINI_KEY to your .env file to enable real detection.'}
          </div>
        </div>
      </div>

      {/* ── RIGHT ── */}
      <div className="upload-right">
        <div style={{ fontFamily: 'var(--I)', fontSize: 22, color: 'var(--ink)', marginBottom: 6 }}>
          Detection Result
        </div>
        <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink3)', marginBottom: 24 }}>
          Review the extracted recipe before saving.
        </div>

        {status === 'idle' && (
          <div style={{ color: 'var(--ink3)', fontSize: 13, fontWeight: 300 }}>
            Paste a video URL and click Detect to get started.
          </div>
        )}

        {status === 'loading' && (
          <div>
            <div className="ai-badge">
              <div className="ai-dot" />
              Gemini is analysing the video…
            </div>
            <div className="prog-wrap">
              <div className="prog-fill" style={{ width: `${Math.min(progress, 100)}%` }} />
            </div>
            <div style={{ fontSize: 11, fontWeight: 300, color: 'var(--ink3)' }}>
              Extracting ingredients · steps · timings · difficulty
            </div>
          </div>
        )}

        {status === 'result' && detected && (
          <div>
            <div style={{
              display: 'flex', alignItems: 'center', gap: 12, marginBottom: 18,
              padding: 14, background: 'rgba(107,76,122,0.04)',
              border: '1px solid rgba(107,76,122,0.15)', borderRadius: 10,
            }}>
              <div className="ai-dot" />
              <div style={{ fontSize: 11, fontWeight: 500, letterSpacing: '0.08em', textTransform: 'uppercase', color: 'var(--plum)' }}>
                Detection Complete
              </div>
            </div>

            <div style={{ fontSize: 48, marginBottom: 10 }}>{detected.e}</div>
            <div className="ai-result-name">{detected.n}</div>
            <div className="ai-result-meta">
              {detected.prep} prep · {detected.time} cook · serves {detected.srv} · {detected.diff}
            </div>

            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 8 }}>
              Ingredients
            </div>
            <ul className="ai-ing-list">
              {(detected.ing || []).map((ing, i) => <li key={i}>{ing}</li>)}
            </ul>

            <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.12em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 10 }}>
              Method
            </div>
            {(detected.steps || []).map((step, i) => (
              <div key={i} className="step-item" style={{ marginBottom: 10 }}>
                <div className="step-num" style={{ fontSize: 16 }}>{i + 1}</div>
                <div className="step-text" style={{ fontSize: 12 }}>{step}</div>
              </div>
            ))}

            <div style={{ display: 'flex', gap: 8, marginTop: 18, flexWrap: 'wrap' }}>
              <button className="detect-btn" onClick={handleSave}>Save Recipe</button>
              <button className="btn btn-outline" onClick={handleEdit}>Edit First</button>
              <button className="btn btn-ghost" onClick={() => setStatus('idle')}>Discard</button>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
