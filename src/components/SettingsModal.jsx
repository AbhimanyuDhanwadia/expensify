import React, { useState, useEffect } from 'react';
import {
  X, User, Palette, Sliders, Database, Check, ChevronRight,
  Sun, Moon, Monitor, DollarSign, Calendar, Bell, Trash2,
  Download, Shield, Globe, Eye, EyeOff, RefreshCw,
} from 'lucide-react';

// ── Avatar colour palette ──────────────────────────────────
const AVATAR_COLORS = [
  { label: 'Violet',   value: '#6c63ff' },
  { label: 'Emerald',  value: '#10b981' },
  { label: 'Rose',     value: '#f43f5e' },
  { label: 'Amber',    value: '#f59e0b' },
  { label: 'Cyan',     value: '#06b6d4' },
  { label: 'Purple',   value: '#a855f7' },
  { label: 'Orange',   value: '#fb923c' },
  { label: 'Pink',     value: '#ec4899' },
];

const CURRENCIES = [
  { code: 'USD', symbol: '$', label: 'US Dollar' },
  { code: 'EUR', symbol: '€', label: 'Euro' },
  { code: 'GBP', symbol: '£', label: 'British Pound' },
  { code: 'JPY', symbol: '¥', label: 'Japanese Yen' },
  { code: 'INR', symbol: '₹', label: 'Indian Rupee' },
  { code: 'CAD', symbol: 'CA$', label: 'Canadian Dollar' },
  { code: 'AUD', symbol: 'A$', label: 'Australian Dollar' },
  { code: 'CHF', symbol: 'Fr', label: 'Swiss Franc' },
];

const DATE_FORMATS = [
  { value: 'yyyy-MM-dd', label: 'YYYY-MM-DD (ISO)' },
  { value: 'MM/dd/yyyy', label: 'MM/DD/YYYY (US)' },
  { value: 'dd/MM/yyyy', label: 'DD/MM/YYYY (EU)' },
  { value: 'dd MMM yyyy', label: 'DD Mon YYYY' },
];

const TABS = [
  { id: 'profile',    label: 'Profile',     icon: User },
  { id: 'appearance', label: 'Appearance',  icon: Palette },
  { id: 'general',   label: 'General',     icon: Sliders },
  { id: 'data',      label: 'Data',        icon: Database },
];

// ── Reusable toggle switch ─────────────────────────────────
function Toggle({ checked, onChange, id }) {
  return (
    <button
      id={id}
      role="switch"
      aria-checked={checked}
      onClick={() => onChange(!checked)}
      style={{
        width: 44,
        height: 24,
        borderRadius: 999,
        border: 'none',
        background: checked ? 'var(--accent)' : 'var(--border)',
        cursor: 'pointer',
        position: 'relative',
        transition: 'background 0.25s ease',
        flexShrink: 0,
        padding: 0,
      }}
    >
      <span style={{
        position: 'absolute',
        top: 3,
        left: checked ? 23 : 3,
        width: 18,
        height: 18,
        borderRadius: '50%',
        background: '#fff',
        transition: 'left 0.25s ease',
        boxShadow: '0 1px 4px rgba(0,0,0,0.25)',
      }} />
    </button>
  );
}

// ── Setting row wrapper ────────────────────────────────────
function SettingRow({ label, desc, children, danger }) {
  return (
    <div style={{
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'space-between',
      gap: '16px',
      padding: '14px 0',
      borderBottom: '1px solid var(--border)',
    }}>
      <div style={{ flex: 1, minWidth: 0 }}>
        <p style={{
          margin: 0,
          fontSize: '0.875rem',
          fontWeight: 600,
          color: danger ? 'var(--expense)' : 'var(--text-primary)',
        }}>
          {label}
        </p>
        {desc && (
          <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.4 }}>
            {desc}
          </p>
        )}
      </div>
      <div style={{ flexShrink: 0 }}>{children}</div>
    </div>
  );
}

// ── Section header ─────────────────────────────────────────
function SectionHeader({ children }) {
  return (
    <p style={{
      margin: '24px 0 4px',
      fontSize: '0.65rem',
      fontWeight: 700,
      color: 'var(--text-secondary)',
      textTransform: 'uppercase',
      letterSpacing: '0.12em',
    }}>
      {children}
    </p>
  );
}

