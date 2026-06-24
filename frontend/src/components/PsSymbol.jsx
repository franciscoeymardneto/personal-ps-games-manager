// Símbolos do controle de PlayStation desenhados em SVG, mais o ★ de favorito.
// `filled` controla se o símbolo aparece preenchido (coleção ativa) ou só traço.

export function PsSymbol({ symbol, color = "currentColor", filled = false, size = 16, strokeWidth = 2 }) {
  const common = {
    width: size,
    height: size,
    viewBox: "0 0 24 24",
    fill: filled ? color : "none",
    stroke: color,
    strokeWidth,
    strokeLinejoin: "round",
    strokeLinecap: "round",
    "aria-hidden": true,
  };

  switch (symbol) {
    case "cross":
      // ✕ sempre em traço (preenchimento não faz sentido p/ um X)
      return (
        <svg {...common} fill="none">
          <path d="M6 6l12 12M18 6L6 18" />
        </svg>
      );
    case "circle":
      return (
        <svg {...common} fill="none">
          <circle cx="12" cy="12" r="7.5" fill={filled ? color : "none"} />
        </svg>
      );
    case "triangle":
      return (
        <svg {...common}>
          <path d="M12 4.5L20 19H4L12 4.5z" />
        </svg>
      );
    case "square":
      return (
        <svg {...common}>
          <rect x="5" y="5" width="14" height="14" rx="1.5" />
        </svg>
      );
    case "star":
      return (
        <svg {...common}>
          <path d="M12 3.5l2.6 5.5 6 .8-4.4 4.1 1.1 5.9-5.3-2.9-5.3 2.9 1.1-5.9L5 9.8l6-.8L12 3.5z" />
        </svg>
      );
    default:
      return null;
  }
}

// O wordmark: a fileira de botões do controle.
export function Wordmark() {
  return (
    <div className="flex items-center gap-3 select-none">
      <div className="flex items-center gap-1.5">
        <PsSymbol symbol="triangle" color="#57D9A3" size={14} />
        <PsSymbol symbol="circle" color="#F4576C" size={14} />
        <PsSymbol symbol="cross" color="#6AA0FF" size={14} />
        <PsSymbol symbol="square" color="#E06FC9" size={14} />
      </div>
      <span className="font-display font-bold tracking-[0.22em] text-sm">
        JEWELCASE
      </span>
    </div>
  );
}
