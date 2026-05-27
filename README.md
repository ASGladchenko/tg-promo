# tg-promo

Проєкт на базі Next.js (frontend) та NestJS-логіки всередині API route.

## Що всередині

- Next.js frontend
- NestJS backend-логіка у маршруті `app/api/hello/route.ts`
- endpoint `/api/hello`

## Локальний запуск

```bash
npm install
npm run dev
```

Для перевірки Telegram `initData` у `app/api/hello/route.ts` додайте змінну оточення:

```bash
TELEGRAM_BOT_TOKEN=123456:ABCDEF
```

Для єдиної cookie-сесії (рекомендовано задати окремий секрет):

```bash
APP_SESSION_SECRET=replace_with_long_random_secret
```

Для входу з звичайного сайту використовуйте deeplink-кнопку `Открыть в Telegram` (без widget).

Для кнопки шарингу Mini App (щоб у повідомленні була коротка ссылка на гру) додайте:

```bash
NEXT_PUBLIC_TELEGRAM_SHARE_URL=https://t.me/your_bot?startapp=play
```

Для кнопки підписки на канал:

```bash
NEXT_PUBLIC_TELEGRAM_CHANNEL_URL=https://t.me/your_channel
```

Для перевірки, підписаний користувач чи ні (кнопка `Проверить подписку`):

```bash
TELEGRAM_CHANNEL_ID=@your_channel
```

або

```bash
TELEGRAM_CHANNEL_ID=-1001234567890
```

Важливо: бот має бути доданий у канал (бажано адміном), інакше `getChatMember` може повертати помилку.
Проверка подписки работает после входа в Mini App (по `initData`) и через активную cookie-сессию.

Варіанти короткої Telegram-ссылки на гру:

- Main Mini App: `https://t.me/<bot_username>?startapp=<param>`
- Direct Mini App: `https://t.me/<bot_username>/<app_short_name>?startapp=<param>`

Відкрити у браузері:

```txt
http://localhost:3000
```

Запит із фронтенда надсилається на:

```txt
/api/hello
```

## Деплой на Vercel

1. Запушити проєкт у GitHub.
2. Створити новий проєкт у Vercel з цього репозиторію.
3. Framework Preset: `Next.js`.
4. Build Command: `npm run build`.
5. Output Directory залишити порожнім.

Після деплою:

```txt
https://your-project.vercel.app/api/hello
```

## Структура

- `app/page.tsx` - головна сторінка
- `app/api/hello/route.ts` - API route для запиту з frontend
- `src/backend` - NestJS модулі та сервіси
