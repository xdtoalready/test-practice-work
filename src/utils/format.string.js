export function getCorrectWordForm(number, nominative) {
  const lastDigit = number % 10;
  const lastTwoDigits = number % 100;

  let form;

  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    form = 'ов';
  } else {
    switch (lastDigit) {
      case 1:
        form = '';
        break;
      case 2:
      case 3:
      case 4:
        form = 'а';
        break;
      default:
        form = 'ов';
    }
  }

  return `${number} ${nominative}${form}`;
}

export const truncateString = (str, maxLength) => {
  if (maxLength === -1) {
    return str;
  }
  if (str.length <= maxLength) {
    return str;
  }
  return str.slice(0, maxLength) + '...';
};

export function formatUnts(type) {
  switch (type) {
    case 'минут':
    case 'минута':
    case 'минуты':
      return 'minutes'
    case 'часов':
    case 'часа':
    case 'час':
      return 'hours'
    case 'дней':
    case 'дня':
    case 'день':
      return 'days'
  }
}

export function formatDuration(value, type) {
  if(value ===  null){
    switch (type) {
      case 'minutes':
        return 'минуты'
      case 'hours':
        return 'часы'
      case 'days':
        return 'дни'
    }
  }
  const pluralize = (number, one, few, many) => {
    if (number % 10 === 1 && number % 100 !== 11) {
      return `${number} ${one}`;
    } else if ([2, 3, 4].includes(number % 10) && ![12, 13, 14].includes(number % 100)) {
      return `${number} ${few}`;
    } else {
      return `${number} ${many}`;
    }
  };

  switch (type) {
    case 'minutes':
      return pluralize(value, 'минута', 'минуты', 'минут');
    case 'hours':
      return pluralize(value, 'час', 'часа', 'часов');
    case 'days':
      return pluralize(value, 'день', 'дня', 'дней');
  }
}


export function declineWord(word, count) {

  function getWordForms(word) {
    const rules = {
      'задача': { one: 'задача', few: 'задачи', many: 'задач' },
      'файл': { one: 'файл', few: 'файла', many: 'файлов' },
      'комментарий': { one: 'комментарий', few: 'комментария', many: 'комментариев' },
    };

    return rules[word] || generateForms(word);
  }

// Fallback function for words not in the rules
  function generateForms(word) {
    // Basic rules for common endings
    if (word.endsWith('а')) {
      return {
        one: word,
        few: word.slice(0, -1) + 'и',
        many: word.slice(0, -1)
      };
    }
    // Add more ending rules as needed

    // Default case
    return {
      one: word,
      few: word + 'а',
      many: word + 'ов'
    };
  }
  // Remove trailing spaces
  count = Math.abs(count);
  const lastDigit = count % 10;
  const lastTwoDigits = count % 100;

  // Get word forms
  const forms = getWordForms(word);

  // Handle special cases for numbers ending in 11-14
  if (lastTwoDigits >= 11 && lastTwoDigits <= 14) {
    return forms.many;
  }

  // Handle other cases based on last digit
  if (lastDigit === 1) {
    return forms.one;
  }
  if (lastDigit >= 2 && lastDigit <= 4) {
    return forms.few;
  }
  return forms.many;
}