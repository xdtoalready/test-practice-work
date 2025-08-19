import Cookies from 'js-cookie';
import { useState } from 'react';

export const useCookies = (key, initialValue) => {
  const [value, setValue] = useState(() => {
    const cookieValue = Cookies.get(key);
    return cookieValue !== undefined ? cookieValue : initialValue;
  });

  const setCookie = (newValue) => {
    setValue(newValue);
    Cookies.set(key, newValue);
  };

  const removeCookie = () => {
    setValue(initialValue);
    Cookies.remove(key);
  };

  return [value, setCookie, removeCookie];
};
