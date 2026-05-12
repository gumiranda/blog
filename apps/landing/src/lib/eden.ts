/**
 * Eden Treaty client: type-safe API calls.
 * App type is imported from the api package — same types as the server.
 */
import { treaty } from '@elysiajs/eden';
import type { App } from 'api';

const isLocalHost = (hostname: string) => hostname === 'localhost' || hostname === '127.0.0.1';

const envApiUrl =
  typeof import.meta.env !== 'undefined' &&
  typeof import.meta.env.PUBLIC_API_URL === 'string' &&
  import.meta.env.PUBLIC_API_URL.length > 0
    ? import.meta.env.PUBLIC_API_URL.replace(/\/$/, '')
    : null;

/**
 * Eden Treaty prefixes `https://` when the base string has no `://`.
 * A relative path like `/api` becomes `https://` + `/api` → parsed as host `api` (broken).
 * Always pass an absolute URL (origin + path) or localhost.
 */
const getApiUrl = () => {
  if (typeof window === 'undefined') {
    return envApiUrl ?? 'http://localhost:3000';
  }

  if (envApiUrl && (isLocalHost(window.location.hostname) || !envApiUrl.includes('localhost'))) {
    return envApiUrl;
  }

  if (isLocalHost(window.location.hostname)) {
    return 'http://localhost:3000';
  }

  return `${window.location.origin}/api`;
};

const API_URL = getApiUrl();

export const api = treaty<App>(API_URL);
