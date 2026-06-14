import React, { useState, useRef, useEffect } from 'react';
import { Sun, Moon, LogOut, ChevronDown, Settings } from 'lucide-react';

export default function ProfileMenu({ user, onLogout, theme, onToggleTheme, onOpenSettings, settings }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener('mousedown', handler);
    return () => document.removeEventListener('mousedown', handler);
  }, []);

  // Use customised display name from settings, fall back to user object
  const displayName =
    settings?.displayName?.trim() ||
    user?.displayName?.split(' ')[0] ||
    (user?.isGuest ? 'Guest' : user?.email?.split('@')[0]) ||
    'Guest';

  const initials = (settings?.displayName || user?.displayName || 'G')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  const avatarColor = settings?.avatarColor || 'var(--accent)';

  return (
    <div ref={ref} style={{ position: 'relative' }}>
      {/* ── Trigger button ── */}
      <button
        id="profile-menu-btn"
        onClick={() => setOpen((o) => !o)}
        style={{
          display: 'flex',
          alignItems: 'center',
          gap: '8px',
          padding: '6px 10px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          borderRadius: '50px',
          cursor: 'pointer',
          color: 'var(--text-primary)',
          transition: 'all 0.2s ease',
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = 'var(--border-active)')}
        onMouseLeave={(e) => (e.currentTarget.style.borderColor = 'var(--border)')}
        aria-label="Profile menu"
        aria-expanded={open}
        aria-haspopup="menu"
      >
        {/* Avatar */}
        {user?.photoURL ? (
          <img
            src={user.photoURL}
            alt={displayName}
            style={{ width: 28, height: 28, borderRadius: '50%', objectFit: 'cover' }}
          />
        ) : (
          <div
            style={{
              width: 28,
              height: 28,
              borderRadius: '50%',
              background: avatarColor,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              fontSize: '0.7rem',
              fontWeight: 800,
              color: '#fff',
              letterSpacing: '0.02em',
              flexShrink: 0,
              transition: 'background 0.3s ease',
            }}
          >
            {initials}
          </div>
        )}

        {/* Name */}
        <span style={{
          fontSize: '0.8rem',
          fontWeight: 600,
          maxWidth: '90px',
          overflow: 'hidden',
          textOverflow: 'ellipsis',
          whiteSpace: 'nowrap',
        }}>
          {displayName}
        </span>

        <ChevronDown
          size={14}
          style={{
            color: 'var(--text-secondary)',
            transform: open ? 'rotate(180deg)' : 'none',
            transition: 'transform 0.2s',
            flexShrink: 0,
          }}
        />
      </button>

      {/* ── Dropdown ── */}
      {open && (
        <div className="profile-dropdown" role="menu">
          {/* User info header */}
          <div style={{
            display: 'flex',
            alignItems: 'center',
            gap: '10px',
            padding: '12px 12px 14px',
            borderBottom: '1px solid var(--border)',
            marginBottom: '6px',
          }}>
            {user?.photoURL ? (
              <img
                src={user.photoURL}
                alt={displayName}
                style={{ width: 38, height: 38, borderRadius: '50%', objectFit: 'cover', flexShrink: 0 }}
              />
            ) : (
              <div style={{
                width: 38, height: 38, borderRadius: '50%', background: avatarColor,
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.85rem', fontWeight: 800, color: '#fff', flexShrink: 0,
                transition: 'background 0.3s ease',
              }}>
                {initials}
              </div>
            )}
            <div style={{ minWidth: 0 }}>
              <p style={{ fontSize: '0.875rem', fontWeight: 700, color: 'var(--text-primary)', margin: 0, whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>
                {settings?.displayName?.trim() || user?.displayName || (user?.isGuest ? 'Guest User' : 'User')}
              </p>
              <p style={{ fontSize: '0.72rem', color: 'var(--text-secondary)', margin: '2px 0 0' }}>
                {user?.isGuest ? 'Temporary session' : user?.email || 'demo@expensify.app'}
              </p>
            </div>
          </div>

          {/* Settings */}
          <button
            id="open-settings-btn"
            className="dropdown-item"
            role="menuitem"
            onClick={() => { onOpenSettings(); setOpen(false); }}
          >
            <Settings size={16} />
            Settings
          </button>

          {/* Theme quick toggle */}
          <button
            id="theme-toggle-btn"
            className="dropdown-item"
            role="menuitem"
            onClick={() => { onToggleTheme(); setOpen(false); }}
          >
            {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
            {theme === 'dark' ? 'Light Mode' : 'Dark Mode'}
          </button>

          {/* Divider */}
          <div style={{ height: '1px', background: 'var(--border)', margin: '6px 0' }} />

          {/* Logout */}
          <button
            id="logout-btn"
            className="dropdown-item"
            role="menuitem"
            onClick={() => { onLogout(); setOpen(false); }}
            style={{ color: 'var(--expense)' }}
          >
            <LogOut size={16} />
            {user?.isGuest ? 'Exit Guest Mode' : 'Sign Out'}
          </button>
        </div>
      )}
    </div>
  );
}
