import React from "react";
import styles from "./Loading.module.scss";
import Logo from "../logo/Logo";
import { CircularProgress } from "@mui/material";
const Loading = () => {
  return (
    <div className={styles.Loading}>
      <Logo />
      <CircularProgress />
    </div>
  );
};

export default Loading;
