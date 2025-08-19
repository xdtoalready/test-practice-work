import { useState, useEffect, useLayoutEffect, useRef } from 'react';
import { setToken } from '../shared/http';

function getStorageValue(key, defaultValue) {
  // Проверяем доступность localStorage
  if (typeof window === 'undefined') {
    return defaultValue;
  }

  try {
    const saved = localStorage.getItem(key);
    return saved ? saved : defaultValue;
  } catch (error) {
    console.error('Error reading from localStorage', error);
    return defaultValue;
  }
}

export const useLocalStorage = (key, defaultValue) => {
  const [value, setValue] = useState(() => {
    return getStorageValue(key, defaultValue);
  });
  const isTokenSet = useRef(false);


  useLayoutEffect(() => {
    async function operateToken(){
      try {
        debugger
        if (value === undefined) {
          await localStorage.removeItem(key);
        } else {
          await localStorage.setItem(key, value);
          isTokenSet.current = true;
        }
      } catch (error) {
        console.error('Error writing to localStorage', error);
      }
    }
     operateToken();


  }, [key, value]);

  const removeValue = () => {
    try {
      localStorage.removeItem(key);
      setValue(null);
    } catch (error) {
      console.error('Error removing from localStorage', error);
    }
  };

  return [value, setValue, removeValue,isTokenSet];
};