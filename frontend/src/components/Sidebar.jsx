import { PsSymbol, Wordmark } from "./PsSymbol.jsx";
import { COLLECTIONS } from "../lib/collections.js";

function Row({ active, onClick, leading, label, count }) {
  return (
    <button
      onClick={onClick}
      className={`flex w-full items-center gap-2.5 rounded-lg px-2.5 py-2 text-left text-sm transition-colors ${
        active ? "bg-surface2 text-white" : "text-muted hover:bg-surface hover:text-white"
      }`}
    >
      <span className="grid h-5 w-5 shrink-0 place-items-center">{leading}</span>
      <span className="flex-1 truncate">{label}</span>
      {count != null && (
        <span className="font-mono text-[11px] text-muted">{count}</span>
      )}
    </button>
  );
}

export function Sidebar({ view, setView, counts, lists, onNewList, onDeleteList }) {
  return (
    <aside className="flex h-full w-60 shrink-0 flex-col gap-5 border-r border-line bg-ink/60 p-4">
      <div className="px-1 pt-1">
        <Wordmark />
        <p className="eyebrow mt-2">biblioteca playstation</p>
      </div>

      <nav className="flex flex-col gap-0.5">
        <Row
          active={view === "all"}
          onClick={() => setView("all")}
          leading={<div className="h-2 w-2 rounded-full bg-ps-blue" />}
          label="Biblioteca"
          count={counts.all}
        />
      </nav>

      <div>
        <p className="eyebrow mb-1.5 px-2.5">Coleções</p>
        <nav className="flex flex-col gap-0.5">
          {COLLECTIONS.map((c) => (
            <Row
              key={c.id}
              active={view === c.id}
              onClick={() => setView(c.id)}
              leading={<PsSymbol symbol={c.symbol} color={c.color} filled={c.symbol !== "cross"} size={15} />}
              label={c.label}
              count={counts[c.id] || 0}
            />
          ))}
        </nav>
      </div>

      <div className="min-h-0 flex-1">
        <div className="mb-1.5 flex items-center justify-between px-2.5">
          <p className="eyebrow">Minhas listas</p>
          <button
            onClick={onNewList}
            title="Nova lista"
            className="grid h-5 w-5 place-items-center rounded text-muted hover:bg-surface hover:text-white"
          >
            +
          </button>
        </div>
        <nav className="flex max-h-full flex-col gap-0.5 overflow-y-auto scrollbar-thin">
          {lists.length === 0 ? (
            <p className="px-2.5 py-1 text-xs leading-relaxed text-muted/70">
              Crie listas como “Platina”, “Co-op com a galera”, “Clássicos pra revisitar”.
            </p>
          ) : (
            lists.map((l) => (
              <div key={l.id} className="group flex items-center">
                <Row
                  active={view === `list:${l.id}`}
                  onClick={() => setView(`list:${l.id}`)}
                  leading={<div className="h-1.5 w-1.5 rounded-sm bg-muted" />}
                  label={l.name}
                  count={l.gameIds.length}
                />
                <button
                  onClick={() => onDeleteList(l.id)}
                  title="Apagar lista"
                  className="ml-1 hidden h-6 w-6 shrink-0 place-items-center rounded text-muted hover:text-ps-red group-hover:grid"
                >
                  ×
                </button>
              </div>
            ))
          )}
        </nav>
      </div>
    </aside>
  );
}
