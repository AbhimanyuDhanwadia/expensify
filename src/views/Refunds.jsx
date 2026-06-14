import React, { useState, useMemo } from 'react';
import { Plus, CheckCircle, Clock, Trash2 } from 'lucide-react';
import { format } from 'date-fns';

const today = () => format(new Date(), 'yyyy-MM-dd');

export default function Refunds({ refunds, onAdd, onDelete, onToggle, search }) {
  const [form, setForm] = useState({ vendor: '', amount: '', date: today(), notes: '' });
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.vendor.trim()) return setError('Please enter a vendor name.');
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return setError('Please enter a valid amount.');
    setError('');
    onAdd({
      id: Date.now(),
      vendor: form.vendor.trim(),
      amount: amt,
      date: form.date,
      notes: form.notes.trim(),
      status: 'pending',
    });
    setForm((f) => ({ ...f, vendor: '', amount: '', notes: '' }));
  };

  const filtered = useMemo(() => {
    if (!search) return refunds;
    const q = search.toLowerCase();
    return refunds.filter((r) =>
      r.vendor.toLowerCase().includes(q) || (r.notes || '').toLowerCase().includes(q)
    );
  }, [refunds, search]);

  const pending = filtered.filter((r) => r.status === 'pending');
  const fulfilled = filtered.filter((r) => r.status === 'fulfilled');
  const totalPending = pending.reduce((s, r) => s + r.amount, 0);
  const totalFulfilled = fulfilled.reduce((s, r) => s + r.amount, 0);

  const RefundItem = ({ refund }) => (
    <div
      className="glass-card"
      style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px' }}
    >
      <div style={{
        width: 40, height: 40, borderRadius: 10, flexShrink: 0,
        background: refund.status === 'fulfilled' ? 'var(--income-bg)' : 'var(--refund-bg)',
        border: `1px solid ${refund.status === 'fulfilled' ? 'rgba(52,211,153,0.25)' : 'rgba(251,191,36,0.25)'}`,
        display: 'flex', alignItems: 'center', justifyContent: 'center',
        fontSize: '1.1rem',
      }}>
        {refund.status === 'fulfilled' ? '✅' : '⏳'}
      </div>

      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
          {refund.vendor}
        </p>
        <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
          Expected by {refund.date}
          {refund.notes && <> • {refund.notes}</>}
        </p>
      </div>

      <span className={`badge ${refund.status === 'fulfilled' ? 'badge-fulfilled' : 'badge-pending'}`}>
        {refund.status === 'fulfilled' ? '✓ Received' : 'Pending'}
      </span>

      <p className="tabular" style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: refund.status === 'fulfilled' ? 'var(--income)' : 'var(--refund)', flexShrink: 0 }}>
        ${refund.amount.toFixed(2)}
      </p>

      <button
        id={`toggle-refund-${refund.id}`}
        onClick={() => onToggle(refund.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', padding: 4, borderRadius: 6, display: 'flex',
          color: refund.status === 'fulfilled' ? 'var(--income)' : 'var(--refund)',
          transition: 'opacity 0.2s',
          flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.opacity = '0.7')}
        onMouseLeave={(e) => (e.currentTarget.style.opacity = '1')}
        title={refund.status === 'fulfilled' ? 'Mark as pending' : 'Mark as received'}
        aria-label="Toggle refund status"
      >
        {refund.status === 'fulfilled' ? <Clock size={16} /> : <CheckCircle size={16} />}
      </button>

      <button
        id={`delete-refund-${refund.id}`}
        onClick={() => onDelete(refund.id)}
        style={{
          background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
          padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.2s', flexShrink: 0,
        }}
        onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--expense)')}
        onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
        aria-label="Delete refund"
      >
        <Trash2 size={16} />
      </button>
    </div>
  );

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Refunds
        </h2>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Track expected refunds and mark them as received
        </p>
      </div>

      {/* Summary row */}
      <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '20px' }}>
        <div className="glass-card" style={{ padding: '16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Awaiting</p>
          <p className="tabular" style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--refund)' }}>
            ${totalPending.toFixed(2)}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{pending.length} refunds pending</p>
        </div>
        <div className="glass-card" style={{ padding: '16px' }}>
          <p style={{ margin: '0 0 4px', fontSize: '0.72rem', color: 'var(--text-secondary)', fontWeight: 600, textTransform: 'uppercase', letterSpacing: '0.06em' }}>Received</p>
          <p className="tabular" style={{ margin: 0, fontSize: '1.3rem', fontWeight: 800, color: 'var(--income)' }}>
            ${totalFulfilled.toFixed(2)}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{fulfilled.length} refunds fulfilled</p>
        </div>
      </div>

      {/* Add Refund Form */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 18px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} style={{ color: 'var(--refund)' }} />
          Log Expected Refund
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Vendor / Source</label>
              <input id="refund-vendor" type="text" className="form-input" placeholder="e.g. Amazon, Insurance Co." value={form.vendor} onChange={(e) => setForm((f) => ({ ...f, vendor: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Expected Amount ($)</label>
              <input id="refund-amount" type="number" step="0.01" min="0" className="form-input tabular" placeholder="0.00" value={form.amount} onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Expected By</label>
              <input id="refund-date" type="date" className="form-input" value={form.date} onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))} />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>Notes (optional)</label>
              <input id="refund-notes" type="text" className="form-input" placeholder="e.g. Order #12345" value={form.notes} onChange={(e) => setForm((f) => ({ ...f, notes: e.target.value }))} />
            </div>
          </div>
          {error && <p style={{ color: 'var(--expense)', fontSize: '0.8rem', margin: '0 0 12px' }}>⚠️ {error}</p>}
          <button id="add-refund-btn" type="submit" className="btn-primary" style={{ background: 'var(--refund)', boxShadow: '0 4px 20px rgba(251,191,36,0.3)' }}>
            <Plus size={16} />
            Add Refund
          </button>
        </form>
      </div>

      {/* Pending Refunds */}
      {pending.length > 0 && (
        <>
          <h3 style={{ margin: '0 0 10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ⏳ Pending ({pending.length})
          </h3>
          <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '8px', marginBottom: '20px' }}>
            {pending.map((r) => <RefundItem key={r.id} refund={r} />)}
          </div>
        </>
      )}

      {/* Fulfilled Refunds */}
      {fulfilled.length > 0 && (
        <>
          <h3 style={{ margin: '0 0 10px', fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            ✅ Received ({fulfilled.length})
          </h3>
          <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {fulfilled.map((r) => <RefundItem key={r.id} refund={r} />)}
          </div>
        </>
      )}

      {filtered.length === 0 && (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>↩️</p>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            {search ? 'No refunds match your search.' : 'No refunds tracked yet. Add one above!'}
          </p>
        </div>
      )}
    </div>
  );
}
