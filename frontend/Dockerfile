# --- Estágio de Build ---
FROM node:20-alpine AS builder
WORKDIR /usr/src/app

COPY package*.json ./
RUN npm ci

COPY . .
RUN npm run build

# --- Estágio Final (Servidor Web Estático) ---
FROM nginx:stable-alpine
# Copia o build do Vite (geralmente vai para a pasta 'dist') para o diretório do Nginx
COPY --from=builder /usr/src/app/dist /usr/share/nginx/html

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]