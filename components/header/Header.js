import React from "react";
import styles from "./Header.module.scss";
import { Typography } from "@mui/material";
const Header = ({ title, padding }) => {
  return (
    <div style={{ padding: padding }}>
      <Typography className={styles.header} variant="h6">
        {title}
      </Typography>
    </div>
  );
};

export default Header;
