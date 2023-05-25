export interface ChangePassword {
  oldPassword: string;
  newPassword: string;
  newPasswordConfirm: string;
}

export const changePasswordDefaultValue: ChangePassword = {
  oldPassword: "",
  newPassword: "",
  newPasswordConfirm: "",
};

export interface PasswordRequirements {
  minChar: boolean;
  lowercaseChar: boolean;
  uppercaseChar: boolean;
  numericChar: boolean;
  specialChar: boolean;
  result: boolean;
}
