# JEWELCASE — sua biblioteca PlayStation

Gerenciador de jogos de PS1 a PS5. Mostra os jogos em cards (estilo
marketplace, sem preço), permite filtrar por plataforma, compatibilidade,
nota e gênero, e organizar tudo em coleções e listas — tudo salvo no
navegador (localStorage).

## A assinatura: os botões do controle

Cada coleção fixa é um botão do controle de PlayStation, na sua cor canônica:

| Símbolo | Coleção     | Significado            |
| ------- | ----------- | ---------------------- |
| ✕ azul  | Tenho       | está na sua coleção    |
| △ verde | Desejo      | quer adquirir          |
| □ rosa  | Backlog     | pra jogar / jogando    |
| ○ verm. | Não tenho   | fora da coleção        |
| ★ ouro  | Favoritos   | seus preferidos        |

"Tenho" e "Não tenho" são mutuamente exclusivos. Além das coleções, você cria
**listas** livres (Platina, Co-op, Clássicos…) e adiciona jogos pelo botão de
lista em cada card.

## Rodando

```bash
npm install
npm run dev      # http://localhost:5173
```

Build de produção:

```bash
npm run build && npm run preview
```

## Plugando seus dados

O app carrega `public/games.json` em runtime. Já vem um arquivo de exemplo.
Para usar a base completa, gere o JSON com o script `playstation-games.ts`
(RAWG + IGDB) e **substitua** `public/games.json`. O formato esperado de cada
item:

```json
{
  "name": "Bloodborne",
  "normKey": "bloodborne",
  "cover": "https://.../capa.jpg",
  "year": 2015,
  "rating": 91,
  "platform": "PS4",
  "compatibility": ["PS5"],
  "psPlatforms": ["PS4", "PS5"],
  "genres": ["RPG", "Action"]
}
```

`normKey` é usado como id estável (cai para `name` se faltar). Notas em escala
0–5 (RAWG) ou 0–100 (IGDB) são normalizadas para 0–10 automaticamente.

## Estrutura

```
src/
  App.jsx                 estado, filtros, recorte por visão
  components/
    Sidebar.jsx           coleções + listas
    Toolbar.jsx           busca, plataforma, nota, gênero, ordenação
    GameCard.jsx          capa + infos + toggles dos botões PS
    PsSymbol.jsx          símbolos ✕ ○ △ □ ★ em SVG
    Modal.jsx             criar lista / estado vazio
  hooks/useLocalStorage.js
  lib/collections.js      definição das coleções e regras
  lib/rating.js           normalização de nota
```

## Próximos passos sugeridos

- Página de detalhe do jogo (descrição completa, telas).
- Exportar/importar a biblioteca (backup do localStorage em JSON).
- Estatísticas: quantos por console, % da coleção completa, etc.
