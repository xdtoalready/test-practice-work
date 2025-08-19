import axios, { AxiosError, AxiosResponse } from 'axios';
import { API_URL } from './constants';
import Cookies from 'js-cookie';
import MockAdapter from 'axios-mock-adapter';
import { handleError } from '../utils/snackbar';
import * as Sentry from '@sentry/react';
import axiosRetry from 'axios-retry';

export let http = axios.create({
  baseURL: API_URL,
});

export const adapter = http.defaults.adapter;

export const mockHttp = new MockAdapter(http);

// axiosRetry(http, { retries: 3 });

http.interceptors.request.use(
  async (request) => {
    if (request.url.toLowerCase().includes('/auth')) {
      return request;
    }

    if (request.method === 'GET' || request.method === 'get') {
      request.headers['Cache-Control'] = 'no-cache';

      if (request.params) {
        const newParams = {};

        Object.entries(request.params).forEach(([key, value]) => {
          if (
            value === null ||
            value === undefined ||
            value === '' ||
            (Array.isArray(value) && value.length === 0)
          ) {
            return;
          }

          if (typeof value === 'string' && value.includes(',')) {
            const arrayValues = value.split(',').filter((v) => v.trim());
            if (arrayValues.length > 0) {
              newParams[`${key}[]`] = arrayValues;
            }
          } else {
            newParams[key] = value;
          }
        });

        request.params = newParams;
      }
    }

    request.headers.Authorization = `Bearer ${getToken()}`;
    return request;
  },
  function (error) {
    return Promise.reject(error);
  },
);

http.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 403) {
      // Сохраняем текущий URL для возврата
      const currentPath = window.location.pathname;

      window.location.href = `/forbidden?from=${encodeURIComponent(currentPath)}`;
      return Promise.reject(error);
    }
    return Promise.reject(error);
  },
);
export const setToken = (accessToken) => {
  localStorage.setItem('accessToken', accessToken);
};
export const getToken = () => {
  return localStorage.getItem('accessToken') || '';
};
export const removeToken = () => {
  localStorage.removeItem('accessToken');
};

export const handleHttpResponse = (response) => {
  return { status: 'success', body: response.data ?? response };
};

export const handleHttpError = (error) => {
  Sentry.captureException(error, {
    extra: {
      url: error.config?.url,
      method: error.config?.method,
      status: error.response?.status,
      statusText: error.response?.statusText,
    },
  });
  const code = error?.code;
  console.warn({ status: 'error', message: error?.message, code });
  return { status: 'error', message: error?.message, code };
};

export const handleShowError = (errors, delay = 100) => {
  const errorsResp = errors.response?.data?.errors;

  const errorsResponse = errorsResp
    ? errorsResp
    : errors.response?.data?.message;
  let delayTime = 0;

  // Преобразуем объект ошибок в массив сообщений
  const getErrorMessages = () =>
    Object.entries(errorsResponse).flatMap(([field, messages]) => {
      return messages?.map((message) => `${field}: ${message}`);
    });
  const errorContext = {
    originalError: errors,
    response: {
      status: errors.response?.status,
      statusText: errors.response?.statusText,
      data: errors.response?.data,
    },
    request: {
      url: errors.config?.url,
      method: errors.config?.method,
      headers: errors.config?.headers,
    },
  };

  // Показываем каждую ошибку с задержкой
  const messages = errorsResp ? getErrorMessages() : [errorsResponse];

  messages.forEach((message) => {
    // Отправляем в Sentry с низким приоритетом
    Sentry.captureMessage(message ?? 'Произошла ошибка', {
      level: 'info', // Используем info вместо error
      extra: errorContext,
      tags: {
        errorType: 'user_facing_error',
        source: 'handleShowError',
      },
    });

    setTimeout(() => {
      handleError(message ?? 'Произошла ошибка', errorContext); // Показ ошибки через notistack
    }, delayTime);

    delayTime += delay;
  });
  throw errorsResponse;
};

export const resetApiProvider = () => {
  // mockHttp.restore(); // Отключаем моки
  setAdapter(); // Восстанавливаем реальный адаптер
};
export const setAdapter = () => {
  http.defaults.adapter = adapter;
};

export const setMockProvider = () => {
  http.defaults.adapter = mockHttp.adapter();
};

const handleSetToken = async (response) => {
  await setToken(response.data.accessToken);
};
