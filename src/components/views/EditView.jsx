import { useState } from 'react';

export default function EditView({ editRecipe, saveRecipe, navigate, showToast }) {
  const isNew = !editRecipe || editRecipe?.id?.startsWith('new_');

  const [form, setForm] = useState({
    id:    editRecipe?.id    || 'new_' + Date.now(),
    n:     editRecipe?.n     || '',
    e:     editRecipe?.e     || '🍽️',
    prep:  editRecipe?.prep  || '',
    time:  editRecipe?.time  || '',
    srv:   editRecipe?.srv   || 2,
    diff:  editRecipe?.diff  || 'Easy',
    tags:  (editRecipe?.tags || []).join(', '),
    notes: editRecipe?.notes || '',
    fav:   editRecipe?.fav   || false,
    ts:    editRecipe?.ts    || Date.now(),
    src:   editRecipe?.src   || 'Manual',
    c1:    editRecipe?.c1    || '#e8d5b0',
    c2:    editRecipe?.c2    || '#c8dbc9',
  });

  const [ing, setIng]     = useState(editRecipe?.ing   || []);
  const [steps, setSteps] = useState(editRecipe?.steps || []);

  const set = (key, val) => setForm(f => ({ ...f, [key]: val }));

  const addIng   = () => setIng(l => [...l, '']);
  const rmIng    = (i) => setIng(l => l.filter((_, idx) => idx !== i));
  const editIng  = (i, v) => setIng(l => l.map((x, idx) => idx === i ? v : x));

  const addStep  = () => setSteps(l => [...l, '']);
  const rmStep   = (i) => setSteps(l => l.filter((_, idx) => idx !== i));
  const editStep = (i, v) => setSteps(l => l.map((x, idx) => idx === i ? v : x));

  const handleSave = () => {
    if (!form.n.trim()) { alert('Please enter a recipe name'); return; }
    const recipe = {
      ...form,
      srv:  parseInt(form.srv) || 2,
      tags: form.tags.split(',').map(t => t.trim()).filter(Boolean),
      ing:  ing.filter(x => x.trim()),
      steps: steps.filter(x => x.trim()),
    };
    saveRecipe(recipe);
    showToast('Recipe saved ✓');
    navigate('detail', { detailId: recipe.id });
  };

  return (
    <div className="form-layout" style={{ height: 'calc(100vh - 56px)' }}>
      {/* ── LEFT: metadata ── */}
      <div className="form-left">
        <div className="form-title">{isNew ? 'New Recipe' : 'Edit Recipe'}</div>

        <div className="frow2">
          <div className="fg">
            <label className="fl">Emoji</label>
            <input className="fi" value={form.e} onChange={e => set('e', e.target.value)} maxLength={2} />
          </div>
          <div className="fg">
            <label className="fl">Recipe Name</label>
            <input className="fi" value={form.n} onChange={e => set('n', e.target.value)} placeholder="Recipe name…" />
          </div>
        </div>

        <div className="frow2">
          <div className="fg">
            <label className="fl">Prep Time</label>
            <input className="fi" value={form.prep} onChange={e => set('prep', e.target.value)} placeholder="10 min" />
          </div>
          <div className="fg">
            <label className="fl">Cook Time</label>
            <input className="fi" value={form.time} onChange={e => set('time', e.target.value)} placeholder="30 min" />
          </div>
        </div>

        <div className="frow2">
          <div className="fg">
            <label className="fl">Servings</label>
            <input className="fi" type="number" min={1} value={form.srv} onChange={e => set('srv', e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Difficulty</label>
            <select className="fsel" value={form.diff} onChange={e => set('diff', e.target.value)}>
              <option>Easy</option>
              <option>Medium</option>
              <option>Hard</option>
            </select>
          </div>
        </div>

        <div className="fg">
          <label className="fl">Tags (comma separated)</label>
          <input className="fi" value={form.tags} onChange={e => set('tags', e.target.value)} placeholder="dinner, healthy, quick" />
        </div>

        <div className="fg">
          <label className="fl">Notes</label>
          <textarea className="fta" value={form.notes} onChange={e => set('notes', e.target.value)} rows={3} />
        </div>

        <div className="save-bar">
          <button className="btn-save" onClick={handleSave}>Save Recipe</button>
          <button className="btn-cancel" onClick={() => navigate(isNew ? 'home' : 'detail')}>Cancel</button>
        </div>
      </div>

      {/* ── RIGHT: ingredients + steps ── */}
      <div className="form-right">
        <div style={{ fontFamily: 'var(--I)', fontSize: 20, color: 'var(--ink)', marginBottom: 18 }}>Ingredients</div>
        {ing.map((v, i) => (
          <div key={i} className="form-list-item">
            <input
              className="fi ing-in"
              style={{ flex: 1 }}
              value={v}
              onChange={e => editIng(i, e.target.value)}
              placeholder="e.g. 2 cups flour"
            />
            <button className="rm-btn" onClick={() => rmIng(i)}>✕</button>
          </div>
        ))}
        <button className="btn-add-item" onClick={addIng}>+ Add Ingredient</button>

        <div style={{ fontFamily: 'var(--I)', fontSize: 20, color: 'var(--ink)', margin: '24px 0 18px' }}>Method</div>
        {steps.map((v, i) => (
          <div key={i} className="form-list-item" style={{ alignItems: 'flex-start' }}>
            <div className="form-step-num">{i + 1}</div>
            <textarea
              className="fta stp-in"
              style={{ flex: 1, minHeight: 52 }}
              value={v}
              onChange={e => editStep(i, e.target.value)}
              placeholder="Describe this step…"
            />
            <button className="rm-btn" onClick={() => rmStep(i)} style={{ marginTop: 6 }}>✕</button>
          </div>
        ))}
        <button className="btn-add-item" onClick={addStep}>+ Add Step</button>
      </div>
    </div>
  );
}
