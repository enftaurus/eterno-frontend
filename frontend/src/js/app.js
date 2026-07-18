// Main app router and controller
import { auth } from './utils/auth.js';
import { api } from './utils/api.js';

// Import pages
import { landingPage } from './pages/landing.js';
import { signupPage } from './pages/signup.js';
import { verifyOtpPage } from './pages/verify-otp.js';
import { loginPage } from './pages/login.js';
import { dashboardPage } from './pages/dashboard.js';
import { profilePage } from './pages/profile.js';
import { forgotPasswordPage } from './pages/forgot-password.js';
import { contestsPage } from './pages/contests.js';

class App {
  constructor() {
    this.currentPage = null;
    this.pages = {
      landing: landingPage,
      signup: signupPage,
      'verify-otp': verifyOtpPage,
      login: loginPage,
      dashboard: dashboardPage,
      profile: profilePage,
      'forgot-password': forgotPasswordPage,
      contests: contestsPage,
    };
  }

  init() {
    // Check auth status and route accordingly
    if (auth.isAuthenticated()) {
      this.navigateTo('dashboard');
    } else {
      this.navigateTo('landing');
    }

    // Handle browser back/forward buttons
    window.addEventListener('popstate', (e) => {
      if (e.state && e.state.page) {
        this.renderPage(e.state.page, false);
      }
    });
  }

  navigateTo(pageName) {
    // Check if page requires authentication
    const protectedPages = ['dashboard', 'profile', 'contests'];
    
    if (protectedPages.includes(pageName) && !auth.isAuthenticated()) {
      this.navigateTo('login');
      return;
    }

    // Redirect authenticated users away from auth pages
    if (!auth.isAuthenticated() && ['dashboard', 'profile', 'contests'].includes(pageName)) {
      this.navigateTo('landing');
      return;
    }

    this.renderPage(pageName);
    
    // Add to history
    window.history.pushState({ page: pageName }, '', `#${pageName}`);
  }

  renderPage(pageName, callInit = true) {
    const page = this.pages[pageName];
    
    if (!page) {
      console.error(`Page not found: ${pageName}`);
      this.navigateTo('landing');
      return;
    }

    const app = document.getElementById('app');
    app.innerHTML = `<div class="page active">${page.render()}</div>`;
    this.currentPage = pageName;

    // Call init hook if provided
    if (callInit && typeof page.init === 'function') {
      page.init();
    }

    // Expose page object for inline onclick handlers
    window.app = this;
  }

  async handleLogout() {
    try {
      await api.logout();
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      auth.logout();
      this.navigateTo('landing');
    }
  }
}

// Initialize app
const app = new App();
document.addEventListener('DOMContentLoaded', () => {
  app.init();
});

// Make app globally accessible
window.app = app;
