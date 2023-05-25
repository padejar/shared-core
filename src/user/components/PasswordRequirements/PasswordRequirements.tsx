import React from "react";
import classNames from "classnames";
import { validatePassord } from "../../util/";
import "./PasswordRequirements.scss";

type PasswordRequirementsProps = {
  password: string;
  minLength?: number;
};

const PasswordRequirements: React.FunctionComponent<PasswordRequirementsProps> = ({
  password,
  minLength,
}: PasswordRequirementsProps) => {
  const result = validatePassord(password, minLength);

  return (
    <ul className="password-reqs" data-testid="password-reqs">
      <li
        data-testid="min-char"
        className={classNames({ check: result.minChar })}
      >
        8 characters
      </li>
      <li
        data-testid="lowercase-char"
        className={classNames({ check: result.lowercaseChar })}
      >
        1 lowercase character
      </li>
      <li
        data-testid="uppercase-char"
        className={classNames({ check: result.uppercaseChar })}
      >
        1 uppercase character
      </li>
      <li
        data-testid="special-char"
        className={classNames({ check: result.specialChar })}
      >
        1 special character
      </li>
      <li
        data-testid="numeric-char"
        className={classNames({ check: result.numericChar })}
      >
        1 number
      </li>
    </ul>
  );
};

export default PasswordRequirements;
