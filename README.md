# tg-promo

Telegram Mini App на `React + Vite`.

## Что внутри

- `Vite + React` frontend
- локальный dev proxy `/api/*` на внешний backend `1MLMBET`
- production-подключение к backend через `VITE_API_BASE_URL`

## Локальный запуск

```bash
npm install
npm run dev
```

По умолчанию frontend доступен на:

```bash
http://localhost:5173
```

Локально `VITE_API_BASE_URL` можно оставить пустым. Тогда запросы вида `/api/*` будут проксироваться Vite dev-server на backend `1MLMBET`.

## Переменные окружения

Скопируйте пример и заполните значения:

```bash
cp .env.example .env
```

Публичные переменные Vite:

```bash
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
VITE_TELEGRAM_CHANNEL_URL=https://t.me/your_channel
VITE_TELEGRAM_SHARE_URL=https://t.me/your_bot_username?startapp=play
VITE_API_BASE_URL=
VITE_BRAND_SITE_URL=https://1mlnbet.com/
```

Для production задайте:

```bash
VITE_API_BASE_URL=https://<your-backend-domain>
```

## Сборка

```bash
npm run build
```

Frontend-артефакты собираются в `dist/`.
