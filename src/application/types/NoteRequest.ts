export interface NoteRequest {
  isDraft?: boolean;
  supportingNotes: string;
  hasForeseeableFinancialChange: boolean | null;
  hasBrokerConsent: boolean;
  hasApplicantConsent: boolean;
}

export const noteRequestDefaultValue: NoteRequest = {
  isDraft: true,
  supportingNotes: "",
  hasForeseeableFinancialChange: false,
  hasBrokerConsent: false,
  hasApplicantConsent: false,
};
