import { API_URL } from '../shared/constants';

export const createBaseMessengerLinksByName = (name) => {
  switch (name) {
    case 'whatsapp':
      return 'https://www.whatsapp.com/';
    case 'telegram':
      return 'https://telegram.org/';
    default:
      return '';
  }
};

const defaultBlobImage =
  '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';

export const loadAvatar = (blob) => {
  const blobResult = blob ?? defaultBlobImage;
  return !blob ? `data:image/png;base64,${blobResult}` : `${API_URL}${blob}`;
};

export const sanitizeObjectForBackend = (sourceObject, allowedFields) => {
  if (!sourceObject || !Array.isArray(allowedFields)) {
    return {};
  }

  return allowedFields.reduce((filteredObject, fieldName) => {
    // Only add the field if it exists in the source object
    if (sourceObject.hasOwnProperty(fieldName)) {
      filteredObject[fieldName] = sourceObject[fieldName];
    }
    return filteredObject;
  }, {});
};

export const getSearchParamsFromLocation = (search) => {
  if (search === '' || !search) return [];
  const sanitazedSearch = search.slice(1);
  return sanitazedSearch.split('&').map((el) => {
    const values = el.split('=');
    return [values[0], values[1]];
  });
};
