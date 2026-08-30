export const toCamelCase = (str: string) => str.replace(/_([a-z])/g, (g) => g[1].toUpperCase());
export const toSnakeCase = (str: string) => str.replace(/[A-Z]/g, (letter) => `_${letter.toLowerCase()}`);

export function keysToCamelCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(v => keysToCamelCase(v));
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toCamelCase(key)] = keysToCamelCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}

export function keysToSnakeCase(obj: any): any {
  if (Array.isArray(obj)) return obj.map(v => keysToSnakeCase(v));
  if (obj !== null && obj.constructor === Object) {
    return Object.keys(obj).reduce((result, key) => {
      result[toSnakeCase(key)] = keysToSnakeCase(obj[key]);
      return result;
    }, {} as any);
  }
  return obj;
}
