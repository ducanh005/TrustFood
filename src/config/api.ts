const DEV_API_BASE_URL = 'http://10.0.2.2:8080/api';
const PROD_API_BASE_URL = 'https://api.trustfood.app';

export const API_BASE_URL = __DEV__ ? DEV_API_BASE_URL : PROD_API_BASE_URL;

// During UI development, keep auth guard disabled in debug builds.
export const DEV_BYPASS_AUTH = true;
export const DEV_ENTRY_SCREEN: 'Splash' | 'Camera' | 'Discover' | 'DevLauncher' = 'DevLauncher';

export const API_TIMEOUT_MS = 12000;

export const AUTH_ENDPOINTS = {
  login: '/auth/login',
  logout: '/auth/logout',
  registerOtp: '/auth/register/otp',
  register: '/auth/register',
  forgotPasswordOtp: '/auth/forgot-password/otp',
  resetPassword: '/auth/forgot-password/reset',
  me: '/auth/me',
} as const;

export const API_ENDPOINTS = {
  photos: '/photos',
  friendSearch: '/friends/search',
} as const;
