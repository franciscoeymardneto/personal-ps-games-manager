// Leitura do banco e montagem do formato que o frontend consome.
// Recebe um handle `db` com a interface prepare(sql).all()/.get() — compatível
// tanto com better-sqlite3 quanto com o node:sqlite nativo.

const PS_ORDER = ["PS1", "PS2", "PS3", "PS4", "PS5"];
const orderOf = (p) => {
  const i = PS_ORDER.indexOf(p);
  return i < 0 ? 99 : i;
};

// Normaliza nota: RAWG (0–5) e IGDB (0–100) -> escala única 0–10.
export function toScore10(rating) {
  if (rating == null || Number.isNaN(rating)) return null;
  const s = rating <= 5 ? rating * 2 : rating / 10;
  return Math.round(s * 10) / 10;
}

// Aceita array (POST) ou string "a,b,c" (GET) e devolve sempre um array limpo.
function asArray(v) {
  if (Array.isArray(v)) return v.map((x) => String(x).trim()).filter(Boolean);
  if (typeof v === "string")
    return v.split(",").map((x) => x.trim()).filter(Boolean);
  return [];
}

const isTruthy = (v) => v === true || v === 1 || v === "1" || v === "true";

const SELECT = `
  SELECT g.id, g.name, g.norm_key, g.description, g.cover, g.released,
         g.year, g.rating, g.platform, g.sources, g.rawg_id, g.igdb_id,
         (SELECT group_concat(platform) FROM game_platforms WHERE game_id = g.id) AS plats,
         (SELECT group_concat(genre)    FROM game_genres    WHERE game_id = g.id) AS genres
  FROM games g
`;

function mapRow(r) {
  const psPlatforms = [...new Set(r.plats ? r.plats.split(",") : [])].sort(
    (a, b) => orderOf(a) - orderOf(b),
  );
  const compatibility = psPlatforms.filter((p) => p !== r.platform);
  const genres = r.genres ? [...new Set(r.genres.split(","))] : [];

  return {
    name: r.name,
    normKey: r.norm_key,
    description: r.description ?? null,
    cover: r.cover ?? null,
    released: r.released ?? null,
    year: r.year ?? null,
    rating: r.rating ?? null, // bruto — o front normaliza p/ exibir
    platform: r.platform,
    compatibility,
    psPlatforms,
    genres,
    sources: r.sources ? r.sources.split(",") : [],
    rawgId: r.rawg_id ?? null,
    igdbId: r.igdb_id ?? null,
  };
}

export function getAllGames(db) {
  return db.prepare(SELECT).all().map(mapRow);
}

export function getGameById(db, id) {
  const row = db.prepare(`${SELECT} WHERE g.norm_key = ?`).get(id);
  return row ? mapRow(row) : null;
}

// Metadados p/ montar filtros no front (dropdowns + contagens).
export function getMeta(games) {
  const genres = [...new Set(games.flatMap((g) => g.genres))].sort();
  const byPlatform = {};
  for (const p of PS_ORDER) byPlatform[p] = 0;
  for (const g of games) byPlatform[g.platform] = (byPlatform[g.platform] || 0) + 1;
  return { total: games.length, platforms: PS_ORDER, genres, byPlatform };
}

// ---- filtro + ordenação (sem paginar) ----
function filterAndSort(games, p) {
  let out = games;

  // recorte por ids (coleções/listas do front). Se a chave `ids` veio (mesmo
  // vazia), restringe; se não veio, é o catálogo inteiro.
  if (p.ids !== undefined && p.ids !== null) {
    const set = new Set(asArray(p.ids));
    out = out.filter((g) => set.has(g.normKey));
  }

  if (p.q) {
    const needle = String(p.q).toLowerCase();
    out = out.filter((g) => g.name.toLowerCase().includes(needle));
  }

  const plats = asArray(p.platform).map((s) => s.toUpperCase());
  if (plats.length) {
    out = out.filter((g) => plats.some((pl) => g.psPlatforms.includes(pl)));
  }

  if (p.genre) out = out.filter((g) => g.genres.includes(p.genre));

  if (isTruthy(p.multi)) out = out.filter((g) => g.compatibility.length > 0);

  const min = Number(p.minRating) || 0;
  if (min > 0) {
    out = out.filter((g) => {
      const s = toScore10(g.rating);
      return s != null && s >= min;
    });
  }

  const byYear = (g) => g.year || 0;
  const sorters = {
    rating: (a, b) => (toScore10(b.rating) || 0) - (toScore10(a.rating) || 0),
    "year-desc": (a, b) => byYear(b) - byYear(a),
    "year-asc": (a, b) => byYear(a) - byYear(b),
    name: (a, b) => a.name.localeCompare(b.name),
  };
  return [...out].sort(sorters[p.sort] || sorters.name);
}

// ---- consulta paginada: filtra, ordena e recorta a página ----
export function queryGames(games, params = {}) {
  const page = Math.max(1, parseInt(params.page, 10) || 1);
  const rawSize = parseInt(params.pageSize, 10) || 24;
  const pageSize = Math.min(Math.max(1, rawSize), 100); // teto de 100

  const filtered = filterAndSort(games, params);
  const total = filtered.length;
  const totalPages = Math.max(1, Math.ceil(total / pageSize));
  const safePage = Math.min(page, totalPages);
  const start = (safePage - 1) * pageSize;
  const items = filtered.slice(start, start + pageSize);

  return {
    items,
    page: safePage,
    pageSize,
    total,
    totalPages,
    hasMore: safePage < totalPages,
  };
}