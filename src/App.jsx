import React, { useState, useCallback, useMemo, useEffect } from 'react';
import { auth, googleProvider, signInWithPopup, signOut } from './firebase';
import { useLocalStorage } from './hooks/useLocalStorage';
import { useTheme } from './hooks/useTheme';
import LiquidBackground from './components/LiquidBackground';
import Sidebar from './components/Sidebar';
import ProfileMenu from './components/ProfileMenu';
import SettingsModal from './components/SettingsModal';
import Landing from './views/Landing';
import Dashboard from './views/Dashboard';
import Spending from './views/Spending';
import Refunds from './views/Refunds';
import Calendar from './views/Calendar';
import * as XLSX from 'xlsx';
import { Download } from 'lucide-react';

// Demo seed data for first-time users
const SEED_EXPENSES = [
  { id: 1, description: 'Monthly Rent', amount: 1800, category: 'Housing', date: '2026-06-01' },
  { id: 2, description: 'Whole Foods Run', amount: 127.50, category: 'Food', date: '2026-06-03' },
  { id: 3, description: 'Spotify Premium', amount: 10.99, category: 'Entertainment', date: '2026-06-05' },
  { id: 4, description: 'Uber to Airport', amount: 38.00, category: 'Transport', date: '2026-06-07' },
  { id: 5, description: 'Gym Membership', amount: 49.99, category: 'Health', date: '2026-06-10' },
];
const SEED_REFUNDS = [
  { id: 1, vendor: 'Amazon', amount: 45.00, date: '2026-06-20', notes: 'Order #ABC123', status: 'pending' },
  { id: 2, vendor: 'Insurance Co.', amount: 320.00, date: '2026-06-28', notes: 'Medical claim', status: 'pending' },
  { id: 3, vendor: 'Best Buy', amount: 89.99, date: '2026-06-08', notes: 'Defective item', status: 'fulfilled' },
];
const SEED_PAYDAYS = [
  { id: 1, label: 'Bi-weekly Salary', amount: 3500, date: '2026-06-15' },
  { id: 2, label: 'Bi-weekly Salary', amount: 3500, date: '2026-06-30' },
  { id: 3, label: 'Freelance — Design', amount: 800, date: '2026-06-12' },
];

// Default settings
const DEFAULT_SETTINGS = {
  displayName: '',
  avatarColor: '#6c63ff',
  accentColor: '#6c63ff',
  themeMode: 'dark',
  compactMode: false,
  animations: true,
  liquidBg: true,
  currency: 'USD',
  dateFormat: 'yyyy-MM-dd',
  monthlyBudget: null,
  blurAmounts: false,
  notifRefunds: false,
  notifPaydays: false,
  notifBudget: false,
};

