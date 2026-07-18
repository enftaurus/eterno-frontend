// Dashboard page with sidebar
import { api } from '../utils/api.js';
import { auth } from '../utils/auth.js';

export const dashboardPage = {
  render() {
    return `
      <div class="dashboard-wrapper">
        <div class="sidebar">
          <div class="sidebar-header">
            <div class="sidebar-logo">Eterno</div>
          </div>
          
          <div class="sidebar-menu">
            <a class="sidebar-item active" onclick="app.navigateTo('dashboard')">
              <span class="sidebar-item-icon">🏠</span>
              <span>Dashboard</span>
            </a>
            <a class="sidebar-item" onclick="app.navigateTo('profile')">
              <span class="sidebar-item-icon">👤</span>
              <span>Complete Profile</span>
            </a>
            <a class="sidebar-item" onclick="app.navigateTo('contests')">
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
            <h2>Dashboard</h2>
            <div id="userInfo"></div>
          </div>

          <div class="page-content">
            <div class="container">
              <h3>Welcome back!</h3>
              <p style="margin-top: 20px; color: var(--gray-600);">
                Your dashboard is ready. Complete your profile to get personalized contest recommendations.
              </p>
              
              <button class="btn btn-primary btn-lg" onclick="app.navigateTo('profile')" style="margin-top: 24px;">
                ➜ Complete Your Profile
              </button>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    const rollNumber = auth.getRollNumber();
    const userInfo = document.getElementById('userInfo');
    if (rollNumber) {
      userInfo.innerHTML = `<span>${rollNumber}</span>`;
    }
  },
};

export default dashboardPage;
