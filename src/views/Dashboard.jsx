import React, { useMemo } from 'react';
import {
  TrendingDown, TrendingUp, RotateCcw, Clock, ArrowUpRight, Wallet,
} from 'lucide-react';
import { format, subDays } from 'date-fns';
import {
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';

const CATEGORY_COLORS = {
  Housing: '#6c63ff',
  Food: '#f59e0b',
  Transport: '#06b6d4',
  Health: '#10b981',
  Entertainment: '#a855f7',
  Other: '#94a3b8',
};

const CATEGORY_EMOJI = {
  Housing: '🏠', Food: '🍔', Transport: '🚗', Health: '💊', Entertainment: '🎬', Other: '📦',
};

function MetricCard({ icon: Icon, iconColor, iconBg, label, value, subtitle, trend }) {
  return (
    <div className="metric-card stagger-children">
      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '4px' }}>
        <div style={{
          width: 42, height: 42, borderRadius: 12,
          background: iconBg, display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}>
          <Icon size={20} style={{ color: iconColor }} />
        </div>
        {trend !== undefined && (
          <span style={{
            fontSize: '0.72rem', fontWeight: 600, padding: '3px 8px', borderRadius: 999,
            background: trend >= 0 ? 'var(--income-bg)' : 'var(--expense-bg)',
            color: trend >= 0 ? 'var(--income)' : 'var(--expense)',
          }}>
            {trend >= 0 ? '↑' : '↓'} {Math.abs(trend).toFixed(1)}%
          </span>
        )}
      </div>
      <p style={{ margin: '12px 0 4px', fontSize: '0.75rem', color: 'var(--text-secondary)', fontWeight: 500 }}>{label}</p>
      <p className="tabular" style={{ margin: 0, fontSize: '1.6rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
        {value}
      </p>
      {subtitle && <p style={{ margin: '4px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>{subtitle}</p>}
    </div>
  );
}

const CustomTooltip = ({ active, payload, label }) => {
  if (active && payload && payload.length) {
    return (
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 10, padding: '10px 14px', fontSize: '0.8rem',
      }}>
        <p style={{ margin: 0, color: 'var(--text-secondary)', marginBottom: 4 }}>{label}</p>
        <p className="tabular" style={{ margin: 0, fontWeight: 700, color: payload[0].value >= 0 ? 'var(--income)' : 'var(--expense)' }}>
          ${Math.abs(payload[0].value).toFixed(2)}
        </p>
      </div>
    );
  }
  return null;
};

export default function Dashboard({ expenses, refunds, paydays, search }) {
  const totalSpent = useMemo(
    () => expenses.reduce((s, e) => s + e.amount, 0),
    [expenses]
  );
  const pendingRefunds = useMemo(
    () => refunds.filter((r) => r.status === 'pending').reduce((s, r) => s + r.amount, 0),
    [refunds]
  );
  const upcomingPayday = useMemo(() => {
    const future = paydays.filter((p) => new Date(p.date) >= new Date()).sort((a, b) => new Date(a.date) - new Date(b.date));
    return future[0];
  }, [paydays]);

  // 30-day sparkline data
  const chartData = useMemo(() => {
    return Array.from({ length: 30 }, (_, i) => {
      const date = subDays(new Date(), 29 - i);
      const dateStr = format(date, 'yyyy-MM-dd');
      const dayExpenses = expenses.filter((e) => e.date === dateStr).reduce((s, e) => s + e.amount, 0);
      const dayPaydays = paydays.filter((p) => p.date === dateStr).reduce((s, p) => s + p.amount, 0);
      const dayRefunds = refunds.filter((r) => r.date === dateStr && r.status === 'fulfilled').reduce((s, r) => s + r.amount, 0);
      return {
        date: format(date, 'MMM d'),
        balance: dayPaydays + dayRefunds - dayExpenses,
      };
    });
  }, [expenses, refunds, paydays]);

  // Recent transactions (all types, sorted by date)
  const recent = useMemo(() => {
    const all = [
      ...expenses.map((e) => ({ ...e, type: 'expense' })),
      ...refunds.map((r) => ({ ...r, type: 'refund' })),
      ...paydays.map((p) => ({ ...p, type: 'income' })),
    ]
      .sort((a, b) => new Date(b.date) - new Date(a.date))
      .filter((t) => {
        if (!search) return true;
        const q = search.toLowerCase();
        return (
          (t.description || t.vendor || t.label || '').toLowerCase().includes(q) ||
          (t.category || '').toLowerCase().includes(q)
        );
      })
      .slice(0, 8);
    return all;
  }, [expenses, refunds, paydays, search]);

  // Spending by category
  const byCategory = useMemo(() => {
    const map = {};
    expenses.forEach((e) => {
      map[e.category] = (map[e.category] || 0) + e.amount;
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]);
  }, [expenses]);

  return (
    <div className="animate-fade-in" style={{ maxWidth: 1000, margin: '0 auto', padding: '24px' }}>
      <div style={{ marginBottom: '28px' }}>
        <h2 style={{ margin: 0, fontSize: '1.5rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.03em' }}>
          Dashboard
        </h2>
        <p style={{ margin: '4px 0 0', color: 'var(--text-secondary)', fontSize: '0.875rem' }}>
          {format(new Date(), 'EEEE, MMMM d, yyyy')}
        </p>
      </div>

      {/* Metric Cards */}
      <div className="stagger-children" style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(220px, 1fr))', gap: '16px', marginBottom: '28px' }}>
        <MetricCard
          icon={TrendingDown}
          iconColor="var(--expense)"
          iconBg="var(--expense-bg)"
          label="Total Spent This Month"
          value={`$${totalSpent.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle={`${expenses.length} transaction${expenses.length !== 1 ? 's' : ''}`}
        />
        <MetricCard
          icon={Wallet}
          iconColor="var(--income)"
          iconBg="var(--income-bg)"
          label="Upcoming Payday"
          value={upcomingPayday ? `$${upcomingPayday.amount.toLocaleString('en-US', { minimumFractionDigits: 2 })}` : '—'}
          subtitle={upcomingPayday ? format(new Date(upcomingPayday.date), 'MMM d') : 'No paydays set'}
        />
        <MetricCard
          icon={RotateCcw}
          iconColor="var(--refund)"
          iconBg="var(--refund-bg)"
          label="Pending Refunds"
          value={`$${pendingRefunds.toLocaleString('en-US', { minimumFractionDigits: 2 })}`}
          subtitle={`${refunds.filter(r => r.status === 'pending').length} pending`}
        />
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: '1fr auto', gap: '20px', alignItems: 'start' }}>
        {/* Balance Chart */}
        <div className="glass-card" style={{ padding: '24px' }}>
          <h3 style={{ margin: '0 0 20px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            30-Day Balance Trend
          </h3>
          <div style={{ height: 180 }}>
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={chartData} margin={{ top: 4, right: 4, bottom: 0, left: 0 }}>
                <defs>
                  <linearGradient id="balanceGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="var(--accent)" stopOpacity={0.3} />
                    <stop offset="95%" stopColor="var(--accent)" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <XAxis dataKey="date" tick={{ fontSize: 10, fill: 'var(--text-secondary)' }} axisLine={false} tickLine={false} interval={6} />
                <YAxis hide />
                <Tooltip content={<CustomTooltip />} />
                <Area type="monotone" dataKey="balance" stroke="var(--accent)" strokeWidth={2} fill="url(#balanceGrad)" dot={false} />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>

        {/* Category Breakdown */}
        {byCategory.length > 0 && (
          <div className="glass-card" style={{ padding: '24px', minWidth: '180px' }}>
            <h3 style={{ margin: '0 0 16px', fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
              By Category
            </h3>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
              {byCategory.map(([cat, amt]) => (
                <div key={cat} style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                  <span style={{ fontSize: '1.1rem' }}>{CATEGORY_EMOJI[cat] || '📦'}</span>
                  <div style={{ flex: 1 }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '3px' }}>
                      <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{cat}</span>
                      <span className="tabular" style={{ fontSize: '0.75rem', fontWeight: 600, color: 'var(--text-primary)' }}>
                        ${amt.toFixed(0)}
                      </span>
                    </div>
                    <div style={{ height: 4, background: 'var(--border)', borderRadius: 999 }}>
                      <div style={{
                        height: '100%',
                        width: `${(amt / totalSpent) * 100}%`,
                        background: CATEGORY_COLORS[cat] || 'var(--accent)',
                        borderRadius: 999,
                        transition: 'width 0.5s ease',
                      }} />
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Recent Transactions */}
      <div className="glass-card" style={{ marginTop: '20px', padding: '24px' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '16px' }}>
          <h3 style={{ margin: 0, fontSize: '0.95rem', fontWeight: 700, color: 'var(--text-primary)' }}>
            Recent Transactions
          </h3>
          <span style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {recent.length} shown
          </span>
        </div>

        {recent.length === 0 ? (
          <div style={{ textAlign: 'center', padding: '32px', color: 'var(--text-secondary)' }}>
            <Clock size={32} style={{ margin: '0 auto 12px', opacity: 0.4 }} />
            <p style={{ margin: 0, fontSize: '0.875rem' }}>
              {search ? 'No transactions match your search.' : 'No transactions yet. Start by adding expenses or paydays!'}
            </p>
          </div>
        ) : (
          <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '8px' }}>
            {recent.map((tx, i) => {
              const isIncome = tx.type === 'income';
              const isRefund = tx.type === 'refund';
              const label = tx.description || tx.vendor || tx.label || 'Transaction';
              const color = isIncome ? 'var(--income)' : isRefund ? 'var(--refund)' : 'var(--expense)';
              const sign = isIncome ? '+' : isRefund ? '±' : '-';
              const emoji = isIncome ? '💰' : isRefund ? '↩️' : CATEGORY_EMOJI[tx.category] || '💳';

              return (
                <div key={`${tx.type}-${tx.id || i}`} style={{
                  display: 'flex', alignItems: 'center', gap: '12px', padding: '10px 12px',
                  background: 'var(--bg-glass)', borderRadius: 10, border: '1px solid var(--border)',
                  transition: 'background 0.2s',
                }}
                  onMouseEnter={(e) => e.currentTarget.style.background = 'var(--bg-glass-hover)'}
                  onMouseLeave={(e) => e.currentTarget.style.background = 'var(--bg-glass)'}
                >
                  <span style={{ fontSize: '1.1rem' }}>{emoji}</span>
                  <div style={{ flex: 1, minWidth: 0 }}>
                    <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                      {label}
                    </p>
                    <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
                      {tx.category || (isIncome ? 'Payday' : 'Refund')} • {tx.date}
                    </p>
                  </div>
                  <p className="tabular" style={{ margin: 0, fontWeight: 700, fontSize: '0.9rem', color, flexShrink: 0 }}>
                    {sign}${tx.amount.toFixed(2)}
                  </p>
                </div>
              );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
