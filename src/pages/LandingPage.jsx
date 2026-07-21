import React from 'react';
import { Link } from 'react-router-dom';
import { LogIn, UserPlus, Calendar, ChevronRight, BookOpen, Info } from 'lucide-react';

export default function LandingPage() {
  return (
    <div className="container animate-fade" style={{ display: 'flex', flexDirection: 'column', minHeight: 'calc(100vh - 160px)', justifyContent: 'center' }}>
      <section className="landing-hero">
        <div className="hero-gradient-overlay"></div>
        
        <span className="striver-tag" style={{ background: 'var(--color-teal-glow)', color: 'var(--color-teal)', border: '1px solid var(--color-teal)' }}>
          Now in Open Beta
        </span>

        <h1 className="landing-title">
          Gamify Your Coding. Stand Out in College.
        </h1>
        
        <p className="landing-subtitle">
          Eterno tracks your LeetCode, Codeforces, and GitHub stats to calculate your developer score. Compete with branch peers and master your engineering potential.
        </p>

        {/* Primary CTA Buttons: Login, Register, Calendar */}
        <div className="landing-cta-container">
          <Link to="/login" className="btn btn-secondary" style={{ minWidth: '150px' }}>
            <LogIn size={18} /> Log In
          </Link>
          
          <Link to="/signup" className="btn btn-primary btn-glow" style={{ minWidth: '150px' }}>
            <UserPlus size={18} /> Register <ChevronRight size={16} />
          </Link>
          
          <Link to="/calendar" className="btn btn-secondary" style={{ minWidth: '150px', borderColor: 'var(--color-teal)' }}>
            <Calendar size={18} style={{ color: 'var(--color-teal)' }} /> Contest Tracker
          </Link>
        </div>
      </section>

      {/* Structured Card explaining what this is */}
      <section className="card landing-info-card animate-float">
        <div style={{ display: 'flex', gap: '16px', alignItems: 'flex-start' }}>
          <div style={{ backgroundColor: 'var(--color-teal-glow)', color: 'var(--color-teal)', padding: '10px', borderRadius: '8px' }}>
            <Info size={24} />
          </div>
          <div>
            <h3>What is Eterno?</h3>
            <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', lineHeight: '1.6' }}>
              We believe engineering development should feel like a game. By linking your profiles, 
              Eterno ranks you on college-wide leaderboards, showcases your daily coding streak, and suggests resources 
              to help you bridge the gap between where you stand and what is needed to unlock your dream placement.
            </p>
          </div>
        </div>
      </section>

      {/* Striver's sheet link as a clean secondary section */}
      <section className="striver-card" style={{ padding: '24px 30px', marginTop: '40px', marginBottom: '20px' }}>
        <div className="striver-info">
          <span className="striver-tag" style={{ margin: 0, padding: '2px 8px', fontSize: '0.7rem' }}>DSA Prep</span>
          <h4 style={{ fontFamily: 'var(--font-heading)', fontSize: '1.25rem', fontWeight: 700, margin: '8px 0 4px 0' }}>
            Looking for structured DSA development?
          </h4>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.9rem' }}>
            We recommend Striver's A2Z DSA sheet. It is one of the best structured resources for placement prep.
          </p>
        </div>
        <a 
          href="https://takeuforward.org/strivers-a2z-dsa-course-sheet-instructions/" 
          target="_blank" 
          rel="noopener noreferrer" 
          className="btn btn-secondary"
          style={{ fontSize: '0.85rem', padding: '8px 16px' }}
        >
          <BookOpen size={16} /> Open DSA Sheet
        </a>
      </section>
    </div>
  );
}
