import { genres, movies } from "./data.js";
import { filterMovies, formatProductionDesigners } from "./catalog.js";

const state = {
  query: "",
  genre: "Tutti",
  currentView: "home",
  remoteResults: [],
  remoteRequest: 0,
  saved: new Set(JSON.parse(localStorage.getItem("lente:saved") || "[]"))
};

const elements = {
  app: document.querySelector("#app"),
  home: document.querySelector("#home-view"),
  saved: document.querySelector("#saved-view"),
  detail: document.querySelector("#detail-view"),
  grid: document.querySelector("#movie-grid"),
  savedGrid: document.querySelector("#saved-grid"),
  savedEmpty: document.querySelector("#saved-empty"),
  empty: document.querySelector("#empty-state"),
  spotlight: document.querySelector("#spotlight"),
  spotlightSection: document.querySelector("#spotlight-section"),
  filterRow: document.querySelector("#filter-row"),
  resultCount: document.querySelector("#result-count"),
  resultLabel: document.querySelector("#result-label"),
  input: document.querySelector("#search-input"),
  clear: document.querySelector("#clear-search"),
  dialog: document.querySelector("#about-dialog"),
  toast: document.querySelector("#toast")
};

async function checkCatalogStatus() {
  try {
    const response = await fetch("/api/health");
    const status = await response.json();
    document.querySelector("#catalog-live").hidden = !status.tmdbConfigured;
  } catch {
    document.querySelector("#catalog-live").hidden = true;
  }
}

async function hydrateCuratedMovies() {
  const results = await Promise.allSettled(movies.map(async (movie) => {
    const response = await fetch(`/api/catalog/movie/${movie.tmdbId}`);
    if (!response.ok) throw new Error("Immagini non disponibili");
    return { movie, remote: await response.json() };
  }));

  for (const result of results) {
    if (result.status !== "fulfilled") continue;
    const { movie, remote } = result.value;
    movie.poster = remote.poster || movie.poster;
    movie.backdrop = remote.backdrop || remote.images?.[0] || movie.backdrop;
    movie.gallery = movie.gallery.map((item, index) => ({
      ...item,
      src: remote.images?.[index] || item.src,
      caption: remote.images?.[index] ? "Immagine promozionale fornita dal catalogo TMDB" : item.caption
    }));
  }

  renderSpotlight();
  renderCatalog();
  if (state.currentView === "saved") renderSaved();
  const detailMatch = location.hash.match(/^#film\/(.+)$/);
  const currentMovie = detailMatch && movies.find((movie) => movie.id === detailMatch[1]);
  if (currentMovie && state.currentView === "detail") elements.detail.innerHTML = detailTemplate(currentMovie);
}

const escapeHtml = (value = "") => String(value).replace(/[&<>'"]/g, (char) => ({
  "&": "&amp;", "<": "&lt;", ">": "&gt;", "'": "&#39;", '"': "&quot;"
}[char]));

const visualStyle = (movie, index = 0) => {
  const [first, second, third] = movie.palette;
  const angle = 120 + index * 25;
  return `--c1:${first};--c2:${second};--c3:${third};--angle:${angle}deg`;
};

function bookmarkButton(movie, className = "bookmark") {
  const isSaved = state.saved.has(movie.id);
  return `<button class="${className} ${isSaved ? "is-saved" : ""}" type="button" data-save="${movie.id}" aria-label="${isSaved ? "Rimuovi dai" : "Aggiungi ai"} salvati" aria-pressed="${isSaved}">
    <svg aria-hidden="true" viewBox="0 0 24 24"><path d="M20.8 4.6a5.5 5.5 0 0 0-7.8 0L12 5.7l-1.1-1.1a5.5 5.5 0 0 0-7.8 7.8l1.1 1.1L12 21l7.7-7.5 1.1-1.1a5.5 5.5 0 0 0 0-7.8Z" /></svg>
  </button>`;
}

