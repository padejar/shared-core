export interface RequiredDocuments {
  supportingInfo: string;
  bankStatementRequired: boolean;
  bankStatementLink: string;
}

export const requiredDocumentsDefaultValue: RequiredDocuments = {
  supportingInfo: "",
  bankStatementRequired: false,
  bankStatementLink: "",
};
