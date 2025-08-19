import * as Sentry from '@sentry/react';

const ignoreErrors = [
  // Ошибки сети
  /Network Error/,
  /Failed to fetch/,
  /NetworkError/,
  // Ошибки CORS
  /Cross-Origin Request Blocked/,
  // Ошибки отмены запроса
  /AbortError/,
  // Ошибки offline
  /net::ERR_INTERNET_DISCONNECTED/,
  /net::ERR_NETWORK_CHANGED/,
  // Специфичные ошибки браузеров
  /Script error/,
  /ResizeObserver loop limit exceeded/,
  // Ошибки аутентификации
  /Authorization failed/,
  /Token expired/,
  /^Warning:/, // Все сообщения, начинающиеся с Warning:
  /Warning:.+See https:\/\/reactjs.org\//, // Все React документация warnings
  /Warning:.+See https:\/\/fb.me\//, // Все Facebook warnings
];

const ignoreUrls = [
  // Сторонние скрипты
  /extensions\//i,
  /^chrome:\/\//i,
  /^chrome-extension:\/\//i,
  /^moz-extension:\/\//i,
  /AdaptiveCard/,
];

// const initSentry = () => Sentry.init({
//     dsn: process.env.REACT_APP_SENTRY_DSN,
//     integrations: [
//         Sentry.browserTracingIntegration(),
//         Sentry.replayIntegration(),
//         Sentry.captureConsoleIntegration()
//     ],
//     // Tracing
//     tracesSampleRate: 1.0, //  Capture 100% of the transactions
//     tracePropagationTargets: ["localhost", process.env.REACT_APP_API_URL],
//     // Session Replay
//     replaysSessionSampleRate: 0.1, // This sets the sample rate at 10%. You may want to change it to 100% while in development and then sample at a lower rate in production.
//     replaysOnErrorSampleRate: 1.0, // If you're not already sampling the entire session, change the sample rate to 100% when sampling sessions where errors occur.
// });
export const initSentry = () => {
  Sentry.init({
    dsn: process.env.REACT_APP_SENTRY_DSN,
    integrations: [
      Sentry.browserTracingIntegration(),
      Sentry.replayIntegration(),
      Sentry.captureConsoleIntegration(),
    ],
    autoSessionTracking: false,
    tracePropagationTargets: ['localhost', process.env.REACT_APP_API_URL],
    tracesSampleRate: 0.1,

    beforeSend(event, hint) {
      const error = hint?.originalException;
      const errorMessage = error?.message || event?.message;

      if (
        errorMessage &&
        (errorMessage.startsWith('Warning:') ||
          ignoreErrors.some((pattern) => pattern.test(errorMessage)))
      ) {
        return null;
      }

      const url = error?.url || event?.request?.url;
      if (url && ignoreUrls.some((pattern) => pattern.test(url))) {
        return null;
      }

      if (event.level === 'info') {
        if (Math.random() > 0.01) {
          // отправляем только 1% info-событий
          return null;
        }
      }

      return event;
    },

    maxBreadcrumbs: 50,
    beforeBreadcrumb(breadcrumb) {
      if (
        breadcrumb.category === 'console' &&
        !['error', 'warning'].includes(breadcrumb.level)
      ) {
        return null;
      }
      return breadcrumb;
    },
  });
};
export default initSentry;
