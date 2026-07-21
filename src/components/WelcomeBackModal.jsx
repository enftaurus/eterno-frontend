import React, { useEffect, useRef } from 'react';
import { X, Flame, Zap, Clock, Trophy } from 'lucide-react';

/**
 * WelcomeBackModal
 * ----------------
 * Shown after a successful login.
 * - First login: welcome message
 * - Returning user: streak, last login, developer score
 */
export default function WelcomeBackModal({ data, onClose }) {
  const overlayRef = useRef(null);

  useEffect(() => {
    const timer = setTimeout(onClose, 8000); // auto-close after 8s
    return () => clearTimeout(timer);
  }, [onClose]);

  const handleOverlayClick = (e) => {
    if (e.target === overlayRef.current) onClose();
  };

  if (!data) return null;

  const { full_name, is_first_login, current_streak, last_login, developer_score } = data;
  const firstName = (full_name || '').split(' ')[0] || 'Developer';

  const formatLastLogin = (ts) => {
    if (!ts) return 'First time!';
    const d = new Date(ts);
    const now = new Date();
    const diffMs = now - d;
    const diffH = Math.floor(diffMs / 3600000);
    const diffD = Math.floor(diffH / 24);
    if (diffD === 0) return diffH < 1 ? 'Just now' : `${diffH}h ago`;
    if (diffD === 1) return 'Yesterday';
    return d.toLocaleDateString('en-IN', { month: 'short', day: 'numeric' });
  };

  return (
    <div
      ref={overlayRef}
      className="welcome-modal-overlay"
      onClick={handleOverlayClick}
    >
      <div className="welcome-modal animate-modal-in">
        {/* Close button */}
        <button className="welcome-modal-close" onClick={onClose} aria-label="Close">
          <X size={18} />
        </button>

        {/* Header glow dot */}
        <div className="welcome-modal-glow" />

        {is_first_login ? (
          <>
            <div className="welcome-modal-icon" style={{ background: 'linear-gradient(135deg, var(--color-teal), var(--color-accent))' }}>
              <Trophy size={28} style={{ color: '#fff' }} />
            </div>
            <h2 className="welcome-modal-title">Welcome to Eterno!</h2>
            <p className="welcome-modal-subtitle">
              Let's begin building your developer journey, <strong style={{ color: 'var(--color-teal)' }}>{firstName}</strong>.
            </p>
            <p className="welcome-modal-hint">Link your LeetCode, GitHub & Codeforces to unlock your developer score.</p>
          </>
        ) : (
          <>
            <div className="welcome-modal-icon" style={{ background: 'linear-gradient(135deg, var(--color-orange), #f59e0b)' }}>
              <Flame size={28} style={{ color: '#fff' }} />
            </div>
            <h2 className="welcome-modal-title">Welcome back, {firstName}!</h2>

            <div className="welcome-modal-stats">
              <div className="welcome-stat-card">
                <Flame size={20} style={{ color: 'var(--color-orange)' }} />
                <div>
                  <div className="welcome-stat-value">{current_streak || 0} Days</div>
                  <div className="welcome-stat-label">Login Streak</div>
                </div>
              </div>

              <div className="welcome-stat-card">
                <Clock size={20} style={{ color: 'var(--color-teal)' }} />
                <div>
                  <div className="welcome-stat-value">{formatLastLogin(last_login)}</div>
                  <div className="welcome-stat-label">Last Login</div>
                </div>
              </div>

              <div className="welcome-stat-card">
                <Zap size={20} style={{ color: 'var(--color-accent)' }} />
                <div>
                  <div className="welcome-stat-value">{(developer_score || 0).toLocaleString()}</div>
                  <div className="welcome-stat-label">Developer Score</div>
                </div>
              </div>
            </div>
          </>
        )}

        {/* Progress bar to auto-close */}
        <div className="welcome-modal-timer">
          <div className="welcome-modal-timer-bar" />
        </div>
      </div>
    </div>
  );
}
