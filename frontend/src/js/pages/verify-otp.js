// OTP Verification page
import { api } from '../utils/api.js';
import { auth } from '../utils/auth.js';

export const verifyOtpPage = {
  render() {
    return `
      <div class="auth-container">
        <form class="auth-form" id="otpForm">
          <h2>Verify Email</h2>
          <p class="auth-form-subtitle">Enter the 6-digit OTP sent to your email</p>

          <div id="otpAlert"></div>

          <div class="form-group">
            <label>Enter OTP</label>
            <div class="otp-input-group" id="otpInputGroup">
              <input type="text" class="otp-input" inputmode="numeric" maxlength="1" pattern="[0-9]">
              <input type="text" class="otp-input" inputmode="numeric" maxlength="1" pattern="[0-9]">
              <input type="text" class="otp-input" inputmode="numeric" maxlength="1" pattern="[0-9]">
              <input type="text" class="otp-input" inputmode="numeric" maxlength="1" pattern="[0-9]">
              <input type="text" class="otp-input" inputmode="numeric" maxlength="1" pattern="[0-9]">
              <input type="text" class="otp-input" inputmode="numeric" maxlength="1" pattern="[0-9]">
            </div>
          </div>

          <div class="otp-timer">
            Didn't receive? Check <strong>Spam</strong> folder or wait <strong id="otpTimerDisplay">120</strong>s to resend
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Verify</button>

          <div class="auth-form-link">
            <a onclick="app.navigateTo('signup')">Back to Sign Up</a>
          </div>
        </form>
      </div>
    `;
  },

  init() {
    const form = document.getElementById('otpForm');
    const inputs = document.querySelectorAll('.otp-input');

    // Auto-focus and movement between OTP inputs
    inputs.forEach((input, index) => {
      input.addEventListener('input', (e) => {
        if (e.target.value.length === 1 && index < inputs.length - 1) {
          inputs[index + 1].focus();
        }
      });

      input.addEventListener('keydown', (e) => {
        if (e.key === 'Backspace' && index > 0 && e.target.value === '') {
          inputs[index - 1].focus();
        }
      });
    });

    // Auto-focus first input
    inputs[0].focus();

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleVerifyOtp();
    });

    // Start OTP timer
    this.startOtpTimer();
  },

  startOtpTimer() {
    let seconds = 120;
    const timerDisplay = document.getElementById('otpTimerDisplay');

    const interval = setInterval(() => {
      seconds--;
      timerDisplay.textContent = seconds;

      if (seconds <= 0) {
        clearInterval(interval);
        timerDisplay.textContent = '0';
        document.querySelector('button[type="submit"]').disabled = false;
      }
    }, 1000);
  },

  async handleVerifyOtp() {
    const alertDiv = document.getElementById('otpAlert');
    const inputs = document.querySelectorAll('.otp-input');
    const submitBtn = document.querySelector('button[type="submit"]');

    try {
      alertDiv.innerHTML = '';
      const otp = Array.from(inputs).map(input => input.value).join('');

      if (!auth.isValidOtp(otp)) {
        throw new Error('Please enter a valid 6-digit OTP');
      }

      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Verifying...';

      const rollNumber = auth.getRollNumber();
      const response = await api.verifyOtp(rollNumber, otp);

      alertDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>Success!</strong> Email verified. Redirecting to login...
        </div>
      `;

      setTimeout(() => {
        window.app.navigateTo('login');
      }, 2000);

    } catch (error) {
      alertDiv.innerHTML = `
        <div class="alert alert-error">
          <strong>Error:</strong> ${error.message}
        </div>
      `;
      submitBtn.disabled = false;
      submitBtn.textContent = 'Verify';
    }
  },
};

export default verifyOtpPage;
