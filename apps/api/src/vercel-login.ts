type VercelRequest = {
  body?: unknown;
  method?: string;
};

type VercelResponse = {
  statusCode: number;
  setHeader: (name: string, value: string) => void;
  end: (body?: string) => void;
};

const parseBody = (body: unknown) => {
  if (typeof body === "string") {
    try {
      return JSON.parse(body) as { username?: unknown };
    } catch {
      return {};
    }
  }

  if (body && typeof body === "object") {
    return body as { username?: unknown };
  }

  return {};
};

const sendJson = (response: VercelResponse, statusCode: number, body: unknown) => {
  response.statusCode = statusCode;
  response.setHeader("content-type", "application/json; charset=utf-8");
  response.end(JSON.stringify(body));
};

export default function loginHandler(request: VercelRequest, response: VercelResponse) {
  if (request.method?.toUpperCase() !== "POST") {
    sendJson(response, 405, { error: "Method not allowed" });
    return;
  }

  const body = parseBody(request.body);
  const username = typeof body.username === "string" && body.username.trim() ? body.username : "guest";

  sendJson(response, 200, {
    id: crypto.randomUUID(),
    username,
    displayName: username,
    loggedAt: new Date().toISOString(),
  });
}
