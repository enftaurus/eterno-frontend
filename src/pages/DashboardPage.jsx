import React, { useState, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import { AlertTriangle, ArrowRight, RefreshCw } from 'lucide-react';
import { api } from '../services/api';
import WelcomeBackModal from '../components/WelcomeBackModal';
import DeveloperScoreCard from '../components/DeveloperScoreCard';
import LoginStreakCard from '../components/LoginStreakCard';
import UnifiedHeatmap from '../components/UnifiedHeatmap';
import PlatformCard from '../components/PlatformCard';
import RecentActivityFeed from '../components/RecentActivityFeed';
import DeveloperRadar from '../components/DeveloperRadar';

export default function DashboardPage({ user }) {
  const [dashboard, setDashboard] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [showWelcome, setShowWelcome] = useState(false);

  const displayName = user?.full_name || 'Coder';
  const hasIncompleteProfiles = user && !user.profile_complete;

  const loadDashboard = useCallback(async () => {
    try {
      const data = await api.getDashboard();
      setDashboard(data);
      // Show welcome modal on first load
      setShowWelcome(true);
    } catch (e) {
      setError(e.message || 'Failed to load dashboard');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    loadDashboard();
  }, [loadDashboard]);

  const handleSynced = async () => {
    // Refresh dashboard after a manual sync
    setLoading(true);
    await loadDashboard();
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', minHeight: '60vh' }}>
        <div className="spinner" />
      </div>
    );
  }

  const stats = dashboard?.user_stats || {};
  const accounts = dashboard?.platform_accounts || {};
  const github = dashboard?.github || {};
  const leetcode = dashboard?.leetcode || {};
  const codeforces = dashboard?.codeforces || {};
  const heatmap = dashboard?.activity_heatmap || {};
  const recent = dashboard?.recent_activity || [];
  const welcome = dashboard?.welcome_back || {};

  return (
    <div className="container animate-fade" style={{ paddingBottom: '80px' }}>

      {/* Welcome Back Modal */}
      {showWelcome && welcome && (
        <WelcomeBackModal
          data={{ ...welcome, full_name: user?.full_name }}
          onClose={() => setShowWelcome(false)}
        />
      )}

      {/* Header */}
      <header style={{ padding: '40px 0 20px 0', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '20px' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '8px' }}>
            Developer Dashboard
          </h1>
          <p style={{ color: 'var(--text-secondary)' }}>
            Welcome back, <strong style={{ color: 'var(--color-teal)' }}>{displayName}</strong>! Review your stats and standings.
          </p>
        </div>
        <button
          className="btn btn-outline"
          onClick={() => { setLoading(true); loadDashboard(); }}
          style={{ display: 'flex', alignItems: 'center', gap: '6px', fontSize: '0.85rem' }}
        >
          <RefreshCw size={14} /> Refresh
        </button>
      </header>

      {/* Profile incomplete alert */}
      {hasIncompleteProfiles && (
        <section className="dashboard-alert-banner">
          <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
            <AlertTriangle size={20} style={{ color: 'var(--color-warning)' }} />
            <div>
              <strong style={{ color: 'var(--text-primary)' }}>Coding Profiles Pending Setup:</strong>
              <p style={{ color: 'var(--text-secondary)', fontSize: '0.88rem', marginTop: '2px' }}>
                Link your LeetCode, Codeforces, and GitHub usernames to unlock your developer score and campus rank.
              </p>
            </div>
          </div>
          <Link to="/profile" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
            Link Accounts <ArrowRight size={14} />
          </Link>
        </section>
      )}

      {error && (
        <div className="alert alert-error" style={{ marginBottom: '20px' }}>
          {error} — showing cached data where available.
        </div>
      )}

      {/* ── Row 1: Score + Streak + Radar ────────────────────────── */}
      <div className="dashboard-top-grid">
        <DeveloperScoreCard score={stats.developer_score || 0} />
        <LoginStreakCard
          currentStreak={stats.current_streak || 0}
          longestStreak={stats.longest_streak || 0}
          lastActivityDate={stats.last_activity_date}
        />
        <DeveloperRadar
          githubProfile={github.profile}
          leetcodeProfile={leetcode.profile}
          codeforcesProfile={codeforces.profile}
          totalActiveDays={stats.total_active_days || 0}
        />
      </div>

      {/* ── Unified Heatmap ──────────────────────────────────────── */}
      <section style={{ marginBottom: '28px' }}>
        <UnifiedHeatmap data={heatmap} />
      </section>

      {/* ── Platform Cards ───────────────────────────────────────── */}
      <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.1rem', marginBottom: '16px', color: 'var(--text-secondary)' }}>
        Platform Stats
      </h3>
      <div className="platform-cards-grid">
        {['github', 'leetcode', 'codeforces'].map((p) => {
          const pData = { github, leetcode, codeforces }[p];
          return (
            <PlatformCard
              key={p}
              platform={p}
              username={accounts[p]?.username}
              profile={pData?.profile}
              lastSyncedAt={accounts[p]?.last_synced_at}
              onSynced={handleSynced}
            />
          );
        })}
      </div>

      {/* ── Recent Activity ──────────────────────────────────────── */}
      <div style={{ marginTop: '28px' }}>
        <RecentActivityFeed activities={recent} />
      </div>
    </div>
  );
}
