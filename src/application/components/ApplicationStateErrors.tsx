import React from "react";
import { APPLICATION_STEPS } from "../constants/applicationSteps";
import { ApplicationSteps } from "../types/ApplicationStep";
type ApplicationStateErrorsProps = {
  applicationSteps: ApplicationSteps;
};

const ApplicationStateErrors: React.FunctionComponent<ApplicationStateErrorsProps> = ({
  applicationSteps,
}: ApplicationStateErrorsProps) => {
  return (
    <div className="alert alert-danger">
      <p>
        Please complete the following step(s) before submitting the application:
      </p>
      <ul>
        {Object.keys(applicationSteps).map((step, index) => {
          const applicationStep =
            applicationSteps[step as keyof ApplicationSteps];
          return (
            applicationStep.stepSlug !== APPLICATION_STEPS.contracts &&
            !applicationStep.isStepDone && (
              <li key={index}>{applicationStep.stepName}</li>
            )
          );
        })}
      </ul>
    </div>
  );
};

export default ApplicationStateErrors;
