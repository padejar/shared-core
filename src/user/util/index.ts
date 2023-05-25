import { PASSWORD_LENGTH } from "../constants/user";
import { PasswordRequirements } from "../types/ChangePassword";

export const validatePassord: (
  password: string,
  length?: number
) => PasswordRequirements = (password = "", minLength = PASSWORD_LENGTH) => {
  const reqs: Partial<PasswordRequirements> = {
    minChar: password.length >= minLength,
    lowercaseChar: /[a-z]/.test(password),
    uppercaseChar: /[A-Z]/.test(password),
    numericChar: /[0-9]/.test(password),
    specialChar: /(?=.*?[~`!@#$%^&*()\-_+={}[\]:;"'|\\<,>.?/])/.test(password),
  };

  return {
    ...reqs,
    result: !Object.values(reqs).some((result) => !result),
  } as PasswordRequirements;
};
