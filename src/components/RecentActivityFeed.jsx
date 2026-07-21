import React from 'react';
import { GitCommit, Code, BarChart2 } from 'lucide-react';

/**
 * RecentActivityFeed
 * ------------------
 * Merged chronological feed from all three platforms.
 * Each item shows platform icon, action, detail, and relative time.
 */

const PLATFORM_CONFIG = {
  github: {
    label: 'GitHub',
    color: '#22c55e',
    bg: 'rgba(34,197,94,0.1)',
    Icon: GitCommit,
    verb: 'commit',
    unit: 'commit',
  },
  leetcode: {
    label: 'LeetCode',
    color: '#eab308',
    bg: 'rgba(234,179,8,0.1)',
    Icon: Code,
    verb: 'submission',
    unit: 'submission',
  },
  codeforces: {
    label: 'Codeforces',
    color: '#3b82f6',
    bg: 'rgba(59,130,246,0.1)',
    Icon: BarChart2,
    verb: 'submission',
    unit: 'submission',
  },
};

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr + 'T00:00:00');
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);

  const isoToday = today.toISOString().slice(0, 10);
  const isoYesterday = yesterday.toISOString().slice(0, 10);

  if (dateStr === isoToday) return 'Today';
  if (dateStr === isoYesterday) return 'Yesterday';

  return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
}

export default function RecentActivityFeed({ activities = [] }) {
  if (activities.length === 0) {
    return (
      <div className="card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '16px' }}>
          <span className="card-label">RECENT ACTIVITY</span>
        </div>
        <div style={{ textAlign: 'center', color: 'var(--text-muted)', padding: '30px 0', fontSize: '0.9rem' }}>
          No activity yet. Link your platforms and start coding!
        </div>
      </div>
    );
  }

  return (
    <div className="card">
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '20px' }}>
        <span className="card-label">RECENT ACTIVITY</span>
        <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{activities.length} events</span>
      </div>

      <div className="activity-feed">
        {activities.map((item, i) => {
          const cfg = PLATFORM_CONFIG[item.platform] || PLATFORM_CONFIG.github;
          const Icon = cfg.Icon;
          const count = item.activity_count || 1;

          return (
            <React.Fragment key={i}>
              <div className="activity-item">
                <div className="activity-icon" style={{ background: cfg.bg, color: cfg.color }}>
                  <Icon size={14} />
                </div>
                <div className="activity-content">
                  <div className="activity-main">
                    <span style={{ color: cfg.color, fontWeight: 600, fontSize: '0.82rem' }}>{cfg.label}</span>
                    <span style={{ color: 'var(--text-secondary)', fontSize: '0.82rem' }}>
                      {' '}— {count} {count === 1 ? cfg.unit : cfg.unit + 's'}
                    </span>
                  </div>
                  <div className="activity-meta">
                    {formatDate(item.activity_date)}
                  </div>
                </div>
              </div>
              {i < activities.length - 1 && <div className="activity-divider" />}
            </React.Fragment>
          );
        })}
      </div>
    </div>
  );
}
