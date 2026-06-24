import { PsSymbol } from "./PsSymbol.jsx";

const PLATFORMS = ["PS1", "PS2", "PS3", "PS4", "PS5"];
const PLAT_TINT = {
  PS1: "#9aa4ff",
  PS2: "#6AA0FF",
  PS3: "#57D9A3",
  PS4: "#E06FC9",
  PS5: "#F5C451",
};

export function Toolbar({ filters, setFilters, genres, total, shown }) {
  const set = (patch) => setFilters((f) => ({ ...f, ...patch }));

  const togglePlatform = (p) =>
    set({
      platforms: filters.platforms.includes(p)
        ? filters.platforms.filter((x) => x !== p)
        : [...filters.platforms, p],
    });

  return (
    <div className="sticky top-0 z-10 flex flex-col gap-3 border-b border-line bg-ink/85 px-5 py-3 backdrop-blur">
      <div className="flex flex-wrap items-center gap-3">
        {/* busca */}
        <div className="relative flex-1 min-w-[220px]">
          <input
            value={filters.q}
            onChange={(e) => set({ q: e.target.value })}
            placeholder="Buscar por título…"
            className="w-full rounded-lg border border-line bg-surface px-3.5 py-2 text-sm outline-none placeholder:text-muted/60 focus:border-ps-blue/60"
          />
        </div>

        {/* rating mínimo */}
        <label className="flex items-center gap-2 rounded-lg border border-line bg-surface px-3 py-2 text-sm">
          <PsSymbol symbol="star" color="#F5C451" filled size={13} />
          <span className="text-muted">nota</span>
          <input
            type="range"
            min="0"
            max="10"
            step="0.5"
            value={filters.minRating}
            onChange={(e) => set({ minRating: Number(e.target.value) })}
            className="accent-ps-gold"
          />
          <span className="w-7 font-mono text-xs">{filters.minRating.toFixed(1)}</span>
        </label>

        {/* ordenação */}
        <select
          value={filters.sort}
          onChange={(e) => set({ sort: e.target.value })}
          className="rounded-lg border border-line bg-surface px-3 py-2 text-sm outline-none focus:border-ps-blue/60"
        >
          <option value="name">Nome (A–Z)</option>
          <option value="rating">Melhor avaliados</option>
          <option value="year-desc">Mais recentes</option>
          <option value="year-asc">Mais antigos</option>
        </select>
      </div>

      <div className="flex flex-wrap items-center gap-2">
        <span className="eyebrow mr-1">plataforma</span>
        {PLATFORMS.map((p) => {
          const on = filters.platforms.includes(p);
          return (
            <button
              key={p}
              onClick={() => togglePlatform(p)}
              className={`rounded-full border px-3 py-1 font-mono text-xs transition-colors ${
                on ? "text-ink" : "border-line text-muted hover:text-white"
              }`}
              style={on ? { backgroundColor: PLAT_TINT[p], borderColor: PLAT_TINT[p] } : undefined}
            >
              {p}
            </button>
          );
        })}

        <button
          onClick={() => set({ multiOnly: !filters.multiOnly })}
          className={`rounded-full border px-3 py-1 text-xs transition-colors ${
            filters.multiOnly
              ? "border-ps-green/60 bg-ps-green/15 text-ps-green"
              : "border-line text-muted hover:text-white"
          }`}
        >
          multi-console
        </button>

        {genres.length > 0 && (
          <select
            value={filters.genre}
            onChange={(e) => set({ genre: e.target.value })}
            className="ml-auto rounded-full border border-line bg-surface px-3 py-1 text-xs outline-none focus:border-ps-blue/60"
          >
            <option value="">Todos os gêneros</option>
            {genres.map((g) => (
              <option key={g} value={g}>
                {g}
              </option>
            ))}
          </select>
        )}

        <span className="font-mono text-[11px] text-muted">
          {shown}/{total}
        </span>
      </div>
    </div>
  );
}
