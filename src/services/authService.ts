import { AUTH_ENDPOINTS } from '../config/api';
import { apiRequest } from './httpClient';
import { clearTokens, setTokens } from './tokenStore';

export type AuthUser = {
  id: string;
  email: string;
  name?: string;
};

type LoginResponse = {
  accessToken?: string;
  refreshToken?: string | null;
  token?: string;
  user?: AuthUser;
};

type MeResponse = {
  user?: AuthUser;
};

export type LoginInput = {
  identifier: string;
  password: string;
};

export type RegisterInput = {
  email: string;
  password: string;
  name: string;
  otp: string;
};

export type ResetPasswordInput = {
  email: string;
  otp: string;
  newPassword: string;
};

export async function signIn(input: LoginInput): Promise<AuthUser | null> {
  const data = await apiRequest<LoginResponse>(AUTH_ENDPOINTS.login, {
    method: 'POST',
    body: input,
  });

  const accessToken = data.accessToken ?? data.token;
  if (!accessToken) {
    throw new Error('Login response does not include access token');
  }

  setTokens({
    accessToken,
    refreshToken: data.refreshToken ?? null,
  });

  return data.user ?? null;
}

export async function getCurrentUser(): Promise<AuthUser | null> {
  const data = await apiRequest<MeResponse>(AUTH_ENDPOINTS.me);
  return data.user ?? null;
}

export async function requestRegisterOtp(email: string): Promise<void> {
  await apiRequest<void>(AUTH_ENDPOINTS.registerOtp, {
    method: 'POST',
    body: { email },
  });
}

export async function completeRegistration(input: RegisterInput): Promise<void> {
  await apiRequest<void>(AUTH_ENDPOINTS.register, {
    method: 'POST',
    body: input,
  });
}

export async function requestForgotPasswordOtp(email: string): Promise<void> {
  await apiRequest<void>(AUTH_ENDPOINTS.forgotPasswordOtp, {
    method: 'POST',
    body: { email },
  });
}

export async function resetPassword(input: ResetPasswordInput): Promise<void> {
  await apiRequest<void>(AUTH_ENDPOINTS.resetPassword, {
    method: 'POST',
    body: input,
  });
}

export async function signOut(): Promise<void> {
  try {
    await apiRequest<void>(AUTH_ENDPOINTS.logout, { method: 'POST' });
  } finally {
    clearTokens();
  }
}

export function clearAuthSession(): void {
  clearTokens();
}
