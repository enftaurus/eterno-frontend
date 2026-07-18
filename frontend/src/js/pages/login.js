// Login page
import { api } from '../utils/api.js';
import { auth } from '../utils/auth.js';

export const loginPage = {
  render() {
    return `
      <div class="auth-container">
        <form class="auth-form" id="loginForm">
          <h2>Welcome Back</h2>
          <p class="auth-form-subtitle">Sign in to your account</p>

          <div id="loginAlert"></div>

          <div class="form-group">
            <label for="rollNumber">Roll Number</label>
            <input type="text" id="rollNumber" name="rollNumber" placeholder="BCS001" required>
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required>
          </div>

          <div class="form-group" style="flex-direction: row; justify-content: space-between; align-items: center; margin-bottom: 24px;">
            <label style="margin-bottom: 0;">
              <input type="checkbox" name="remember" style="margin-right: 8px;">
              Remember me
            </label>
            <a onclick="app.navigateTo('forgot-password')" style="color: var(--primary); text-decoration: none; cursor: pointer;">Forgot password?</a>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Sign In</button>

          <div class="auth-form-link">
            Don't have an account? <a onclick="app.navigateTo('signup')">Sign Up</a>
          </div>
        </form>
      </div>
    `;
  },

  init() {
    const form = document.getElementById('loginForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleLogin();
    });
  },

  async handleLogin() {
    const alertDiv = document.getElementById('loginAlert');
    const form = document.getElementById('loginForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
      alertDiv.innerHTML = '';
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Signing in...';

      const rollNumber = form.rollNumber.value;
      const password = form.password.value;

      if (!auth.isValidRollNumber(rollNumber)) {
        throw new Error('Invalid roll number format');
      }

      const response = await api.login(rollNumber, password);

      // Store roll number
      auth.setRollNumber(rollNumber);

      alertDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>Success!</strong> Welcome back!
        </div>
      `;

      setTimeout(() => {
        window.app.navigateTo('dashboard');
      }, 1500);

    } catch (error) {
      alertDiv.innerHTML = `
        <div class="alert alert-error">
          <strong>Error:</strong> ${error.message}
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign In';
    }
  },
};

export default loginPage;
