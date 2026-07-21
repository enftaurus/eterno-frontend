import React from 'react';
import { Zap, TrendingUp } from 'lucide-react';

/**
 * DeveloperScoreCard
 * ------------------
 * Animated card showing the user's computed developer score with a
 * tier label and a progress bar toward the next tier.
 */

const TIERS = [
  { name: 'Rookie',     min: 0,    color: '#94a3b8' },
  { name: 'Apprentice', min: 200,  color: '#22d3ee' },
  { name: 'Developer',  min: 500,  color: '#22c55e' },
  { name: 'Specialist', min: 1000, color: '#a78bfa' },
  { name: 'Expert',     min: 2000, color: '#f59e0b' },
  { name: 'Master',     min: 3500, color: '#ef4444' },
  { name: 'Legend',     min: 6000, color: '#ec4899' },
];

function getTier(score) {
  let tier = TIERS[0];
  for (const t of TIERS) {
    if (score >= t.min) tier = t;
  }
  const index = TIERS.indexOf(tier);
  const next = TIERS[index + 1] || null;
  const progress = next
    ? Math.min(100, ((score - tier.min) / (next.min - tier.min)) * 100)
    : 100;
  return { tier, next, progress };
}

export default function DeveloperScoreCard({ score = 0 }) {
  const { tier, next, progress } = getTier(score);

  return (
    <div className="card developer-score-card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
        <span className="card-label">DEVELOPER SCORE</span>
        <Zap size={18} style={{ color: tier.color }} />
      </div>

      <div style={{ display: 'flex', alignItems: 'flex-end', gap: '10px', marginBottom: '6px' }}>
        <h2 className="score-value" style={{ color: tier.color }}>
          {score.toLocaleString()}
        </h2>
        <span style={{ color: 'var(--text-secondary)', fontSize: '0.9rem', marginBottom: '4px' }}>pts</span>
      </div>

      <div className="tier-badge" style={{ color: tier.color, borderColor: tier.color }}>
        {tier.name.toUpperCase()}
      </div>

      {/* Progress bar to next tier */}
      <div style={{ marginTop: '16px' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', marginBottom: '6px', fontSize: '0.75rem', color: 'var(--text-muted)' }}>
          <span>{tier.name}</span>
          {next && <span style={{ color: tier.color }}>{next.name} at {next.min.toLocaleString()}</span>}
        </div>
        <div className="score-progress-track">
          <div
            className="score-progress-fill"
            style={{ width: `${progress}%`, background: tier.color }}
          />
        </div>
        {next && (
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '6px', display: 'flex', alignItems: 'center', gap: '4px' }}>
            <TrendingUp size={12} />
            {(next.min - score).toLocaleString()} pts to {next.name}
          </p>
        )}
      </div>
    </div>
  );
}