function movieCard(movie, index = 0) {
  const isRemote = movie.source === "tmdb";
  return `<article class="movie-card" data-movie="${movie.id}">
    <button class="poster poster-${index % 4}" type="button" data-open="${movie.id}" style="${visualStyle(movie, index)}" aria-label="Apri ${escapeHtml(movie.title)}">
      ${movie.poster ? `<img class="poster-image" src="${escapeHtml(movie.poster)}" alt="Locandina di ${escapeHtml(movie.title)}" loading="lazy" />` : ""}
      <span class="poster-grain"></span>
      <span class="poster-year">${movie.year}</span>
      <span class="poster-title">${escapeHtml(movie.title)}</span>
      <span class="poster-credit">${isRemote ? "Catalogo · TMDB" : `Fotografia · ${escapeHtml(movie.cinematographer)}`}</span>
    </button>
    <div class="card-copy">
      <div>
        <p>${escapeHtml(movie.genres[0])}${movie.duration ? ` · ${movie.duration}` : ""}</p>
        <button type="button" data-open="${movie.id}" class="title-button">${escapeHtml(movie.title)}</button>
        <span>${isRemote ? "Apri per vedere la troupe" : `Regia di ${escapeHtml(movie.director)}`}</span>
      </div>
      ${isRemote ? "" : bookmarkButton(movie)}
    </div>
  </article>`;
}

function renderFilters() {
  elements.filterRow.innerHTML = genres.map((genre) => `<button type="button" class="filter-chip ${state.genre === genre ? "is-active" : ""}" data-genre="${genre}">${genre}</button>`).join("");
}

function renderSpotlight() {
  const movie = movies.find((item) => item.featured) || movies[0];
  elements.spotlight.innerHTML = `<article class="spotlight-card" style="${visualStyle(movie, 1)}">
    ${movie.backdrop ? `<img class="spotlight-image" src="${escapeHtml(movie.backdrop)}" alt="Immagine promozionale di ${escapeHtml(movie.title)}" />` : ""}
    <span class="spotlight-lines" aria-hidden="true"></span>
    <div class="spotlight-content">
      <div class="spotlight-meta"><span>${movie.year}</span><span>${escapeHtml(movie.genres[0])}</span><span>${movie.duration}</span></div>
      <h3>${escapeHtml(movie.title)}</h3>
      <p>${escapeHtml(movie.tagline)}</p>
      <button type="button" class="primary-button" data-open="${movie.id}">Entra nel film <span>→</span></button>
    </div>
    <div class="spotlight-role">
      <span>Direttore della fotografia</span>
      <strong>${escapeHtml(movie.cinematographer)}</strong>
    </div>
  </article>`;
}

function renderCatalog() {
  const local = filterMovies(movies, state.query, state.genre);
  const remote = state.query && state.genre === "Tutti" ? state.remoteResults.filter((item) => !movies.some((movie) => movie.tmdbId === item.tmdbId)) : [];
  const filtered = [...local, ...remote];
  elements.grid.innerHTML = filtered.map(movieCard).join("");
  elements.resultCount.textContent = `${filtered.length} ${filtered.length === 1 ? "film" : "film"}`;
  elements.empty.hidden = filtered.length > 0;
  elements.grid.hidden = filtered.length === 0;
  elements.spotlightSection.hidden = Boolean(state.query) || state.genre !== "Tutti";
  elements.resultLabel.textContent = state.query ? `Risultati per “${state.query}”` : state.genre === "Tutti" ? "Archivio curato" : `Genere · ${state.genre}`;
}

let remoteTimer;
async function searchRemote(query) {
  const request = ++state.remoteRequest;
  if (query.trim().length < 2) {
    state.remoteResults = [];
    renderCatalog();
    return;
  }
  try {
    const response = await fetch(`/api/catalog/search?q=${encodeURIComponent(query.trim())}`);
    if (!response.ok) return;
    const data = await response.json();
    if (request !== state.remoteRequest) return;
    state.remoteResults = data.results.map((movie) => ({
      ...movie,
      id: `tmdb-${movie.id}`,
      tmdbId: movie.id,
      genres: ["Catalogo TMDB"],
      palette: ["#8d795d", "#39424d", "#111210"],
      source: "tmdb"
    }));
    renderCatalog();
  } catch {
    // La ricerca locale continua a funzionare anche senza connessione o token TMDB.
  }
}

