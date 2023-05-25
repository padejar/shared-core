import { PERMISSION_ACCESS_TYPES } from "../../common/constants/permissionAccessTypes";

export interface AuthenticateRequest {
  email: string;
  password: string;
  source: PERMISSION_ACCESS_TYPES;
}
