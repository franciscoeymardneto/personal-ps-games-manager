import { useEffect, useMemo, useRef, useState } from "react";
import { Sidebar } from "./components/Sidebar.jsx";
import { Toolbar } from "./components/Toolbar.jsx";
import { GameCard } from "./components/GameCard.jsx";
import { Pagination } from "./components/Pagination.jsx";
import { NewListModal, EmptyState } from "./components/Modal.jsx";
import { useLocalStorage } from "./hooks/useLocalStorage.js";
import { COLLECTION_BY_ID, toggleCollection } from "./lib/collections.js";

const PAGE_SIZE = 24;

const DEFAULT_FILTERS = {
  q: "",
  platforms: [],
  multiOnly: false,
  minRating: 0,
  genre: "",
  sort: "name",
};

const gameId = (g) => g.normKey || g.name;

// monta a query string ignorando valores vazios
function toQuery(obj) {
  const p = new URLSearchParams();
  for (const [k, v] of Object.entries(obj))
    if (v !== undefined && v !== null && v !== "") p.set(k, v);
  return p.toString();
}

// ids dos jogos relevantes p/ a visão atual.
//   null            -> catálogo inteiro (visão "Biblioteca")
//   array (vazio ok) -> recorte de coleção fixa ou lista customizada
function idsForView(view, tags, lists) {
  if (view === "all") return null;
  if (view.startsWith("list:")) {
    const l = lists.find((x) => `list:${x.id}` === view);
    return l ? l.gameIds : [];
  }
  return Object.entries(tags)
    .filter(([, t]) => t.includes(view))
    .map(([id]) => id);
}

