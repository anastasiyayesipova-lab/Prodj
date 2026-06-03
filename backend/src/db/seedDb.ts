import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";
import { exec } from "./dbClient";
import { migrate } from "./migrate";

async function seedDb() {
  await migrate();

  const __filename = fileURLToPath(import.meta.url);
  const __dirname = path.dirname(__filename);
  const seedPath = path.join(__dirname, "seed.sql");
  const sql = fs.readFileSync(seedPath, "utf8");

  await exec(sql);
  console.log("DB seed completed");
}

seedDb().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});