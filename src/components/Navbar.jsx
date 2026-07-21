import React from 'react';
import { Link, NavLink, useNavigate } from 'react-router-dom';
import { LogOut, User, Trophy, BookOpen, Calendar } from 'lucide-react';
import { api } from '../services/api';

export default function Navbar({ user, onLogout }) {
  const navigate = useNavigate();

  const handleLogout = async () => {
    try {
      await api.logout();
      onLogout();
      navigate('/');
    } catch (err) {
      console.error('Logout failed:', err);
    }
  };

  return (
    <nav className="navbar">
      <div className="container nav-container">
        <Link to="/" className="nav-logo">
          <span className="auth-logo-dot"></span>
          Eterno
        </Link>
        
        <div className="nav-links">
          <NavLink 
            to="/" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
            end
          >
            Home
          </NavLink>
          
          <NavLink 
            to="/dashboard" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Trophy size={16} /> Dashboard
            </span>
          </NavLink>
          
          <NavLink 
            to="/calendar" 
            className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
          >
            <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
              <Calendar size={16} /> Contest Calendar
            </span>
          </NavLink>

          <a 
            href="https://takeuforward.org/strivers-a2z-dsa-course-sheet-instructions/" 
            target="_blank" 
            rel="noopener noreferrer" 
            className="nav-link"
            style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}
          >
            <BookOpen size={16} /> Striver's Sheet
          </a>

          {user ? (
            <>
              <NavLink 
                to="/profile" 
                className={({ isActive }) => `nav-link ${isActive ? 'active' : ''}`}
              >
                <span style={{ display: 'inline-flex', alignItems: 'center', gap: '4px' }}>
                  <User size={16} /> Profile ({user.full_name.split(' ')[0]})
                </span>
              </NavLink>
              <button 
                onClick={handleLogout} 
                className="btn btn-secondary"
                style={{ padding: '6px 12px', fontSize: '0.85rem' }}
              >
                <LogOut size={14} /> Sign Out
              </button>
            </>
          ) : (
            <>
              <Link to="/login" className="nav-link">Log In</Link>
              <Link to="/signup" className="btn btn-primary" style={{ padding: '8px 16px', fontSize: '0.85rem' }}>
                Register
              </Link>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
