# Сборка приложения
FROM node:22-alpine AS builder
WORKDIR /app

# Копируем файлы зависимостей
COPY vite-project/package.json vite-project/package-lock.json* ./
RUN npm ci

# Копируем исходники и собираем проект
COPY vite-project/ .
RUN npm run build

# nginx
FROM nginx:alpine
COPY --from=builder /app/dist /usr/share/nginx/html
COPY nginx.conf /etc/nginx/conf.d/default.conf
EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]