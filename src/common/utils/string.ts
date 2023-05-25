export const stringToBoolean = (value: string): boolean => {
  value = value.toLowerCase();
  if (value === "true") return true;

  return false;
};

export const numberToString = (value: number | null): string => {
  if (!value) return "";
  return isNaN(value) ? "" : value.toString();
};

export const escapeRegExp = (string: string): string => {
  return string.replace(/[.*+?^${}()|[\]\\]/g, "\\$&"); // $& means the whole matched string
};
export const replaceAll = (
  str: string,
  match: string,
  replacement: string
): string => {
  return str.replace(new RegExp(escapeRegExp(match), "g"), () => replacement);
};
