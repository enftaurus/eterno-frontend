import React from 'react';
import { Flame, Trophy, Calendar } from 'lucide-react';

/**
 * LoginStreakCard
 * --------------
 * Shows current login streak, longest streak, and a mini 15-day streak calendar.
 */
export default function LoginStreakCard({ currentStreak = 0, longestStreak = 0, lastActivityDate = null }) {
  // Build last 15 days of streak indicators
  const days = Array.from({ length: 15 }, (_, i) => {
    const d = new Date();
    d.setDate(d.getDate() - (14 - i));
    return d.toISOString().slice(0, 10);
  });

  // A day is "active" if we have streak data covering it.
  // Since we only get current_streak / longest_streak (not full history),
  // we highlight the last N days based on current_streak.
  const activeDays = new Set();
  if (currentStreak > 0) {
    const today = new Date();
    for (let i = 0; i < Math.min(currentStreak, 15); i++) {
      const d = new Date(today);
      d.setDate(today.getDate() - i);
      activeDays.add(d.toISOString().slice(0, 10));
    }
  }

  const dayLabels = ['S', 'M', 'T', 'W', 'T', 'F', 'S'];

  return (
    <div className="card login-streak-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span className="card-label">LOGIN STREAK</span>
        <Flame size={18} style={{ color: 'var(--color-orange)' }} />
      </div>

      {/* Main streak number */}
      <div style={{ marginBottom: '8px' }}>
        <h2 style={{ fontSize: '2.5rem', fontWeight: 700, fontFamily: 'var(--font-heading)', color: 'var(--color-orange)', lineHeight: 1 }}>
          {currentStreak}
          <span style={{ fontSize: '1.2rem', fontWeight: 400, marginLeft: '6px', color: 'var(--text-secondary)' }}>days</span>
        </h2>
      </div>

      {/* Longest streak */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginBottom: '20px' }}>
        <Trophy size={13} style={{ color: '#fbbf24' }} />
        <span style={{ fontSize: '0.82rem', color: 'var(--text-muted)' }}>
          Longest: <strong style={{ color: 'var(--text-secondary)' }}>{longestStreak} days</strong>
        </span>
      </div>

      {/* Mini 15-day calendar */}
      <div className="streak-mini-calendar">
        {days.map((iso, i) => {
          const isActive = activeDays.has(iso);
          const dayOfWeek = new Date(iso + 'T00:00:00').getDay();
          return (
            <div
              key={iso}
              title={iso}
              className={`streak-dot ${isActive ? 'streak-dot-active' : 'streak-dot-inactive'}`}
            />
          );
        })}
      </div>
      <div style={{ fontSize: '0.72rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
        <Calendar size={11} />
        {currentStreak > 0 ? 'Keep logging in daily to maintain your streak!' : 'Log in daily to build your streak!'}
      </div>
    </div>
  );
}
