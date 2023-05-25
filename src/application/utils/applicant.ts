import { DEFAULT_DATE_INPUT_FORMAT } from "../../common/constants/date";
import { dateFormat, parseDateForServer } from "../../common/utils/date";
import { extractProperties, propertyCheck } from "../../common/utils/object";
import { numberToString } from "../../common/utils/string";
import {
  applicantFormDefaultValue,
  ApplicantForm,
} from "../types/ApplicantForm";
import {
  ApplicantRequest,
  applicantRequestDefaultValue,
} from "../types/ApplicantRequest";
import { ApplicantResponse } from "../types/ApplicantResponse";

export const transformToApplicantForm = (
  applicantResponse: ApplicantResponse
): ApplicantForm => {
  const extractedApplicantResponse = extractProperties<ApplicantResponse>(
    applicantResponse,
    Object.keys(applicantRequestDefaultValue)
  ) as ApplicantRequest;
  let newApplicantForm = applicantFormDefaultValue;

  for (const field in applicantResponse) {
    if (propertyCheck(newApplicantForm, field as keyof ApplicantForm)) {
      let value = extractedApplicantResponse[field as keyof ApplicantRequest];
      if (value === null) value = "";
      if (typeof value === "number") {
        value = typeof value !== "undefined" ? numberToString(value) : "";
      }
      newApplicantForm = {
        ...newApplicantForm,
        [field]: value,
      };
    }
  }

  let abnRegisteredDate = "";
  if (extractedApplicantResponse.abnRegisteredDate) {
    abnRegisteredDate = dateFormat(
      new Date(extractedApplicantResponse.abnRegisteredDate),
      DEFAULT_DATE_INPUT_FORMAT
    );
  }
  let gstRegisteredDate = "";
  if (extractedApplicantResponse.gstRegisteredDate) {
    gstRegisteredDate = dateFormat(
      new Date(extractedApplicantResponse.gstRegisteredDate),
      DEFAULT_DATE_INPUT_FORMAT
    );
  }

  return {
    ...newApplicantForm,
    abnRegisteredDate,
    gstRegisteredDate,
  };
};

export const transformToApplicantRequest = (
  applicantForm: ApplicantForm,
  isDraft: boolean
): ApplicantRequest => {
  let applicantRequest = applicantRequestDefaultValue;
  for (const field in applicantForm) {
    if (propertyCheck(applicantRequest, field as keyof ApplicantRequest)) {
      let requestValue = applicantRequest[field as keyof ApplicantRequest];
      const formValue = applicantForm[field as keyof ApplicantForm];
      if (formValue === "") requestValue = null;
      else requestValue = formValue;
      applicantRequest = {
        ...applicantRequest,
        [field]: requestValue,
      };
    }
  }

  return {
    ...applicantRequest,
    abnRegisteredDate: applicantForm.abnRegisteredDate
      ? parseDateForServer(applicantForm.abnRegisteredDate)
      : null,
    gstRegisteredDate: applicantForm.gstRegisteredDate
      ? parseDateForServer(applicantForm.gstRegisteredDate)
      : null,
    isDraft,
  };
};
