type VercelRequest = {
  body?: unknown;
  method?: string;
};

type VercelResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

const getBody = (body: unknown) => {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as { username?: unknown; password?: unknown };
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") {
    return body as { username?: unknown; password?: unknown };
  }

  return {};
};

const sendJson = (response: VercelResponse, statusCode: number, body?: unknown) => {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(body === undefined ? undefined : JSON.stringify(body));
};

export default function handler(request: VercelRequest, response: VercelResponse) {
  const method = request.method?.toUpperCase() ?? "GET";

  if (method === "OPTIONS") {
    sendJson(response, 204);
    return;
  }

  if (method !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const body = getBody(request.body);
  const username = typeof body.username === "string" && body.username.trim() ? body.username : "guest";

  sendJson(response, 200, {
    id: crypto.randomUUID(),
    username,
    displayName: username,
    loggedAt: new Date().toISOString(),
  });
}
