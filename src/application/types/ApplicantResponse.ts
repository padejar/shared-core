import {
  ApplicantRequest,
  applicantRequestDefaultValue,
} from "./ApplicantRequest";

export interface ApplicantResponse extends ApplicantRequest {
  id?: string;
  state: boolean;
  applicationId?: string;
  createdAt?: Date;
  updatedAt?: Date;
}

export const applicantResponseDefaultValue: ApplicantResponse = {
  ...applicantRequestDefaultValue,
  id: "",
  state: false,
  applicationId: "",
};
