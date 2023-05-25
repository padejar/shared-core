export const parseNumber = (numberString: string | null): number => {
  if (numberString !== null) {
    const value = parseFloat(numberString.replace(/[^0-9.-]+/g, ""));

    if (!isNaN(value)) {
      return value;
    }
  }

  return 0;
};

export const convertToCurrency = (
  number: number,
  options?: Intl.NumberFormatOptions
): string => {
  return Number(number).toLocaleString("en-AU", options);
};

export const formatBytes = (bytes: number, decimals = 2): string => {
  if (bytes === 0) return "0 Bytes";

  const k = 1024;
  const dm = decimals < 0 ? 0 : decimals;
  const sizes = ["Bytes", "KB", "MB", "GB", "TB", "PB", "EB", "ZB", "YB"];

  const i = Math.floor(Math.log(bytes) / Math.log(k));

  return parseFloat((bytes / Math.pow(k, i)).toFixed(dm)) + " " + sizes[i];
};
