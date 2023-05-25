import React from "react";
import { RouteComponentProps } from "react-router-dom";

import ApplicationDetails from "../components/ApplicationDetails/";
import { APPLICATION_STEPS } from "../constants/applicationSteps";

type ApplicationDetailsPageProps = RouteComponentProps<{
  applicationId?: string;
  tabName?: APPLICATION_STEPS;
}>;

const ApplicationDetailsPage: React.FunctionComponent<RouteComponentProps> = ({
  match,
}: ApplicationDetailsPageProps) => {
  const { applicationId, tabName } = match.params;

  return <ApplicationDetails applicationId={applicationId} tabName={tabName} />;
};

export default ApplicationDetailsPage;
