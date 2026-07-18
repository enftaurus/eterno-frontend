// Profile page with platform username input
import { api } from '../utils/api.js';
import { auth } from '../utils/auth.js';

export const profilePage = {
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
            <a class="sidebar-item active" onclick="app.navigateTo('profile')">
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
            <h2>Complete Your Profile</h2>
          </div>

          <div class="page-content">
            <div class="container">
              <div class="card profile-card">
                <div id="profileAlert"></div>

                <div class="profile-section">
                  <h3>Platform Usernames</h3>
                  <p style="margin-bottom: 20px; color: var(--gray-600);">
                    Add your usernames to get personalized contest recommendations
                  </p>

                  <form id="platformForm">
                    <div class="form-group">
                      <label for="leetcode">LeetCode Username</label>
                      <input type="text" id="leetcode" name="leetcode" placeholder="your-leetcode-username">
                    </div>

                    <div class="form-group">
                      <label for="codeforces">Codeforces Username</label>
                      <input type="text" id="codeforces" name="codeforces" placeholder="your-codeforces-username">
                    </div>

                    <div class="form-group">
                      <label for="github">GitHub Username</label>
                      <input type="text" id="github" name="github" placeholder="your-github-username">
                    </div>

                    <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Save Profile</button>
                  </form>
                </div>

                <div class="profile-section">
                  <h3>Your Information</h3>
                  <div class="profile-grid">
                    <div class="profile-info">
                      <div class="profile-info-label">Roll Number</div>
                      <div class="profile-info-value" id="profileRollNumber">-</div>
                    </div>
                    <div class="profile-info">
                      <div class="profile-info-label">Email</div>
                      <div class="profile-info-value" id="profileEmail">-</div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    `;
  },

  async init() {
    const form = document.getElementById('platformForm');
    const rollNumber = auth.getRollNumber();

    // Set roll number and email
    document.getElementById('profileRollNumber').textContent = rollNumber;
    document.getElementById('profileEmail').textContent = `${rollNumber}@vce.ac.in`;

    // Load existing platforms
    await this.loadProfile();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSavePlatforms();
    });
  },

  async loadProfile() {
    try {
      const profile = await api.getProfile();
      
      if (profile.leetcode) document.getElementById('leetcode').value = profile.leetcode;
      if (profile.codeforces) document.getElementById('codeforces').value = profile.codeforces;
      if (profile.github) document.getElementById('github').value = profile.github;
    } catch (error) {
      console.error('Failed to load profile:', error);
    }
  },

  async handleSavePlatforms() {
    const alertDiv = document.getElementById('profileAlert');
    const form = document.getElementById('platformForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
      alertDiv.innerHTML = '';
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Saving...';

      const platforms = {
        leetcode: document.getElementById('leetcode').value || null,
        codeforces: document.getElementById('codeforces').value || null,
        github: document.getElementById('github').value || null,
      };

      const response = await api.savePlatforms(platforms);

      alertDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>Success!</strong> Your profile has been updated
        </div>
      `;

      setTimeout(() => {
        alertDiv.innerHTML = '';
      }, 3000);

    } catch (error) {
      alertDiv.innerHTML = `
        <div class="alert alert-error">
          <strong>Error:</strong> ${error.message}
        </div>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Save Profile';
    }
  },
};

export default profilePage;
