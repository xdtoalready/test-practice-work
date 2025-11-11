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

| react-pdf  | pdfjs-dist | Статус |
|------------|------------|---------|
| 9.1.1      | 4.8.69     | ✅ Используется |
| 10.x       | 5.x        | ⚠️ Не поддерживается |

## Как работает worker

Worker для PDF.js загружается автоматически через CDN:
```
https://cdn.jsdelivr.net/npm/pdfjs-dist@4.8.69/build/pdf.worker.min.js
```

Версия подбирается автоматически на основе установленного `pdfjs-dist`.

## Проверка установки

После установки проверьте версии:

```bash
npm list react-pdf
npm list pdfjs-dist
```

Должен быть вывод:
```
react-pdf@9.1.1
pdfjs-dist@4.8.69
```

## Troubleshooting

### Ошибка "Failed to fetch dynamically imported module"

**Причина:** Worker не может загрузиться или версии не совпадают

**Решение:**
1. Проверьте package.json на дубликаты
2. Очистите кеш: `npm cache clean --force`
3. Переустановите: `rm -rf node_modules && npm install`
4. Перезапустите dev server

### Ошибка "validation.boolean"

**Причина:** API получает неправильный тип параметра stamp

**Решение:** Убедитесь что используете stamp=1 или stamp=0 (не true/false)

## Поддержка

Если проблемы сохраняются:
1. Проверьте console в браузере
2. Посмотрите Network tab для запросов к worker
3. Убедитесь что нет ошибок CORS
