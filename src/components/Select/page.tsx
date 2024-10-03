"use client";

import React, { useState } from "react";
import style from "./select.module.scss";

interface SelectProps {
  label?: string;
  type: "form" | "filter";
  placeholder?: string;
  options: { value: string; label: string }[];
  onChange: (value: string) => void;
}

const Select: React.FC<SelectProps> = ({ label, options, onChange, placeholder, type }) => {
  const [selectedValue, setSelectedValue] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    setSelectedValue(value);
    onChange(value);
  };

  return (
    <div className={`${style[type + '-select']} ${style.formSelect}`}>
      {label && <label className={style.selectLabel} htmlFor="select">{label}</label>}

      <select 
        value={selectedValue} 
        onChange={handleChange} 
        className={style.selectSelect}
      >
        <option hidden value="empty">{placeholder}</option>

        {options.map((option) => (
          <option className={style.selectOptions} key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  );
};

export default Select;
