interface Env {
  ASSETS: { fetch(request: Request): Promise<Response> };
  TMDB_BEARER_TOKEN?: string;
}

const tmdbCache = new Map<string, { savedAt: number; data: unknown }>();
const TMDB_CACHE_TTL = 15 * 60 * 1000;

const sendJson = (data: unknown, status = 200) => new Response(JSON.stringify(data), {
  status,
  headers: { "content-type": "application/json; charset=utf-8", "cache-control": "no-store" },
});

async function tmdb(env: Env, path: string, params: Record<string, string> = {}) {
  const token = env.TMDB_BEARER_TOKEN?.trim();
  if (!token) throw Object.assign(new Error("Catalogo TMDB non configurato"), { status: 503 });
  const url = new URL(`https://api.themoviedb.org/3${path}`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  const cacheKey = url.toString();
  const cached = tmdbCache.get(cacheKey);
  if (cached && Date.now() - cached.savedAt < TMDB_CACHE_TTL) return cached.data as Record<string, any>;
  const response = await fetch(url, { headers: { Authorization: `Bearer ${token}`, accept: "application/json" } });
  if (!response.ok) throw Object.assign(new Error("TMDB non disponibile"), { status: response.status });
  const data = await response.json();
  tmdbCache.set(cacheKey, { savedAt: Date.now(), data });
  return data as Record<string, any>;
}

function mapSearchMovie(movie: Record<string, any>) {
  return {
    id: movie.id,
    title: movie.title,
    originalTitle: movie.original_title,
    year: movie.release_date?.slice(0, 4) || null,
    synopsis: movie.overview,
    poster: movie.poster_path ? `https://image.tmdb.org/t/p/w500${movie.poster_path}` : null,
    backdrop: movie.backdrop_path ? `https://image.tmdb.org/t/p/w780${movie.backdrop_path}` : null,
  };
}

async function handleApi(request: Request, env: Env, url: URL) {
  if (url.pathname === "/api/health") return sendJson({ ok: true, tmdbConfigured: Boolean(env.TMDB_BEARER_TOKEN?.trim()) });

  if (url.pathname === "/api/catalog/search" && request.method === "GET") {
    const query = url.searchParams.get("q")?.trim();
    if (!query) return sendJson({ error: "Inserisci un titolo da cercare" }, 400);
    const data = await tmdb(env, "/search/movie", { query, language: "it-IT", include_adult: "false" });
    return sendJson({ results: data.results.map(mapSearchMovie), page: data.page, totalPages: data.total_pages });
  }

  const detailMatch = url.pathname.match(/^\/api\/catalog\/movie\/(\d+)$/);
  if (detailMatch && request.method === "GET") {
    const movie = await tmdb(env, `/movie/${detailMatch[1]}`, {
      language: "it-IT",
      append_to_response: "credits,images",
      include_image_language: "it,en,null",
    });
    const crew = movie.credits?.crew || [];
    return sendJson({
      ...mapSearchMovie(movie),
      duration: movie.runtime,
      country: movie.production_countries?.map((item: Record<string, string>) => item.name).join(" / ") || null,
      genres: movie.genres?.map((item: Record<string, string>) => item.name) || [],
      director: crew.find((person: Record<string, string>) => person.job === "Director")?.name || null,
      productionDesigners: [...new Set<string>(crew.filter((person: Record<string, string>) => ["Production Design", "Art Direction"].includes(person.job)).map((person: Record<string, string>) => person.name))],
      cinematographer: crew.find((person: Record<string, string>) => person.job === "Director of Photography")?.name || null,
      images: (movie.images?.backdrops || []).slice(0, 8).map((image: Record<string, string>) => `https://image.tmdb.org/t/p/w1280${image.file_path}`),
      editorial: null,
    });
  }

  return sendJson({ error: "Risorsa non trovata" }, 404);
}

export default {
  async fetch(request: Request, env: Env): Promise<Response> {
    const url = new URL(request.url);
    try {
      if (url.pathname.startsWith("/api/")) return await handleApi(request, env, url);
      if (url.pathname === "/" || url.pathname === "/index.html") {
        return env.ASSETS.fetch(new Request(new URL("/lente.html", request.url), request));
      }
      return env.ASSETS.fetch(request);
    } catch (error) {
      const typedError = error as Error & { status?: number };
      return sendJson({ error: typedError.message || "Errore interno" }, typedError.status || 500);
    }
  },
};
