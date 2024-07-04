import React from "react";
import styles from "./CustomButton.module.scss";
import { Button } from "@mui/material";
const CustomButton = ({ text, onClick, width, disabled,btnLoading }) => {
  return (
    <>
      <Button
        disabled={disabled}
        variant="contained"
        sx={{ width: width, opacity: btnLoading && 0.8 }}
        onClick={onClick}
        className={styles.customButton}
      >
        {text}
      </Button>
    </>
  );
};

export default CustomButton;