function renderSaved() {
  const savedMovies = movies.filter((movie) => state.saved.has(movie.id));
  elements.savedGrid.innerHTML = savedMovies.map(movieCard).join("");
  elements.savedEmpty.hidden = savedMovies.length > 0;
  elements.savedGrid.hidden = savedMovies.length === 0;
}

function detailTemplate(movie) {
  const hasCatalogImages = movie.gallery.some((image) => image.src);
  return `<div class="detail-hero" style="${visualStyle(movie, 2)}">
    ${movie.backdrop ? `<img class="detail-backdrop" src="${escapeHtml(movie.backdrop)}" alt="Immagine promozionale di ${escapeHtml(movie.title)}" />` : ""}
    <span class="detail-grain" aria-hidden="true"></span>
    <button class="back-button" type="button" data-action="back" aria-label="Torna indietro">←</button>
    ${movie.source === "tmdb" ? "" : bookmarkButton(movie, "detail-bookmark")}
    <div class="detail-heading">
      <div class="spotlight-meta"><span>${movie.year}</span><span>${escapeHtml(movie.country)}</span><span>${movie.duration}</span></div>
      <h1>${escapeHtml(movie.title)}</h1>
      <p>${escapeHtml(movie.originalTitle)}</p>
    </div>
  </div>
  <div class="detail-body">
    <section class="synopsis-block">
      <p class="eyebrow">Il film</p>
      <p class="lead">${escapeHtml(movie.synopsis)}</p>
      <div class="genre-list">${movie.genres.map((genre) => `<span>${escapeHtml(genre)}</span>`).join("")}</div>
    </section>

    <section class="crew-section">
      <div class="section-heading"><div><p class="eyebrow">Chi crea il mondo</p><h2>Dietro l’immagine</h2></div><span class="section-number">01</span></div>
      <div class="crew-grid">
        <div class="crew-card"><span>Regia</span><strong>${escapeHtml(movie.director)}</strong><small>Visione e messa in scena</small></div>
        <div class="crew-card featured"><span>Fotografia</span><strong>${escapeHtml(movie.cinematographer)}</strong><small>Luce, ottiche e composizione</small></div>
        <div class="crew-card"><span>Scenografia</span><strong>${escapeHtml(formatProductionDesigners(movie.productionDesigners))}</strong><small>Spazi, set e materia</small></div>
      </div>
    </section>

    <section class="gallery-section">
      <div class="section-heading"><div><p class="eyebrow">L’immagine</p><h2>Dentro l’inquadratura</h2></div><span class="section-number">02</span></div>
      <p class="section-intro">Palette: ${escapeHtml(movie.visualLabel)}. ${hasCatalogImages ? "Locandina e immagini promozionali provengono dal catalogo TMDB; la disponibilità può variare per ciascun titolo." : "Per questo titolo non sono ancora disponibili immagini di catalogo: vengono mostrati studi visivi segnaposto."}</p>
      <div class="gallery-strip">
        ${movie.gallery.map((image, index) => `<figure class="gallery-image ${image.ratio}" style="${visualStyle(movie, index + 2)}">
          ${image.src ? `<img src="${escapeHtml(image.src)}" alt="${escapeHtml(image.label)}" loading="lazy" />` : ""}
          <span class="gallery-shape" aria-hidden="true"></span>
          <figcaption><strong>${escapeHtml(image.label)}</strong><span>${escapeHtml(image.caption)}</span></figcaption>
        </figure>`).join("")}
      </div>
      <div class="photo-credit"><span>Direzione della fotografia</span><strong>${escapeHtml(movie.cinematographer)}</strong></div>
    </section>

    <section class="curiosity-section">
      <div class="section-heading light"><div><p class="eyebrow">Dal set</p><h2>Curiosità</h2></div><span class="section-number">03</span></div>
      <div class="curiosity-grid">
        ${movie.curiosity.length ? movie.curiosity.map((item, index) => `<article><span class="curiosity-index">0${index + 1}</span><h3>${escapeHtml(item.title)}</h3><p>${escapeHtml(item.text)}</p></article>`).join("") : `<article class="editorial-empty"><span class="curiosity-index">✦</span><h3>La ricerca continua</h3><p>Questa scheda arriva dal catalogo generale. Le curiosità saranno pubblicate dopo la verifica delle fonti da parte della redazione.</p></article>`}
      </div>
      ${movie.challenge ? `<div class="challenge-card"><div class="challenge-icon" aria-hidden="true">!</div><div><span>La difficoltà sul set</span><p>${escapeHtml(movie.challenge)}</p></div></div>` : ""}
    </section>

    <section class="source-section">
      <p class="eyebrow">Nota editoriale</p>
      <p>I contenuti presenti sono una selezione dimostrativa. Prima della pubblicazione ogni curiosità va accompagnata da una fonte verificabile.</p>
      <a href="https://www.themoviedb.org/movie/${movie.tmdbId}" target="_blank" rel="noreferrer">Scheda del film su TMDB ↗</a>
    </section>
  </div>`;
}

