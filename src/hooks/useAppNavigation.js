import { useContext, useState } from 'react';
import { AuthContext } from '../providers/AuthProvider';

const useAppNavigation = () => {
  const [isLogoutModalOpen, setIsLogoutModalOpen] = useState(false);
  const { logout } = useContext(AuthContext);

  const handleLogout = () => {
    logout();
  };

  const navigation = [
    {
      title: 'Сделки',
      action: () => {
      },
      url: '/deals',
    },
    {
      title: 'Клиенты',
      action: () => {
      },
      url: '/clients',
    },
    {
      title: 'Услуги',
      action: () => {
      },
      url: '/services',
    },
    {
      title: 'Задачи',
      action: () => {
      },
      url: '/tasks',
    },
    {
      title: 'Календарь',
      action: () => {
      },
      url: '/calendar',
    },
    {
      title: 'Документы',
      action: () => {
      },
      url: '/documents',
    },
    {
      title: 'Сотрудники',
      action: () => {
      },
      url: '/settings',
    },
    {
      title: 'Трекер',
      action: () => {
      },
      url: '/timetrackings',
    },
    {
      title: 'Звонки',
      action: () => {
      },
      url: '/calls',
    },
    {
      title: 'Wiki',
      action: () => {
      },
      url: 'https://wiki.lead-bro.ru',
    },
    {
      button: true,
      icon: (
        <img
          style={{ padding: '0.5rem 1rem', cursor: 'pointer' }}
          src={'/leadbro/power.svg'}
        />
      ),
      title: 'Выйти',
      action: () => setIsLogoutModalOpen(true),
    },
  ];

  return {
    navigation,
    isLogoutModalOpen,
    setIsLogoutModalOpen,
    handleLogout,
  };
};

export { useAppNavigation };
