import React from 'react';

export const LeetCodeLogo = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M13.483 0a1.374 1.374 0 0 0-.961.414l-9.77 9.77a1.375 1.375 0 0 0 0 1.942l4 4a1.375 1.375 0 0 0 1.942 0l9.77-9.77a1.375 1.375 0 0 0 0-1.942l-4-4A1.374 1.374 0 0 0 13.483 0zM12 7.647L16.353 12H7.647L12 7.647z" />
    <path d="M16.193 18.936l-3.322-3.328a1.378 1.378 0 1 0-1.95 1.948l3.322 3.328a1.378 1.378 0 1 0 1.95-1.948z" />
    <path d="M22.56 11.56l-3.328-3.322a1.378 1.378 0 0 0-1.948 1.95l3.328 3.322a1.378 1.378 0 0 0 1.948-1.95z" />
    <path d="M8.807 5.064L5.485 1.736a1.378 1.378 0 0 0-1.948 1.95l3.322 3.328a1.378 1.378 0 1 0 1.948-1.95z" />
  </svg>
);

export const CodeforcesLogo = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    {/* Codeforces is famous for its three vertical bars: red, blue, yellow */}
    <rect x="2" y="8" width="4" height="12" rx="1.5" fill="#3b82f6" />
    <rect x="8" y="3" width="4" height="17" rx="1.5" fill="#ef4444" />
    <rect x="14" y="11" width="4" height="9" rx="1.5" fill="#f59e0b" />
  </svg>
);

export const GitHubLogo = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    <path d="M12 0C5.37 0 0 5.37 0 12c0 5.3 3.438 9.8 8.205 11.385.6.11.82-.26.82-.577v-2.234c-3.338.724-4.042-1.61-4.042-1.61C4.422 18.07 3.633 17.7 3.633 17.7c-1.087-.744.084-.729.084-.729 1.205.084 1.838 1.236 1.838 1.236 1.07 1.835 2.809 1.305 3.495.998.108-.776.417-1.305.76-1.605-2.665-.3-5.466-1.332-5.466-5.93 0-1.31.465-2.38 1.235-3.22-.135-.303-.54-1.523.105-3.176 0 0 1.005-.322 3.3 1.23.96-.267 1.98-.399 3-.405 1.02.006 2.04.138 3 .405 2.28-1.552 3.285-1.23 3.285-1.23.645 1.653.24 2.873.12 3.176.765.84 1.23 1.91 1.23 3.22 0 4.61-2.805 5.625-5.475 5.92.42.36.81 1.096.81 2.22v3.293c0 .319.22.694.825.576C20.565 21.795 24 17.3 24 12c0-6.63-5.37-12-12-12z" />
  </svg>
);

export const AtCoderLogo = ({ className = '', size = 24 }) => (
  <svg
    viewBox="0 0 24 24"
    width={size}
    height={size}
    className={className}
    fill="currentColor"
  >
    {/* A stylized 'A' for AtCoder */}
    <path d="M12 2L2 22h4l3.5-7.5h5l3.5 7.5h4L12 2zm-1.2 10.5L12 9.1l1.2 3.4h-2.4z" />
  </svg>
);
