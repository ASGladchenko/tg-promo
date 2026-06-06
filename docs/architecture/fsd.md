# FSD и границы модулей

Этот документ обязателен при добавлении или переносе файлов, создании slices, изменении импортов и
публичных API.

## Слои

```text
src/
  app/
  pages/
  widgets/
  features/
  entities/
  shared/
```

Направление зависимостей:

```text
app -> pages -> widgets -> features -> entities -> shared
```

| Слой       | Может импортировать                                  |
| ---------- | ---------------------------------------------------- |
| `app`      | `pages`, `widgets`, `features`, `entities`, `shared` |
| `pages`    | `widgets`, `features`, `entities`, `shared`          |
| `widgets`  | `features`, `entities`, `shared`                     |
| `features` | `entities`, `shared`                                 |
| `entities` | `shared`                                             |
| `shared`   | собственные модули и внешние библиотеки              |

Запрещено:

- импортировать верхний слой из нижнего;
- импортировать одну feature из другой;
- импортировать внутренний файл чужого slice в обход публичного API;
- переносить разделяемый runtime в `app`, если его должны читать нижние слои.

## Ответственность слоёв

### `app`

Запуск и конфигурация приложения:

- корневой `App`;
- providers;
- gates;
- глобальная композиция.

### `pages`

Сборка полноценной страницы из widgets и features. Page не должна владеть низкоуровневой
бизнес-логикой, которую можно разместить ниже.

### `widgets`

Крупный автономный блок интерфейса и место композиции соседних features.

Widget может:

- связывать несколько features;
- объединять loading/error состояния;
- передавать callbacks между entity UI и feature hooks;
- оркестрировать конкретный экран.

Пример: `LotteryWidgetScene` связывает `check-lottery-combination` и
`require-channel-subscription`.

### `features`

Переиспользуемое пользовательское действие или сценарий.

Feature может:

- использовать API entities;
- хранить состояние своего сценария;
- предоставлять hook и UI;
- управлять browser lifecycle как частью сценария.

Feature не должна:

- импортировать другую feature;
- владеть стабильным backend-контрактом самостоятельной entity;
- смешивать несвязанные API, UI и orchestration.

Не каждый endpoint автоматически принадлежит entity. Use-case endpoint без самостоятельной
бизнес-сущности может принадлежать feature.

### `entities`

Владелец бизнес-сущности, её domain types, API, mapper, состояния и entity UI.

Текущие владельцы:

- `entities/lottery` — lottery API, store и UI;
- `entities/me` — пользователь и auth API;
- `entities/tg` — backend-проверка membership.

### `shared`

Фундаментальный код без знания бизнес-сценариев:

- `shared/api` — HTTP-инфраструктура;
- `shared/config` — env;
- `shared/ui` — UI-примитивы;
- `shared/styles` — tokens и mixins;
- `shared/lib` — сфокусированные технические библиотеки;
- assets и глобальные типы.

Не создавай общий `shared/model` для business/application-specific состояния.

## Структура slice

Создавай только необходимые сегменты:

```text
<slice>/
  api/
  model/
  ui/
  lib/
  index.ts
```

- `api` — DTO, payload, response types и backend-запросы владельца;
- `model` — domain types, hooks, stores и состояние;
- `ui` — React-компоненты;
- `lib` — чистые mapper и локальные helpers;
- `index.ts` — внешний контракт slice.

Не оставляй пустые сегменты.

## Выбор владельца

- Backend-контракт сущности → `entities/<entity>/api`.
- Domain type сущности → `entities/<entity>/model`.
- DTO → domain mapper → `entities/<entity>/lib`.
- Пользовательский сценарий → `features/<feature>`.
- Композиция нескольких features → `widgets` или `pages`.
- Универсальный UI-примитив → `shared/ui`.
- Техническая интеграция без бизнес-сценария → `shared/lib/<integration>`.
- Запуск, provider или gate → `app`.

Повторное использование само по себе не является причиной переносить модуль в `shared`. Сначала
учитывай его бизнес-смысл и владельца.

## Публичный API

Каждый slice предоставляет внешний API через корневой `index.ts`.

Между slices:

```ts
import { checkChannelMembership } from "@/entities/tg";
```

Внутри slice:

```ts
import { mapMeDtoToMe } from "../lib/map-me-dto-to-me";
```

Не экспортируй приватные дочерние компоненты, внутренние helpers и DTO без реальной межслойной
необходимости.
