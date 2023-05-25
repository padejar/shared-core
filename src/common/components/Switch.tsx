import "./Switch.scss";
import React from "react";

type SwitchProps = {
  className?: string;
  id?: string;
  name: string;
  label: string;
  checked: boolean;
  onChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  disabled?: boolean;
  testId?: string;
};

const Switch: React.FunctionComponent<SwitchProps> = ({
  className,
  id,
  name,
  label,
  checked,
  onChange,
  disabled,
  testId,
}: SwitchProps) => {
  const inputId = id ? id : name;
  return (
    <div className={`switch${className ? ` ${className}` : ""}`}>
      <input
        disabled={disabled}
        className="switch-input"
        type="checkbox"
        name={name}
        id={inputId}
        checked={checked}
        onChange={onChange}
        value={1}
        data-testid={testId}
      />{" "}
      <label htmlFor={inputId} data-testid={`${testId}-label`}>
        {label}
      </label>
    </div>
  );
};

export default Switch;
