import React, { useState } from 'react';
import { Link, useNavigate, useLocation } from 'react-router-dom';
import { LogIn, ArrowRight } from 'lucide-react';
import { api } from '../services/api';

export default function LoginPage({ onLogin }) {
  const navigate = useNavigate();
  const location = useLocation();

  // If redirected from verification, grab the roll number
  const initialRollNumber = location.state?.roll_number || '';

  const [rollNumber, setRollNumber] = useState(initialRollNumber);
  const [password, setPassword] = useState('');
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setLoading(true);

    try {
      // 1. Log in. Sets HttpOnly cookie access_token.
      await api.login(rollNumber.trim(), password);

      // 2. Fetch profile data using /auth/me
      const profile = await api.getMe();

      // 3. Update top-level application state
      onLogin(profile);

      // 4. Redirect based on profile completion status
      if (profile.profile_complete) {
        navigate('/dashboard');
      } else {
        navigate('/profile');
      }
    } catch (err) {
      console.error(err);
      setError(err.message || 'Login failed. Please check your credentials.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container animate-fade">
      <div className="card auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-dot"></span>
            Eterno
          </Link>
          <h2 className="auth-title">Welcome Back</h2>
          <p className="auth-subtitle">Sign in to check your coding progress and leaderboard rankings</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="roll_number">Roll Number</label>
            <input
              type="text"
              id="roll_number"
              className="form-input"
              placeholder="e.g. 21881A0501"
              value={rollNumber}
              onChange={(e) => setRollNumber(e.target.value)}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              className="form-input"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-glow"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading}
          >
            {loading ? (
              'Logging In...'
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Log In <LogIn size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="form-footer">
          Don't have an account?{' '}
          <Link to="/signup" className="form-link">
            Register
          </Link>
        </div>
      </div>
    </div>
  );
}
