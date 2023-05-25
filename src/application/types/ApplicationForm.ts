import { QuoteFormSave, quoteFormSaveDefaultValue } from "./QuoteFormSave";

export interface ApplicationForm {
  name: string;
  quote: QuoteFormSave;
}

export const applicationFormfaultValue: ApplicationForm = {
  name: "",
  quote: quoteFormSaveDefaultValue,
};

export interface ApplicationTabProps {
  applicationId?: string;
  pageAfterSave: string;
}

export type ApplicationTabRoute = {
  path: string | string[];
  name?: string;
  exact?: boolean;
  component: React.FunctionComponent<ApplicationTabProps>;
};
