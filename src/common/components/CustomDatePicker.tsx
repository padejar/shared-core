import React, { useRef } from "react";
import ReactDatePicker, { ReactDatePickerProps } from "react-datepicker";
import "react-datepicker/dist/react-datepicker.css";
import "./CustomDatePicker.scss";

const CustomDatePicker: React.FunctionComponent<ReactDatePickerProps> = (
  props: ReactDatePickerProps
) => {
  const ref = useRef<HTMLInputElement>(null);
  const CustomInput = React.forwardRef<HTMLInputElement>((props, _ref) => (
    <input {...props} ref={_ref} />
  ));
  CustomInput.displayName = "CustomInput";
  return <ReactDatePicker {...props} customInput={<CustomInput ref={ref} />} />;
};

export default CustomDatePicker;
