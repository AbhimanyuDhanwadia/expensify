import React from 'react';
import { Wallet, Shield, BarChart3, Download, ChevronRight, Sparkles } from 'lucide-react';
import LiquidBackground from '../components/LiquidBackground';

const FEATURES = [
  { icon: BarChart3, color: '#6c63ff', label: 'Real-time Analytics', desc: 'Track spending patterns with live charts' },
  { icon: Shield, color: '#10b981', label: 'Secure & Private', desc: 'Firebase Auth with encrypted local storage' },
  { icon: Download, color: '#f59e0b', label: 'Excel Export', desc: 'Export all records with one click' },
];

export default function Landing({ onGoogleSignIn, onGuestAccess }) {
  return (
    <div style={{ minHeight: '100dvh', display: 'flex', alignItems: 'center', justifyContent: 'center', position: 'relative', overflow: 'hidden', padding: '24px' }}>
      <LiquidBackground />

      <div
        className="animate-scale-in"
        style={{
          position: 'relative',
          zIndex: 1,
          width: '100%',
          maxWidth: '440px',
          textAlign: 'center',
        }}
      >
        {/* Logo badge */}
        <div style={{ display: 'flex', justifyContent: 'center', marginBottom: '28px' }}>
          <div
            className="animate-pulse-glow"
            style={{
              width: 72,
              height: 72,
              borderRadius: 20,
              background: 'linear-gradient(135deg, var(--accent) 0%, #a855f7 100%)',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              boxShadow: '0 12px 40px var(--accent-glow)',
            }}
          >
            <Wallet size={32} color="#fff" />
          </div>
        </div>

        {/* Heading */}
        <div style={{ marginBottom: '8px' }}>
          <span style={{
            display: 'inline-flex',
            alignItems: 'center',
            gap: 6,
            padding: '4px 14px',
            background: 'var(--accent-glow)',
            border: '1px solid rgba(108,99,255,0.3)',
            borderRadius: 999,
            fontSize: '0.7rem',
            fontWeight: 600,
            color: 'var(--accent)',
            textTransform: 'uppercase',
            letterSpacing: '0.08em',
            marginBottom: '16px',
          }}>
            <Sparkles size={12} />
            Personal Finance
          </span>
        </div>

        <h1 style={{
          fontSize: '2.75rem',
          fontWeight: 900,
          margin: '0 0 12px',
          lineHeight: 1.1,
          letterSpacing: '-0.04em',
          background: 'linear-gradient(135deg, var(--text-primary) 0%, var(--accent) 100%)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent',
          backgroundClip: 'text',
        }}>
          Expensify
        </h1>

        <p style={{
          color: 'var(--text-secondary)',
          fontSize: '1rem',
          lineHeight: 1.6,
          margin: '0 0 36px',
        }}>
          Track your cash flow, manage expenses, and gain full visibility into your financial life — beautifully.
        </p>

        {/* Feature pills */}
        <div className="stagger-children" style={{ display: 'flex', flexDirection: 'column', gap: '10px', marginBottom: '36px', textAlign: 'left' }}>
          {FEATURES.map(({ icon: Icon, color, label, desc }) => (
            <div
              key={label}
              className="glass-card"
              style={{ display: 'flex', alignItems: 'center', gap: '14px', padding: '14px 16px' }}
            >
              <div style={{
                width: 38,
                height: 38,
                borderRadius: 10,
                background: `${color}22`,
                border: `1px solid ${color}33`,
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                flexShrink: 0,
              }}>
                <Icon size={18} style={{ color }} />
              </div>
              <div>
                <p style={{ margin: 0, fontWeight: 600, fontSize: '0.85rem', color: 'var(--text-primary)' }}>{label}</p>
                <p style={{ margin: 0, fontSize: '0.75rem', color: 'var(--text-secondary)' }}>{desc}</p>
              </div>
            </div>
          ))}
        </div>

        {/* CTAs */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '10px' }}>
          <button
            id="google-signin-btn"
            className="btn-primary"
            onClick={onGoogleSignIn}
            style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem' }}
          >
            <svg width="18" height="18" viewBox="0 0 18 18" fill="none">
              <path d="M17.64 9.2c0-.637-.057-1.251-.164-1.84H9v3.481h4.844c-.209 1.125-.843 2.078-1.796 2.717v2.258h2.908c1.702-1.567 2.684-3.875 2.684-6.615z" fill="#4285F4"/>
              <path d="M9 18c2.43 0 4.467-.806 5.956-2.18l-2.908-2.259c-.806.54-1.837.86-3.048.86-2.344 0-4.328-1.584-5.036-3.711H.957v2.332C2.438 15.983 5.482 18 9 18z" fill="#34A853"/>
              <path d="M3.964 10.71c-.18-.54-.282-1.117-.282-1.71 0-.593.102-1.17.282-1.71V4.958H.957C.347 6.173 0 7.548 0 9s.348 2.827.957 4.042l3.007-2.332z" fill="#FBBC05"/>
              <path d="M9 3.58c1.321 0 2.508.454 3.44 1.345l2.582-2.58C13.463.891 11.426 0 9 0 5.482 0 2.438 2.017.957 4.958L3.964 6.29C4.672 4.163 6.656 3.58 9 3.58z" fill="#EA4335"/>
            </svg>
            Continue with Google
          </button>

          <button
            id="guest-access-btn"
            className="btn-ghost"
            onClick={onGuestAccess}
            style={{ width: '100%', padding: '14px 20px', fontSize: '0.95rem' }}
          >
            <ChevronRight size={16} />
            Continue as Guest
          </button>
        </div>

        <p style={{ marginTop: '20px', fontSize: '0.72rem', color: 'var(--text-secondary)', lineHeight: 1.5 }}>
          Guest sessions are temporary and not saved. Sign in to persist your data.
        </p>
      </div>
    </div>
  );
}
