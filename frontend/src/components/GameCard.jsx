import { useState } from "react";
import { PsSymbol } from "./PsSymbol.jsx";
import { COLLECTIONS } from "../lib/collections.js";
import { toScore10 } from "../lib/rating.js";
const PLAT_TINT = {
  PS1: "#9aa4ff",
  PS2: "#6AA0FF",
  PS3: "#57D9A3",
  PS4: "#E06FC9",
  PS5: "#F5C451",
};

function CoverFallback({ name, platform }) {
  return (
    <div className="absolute inset-0 grid place-items-center bg-gradient-to-br from-surface2 to-ink">
      <div className="flex flex-col items-center gap-3 px-4 text-center">
        <div className="opacity-20">
          <PsSymbol symbol="square" color={PLAT_TINT[platform] || "#6AA0FF"} size={56} strokeWidth={1.5} />
        </div>
        <span className="font-display text-xs uppercase tracking-widest text-muted line-clamp-3">
          {name}
        </span>
      </div>
    </div>
  );
}

export function GameCard({ game, tags, onToggle, lists = [], onToggleList, index = 0 }) {
  const [imgOk, setImgOk] = useState(true);
  const [listsOpen, setListsOpen] = useState(false);
  const score = toScore10(game.rating);
  const active = new Set(tags);

  return (
    <article
      className="group relative flex flex-col overflow-hidden rounded-xl border border-line bg-surface shadow-card transition-transform duration-200 will-change-transform hover:-translate-y-1 hover:shadow-lift motion-safe:animate-fade-up"
      style={{ animationDelay: `${Math.min(index, 16) * 28}ms` }}
    >
      {/* capa */}
      <div className="relative aspect-[3/4] overflow-hidden bg-ink">
        {game.cover && imgOk ? (
          <img
            src={game.cover}
            alt={`Capa de ${game.name}`}
            loading="lazy"
            onError={() => setImgOk(false)}
            className="h-full w-full object-cover transition-transform duration-500 group-hover:scale-[1.04]"
          />
        ) : (
          <CoverFallback name={game.name} platform={game.platform} />
        )}

        {/* selo da plataforma original */}
        <span
          className="absolute left-2 top-2 rounded-md bg-ink/80 px-2 py-0.5 font-mono text-[10px] font-bold tracking-wider backdrop-blur"
          style={{ color: PLAT_TINT[game.platform] || "#fff" }}
        >
          {game.platform}
        </span>

        {/* nota */}
        {score != null && (
          <span className="absolute right-2 top-2 flex items-center gap-1 rounded-md bg-ink/80 px-2 py-0.5 font-mono text-[10px] font-bold text-ps-gold backdrop-blur">
            <PsSymbol symbol="star" color="#F5C451" filled size={10} strokeWidth={1.5} />
            {score.toFixed(1)}
          </span>
        )}

        {/* marcadores de coleção ativos, no canto inferior */}
        <div className="absolute bottom-2 left-2 flex gap-1">
          {COLLECTIONS.filter((c) => active.has(c.id)).map((c) => (
            <span
              key={c.id}
              title={c.label}
              className="grid h-5 w-5 place-items-center rounded-md bg-ink/85 backdrop-blur"
            >
              <PsSymbol symbol={c.symbol} color={c.color} filled size={12} strokeWidth={2} />
            </span>
          ))}
        </div>
      </div>

      {/* infos abaixo da capa */}
      <div className="flex flex-1 flex-col gap-2 p-3">
        <h3 className="font-display text-sm font-semibold leading-tight line-clamp-2" title={game.name}>
          {game.name}
        </h3>

        <div className="flex flex-wrap items-center gap-1.5 text-[11px] text-muted">
          {game.year && <span className="font-mono">{game.year}</span>}
          {game.compatibility?.length > 0 && (
            <span className="font-mono">
              · também em {game.compatibility.join(", ").toLowerCase()}
            </span>
          )}
        </div>

        {game.genres?.length > 0 && (
          <div className="flex flex-wrap gap-1">
            {game.genres.slice(0, 3).map((g) => (
              <span
                key={g}
                className="rounded-full border border-line px-2 py-0.5 text-[10px] text-muted"
              >
                {g}
              </span>
            ))}
          </div>
        )}

        {/* toggles de coleção — os botões do controle */}
        <div className="relative mt-auto flex items-center justify-between border-t border-line pt-2.5">
          <div className="flex items-center gap-0.5">
            {COLLECTIONS.map((c) => {
              const on = active.has(c.id);
              return (
                <button
                  key={c.id}
                  onClick={() => onToggle(game.id, c.id)}
                  aria-pressed={on}
                  title={`${c.label} — ${c.hint}`}
                  className={`grid h-8 w-8 place-items-center rounded-lg border transition-colors ${
                    on
                      ? "border-transparent motion-safe:animate-pop"
                      : "border-line hover:border-muted"
                  }`}
                  style={on ? { backgroundColor: c.color + "22", borderColor: c.color + "55" } : undefined}
                >
                  <PsSymbol
                    symbol={c.symbol}
                    color={on ? c.color : "#7E869A"}
                    filled={on && c.symbol !== "cross"}
                    size={15}
                  />
                </button>
              );
            })}
          </div>

          {/* adicionar às listas customizadas */}
          <button
            onClick={() => setListsOpen((v) => !v)}
            title="Adicionar a uma lista"
            aria-expanded={listsOpen}
            className="grid h-8 w-8 place-items-center rounded-lg border border-line text-muted transition-colors hover:border-muted hover:text-white"
          >
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" aria-hidden>
              <path d="M4 7h11M4 12h11M4 17h7M18 14v6M15 17h6" />
            </svg>
          </button>

          {listsOpen && (
            <>
              <div className="fixed inset-0 z-20" onClick={() => setListsOpen(false)} />
              <div className="absolute bottom-11 right-0 z-30 w-52 overflow-hidden rounded-xl border border-line bg-surface2 shadow-lift">
                <p className="eyebrow border-b border-line px-3 py-2">Adicionar à lista</p>
                <div className="max-h-44 overflow-y-auto scrollbar-thin py-1">
                  {lists.length === 0 ? (
                    <p className="px-3 py-2 text-xs text-muted">
                      Nenhuma lista ainda. Crie uma na barra lateral.
                    </p>
                  ) : (
                    lists.map((l) => {
                      const inList = l.gameIds.includes(game.id);
                      return (
                        <button
                          key={l.id}
                          onClick={() => onToggleList?.(game.id, l.id)}
                          className="flex w-full items-center gap-2 px-3 py-2 text-left text-sm hover:bg-surface"
                        >
                          <span
                            className={`grid h-4 w-4 place-items-center rounded border ${
                              inList ? "border-ps-blue bg-ps-blue text-ink" : "border-line"
                            }`}
                          >
                            {inList && (
                              <svg width="11" height="11" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                                <path d="M5 12l5 5L20 6" />
                              </svg>
                            )}
                          </span>
                          <span className="flex-1 truncate">{l.name}</span>
                        </button>
                      );
                    })
                  )}
                </div>
              </div>
            </>
          )}
        </div>
      </div>
    </article>
  );
}
