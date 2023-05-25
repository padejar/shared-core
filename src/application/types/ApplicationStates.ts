export interface ApplicationStates extends Record<string, boolean> {
  quote: boolean;
  applicant: boolean;
  guarantors: boolean;
  security: boolean;
  notes: boolean;
}
