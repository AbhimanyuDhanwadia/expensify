import React from 'react';
import {
  LayoutDashboard,
  CreditCard,
  RotateCcw,
  Calendar,
  Search,
  Wallet,
  TrendingDown,
  TrendingUp,
  X,
} from 'lucide-react';

const NAV_ITEMS = [
  { id: 'dashboard', label: 'Dashboard', icon: LayoutDashboard },
  { id: 'spending', label: 'Spending', icon: CreditCard },
  { id: 'refunds', label: 'Refunds', icon: RotateCcw },
  { id: 'calendar', label: 'Calendar', icon: Calendar },
];

export default function Sidebar({ view, onNavigate, balance, search, onSearch }) {
  const isPositive = balance >= 0;

  return (
    <aside className="sidebar animate-slide-left">
      {/* Logo */}
      <div style={{ padding: '24px 20px 16px', borderBottom: '1px solid var(--border)' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div
            style={{
              width: 36,
              height: 36,
              borderRadius: 10,
              background: 'var(--accent)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 0 20px var(--accent-glow)',
            }}
          >
            <Wallet size={18} color="#fff" />
          </div>
          <div>
            <h1 style={{ margin: 0, fontSize: '1rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Expensify
            </h1>
            <p style={{ margin: 0, fontSize: '0.65rem', color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
              Finance Tracker
            </p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div style={{ padding: '16px 16px 8px' }}>
        <div style={{ position: 'relative' }}>
          <Search
            size={14}
            style={{
              position: 'absolute',
              left: '12px',
              top: '50%',
              transform: 'translateY(-50%)',
              color: 'var(--text-secondary)',
              pointerEvents: 'none',
            }}
          />
          <input
            id="global-search"
            type="text"
            className="form-input"
            placeholder="Search transactions…"
            value={search}
            onChange={(e) => onSearch(e.target.value)}
            style={{ paddingLeft: '34px', paddingRight: search ? '34px' : '14px' }}
          />
          {search && (
            <button
              onClick={() => onSearch('')}
              style={{
                position: 'absolute',
                right: '10px',
                top: '50%',
                transform: 'translateY(-50%)',
                background: 'none',
                border: 'none',
                cursor: 'pointer',
                color: 'var(--text-secondary)',
                padding: 0,
                display: 'flex',
              }}
            >
              <X size={14} />
            </button>
          )}
        </div>
      </div>

      {/* Navigation */}
      <nav style={{ padding: '8px 12px', flex: 1 }}>
        <p style={{
          fontSize: '0.65rem',
          fontWeight: 700,
          color: 'var(--text-muted)',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          padding: '8px 4px 4px',
          margin: 0,
        }}>
          Navigation
        </p>
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '2px' }}>
          {NAV_ITEMS.map(({ id, label, icon: Icon }) => (
            <button
              key={id}
              id={`nav-${id}`}
              className={`nav-item ${view === id ? 'active' : ''}`}
              onClick={() => onNavigate(id)}
            >
              <Icon size={16} />
              {label}
              {view === id && (
                <div style={{
                  marginLeft: 'auto',
                  width: 6,
                  height: 6,
                  borderRadius: '50%',
                  background: 'var(--accent)',
                }} />
              )}
            </button>
          ))}
        </div>
      </nav>

      {/* Balance Widget */}
      <div style={{
        margin: '12px',
        padding: '16px',
        background: isPositive
          ? 'rgba(52, 211, 153, 0.08)'
          : 'rgba(248, 113, 113, 0.08)',
        border: `1px solid ${isPositive ? 'rgba(52,211,153,0.2)' : 'rgba(248,113,113,0.2)'}`,
        borderRadius: '12px',
        transition: 'all 0.3s ease',
      }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '8px' }}>
          {isPositive
            ? <TrendingUp size={14} style={{ color: 'var(--income)' }} />
            : <TrendingDown size={14} style={{ color: 'var(--expense)' }} />}
          <span style={{ fontSize: '0.7rem', fontWeight: 600, color: 'var(--text-secondary)', textTransform: 'uppercase', letterSpacing: '0.08em' }}>
            Current Balance
          </span>
        </div>
        <p
          className="tabular"
          style={{
            margin: 0,
            fontSize: '1.5rem',
            fontWeight: 800,
            color: isPositive ? 'var(--income)' : 'var(--expense)',
            letterSpacing: '-0.03em',
          }}
        >
          {isPositive ? '+' : ''}${Math.abs(balance).toLocaleString('en-US', { minimumFractionDigits: 2, maximumFractionDigits: 2 })}
        </p>
      </div>
    </aside>
  );
}
