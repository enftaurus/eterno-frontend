// Landing page with contest tracker
import { api } from '../utils/api.js';
import { auth } from '../utils/auth.js';

export const landingPage = {
  render() {
    return `
      <div class="landing-container">
        <div class="landing-left">
          <h1>Eterno</h1>
          <p>Never miss a programming contest again. Track contests from Codeforces, LeetCode, CodeChef, and AtCoder all in one place.</p>
          
          <div class="landing-cta">
            <button class="btn btn-primary btn-lg" onclick="app.navigateTo('signup')">Get Started</button>
            <button class="btn btn-outline btn-lg" onclick="app.navigateTo('login')">Sign In</button>
          </div>

          <div class="landing-features">
            <div class="landing-feature">
              <div class="landing-feature-icon">📊</div>
              <div class="landing-feature-text">
                <h3>Real-time Updates</h3>
                <p>Get instant notifications for new contests</p>
              </div>
            </div>
            <div class="landing-feature">
              <div class="landing-feature-icon">🎯</div>
              <div class="landing-feature-text">
                <h3>Multi-Platform</h3>
                <p>Track contests from your favorite platforms</p>
              </div>
            </div>
            <div class="landing-feature">
              <div class="landing-feature-icon">📱</div>
              <div class="landing-feature-text">
                <h3>Works Offline</h3>
                <p>Syncs data when you're back online</p>
              </div>
            </div>
          </div>
        </div>

        <div class="landing-right">
          <h3>Upcoming Contests</h3>
          <div class="contests-tracker" id="contestsList">
            <div class="flex-center" style="height: 300px;">
              <div class="loading"></div>
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
        list.innerHTML = '<p class="text-muted">No contests scheduled</p>';
        return;
      }

      list.innerHTML = contests.slice(0, 10).map(contest => `
        <div class="contest-card">
          <div class="contest-header">
            <span class="contest-platform">${contest.platform.toUpperCase()}</span>
          </div>
          <h4 class="contest-name">${contest.contest_name}</h4>
          <p class="contest-time">
            ${new Date(contest.start_time).toLocaleString()}
          </p>
          <span class="contest-duration">${contest.duration} minutes</span>
        </div>
      `).join('');
    } catch (error) {
      console.error('Failed to load contests:', error);
      document.getElementById('contestsList').innerHTML = `
        <div class="alert alert-error">
          <span>Failed to load contests. Check your connection.</span>
        </div>
      `;
    }
  },
};

export default landingPage;
