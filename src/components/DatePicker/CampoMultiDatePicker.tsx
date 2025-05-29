import React from "react";
import DatePicker, { DateObject } from "react-multi-date-picker";

type CampoMultiDatePickerProps = {
  value: (string | Date | DateObject)[]; // ou ajuste conforme seu uso
  onChange: (value: DateObject[] | null) => void;
  [key: string]: any;
};

export default function CampoMultiDatePicker({
  value,
  onChange,
  ...props
}: CampoMultiDatePickerProps) {
  return (
    <DatePicker
      multiple
      value={value}
      onChange={onChange}
      format="DD/MM/YYYY"
      {...props}
    />
  );
}