import React, { useState, useEffect } from 'react';
import { Save, Lock, Edit3, Globe, CheckCircle2, AlertTriangle, Link2 } from 'lucide-react';
import { api } from '../services/api';
import { LeetCodeLogo, CodeforcesLogo, GitHubLogo } from '../components/Logos';
import PlatformSyncStatus from '../components/PlatformSyncStatus';

export default function ProfilePage({ user, onUpdateUser }) {
  const [profile, setProfile] = useState(null);
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);

  // Form values for the editable coding usernames
  const [platforms, setPlatforms] = useState({
    leetcode: '',
    codeforces: '',
    github: '',
  });

  useEffect(() => {
    async function loadProfile() {
      try {
        const data = await api.getMe();
        setProfile(data);
        setPlatforms({
          leetcode: data.platforms?.leetcode || '',
          codeforces: data.platforms?.codeforces || '',
          github: data.platforms?.github || '',
        });
      } catch (err) {
        console.error(err);
        setError('Failed to fetch profile details. Please try logging in again.');
      } finally {
        setLoading(false);
      }
    }
    loadProfile();
  }, []);

  const handleUsernameChange = (e) => {
    const { name, value } = e.target;
    setPlatforms((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);
    setSaving(true);

    try {
      // 1. Save coding usernames
      await api.savePlatforms({
        leetcode: platforms.leetcode.trim() || null,
        codeforces: platforms.codeforces.trim() || null,
        github: platforms.github.trim() || null,
      });

      // 2. Fetch updated profile data
      const updatedProfile = await api.getMe();
      setProfile(updatedProfile);
      if (onUpdateUser) {
        onUpdateUser(updatedProfile);
      }
      
      setSuccess('Coding platform profiles updated successfully!');
    } catch (err) {
      console.error(err);
      setError(err.message || 'Failed to update coding platform profiles.');
    } finally {
      setSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="container" style={{ padding: '60px 0' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  if (error && !profile) {
    return (
      <div className="container" style={{ padding: '60px 24px' }}>
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      </div>
    );
  }

  return (
    <div className="container animate-fade" style={{ paddingBottom: '60px' }}>
      <header style={{ padding: '40px 0 20px 0' }}>
        <h1 style={{ fontFamily: 'var(--font-heading)', fontSize: '2.5rem', marginBottom: '8px' }}>
          Profile Settings
        </h1>
        <p style={{ color: 'var(--text-secondary)' }}>
          Manage your coding profiles and review institutional enrollment details.
        </p>
      </header>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {success && (
        <div className="alert alert-success">
          <CheckCircle2 size={16} />
          <span>{success}</span>
        </div>
      )}

      {!profile.profile_complete && (
        <div className="alert" style={{ backgroundColor: 'rgba(245, 158, 11, 0.1)', borderColor: 'rgba(245, 158, 11, 0.3)', color: '#fbbf24' }}>
          <AlertTriangle size={18} />
          <div>
            <strong>Profile Incomplete:</strong> Please provide your usernames for LeetCode, Codeforces, and GitHub. 
            All three platforms are required to compute your developer score and unlock the campus leaderboard.
          </div>
        </div>
      )}

      <div className="profile-layout">
        {/* Sidebar avatar card */}
        <div className="card profile-sidebar">
          <div className="profile-avatar-card">
            <div className="profile-avatar">
              {profile.full_name ? profile.full_name.charAt(0).toUpperCase() : 'U'}
            </div>
            <h3 className="profile-name">{profile.full_name}</h3>
            <p className="profile-role">{profile.roll_number}</p>
            
            <div style={{ marginTop: '20px' }}>
              {profile.profile_complete ? (
                <span className="profile-status-badge badge-complete">
                  Account Active
                </span>
              ) : (
                <span className="profile-status-badge badge-incomplete">
                  Pending Setup
                </span>
              )}
            </div>
          </div>
        </div>

        {/* Main forms area */}
        <div className="card" style={{ padding: '35px' }}>
          <form onSubmit={handleSubmit}>
            {/* Section: Platform Handles - EDITABLE */}
            <div style={{ marginBottom: '35px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <Globe size={18} style={{ color: 'var(--color-teal)' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600 }}>
                  Coding Profiles <span style={{ fontSize: '0.85rem', color: 'var(--color-teal)', fontWeight: 'normal', marginLeft: '6px' }}>(Editable)</span>
                </h3>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="leetcode">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <LeetCodeLogo size={14} /> LeetCode Username
                  </span>
                </label>
                <input
                  type="text"
                  id="leetcode"
                  name="leetcode"
                  className="form-input"
                  placeholder="Enter LeetCode username"
                  value={platforms.leetcode}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="codeforces">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <CodeforcesLogo size={14} /> Codeforces Username
                  </span>
                </label>
                <input
                  type="text"
                  id="codeforces"
                  name="codeforces"
                  className="form-input"
                  placeholder="Enter Codeforces username"
                  value={platforms.codeforces}
                  onChange={handleUsernameChange}
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="github">
                  <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                    <GitHubLogo size={14} /> GitHub Username
                  </span>
                </label>
                <input
                  type="text"
                  id="github"
                  name="github"
                  className="form-input"
                  placeholder="Enter GitHub username"
                  value={platforms.github}
                  onChange={handleUsernameChange}
                />
              </div>
            </div>

            {/* Section: Institutional Details - STRICTLY READ ONLY */}
            <div style={{ marginBottom: '35px' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
                <Lock size={18} style={{ color: 'var(--text-muted)' }} />
                <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600, color: 'var(--text-secondary)' }}>
                  Institutional Details <span style={{ fontSize: '0.85rem', color: 'var(--text-muted)', fontWeight: 'normal', marginLeft: '6px' }}>(Read-Only)</span>
                </h3>
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="full_name_readonly">Full Name</label>
                <input
                  type="text"
                  id="full_name_readonly"
                  className="form-input"
                  value={profile.full_name}
                  disabled
                />
              </div>

              <div className="form-group">
                <label className="form-label" htmlFor="email_readonly">Email Address</label>
                <input
                  type="text"
                  id="email_readonly"
                  className="form-input"
                  value={profile.email}
                  disabled
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="roll_readonly">Roll Number</label>
                  <input
                    type="text"
                    id="roll_readonly"
                    className="form-input"
                    value={profile.roll_number}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="college_readonly">College</label>
                  <input
                    type="text"
                    id="college_readonly"
                    className="form-input"
                    value={profile.college}
                    disabled
                  />
                </div>
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label className="form-label" htmlFor="branch_readonly">Branch</label>
                  <input
                    type="text"
                    id="branch_readonly"
                    className="form-input"
                    value={profile.branch || 'Not Specified'}
                    disabled
                  />
                </div>
                <div className="form-group">
                  <label className="form-label" htmlFor="grad_readonly">Graduation Year</label>
                  <input
                    type="text"
                    id="grad_readonly"
                    className="form-input"
                    value={profile.graduation_year || 'Not Specified'}
                    disabled
                  />
                </div>
              </div>
            </div>

            <button
              type="submit"
              className="btn btn-primary btn-glow"
              style={{ width: '100%' }}
              disabled={saving}
            >
              {saving ? (
                'Saving Profile...'
              ) : (
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                  Save Platform Handles <Save size={16} />
                </span>
              )}
            </button>
          </form>

          {/* Connected Accounts Section */}
          <div style={{ marginTop: '40px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', marginBottom: '20px', borderBottom: '1px solid var(--border-color)', paddingBottom: '10px' }}>
              <Link2 size={18} style={{ color: 'var(--color-teal)' }} />
              <h3 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 600 }}>
                Connected Accounts
              </h3>
            </div>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0' }}>
              {['github', 'leetcode', 'codeforces'].map((p) => (
                <PlatformSyncStatus
                  key={p}
                  platform={p}
                  details={profile?.platform_details?.[p]}
                  onSynced={async () => {
                    const updated = await api.getMe();
                    setProfile(updated);
                    if (onUpdateUser) onUpdateUser(updated);
                  }}
                />
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
