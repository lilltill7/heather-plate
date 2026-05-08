import { useState } from 'react';

export default function Modal({ modal, recipes = [], calendar = {}, onClose, onAddToCalendar, onRemoveFromCalendar, onOpenDetail }) {
  const [date, setDate] = useState(new Date().toISOString().split('T')[0]);
  const [mealType, setMealType] = useState('Dinner');

  if (modal.type === 'cal') {
    const r = recipes.find(x => x.id === modal.recipeId);
    if (!r) return null;
    return (
      <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box">
          <div className="modal-title">Schedule {r.e} {r.n}</div>
          <div className="fg">
            <label className="fl">Date</label>
            <input className="fi" type="date" value={date} onChange={e => setDate(e.target.value)} />
          </div>
          <div className="fg">
            <label className="fl">Meal Type</label>
            <select className="fsel" value={mealType} onChange={e => setMealType(e.target.value)}>
              {['Breakfast', 'Lunch', 'Dinner', 'Snack'].map(m => (
                <option key={m}>{m}</option>
              ))}
            </select>
          </div>
          <div className="modal-btns">
            <button
              className="mbtn-primary"
              onClick={() => {
                if (!date) { alert('Choose a date'); return; }
                onAddToCalendar(date, modal.recipeId, mealType);
                onClose();
              }}
            >
              Add to Calendar
            </button>
            <button className="mbtn-ghost" onClick={onClose}>Cancel</button>
          </div>
        </div>
      </div>
    );
  }

  if (modal.type === 'day') {
    const { dateKey } = modal;
    const meals = calendar[dateKey] || [];
    const [y, mo, d] = dateKey.split('-');
    const dateStr = new Date(+y, +mo - 1, +d).toLocaleDateString('en-GB', {
      weekday: 'long', day: 'numeric', month: 'long',
    });

    return (
      <div className="modal-bg" onClick={e => e.target === e.currentTarget && onClose()}>
        <div className="modal-box">
          <div className="modal-title">{dateStr}</div>

          {meals.length > 0 && (
            <div style={{ marginBottom: 14 }}>
              {meals.map(me => {
                const r = recipes.find(x => x.id === me.id);
                return r ? (
                  <div key={me.id} className="modal-meal-pill">
                    <span style={{ fontSize: 18 }}>{r.e}</span>
                    <span className="modal-meal-name">{r.n}</span>
                    <span style={{ fontSize: 10, color: 'var(--ink3)' }}>{me.meal}</span>
                    <button
                      className="modal-meal-rm"
                      onClick={() => onRemoveFromCalendar(dateKey, r.id)}
                    >✕</button>
                  </div>
                ) : null;
              })}
            </div>
          )}

          {meals.length === 0 && (
            <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink3)', padding: '8px 0 14px' }}>
              No meals planned for this day.
            </div>
          )}

          <div style={{ fontSize: 10, fontWeight: 500, letterSpacing: '0.1em', textTransform: 'uppercase', color: 'var(--ink3)', marginBottom: 8 }}>
            Add Recipe
          </div>
          <div style={{ maxHeight: 240, overflowY: 'auto' }}>
            {recipes.map(r => (
              <div
                key={r.id}
                className="modal-r-item"
                onClick={() => onAddToCalendar(dateKey, r.id, 'Dinner')}
              >
                <span style={{ fontSize: 18 }}>{r.e}</span>
                <span style={{ flex: 1 }}>{r.n}</span>
                <span style={{ fontSize: 10, color: 'var(--ink3)' }}>{r.time}</span>
              </div>
            ))}
          </div>

          <div className="modal-btns">
            <button className="mbtn-ghost" onClick={onClose}>Close</button>
          </div>
        </div>
      </div>
    );
  }

  return null;
}
