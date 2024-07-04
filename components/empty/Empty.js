import { Typography } from "@mui/material";
import React from "react";
import styles from "./Empty.module.scss";
const Empty = (props) => {
  const { icon, info = "", desc = "" } = props;
  return (
    <div className={styles.empty}>
      {icon}
      <Typography className={styles.info}>{info}</Typography>
      <Typography className={styles.desc}>{desc} </Typography>
    </div>
  );
};

export default Empty;
