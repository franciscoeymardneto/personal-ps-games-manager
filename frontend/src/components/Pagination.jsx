// Controle de paginação: ‹ 1 … 4 [5] 6 … 12 ›
// Mostra uma janela de páginas ao redor da atual, com reticências.
function pageWindow(page, totalPages) {
  const pages = new Set([1, totalPages, page, page - 1, page + 1]);
  const sorted = [...pages].filter((p) => p >= 1 && p <= totalPages).sort((a, b) => a - b);
  const out = [];
  let prev = 0;
  for (const p of sorted) {
    if (p - prev > 1) out.push("…");
    out.push(p);
    prev = p;
  }
  return out;
}

export function Pagination({ page, totalPages, onPage }) {
  if (totalPages <= 1) return null;

  const Btn = ({ disabled, active, children, onClick, label }) => (
    <button
      onClick={onClick}
      disabled={disabled}
      aria-label={label}
      aria-current={active ? "page" : undefined}
      className={`grid h-9 min-w-9 place-items-center rounded-lg border px-2 font-mono text-sm transition-colors ${
        active
          ? "border-ps-blue bg-ps-blue/15 text-ps-blue"
          : disabled
            ? "cursor-not-allowed border-line/60 text-muted/40"
            : "border-line text-muted hover:border-muted hover:text-white"
      }`}
    >
      {children}
    </button>
  );

  return (
    <nav className="col-span-full flex flex-wrap items-center justify-center gap-1.5 pt-8">
      <Btn disabled={page <= 1} onClick={() => onPage(page - 1)} label="Página anterior">
        ‹
      </Btn>

      {pageWindow(page, totalPages).map((p, i) =>
        p === "…" ? (
          <span key={`gap-${i}`} className="px-1 text-muted">
            …
          </span>
        ) : (
          <Btn key={p} active={p === page} onClick={() => onPage(p)} label={`Página ${p}`}>
            {p}
          </Btn>
        ),
      )}

      <Btn disabled={page >= totalPages} onClick={() => onPage(page + 1)} label="Próxima página">
        ›
      </Btn>
    </nav>
  );
}