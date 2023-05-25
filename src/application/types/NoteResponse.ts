import { NoteRequest, noteRequestDefaultValue } from "./NoteRequest";

export interface NoteResponse extends NoteRequest {
  id?: string;
  applicationId?: string;
  state?: boolean;
}

export const noteResponseDefaultValue: NoteResponse = {
  ...noteRequestDefaultValue,
  state: false,
};
