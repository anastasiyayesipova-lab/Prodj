import fs from "node:fs";
import path from "node:path";

const root = process.cwd();
const source = path.join(root, "frontend");
const dist = path.join(root, "frontend-dist", "frontend");

fs.mkdirSync(dist, { recursive: true });
for (const file of ["index.html", "styles.css", "assets"]) {
  const from = path.join(source, file);
  const to = path.join(dist, file);
  if (!fs.existsSync(from)) continue;
  fs.cpSync(from, to, { recursive: true });
}
console.log("Frontend build copied to frontend-dist/frontend");
