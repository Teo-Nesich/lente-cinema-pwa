const normalize = (value = "") => value
  .normalize("NFD")
  .replace(/[\u0300-\u036f]/g, "")
  .toLocaleLowerCase("it");

export function searchableText(movie) {
  return normalize([
    movie.title,
    movie.originalTitle,
    movie.director,
    movie.cinematographer,
    ...(movie.productionDesigners || []),
    ...(movie.genres || [])
  ].join(" "));
}

export function filterMovies(movies, query = "", genre = "Tutti") {
  const normalizedQuery = normalize(query.trim());
  return movies.filter((movie) => {
    const matchesGenre = genre === "Tutti" || movie.genres.includes(genre);
    const matchesQuery = !normalizedQuery || searchableText(movie).includes(normalizedQuery);
    return matchesGenre && matchesQuery;
  });
}

export function formatProductionDesigners(names = []) {
  if (!names.length) return "Dato non disponibile";
  if (names.length === 1) return names[0];
  return `${names.slice(0, -1).join(", ")} e ${names.at(-1)}`;
}
