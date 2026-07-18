// Authentication utilities
export const auth = {
  // Check if user is authenticated
  isAuthenticated() {
    return !!localStorage.getItem('rollNumber');
  },

  // Store roll number
  setRollNumber(rollNumber) {
    localStorage.setItem('rollNumber', rollNumber);
  },

  // Get stored roll number
  getRollNumber() {
    return localStorage.getItem('rollNumber');
  },

  // Clear authentication
  logout() {
    localStorage.removeItem('rollNumber');
    sessionStorage.clear();
  },

  // Check password strength
  checkPasswordStrength(password) {
    let strength = 0;
    const feedback = [];

    if (password.length >= 8) strength++;
    else feedback.push('At least 8 characters');

    if (password.length >= 12) strength++;
    
    if (/[a-z]/.test(password)) strength++;
    else feedback.push('At least one lowercase letter');

    if (/[A-Z]/.test(password)) strength++;
    else feedback.push('At least one uppercase letter');

    if (/[0-9]/.test(password)) strength++;
    else feedback.push('At least one number');

    if (/[!@#$%^&*()_+\-=\[\]{};':"\\|,.<>\/?]/.test(password)) strength++;
    else feedback.push('At least one special character');

    return {
      score: strength,
      level: strength === 0 ? 'weak' : strength < 3 ? 'weak' : strength < 5 ? 'fair' : strength < 6 ? 'good' : 'strong',
      feedback: feedback,
      isValid: strength >= 4, // Require at least 4 criteria
    };
  },

  // Validate email format
  isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
  },

  // Validate roll number
  isValidRollNumber(rollNumber) {
    return rollNumber.length >= 5 && rollNumber.length <= 30;
  },

  // Validate OTP format
  isValidOtp(otp) {
    return /^\d{6}$/.test(otp);
  },

  // Store OTP timer
  setOtpTimer(seconds) {
    sessionStorage.setItem('otpTimer', seconds);
  },

  getOtpTimer() {
    return parseInt(sessionStorage.getItem('otpTimer') || '0');
  },

  clearOtpTimer() {
    sessionStorage.removeItem('otpTimer');
  },
};

export default auth;
