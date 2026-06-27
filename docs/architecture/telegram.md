# Telegram integration

Этот документ обязателен при изменении Telegram SDK, runtime, проверки подписки, haptic feedback и
Telegram URL.

## Границы ответственности

### `shared/lib/telegram`

Сфокусированная техническая интеграция:

- `ensureTelegramSdkInitialized`;
- Telegram runtime store;
- haptic helpers;
- Telegram-specific adapters без бизнес-сценария.

Runtime store находится здесь, потому что его читают разные слои. Не переноси его в `app`: нижние
слои не могут импортировать `app`.

### `entities/tg`

Backend-контракты Telegram-сущности:

- channel subscription API;
- Telegram-related entity DTO и domain logic.

Backend channel subscription API не переносится в `shared/lib/telegram`.

### `features`

- `check-channel-subscription` управляет сценарием reward-проверки подписки;
- `open-telegram-button` управляет пользовательским действием открытия Mini App.

Feature не импортирует другую feature.

### `app`

`TelegramGate` инициализирует SDK и устанавливает runtime. Остальные модули runtime только читают.

## Runtime

Используй:

```ts
import { useTelegramRuntimeStore } from "@/shared/lib/telegram";

const isTelegram = useTelegramRuntimeStore((state) => state.status === "telegram");
```

Статусы:

```ts
"initializing" | "telegram" | "browser";
```

Не заменяй status двумя независимыми boolean-флагами.

## Channel Subscription

- Подписка проверяется backend-ом.
- Bot token никогда не попадает во frontend.
- `checkChannelSubscription` принадлежит `entities/tg`.
- Feature управляет открытием канала, статусом действия и retry после возврата.
- Lottery feature не проверяет подписку и не блокируется обязательной подпиской.

## URL

- URL канала берётся только из `PUBLIC_ENV.TELEGRAM_CHANNEL_URL`.
- URL запуска Mini App берётся из `PUBLIC_ENV.TELEGRAM_SHARE_URL`.
- Сначала используй доступный Telegram WebApp API, затем browser fallback.
- Не дублируй URL строковыми литералами в компонентах.

## Haptic

Haptic вызывается через helpers из `shared/lib/telegram`. Не обращайся к
`window.Telegram.WebApp.HapticFeedback` напрямую, если подходящий helper уже существует.

## Зафиксированный сценарий

```text
AttemptsWalletWidget
  -> check-channel-subscription
  -> entities/tg API
  -> entities/me and entities/attempts query cache updates
```

Подписка на канал является reward-сценарием Attempts Wallet. Если пользователь подписан, backend
может выдать ежедневную попытку; lottery-флоу остаётся независимым.
