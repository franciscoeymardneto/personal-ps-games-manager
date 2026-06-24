# ps-api — serve o playstation-games.db ao frontend

API Express mínima que lê o banco gerado pelo `playstation-games.ts` e entrega
os jogos no mesmo formato que o frontend (JEWELCASE) consome.

## Rodar

```bash
npm install
DB_PATH=../playstation-games.db npm start    # http://localhost:3001
```

(Por padrão procura `playstation-games.db` na pasta atual; use `DB_PATH` para
apontar para outro lugar. `PORT` também é configurável.)

## Rotas

| Rota                | O que faz                                               |
| ------------------- | ------------------------------------------------------- |
| `GET /api/games`    | lista de jogos; aceita filtros via query string         |
| `GET /api/games/:id`| um jogo pelo `normKey`                                   |
| `GET /api/meta`     | gêneros, plataformas e contagens (p/ montar os filtros) |
| `GET /api/health`   | sanidade                                                |

Filtros de `/api/games` (todos opcionais e combináveis):
`?q=texto` · `?platform=PS2` ou `?platform=PS2,PS4` · `?genre=RPG`
· `?minRating=8` (escala 0–10) · `?multi=1` (só multi-console)
· `?sort=name|rating|year-desc|year-asc`

Exemplo: `/api/games?platform=PS4&genre=RPG&minRating=8&sort=rating`

## Ligando ao frontend

No `vite.config.js` do JEWELCASE, adicione um proxy:

```js
export default defineConfig({
  plugins: [react()],
  server: { proxy: { "/api": "http://localhost:3001" } },
});
```

E no `src/App.jsx` troque a linha do fetch:

```js
fetch("/api/games")          // antes era "/games.json"
```

Pronto — sem CORS e sem URL fixa. (O CORS já está ligado na API caso você
prefira chamar `http://localhost:3001/api/games` direto.)
