/**
 * Eden Treaty client: type-safe API calls.
 * App type is imported from the api package — same types as the server.
 */
import { treaty } from '@elysiajs/eden';
import type { App } from 'api';

const getDefaultApiUrl = () => {
  if (typeof window === 'undefined') {
    return 'http://localhost:3000';
  }

  if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
    return 'http://localhost:3000';
  }

  return '/api';
};

const API_URL = typeof window !== 'undefined'
  ? (import.meta.env.PUBLIC_API_URL ?? getDefaultApiUrl())
  : 'http://localhost:3000';

export const api = treaty<App>(API_URL);
