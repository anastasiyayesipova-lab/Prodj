import path from "node:path";
import fs from "node:fs";
import sqlite3 from "sqlite3";

const dataDir = path.join(process.cwd(), "data");
const dbPath = path.join(dataDir, "app.db");

if (!fs.existsSync(dataDir)) {
  fs.mkdirSync(dataDir, { recursive: true });
}

const db = new sqlite3.Database(dbPath, (err) => {
  if (err) {
    console.error("Failed to open SQLite DB:", err.message);
    process.exit(1);
  }

  console.log("SQLite DB opened:", dbPath);
});

export { db };
