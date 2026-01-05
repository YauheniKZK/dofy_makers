# Инструкция по настройке GitHub Pages

## Важно: Включите GitHub Pages вручную

Для работы деплоя необходимо **вручную** включить GitHub Pages в настройках репозитория.

### Шаги:

1. **Перейдите в настройки репозитория:**
   - Откройте: https://github.com/YauheniKZK/dofy_makers/settings/pages
   - Или: `Settings` → `Pages` в вашем репозитории

2. **В разделе "Build and deployment":**
   - В поле **"Source"** выберите **`GitHub Actions`** (НЕ "Deploy from a branch")
   - Сохраните изменения (кнопка "Save")

3. **Проверьте права доступа:**
   - Убедитесь, что у вашего аккаунта есть права **Administrator** или **Maintainer** на репозиторий
   - Если репозиторий приватный, убедитесь, что у вас есть подписка GitHub Pro или выше

4. **После включения Pages:**
   - Сделайте commit и push в ветку `dev`
   - Workflow автоматически запустится и задеплоит приложение

### Если ошибка сохраняется:

1. Проверьте, что в настройках репозитория `Settings` → `Actions` → `General`:
   - Разрешен доступ для GitHub Actions
   - Workflow permissions установлены на "Read and write permissions"

2. Убедитесь, что репозиторий не пустой и содержит код

3. Проверьте логи workflow в разделе `Actions` для деталей ошибки

### URL после успешного деплоя:
```
https://YauheniKZK.github.io/dofy_makers/
```

