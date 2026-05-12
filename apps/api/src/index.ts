import { Elysia, t } from "elysia";

// Shared types: same shape on server and client via Eden Treaty
const loginBody = t.Object({
  username: t.String(),
  password: t.String(),
});

const userSchema = t.Object({
  id: t.String(),
  username: t.String(),
  displayName: t.String(),
  loggedAt: t.String(), // ISO date
});

export const app = new Elysia()
  .use(
    (app) =>
      app
        .onRequest(({ request, set }) => {
          const origin = request.headers.get("origin") ?? "";
          if (origin.startsWith("http://localhost") || origin.startsWith("http://127.0.0.1")) {
            set.headers["Access-Control-Allow-Origin"] = origin;
            set.headers["Access-Control-Allow-Methods"] = "GET, POST, OPTIONS";
            set.headers["Access-Control-Allow-Headers"] = "Content-Type";
          }
        })
          )
  .options("/*", ({ set }) => {
    set.status = 204;
    return new Response(null, { status: 204 });
  })
  .get("/", () => ({ name: "beta-stack-api", version: "1.0.0" }))
  .post(
    "/auth/login",
    ({ body }) => {
      // Demo: accept any username/password and return a fake user (Eden Treaty demo)
      const user = {
        id: crypto.randomUUID(),
        username: body.username,
        displayName: body.username,
        loggedAt: new Date().toISOString(),
      };
      return user;
    },
    { body: loginBody, response: userSchema }
  )
  .get("/auth/me", () => {
    // Demo: no real auth; could check Authorization header in real app
    return { message: "Use POST /auth/login to get a user. Eden Treaty shares these types with the frontend." };
  });

export type App = typeof app;
