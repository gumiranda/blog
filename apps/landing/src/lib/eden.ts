/**
 * Eden Treaty client: type-safe API calls.
 * App type is imported from the api package — same types as the server.
 */
import { treaty } from '@elysiajs/eden';
import type { App } from 'api';

const isLocalHost = (hostname: string) => hostname === 'localhost' || hostname === '127.0.0.1';

const getDefaultApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }

  if (isLocalHost(window.location.hostname)) {
    return 'http://localhost:3000';
  }

  return '/api';
};

const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }

  return getDefaultApiUrl();
};

const API_URL = typeof window !== 'undefined'
  ? getApiUrl()
  : 'http://localhost:3000';

export const api = treaty<App>(API_URL);
