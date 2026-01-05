# Dofy Masters - Telegram Mini App

Telegram Mini App для управления пользователями.

## Технологии

- Vue 3 + TypeScript
- Vite
- Pinia
- Vue Router
- GraphQL (Apollo Client)
- Telegram WebApp SDK (@twa-dev/sdk)
- Tailwind CSS
- Naive UI

## Разработка

```bash
# Установка зависимостей
npm install

# Запуск dev сервера
npm run dev

# Сборка для production
npm run build

# Предпросмотр production сборки
npm run preview
```

## Деплой на GitHub Pages

Проект настроен для автоматического деплоя на GitHub Pages через GitHub Actions.

### Настройка GitHub Pages

1. Перейдите в настройки репозитория: `Settings` → `Pages`
2. В разделе `Source` выберите `GitHub Actions`
3. После первого push в ветку `dev` workflow автоматически задеплоит приложение

### Ручной деплой

Workflow также можно запустить вручную:
1. Перейдите в `Actions`
2. Выберите workflow `Deploy to GitHub Pages`
3. Нажмите `Run workflow`

### URL приложения

После деплоя приложение будет доступно по адресу:
```
https://YauheniKZK.github.io/dofy_makers/
```

**Примечание:** Деплой происходит автоматически при push в ветку `dev`.

## Структура проекта

```
src/
├── pages/
│   ├── auth/
│   │   ├── Start.vue      # Стартовая страница с проверкой Telegram ID
│   │   └── Login.vue
│   └── dashboard/
│       └── Main.vue        # Главная страница аккаунта
├── graphql/                # GraphQL запросы и мутации
├── stores/                 # Pinia stores
└── router/                 # Vue Router конфигурация
```

## Особенности

- Автоматическая проверка пользователя по Telegram ID
- Активация аккаунта при первом входе
- Интеграция с Telegram WebApp SDK
