import React, { createContext, useEffect, useState } from 'react';
import { useNavigate, useLocation } from 'react-router';
import { useCookies } from '../hooks/useCookies';
import { API_URL } from '../shared/constants';
import {
  adapter,
  http,
  mockHttp,
  resetApiProvider,
  setMockProvider,
} from '../shared/http';
import axios from 'axios';
import useUser from '../hooks/useUser';
import useAppApi from '../api';
import { useLocalStorage } from '../hooks/useLocalStorage';
import { Navigate } from 'react-router-dom'; // Импортируйте хук

export const AuthContext = createContext();

const getUserProfile = (token) => {
  return axios.get(`${API_URL}/api/me`, {
    headers: {
      "Content-Type": "application/json",
      Accept: "application/json",
      "X-Requested-With": "XMLHttpRequest",
      Authorization: `Bearer ${token}`,
    },
    withCredentials: true, // если бэкенд использует куки
  })
    .then(res => res.data)
    .catch(err => {
      console.error("Ошибка получения профиля:", err);
      throw err;
    });
};

export const AuthProvider = ({ children }) => {
  const [authToken, setAuthToken, removeAuthToken,isTokenSet] = useLocalStorage(
    'accessToken',
    null
  );
  // const [chatToken, setChatToken, removeChatToken] = useLocalStorage(
  //   'chat_one_time_token',
  //   null
  // );
  const [chatToken,setChatToken] = useState(null);
  const navigate = useNavigate();
  const location = useLocation();
  const appApi = useAppApi();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    setIsReady(true);
  }, []);

  useEffect(() => {
    if(!authToken || authToken  === 'null') {
      navigate('/login',{replace:true});

    }
  },[authToken])



  const login = async (email, password) => {
    try {
      resetApiProvider();
      const response = await axios.post(
        `${API_URL}/api/auth`,
        { email: email, password: password },
        {
          withCredentials: true,
          headers: {
            'Content-Type': 'application/json',
            Accept: 'application/json',
            'X-Requested-With': 'XMLHttpRequest',
          },
        },
      );
      const { data } = response;
      if (data.token) {
         setAuthToken(data.token);

        if (data.chat_one_time_token) {
          setChatToken(data.chat_one_time_token);
        }
        const from = location.state?.from?.pathname || "/";
        getUserProfile(data.token).then(() => {
          navigate(from, { replace: true });
        });
      } else {
        alert('Неверный email или пароль');
      }
    } catch (error) {
      alert('Произошла ошибка при авторизации');
    }
  };

  const logout = () => {

    removeAuthToken();
    setChatToken(null);
    navigate('/login');
  };
  debugger
  return (
    <AuthContext.Provider value={{ authToken,chatToken, login, logout, isReady }}>
      {/*{(!authToken || authToken === 'null') && <Navigate to="/login" state={{ from: location }} replace />}*/}
      {children}
    </AuthContext.Provider>
  );
};
