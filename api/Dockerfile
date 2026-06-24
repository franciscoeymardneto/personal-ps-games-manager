# --- Estágio de Build/Instalação ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

# Copia apenas os arquivos de dependências primeiro (otimiza cache de camada)
COPY package*.json ./
RUN npm ci

# Copia o restante do código da API
COPY . .

# Se você mudar para TypeScript no futuro, descomente a linha abaixo:
# RUN npm run build

# Remove dependências de desenvolvimento para deixar o node_modules leve
RUN npm prune --production

# --- Estágio Final (Produção) ---
FROM node:20-alpine
WORKDIR /usr/src/app

# Copia apenas o necessário do estágio anterior
COPY --from=builder /usr/src/app/node_modules ./node_modules
COPY --from=builder /usr/src/app/package*.json ./
COPY --from=builder /usr/src/app ./

EXPOSE 3000
CMD ["node", "server.js"]