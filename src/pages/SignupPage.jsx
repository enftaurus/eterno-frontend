import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ArrowRight, UserPlus, Info } from 'lucide-react';
import { api } from '../services/api';

export default function SignupPage() {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    full_name: '',
    roll_number: '',
    college: 'Vardhaman College of Engineering', // Default college as vce.ac.in email is used
    branch: '',
    graduation_year: '',
    password: '',
    confirm_password: '',
  });
  
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);

    if (formData.password !== formData.confirm_password) {
      setError("Passwords do not match");
      return;
    }

    setLoading(true);
    try {
      const payload = {
        full_name: formData.full_name,
        roll_number: formData.roll_number.trim(),
        college: formData.college,
        branch: formData.branch || null,
        graduation_year: formData.graduation_year ? parseInt(formData.graduation_year) : null,
        password: formData.password,
        confirm_password: formData.confirm_password,
      };

      await api.signup(payload);
      // Success - Redirect to OTP verification page and pass the roll number
      navigate('/verify-otp', { state: { roll_number: formData.roll_number.trim() } });
    } catch (err) {
      console.error(err);
      setError(err.message || 'Signup failed. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const derivedEmail = formData.roll_number 
    ? `${formData.roll_number.trim()}@vce.ac.in` 
    : 'your-roll-number@vce.ac.in';

  return (
    <div className="auth-container animate-fade">
      <div className="card auth-card">
        <div className="auth-header">
          <Link to="/" className="auth-logo">
            <span className="auth-logo-dot"></span>
            Eterno
          </Link>
          <h2 className="auth-title">Create Account</h2>
          <p className="auth-subtitle">Join college coding leaderboard and start leveling up</p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          <div className="form-group">
            <label className="form-label" htmlFor="full_name">Full Name</label>
            <input
              type="text"
              id="full_name"
              name="full_name"
              className="form-input"
              placeholder="John Doe"
              value={formData.full_name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="roll_number">Roll Number</label>
            <input
              type="text"
              id="roll_number"
              name="roll_number"
              className="form-input"
              placeholder="e.g. 21881A0501"
              value={formData.roll_number}
              onChange={handleChange}
              required
            />
            <div style={{ display: 'flex', alignItems: 'center', gap: '6px', marginTop: '6px', fontSize: '0.8rem', color: 'var(--text-muted)' }}>
              <Info size={12} />
              <span>Email: <strong style={{ color: 'var(--color-teal)' }}>{derivedEmail}</strong></span>
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="college">College</label>
            <input
              type="text"
              id="college"
              name="college"
              className="form-input"
              value={formData.college}
              onChange={handleChange}
              required
            />
          </div>

          <div className="form-row">
            <div className="form-group">
              <label className="form-label" htmlFor="branch">Branch (Optional)</label>
              <input
                type="text"
                id="branch"
                name="branch"
                className="form-input"
                placeholder="e.g. CSE"
                value={formData.branch}
                onChange={handleChange}
              />
            </div>
            <div className="form-group">
              <label className="form-label" htmlFor="graduation_year">Grad Year (Optional)</label>
              <input
                type="number"
                id="graduation_year"
                name="graduation_year"
                className="form-input"
                placeholder="e.g. 2025"
                value={formData.graduation_year}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="password">Password</label>
            <input
              type="password"
              id="password"
              name="password"
              className="form-input"
              placeholder="At least 8 characters"
              value={formData.password}
              onChange={handleChange}
              required
              minLength={8}
            />
          </div>

          <div className="form-group">
            <label className="form-label" htmlFor="confirm_password">Confirm Password</label>
            <input
              type="password"
              id="confirm_password"
              name="confirm_password"
              className="form-input"
              placeholder="Re-enter password"
              value={formData.confirm_password}
              onChange={handleChange}
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
              'Creating Account...'
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Register <ArrowRight size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="form-footer">
          Already have an account?{' '}
          <Link to="/login" className="form-link">
            Log In
          </Link>
        </div>
      </div>
    </div>
  );
}
