#!/bin/bash

# Получаем абсолютный путь к директории проекта
PROJECT_DIR=$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)

# Создаем временный docker-compose файл с правильными путями
TEMP_COMPOSE=$(mktemp)
cat > "$TEMP_COMPOSE" << EOF
version: '3.8'

services:
  web:
    build: .
    ports:
      - "8080:80"
    volumes:
      - ./dota-spy-game:/usr/share/nginx/html:ro
    restart: unless-stopped
    environment:
      - NGINX_HOST=localhost
      - NGINX_PORT=80
EOF

# Сохраняем временный файл для использования с docker-compose
cp "$TEMP_COMPOSE" ./docker-compose-tmp.yml

# Запускаем docker-compose с временным файлом
docker-compose -f docker-compose-tmp.yml up -d

# Удаляем временный файл
rm ./docker-compose-tmp.yml