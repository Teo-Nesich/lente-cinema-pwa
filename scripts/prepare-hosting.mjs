import { copyFile, cp, mkdir, rm } from "node:fs/promises";

await mkdir("public", { recursive: true });
await copyFile("index.html", "public/lente.html");

for (const file of ["app.js", "catalog.js", "data.js", "styles.css", "sw.js", "manifest.webmanifest"]) {
  await copyFile(file, `public/${file}`);
}

await rm("public/assets", { recursive: true, force: true });
await cp("assets", "public/assets", { recursive: true });
