export interface ApproverResponse {
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
}

export const approverDefaultValue: ApproverResponse = {
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
};
