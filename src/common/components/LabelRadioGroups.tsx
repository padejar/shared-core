import React from "react";
import { Dictionary } from "../types/Dictionary";
import { LabelValue } from "../types/LabelValue";
import "./LabelRadioGroups.scss";

type LabelRadioGroupsProps = {
  options: LabelValue<string | number | boolean>[] | Dictionary;
  handleChange: (event: React.ChangeEvent<HTMLInputElement>) => void;
  fieldName: string;
  checkedValue: string | number | boolean | null;
  disabled?: boolean;
  className?: string;
  testId?: string;
};

const LabelRadioGroups: React.FunctionComponent<LabelRadioGroupsProps> = ({
  options,
  fieldName,
  checkedValue,
  disabled = false,
  handleChange,
  className,
  testId,
}: LabelRadioGroupsProps) => {
  const renderOptions = (
    index: number,
    value: string | number | boolean,
    label: string
  ) => (
    <div className="quest-label-radio-container" key={index}>
      <input
        onChange={handleChange}
        type="radio"
        name={fieldName}
        id={`${fieldName}-${index}`}
        value={value.toString()}
        checked={checkedValue === value}
        disabled={disabled}
        data-testid={`${testId}-${value}`}
      />
      <label
        className={`${disabled ? "disabled" : ""}`}
        htmlFor={`${fieldName}-${index}`}
        data-testid={`${testId}-${value}-label`}
      >
        {label}
      </label>
    </div>
  );

  return (
    <div className={`quest-label-radio-groups ${className ?? ""}`}>
      {Array.isArray(options)
        ? options.map((item, index) =>
            renderOptions(index, item.value, item.label)
          )
        : Object.keys(options).map((item, index) => {
            return renderOptions(index, item, options[item] as string);
          })}
    </div>
  );
};

export default LabelRadioGroups;
