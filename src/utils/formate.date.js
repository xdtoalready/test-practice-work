import { format, isToday, isTomorrow, isYesterday, parseISO, isValid, isThisYear } from 'date-fns';
import { ru } from 'date-fns/locale/ru';
import moment from 'moment';

export const formatDate = (date) => {
  if (!date || !isValidDate(date)) return 'Не указано';
  let formatDate = format(date, 'cccccc, dd LLL, HH:mm', { locale: ru });
  formatDate = formatDate.charAt(0).toUpperCase() + formatDate.slice(1);
  return formatDate;
};

export const formatDateWithoutHours = (date) => {
  if (!date || !isValidDate(date)) return '';

  const stringDate = date instanceof Date ? date.toISOString() : date;
  let formatDate = format(stringDate, 'cccccc, dd LLL', { locale: ru });
  formatDate = formatDate.charAt(0).toUpperCase() + formatDate.slice(1);
  return formatDate;
};

export const formatDateWithDateAndYear = (date) => {
  if (!date || !isValidDate(date)) return 'Не указано';
  let formatDate = format(date, 'dd MMMM, yyyy', { locale: ru });
  formatDate = formatDate.charAt(0).toUpperCase() + formatDate.slice(1);
  return formatDate;
};

export const formatDateOnlyHours = (date) => {
  if (!date || !isValidDate(date)) return;


  const hours = date.getHours().toString().padStart(2, '0');
  const minutes = date.getMinutes().toString().padStart(2, '0');
  return `${hours}:${minutes}`;
};

export const formatDateWithOnlyDigits = (date) => {
  if (!date || !isValidDate(date)) return 'Не указано';

  let formatDate = format(date, 'dd.MM.yyyy', { locale: ru });
  formatDate = formatDate.charAt(0).toUpperCase() + formatDate.slice(1);
  return formatDate;
};

export const formatHours = (date) => {
  if (!date || !isValidDate(date)) return;

  return format(date, 'HH:mm');
};

export const formatDateToBackend = (value) => {
  if (!value || !isValidDate(value)) return null;

  return format(value, 'yyyy-MM-dd\'T\'HH:mm:ss');
};

export const formatDateToQuery = (value) => {
  if (!value || !isValidDate(value)) return;

  return format(value, 'yyyy-MM-dd');
};

function isValidDate(d) {
  return d instanceof Date && !isNaN(d);
}

export const convertUTCToLocal = (utcDate) => {
  return moment(utcDate).toDate();
};


export function formatDateWithToday(date) {
  // const date = new Date(d);
  //
  if (isToday(date)) {
    return `Сегодня, ${format(date, 'd MMMM', { locale: ru })}`;
  } else if (isYesterday(date)) {
    return `Вчера, ${format(date, 'd MMMM', { locale: ru })}`;
  } else if (isTomorrow(date)) {
    return `Завтра, ${format(date, 'd MMMM', { locale: ru })}`;
  } else {
    return format(date, 'd MMMM', { locale: ru });
  }
}

export const formatNotificationDate = (date) => {
  const parsedDate = typeof date === 'string' ? parseISO(date) : date;

  if (!isValid(parsedDate)) return 'Неверная дата';

  const timePart = format(parsedDate, 'HH:mm');

  if (isToday(parsedDate)) {
    return `Сегодня в ${timePart}`;
  }

  if (isYesterday(parsedDate)) {
    return `Вчера в ${timePart}`;
  }

  if (isThisYear(parsedDate)) {
    const datePart = format(parsedDate, 'd MMMM', { locale: ru });
    return `${datePart} в ${timePart}`;
  }

  const datePart = format(parsedDate, 'dd.MM.yyyy');
  return `${datePart} в ${timePart}`;
};