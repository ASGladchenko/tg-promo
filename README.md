# tg-promo

Telegram Mini App на `React + Vite` (frontend) и `NestJS` (backend API).

## Что внутри

- `Vite + React` frontend
- `NestJS` backend с роутами:
  - `GET /api/hello`
  - `POST /api/auth/miniapp`
  - `POST /api/auth/telegram-widget`
  - `GET /api/auth/session`
  - `DELETE /api/auth/session`
  - `GET /api/channel-membership`

## Локальный запуск

```bash
npm install
npm run dev
```

По умолчанию:

- frontend: `http://localhost:5173`
- backend: `http://localhost:4000`

Vite dev-server проксирует `/api/*` на backend.

## Переменные окружения

Скопируйте пример и заполните значения:

```bash
cp .env.example .env
```

Frontend (`Vite`, публичные переменные только с префиксом `VITE_`):

```bash
VITE_TELEGRAM_BOT_USERNAME=your_bot_username
VITE_TELEGRAM_CHANNEL_URL=https://t.me/your_channel
VITE_TELEGRAM_SHARE_URL=https://t.me/your_bot_username?startapp=play
VITE_API_BASE_URL=
VITE_BRAND_SITE_URL=https://1mlnbet.com/
```

Backend (`Nest`, секретные переменные):

```bash
TELEGRAM_BOT_TOKEN=123456:ABCDEF
APP_SESSION_SECRET=replace_with_long_random_secret
APP_SESSION_COOKIE_SAME_SITE=lax
TELEGRAM_CHANNEL_ID=@your_channel
TELEGRAM_WIDGET_MAX_AGE_SECONDS=300
FRONTEND_ORIGIN=http://localhost:5173
PORT=4000
```

Для `TELEGRAM_CHANNEL_ID` также можно использовать numeric chat id (`-100...`).

### Миграция имен из Next.js

Старые имена (Vercel) -> новые имена (этот проект):

- `NEXT_PUBLIC_TELEGRAM_BOT_USERNAME` -> `VITE_TELEGRAM_BOT_USERNAME`
- `NEXT_PUBLIC_TELEGRAM_CHANNEL_URL` -> `VITE_TELEGRAM_CHANNEL_URL`
- `NEXT_PUBLIC_TELEGRAM_SHARE_URL` -> `VITE_TELEGRAM_SHARE_URL`

Без изменений:

- `APP_SESSION_SECRET`
- `TELEGRAM_CHANNEL_ID`
- `TELEGRAM_BOT_TOKEN`

## Vercel + отдельный backend

Если frontend остается на Vercel, а backend вынесен отдельно:

1. На backend-хостинге задайте:
   - `TELEGRAM_BOT_TOKEN`
   - `APP_SESSION_SECRET`
   - `APP_SESSION_COOKIE_SAME_SITE=none`
   - `TELEGRAM_CHANNEL_ID`
   - `TELEGRAM_WIDGET_MAX_AGE_SECONDS=300`
   - `FRONTEND_ORIGIN=https://<your-vercel-domain>`
2. На Vercel (frontend) задайте:
   - `VITE_TELEGRAM_BOT_USERNAME`
   - `VITE_TELEGRAM_CHANNEL_URL`
   - `VITE_TELEGRAM_SHARE_URL`
   - `VITE_API_BASE_URL=https://<your-backend-domain>`
   - `VITE_BRAND_SITE_URL`
3. После изменения `VITE_*` переменных сделайте redeploy frontend на Vercel.

## Сборка

```bash
npm run build
```

- frontend артефакты: `dist/`
- backend артефакты: `dist-server/`

Прод-запуск backend:

```bash
npm run start
```
