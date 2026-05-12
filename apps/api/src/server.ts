import { app } from "./index";

const port = Number(Bun.env.PORT ?? 3000);

app.listen(port);

console.log(`API running at http://localhost:${app.server?.port ?? port}`);
