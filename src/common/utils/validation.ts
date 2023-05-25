export const getErrorClass = <T>(value: T): string => {
  return !value ? "" : "with-error";
};
