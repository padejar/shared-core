import { PERMISSION_ACCESS_TYPES } from "../../common/constants/permissionAccessTypes";

export interface ResetPasswordRequest {
  email: string;
  source: string;
}

export const resetPasswordDefaultValue: ResetPasswordRequest = {
  email: "",
  source: PERMISSION_ACCESS_TYPES.INTRODUCER_PORTAL,
};
