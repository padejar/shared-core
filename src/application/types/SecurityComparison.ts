export interface SecurityComparison {
  showAlert: boolean;
  fieldLabel: string;
  quoteFieldLabel: string;
  field: string;
  initialValue: string;
}

export const securityComparisonDefaultValue: SecurityComparison = {
  showAlert: false,
  fieldLabel: "",
  quoteFieldLabel: "",
  field: "",
  initialValue: "",
};
