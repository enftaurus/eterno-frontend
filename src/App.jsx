import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate, Link } from 'react-router-dom';
import Navbar from './components/Navbar';
import LandingPage from './pages/LandingPage';
import SignupPage from './pages/SignupPage';
import OtpVerifyPage from './pages/OtpVerifyPage';
import LoginPage from './pages/LoginPage';
import ProfilePage from './pages/ProfilePage';
import DashboardPage from './pages/DashboardPage';
import ContestsCalendarPage from './pages/ContestsCalendarPage';
import { api } from './services/api';

export default function App() {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function checkAuth() {
      try {
        const profile = await api.getMe();
        setUser(profile);
      } catch (err) {
        // Not authenticated or session expired - keep user state null
        console.log('User not authenticated:', err.message);
      } finally {
        setLoading(false);
      }
    }
    checkAuth();
  }, []);

  const handleLogin = (profile) => {
    setUser(profile);
  };

  const handleLogout = () => {
    setUser(null);
  };

  const handleUpdateUser = (updatedProfile) => {
    setUser(updatedProfile);
  };

  if (loading) {
    return (
      <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh', backgroundColor: 'var(--bg-deep)' }}>
        <div className="spinner"></div>
      </div>
    );
  }

  return (
    <Router>
      <Navbar user={user} onLogout={handleLogout} />
      
      <main style={{ flex: 1, display: 'flex', flexDirection: 'column' }}>
        <Routes>
          {/* Public Routes */}
          <Route path="/" element={<LandingPage />} />
          
          {/* Auth Routes - Redirect to dashboard if logged in */}
          <Route 
            path="/signup" 
            element={user ? <Navigate to="/dashboard" replace /> : <SignupPage />} 
          />
          <Route 
            path="/verify-otp" 
            element={user ? <Navigate to="/dashboard" replace /> : <OtpVerifyPage />} 
          />
          <Route 
            path="/login" 
            element={user ? <Navigate to="/dashboard" replace /> : <LoginPage onLogin={handleLogin} />} 
          />

          {/* Protected Routes */}
          <Route 
            path="/profile" 
            element={
              user ? (
                <ProfilePage user={user} onUpdateUser={handleUpdateUser} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />
          
          <Route 
            path="/calendar" 
            element={<ContestsCalendarPage />} 
          />
          
          <Route 
            path="/dashboard" 
            element={
              user ? (
                <DashboardPage user={user} />
              ) : (
                <Navigate to="/login" replace />
              )
            } 
          />

          {/* Catch-all Fallback */}
          <Route path="*" element={<Navigate to="/" replace />} />
        </Routes>
      </main>

      {/* Footer */}
      <footer className="footer">
        <div className="container">
          <div className="footer-links">
            <Link to="/" className="footer-link">Home</Link>
            <a href="https://takeuforward.org/strivers-a2z-dsa-course-sheet-instructions/" target="_blank" rel="noopener noreferrer" className="footer-link">DSA Sheet</a>
            <Link to="/dashboard" className="footer-link">Dashboard</Link>
          </div>

          {/* Contact Section */}
          <div className="footer-contact">
            <span className="footer-contact-label">Need help?</span>
            <a href="mailto:valyrianminds@zohomail.in" className="footer-contact-link">
              Contact Us — valyrianminds@zohomail.in
            </a>
          </div>

          <p className="footer-copy">
            © {new Date().getFullYear()} Eterno · Built with ❤️ by <span style={{ color: 'var(--color-teal)' }}>Valyrian Minds</span>
          </p>
        </div>
      </footer>
    </Router>
  );
}
