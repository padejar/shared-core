export interface UserData {
  id: number;
  clientId: number | null;
  firstName: string;
  lastName: string;
  email: string;
  mobile: string;
  ipAddress: string;
  permissions: string[];
  childrenIds: number[];
  lendingAdvisor: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  } | null;
  bdm: {
    firstName: string;
    lastName: string;
    email: string;
    mobile: string;
  } | null;
}

export const userDataDefaultValue: UserData = {
  id: 0,
  clientId: null,
  firstName: "",
  lastName: "",
  email: "",
  mobile: "",
  ipAddress: "",
  permissions: [],
  childrenIds: [],
  lendingAdvisor: null,
  bdm: null,
};
