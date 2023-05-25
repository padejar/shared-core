import React from "react";
import { CCol, CFormGroup, CInputRadio, CLabel, CRow } from "@coreui/react";
import { LabelValue } from "../types/LabelValue";

type RadioGroupProps = {
  fieldName: string;
  fieldValue: string | number | boolean | undefined | null;
  fieldLabel?: string;
  options: LabelValue<string | number | boolean>[];
  inline?: boolean;
  labelColSize?: number;
  optionColSize?: number;
  selectValue: (value: string | number | boolean) => void;
  disabled?: boolean;
};

const RadioGroup: React.FunctionComponent<RadioGroupProps> = ({
  fieldName,
  fieldValue,
  fieldLabel,
  options,
  selectValue,
  inline = true,
  labelColSize = 3,
  optionColSize = 4,
  disabled = false,
}: RadioGroupProps) => {
  const renderOptions = (opts: LabelValue<string | number | boolean>[]) =>
    opts.map((item, index) => (
      <CFormGroup key={index} variant="custom-radio" inline={inline}>
        <CInputRadio
          custom
          id={`${fieldName}-${item.value}`}
          name={fieldName}
          value={item.value.toString()}
          defaultChecked={fieldValue === item.value}
          onClick={() => selectValue(item.value)}
          disabled={disabled}
        />
        <CLabel
          variant="custom-checkbox"
          htmlFor={`${fieldName}-${item.value}`}
          onClick={() => selectValue(item.value)}
          disabled={disabled}
        >
          {item.label}
        </CLabel>
      </CFormGroup>
    ));

  if (!fieldLabel) {
    return <React.Fragment>{renderOptions(options)}</React.Fragment>;
  }

  return (
    <CRow className="form-group">
      <CCol md={labelColSize} tag="label" className="control-label">
        {fieldLabel}
      </CCol>
      <CCol md={optionColSize} xs={12}>
        {renderOptions(options)}
      </CCol>
    </CRow>
  );
};

export default RadioGroup;
