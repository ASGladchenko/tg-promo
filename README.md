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