function showView(view) {
  state.currentView = view;
  elements.home.hidden = view !== "home";
  elements.saved.hidden = view !== "saved";
  elements.detail.hidden = view !== "detail";
  document.querySelectorAll("[data-nav]").forEach((item) => item.classList.toggle("is-active", item.dataset.nav === view || (view === "detail" && item.dataset.nav === "home")));
  if (view === "saved") renderSaved();
  elements.app.focus({ preventScroll: true });
  window.scrollTo({ top: 0, behavior: "smooth" });
}

async function openMovie(id, { pushHistory = true } = {}) {
  const movie = movies.find((item) => item.id === id);
  if (!movie && id.startsWith("tmdb-")) return openRemoteMovie(id.slice(5), { pushHistory });
  if (!movie) return;
  elements.detail.innerHTML = detailTemplate(movie);
  showView("detail");
  if (pushHistory) history.pushState({ movie: id }, "", `#film/${id}`);
}

async function openRemoteMovie(tmdbId, { pushHistory = true } = {}) {
  showView("detail");
  elements.detail.innerHTML = `<div class="detail-loading"><span class="brand-mark large"></span><p>Carico la troupe e le immagini…</p></div>`;
  try {
    const response = await fetch(`/api/catalog/movie/${tmdbId}`);
    if (!response.ok) throw new Error("Scheda non disponibile");
    const raw = await response.json();
    const minutes = Number(raw.duration || 0);
    const movie = {
      ...raw,
      id: `tmdb-${raw.id}`,
      tmdbId: raw.id,
      duration: minutes ? `${Math.floor(minutes / 60)}h ${String(minutes % 60).padStart(2, "0")}m` : "Durata non disponibile",
      country: raw.country || "Paese non disponibile",
      director: raw.director || "Dato non disponibile",
      productionDesigners: raw.productionDesigners || [],
      cinematographer: raw.cinematographer || "Dato non disponibile",
      palette: ["#8d795d", "#39424d", "#111210"],
      visualLabel: "immagini dal catalogo TMDB",
      gallery: (raw.images || []).slice(0, 3).map((src, index) => ({ src, label: `Immagine ${index + 1}`, caption: "Immagine fornita dal catalogo TMDB", ratio: index ? "square" : "wide" })),
      curiosity: [],
      challenge: "",
      source: "tmdb"
    };
    if (!movie.gallery.length) movie.gallery = [{ label: "Immagine non disponibile", caption: "Catalogo TMDB", ratio: "wide" }];
    elements.detail.innerHTML = detailTemplate(movie);
    if (pushHistory) history.pushState({ movie: movie.id }, "", `#film/${movie.id}`);
  } catch {
    elements.detail.innerHTML = `<div class="detail-loading"><span class="empty-reel">◌</span><h1>Scheda non disponibile</h1><p>Controlla il collegamento a TMDB e riprova.</p><button class="text-button" type="button" data-action="home">Torna alla home →</button></div>`;
  }
}

