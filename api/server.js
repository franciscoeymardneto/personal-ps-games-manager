
// API mínima que serve o playstation-games.db para o frontend, com paginação.
//   GET  /api/games           -> página do catálogo (filtros via query string)
//   POST /api/games/query     -> idem, mas aceita `ids` no corpo (coleções/listas)
//   GET  /api/games/:id       -> um jogo (id = normKey)
//   GET  /api/meta            -> gêneros, plataformas e contagens p/ os filtros
//   GET  /api/health          -> sanidade
//
// Rodar:  DB_PATH=../playstation-games.db npm start
import express from "express";
import cors from "cors";
import Database from "better-sqlite3";
import { getAllGames, getGameById, getMeta, queryGames } from "./db.js";

const DB_PATH = process.env.DB_PATH || "./playstation-games-original.db";

const PORT = process.env.PORT || 3000;

const db = new Database(DB_PATH, { readonly: true, fileMustExist: true });

// O banco é estático (gerado em lote): carregamos uma vez na memória e
// paginamos a partir daí. Reinicie a API depois de regerar o banco.
const ALL = getAllGames(db);
console.log(`Carregados ${ALL.length} jogos de ${DB_PATH}`);

const app = express();
app.use(cors());
app.use(express.json({ limit: "2mb" })); // p/ listas grandes de ids no POST

app.get("/api/health", (_req, res) => res.json({ ok: true, games: ALL.length }));

app.get("/api/meta", (_req, res) => res.json(getMeta(ALL)));

// catálogo (sem ids) — bom p/ GET cacheável e debugável
app.get("/api/games", (req, res) => res.json(queryGames(ALL, req.query)));

// mesma consulta, mas com `ids` (coleções/listas do front) no corpo
app.post("/api/games/query", (req, res) => res.json(queryGames(ALL, req.body || {})));

app.get("/api/games/:id", (req, res) => {
  const game = getGameById(db, req.params.id);
  if (!game) return res.status(404).json({ error: "Jogo não encontrado" });
  res.json(game);
});

app.listen(PORT, () => console.log(`API no ar em http://localhost:${PORT}`));