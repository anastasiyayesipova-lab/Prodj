import fs from "fs";
import path from "path";
import { exec } from "./dbClient";
import { migrate } from "./migrate";

async function seedDb() {
  await migrate();

  const seedPath = path.join(__dirname, "seed.sql");
  const sql = fs.readFileSync(seedPath, "utf8");

  await exec(sql);
  console.log("DB seed completed");
}

seedDb().catch((err) => {
  console.error("Seed error:", err);
  process.exit(1);
});