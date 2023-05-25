import { SingleResponse } from "../../common/types/SingleResponse";

export interface UploadChannelEmittedData<T> {
  progress?: number;
  result?: SingleResponse<T>;
  error?: Error;
}
