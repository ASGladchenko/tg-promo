# Data flow, API и TanStack Query

Этот документ обязателен при работе с API, DTO, domain types, mapper-функциями, TanStack Query и
environment variables.

## Основной поток данных

```text
backend DTO
  -> raw query cache
  -> entity DTO-to-domain mapper
  -> domain model
  -> scenario/view mapper
  -> UI
```

Raw DTO по умолчанию хранится в TanStack Query cache. Публичный entity hook скрывает DTO и возвращает
domain model через `select`.

## DTO

DTO описывает реальный backend-контракт:

```ts
export type MeDto = {
  id: string;
  first_name: string;
};
```

Правила:

- DTO находится в `entities/<entity>/api`;
- используй суффиксы `Dto`, `Response`, `Payload`;
- сохраняй backend naming и nullable-поля;
- не используй DTO в features, widgets и UI;
- не экспортируй DTO из публичного API без необходимости;
- type assertion не заменяет runtime validation.

Маленький локальный DTO может лежать рядом с API-функцией. Переиспользуемые API-типы выноси в
`api/types.ts`.

## Domain model

Domain model описывает язык приложения:

```ts
export type Me = {
  id: string;
  firstName: string;
};
```

Размещай domain types в `entities/<entity>/model/types.ts`.

Domain model может:

- нормализовать naming;
- убирать transport nesting;
- преобразовывать nullable-поля в явные состояния;
- объединять backend-поля;
- скрывать API-контракт.

Не дублируй DTO отдельной domain model, если их форма и смысл полностью совпадают.

## Entity mapper

Стабильный DTO → domain mapper принадлежит entity:

```text
entities/<entity>/lib/map-me-dto-to-me.ts
```

```ts
export function mapMeDtoToMe(dto: MeDto): Me {
  return {
    id: dto.id,
    firstName: dto.first_name
  };
}
```

Mapper:

- является чистой функцией;
- создаёт новый объект;
- не мутирует DTO и его вложенные значения;
- не выполняет HTTP-запросы;
- не хранит React-состояние;
- не переносится в глобальный `shared` только из-за повторного использования внутри одной entity.

Не создавай mapper для простого присваивания, если форма и смысл данных не меняются.

## Scenario mapper

Domain → scenario/view mapping принадлежит владельцу сценария:

```text
features/<feature>/lib/
widgets/<widget>/lib/
pages/<page>/lib/
```

Feature преобразует domain model, а не raw DTO. Не создавай универсальный mapper с флагами разных
сценариев.

## TanStack Query

Стандартный entity hook:

```ts
export function useMe() {
  return useQuery({
    queryKey: ["me"],
    queryFn: getMeDto,
    select: mapMeDtoToMe
  });
}
```

`select`:

- меняет данные, возвращаемые конкретному observer;
- не заменяет значение в query cache;
- получает cached object по ссылке;
- не защищает cache от мутации внутри mapper.

Поэтому mapper обязан создавать новую структуру:

```ts
function safeMapper(dto: MeDto): Me {
  return {
    id: dto.id,
    firstName: dto.first_name.trim()
  };
}
```

Нельзя изменять DTO:

```ts
function unsafeMapper(dto: MeDto) {
  dto.first_name = dto.first_name.trim();
  return dto;
}
```

Правила query:

- `queryFn` возвращает DTO и не знает о UI-сценарии;
- entity-level `select` выполняет стандартный DTO → domain mapping;
- mapper для `select` объявляется вне компонента или имеет стабильную ссылку;
- query keys принадлежат entity и стабильны;
- scenario view model не кладётся в общий query cache;
- разные client projections не требуют разных query keys;
- mutations и `queryClient.setQueryData()` работают с формой, которая реально лежит в cache: raw DTO.

Если все потребители используют одну domain model и raw DTO нигде не нужен, допустимо осознанно
маппить в `queryFn` и хранить domain model в cache. Не смешивай две политики случайно внутри одной
entity.

## API

- URL формируй через `getApiUrl`.
- Для cookie/session запросов указывай `credentials: "include"`.
- Проверяй `response.ok`.
- Передавай `AbortSignal`, если запрос может быть отменён.
- Не смешивай HTTP и UI state.
- Не передавай bot token и другие секреты во frontend.
- Нестабильные внешние данные проверяй parser-ом или type guard.

Entity API выполняет один запрос. Feature управляет состоянием сценария. Widget связывает features.
UI отображает состояние.

## Environment variables

Все публичные env читаются в:

```text
src/shared/config/public-env.ts
```

Используй `PUBLIC_ENV`. Прямой доступ разрешён только для встроенных Vite flags:

```ts
import.meta.env.DEV;
import.meta.env.PROD;
```

При добавлении env:

1. Добавь значение в `.env.example`.
2. Добавь тип в `src/vite-env.d.ts`.
3. Нормализуй значение в `PUBLIC_ENV`.
4. Используй его через `@/shared/config`.

Значения `VITE_*` публичны и не могут содержать секреты.
