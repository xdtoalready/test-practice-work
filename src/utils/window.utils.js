import { taskableTypes } from '../pages/Tasks/tasks.types';
import {camelToSnakeCase} from "./mapper";
import {formatDateToQuery} from "./formate.date";
import {handleError, handleSubmit} from "./snackbar";

export const getQueryParam = (param, defaultValue = null) => {
  const searchParams = new URLSearchParams(window.location.search);

  // Получаем значение параметра
  const value = searchParams.get(param);

  // Если параметр найден, возвращаем его. Если нет, возвращаем дефолтное значение.
  return value !== null ? value : defaultValue;
};

export const getTaskableTypeFromUrl = (url) => {
  if (!url) return null;

  const urlPatterns = {
    deals: taskableTypes.deal,
    stages: taskableTypes.stage,
  };

  // Extract the relevant part from URL
  const matches = url.match(/\/(deals|stages)/);
  if (!matches) return null;

  return urlPatterns[matches[1]] || null;
};

export const getPageTypeFromUrl = (url) => {
  if (!url) return null;

  const urlPatterns = {
    clients: 'companies',
    deals: 'deals',
    tasks: 'tasks',
  };

  // Извлекаем нужную часть из URL
  const matches = url.match(/\/(clients|deals|tasks)/);
  if (!matches) return null;

  return urlPatterns[matches[1]] || null;
};

export const removeLastPathSegment = (pathname) => {
  const segments = pathname.split('/').filter(Boolean);
  segments.pop();
  return segments.length ? `/${segments.join('/')}` : '/';
};

export const sanitizeUrlFilters = (filters) => {
  const sanitizedFilters = {};
  const dateFields = ['created_at'];
  Object.entries(filters).forEach(([key, value]) => {
    if (
        value === null ||
        value === undefined ||
        value === '' ||
        (Array.isArray(value) && value.length === 0)
    ) {
      return;
    }

    const snakeKey = camelToSnakeCase(key);
    if (dateFields.includes(snakeKey) ) {
      sanitizedFilters[snakeKey] = formatDateToQuery(value);
      return;
    }
    if (Array.isArray(value)) {
      if (value[0]?.hasOwnProperty('value')) {
        const arrayValue = value.map(item => item.value).join(',');
        if (arrayValue) {
          sanitizedFilters[snakeKey] = arrayValue;
        }
      } else {
        const arrayValue = value.join(',');
        if (arrayValue) {
          sanitizedFilters[snakeKey] = arrayValue;
        }
      }
    } else if (value?.hasOwnProperty('value')) {
      if (value.value) {
        sanitizedFilters[snakeKey] = value.value;
      }
    } else {
      if (value) {
        sanitizedFilters[snakeKey] = value;
      }
    }
  });

  return sanitizedFilters;
};

export const handleCopyTaskLink = (id) =>{
  const source = window.location.origin
  navigator.clipboard.writeText(`${source}/tasks?taskId=${id}`)
      .then(()=>handleSubmit('Ссылка скопирована'))
      .catch(()=>handleError('Произошла ошибка'))
}