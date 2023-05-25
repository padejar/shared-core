import differenceInCalendarYears from "date-fns/differenceInCalendarYears";
import dateFnsFormat from "date-fns/format";
import dateFnsParse from "date-fns/parse";
import {
  DATE_STRING_LENGTH,
  DATE_YEAR_STRING_LENGTH,
  DEFAULT_DATE_INPUT_FORMAT,
} from "../constants/date";
import { parseNumber } from "./number";

export const dateFormat = (date: Date, format: string): string => {
  return dateFnsFormat(date, format);
};

export const stringToDate = (
  dateString: string,
  format = DEFAULT_DATE_INPUT_FORMAT
): Date => {
  return dateFnsParse(dateString, format, new Date());
};

export const validateDateOfBirthInput = (value: string): boolean => {
  if (value) {
    const split = value.split("/");
    const day = split[0].trim();
    const month = split[1].trim();
    const year = split[2].trim();

    if (day && day.length === DATE_STRING_LENGTH) {
      const dayNumber = parseNumber(day);
      if (dayNumber > 31 || dayNumber === 0) return false;
    }
    if (month && month.length === DATE_STRING_LENGTH) {
      const monthNumber = parseNumber(month);
      if (monthNumber > 12 || monthNumber === 0) return false;
    }
    if (!validateYear(year)) return false;
  }

  return true;
};

export const validateMinimumAge = (
  dateOfBirth: Date,
  minimumAge: number
): boolean => {
  const currentDate = new Date();
  const age = Math.abs(differenceInCalendarYears(currentDate, dateOfBirth));

  if (age < minimumAge) return false;

  return true;
};

export const validateMaxAge = (dateOfBirth: Date, maxAge: number): boolean => {
  const currentDate = new Date();
  const age = Math.abs(differenceInCalendarYears(currentDate, dateOfBirth));

  if (age > maxAge) return false;

  return true;
};

export const validateYear = (year: string): boolean => {
  if (year !== "" && year.length === DATE_YEAR_STRING_LENGTH) {
    const currentDate = new Date();
    const maxYear = currentDate.getFullYear();
    if (parseNumber(year) > maxYear) return false;
  }

  return true;
};

export const parseDateForServer = (date: string): string => {
  const splitDate = date.split("/");
  return `${splitDate[2]}-${splitDate[1]}-${splitDate[0]}`;
};