// ── Main Settings Modal ─────────────────────────────────────
export default function SettingsModal({
  open,
  onClose,
  user,
  settings,
  onSave,
  theme,
  onToggleTheme,
  onClearData,
  onExport,
}) {
  const [tab, setTab] = useState('profile');
  const [draft, setDraft] = useState({ ...settings });
  const [saved, setSaved] = useState(false);
  const [confirmClear, setConfirmClear] = useState(false);

  // Sync draft when settings change externally
  useEffect(() => {
    setDraft({ ...settings });
  }, [settings]);

  if (!open) return null;

  const set = (key, val) => setDraft((d) => ({ ...d, [key]: val }));

  const handleSave = () => {
    onSave(draft);
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  const initials = (draft.displayName || user?.displayName || 'U')
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  // ── Tab: Profile ──────────────────────────────────────────
  const ProfileTab = () => (
    <div>
      {/* Avatar preview */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '20px', padding: '20px 0 8px' }}>
        <div style={{
          width: 72,
          height: 72,
          borderRadius: '50%',
          background: draft.avatarColor || 'var(--accent)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          fontSize: '1.5rem',
          fontWeight: 800,
          color: '#fff',
          flexShrink: 0,
          boxShadow: `0 0 0 4px ${(draft.avatarColor || '#6c63ff')}33`,
          transition: 'box-shadow 0.3s ease, background 0.3s ease',
        }}>
          {user?.photoURL
            ? <img src={user.photoURL} alt="" style={{ width: '100%', height: '100%', borderRadius: '50%', objectFit: 'cover' }} />
            : initials}
        </div>
        <div style={{ flex: 1, minWidth: 0 }}>
          <p style={{ margin: 0, fontWeight: 700, fontSize: '1rem', color: 'var(--text-primary)' }}>
            {draft.displayName || user?.displayName || 'User'}
          </p>
          <p style={{ margin: '2px 0 0', fontSize: '0.75rem', color: 'var(--text-secondary)' }}>
            {user?.isGuest ? 'Guest session' : user?.email || 'demo@expensify.app'}
          </p>
          {user?.isGuest && (
            <span className="badge badge-pending" style={{ marginTop: 6, display: 'inline-flex' }}>Temporary</span>
          )}
        </div>
      </div>

      <SectionHeader>Identity</SectionHeader>

      <SettingRow label="Display Name" desc="Shown in the sidebar and profile menu">
        <input
          id="settings-display-name"
          type="text"
          className="form-input"
          value={draft.displayName || ''}
          onChange={(e) => set('displayName', e.target.value)}
          placeholder="Your name"
          style={{ width: 180, textAlign: 'right' }}
        />
      </SettingRow>

      <SettingRow label="Avatar Initials" desc="Auto-generated from your display name" >
        <div style={{
          padding: '6px 12px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          fontSize: '0.85rem',
          fontWeight: 700,
          color: draft.avatarColor || 'var(--accent)',
          letterSpacing: '0.05em',
        }}>
          {initials}
        </div>
      </SettingRow>

      <SectionHeader>Avatar Colour</SectionHeader>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', paddingTop: '8px', paddingBottom: '16px' }}>
        {AVATAR_COLORS.map(({ label, value }) => (
          <button
            key={value}
            title={label}
            onClick={() => set('avatarColor', value)}
            style={{
              width: 32,
              height: 32,
              borderRadius: '50%',
              background: value,
              border: draft.avatarColor === value
                ? `3px solid var(--text-primary)`
                : '3px solid transparent',
              cursor: 'pointer',
              transition: 'transform 0.15s ease, border-color 0.15s ease',
              outline: 'none',
              boxShadow: draft.avatarColor === value ? `0 0 0 2px ${value}` : 'none',
            }}
            onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
            onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
            aria-label={`Set avatar colour to ${label}`}
          >
            {draft.avatarColor === value && (
              <Check size={14} color="#fff" style={{ pointerEvents: 'none' }} />
            )}
          </button>
        ))}
      </div>

      <SectionHeader>Account</SectionHeader>
      <SettingRow label="Account Type" desc={user?.isGuest ? 'Sign in to save your data permanently' : 'Authenticated via Google'}>
        <span className={`badge ${user?.isGuest ? 'badge-pending' : 'badge-fulfilled'}`}>
          {user?.isGuest ? 'Guest' : 'Google'}
        </span>
      </SettingRow>
    </div>
  );

  // ── Tab: Appearance ───────────────────────────────────────
  const AppearanceTab = () => (
    <div>
      <SectionHeader>Theme</SectionHeader>

      {/* Theme selector cards */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gap: '10px', padding: '12px 0' }}>
        {[
          { id: 'dark',   icon: Moon,    label: 'Dark' },
          { id: 'light',  icon: Sun,     label: 'Light' },
          { id: 'system', icon: Monitor, label: 'System' },
        ].map(({ id, icon: Icon, label }) => {
          const active = draft.themeMode === id;
          return (
            <button
              key={id}
              id={`settings-theme-${id}`}
              onClick={() => {
                set('themeMode', id);
                if (id !== 'system') {
                  // Apply immediately
                  if ((id === 'dark') !== (theme === 'dark')) onToggleTheme();
                }
              }}
              style={{
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                gap: '8px',
                padding: '16px 12px',
                borderRadius: 12,
                border: `2px solid ${active ? 'var(--accent)' : 'var(--border)'}`,
                background: active ? 'var(--accent-glow)' : 'var(--bg-glass)',
                cursor: 'pointer',
                transition: 'all 0.2s ease',
                fontFamily: 'inherit',
              }}
            >
              <Icon size={22} style={{ color: active ? 'var(--accent)' : 'var(--text-secondary)' }} />
              <span style={{ fontSize: '0.78rem', fontWeight: 600, color: active ? 'var(--accent)' : 'var(--text-secondary)' }}>
                {label}
              </span>
            </button>
          );
        })}
      </div>

      <SectionHeader>Accent Colour</SectionHeader>
      <div style={{ display: 'flex', gap: '8px', flexWrap: 'wrap', padding: '10px 0 16px' }}>
        {[
          { label: 'Violet',  value: '#6c63ff' },
          { label: 'Blue',    value: '#3b82f6' },
          { label: 'Emerald', value: '#10b981' },
          { label: 'Rose',    value: '#f43f5e' },
          { label: 'Amber',   value: '#f59e0b' },
          { label: 'Purple',  value: '#a855f7' },
          { label: 'Cyan',    value: '#06b6d4' },
          { label: 'Orange',  value: '#fb923c' },
        ].map(({ label, value }) => {
          const active = draft.accentColor === value;
          return (
            <button
              key={value}
              title={label}
              onClick={() => set('accentColor', value)}
              style={{
                width: 32,
                height: 32,
                borderRadius: '50%',
                background: value,
                border: active ? '3px solid var(--text-primary)' : '3px solid transparent',
                cursor: 'pointer',
                transition: 'transform 0.15s ease',
                outline: 'none',
                boxShadow: active ? `0 0 0 2px ${value}` : 'none',
              }}
              onMouseEnter={(e) => (e.currentTarget.style.transform = 'scale(1.15)')}
              onMouseLeave={(e) => (e.currentTarget.style.transform = 'scale(1)')}
              aria-label={`Set accent to ${label}`}
            >
              {active && <Check size={14} color="#fff" style={{ pointerEvents: 'none' }} />}
            </button>
          );
        })}
      </div>

      <SectionHeader>Interface</SectionHeader>
      <SettingRow label="Compact Mode" desc="Reduce padding for denser layouts">
        <Toggle id="settings-compact" checked={draft.compactMode || false} onChange={(v) => set('compactMode', v)} />
      </SettingRow>
      <SettingRow label="Animations" desc="Smooth micro-animations and transitions">
        <Toggle id="settings-animations" checked={draft.animations !== false} onChange={(v) => set('animations', v)} />
      </SettingRow>
      <SettingRow label="Liquid Background" desc="Animated ambient blob background">
        <Toggle id="settings-liquid-bg" checked={draft.liquidBg !== false} onChange={(v) => set('liquidBg', v)} />
      </SettingRow>
    </div>
  );

  // ── Tab: General ──────────────────────────────────────────
  const GeneralTab = () => (
    <div>
      <SectionHeader>Regional</SectionHeader>

      <SettingRow label="Currency" desc="Used for displaying all monetary values">
        <select
          id="settings-currency"
          className="form-input"
          value={draft.currency || 'USD'}
          onChange={(e) => set('currency', e.target.value)}
          style={{ width: 170 }}
        >
          {CURRENCIES.map(({ code, symbol, label }) => (
            <option key={code} value={code}>{symbol} {label}</option>
          ))}
        </select>
      </SettingRow>

      <SettingRow label="Date Format" desc="How dates appear across the app">
        <select
          id="settings-date-format"
          className="form-input"
          value={draft.dateFormat || 'yyyy-MM-dd'}
          onChange={(e) => set('dateFormat', e.target.value)}
          style={{ width: 170 }}
        >
          {DATE_FORMATS.map(({ value, label }) => (
            <option key={value} value={value}>{label}</option>
          ))}
        </select>
      </SettingRow>

      <SectionHeader>Notifications</SectionHeader>
      <SettingRow label="Refund Reminders" desc="Alert when expected refund date passes">
        <Toggle id="settings-notif-refunds" checked={draft.notifRefunds || false} onChange={(v) => set('notifRefunds', v)} />
      </SettingRow>
      <SettingRow label="Payday Alerts" desc="Notify on upcoming payday">
        <Toggle id="settings-notif-paydays" checked={draft.notifPaydays || false} onChange={(v) => set('notifPaydays', v)} />
      </SettingRow>
      <SettingRow label="Budget Warnings" desc="Alert when spending exceeds monthly budget">
        <Toggle id="settings-notif-budget" checked={draft.notifBudget || false} onChange={(v) => set('notifBudget', v)} />
      </SettingRow>

      <SectionHeader>Budget</SectionHeader>
      <SettingRow label="Monthly Budget" desc="Set a spending cap to track against">
        <div style={{ display: 'flex', alignItems: 'center', gap: '6px' }}>
          <span style={{ fontSize: '0.85rem', color: 'var(--text-secondary)' }}>
            {CURRENCIES.find(c => c.code === (draft.currency || 'USD'))?.symbol || '$'}
          </span>
          <input
            id="settings-monthly-budget"
            type="number"
            min="0"
            step="100"
            className="form-input tabular"
            value={draft.monthlyBudget || ''}
            onChange={(e) => set('monthlyBudget', parseFloat(e.target.value) || null)}
            placeholder="Unlimited"
            style={{ width: 120, textAlign: 'right' }}
          />
        </div>
      </SettingRow>

      <SectionHeader>Privacy</SectionHeader>
      <SettingRow label="Blur Amounts" desc="Hide financial figures until hovered">
        <Toggle id="settings-blur-amounts" checked={draft.blurAmounts || false} onChange={(v) => set('blurAmounts', v)} />
      </SettingRow>
    </div>
  );

  // ── Tab: Data ─────────────────────────────────────────────
  const DataTab = () => (
    <div>
      <SectionHeader>Export</SectionHeader>
      <SettingRow label="Export to Excel" desc="Download all expenses, refunds & paydays as .xlsx">
        <button
          id="settings-export-btn"
          className="btn-ghost"
          onClick={onExport}
          style={{ padding: '7px 14px', fontSize: '0.8rem' }}
        >
          <Download size={14} />
          Export
        </button>
      </SettingRow>

      <SectionHeader>Storage</SectionHeader>
      <SettingRow label="Stored Data" desc="All data is saved in your browser's localStorage">
        <div style={{
          padding: '5px 12px',
          background: 'var(--bg-glass)',
          border: '1px solid var(--border)',
          borderRadius: 8,
          fontSize: '0.75rem',
          color: 'var(--text-secondary)',
        }}>
          Local only
        </div>
      </SettingRow>
      <SettingRow label="Auto-save" desc="Changes are saved automatically">
        <span className="badge badge-fulfilled">On</span>
      </SettingRow>

      <SectionHeader>Danger Zone</SectionHeader>
      <SettingRow
        label="Clear All Data"
        desc="Permanently delete all expenses, refunds and paydays. This cannot be undone."
        danger
      >
        {confirmClear ? (
          <div style={{ display: 'flex', gap: '6px' }}>
            <button
              id="settings-confirm-clear-btn"
              onClick={() => { onClearData(); setConfirmClear(false); onClose(); }}
              style={{
                padding: '6px 12px',
                borderRadius: 8,
                border: 'none',
                background: 'var(--expense)',
                color: '#fff',
                fontFamily: 'inherit',
                fontSize: '0.78rem',
                fontWeight: 700,
                cursor: 'pointer',
              }}
            >
              Yes, clear
            </button>
            <button
              onClick={() => setConfirmClear(false)}
              className="btn-ghost"
              style={{ padding: '6px 10px', fontSize: '0.78rem' }}
            >
              Cancel
            </button>
          </div>
        ) : (
          <button
            id="settings-clear-btn"
            className="btn-ghost"
            onClick={() => setConfirmClear(true)}
            style={{ padding: '7px 14px', fontSize: '0.8rem', color: 'var(--expense)', borderColor: 'rgba(248,113,113,0.3)' }}
          >
            <Trash2 size={14} />
            Clear
          </button>
        )}
      </SettingRow>
    </div>
  );

  const TAB_CONTENT = { profile: ProfileTab, appearance: AppearanceTab, general: GeneralTab, data: DataTab };
  const ActiveTab = TAB_CONTENT[tab];

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div
        className="modal-box"
        onClick={(e) => e.stopPropagation()}
        style={{
          maxWidth: 600,
          width: '100%',
          maxHeight: '88dvh',
          display: 'flex',
          flexDirection: 'column',
          padding: 0,
          overflow: 'hidden',
        }}
      >
        {/* Header */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '20px 24px',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
        }}>
          <div>
            <h2 style={{ margin: 0, fontSize: '1.05rem', fontWeight: 800, color: 'var(--text-primary)', letterSpacing: '-0.02em' }}>
              Settings
            </h2>
            <p style={{ margin: '2px 0 0', fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
              Manage your profile, preferences and data
            </p>
          </div>
          <button
            id="settings-close-btn"
            onClick={onClose}
            style={{
              background: 'var(--bg-glass)',
              border: '1px solid var(--border)',
              borderRadius: 8,
              padding: 6,
              cursor: 'pointer',
              color: 'var(--text-secondary)',
              display: 'flex',
              transition: 'all 0.2s',
            }}
            onMouseEnter={(e) => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.background = 'var(--bg-glass-hover)'; }}
            onMouseLeave={(e) => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.background = 'var(--bg-glass)'; }}
            aria-label="Close settings"
          >
            <X size={18} />
          </button>
        </div>

        {/* Body: sidebar tabs + content */}
        <div style={{ display: 'flex', flex: 1, overflow: 'hidden' }}>
          {/* Tab sidebar */}
          <div style={{
            width: 150,
            borderRight: '1px solid var(--border)',
            padding: '12px 8px',
            display: 'flex',
            flexDirection: 'column',
            gap: '2px',
            flexShrink: 0,
            background: 'var(--bg-glass)',
          }}>
            {TABS.map(({ id, label, icon: Icon }) => {
              const active = tab === id;
              return (
                <button
                  key={id}
                  id={`settings-tab-${id}`}
                  onClick={() => setTab(id)}
                  style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '8px',
                    width: '100%',
                    padding: '9px 10px',
                    borderRadius: 9,
                    border: `1px solid ${active ? 'rgba(108,99,255,0.2)' : 'transparent'}`,
                    background: active ? 'var(--accent-glow)' : 'transparent',
                    color: active ? 'var(--accent)' : 'var(--text-secondary)',
                    fontFamily: 'inherit',
                    fontSize: '0.8rem',
                    fontWeight: active ? 700 : 500,
                    cursor: 'pointer',
                    transition: 'all 0.18s ease',
                    textAlign: 'left',
                  }}
                  onMouseEnter={(e) => { if (!active) { e.currentTarget.style.background = 'var(--bg-glass-hover)'; e.currentTarget.style.color = 'var(--text-primary)'; }}}
                  onMouseLeave={(e) => { if (!active) { e.currentTarget.style.background = 'transparent'; e.currentTarget.style.color = 'var(--text-secondary)'; }}}
                >
                  <Icon size={15} />
                  {label}
                </button>
              );
            })}
          </div>

          {/* Tab content */}
          <div style={{ flex: 1, overflowY: 'auto', padding: '0 24px 24px' }}>
            <ActiveTab />
          </div>
        </div>

        {/* Footer save bar */}
        <div style={{
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '14px 24px',
          borderTop: '1px solid var(--border)',
          flexShrink: 0,
          background: 'var(--bg-glass)',
        }}>
          <p style={{ margin: 0, fontSize: '0.72rem', color: 'var(--text-secondary)' }}>
            {saved ? '✅ Changes saved!' : 'Click Save to apply profile & preference changes.'}
          </p>
          <div style={{ display: 'flex', gap: '8px' }}>
            <button className="btn-ghost" onClick={onClose} style={{ padding: '7px 16px', fontSize: '0.85rem' }}>
              Cancel
            </button>
            <button
              id="settings-save-btn"
              className="btn-primary"
              onClick={handleSave}
              style={{ padding: '7px 20px', fontSize: '0.85rem', minWidth: 80 }}
            >
              {saved ? <Check size={16} /> : null}
              {saved ? 'Saved' : 'Save'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
