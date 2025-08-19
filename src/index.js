import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import StoreProvider from "./providers/StoreProvider";
import {BrowserRouter} from "react-router-dom";
import {ToastContainer} from "react-toastify";
import {SnackbarProvider} from "notistack";
import * as Sentry from "@sentry/react";
import initSentry from "./sentry";
import { NotificationProvider } from './providers/NotificationProvider';

initSentry()



const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(
    <Sentry.ErrorBoundary fallback={<div>Произошла ошибка. Попробуйте обновить страницу.</div>}>
            <StoreProvider>
                <SnackbarProvider
                    autoHideDuration={3000}
                    anchorOrigin={{vertical:'top',horizontal:'right'}}
                />
                    <App/>
            </StoreProvider>
    </Sentry.ErrorBoundary>
);



// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
