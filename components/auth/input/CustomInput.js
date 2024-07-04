import React from "react";
import styles from "./CustomInput.module.scss";
import { Input } from "@mui/material";
const CustomInput = ({
  placeholder,
  value,
  endAdornment,
  startAdornment,
  onChange,
  inputName,
  height,
  type,
  disabled
}) => {
  return (
    <div style={{ width: "100%" }}>
      <Input
        placeholder={placeholder}
        endAdornment={endAdornment}
        startAdornment={startAdornment}
        value={value}
        type={type}
        onChange={onChange}
        fullWidth
        disableUnderline
        className={styles.customInput}
        disabled={disabled}
        name={inputName}
        sx={{ height: height && `${height} !important` }}
      />
    </div>
  );
};

export default CustomInput;
