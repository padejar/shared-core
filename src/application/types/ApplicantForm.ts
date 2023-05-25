import { Address, addressDefaultValue } from "../../address-autocomplete";
import { ENTITY_TYPES } from "../../common/constants/entityTypes";
import { TRUSTEE_TYPES } from "../constants/trusteeTypes";

export interface ApplicantForm extends Address {
  abn: string;
  entityName: string;
  tradingName: string;
  entityType: ENTITY_TYPES | string;
  trusteeType: TRUSTEE_TYPES | string;
  trusteeName: string;
  trusteeAcn: string;
  abnRegisteredDate: string;
  gstRegisteredDate: string;
  phone: string;
  industry: string;
  industryType: string;
}

export const applicantFormDefaultValue: ApplicantForm = {
  ...addressDefaultValue,
  abn: "",
  entityName: "",
  tradingName: "",
  entityType: "",
  trusteeType: "",
  trusteeName: "",
  trusteeAcn: "",
  abnRegisteredDate: "",
  gstRegisteredDate: "",
  phone: "",
  industry: "",
  industryType: "",
};
