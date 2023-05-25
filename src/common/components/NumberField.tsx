import React from "react";
import NumberFormat, { NumberFormatProps } from "react-number-format";
import {
  DECIMAL_SEPARATOR,
  THOUSANDS_SEPARATOR,
} from "../constants/numberFormat";

export enum FIELD_TYPE {
  NUMBER = "number",
  CURRENCY = "currency",
  PERCENTAGE = "percentage",
}

export enum TEXT_ALIGN {
  LEFT = "left",
  CENTER = "center",
  RIGHT = "right",
}

type NumberFieldProps = NumberFormatProps & {
  fieldType?: FIELD_TYPE;
  textAlign?: TEXT_ALIGN;
};

export const NumberField: React.FunctionComponent<NumberFieldProps> = ({
  className = "",
  fieldType = FIELD_TYPE.NUMBER,
  textAlign = TEXT_ALIGN.LEFT,
  ...rest
}: NumberFieldProps) => {
  return (
    <div className={`quest-number-input ${fieldType} ${className}`}>
      <NumberFormat
        autoComplete="off"
        className={`form-control text-${textAlign}`}
        type="tel"
        displayType="input"
        allowNegative={false}
        thousandSeparator={THOUSANDS_SEPARATOR}
        decimalSeparator={DECIMAL_SEPARATOR}
        decimalScale={2}
        {...rest}
      />
    </div>
  );
};
