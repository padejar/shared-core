import ApplicantTab from "../components/ApplicationDetails/ApplicantTab/ApplicantTab";
import ContractsTab from "../components/ApplicationDetails/ContractsTab/ContractsTab";
import GuarantorsTab from "../components/ApplicationDetails/GuarantorsTab/GuarantorsTab";
import NotesTab from "../components/ApplicationDetails/NotesTab/NotesTab";
import QuoteTab from "../components/ApplicationDetails/QuoteTab/QuoteTab";
import SecurityTab from "../components/ApplicationDetails/SecurityTab/SecurityTab";
import { ApplicationTabRoute } from "../types/ApplicationForm";

const routes: ApplicationTabRoute[] = [
  {
    path: "/application/applications/:applicationId/quotes",
    component: QuoteTab,
    exact: true,
  },
  {
    path: "/application/applications/:applicationId/guarantors",
    component: GuarantorsTab,
    exact: true,
  },
  {
    path: "/application/applications/:applicationId/security",
    component: SecurityTab,
    exact: true,
  },
  {
    path: "/application/applications/:applicationId/applicant",
    component: ApplicantTab,
    exact: true,
  },
  {
    path: "/application/applications/:applicationId/notes",
    component: NotesTab,
    exact: true,
  },
  {
    path: "/application/applications/:applicationId/contracts",
    component: ContractsTab,
    exact: true,
  },
];

export default routes;
