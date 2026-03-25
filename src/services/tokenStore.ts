export type AuthTokens = {
  accessToken: string;
  refreshToken?: string | null;
};

let currentTokens: AuthTokens | null = null;

export function getTokens(): AuthTokens | null {
  return currentTokens;
}

export function getAccessToken(): string | null {
  return currentTokens?.accessToken ?? null;
}

export function setTokens(tokens: AuthTokens): void {
  currentTokens = tokens;
}

export function clearTokens(): void {
  currentTokens = null;
}
