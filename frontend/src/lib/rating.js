// O JSON mistura escalas: RAWG dá nota de 0–5, IGDB de 0–100.
// Normalizamos tudo para uma escala única de 0–10 para exibir e filtrar.
// Heurística: valores <= 5 vieram da RAWG (multiplica por 2);
// valores > 5 vieram da IGDB (divide por 10).
export function toScore10(rating) {
  if (rating == null || Number.isNaN(rating)) return null;
  const score = rating <= 5 ? rating * 2 : rating / 10;
  return Math.round(score * 10) / 10; // 1 casa decimal
}

// Quantas "estrelas" (0–5) representar a partir da nota 0–10.
export function toStars(rating) {
  const s = toScore10(rating);
  return s == null ? 0 : s / 2;
}
