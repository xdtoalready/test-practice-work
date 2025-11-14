import React, { createContext, useCallback, useContext } from 'react';
import { isValidPermission, PermissionGroups, UserPermissions } from '../shared/userPermissions';
import useUser from '../hooks/useUser';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const { permissions } = useUser();
  const hasPermission = useCallback(
    (permission) => {
      console.warn(permissions, 'perms');
      if (permissions && permissions.includes(UserPermissions.SUPER_ADMIN)) {
        return true;
      }
      if (!permissions || permissions.length === 0) {
        return false;
      }

      if (!isValidPermission(permission)) {
        console.warn('Invalid permission:', permission);
        return false;
      }

      if (Array.isArray(permission)) {
        return permission.every((perm) => permissions.includes(perm));
      }

      return permissions.includes(permission);
    },
    [permissions],
  );

  return (
    <PermissionsContext.Provider
      value={{
        permissions: permissions,
        hasPermission,
        Permissions: UserPermissions,
        PermissionGroups,
      }}
    >
      {children}
    </PermissionsContext.Provider>
  );
};

export const usePermissions = () => {
  const context = useContext(PermissionsContext);
  if (!context) {
    throw new Error('usePermissions must be used within a PermissionsProvider');
  }
  return context;
};
