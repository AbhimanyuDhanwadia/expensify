import React, { useState, useMemo } from 'react';
import {
  format, startOfMonth, endOfMonth, startOfWeek, endOfWeek, eachDayOfInterval,
  addMonths, subMonths, addWeeks, subWeeks, isSameDay, isSameMonth, isToday,
  getDay, parseISO,
} from 'date-fns';
import { ChevronLeft, ChevronRight, Plus, X, DollarSign, Trash2 } from 'lucide-react';

export default function Calendar({ expenses, refunds, paydays, onAddPayday, onDeletePayday }) {
  const [currentDate, setCurrentDate] = useState(new Date());
  const [mode, setMode] = useState('month'); // 'month' | 'week'
  const [showModal, setShowModal] = useState(false);
  const [selectedDay, setSelectedDay] = useState(null);
  const [paydayForm, setPaydayForm] = useState({ label: '', amount: '' });
  const [formError, setFormError] = useState('');

  // Build day map: date → { income, expense, refund }
  const dayMap = useMemo(() => {
    const map = {};
    const add = (dateStr, key, amt) => {
      if (!map[dateStr]) map[dateStr] = { income: 0, expense: 0, refund: 0 };
      map[dateStr][key] += amt;
    };
    expenses.forEach((e) => add(e.date, 'expense', e.amount));
    paydays.forEach((p) => add(p.date, 'income', p.amount));
    refunds.filter((r) => r.status === 'fulfilled').forEach((r) => add(r.date, 'refund', r.amount));
    return map;
  }, [expenses, refunds, paydays]);

  // Get days to display
  const days = useMemo(() => {
    if (mode === 'month') {
      const start = startOfWeek(startOfMonth(currentDate), { weekStartsOn: 0 });
      const end = endOfWeek(endOfMonth(currentDate), { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    } else {
      const start = startOfWeek(currentDate, { weekStartsOn: 0 });
      const end = endOfWeek(currentDate, { weekStartsOn: 0 });
      return eachDayOfInterval({ start, end });
    }
  }, [currentDate, mode]);

  const navigate = (dir) => {
    if (mode === 'month') {
      setCurrentDate((d) => dir === 1 ? addMonths(d, 1) : subMonths(d, 1));
    } else {
      setCurrentDate((d) => dir === 1 ? addWeeks(d, 1) : subWeeks(d, 1));
    }
  };

  const handleDayClick = (day) => {
    setSelectedDay(day);
    setPaydayForm({ label: 'Payday', amount: '' });
    setFormError('');
    setShowModal(true);
  };

  const handleAddPayday = (e) => {
    e.preventDefault();
    const amt = parseFloat(paydayForm.amount);
    if (!amt || amt <= 0) return setFormError('Enter a valid amount.');
    setFormError('');
    onAddPayday({
      id: Date.now(),
      label: paydayForm.label.trim() || 'Payday',
      amount: amt,
      date: format(selectedDay, 'yyyy-MM-dd'),
    });
    setShowModal(false);
  };

  // Paydays on selected day
  const selectedPaydays = useMemo(() => {
    if (!selectedDay) return [];
    const ds = format(selectedDay, 'yyyy-MM-dd');
    return paydays.filter((p) => p.date === ds);
  }, [selectedDay, paydays]);

  const title = mode === 'month'
    ? format(currentDate, 'MMMM yyyy')
    : `Week of ${format(startOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM d')} – ${format(endOfWeek(currentDate, { weekStartsOn: 0 }), 'MMM d, yyyy')}`;

  return (
    <div className="animate-fade-in" style={{ maxWidth: 900, margin: '0 auto', padding: '24px' }}>
      {/* Header */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '24px', flexWrap: 'wrap', gap: '12px' }}>
        <div>
          <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
            Calendar
          </h2>
          <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
            Visualize your cash flow over time
          </p>
        </div>

        {/* Mode toggle */}
        <div style={{ display: 'flex', gap: '4px', padding: '4px', background: 'var(--bg-glass)', border: '1px solid var(--border)', borderRadius: 10 }}>
          {['month', 'week'].map((m) => (
            <button
              key={m}
              id={`cal-mode-${m}`}
              onClick={() => setMode(m)}
              style={{
                padding: '6px 16px', borderRadius: 7, border: 'none', cursor: 'pointer',
                fontFamily: 'inherit', fontSize: '0.8rem', fontWeight: 600, transition: 'all 0.2s',
                background: mode === m ? 'var(--accent)' : 'transparent',
                color: mode === m ? '#fff' : 'var(--text-secondary)',
              }}
            >
              {m.charAt(0).toUpperCase() + m.slice(1)}
            </button>
          ))}
        </div>
      </div>

      {/* Navigation */}
      <div className="glass-card" style={{ padding: '20px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <button
            id="cal-prev"
            onClick={() => navigate(-1)}
            className="btn-ghost"
            style={{ padding: '6px 10px' }}
          >
            <ChevronLeft size={18} />
          </button>
          <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            {title}
          </h3>
          <button
            id="cal-next"
            onClick={() => navigate(1)}
            className="btn-ghost"
            style={{ padding: '6px 10px' }}
          >
            <ChevronRight size={18} />
          </button>
        </div>

        {/* Day names header */}
        <div className="cal-grid" style={{ marginBottom: '4px' }}>
          {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map((d) => (
            <div key={d} style={{ textAlign: 'center', fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)', padding: '4px 0', textTransform: 'uppercase', letterSpacing: '0.05em' }}>
              {d}
            </div>
          ))}
        </div>

        {/* Calendar days */}
        <div className="cal-grid">
          {days.map((day) => {
            const ds = format(day, 'yyyy-MM-dd');
            const data = dayMap[ds];
            const net = data ? data.income + data.refund - data.expense : null;
            const inCurrentMonth = isSameMonth(day, currentDate);
            const todayFlag = isToday(day);

            return (
              <button
                key={ds}
                id={`cal-day-${ds}`}
                onClick={() => handleDayClick(day)}
                className={`cal-day ${todayFlag ? 'today' : ''} ${net !== null ? (net >= 0 ? 'positive' : 'negative') : ''}`}
                style={{
                  opacity: inCurrentMonth || mode === 'week' ? 1 : 0.3,
                  flexDirection: 'column',
                  gap: '2px',
                  cursor: 'pointer',
                  background: todayFlag ? 'var(--accent-glow)' : net !== null ? (net >= 0 ? 'rgba(52,211,153,0.08)' : 'rgba(248,113,113,0.08)') : 'transparent',
                  border: `1px solid ${todayFlag ? 'var(--accent)' : 'transparent'}`,
                  fontFamily: 'inherit',
                }}
              >
                <span style={{ fontSize: '0.8rem', fontWeight: todayFlag ? 800 : 500, color: todayFlag ? 'var(--accent)' : 'var(--text-primary)' }}>
                  {format(day, 'd')}
                </span>
                {net !== null && (
                  <span className="tabular" style={{
                    fontSize: '0.55rem', fontWeight: 700,
                    color: net >= 0 ? 'var(--income)' : 'var(--expense)',
                    lineHeight: 1,
                  }}>
                    {net >= 0 ? '+' : ''}${Math.abs(net).toFixed(0)}
                  </span>
                )}
                {data?.income > 0 && (
                  <div style={{ width: 4, height: 4, borderRadius: '50%', background: 'var(--income)', marginTop: 1 }} />
                )}
              </button>
            );
          })}
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', gap: '16px', marginTop: '16px', paddingTop: '12px', borderTop: '1px solid var(--border)', justifyContent: 'center' }}>
          {[
            { color: 'var(--income)', label: 'Income/Payday' },
            { color: 'var(--expense)', label: 'Net Negative' },
            { color: 'var(--accent)', label: 'Today' },
          ].map(({ color, label }) => (
            <div key={label} style={{ display: 'flex', alignItems: 'center', gap: 6 }}>
              <div style={{ width: 10, height: 10, borderRadius: 3, background: color }} />
              <span style={{ fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{label}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Upcoming paydays list */}
      {paydays.length > 0 && (
        <div className="glass-card" style={{ marginTop: '20px', padding: '20px' }}>
          <h3 style={{ margin: '0 0 14px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            💰 All Paydays
          </h3>
          <div style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {[...paydays].sort((a, b) => new Date(a.date) - new Date(b.date)).map((p) => (
              <div key={p.id} style={{ display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px', background: 'var(--bg-glass)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <DollarSign size={16} style={{ color: 'var(--income)', flexShrink: 0 }} />
                <div style={{ flex: 1 }}>
                  <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{p.label}</p>
                  <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{p.date}</p>
                </div>
                <span className="tabular" style={{ fontWeight: 800, color: 'var(--income)', fontSize: '0.9rem' }}>
                  +${p.amount.toFixed(2)}
                </span>
                <button onClick={() => onDeletePayday(p.id)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.2s' }}
                  onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--expense)')}
                  onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                  aria-label="Delete payday">
                  <Trash2 size={14} />
                </button>
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Add Payday Modal */}
      {showModal && (
        <div className="modal-backdrop" onClick={() => setShowModal(false)}>
          <div className="modal-box" onClick={(e) => e.stopPropagation()}>
            <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
              <h3 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)' }}>
                💰 Log Payday — {selectedDay && format(selectedDay, 'MMM d, yyyy')}
              </h3>
              <button onClick={() => setShowModal(false)} style={{ background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)', display: 'flex', padding: 4 }}>
                <X size={18} />
              </button>
            </div>

            {/* Existing paydays on this day */}
            {selectedPaydays.length > 0 && (
              <div style={{ marginBottom: '16px', padding: '12px', background: 'var(--bg-glass)', borderRadius: 10, border: '1px solid var(--border)' }}>
                <p style={{ margin: '0 0 8px', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)' }}>Paydays on this day:</p>
                {selectedPaydays.map((p) => (
                  <div key={p.id} style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.85rem', padding: '4px 0' }}>
                    <span style={{ color: 'var(--text-primary)' }}>{p.label}</span>
                    <span className="tabular" style={{ color: 'var(--income)', fontWeight: 700 }}>+${p.amount.toFixed(2)}</span>
                  </div>
                ))}
              </div>
            )}

            <form onSubmit={handleAddPayday}>
              <div style={{ display: 'flex', flexDirection: 'column', gap: '12px' }}>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Label</label>
                  <input id="payday-label" type="text" className="form-input" placeholder="e.g. Salary, Freelance" value={paydayForm.label} onChange={(e) => setPaydayForm((f) => ({ ...f, label: e.target.value }))} />
                </div>
                <div>
                  <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Amount ($)</label>
                  <input id="payday-amount" type="number" step="0.01" min="0" className="form-input tabular" placeholder="0.00" value={paydayForm.amount} onChange={(e) => setPaydayForm((f) => ({ ...f, amount: e.target.value }))} autoFocus />
                </div>
              </div>
              {formError && <p style={{ color: 'var(--expense)', fontSize: '0.8rem', margin: '8px 0 0' }}>⚠️ {formError}</p>}
              <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
                <button id="add-payday-btn" type="submit" className="btn-primary" style={{ flex: 1 }}>
                  <Plus size={16} />
                  Add Payday
                </button>
                <button type="button" className="btn-ghost" onClick={() => setShowModal(false)}>
                  Cancel
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  );
}
