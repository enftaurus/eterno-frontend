import React, { useEffect, useState } from 'react';
import { api } from '../services/api';
import { Calendar as CalendarIcon, Clock, ExternalLink, Filter, ChevronLeft, ChevronRight, X } from 'lucide-react';
import { LeetCodeLogo, CodeforcesLogo, GitHubLogo, AtCoderLogo } from '../components/Logos';

export default function ContestsCalendarPage() {
  const [contests, setContests] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [filter, setFilter] = useState('all');
  
  // Modal state for active selected day details
  const [selectedDayData, setSelectedDayData] = useState(null);

  // Month navigation - default to current calendar month
  const today = new Date();
  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth()); // 0-indexed

  useEffect(() => {
    async function loadContests() {
      try {
        const data = await api.getContestsThisMonth();
        setContests(data || []);
      } catch (err) {
        console.error(err);
        setError('Could not load upcoming contests. Make sure the backend is running!');
      } finally {
        setLoading(false);
      }
    }
    loadContests();
  }, []);

  const getPlatformIcon = (platform, size = 16) => {
    const p = platform.toLowerCase();
    if (p.includes('leetcode')) return <LeetCodeLogo size={size} />;
    if (p.includes('codeforces')) return <CodeforcesLogo size={size} />;
    if (p.includes('github')) return <GitHubLogo size={size} />;
    if (p.includes('atcoder')) return <AtCoderLogo size={size} />;
    return null;
  };

  const getPlatformClass = (platform) => {
    const p = platform.toLowerCase();
    if (p.includes('leetcode')) return 'tag-mini-leetcode';
    if (p.includes('codeforces')) return 'tag-mini-codeforces';
    if (p.includes('github')) return 'tag-mini-github';
    if (p.includes('atcoder')) return 'tag-mini-atcoder';
    return '';
  };

  const formatDuration = (seconds) => {
    const hrs = Math.floor(seconds / 3600);
    const mins = Math.floor((seconds % 3600) / 60);
    if (hrs > 0) {
      return `${hrs}h ${mins > 0 ? `${mins}m` : ''}`;
    }
    return `${mins}m`;
  };

  // Monthly Calendar Grid calculations
  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayIndex = new Date(currentYear, currentMonth, 1).getDay(); // Weekday index of first day

  // Get previous month info for padded cells
  const prevMonthDays = new Date(currentYear, currentMonth, 0).getDate();

  const calendarDays = [];

  // 1. Previous month padding cells
  for (let i = firstDayIndex - 1; i >= 0; i--) {
    calendarDays.push({
      day: prevMonthDays - i,
      monthOffset: -1,
      date: new Date(currentYear, currentMonth - 1, prevMonthDays - i),
    });
  }

  // 2. Current month cells
  for (let i = 1; i <= daysInMonth; i++) {
    calendarDays.push({
      day: i,
      monthOffset: 0,
      date: new Date(currentYear, currentMonth, i),
    });
  }

  // 3. Next month padding cells to complete the 7-column grid
  const remainingCells = 42 - calendarDays.length; // standard 6-row grid
  for (let i = 1; i <= remainingCells; i++) {
    calendarDays.push({
      day: i,
      monthOffset: 1,
      date: new Date(currentYear, currentMonth + 1, i),
    });
  }

  // Helper to filter and group contests by date
  const getContestsForDay = (date) => {
    return contests.filter(contest => {
      const contestDate = new Date(contest.start_time);
      
      // Compare dates ignoring times
      const isSameDate = contestDate.getDate() === date.getDate() &&
                         contestDate.getMonth() === date.getMonth() &&
                         contestDate.getFullYear() === date.getFullYear();

      if (!isSameDate) return false;

      // Apply platform filtering
      if (filter === 'all') return true;
      return contest.platform.toLowerCase().includes(filter.toLowerCase());
    });
  };

  const handleDayClick = (dayObj, dayContests) => {
    if (dayContests.length > 0) {
      setSelectedDayData({
        date: dayObj.date,
        contests: dayContests
      });
    }
  };

  const formatModalDate = (date) => {
    return date.toLocaleDateString('en-US', { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric' });
  };

  return (
    <div className="container animate-fade" style={{ paddingBottom: '60px' }}>
      <header className="calendar-layout-header">
        <div>
          <span className="striver-tag" style={{ background: 'var(--color-teal)', color: '#08090c' }}>Contest Tracker</span>
          <h1 className="calendar-page-title">{monthNames[currentMonth]} {currentYear}</h1>
          <p style={{ color: 'var(--text-secondary)', fontSize: '0.95rem', marginTop: '6px' }}>
            Interactive coding calendar showing scheduled platform contests
          </p>
        </div>

        {/* Platform filters */}
        <div className="platform-filters">
          {['all', 'leetcode', 'codeforces', 'atcoder'].map((platform) => (
            <button
              key={platform}
              onClick={() => setFilter(platform)}
              className={`filter-btn ${filter === platform ? 'active' : ''}`}
            >
              {platform !== 'all' && getPlatformIcon(platform)}
              {platform.charAt(0).toUpperCase() + platform.slice(1)}
            </button>
          ))}
        </div>
      </header>

      {error && (
        <div className="alert alert-error">
          <span>{error}</span>
        </div>
      )}

      {loading ? (
        <div className="spinner"></div>
      ) : (
        <div className="calendar-grid-wrapper">
          {/* Weekday headers */}
          <div className="calendar-grid-header">
            {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
              <div key={day} className="calendar-header-cell">{day}</div>
            ))}
          </div>

          {/* Monthly grid */}
          <div className="calendar-grid-body">
            {calendarDays.map((dayObj, index) => {
              const dayContests = getContestsForDay(dayObj.date);
              const isToday = dayObj.monthOffset === 0 &&
                              dayObj.day === today.getDate() &&
                              currentMonth === today.getMonth() &&
                              currentYear === today.getFullYear();
              
              const isOtherMonth = dayObj.monthOffset !== 0;

              return (
                <div
                  key={index}
                  className={`calendar-day-cell ${isToday ? 'today-cell' : ''} ${isOtherMonth ? 'other-month' : ''}`}
                  onClick={() => !isOtherMonth && handleDayClick(dayObj, dayContests)}
                >
                  <span className="calendar-day-number">{dayObj.day}</span>
                  
                  <div className="calendar-day-contests-list">
                    {dayContests.slice(0, 3).map((contest) => (
                      <div
                        key={contest.id}
                        className={`calendar-contest-tag ${getPlatformClass(contest.platform)}`}
                        title={contest.contest_name}
                      >
                        {getPlatformIcon(contest.platform, 10)}
                        {contest.contest_name}
                      </div>
                    ))}
                    {dayContests.length > 3 && (
                      <div className="more-indicator">
                        +{dayContests.length - 3} more
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* Contest Detail Modal */}
      {selectedDayData && (
        <div className="modal-overlay" onClick={() => setSelectedDayData(null)}>
          <div className="modal-content-panel" onClick={(e) => e.stopPropagation()}>
            <div className="modal-header-section">
              <h3 className="modal-title-text">
                Contests on {formatModalDate(selectedDayData.date)}
              </h3>
              <button className="modal-close-btn" onClick={() => setSelectedDayData(null)}>
                <X size={18} />
              </button>
            </div>
            
            <div className="modal-body-list">
              {selectedDayData.contests.map((contest) => (
                <div key={contest.id} className="modal-contest-item">
                  <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '12px' }}>
                    <span 
                      className={`contest-platform-tag ${
                        contest.platform.toLowerCase().includes('leetcode') ? 'tag-leetcode' :
                        contest.platform.toLowerCase().includes('codeforces') ? 'tag-codeforces' :
                        contest.platform.toLowerCase().includes('github') ? 'tag-github' : 'tag-atcoder'
                      }`}
                      style={{ margin: 0 }}
                    >
                      {getPlatformIcon(contest.platform)}
                      {contest.platform}
                    </span>
                    <span style={{ fontSize: '0.8rem', color: 'var(--text-muted)', fontFamily: 'var(--font-mono)' }}>
                      Duration: {formatDuration(contest.duration)}
                    </span>
                  </div>

                  <h4 style={{ fontSize: '1.05rem', fontWeight: 600, marginBottom: '12px', lineHeight: 1.4 }}>
                    {contest.contest_name}
                  </h4>

                  <div style={{ display: 'flex', gap: '12px', alignItems: 'center', fontSize: '0.85rem', color: 'var(--text-secondary)', marginBottom: '16px' }}>
                    <Clock size={14} style={{ color: 'var(--color-teal)' }} />
                    <span>
                      Start: {new Date(contest.start_time).toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>

                  <a
                    href={contest.contest_url}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="btn btn-primary"
                    style={{ width: '100%', padding: '8px 12px', fontSize: '0.85rem' }}
                  >
                    Go to Platform <ExternalLink size={14} />
                  </a>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
