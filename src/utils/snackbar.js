import { enqueueSnackbar } from 'notistack';

export const handleSubmit = (text) => {
  enqueueSnackbar(text, { variant: 'success' });
};
export const handleError = (text, error) => {
  enqueueSnackbar(text, { variant: 'error', autoHideDuration: 3000 });
};
export const handleInfo = (text, error) => {
  enqueueSnackbar(text, { variant: 'info' });
};

const showErrorsWithDelay = (errors, delay = 100) => {
  let delayTime = 0;

  // Преобразуем ошибки в массив, чтобы легко итерировать
  const errorMessages = Object.entries(errors).flatMap(([field, messages]) => {
    return messages.map((message) => `${message}`);
  });

  // Показываем каждое сообщение с задержкой
  errorMessages.forEach((message) => {
    setTimeout(() => {
      handleError(message);
    }, delayTime);

    delayTime += delay; // Увеличиваем задержку для каждого следующего сообщения
  });
};
