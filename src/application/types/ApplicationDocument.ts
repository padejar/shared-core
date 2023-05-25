import { QuestDocument } from "../../files";
import { DOCUMENT_PURPOSES } from "../constants/documentPurposes";

export interface ApplicationDocument extends QuestDocument {
  id: string;
  applicationId: string;
  purpose: DOCUMENT_PURPOSES;
}
