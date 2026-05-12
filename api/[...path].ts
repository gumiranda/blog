import { app } from "../apps/api/src/index";

export const config = {
  runtime: "nodejs",
};

type HeaderValue = string | string[] | undefined;

type VercelRequest = {
  body?: unknown;
  headers: Record<string, HeaderValue>;
  method?: string;
  url?: string;
};

type VercelResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: Uint8Array) => void;
};

const getHeader = (headers: Record<string, HeaderValue>, name: string) => {
  const value = headers[name] ?? headers[name.toLowerCase()];

  return Array.isArray(value) ? value[0] : value;
};

const getRequestOrigin = (request: VercelRequest) => {
  const protocol = getHeader(request.headers, "x-forwarded-proto") ?? "https";
  const host = getHeader(request.headers, "host") ?? "localhost";

  return `${protocol}://${host}`;
};

const getRequestBody = (request: VercelRequest): BodyInit | undefined => {
  const method = request.method?.toUpperCase() ?? "GET";

  if (method === "GET" || method === "HEAD" || request.body == null) {
    return undefined;
  }

  if (
    typeof request.body === "string" ||
    request.body instanceof Blob ||
    request.body instanceof FormData ||
    request.body instanceof URLSearchParams ||
    request.body instanceof ArrayBuffer
  ) {
    return request.body;
  }

  if (request.body instanceof Uint8Array) {
    return request.body.buffer instanceof ArrayBuffer
      ? request.body.buffer.slice(request.body.byteOffset, request.body.byteOffset + request.body.byteLength)
      : JSON.stringify(Array.from(request.body));
  }

  return JSON.stringify(request.body);
};

const getRequestHeaders = (request: VercelRequest) => {
  const headers = new Headers();

  for (const [name, value] of Object.entries(request.headers)) {
    if (Array.isArray(value)) {
      for (const item of value) {
        headers.append(name, item);
      }
    } else if (value !== undefined) {
      headers.set(name, value);
    }
  }

  return headers;
};

const toWebRequest = (request: VercelRequest) => {
  const url = new URL(request.url ?? "/api", getRequestOrigin(request));

  return new Request(url, {
    body: getRequestBody(request),
    headers: getRequestHeaders(request),
    method: request.method ?? "GET",
  });
};

const stripApiPrefix = (request: Request) => {
  const url = new URL(request.url);

  if (url.pathname === "/api") {
    url.pathname = "/";
  } else if (url.pathname.startsWith("/api/")) {
    url.pathname = url.pathname.slice("/api".length);
  }

  return new Request(url, request);
};

export default async function handler(request: VercelRequest, response: VercelResponse) {
  const apiResponse = await app.handle(stripApiPrefix(toWebRequest(request)));

  response.statusCode = apiResponse.status;
  apiResponse.headers.forEach((value, name) => {
    response.setHeader(name, value);
  });

  response.end(new Uint8Array(await apiResponse.arrayBuffer()));
}
