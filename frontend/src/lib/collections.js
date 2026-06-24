// As coleções "fixas" do app. A assinatura visual: cada uma é um botão do
// controle de PlayStation, na sua cor canônica.
//   ✕ azul  -> Tenho       (cross é o confirmar nos consoles modernos)
//   ○ verm. -> Não tenho    (circle é o cancelar)
//   △ verde -> Desejo
//   □ rosa  -> Backlog (pra jogar / jogando)
//   ★ ouro  -> Favorito
export const COLLECTIONS = [
  { id: "own", label: "Tenho", symbol: "cross", color: "#6AA0FF", hint: "Está na sua coleção" },
  { id: "wishlist", label: "Desejo", symbol: "triangle", color: "#57D9A3", hint: "Quero adquirir" },
  { id: "backlog", label: "Backlog", symbol: "square", color: "#E06FC9", hint: "Pra jogar ou jogando" },
  { id: "notown", label: "Não tenho", symbol: "circle", color: "#F4576C", hint: "Fora da coleção" },
  { id: "favorite", label: "Favoritos", symbol: "star", color: "#F5C451", hint: "Seus preferidos" },
];

export const COLLECTION_BY_ID = Object.fromEntries(
  COLLECTIONS.map((c) => [c.id, c]),
);

// "Tenho" e "Não tenho" são mutuamente exclusivos.
const EXCLUSIVE_PAIRS = [["own", "notown"]];

/** Aplica/remove uma coleção numa lista de tags, respeitando exclusividade. */
export function toggleCollection(tags, collectionId) {
  const set = new Set(tags);
  if (set.has(collectionId)) {
    set.delete(collectionId);
  } else {
    set.add(collectionId);
    for (const pair of EXCLUSIVE_PAIRS) {
      if (pair.includes(collectionId)) {
        for (const other of pair) if (other !== collectionId) set.delete(other);
      }
    }
  }
  return [...set];
}
