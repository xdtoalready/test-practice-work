import React, {
  createContext,
  useContext,
  useEffect,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
} from 'react';
import useAppApi from '../api';
import { loadAvatar } from '../utils/create.utils';
import { toCamelCase } from '../utils/mapper';
import useStore from '../hooks/useStore';

const mapUser = (userApi) => {
  return {
    id: userApi.id,
    name: userApi.name,
    middleName: userApi.middle_name,
    lastName: userApi.last_name,
    image: loadAvatar(userApi?.avatar),
    role: userApi.position?.name,
    email: userApi.email,
    user_id: userApi.user_id,
    phone: userApi.phone || null,
    permissions: mapArrayPermission(userApi.permissions),
  };
};

const mapArrayPermission = (permissions) => {
  if (!permissions || !Array.isArray(permissions)) {
    return [];
  }
  return permissions.map((permission) => toCamelCase(permission));
};

const mapPermissions = (permissions) => {
  if (!permissions || typeof permissions !== 'object') {
    return {};
  }

  return Object.entries(permissions).reduce((acc, [key, value]) => {
    const camelCaseKey = toCamelCase(key);
    acc[camelCaseKey] = value;
    return acc;
  }, {});
};

const UserContext = createContext({
  permissions: [],
  user: null,
  isLoading: false,
  refetch: () => {},
  fetchRights: () => {},
});

export const UserProvider = ({ children }) => {
  const { userStore } = useStore();
  const { getUserProfile, isLoading, getUserRights } = useAppApi();
  const isUserLoaded = useRef(false);
  const isRightsLoaded = useRef(false);

  const fetchUser = async () => {
    try {
      const response = await getUserProfile();
      userStore.setUser(mapUser(response.body.data));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  const fetchUserRights = async () => {
    try {
      const response = await getUserRights();
      userStore.setRights(mapPermissions(response.body));
    } catch (error) {
      console.error('Error fetching user profile:', error);
    }
  };

  useLayoutEffect(() => {
    if (!isUserLoaded.current) {
      fetchUser().then(() => {
        isUserLoaded.current = true;
      });
    }
  }, []);

  const user = useMemo(() => userStore.user, [userStore.user]);
  const permissions = useMemo(() => userStore.rights, [userStore.rights]);

  const value = {
    permissions: user?.permissions ?? [],
    user,
    isLoading,
    refetch: fetchUser,
    fetchRights: fetchUserRights,
  };

  return <UserContext.Provider value={value}>{children}</UserContext.Provider>;
};

export const useUser = () => {
  const context = useContext(UserContext);
  if (!context) {
    throw new Error('useUser must be used within a UserProvider');
  }
  return context;
};
