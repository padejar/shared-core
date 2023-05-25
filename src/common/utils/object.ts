import querystring from "querystring";
import formatISO from "date-fns/formatISO";

/**
 * @param source - source of the object to be extracted
 * @param keysToExtract - array of string of properties to be extracted
 */
export const extractProperties = <T>(
  source: T,
  keysToExtract: string[]
): unknown => {
  let extractedObject = {};

  for (const key in source) {
    if (keysToExtract.includes(key)) {
      extractedObject = {
        ...extractedObject,
        [key]: source[key],
      };
    }
  }

  return extractedObject;
};

export const isObjectNotEmpty = <T>(object: T): boolean => {
  return Object.keys(object).length > 0;
};

export const propertyCheck = <T>(object: T, property: keyof T): boolean => {
  return Object.prototype.hasOwnProperty.call(object, property);
};

export const convertToQueryParams = <T extends querystring.ParsedUrlQueryInput>(
  object: T
): string => {
  const newObject = Object.assign({}, object);
  for (const field in object) {
    if (!object[field] && object[field] !== 0) delete newObject[field];
  }
  const queryParams = querystring.encode(newObject);
  return queryParams ? `?${queryParams}` : "";
};

export const isSameArray = (arrayA: unknown[], arrayB: unknown[]): boolean => {
  if (arrayA.length !== arrayB.length) return false;

  const arrayAString = JSON.stringify(arrayA);
  const arrayBString = JSON.stringify(arrayB);
  if (arrayAString !== arrayBString) {
    return false;
  }

  return true;
};

export const isSameObject = (
  objectA: Record<string, unknown>,
  objectB: Record<string, unknown>
): boolean => {
  let isSame = true;
  let keyIndex = 0;
  const objectKeys = Object.keys(objectA);
  while (isSame === true && keyIndex < objectKeys.length) {
    const key = objectKeys[keyIndex];
    let oldValue = objectA[key];
    let newValue = objectB[key];
    if (oldValue instanceof Date && newValue instanceof Date) {
      oldValue = formatISO(oldValue);
      newValue = formatISO(newValue);
    } else if (Array.isArray(oldValue) && Array.isArray(newValue)) {
      oldValue = JSON.stringify(oldValue);
      newValue = JSON.stringify(newValue);
    }
    if (oldValue !== newValue) {
      isSame = false;
    }
    keyIndex++;
  }
  return isSame;
};

export const getObjectKeyByValue = <T>(
  object: T,
  value: unknown
): string | undefined => {
  for (const prop in object) {
    if (propertyCheck(object, prop)) {
      if (object[prop] === value) return prop;
    }
  }
};
