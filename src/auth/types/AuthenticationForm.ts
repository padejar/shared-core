export interface AuthenticationForm {
  email: string;
  password: string;
}

export const authenticationFormDefaultValue: AuthenticationForm = {
  email: "",
  password: "",
};
