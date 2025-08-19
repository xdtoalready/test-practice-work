import './App.css';
import React, { useContext, useEffect, useState } from 'react';
import rootApi from './root.api.js';
import useStore from './hooks/useStore';
import { prepareRoutes } from './routes/routes';
import {
  BrowserRouter, Navigate,
} from 'react-router-dom';
import { AuthContext, AuthProvider } from './providers/AuthProvider';
import useUser from './hooks/useUser';
import { withSentryRouting } from '@sentry/react';
import { PermissionsProvider } from './providers/PermissionProvider';
import SimpleBar from 'simplebar-react';
import 'simplebar-react/dist/simplebar.min.css';
import { UserProvider } from './providers/UserProvider';
import { useNotifications } from './hooks/useNotifications';
import { NotificationProvider } from './providers/NotificationProvider';
import { useLocation, useNavigation } from 'react-router';

function App() {



  const SentryRouter = withSentryRouting(BrowserRouter);
  return (
    <SentryRouter>
      <NotificationProvider>
      <AuthProvider>
        <UserProvider>
        {/*<SimpleBar>*/}
          <PermissionsProvider>
            {prepareRoutes()}
          </PermissionsProvider>
          {/*</SimpleBar>*/}
        </UserProvider>
      </AuthProvider>
      </NotificationProvider>
    </SentryRouter>
  );
}

export default App;
