export const toCamelCase = (str) => {
  return str
    .toLowerCase()
    .replace(/[^a-zA-Z0-9]+(.)/g, (_, chr) => chr.toUpperCase())
    .replace(/^[A-Z]/, (chr) => chr.toLowerCase());
};

export const camelToSnakeCase = (str) =>
    str.replace(/[A-Z]/g, letter => `_${letter.toLowerCase()}`);


