const MONTH_NAMES = ['January','February','March','April','May','June','July','August','September','October','November','December'];
const SHORT_MONTHS = ['Jan','Feb','Mar','Apr','May','Jun','Jul','Aug','Sep','Oct','Nov','Dec'];
const DAY_NAMES    = ['Sun','Mon','Tue','Wed','Thu','Fri','Sat'];

export default function CalendarView({ recipes = [], calendar = {}, calDate, setCalDate, navigate, addToCalendar, removeFromCalendar, openDayModal }) {
  const today = new Date();
  const y = calDate.getFullYear();
  const m = calDate.getMonth();

  const firstDay    = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrev  = new Date(y, m, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: daysInPrev - i, dim: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d, dim: false });
  while (cells.length % 7 !== 0) cells.push({ d: cells.length - daysInMonth - firstDay + 1, dim: true });

  // Build upcoming meals for next 30 days
  const upcoming = [];
  for (let i = 0; i < 30; i++) {
    const d = new Date(today);
    d.setDate(today.getDate() + i);
    const dk = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    (calendar[dk] || []).forEach(me => {
      const r = recipes.find(x => x.id === me.id);
      if (r) upcoming.push({ d, r, dk });
    });
  }

  return (
    <div className="cal-layout" style={{ height: 'calc(100vh - 56px)' }}>
      {/* ── CALENDAR MAIN ── */}
      <div className="cal-main">
        <div className="cal-hd">
          <div className="cal-hd-title">{MONTH_NAMES[m]} {y}</div>
          <button
            style={{ fontFamily: 'var(--O)', fontSize: 11, background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 6, padding: '7px 12px', cursor: 'pointer', color: 'var(--ink2)' }}
            onClick={() => setCalDate(new Date(y, m - 1, 1))}
          >
            ‹ Prev
          </button>
          <button
            style={{ fontFamily: 'var(--O)', fontSize: 11, background: 'var(--bg2)', border: '1px solid var(--line)', borderRadius: 6, padding: '7px 12px', cursor: 'pointer', color: 'var(--ink2)' }}
            onClick={() => setCalDate(new Date(y, m + 1, 1))}
          >
            Next ›
          </button>
        </div>

        <div className="cal-grid-wrap">
          <div className="cal-grid">
            {DAY_NAMES.map(d => (
              <div key={d} className="cal-dow">{d}</div>
            ))}
            {cells.map((c, i) => {
              const isToday = !c.dim && c.d === today.getDate() && m === today.getMonth() && y === today.getFullYear();
              const dk = `${y}-${String(m+1).padStart(2,'0')}-${String(c.d).padStart(2,'0')}`;
              const meals = calendar[dk] || [];
              return (
                <div
                  key={i}
                  className={['cal-cell', isToday ? 'today' : '', c.dim ? 'dim' : ''].filter(Boolean).join(' ')}
                  onClick={() => !c.dim && openDayModal(dk)}
                >
                  <div className="cal-cell-num">
                    {isToday
                      ? <div className="cal-today-num">{c.d}</div>
                      : c.d}
                  </div>
                  {meals.slice(0, 2).map(me => {
                    const r = recipes.find(x => x.id === me.id);
                    return r ? (
                      <div key={me.id} className="cal-pill">{r.e} {r.n.slice(0, 10)}{r.n.length > 10 ? '…' : ''}</div>
                    ) : null;
                  })}
                  {meals.length > 2 && (
                    <div style={{ fontSize: 8, color: 'var(--ink3)', paddingTop: 2 }}>+{meals.length - 2}</div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      </div>

      {/* ── ASIDE: upcoming ── */}
      <div className="cal-aside">
        <div style={{ fontFamily: 'var(--I)', fontSize: 20, color: 'var(--ink)', marginBottom: 16 }}>
          Upcoming Meals
        </div>

        {upcoming.length === 0 && (
          <div style={{ fontSize: 12, fontWeight: 300, color: 'var(--ink3)' }}>
            Click any date on the calendar to schedule a meal.
          </div>
        )}

        {upcoming.slice(0, 8).map(({ d, r, dk }, i) => (
          <div key={i} className="upcoming-item" onClick={() => navigate('detail', { detailId: r.id })}>
            <div className="upcoming-date-box">
              <div className="upcoming-d">{d.getDate()}</div>
              <div className="upcoming-m">{SHORT_MONTHS[d.getMonth()]}</div>
            </div>
            <span style={{ fontSize: 20, flexShrink: 0, marginTop: 2 }}>{r.e}</span>
            <div style={{ flex: 1, minWidth: 0 }}>
              <div className="upcoming-name">{r.n}</div>
              <div className="upcoming-submeta">{r.time} · {r.diff}</div>
            </div>
            <button
              style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--ink3)', fontSize: 12, padding: '4px 6px', borderRadius: 4, flexShrink: 0 }}
              onClick={e => { e.stopPropagation(); removeFromCalendar(dk, r.id); }}
              title="Remove"
            >
              ✕
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}
