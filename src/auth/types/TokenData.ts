import { UserData } from "./UserData";

export interface TokenData {
  data: UserData;
  exp: number;
  iat: number;
}
