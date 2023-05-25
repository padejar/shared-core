import { AxiosError } from "axios";
import { errorBlackList as applicationErrorBlackList } from "../application";
import { errorBlackList as authErrorBlackList } from "../auth/utils/errors";
import {
  errorBlackList as commonErrorBlackList,
  errorWhiteList as commonErrorWhiteList,
} from "../common/utils/errors";

const errorBlackList: { (error: AxiosError): boolean }[] = [
  ...applicationErrorBlackList,
  ...authErrorBlackList,
  ...commonErrorBlackList,
];
const errorWhiteList: { (error: AxiosError): boolean }[] = [
  ...commonErrorWhiteList,
];

export { errorBlackList, errorWhiteList };
