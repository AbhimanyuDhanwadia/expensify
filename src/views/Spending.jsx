import React, { useState, useMemo } from 'react';
import { Plus, Trash2, Filter, ChevronDown } from 'lucide-react';
import { format } from 'date-fns';

const CATEGORIES = ['Housing', 'Food', 'Transport', 'Health', 'Entertainment', 'Other'];

const CATEGORY_COLORS = {
  Housing: '#6c63ff', Food: '#f59e0b', Transport: '#06b6d4',
  Health: '#10b981', Entertainment: '#a855f7', Other: '#94a3b8',
};

const CATEGORY_EMOJI = {
  Housing: '🏠', Food: '🍔', Transport: '🚗', Health: '💊', Entertainment: '🎬', Other: '📦',
};

const today = () => format(new Date(), 'yyyy-MM-dd');

export default function Spending({ expenses, onAdd, onDelete, search }) {
  const [form, setForm] = useState({
    description: '', amount: '', category: 'Food', date: today(),
  });
  const [filterCat, setFilterCat] = useState('All');
  const [sortBy, setSortBy] = useState('date-desc');
  const [error, setError] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!form.description.trim()) return setError('Please add a description.');
    const amt = parseFloat(form.amount);
    if (!amt || amt <= 0) return setError('Please enter a valid amount.');
    setError('');
    onAdd({
      id: Date.now(),
      description: form.description.trim(),
      amount: amt,
      category: form.category,
      date: form.date,
    });
    setForm((f) => ({ ...f, description: '', amount: '' }));
  };

  const filtered = useMemo(() => {
    let list = [...expenses];
    if (filterCat !== 'All') list = list.filter((e) => e.category === filterCat);
    if (search) {
      const q = search.toLowerCase();
      list = list.filter((e) =>
        e.description.toLowerCase().includes(q) || e.category.toLowerCase().includes(q)
      );
    }
    switch (sortBy) {
      case 'date-asc': list.sort((a, b) => new Date(a.date) - new Date(b.date)); break;
      case 'amount-desc': list.sort((a, b) => b.amount - a.amount); break;
      case 'amount-asc': list.sort((a, b) => a.amount - b.amount); break;
      default: list.sort((a, b) => new Date(b.date) - new Date(a.date));
    }
    return list;
  }, [expenses, filterCat, search, sortBy]);

  const totalFiltered = filtered.reduce((s, e) => s + e.amount, 0);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 800, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '24px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Spending
        </h2>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          Track and categorize your expenses
        </p>
      </div>

      {/* Add Expense Form */}
      <div className="glass-card" style={{ padding: '24px', marginBottom: '20px' }}>
        <h3 style={{ margin: '0 0 18px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)', display: 'flex', alignItems: 'center', gap: 8 }}>
          <Plus size={18} style={{ color: 'var(--accent)' }} />
          Add Expense
        </h3>
        <form onSubmit={handleSubmit}>
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: '12px', marginBottom: '12px' }}>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Description
              </label>
              <input
                id="expense-description"
                type="text"
                className="form-input"
                placeholder="e.g. Groceries at Whole Foods"
                value={form.description}
                onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Amount ($)
              </label>
              <input
                id="expense-amount"
                type="number"
                step="0.01"
                min="0"
                className="form-input tabular"
                placeholder="0.00"
                value={form.amount}
                onChange={(e) => setForm((f) => ({ ...f, amount: e.target.value }))}
              />
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Category
              </label>
              <select
                id="expense-category"
                className="form-input"
                value={form.category}
                onChange={(e) => setForm((f) => ({ ...f, category: e.target.value }))}
              >
                {CATEGORIES.map((c) => <option key={c}>{c}</option>)}
              </select>
            </div>
            <div>
              <label style={{ display: 'block', fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-secondary)', marginBottom: '6px' }}>
                Date
              </label>
              <input
                id="expense-date"
                type="date"
                className="form-input"
                value={form.date}
                onChange={(e) => setForm((f) => ({ ...f, date: e.target.value }))}
              />
            </div>
          </div>

          {error && (
            <p style={{ color: 'var(--expense)', fontSize: '0.8rem', margin: '0 0 12px', display: 'flex', alignItems: 'center', gap: 6 }}>
              ⚠️ {error}
            </p>
          )}

          <button id="add-expense-btn" type="submit" className="btn-primary">
            <Plus size={16} />
            Add Expense
          </button>
        </form>
      </div>

      {/* Filters + Summary */}
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '12px', flexWrap: 'wrap', gap: '8px' }}>
        <div style={{ display: 'flex', gap: '6px', flexWrap: 'wrap' }}>
          {['All', ...CATEGORIES].map((cat) => (
            <button
              key={cat}
              onClick={() => setFilterCat(cat)}
              style={{
                padding: '5px 12px',
                borderRadius: 999,
                border: `1px solid ${filterCat === cat ? 'var(--accent)' : 'var(--border)'}`,
                background: filterCat === cat ? 'var(--accent-glow)' : 'transparent',
                color: filterCat === cat ? 'var(--accent)' : 'var(--text-secondary)',
                fontSize: '0.75rem',
                fontWeight: 600,
                cursor: 'pointer',
                transition: 'all 0.2s',
              }}
            >
              {cat !== 'All' && CATEGORY_EMOJI[cat]} {cat}
            </button>
          ))}
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
          <span className="tabular" style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', fontWeight: 600 }}>
            Total: <span style={{ color: 'var(--expense)' }}>${totalFiltered.toFixed(2)}</span>
          </span>
          <select
            id="expense-sort"
            className="form-input"
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            style={{ width: 'auto', padding: '5px 10px', fontSize: '0.75rem' }}
          >
            <option value="date-desc">Newest First</option>
            <option value="date-asc">Oldest First</option>
            <option value="amount-desc">Highest Amount</option>
            <option value="amount-asc">Lowest Amount</option>
          </select>
        </div>
      </div>

      {/* Expense List */}
      {filtered.length === 0 ? (
        <div className="glass-card" style={{ padding: '40px', textAlign: 'center', color: 'var(--text-secondary)' }}>
          <p style={{ fontSize: '2rem', margin: '0 0 8px' }}>💳</p>
          <p style={{ margin: 0, fontSize: '0.875rem' }}>
            {search ? 'No expenses match your search.' : 'No expenses yet. Add one above!'}
          </p>
        </div>
      ) : (
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
          {filtered.map((expense) => (
            <div
              key={expense.id}
              className="glass-card"
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px' }}
            >
              <div style={{
                width: 40, height: 40, borderRadius: 10, flexShrink: 0,
                background: `${CATEGORY_COLORS[expense.category] || '#94a3b8'}22`,
                border: `1px solid ${CATEGORY_COLORS[expense.category] || '#94a3b8'}33`,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '1.1rem',
              }}>
                {CATEGORY_EMOJI[expense.category] || '📦'}
              </div>
              <div style={{ flex: 1, minWidth: 0 }}>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.875rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                  {expense.description}
                </p>
                <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                  {expense.category} • {expense.date}
                </p>
              </div>
              <span
                className="badge badge-expense"
                style={{ color: CATEGORY_COLORS[expense.category] || 'var(--text-secondary)', background: `${CATEGORY_COLORS[expense.category] || '#94a3b8'}22` }}
              >
                {expense.category}
              </span>
              <p className="tabular" style={{ margin: 0, fontWeight: 800, fontSize: '0.95rem', color: 'var(--expense)', flexShrink: 0 }}>
                -${expense.amount.toFixed(2)}
              </p>
              <button
                id={`delete-expense-${expense.id}`}
                onClick={() => onDelete(expense.id)}
                style={{
                  background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-secondary)',
                  padding: 4, borderRadius: 6, display: 'flex', transition: 'color 0.2s',
                  flexShrink: 0,
                }}
                onMouseEnter={(e) => (e.currentTarget.style.color = 'var(--expense)')}
                onMouseLeave={(e) => (e.currentTarget.style.color = 'var(--text-secondary)')}
                aria-label="Delete expense"
              >
                <Trash2 size={16} />
              </button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
