# Telegram integration

Этот документ обязателен при изменении Telegram SDK, runtime, membership, haptic feedback и Telegram
URL.

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

- membership API;
- Telegram-related entity DTO и domain logic.

Backend membership API не переносится в `shared/lib/telegram`.

### `features`

- `require-channel-subscription` управляет сценарием обязательной подписки;
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

## Membership

- Membership проверяется backend-ом.
- Bot token никогда не попадает во frontend.
- `checkChannelMembership` принадлежит `entities/tg`.
- Dev bypass остаётся внутри `entities/tg`.
- Feature управляет modal, pending action и retry после возврата.
- Lottery feature не проверяет membership самостоятельно.

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
LotteryCodePanel
  -> widget composition
  -> require-channel-subscription
  -> check-lottery-combination
  -> entities/lottery API
```

`LotteryWidgetScene` связывает subscription и lottery features, объединяет loading/error состояния
и передаёт callbacks в entity UI.