export default function App() {
  // dados do servidor
  const [meta, setMeta] = useState(null); // { total, genres, ... }
  const [data, setData] = useState(null); // { items, page, total, totalPages, ... }
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  // estado persistido (coleções e listas vivem no navegador)
  const [tags, setTags] = useLocalStorage("tags", {}); // { [id]: string[] }
  const [lists, setLists] = useLocalStorage("lists", []); // [{id,name,gameIds}]

  // estado de sessão
  const [view, setView] = useState("all");
  const [filters, setFilters] = useState(DEFAULT_FILTERS);
  const [page, setPage] = useState(1);
  const [modalOpen, setModalOpen] = useState(false);
  const scrollRef = useRef(null);

  // trocar de visão / filtro sempre volta p/ a página 1
  const changeView = (v) => {
    setView(v);
    setPage(1);
  };
  const updateFilters = (updater) => {
    setFilters(updater);
    setPage(1);
  };

  // ids da visão atual (memo p/ servir de chave de dependência estável)
  const ids = useMemo(() => idsForView(view, tags, lists), [view, tags, lists]);
  const idsKey = ids === null ? "all" : ids.join("|");

  // metadados (gêneros p/ o dropdown, total p/ a sidebar) — uma vez
  useEffect(() => {
    fetch("/api/meta")
      .then((r) => (r.ok ? r.json() : null))
      .then((m) => m && setMeta(m))
      .catch(() => {});
  }, []);

  // busca a página atual sempre que visão, filtros, página ou recorte mudam
  useEffect(() => {
    const ctrl = new AbortController();
    const timer = setTimeout(() => {
      setLoading(true);
      setError(null);

      const common = {
        q: filters.q || undefined,
        platform: filters.platforms.length ? filters.platforms.join(",") : undefined,
        genre: filters.genre || undefined,
        minRating: filters.minRating || undefined,
        multi: filters.multiOnly ? 1 : undefined,
        sort: filters.sort,
        page,
        pageSize: PAGE_SIZE,
      };

      const request =
        ids === null
          ? fetch(`/api/games?${toQuery(common)}`, { signal: ctrl.signal })
          : fetch(`/api/games/query`, {
              method: "POST",
              headers: { "Content-Type": "application/json" },
              body: JSON.stringify({ ...common, ids }),
              signal: ctrl.signal,
            });

      request
        .then((r) => {
          if (!r.ok) throw new Error(`HTTP ${r.status}`);
          return r.json();
        })
        .then((json) => {
          setData({
            ...json,
            items: json.items.map((g) => ({ ...g, id: gameId(g) })),
          });
          if (json.page !== page) setPage(json.page); // re-sincroniza clamp
        })
        .catch((e) => {
          if (e.name !== "AbortError") {
            setError(e.message);
            setData(null);
          }
        })
        .finally(() => {
          if (!ctrl.signal.aborted) setLoading(false);
        });
    }, 250);

    return () => {
      clearTimeout(timer);
      ctrl.abort();
    };
  }, [view, filters, page, idsKey]); // eslint-disable-line react-hooks/exhaustive-deps

  // ───── ações ─────
  const onToggleCollection = (id, collectionId) =>
    setTags((t) => ({ ...t, [id]: toggleCollection(t[id] || [], collectionId) }));

  const onCreateList = (name) =>
    setLists((ls) => [...ls, { id: crypto.randomUUID(), name, gameIds: [] }]);

  const onDeleteList = (listId) => {
    setLists((ls) => ls.filter((l) => l.id !== listId));
    if (view === `list:${listId}`) changeView("all");
  };

  const onToggleList = (id, listId) =>
    setLists((ls) =>
      ls.map((l) =>
        l.id !== listId
          ? l
          : {
              ...l,
              gameIds: l.gameIds.includes(id)
                ? l.gameIds.filter((x) => x !== id)
                : [...l.gameIds, id],
            },
      ),
    );

  const goToPage = (p) => {
    setPage(p);
    scrollRef.current?.scrollTo({ top: 0, behavior: "smooth" });
  };

  // contagens da sidebar (coleção/lista são locais; total vem do meta)
  const counts = useMemo(() => {
    const c = { all: meta?.total ?? 0 };
    for (const id of Object.keys(COLLECTION_BY_ID)) c[id] = 0;
    for (const arr of Object.values(tags))
      for (const tag of arr) if (c[tag] != null) c[tag]++;
    return c;
  }, [meta, tags]);

  const viewLabel = view.startsWith("list:")
    ? lists.find((l) => `list:${l.id}` === view)?.name || "Lista"
    : view === "all"
      ? "Biblioteca"
      : COLLECTION_BY_ID[view]?.label || "";

  const items = data?.items ?? [];

  return (
    <div className="flex h-screen overflow-hidden">
      <Sidebar
        view={view}
        setView={changeView}
        counts={counts}
        lists={lists}
        onNewList={() => setModalOpen(true)}
        onDeleteList={onDeleteList}
      />

      <main className="flex min-w-0 flex-1 flex-col">
        <Toolbar
          filters={filters}
          setFilters={updateFilters}
          genres={meta?.genres ?? []}
          total={data?.total ?? 0}
          shown={items.length}
        />

        <div className="flex items-baseline gap-3 px-5 pb-1 pt-4">
          <h1 className="font-display text-xl font-bold">{viewLabel}</h1>
          <span className="font-mono text-xs text-muted">
            {data?.total ?? 0} jogos
          </span>
        </div>

        <div ref={scrollRef} className="flex-1 overflow-y-auto scrollbar-thin px-5 pb-10 pt-2">
          {error && (
            <EmptyState
              title="A API não respondeu"
              hint="Suba o servidor (ps-api: npm start) e confira o proxy /api no vite.config.js. Depois recarregue."
            />
          )}

          {!error && !data && loading && (
            <div className="grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6">
              {Array.from({ length: 12 }).map((_, i) => (
                <div
                  key={i}
                  className="aspect-[3/4] animate-pulse rounded-xl border border-line bg-surface"
                />
              ))}
            </div>
          )}

          {!error && data && (
            <div
              className={`grid grid-cols-2 gap-4 transition-opacity sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 2xl:grid-cols-6 ${
                loading ? "opacity-60" : "opacity-100"
              }`}
            >
              {items.length === 0 ? (
                <EmptyState
                  title="Nada por aqui ainda"
                  hint={
                    view === "all"
                      ? "Ajuste os filtros para ver mais jogos."
                      : "Marque jogos na biblioteca para preencher esta visão."
                  }
                />
              ) : (
                <>
                  {items.map((g, i) => (
                    <GameCard
                      key={g.id}
                      game={g}
                      index={i}
                      tags={tags[g.id] || []}
                      onToggle={onToggleCollection}
                      lists={lists}
                      onToggleList={onToggleList}
                    />
                  ))}
                  <Pagination
                    page={data.page}
                    totalPages={data.totalPages}
                    onPage={goToPage}
                  />
                </>
              )}
            </div>
          )}
        </div>
      </main>

      <NewListModal
        open={modalOpen}
        onClose={() => setModalOpen(false)}
        onCreate={onCreateList}
      />
    </div>
  );
}