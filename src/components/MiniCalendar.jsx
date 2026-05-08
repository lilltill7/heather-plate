import { useState } from 'react';

const MONTH_NAMES = [
  'January','February','March','April','May','June',
  'July','August','September','October','November','December',
];

export default function MiniCalendar({ calendar = {}, onDayClick }) {
  const [calDate, setCalDate] = useState(new Date());
  const today = new Date();
  const y = calDate.getFullYear();
  const m = calDate.getMonth();

  const firstDay = new Date(y, m, 1).getDay();
  const daysInMonth = new Date(y, m + 1, 0).getDate();
  const daysInPrev = new Date(y, m, 0).getDate();

  const cells = [];
  for (let i = firstDay - 1; i >= 0; i--) cells.push({ d: daysInPrev - i, dim: true });
  for (let d = 1; d <= daysInMonth; d++) cells.push({ d, dim: false });
  while (cells.length % 7 !== 0) cells.push({ d: cells.length - daysInMonth - firstDay + 1, dim: true });

  return (
    <div className="mini-cal">
      <div className="mini-cal-hd">
        <button className="mini-cal-nav" onClick={() => setCalDate(new Date(y, m - 1, 1))}>‹</button>
        <div className="mini-cal-month">{MONTH_NAMES[m]} {y}</div>
        <button className="mini-cal-nav" onClick={() => setCalDate(new Date(y, m + 1, 1))}>›</button>
      </div>
      <div className="mini-cal-grid">
        {['S','M','T','W','T','F','S'].map((d, i) => (
          <div key={i} className="mini-cal-dow">{d}</div>
        ))}
        {cells.map((c, i) => {
          const isToday = !c.dim
            && c.d === today.getDate()
            && m === today.getMonth()
            && y === today.getFullYear();
          const dk = `${y}-${String(m + 1).padStart(2, '0')}-${String(c.d).padStart(2, '0')}`;
          const hasMeal = !c.dim && (calendar[dk] || []).length > 0;
          return (
            <button
              key={i}
              className={[
                'mini-cal-day',
                isToday ? 'today' : '',
                c.dim ? 'dim' : '',
                hasMeal ? 'has-meal' : '',
              ].filter(Boolean).join(' ')}
              onClick={() => !c.dim && onDayClick(dk)}
            >
              {c.d}
            </button>
          );
        })}
      </div>
    </div>
  );
}
