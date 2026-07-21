import React, { useState } from 'react';
import { RefreshCw, CheckCircle2, ExternalLink, Unlink, Clock } from 'lucide-react';
import { api } from '../services/api';

/**
 * PlatformSyncStatus
 * ------------------
 * Used on the Profile page under "Connected Accounts".
 * Shows connection status, last sync time, and action buttons.
 */

const PLATFORM_CONFIG = {
  github:     { label: 'GitHub',      color: '#22c55e', profileBase: 'https://github.com/' },
  leetcode:   { label: 'LeetCode',    color: '#eab308', profileBase: 'https://leetcode.com/' },
  codeforces: { label: 'Codeforces',  color: '#3b82f6', profileBase: 'https://codeforces.com/profile/' },
};

function formatSyncTime(ts) {
  if (!ts) return 'Never synced';
  const d = new Date(ts);
  const diffMs = Date.now() - d.getTime();
  const diffM = Math.floor(diffMs / 60000);
  const diffH = Math.floor(diffM / 60);
  const diffD = Math.floor(diffH / 24);
  if (diffM < 1) return 'Just now';
  if (diffM < 60) return `${diffM} min ago`;
  if (diffH < 24) return `${diffH} hr ago`;
  return `${diffD} day${diffD > 1 ? 's' : ''} ago`;
}

export default function PlatformSyncStatus({ platform, details, onSynced, onDisconnect }) {
  const [syncing, setSyncing] = useState(false);
  const [syncMsg, setSyncMsg] = useState(null);

  const cfg = PLATFORM_CONFIG[platform];
  const username = details?.username;
  const lastSynced = details?.last_synced_at;
  const isVerified = details?.is_verified;

  if (!username) {
    return (
      <div className="sync-status-row sync-status-unlinked">
        <div className="sync-status-info">
          <div className="sync-status-dot" style={{ background: 'var(--text-muted)' }} />
          <div>
            <h4 style={{ color: 'var(--text-secondary)', marginBottom: '2px' }}>{cfg.label}</h4>
            <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>Not connected</p>
          </div>
        </div>
      </div>
    );
  }

  const handleSync = async () => {
    setSyncing(true);
    setSyncMsg(null);
    try {
      await api.syncPlatform(platform);
      setSyncMsg('Synced successfully!');
      if (onSynced) onSynced(platform);
    } catch (e) {
      setSyncMsg(`Sync failed: ${e.message}`);
    } finally {
      setSyncing(false);
    }
  };

  return (
    <div className="sync-status-row">
      <div className="sync-status-info">
        <div className="sync-status-dot" style={{ background: cfg.color }} />
        <div>
          <h4 style={{ color: cfg.color, marginBottom: '2px', fontWeight: 600 }}>
            {cfg.label}
            {isVerified && (
              <CheckCircle2 size={13} style={{ color: cfg.color, marginLeft: '6px', verticalAlign: 'middle' }} />
            )}
          </h4>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.82rem' }}>
            @{username}
          </p>
          <p style={{ color: 'var(--text-muted)', fontSize: '0.78rem', display: 'flex', alignItems: 'center', gap: '4px', marginTop: '2px' }}>
            <Clock size={11} /> Last sync: {formatSyncTime(lastSynced)}
          </p>
          {syncMsg && (
            <p style={{ fontSize: '0.78rem', color: syncMsg.includes('fail') ? 'var(--color-error)' : 'var(--color-success)', marginTop: '4px' }}>
              {syncMsg}
            </p>
          )}
        </div>
      </div>

      <div className="sync-status-actions">
        <button
          className="btn-sm btn-sync"
          onClick={handleSync}
          disabled={syncing}
          title="Resync now"
        >
          <RefreshCw size={13} className={syncing ? 'spin' : ''} />
          {syncing ? 'Syncing...' : 'Resync'}
        </button>

        <a
          href={`${cfg.profileBase}${username}`}
          target="_blank"
          rel="noopener noreferrer"
          className="btn-sm btn-view"
          title="View on platform"
        >
          <ExternalLink size={13} />
          View
        </a>
      </div>
    </div>
  );
}
