import app from "./app";
import { migrate } from "./db/migrate";

const PORT = 3000;

async function start() {
  await migrate();

  app.listen(PORT, () => {
    console.log(`Server started on http://localhost:${PORT}`);
  });
}

start();