const API_BASE_URL = 'http://localhost:8000';

/**
 * Helper to make HTTP requests with credentials and handle response errors.
 */
async function request(path, options = {}) {
  const url = `${API_BASE_URL}${path}`;
  
  // Set credentials option to include cookie forwarding
  options.credentials = 'include';
  
  if (options.body && typeof options.body === 'object') {
    options.body = JSON.stringify(options.body);
    options.headers = {
      'Content-Type': 'application/json',
      ...options.headers,
    };
  }

  const response = await fetch(url, options);

  let data;
  const contentType = response.headers.get('content-type');
  if (contentType && contentType.includes('application/json')) {
    data = await response.json();
  } else {
    data = await response.text();
  }

  if (!response.ok) {
    const errorMsg = (data && data.detail) || response.statusText || 'An error occurred';
    throw new Error(errorMsg);
  }

  return data;
}

export const api = {
  // Contests
  async getContestsThisMonth() {
    return request('/contests/this-month', { method: 'GET' });
  },

  // Auth Flow
  async signup(userData) {
    return request('/auth/signup', {
      method: 'POST',
      body: userData,
    });
  },

  async verifyOtp(rollNumber, otp) {
    return request('/auth/verify-otp', {
      method: 'POST',
      body: { roll_number: rollNumber, otp },
    });
  },

  async login(rollNumber, password) {
    return request('/auth/login', {
      method: 'POST',
      body: { roll_number: rollNumber, password },
    });
  },

  async logout() {
    return request('/auth/logout', { method: 'POST' });
  },

  async getMe() {
    return request('/auth/me', { method: 'GET' });
  },

  async savePlatforms(platformsData) {
    return request('/auth/platforms', {
      method: 'POST',
      body: platformsData,
    });
  },

  // Manual platform resync
  async syncPlatform(platform) {
    return request(`/auth/sync/${platform}`, { method: 'POST' });
  },

  // Dashboard (aggregated server-side)
  async getDashboard() {
    return request('/dashboard', { method: 'GET' });
  },
};
