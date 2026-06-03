import app from "./src/app";
import { migrate } from "./src/db/migrate";

const PORT = 3000;

async function start() {
  await migrate();

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

start().catch((err) => {
  console.error("Server start error:", err);
  process.exit(1);
});