export default function App() {
  const [user, setUser] = useState(null);
  const [view, setView] = useState('dashboard');
  const [search, setSearch] = useState('');
  const [settingsOpen, setSettingsOpen] = useState(false);
  const { theme, toggle: toggleTheme } = useTheme();

  const isGuest = user?.isGuest || false;

  // Persistent state (auth-aware)
  const [expenses, setExpenses] = useLocalStorage('expensify-expenses', SEED_EXPENSES, isGuest);
  const [refunds, setRefunds] = useLocalStorage('expensify-refunds', SEED_REFUNDS, isGuest);
  const [paydays, setPaydays] = useLocalStorage('expensify-paydays', SEED_PAYDAYS, isGuest);
  const [settings, setSettings] = useLocalStorage('expensify-settings', DEFAULT_SETTINGS, isGuest);

  // Apply accent colour from settings to CSS variable
  useEffect(() => {
    if (settings?.accentColor) {
      document.documentElement.style.setProperty('--accent', settings.accentColor);
      // Derive glow from accent
      document.documentElement.style.setProperty(
        '--accent-glow',
        `${settings.accentColor}33`
      );
      document.documentElement.style.setProperty(
        '--accent-hover',
        settings.accentColor + 'cc'
      );
    }
  }, [settings?.accentColor]);

  // Apply animations setting
  useEffect(() => {
    if (settings?.animations === false) {
      document.documentElement.style.setProperty('--animation-duration', '0s');
    } else {
      document.documentElement.style.removeProperty('--animation-duration');
    }
  }, [settings?.animations]);

  // ─── Auth ───────────────────────────────────────────────
  const handleGoogleSignIn = async () => {
    try {
      if (auth && googleProvider) {
        const result = await signInWithPopup(auth, googleProvider);
        setUser(result.user);
      } else {
        setUser({ displayName: 'Demo User', email: 'demo@expensify.app', photoURL: null, isDemo: true });
      }
    } catch (err) {
      console.error('Google sign-in error:', err);
      setUser({ displayName: 'Demo User', email: 'demo@expensify.app', photoURL: null, isDemo: true });
    }
  };

  const handleGuestAccess = () => {
    setUser({ isGuest: true, displayName: 'Guest', email: null });
  };

  const handleLogout = async () => {
    try {
      if (auth && !user?.isGuest && !user?.isDemo) await signOut(auth);
    } catch {}
    setUser(null);
    setView('dashboard');
  };

  // ─── Data Mutations ─────────────────────────────────────
  const addExpense = useCallback((e) => setExpenses((p) => [e, ...p]), [setExpenses]);
  const deleteExpense = useCallback((id) => setExpenses((p) => p.filter((e) => e.id !== id)), [setExpenses]);

  const addRefund = useCallback((r) => setRefunds((p) => [r, ...p]), [setRefunds]);
  const deleteRefund = useCallback((id) => setRefunds((p) => p.filter((r) => r.id !== id)), [setRefunds]);
  const toggleRefund = useCallback((id) => {
    setRefunds((p) => p.map((r) => r.id === id ? { ...r, status: r.status === 'pending' ? 'fulfilled' : 'pending' } : r));
  }, [setRefunds]);

  const addPayday = useCallback((p) => setPaydays((prev) => [p, ...prev]), [setPaydays]);
  const deletePayday = useCallback((id) => setPaydays((p) => p.filter((pd) => pd.id !== id)), [setPaydays]);

  // Clear all data
  const handleClearData = useCallback(() => {
    setExpenses([]);
    setRefunds([]);
    setPaydays([]);
  }, [setExpenses, setRefunds, setPaydays]);

  // Settings save
  const handleSaveSettings = useCallback((newSettings) => {
    setSettings(newSettings);
    // Sync display name back to user object for immediate sidebar update
    if (newSettings.displayName?.trim()) {
      setUser((u) => u ? { ...u, displayName: newSettings.displayName.trim() } : u);
    }
  }, [setSettings]);

  // ─── Balance ────────────────────────────────────────────
  const balance = useMemo(() => {
    const income = paydays.reduce((s, p) => s + p.amount, 0);
    const spent = expenses.reduce((s, e) => s + e.amount, 0);
    const returned = refunds.filter((r) => r.status === 'fulfilled').reduce((s, r) => s + r.amount, 0);
    return income + returned - spent;
  }, [expenses, refunds, paydays]);

  // ─── Excel Export ────────────────────────────────────────
  const handleExport = useCallback(() => {
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      expenses.map((e) => ({ Date: e.date, Description: e.description, Category: e.category, Amount: e.amount }))
    ), 'Expenses');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      refunds.map((r) => ({ Date: r.date, Vendor: r.vendor, Amount: r.amount, Status: r.status, Notes: r.notes || '' }))
    ), 'Refunds');
    XLSX.utils.book_append_sheet(wb, XLSX.utils.json_to_sheet(
      paydays.map((p) => ({ Date: p.date, Label: p.label, Amount: p.amount }))
    ), 'Paydays');
    XLSX.writeFile(wb, 'Expensify_Export.xlsx');
  }, [expenses, refunds, paydays]);

  // ─── Render Landing ─────────────────────────────────────
  if (!user) {
    return <Landing onGoogleSignIn={handleGoogleSignIn} onGuestAccess={handleGuestAccess} />;
  }

  // ─── Main App Shell ─────────────────────────────────────
  const renderView = () => {
    const p = { search, settings };
    switch (view) {
      case 'dashboard': return <Dashboard expenses={expenses} refunds={refunds} paydays={paydays} {...p} />;
      case 'spending':  return <Spending  expenses={expenses} onAdd={addExpense} onDelete={deleteExpense} {...p} />;
      case 'refunds':   return <Refunds   refunds={refunds}   onAdd={addRefund}  onDelete={deleteRefund} onToggle={toggleRefund} {...p} />;
      case 'calendar':  return <Calendar  expenses={expenses} refunds={refunds} paydays={paydays} onAddPayday={addPayday} onDeletePayday={deletePayday} />;
      default: return null;
    }
  };

  return (
    <div style={{ display: 'flex', height: '100dvh', overflow: 'hidden', position: 'relative' }}>
      {settings?.liquidBg !== false && <LiquidBackground />}

      {/* Sidebar */}
      <Sidebar
        view={view}
        onNavigate={setView}
        balance={balance}
        search={search}
        onSearch={setSearch}
        settings={settings}
      />

      {/* Main content */}
      <div style={{ flex: 1, display: 'flex', flexDirection: 'column', overflow: 'hidden', position: 'relative', zIndex: 1 }}>
        {/* Topbar */}
        <header style={{
          height: 60,
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'space-between',
          padding: '0 20px',
          background: 'var(--bg-surface)',
          borderBottom: '1px solid var(--border)',
          flexShrink: 0,
          gap: '12px',
        }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <h2 style={{ margin: 0, fontSize: '1rem', fontWeight: 700, color: 'var(--text-primary)', textTransform: 'capitalize' }}>
              {view}
            </h2>
            {user.isGuest && (
              <span className="badge badge-pending">Guest Mode</span>
            )}
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
            <button
              id="export-btn"
              onClick={handleExport}
              className="btn-ghost"
              style={{ padding: '6px 12px', fontSize: '0.8rem' }}
              title="Export to Excel"
            >
              <Download size={15} />
              Export
            </button>

            <ProfileMenu
              user={user}
              onLogout={handleLogout}
              theme={theme}
              onToggleTheme={toggleTheme}
              onOpenSettings={() => setSettingsOpen(true)}
              settings={settings}
            />
          </div>
        </header>

        {/* Scrollable content area */}
        <main style={{ flex: 1, overflowY: 'auto', background: 'transparent' }}>
          {renderView()}
        </main>
      </div>

      {/* Settings Modal */}
      <SettingsModal
        open={settingsOpen}
        onClose={() => setSettingsOpen(false)}
        user={user}
        settings={settings}
        onSave={handleSaveSettings}
        theme={theme}
        onToggleTheme={toggleTheme}
        onClearData={handleClearData}
        onExport={handleExport}
      />
    </div>
  );
}
