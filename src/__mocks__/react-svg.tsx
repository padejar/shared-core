import React, { ReactElement } from "react";

const ReactSVG = (props: typeof Image): ReactElement => (
  <img alt="mock-react-svg" {...props} />
);
const actualModule = jest.createMockFromModule("react-svg");

export { ReactSVG };
export default actualModule;
