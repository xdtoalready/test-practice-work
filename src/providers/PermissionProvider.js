import React, {
  createContext,
  useCallback,
  useContext,
  useMemo,
  useState,
} from 'react';
import {
  isValidPermission,
  PermissionGroups,
  UserPermissions,
} from '../shared/userPermissions';
import useUser from '../hooks/useUser';

const PermissionsContext = createContext();

export const PermissionsProvider = ({ children }) => {
  const { permissions } = useUser();
  // const hasPermission = useCallback(
  //   (permission) => {
  //     console.log('permissions is', permissions);
  //     console.log('check permission', permission);
  //     if (permissions && permissions[UserPermissions.SUPER_ADMIN]) {
  //       console.log('permission is true', permission);
  //       return true;
  //     }
  //
  //     if (!permissions || Object.keys(permissions).length === 0) {
  //       console.log('permission is false by keys', permission);
  //
  //       return false;
  //     }
  //
  //     if (!isValidPermission(permission)) {
  //       console.warn('Invalid permission:', permission);
  //       return false;
  //     }
  //
  //     if (Array.isArray(permission)) {
  //       console.log('check permission by sum', permission);
  //
  //       return permission.some((perm) => permissions[perm]);
  //     }
  //     console.log('check permission by true', permission);
  //
  //     return permissions[permission] === true;
  //   },
  //   [permissions],
  // );

  const hasPermission = useCallback(
    (permission) => {
      console.warn(permissions,'perms');
      if (permissions && permissions.includes(UserPermissions.SUPER_ADMIN)) {
        console.log('permission is true', permission);
        return true;
      }
      if (!permissions || permissions.length === 0) {
        console.log('permission is false by keys', permission);
        return false;
      }

      if (!isValidPermission(permission)) {
        console.warn('Invalid permission:', permission);
        return false;
      }

      if (Array.isArray(permission)) {
        console.log('check permission by some', permission);

        return permission.every((perm) => permissions.includes(perm));
      }
      console.log('check permission by true', permission);

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
