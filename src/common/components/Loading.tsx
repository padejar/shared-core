import React from "react";
import "./Loading.scss";

type LoadingProps = {
  text?: string;
  testId?: string;
};
const Loading: React.FunctionComponent<LoadingProps> = ({
  text = "Loading",
  testId = "loadingComponent",
}: LoadingProps) => {
  return (
    <div className="loading-overlay" data-testid={testId}>
      <div className="overlay-text">{text}</div>
    </div>
  );
};

export default Loading;
