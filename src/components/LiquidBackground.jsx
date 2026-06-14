import React, { useEffect, useRef } from 'react';

/**
 * Liquid ambient background using CSS animated blobs + SVG goo filter.
 * Adapts colors to current theme via CSS variables.
 */
export default function LiquidBackground() {
  return (
    <div
      aria-hidden="true"
      style={{
        position: 'fixed',
        inset: 0,
        overflow: 'hidden',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    >
      {/* SVG goo filter */}
      <svg style={{ position: 'absolute', width: 0, height: 0 }}>
        <defs>
          <filter id="goo">
            <feGaussianBlur in="SourceGraphic" stdDeviation="8" result="blur" />
            <feColorMatrix
              in="blur"
              mode="matrix"
              values="1 0 0 0 0  0 1 0 0 0  0 0 1 0 0  0 0 0 18 -8"
              result="goo"
            />
          </filter>
        </defs>
      </svg>

      {/* Blobs container */}
      <div style={{ position: 'absolute', inset: 0 }}>
        <div
          className="blob"
          style={{
            width: '600px',
            height: '600px',
            top: '-100px',
            left: '-100px',
            background: 'var(--accent)',
            animation: 'blob1 20s ease-in-out infinite',
          }}
        />
        <div
          className="blob"
          style={{
            width: '500px',
            height: '500px',
            top: '30%',
            right: '-80px',
            background: '#a855f7',
            animation: 'blob2 25s ease-in-out infinite',
          }}
        />
        <div
          className="blob"
          style={{
            width: '400px',
            height: '400px',
            bottom: '-60px',
            left: '30%',
            background: '#06b6d4',
            animation: 'blob3 18s ease-in-out infinite',
          }}
        />
        <div
          className="blob"
          style={{
            width: '350px',
            height: '350px',
            top: '50%',
            left: '50%',
            background: '#f59e0b',
            animation: 'blob1 30s ease-in-out infinite reverse',
            opacity: 0.15,
          }}
        />
        <div
          className="blob"
          style={{
            width: '300px',
            height: '300px',
            bottom: '20%',
            right: '25%',
            background: '#10b981',
            animation: 'blob2 22s ease-in-out infinite 5s',
            opacity: 0.2,
          }}
        />
      </div>
    </div>
  );
}
