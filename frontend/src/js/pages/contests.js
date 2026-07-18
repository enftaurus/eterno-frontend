// Contests page
import { api } from '../utils/api.js';

export const contestsPage = {
  render() {
    return `
      <div class="dashboard-wrapper">
        <div class="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-logo">Eterno</div>
          </div>
          
          <div class="sidebar-menu">
            <a class="sidebar-item" onclick="app.navigateTo('dashboard')">
              <span class="sidebar-item-icon">🏠</span>
              <span>Dashboard</span>
            </a>
            <a class="sidebar-item" onclick="app.navigateTo('profile')">
              <span class="sidebar-item-icon">👤</span>
              <span>Complete Profile</span>
            </a>
            <a class="sidebar-item active" onclick="app.navigateTo('contests')">
              <span class="sidebar-item-icon">🎯</span>
              <span>Contests</span>
            </a>
          </div>

          <div class="sidebar-footer">
            <a class="sidebar-item" onclick="app.handleLogout()">
              <span class="sidebar-item-icon">🚪</span>
              <span>Logout</span>
            </a>
          </div>
        </div>

        <div class="main-content">
          <div class="top-bar">
            <h2>Upcoming Contests</h2>
          </div>

          <div class="page-content">
            <div class="container">
              <div id="contestsList" style="display: grid; grid-template-columns: repeat(auto-fill, minmax(300px, 1fr)); gap: 20px;">
                <div class="flex-center" style="grid-column: 1/-1; height: 300px;">
                  <div class="loading"></div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    await this.loadContests();
  },

  async loadContests() {
    try {
      const contests = await api.getContests();
      const list = document.getElementById('contestsList');
      
      if (!contests || contests.length === 0) {
        list.innerHTML = '<p class="text-muted" style="grid-column: 1/-1;">No contests scheduled</p>';
        return;
      }

      list.innerHTML = contests.map(contest => `
        <div class="card">
          <div style="display: flex; justify-content: space-between; align-items: start; margin-bottom: 12px;">
            <span class="contest-platform">${contest.platform.toUpperCase()}</span>
            ${contest.has_solution_video ? '<span class="contest-platform" style="background: #D1FAE5; color: #065F46;">📹 Solutions</span>' : ''}
          </div>
          <h4 class="contest-name">${contest.contest_name}</h4>
          <p class="contest-time" style="margin: 12px 0;">
            📅 ${new Date(contest.start_time).toLocaleString()}
          </p>
          <p class="text-sm" style="color: var(--gray-500);">
            ⏱️ Duration: ${contest.duration} minutes
          </p>
          <a href="${contest.contest_url}" target="_blank" class="btn btn-primary btn-sm" style="margin-top: 12px; width: 100%;">
            View Contest
          </a>
        </div>
      `).join('');
    } catch (error) {
      console.error('Failed to load contests:', error);
      document.getElementById('contestsList').innerHTML = `
        <div class="alert alert-error" style="grid-column: 1/-1;">
          <span>Failed to load contests. Check your connection.</span>
        </div>
      `;
    }
  },
};

export default contestsPage;
