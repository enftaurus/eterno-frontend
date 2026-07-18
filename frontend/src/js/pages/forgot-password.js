// Forgot Password page
import { api } from '../utils/api.js';
import { auth } from '../utils/auth.js';

export const forgotPasswordPage = {
  render() {
    return `
      <div class="auth-container">
        <form class="auth-form" id="forgotPasswordForm">
          <h2>Reset Password</h2>
          <p class="auth-form-subtitle">Enter your roll number to receive reset instructions</p>

          <div id="forgotPasswordAlert"></div>

          <div class="form-group">
            <label for="rollNumber">Roll Number</label>
            <input type="text" id="rollNumber" name="rollNumber" placeholder="BCS001" required>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Send Reset Link</button>

          <div class="auth-form-link">
            <a onclick="app.navigateTo('login')">Back to Sign In</a>
          </div>
        </form>
      </div>
    `;
  },

  init() {
    const form = document.getElementById('forgotPasswordForm');
    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleForgotPassword();
    });
  },

  async handleForgotPassword() {
    const alertDiv = document.getElementById('forgotPasswordAlert');
    const form = document.getElementById('forgotPasswordForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
      alertDiv.innerHTML = '';
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Sending...';

      const rollNumber = form.rollNumber.value;

      if (!auth.isValidRollNumber(rollNumber)) {
        throw new Error('Invalid roll number format');
      }

      const response = await api.forgotPassword(rollNumber);

      alertDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>Success!</strong> Reset link sent to ${rollNumber}@vce.ac.in. Check your email (including spam folder).
        </div>
      `;

      form.reset();
      submitBtn.disabled = true;
      submitBtn.textContent = 'Link Sent';

    } catch (error) {
      alertDiv.innerHTML = `
        <div class="alert alert-error">
          <strong>Error:</strong> ${error.message}
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Send Reset Link';
    }
  },
};

export default forgotPasswordPage;
