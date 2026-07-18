# Eterno Frontend

A Progressive Web Application (PWA) for tracking programming contests across multiple platforms.

## Features

- 📱 **Progressive Web App**: Works offline, installable on mobile and desktop
- 🔐 **Secure Authentication**: OTP-based email verification, password strength checking
- 🎯 **Contest Tracking**: Real-time contest updates from Codeforces, LeetCode, CodeChef, AtCoder
- 👤 **User Profiles**: Complete profile with platform usernames (LeetCode, Codeforces, GitHub)
- 🔄 **Background Sync**: Automatically syncs data when connection is restored
- 📱 **Responsive Design**: Works seamlessly on mobile, tablet, and desktop

## Project Structure

```
frontend/
├── public/
│   ├── index.html           # Main HTML file
│   ├── manifest.json        # PWA manifest
│   ├── service-worker.js    # Service Worker for offline support
│   └── favicon.ico
├── src/
│   ├── css/
│   │   └── styles.css       # Main stylesheet
│   ├── js/
│   │   ├── app.js           # Main app router
│   │   ├── pages/           # Page components
│   │   │   ├── landing.js
│   │   │   ├── signup.js
│   │   │   ├── verify-otp.js
│   │   │   ├── login.js
│   │   │   ├── dashboard.js
│   │   │   ├── profile.js
│   │   │   ├── contests.js
│   │   │   └── forgot-password.js
│   │   └── utils/           # Utility functions
│   │       ├── api.js       # API client
│   │       └── auth.js      # Authentication utilities
└── README.md
```

## Setup

1. **Start the Backend**
   ```bash
   cd ../
   pip install -r requirements.txt
   uvicorn app.main:app --reload
   ```

2. **Serve the Frontend**
   
   Option A: Using Python
   ```bash
   python -m http.server 3000 --directory public
   ```
   
   Option B: Using Node.js/npm
   ```bash
   npm install -g http-server
   http-server public -p 3000
   ```

3. **Open in Browser**
   - Navigate to `http://localhost:3000`

## Pages

### Landing Page
- Hero section with feature highlights
- Contest tracker sidebar
- Call-to-action buttons for signup/login

### Authentication
- **Signup**: Register with full details (name, roll number, college, branch, graduation year)
- **OTP Verification**: 6-digit OTP verification with auto-focus inputs
- **Login**: Roll number and password based login
- **Forgot Password**: Password reset via email

### Dashboard
- Welcome message
- Sidebar navigation
- Quick link to complete profile

### Profile
- Platform usernames (LeetCode, Codeforces, GitHub)
- User information display
- Real-time profile updates

### Contests
- Grid view of upcoming contests
- Filter by platform
- Direct links to contest pages

## Security Features

- 🔒 **HttpOnly Cookies**: JWT tokens stored in HttpOnly cookies (XSS-safe)
- 🔐 **Password Strength**: Client-side password strength indicator
- ✅ **CSRF Protection**: SameSite cookie policy
- 🛡️ **Input Validation**: Client and server-side validation

## PWA Features

### Service Worker
- **Cache Strategy**: Cache-first for assets, network-first for API calls
- **Offline Support**: Cached pages available offline
- **Background Sync**: Syncs platform changes when online

### Manifest
- Installable on mobile and desktop
- Standalone display mode
- Splash screens and icons
- Custom colors and orientation

## Browser Support

- Chrome/Edge: Full support
- Firefox: Full support
- Safari: Full support (with some limitations)
- Mobile browsers: Full support

## API Integration

The frontend communicates with the backend API at `http://localhost:8000`:

- `POST /auth/signup` - User registration
- `POST /auth/verify-otp` - OTP verification
- `POST /auth/login` - User login
- `POST /auth/logout` - User logout
- `GET /auth/profile` - Get user profile
- `POST /auth/platforms` - Save platform usernames
- `POST /auth/forgot-password` - Initiate password reset
- `POST /auth/reset-password` - Complete password reset
- `GET /contests` - Get upcoming contests

## Development

### Adding a New Page

1. Create a new file in `src/js/pages/page-name.js`
2. Export an object with `render()` and optional `init()` methods
3. Import in `src/js/app.js`
4. Add to the `pages` object in the App class
5. Use `app.navigateTo('page-name')` to navigate

Example:
```javascript
export const myPage = {
  render() {
    return `<div>My Page</div>`;
  },
  
  init() {
    // Initialize page logic
  }
};
```

### API Calls

Use the `api` object from `src/js/utils/api.js`:

```javascript
import { api } from '../utils/api.js';

// Make a request
const response = await api.signup(data);
```

### Authentication

Use the `auth` object from `src/js/utils/auth.js`:

```javascript
import { auth } from '../utils/auth.js';

// Check password strength
const strength = auth.checkPasswordStrength(password);

// Check if authenticated
if (auth.isAuthenticated()) {
  // User is logged in
}
```

## Performance

- **Service Worker Caching**: Instant page loads for cached content
- **Lazy Loading**: Images and resources load on demand
- **Code Splitting**: Pages loaded dynamically
- **Compression**: CSS and JS minified

## Mobile Optimization

- Responsive grid layouts
- Touch-friendly buttons (min 44px)
- Optimized for mobile keyboards
- Full-screen support on mobile

## Color Scheme

- Primary: `#4F46E5` (Indigo)
- Success: `#10B981` (Green)
- Warning: `#F59E0B` (Amber)
- Danger: `#EF4444` (Red)
- Gray palette: 50-900 shades

## License

This project is part of Eterno Contest Tracker.

## Support

For issues and feature requests, please contact the development team.
