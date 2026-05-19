# Сборка приложения
FROM node:18-alpine AS builder
WORKDIR /app

# Копируем только файлы зависимостей для кеширования слоёв
COPY vite-project/package.json vite-project/package-lock.json* ./
RUN npm ci

# Копируем остальной код и собираем приложение
COPY vite-project/ .
RUN npm run build

# Сервер nginx для отдачи статики
FROM nginx:alpine
# Копируем собранную статику в стандартную директорию nginx
COPY --from=builder /app/dist /usr/share/nginx/html
# Копируем кастомный конфиг nginx (если нужен)
COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80
CMD ["nginx", "-g", "daemon off;"]