import { Address, addressDefaultValue } from "../../address-autocomplete";
import { ENTITY_TYPES } from "../../common/constants/entityTypes";
import { TRUSTEE_TYPES } from "../constants/trusteeTypes";

export interface ApplicantRequest extends Address {
  isDraft?: boolean;
  abn: string | null;
  entityName: string | null;
  tradingName: string | null;
  entityType: ENTITY_TYPES | string;
  trusteeType: TRUSTEE_TYPES | null;
  trusteeName: string | null;
  trusteeAcn: string | null;
  abnRegisteredDate: string | null;
  gstRegisteredDate: string | null;
  yearGst?: string | null;
  yearEstablished?: string | null;
  phone: string;
  industry: string;
  industryType: string;
}

export const applicantRequestDefaultValue: ApplicantRequest = {
  ...addressDefaultValue,
  abn: "",
  entityName: "",
  tradingName: "",
  entityType: "",
  trusteeType: null,
  trusteeName: null,
  trusteeAcn: null,
  abnRegisteredDate: null,
  gstRegisteredDate: null,
  phone: "",
  industry: "",
  industryType: "",
};
