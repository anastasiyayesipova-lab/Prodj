import fs from "fs";
import path from "path";
import { all, exec, run } from "./dbClient";

async function migrate() {
  await exec(`
    PRAGMA foreign_keys = ON;

    CREATE TABLE IF NOT EXISTS schema_migrations (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      filename TEXT NOT NULL UNIQUE,
      appliedAt TEXT NOT NULL
    );
  `);

  const migrationsDir = path.join(__dirname, "migrations");

  if (!fs.existsSync(migrationsDir)) {
    console.log("No migrations directory found");
    return;
  }

  const files = fs
    .readdirSync(migrationsDir)
    .filter((file) => file.endsWith(".sql"))
    .sort();

  const appliedRows = await all(`
    SELECT filename
    FROM schema_migrations
    ORDER BY filename ASC;
  `);

  const appliedSet = new Set(appliedRows.map((row) => row.filename));

  for (const file of files) {
    if (appliedSet.has(file)) {
      continue;
    }

    const filePath = path.join(migrationsDir, file);
    const sql = fs.readFileSync(filePath, "utf8");

    console.log(`Applying migration: ${file}`);
    await exec(sql);

    const appliedAt = new Date().toISOString();

    await run(
  `
  INSERT INTO schema_migrations (filename, appliedAt)
  VALUES (?, ?);
`,
  [file, appliedAt]
);
  }

  console.log("Migrations completed");
}

export { migrate };