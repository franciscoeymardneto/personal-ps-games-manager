import { useState } from "react";

export function NewListModal({ open, onClose, onCreate }) {
  const [name, setName] = useState("");
  if (!open) return null;

  const submit = () => {
    const trimmed = name.trim();
    if (!trimmed) return;
    onCreate(trimmed);
    setName("");
    onClose();
  };

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center bg-ink/70 p-4 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="w-full max-w-sm rounded-2xl border border-line bg-surface p-5 shadow-lift"
        onClick={(e) => e.stopPropagation()}
      >
        <h2 className="font-display text-lg font-semibold">Nova lista</h2>
        <p className="mt-1 text-sm text-muted">
          Dê um nome. Você adiciona jogos abrindo a lista e marcando-os.
        </p>
        <input
          autoFocus
          value={name}
          onChange={(e) => setName(e.target.value)}
          onKeyDown={(e) => e.key === "Enter" && submit()}
          placeholder="Ex.: Platina, Speedrun, Couch co-op…"
          className="mt-4 w-full rounded-lg border border-line bg-ink px-3 py-2 text-sm outline-none focus:border-ps-blue/60"
        />
        <div className="mt-4 flex justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg px-3 py-2 text-sm text-muted hover:text-white"
          >
            Cancelar
          </button>
          <button
            onClick={submit}
            className="rounded-lg bg-ps-blue px-4 py-2 text-sm font-semibold text-ink hover:brightness-110"
          >
            Criar lista
          </button>
        </div>
      </div>
    </div>
  );
}

export function EmptyState({ title, hint }) {
  return (
    <div className="col-span-full grid place-items-center py-24 text-center">
      <div className="max-w-xs">
        <h3 className="font-display text-base font-semibold">{title}</h3>
        <p className="mt-1.5 text-sm text-muted">{hint}</p>
      </div>
    </div>
  );
}
