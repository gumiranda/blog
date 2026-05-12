import { app } from "../apps/api/src/index";

export const config = {
  runtime: "edge",
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

export default function handler(request: Request) {
  return app.handle(stripApiPrefix(request));
}
