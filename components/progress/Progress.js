'use client'
import React from "react";
import styles from "./Progress.module.scss";
import {  CircularProgress, Fade, Typography } from "@mui/material";

const Progress = ({loading}) => {
  return (
    <div
    className={styles.loggingOut}
    >
       <Fade
          in={loading}
          style={{
            transitionDelay: loading ? '800ms' : '0ms',
          }}
          unmountOnExit
        >
          <CircularProgress size={70} />
        </Fade>
      <Typography variant="h6" className={styles.title}>Logging Out</Typography>
      <Typography variant="body2" className={styles.subs}>Please wait</Typography>
    </div>
  );
};

export default Progress;
