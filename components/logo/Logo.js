import { Typography } from "@mui/material";
import React from "react";
import styles from "./Logo.module.scss";
const Logo = ({ font }) => {
  return (
    <div className={styles.logoContainer}>
      <Typography
        style={{ fontSize: font ? font : "2.5rem" }}
        className={styles.logo}
        variant="h5"
      >
        Smart <span>POS</span>
      </Typography>
    </div>
  );
};

export default Logo;
