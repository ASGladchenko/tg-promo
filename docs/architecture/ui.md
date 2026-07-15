# UI и React-компоненты

Этот документ обязателен при создании и изменении React-компонентов, SCSS и структуры `ui`.

## Размещение

Все React-компоненты slice находятся внутри единственного `ui`-сегмента.

Компоненты одного slice по умолчанию лежат рядом:

```text
widgets/lottery-widget/
  index.ts
  ui/
    lottery-widget/
      lottery-widget.tsx
      lottery-widget.scss
      index.ts
    lottery-widget-loader/
      lottery-widget-loader.tsx
      lottery-widget-loader.scss
      index.ts
    lottery-widget-scene/
      lottery-widget-scene.tsx
      lottery-widget-scene.scss
      index.ts
```

Не создавай механически:

```text
ui/
  component/
    ui/
      child-component/
```

Дополнительная вложенность допустима только для большого автономного компонента со сложным
приватным деревом, когда она реально улучшает навигацию.

## Публичные и приватные компоненты

Корневой public API экспортирует только внешний контракт slice:

```ts
export { LotteryWidget } from "./ui/lottery-widget";
```

Приватный компонент:

- не экспортируется из корневого `<slice>/index.ts`;
- импортируется относительным путём внутри slice;
- может экспортироваться из локального `ui/index.ts`, если нужен нескольким компонентам slice.

Не создавай локальный barrel без необходимости.

## React

- Только named exports/imports для компонентов.
- Default imports допустимы для assets, SVG и библиотек с default API.
- Не используй `"use client"`.
- Props и локальные типы держи рядом с компонентом.
- Выноси дочерний компонент, когда у него появилась самостоятельная ответственность.
- Не дроби короткую разметку на компоненты только ради структуры.
- Не используй вложенные JSX-тернарки, где одна ветка возвращает другую тернарку. Выноси такие
  условия в `if`, переменную или отдельный компонент.
- Не заменяй вложенную JSX-тернарку вложенным `if`. Если у компонента несколько крупных
  альтернативных JSX-веток, вынеси ветки в переменную с плоскими условиями или в отдельные
  компоненты.
- Сохраняй loading, error, disabled и empty states.

## SCSS

- Стили находятся рядом с компонентом.
- Используй существующий BEM naming.
- Для tokens и mixins используй `shared/styles`.
- Не складывай стили разных самостоятельных компонентов в один файл.
- Не добавляй inline styles без необходимости.

## Условные классы

Используй `clsx`:

```tsx
className={clsx("lottery-code-panel__slot", {
  "lottery-code-panel__slot--active": isActive,
  "lottery-code-panel__slot--invalid": isInvalid
})}
```

Не собирай `className` вручную через тернарные строки, конкатенацию, template literals или массивы с
`.filter(Boolean).join(" ")`.

## Accessibility

- Интерактивные элементы должны быть `button`, `a` или другим подходящим semantic element.
- Добавляй понятные `aria-label` для icon-only controls.
- Сохраняй keyboard interaction и focus-visible.
- Используй `disabled` для недоступных действий.
- Ошибки и loading-состояния должны быть доступны screen reader.
- Modal должна иметь label, корректное закрытие и блокировку background interaction.

## Состояние UI

- Локальное состояние остаётся в компоненте.
- Общий client state может находиться в Zustand.
- Server state принадлежит TanStack Query.
- Loading блокирует повторную отправку и изменение данных, если запрос зависит от их snapshot.
- Ошибка не должна необратимо фиксировать пользовательские данные.
