# Инструкция по установке PDF библиотек

## Проблема

В `package.json` могут появиться дубликаты библиотек react-pdf и pdfjs-dist.
Это происходит при повторной установке пакетов.

## Решение

### 1. Проверьте package.json

Откройте `package.json` и убедитесь, что каждая библиотека указана **только один раз**:

```json
{
  "dependencies": {
    "react-pdf": "^9.1.1",
    "pdfjs-dist": "^4.8.69"
  }
}
```

### 2. Если есть дубликаты - удалите их

**Пример неправильного package.json с дубликатами:**
```json
{
  "dependencies": {
    "react-pdf": "^10.2.0",
    "react-pdf": "^9.1.1",       ❌ ДУБЛИКАТ
    "pdfjs-dist": "^5.4.394",
    "pdfjs-dist": "^4.8.69"      ❌ ДУБЛИКАТ
  }
}
```

**Правильный package.json:**
```json
{
  "dependencies": {
    "react-pdf": "^9.1.1",
    "pdfjs-dist": "^4.8.69"
  }
}
```

### 3. Очистите кеш и переустановите

```bash
# Удалите node_modules и lock файл
rm -rf node_modules package-lock.json

# Переустановите зависимости
npm install

# Или с очисткой кеша
npm cache clean --force
npm install
```

### 4. Для Docker

Если используете Docker:

```bash
# Пересоберите образ
docker-compose down
docker-compose build --no-cache
docker-compose up
```

## Совместимость версий

| react-pdf  | pdfjs-dist | React | Статус |
|------------|------------|-------|---------|
| 10.2.0     | 5.4.394    | 18.x  | ✅ Используется (текущая) |
| 9.1.1      | 4.8.69     | 18.x  | ⚠️ Устаревшая |

**ВАЖНО:** react-pdf 9.x несовместим с pdfjs-dist 5.x!

## Как работает worker

Worker для PDF.js загружается автоматически через CDN:
```
https://cdn.jsdelivr.net/npm/pdfjs-dist@5.4.394/build/pdf.worker.min.mjs
```

Версия подбирается автоматически на основе установленного `pdfjs-dist`.

**Обратите внимание:**
- Для версии 5.x используется расширение `.mjs` (ES module)
- Для версии 4.x использовалось расширение `.js` (UMD module)

## Проверка установки

После установки проверьте версии:

```bash
npm list react-pdf
npm list pdfjs-dist
```

Должен быть вывод:
```
react-pdf@10.2.0
pdfjs-dist@5.4.394
```

## Troubleshooting

### Ошибка "The API version X does not match the Worker version Y"

**Причина:** Несовместимые версии react-pdf и pdfjs-dist

**Примеры:**
```
API version "4.8.69" does not match Worker version "5.4.394"
→ react-pdf 9.x установлен, а нужен 10.x

API version "5.4.394" does not match Worker version "4.8.69"
→ react-pdf 10.x установлен, а pdfjs-dist нужен 5.x
```

**Решение:**
1. Проверьте совместимость версий в таблице выше
2. Убедитесь что в package.json:
   - `react-pdf: ^10.2.0`
   - `pdfjs-dist: ^5.4.394`
3. Удалите дубликаты если есть
4. Переустановите: `rm -rf node_modules package-lock.json && npm install`
5. Перезапустите приложение

### Ошибка "Failed to fetch dynamically imported module"

**Причина:** Worker не может загрузиться из CDN или локального пути

**Решение:**
1. Проверьте package.json на дубликаты
2. Очистите кеш: `npm cache clean --force`
3. Переустановите: `rm -rf node_modules && npm install`
4. Перезапустите dev server
5. Проверьте что CDN доступен (jsdelivr.net)

### Ошибка "validation.boolean"

**Причина:** API получает неправильный тип параметра stamp

**Решение:** Убедитесь что используете stamp=1 или stamp=0 (не true/false)

### ⚠️ Важно: Удалите старый worker из public

Если вы ранее копировали `pdf.worker.min.mjs` в папку `public/`, удалите его!
Теперь worker загружается автоматически из CDN, локальная копия больше не нужна.

```bash
rm public/pdf.worker.min.mjs  # удалить если существует
```

## Поддержка

Если проблемы сохраняются:
1. Проверьте console в браузере
2. Посмотрите Network tab для запросов к worker
3. Убедитесь что нет ошибок CORS