function toggleSaved(id) {
  const movie = movies.find((item) => item.id === id);
  if (!movie) return;
  if (state.saved.has(id)) {
    state.saved.delete(id);
    showToast("Rimosso dai salvati");
  } else {
    state.saved.add(id);
    showToast("Aggiunto ai salvati");
  }
  localStorage.setItem("lente:saved", JSON.stringify([...state.saved]));
  renderSpotlight();
  renderCatalog();
  if (state.currentView === "saved") renderSaved();
  if (state.currentView === "detail") elements.detail.innerHTML = detailTemplate(movie);
}

let toastTimer;
function showToast(message) {
  elements.toast.textContent = message;
  elements.toast.classList.add("is-visible");
  clearTimeout(toastTimer);
  toastTimer = setTimeout(() => elements.toast.classList.remove("is-visible"), 2200);
}

function goHome({ focusSearch = false } = {}) {
  showView("home");
  if (location.hash) history.pushState({}, "", location.pathname);
  if (focusSearch) setTimeout(() => elements.input.focus(), 50);
}

document.addEventListener("click", (event) => {
  const open = event.target.closest("[data-open]");
  const save = event.target.closest("[data-save]");
  const genre = event.target.closest("[data-genre]");
  const nav = event.target.closest("[data-nav]");
  const action = event.target.closest("[data-action]");
  if (open) openMovie(open.dataset.open);
  if (save) { event.stopPropagation(); toggleSaved(save.dataset.save); }
  if (genre) { state.genre = genre.dataset.genre; renderFilters(); renderCatalog(); }
  if (nav?.dataset.nav === "home") goHome();
  if (nav?.dataset.nav === "search") goHome({ focusSearch: true });
  if (nav?.dataset.nav === "saved") {
    showView("saved");
    if (location.hash !== "#saved") history.pushState({ view: "saved" }, "", "#saved");
  }
  if (action?.dataset.action === "home") goHome();
  if (action?.dataset.action === "back") history.length > 1 ? history.back() : goHome();
  if (action?.dataset.action === "about") elements.dialog.showModal();
  if (action?.dataset.action === "close-about") elements.dialog.close();
});

elements.input.addEventListener("input", () => {
  state.query = elements.input.value;
  elements.clear.hidden = !state.query;
  renderCatalog();
  clearTimeout(remoteTimer);
  remoteTimer = setTimeout(() => searchRemote(state.query), 420);
});

elements.clear.addEventListener("click", () => {
  elements.input.value = "";
  state.query = "";
  state.remoteResults = [];
  state.remoteRequest += 1;
  elements.clear.hidden = true;
  elements.input.focus();
  renderCatalog();
});

document.querySelector("#search-form").addEventListener("submit", (event) => event.preventDefault());
elements.dialog.addEventListener("click", (event) => {
  if (event.target === elements.dialog) elements.dialog.close();
});

window.addEventListener("popstate", () => {
  const match = location.hash.match(/^#film\/(.+)$/);
  if (match) openMovie(match[1], { pushHistory: false });
  else if (location.hash === "#saved") showView("saved");
  else showView("home");
});

function init() {
  checkCatalogStatus();
  renderFilters();
  renderSpotlight();
  renderCatalog();
  const match = location.hash.match(/^#film\/(.+)$/);
  if (match) {
    const movie = movies.find((item) => item.id === match[1]);
    if (movie) {
      elements.detail.innerHTML = detailTemplate(movie);
      showView("detail");
    }
  } else if (location.hash === "#saved") showView("saved");
  if ("serviceWorker" in navigator) navigator.serviceWorker.register("/sw.js").catch(() => {});
  hydrateCuratedMovies();
}

init();
