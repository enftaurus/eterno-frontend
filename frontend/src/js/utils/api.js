// API configuration and methods
const API_BASE = 'http://localhost:8000';

export const api = {
  async request(endpoint, options = {}) {
    const url = `${API_BASE}${endpoint}`;
    const defaultOptions = {
      headers: {
        'Content-Type': 'application/json',
      },
      credentials: 'include', // Send cookies with requests
    };

    const mergedOptions = {
      ...defaultOptions,
      ...options,
      headers: {
        ...defaultOptions.headers,
        ...options.headers,
      },
    };

    try {
      const response = await fetch(url, mergedOptions);
      
      if (!response.ok) {
        const error = await response.json().catch(() => ({}));
        throw new Error(error.detail || `HTTP ${response.status}`);
      }

      return await response.json().catch(() => ({}));
    } catch (error) {
      console.error(`API Error: ${endpoint}`, error);
      throw error;
    }
  },

  signup(data) {
    return this.request('/auth/signup', {
      method: 'POST',
      body: JSON.stringify(data),
    });
  },

  verifyOtp(rollNumber, otp) {
    return this.request('/auth/verify-otp', {
      method: 'POST',
      body: JSON.stringify({ roll_number: rollNumber, otp }),
    });
  },

  login(rollNumber, password) {
    return this.request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ roll_number: rollNumber, password }),
    });
  },

  savePlatforms(platforms) {
    return this.request('/auth/platforms', {
      method: 'POST',
      body: JSON.stringify(platforms),
    });
  },

  getProfile() {
    return this.request('/auth/profile', {
      method: 'GET',
    });
  },

  forgotPassword(rollNumber) {
    return this.request('/auth/forgot-password', {
      method: 'POST',
      body: JSON.stringify({ roll_number: rollNumber }),
    });
  },

  resetPassword(token, newPassword) {
    return this.request('/auth/reset-password', {
      method: 'POST',
      body: JSON.stringify({ token, password: newPassword }),
    });
  },

  logout() {
    return this.request('/auth/logout', {
      method: 'POST',
    });
  },

  getContests(platform = null) {
    const url = platform 
      ? `/contests?platform=${platform}`
      : '/contests';
    return this.request(url);
  },
};

export default api;
