import React, { useState, useEffect, useRef } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import { CheckCircle, Key, RefreshCw } from 'lucide-react';
import { api } from '../services/api';

export default function OtpVerifyPage() {
  const navigate = useNavigate();
  const location = useLocation();
  
  // Retrieve roll number from state if available
  const initialRollNumber = location.state?.roll_number || '';
  
  const [rollNumber, setRollNumber] = useState(initialRollNumber);
  const [otp, setOtp] = useState(new Array(6).fill(''));
  const [error, setError] = useState(null);
  const [success, setSuccess] = useState(null);
  const [loading, setLoading] = useState(false);

  // References for OTP input elements for auto-focus control
  const inputRefs = useRef([]);

  useEffect(() => {
    // Focus first input box on load
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (element, index) => {
    const value = element.value;
    if (isNaN(value)) return; // Allow only numbers

    const newOtp = [...otp];
    // Take only the last character (prevents multiple characters inside one cell)
    newOtp[index] = value.substring(value.length - 1);
    setOtp(newOtp);

    // Focus next input box if typed
    if (value && index < 5 && inputRefs.current[index + 1]) {
      inputRefs.current[index + 1].focus();
    }
  };

  const handleKeyDown = (e, index) => {
    // Move to previous box on Backspace
    if (e.key === 'Backspace' && !otp[index] && index > 0 && inputRefs.current[index - 1]) {
      inputRefs.current[index - 1].focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text').trim();
    if (pastedData.length === 6 && !isNaN(pastedData)) {
      const pasteArray = pastedData.split('');
      setOtp(pasteArray);
      inputRefs.current[5].focus();
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(null);
    setSuccess(null);

    const otpCode = otp.join('');
    if (otpCode.length !== 6) {
      setError('Please enter the full 6-digit OTP.');
      return;
    }

    if (!rollNumber.trim()) {
      setError('Please provide your Roll Number.');
      return;
    }

    setLoading(true);
    try {
      const resp = await api.verifyOtp(rollNumber.trim(), otpCode);
      setSuccess(resp.message || 'OTP Verified Successfully! Redirecting to login...');
      setTimeout(() => {
        navigate('/login', { state: { roll_number: rollNumber.trim() } });
      }, 2500);
    } catch (err) {
      console.error(err);
      setError(err.message || 'Verification failed. Please check the OTP and try again.');
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
          <h2 className="auth-title">Verify OTP</h2>
          <p className="auth-subtitle">
            Enter the 6-digit OTP code sent to{' '}
            <strong style={{ color: 'var(--color-teal)' }}>
              {rollNumber ? `${rollNumber}@vce.ac.in` : 'your email'}
            </strong>
          </p>
        </div>

        {error && (
          <div className="alert alert-error">
            <span>{error}</span>
          </div>
        )}

        {success && (
          <div className="alert alert-success">
            <CheckCircle size={16} />
            <span>{success}</span>
          </div>
        )}

        <form onSubmit={handleSubmit}>
          {!initialRollNumber && (
            <div className="form-group">
              <label className="form-label" htmlFor="roll_number">Confirm Roll Number</label>
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
          )}

          <div className="form-group">
            <label className="form-label" style={{ textAlign: 'center' }}>6-Digit Verification Code</label>
            <div className="otp-inputs" onPaste={handlePaste}>
              {otp.map((digit, idx) => (
                <input
                  key={idx}
                  type="text"
                  maxLength={1}
                  className="otp-box"
                  value={digit}
                  ref={(el) => (inputRefs.current[idx] = el)}
                  onChange={(e) => handleOtpChange(e.target, idx)}
                  onKeyDown={(e) => handleKeyDown(e, idx)}
                />
              ))}
            </div>
          </div>

          <button
            type="submit"
            className="btn btn-primary btn-glow"
            style={{ width: '100%', marginTop: '10px' }}
            disabled={loading || success}
          >
            {loading ? (
              'Verifying...'
            ) : (
              <span style={{ display: 'inline-flex', alignItems: 'center', gap: '8px' }}>
                Verify Code <Key size={16} />
              </span>
            )}
          </button>
        </form>

        <div className="form-footer">
          Didn't receive the code?{' '}
          <Link to="/signup" className="form-link">
            Restart Registration
          </Link>
        </div>
      </div>
    </div>
  );
}
