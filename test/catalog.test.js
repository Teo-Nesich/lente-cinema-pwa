import test from "node:test";
import assert from "node:assert/strict";
import { filterMovies, formatProductionDesigners } from "../catalog.js";
import { movies } from "../data.js";

test("cerca senza distinguere maiuscole o accenti", () => {
  assert.equal(filterMovies(movies, "villeneuve").length, 2);
  assert.equal(filterMovies(movies, "fotografia inesistente").length, 0);
});

test("cerca anche nei mestieri della troupe", () => {
  assert.equal(filterMovies(movies, "Roger Deakins")[0].id, "blade-runner-2049");
  assert.equal(filterMovies(movies, "Adam Stockhausen")[0].id, "grand-budapest-hotel");
});

test("combina ricerca e genere", () => {
  assert.deepEqual(filterMovies(movies, "Denis", "Avventura").map((movie) => movie.id), ["dune-part-two"]);
});

test("formatta uno o più scenografi", () => {
  assert.equal(formatProductionDesigners(["A"]), "A");
  assert.equal(formatProductionDesigners(["A", "B", "C"]), "A, B e C");
  assert.equal(formatProductionDesigners([]), "Dato non disponibile");
});
