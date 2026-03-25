import { API_BASE_URL, API_TIMEOUT_MS } from '../config/api';
import { getAccessToken } from './tokenStore';

export class ApiError extends Error {
  status: number;
  details?: unknown;

  constructor(message: string, status: number, details?: unknown) {
    super(message);
    this.name = 'ApiError';
    this.status = status;
    this.details = details;
  }
}

type HttpMethod = 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE';

type RequestOptions = {
  method?: HttpMethod;
  body?: unknown;
  headers?: Record<string, string>;
  signal?: AbortSignal;
};

let unauthorizedHandler: (() => void) | null = null;

export function setUnauthorizedHandler(handler: () => void): void {
  unauthorizedHandler = handler;
}

function withTimeout(timeoutMs: number, externalSignal?: AbortSignal): AbortSignal {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), timeoutMs);

  if (externalSignal) {
    externalSignal.addEventListener('abort', () => controller.abort(), { once: true });
  }

  controller.signal.addEventListener(
    'abort',
    () => {
      clearTimeout(timer);
    },
    { once: true },
  );

  return controller.signal;
}

export async function apiRequest<T>(path: string, options: RequestOptions = {}): Promise<T> {
  const accessToken = getAccessToken();
  const hasBody = options.body !== undefined && options.body !== null;
  const isFormData = typeof FormData !== 'undefined' && options.body instanceof FormData;

  const headers: Record<string, string> = {
    Accept: 'application/json',
    ...(options.headers ?? {}),
  };

  if (accessToken) {
    headers.Authorization = `Bearer ${accessToken}`;
  }

  if (hasBody && !isFormData && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json';
  }

  const response = await fetch(`${API_BASE_URL}${path}`, {
    method: options.method ?? 'GET',
    headers,
    body: hasBody ? (isFormData ? (options.body as FormData) : JSON.stringify(options.body)) : undefined,
    signal: withTimeout(API_TIMEOUT_MS, options.signal),
  });

  const text = await response.text();
  const payload = text ? (JSON.parse(text) as unknown) : null;

  if (!response.ok) {
    if (response.status === 401 && unauthorizedHandler) {
      unauthorizedHandler();
    }

    const message =
      typeof payload === 'object' && payload && 'message' in payload && typeof payload.message === 'string'
        ? payload.message
        : `Request failed with status ${response.status}`;

    throw new ApiError(message, response.status, payload);
  }

  return payload as T;
}
