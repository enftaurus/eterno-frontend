// Signup page
import { api } from '../utils/api.js';
import { auth } from '../utils/auth.js';

export const signupPage = {
  render() {
    return `
      <div class="auth-container">
        <form class="auth-form" id="signupForm">
          <h2>Create Account</h2>
          <p class="auth-form-subtitle">Register to start tracking contests</p>

          <div id="signupAlert"></div>

          <div class="form-group">
            <label for="fullName">Full Name</label>
            <input type="text" id="fullName" name="fullName" placeholder="John Doe" required>
          </div>

          <div class="form-group">
            <label for="rollNumber">Roll Number</label>
            <input type="text" id="rollNumber" name="rollNumber" placeholder="BCS001" required>
          </div>

          <div class="form-group">
            <label for="college">College</label>
            <input type="text" id="college" name="college" placeholder="Your College Name" required>
          </div>

          <div class="form-group">
            <label for="branch">Branch (Optional)</label>
            <input type="text" id="branch" name="branch" placeholder="Computer Science">
          </div>

          <div class="form-group">
            <label for="graduationYear">Graduation Year (Optional)</label>
            <input type="number" id="graduationYear" name="graduationYear" placeholder="2025" min="2024" max="2030">
          </div>

          <div class="form-group">
            <label for="password">Password</label>
            <input type="password" id="password" name="password" placeholder="••••••••" required>
            <div class="password-strength">
              <div class="password-strength-bar"></div>
            </div>
            <div class="password-strength-text" id="passwordStrengthText"></div>
          </div>

          <div class="form-group">
            <label for="confirmPassword">Confirm Password</label>
            <input type="password" id="confirmPassword" name="confirmPassword" placeholder="••••••••" required>
          </div>

          <button type="submit" class="btn btn-primary btn-lg" style="width: 100%;">Sign Up</button>

          <div class="auth-form-link">
            Already have an account? <a onclick="app.navigateTo('login')">Sign In</a>
          </div>
        </form>
      </div>
    `;
  },

  init() {
    const form = document.getElementById('signupForm');
    const passwordInput = document.getElementById('password');
    const strengthBar = document.querySelector('.password-strength-bar');
    const strengthText = document.getElementById('passwordStrengthText');

    // Password strength checker
    passwordInput.addEventListener('input', () => {
      const password = passwordInput.value;
      const strength = auth.checkPasswordStrength(password);

      const bars = ['password-strength-weak', 'password-strength-fair', 'password-strength-good', 'password-strength-strong'];
      bars.forEach(cls => strengthBar.classList.remove(cls));

      if (password.length > 0) {
        strengthBar.classList.add(bars[Math.min(strength.score, 3)]);
        strengthText.textContent = `Strength: ${strength.level.toUpperCase()}`;
        
        if (strength.feedback.length > 0) {
          strengthText.textContent += ` - ${strength.feedback[0]}`;
        }
      }
    });

    form.addEventListener('submit', async (e) => {
      e.preventDefault();
      await this.handleSignup();
    });
  },

  async handleSignup() {
    const alertDiv = document.getElementById('signupAlert');
    const form = document.getElementById('signupForm');
    const submitBtn = form.querySelector('button[type="submit"]');

    try {
      alertDiv.innerHTML = '';
      submitBtn.disabled = true;
      submitBtn.innerHTML = '<span class="loading"></span> Creating account...';

      const formData = new FormData(form);
      const data = {
        full_name: formData.get('fullName'),
        roll_number: formData.get('rollNumber'),
        college: formData.get('college'),
        branch: formData.get('branch') || null,
        graduation_year: formData.get('graduationYear') ? parseInt(formData.get('graduationYear')) : null,
        password: formData.get('password'),
        confirm_password: formData.get('confirmPassword'),
      };

      // Validate password strength
      const passwordStrength = auth.checkPasswordStrength(data.password);
      if (!passwordStrength.isValid) {
        throw new Error('Password is not strong enough');
      }

      const response = await api.signup(data);
      
      // Store roll number for OTP verification
      auth.setRollNumber(data.roll_number);
      
      alertDiv.innerHTML = `
        <div class="alert alert-success">
          <strong>Success!</strong> OTP sent to ${data.roll_number}@vce.ac.in
        </div>
      `;

      setTimeout(() => {
        window.app.navigateTo('verify-otp');
      }, 2000);

    } catch (error) {
      alertDiv.innerHTML = `
        <div class="alert alert-error">
          <strong>Error:</strong> ${error.message}
        </div>
      `;
    } finally {
      submitBtn.disabled = false;
      submitBtn.textContent = 'Sign Up';
    }
  },
};

export default signupPage;
