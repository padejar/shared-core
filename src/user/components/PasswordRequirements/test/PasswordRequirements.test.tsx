import React from "react";
import { render } from "@testing-library/react";
import PasswordRequirements from "../PasswordRequirements";

describe("PasswordRequirements component", () => {
  it("Renders default state.", async () => {
    const { getByTestId } = render(<PasswordRequirements password="" />);

    const minChar = getByTestId("min-char");
    const lowercaseChar = getByTestId("lowercase-char");
    const uppercaseChar = getByTestId("uppercase-char");
    const specialChar = getByTestId("special-char");
    const numericChar = getByTestId("numeric-char");

    expect(minChar).not.toHaveClass("check");
    expect(lowercaseChar).not.toHaveClass("check");
    expect(uppercaseChar).not.toHaveClass("check");
    expect(specialChar).not.toHaveClass("check");
    expect(numericChar).not.toHaveClass("check");
  });

  it("Shows unfulfilled requirements.", async () => {
    const { getByTestId } = render(<PasswordRequirements password=" " />);

    const minChar = getByTestId("min-char");
    const lowercaseChar = getByTestId("lowercase-char");
    const uppercaseChar = getByTestId("uppercase-char");
    const specialChar = getByTestId("special-char");
    const numericChar = getByTestId("numeric-char");

    expect(minChar).not.toHaveClass("check");
    expect(lowercaseChar).not.toHaveClass("check");
    expect(uppercaseChar).not.toHaveClass("check");
    expect(specialChar).not.toHaveClass("check");
    expect(numericChar).not.toHaveClass("check");
  });

  it("Shows fulfilled requirements wth default min length.", async () => {
    const { getByTestId } = render(
      <PasswordRequirements password="!1Ab1234" />
    );

    const minChar = getByTestId("min-char");
    const lowercaseChar = getByTestId("lowercase-char");
    const uppercaseChar = getByTestId("uppercase-char");
    const specialChar = getByTestId("special-char");
    const numericChar = getByTestId("numeric-char");

    expect(minChar).toHaveClass("check");
    expect(lowercaseChar).toHaveClass("check");
    expect(uppercaseChar).toHaveClass("check");
    expect(specialChar).toHaveClass("check");
    expect(numericChar).toHaveClass("check");
  });

  it("Shows fulfilled requirements with custom min length.", async () => {
    const { getByTestId } = render(
      <PasswordRequirements password="!1Ab123456" minLength={10} />
    );

    const minChar = getByTestId("min-char");
    const lowercaseChar = getByTestId("lowercase-char");
    const uppercaseChar = getByTestId("uppercase-char");
    const specialChar = getByTestId("special-char");
    const numericChar = getByTestId("numeric-char");

    expect(minChar).toHaveClass("check");
    expect(lowercaseChar).toHaveClass("check");
    expect(uppercaseChar).toHaveClass("check");
    expect(specialChar).toHaveClass("check");
    expect(numericChar).toHaveClass("check");
  });
});
