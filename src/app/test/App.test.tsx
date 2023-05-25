import React from "react";
import { render } from "@testing-library/react";
import App from "./../App";

test("renders learn react link", () => {
  window.scrollTo = jest.fn();
  render(<App />);
});
