import { SingleResponse } from "../../common/types/SingleResponse";
import { ApplicationDocument } from "./ApplicationDocument";

export interface UploadChannelEmittedData {
  progress?: number;
  result?: SingleResponse<ApplicationDocument>;
  error?: Error;
}
