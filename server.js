import { createServer } from "node:http";
import { readFile, stat } from "node:fs/promises";
import { readFileSync } from "node:fs";
import { extname, join, normalize } from "node:path";
import { fileURLToPath } from "node:url";

const root = fileURLToPath(new URL(".", import.meta.url));
const port = Number(process.env.PORT || 4173);
const host = process.env.HOST || "0.0.0.0";

function readLocalEnv() {
  try {
    const content = readFileSync(join(root, ".env"), "utf8");
    for (const rawLine of content.split(/\r?\n/)) {
      const line = rawLine.trim();
      if (!line || line.startsWith("#")) continue;
      const separator = line.indexOf("=");
      if (separator < 1) continue;
      const key = line.slice(0, separator).trim();
      const value = line.slice(separator + 1).trim().replace(/^(['"])(.*)\1$/, "$2");
      if (!process.env[key]) process.env[key] = value;
    }
  } catch (error) {
    if (error.code !== "ENOENT") console.warn("Impossibile leggere il file .env");
  }
}

readLocalEnv();
const token = process.env.TMDB_BEARER_TOKEN?.trim();

const mime = {
  ".html": "text/html; charset=utf-8",
  ".js": "text/javascript; charset=utf-8",
  ".css": "text/css; charset=utf-8",
  ".json": "application/json; charset=utf-8",
  ".webmanifest": "application/manifest+json; charset=utf-8",
  ".svg": "image/svg+xml"
};

const tmdbCache = new Map();
const TMDB_CACHE_TTL = 15 * 60 * 1000;

const sendJson = (res, status, data) => {
  res.writeHead(status, { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" });
  res.end(JSON.stringify(data));
};

async function tmdb(path, params = {}) {
  if (!token) throw Object.assign(new Error("Catalogo TMDB non configurato"), { status: 503 });
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const cacheKey = url.toString();
  const cached = tmdbCache.get(cacheKey);
  if (cached && Date.now() - cached.savedAt < TMDB_CACHE_TTL) return cached.data;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, accept: "application/json" } });
  if (!response.ok) throw Object.assign(new Error("TMDB non disponibile"), { status: response.status });
  const data = await response.json();
  tmdbCache.set(cacheKey, { savedAt: Date.now(), data });
  return data;
}

function mapSearchMovie(movie) {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    year: movie.release_date?.slice(0, 4) || null,
    synopsis: movie.overview,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : null
  };
}

async function handleApi(req, res, url) {
  if (url.pathname === "/api/health") {
    return sendJson(res, 200, { ok: true, tmdbConfigured: Boolean(token) });
  }
  if (url.pathname === "/api/catalog/search" && req.method === "GET") {
    const query = url.searchParams.get("q")?.trim();
    if (!query) return sendJson(res, 400, { error: "Inserisci un titolo da cercare" });
    const data = await tmdb("/search/movie", { query, language: "it-IT", include_adult: "false" });
    return sendJson(res, 200, { results: data.results.map(mapSearchMovie), page: data.page, totalPages: data.total_pages });
  }
  const detailMatch = url.pathname.match(/^\/api\/catalog\/movie\/(\d+)$/);
  if (detailMatch && req.method === "GET") {
    const movie = await tmdb(`/movie/${detailMatch[1]}`, {
      language: "it-IT",
      append_to_response: "credits,images",
      include_image_language: "it,en,null"
    });
    const crew = movie.credits?.crew || [];
    return sendJson(res, 200, {
      ...mapSearchMovie(movie),
      duration: movie.runtime,
      country: movie.production_countries?.map((item) => item.name).join(" / ") || null,
      genres: movie.genres?.map((item) => item.name) || [],
      director: crew.find((person) => person.job === "Director")?.name || null,
      productionDesigners: [...new Set(crew.filter((person) => ["Production Design", "Art Direction"].includes(person.job)).map((person) => person.name))],
      cinematographer: crew.find((person) => person.job === "Director of Photography")?.name || null,
      images: (movie.images?.backdrops || []).slice(0, 8).map((image) => `https://image.tmdb.org/t/p/w1280${image.file_path}`),
      editorial: null
    });
  }
  return sendJson(res, 404, { error: "Risorsa non trovata" });
}

const server = createServer(async (req, res) => {
  const url = new URL(req.url, `http://${req.headers.host || "localhost"}`);
  try {
    if (url.pathname.startsWith("/api/")) return await handleApi(req, res, url);
    const requested = url.pathname === "/" ? "index.html" : decodeURIComponent(url.pathname.slice(1));
    const safePath = normalize(requested).replace(/^(\.\.(\/|\\|$))+/, "");
    let filePath = join(root, safePath);
    try {
      if ((await stat(filePath)).isDirectory()) filePath = join(filePath, "index.html");
    } catch {
      filePath = join(root, "index.html");
    }
    const data = await readFile(filePath);
    res.writeHead(200, { "content-type": mime[extname(filePath)] || "application/octet-stream" });
    res.end(data);
  } catch (error) {
    if (url.pathname.startsWith("/api/")) return sendJson(res, error.status || 500, { error: error.message || "Errore interno" });
    res.writeHead(500, { "content-type": "text/plain; charset=utf-8" });
    res.end("Errore interno");
  }
});

server.listen(port, host, () => {
  console.log(`Lente disponibile sulla porta ${port} (${host})`);
  console.log(token ? "Catalogo TMDB collegato" : "Catalogo demo attivo (TMDB_BEARER_TOKEN non impostato)");
});
