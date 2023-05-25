export interface UpdatePasswordForm {
  newPassword: string;
  confirmPassword: string;
}

export const updatePasswordDefaultValue: UpdatePasswordForm = {
  newPassword: "",
  confirmPassword: "",
};
