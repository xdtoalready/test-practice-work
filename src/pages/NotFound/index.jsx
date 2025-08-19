import React, {useEffect} from 'react';
import * as Sentry from "@sentry/react";

const Index = () => {

    useEffect(() => {
        const error = new Error('Route not found');
        error.name = 'RouteNotFoundError';
        // Отправляем информацию о 404 ошибке в Sentry
        Sentry.captureException(error, {
            level: 'info',
            tags: {
                errorType: 'route_error',
                source: 'NotFoundPage'
            },
            extra: {
                url: window.location.href,
                path: window.location.pathname,
                referrer: document.referrer || 'none'
            }
        });
    }, []);

    return <h1>Страница не найдена</h1>;
};

export default Index;
