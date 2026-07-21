import React, { useState } from 'react';
import { RefreshCw, ExternalLink, AlertCircle, CheckCircle2, Clock } from 'lucide-react';
import { api } from '../services/api';

/**
 * PlatformCard
 * ------------
 * Displays platform-specific stats with sync status and a resync button.
 * If data is null (platform not synced / unavailable), shows a graceful fallback.
 */
export default function PlatformCard({ platform, username, profile, lastSyncedAt, stats, onSynced }) {
  const [syncing, setSyncing] = useState(false);
  const [syncError, setSyncError] = useState(null);

  const formatSyncTime = (ts) => {
    if (!ts) return 'Never';
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffM = Math.floor(diffMs / 60000);
    const diffH = Math.floor(diffM / 60);
    const diffD = Math.floor(diffH / 24);
    if (diffM < 1) return 'Just now';
    if (diffM < 60) return `${diffM}m ago`;
    if (diffH < 24) return `${diffH}h ago`;
    return `${diffD}d ago`;
  };

  const handleSync = async () => {
    setSyncing(true);
    setSyncError(null);
    try {
      await api.syncPlatform(platform);
      if (onSynced) onSynced(platform);
    } catch (e) {
      setSyncError(e.message || 'Sync failed');
    } finally {
      setSyncing(false);
    }
  };

  const config = {
    github: {
      label: 'GitHub',
      color: '#22c55e',
      bg: 'rgba(34,197,94,0.08)',
      border: 'rgba(34,197,94,0.25)',
      profileUrl: username ? `https://github.com/${username}` : null,
      statRows: profile ? [
        { label: 'Followers', value: profile.followers ?? '—' },
        { label: 'Repositories', value: profile.public_repositories ?? '—' },
        { label: 'Total Commits', value: profile.total_commits ?? '—' },
        { label: 'Stars Earned', value: profile.total_stars ?? '—' },
        { label: 'Streak', value: profile.contribution_streak != null ? `${profile.contribution_streak}d` : '—' },
      ] : [],
    },
    leetcode: {
      label: 'LeetCode',
      color: '#eab308',
      bg: 'rgba(234,179,8,0.08)',
      border: 'rgba(234,179,8,0.25)',
      profileUrl: username ? `https://leetcode.com/${username}` : null,
      statRows: profile ? [
        { label: 'Total Solved', value: profile.total_solved ?? '—' },
        { label: 'Contest Rating', value: profile.contest_rating ? Math.round(profile.contest_rating) : '—' },
        { label: 'Global Ranking', value: profile.ranking ? `#${profile.ranking.toLocaleString()}` : '—' },
        { label: 'Easy / Med / Hard', value: profile.easy_solved != null ? `${profile.easy_solved} / ${profile.medium_solved} / ${profile.hard_solved}` : '—' },
      ] : [],
    },
    codeforces: {
      label: 'Codeforces',
      color: '#3b82f6',
      bg: 'rgba(59,130,246,0.08)',
      border: 'rgba(59,130,246,0.25)',
      profileUrl: username ? `https://codeforces.com/profile/${username}` : null,
      statRows: profile ? [
        { label: 'Current Rating', value: profile.current_rating ?? '—' },
        { label: 'Max Rating', value: profile.max_rating ?? '—' },
        { label: 'Current Rank', value: profile.current_rank ?? '—' },
        { label: 'Contests', value: profile.contests_attended ?? '—' },
      ] : [],
    },
  };

  const c = config[platform];
  const isLinked = !!username;
  const hasData = !!profile;

  return (
    <div className="platform-card" style={{ borderColor: c.border, background: c.bg }}>
      {/* Header */}
      <div className="platform-card-header">
        <div style={{ display: 'flex', alignItems: 'center', gap: '10px' }}>
          <div className="platform-card-dot" style={{ background: c.color }} />
          <div>
            <h3 className="platform-card-title" style={{ color: c.color }}>{c.label}</h3>
            {username && (
              <p className="platform-card-username">@{username}</p>
            )}
          </div>
        </div>
        <div style={{ display: 'flex', gap: '8px', alignItems: 'center' }}>
          {isLinked && c.profileUrl && (
            <a href={c.profileUrl} target="_blank" rel="noopener noreferrer" className="platform-card-icon-btn" title="View Profile">
              <ExternalLink size={14} />
            </a>
          )}
          {isLinked && (
            <button
              className="platform-card-icon-btn"
              onClick={handleSync}
              disabled={syncing}
              title="Resync"
            >
              <RefreshCw size={14} className={syncing ? 'spin' : ''} />
            </button>
          )}
        </div>
      </div>

      {/* Status badge */}
      <div className="platform-card-status">
        {!isLinked ? (
          <span className="platform-badge platform-badge-unlinked">Not Connected</span>
        ) : hasData ? (
          <span className="platform-badge platform-badge-synced">
            <CheckCircle2 size={11} /> Synced
          </span>
        ) : (
          <span className="platform-badge platform-badge-pending">
            <Clock size={11} /> Pending sync
          </span>
        )}
        {lastSyncedAt && (
          <span className="platform-card-sync-time">
            <Clock size={11} /> {formatSyncTime(lastSyncedAt)}
          </span>
        )}
      </div>

      {/* Stats */}
      {hasData ? (
        <div className="platform-card-stats">
          {c.statRows.map(({ label, value }) => (
            <div key={label} className="platform-stat-row">
              <span className="platform-stat-label">{label}</span>
              <span className="platform-stat-value" style={{ color: c.color }}>{value}</span>
            </div>
          ))}
        </div>
      ) : isLinked ? (
        <div className="platform-card-empty">
          <AlertCircle size={20} style={{ color: c.color, opacity: 0.5 }} />
          <p>Data will appear after the first sync completes.</p>
        </div>
      ) : (
        <div className="platform-card-empty">
          <p>Connect your {c.label} account on the Profile page to track your progress.</p>
        </div>
      )}

      {syncError && (
        <div className="platform-card-error">{syncError}</div>
      )}
    </div>
  );
}
