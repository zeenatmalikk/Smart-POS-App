import React, { useEffect, useState } from "react";
import styles from "./LinearProgress.module.scss";
import LinearProgress from "@mui/material/LinearProgress";
import { Box, Typography } from "@mui/material";

const LinearProgressComponent = ({ progress, color, title, data }) => {
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setIsLoaded(true);
    }, 500);

    return () => clearTimeout(timer);
  }, []);
  return (
    <Box className={styles.progressContainer}>
      <Typography variant="h6" className={styles.dataHead}>
        {title}
      </Typography>
      <Typography variant="h6" className={styles.dataPoints}>
        {data}
      </Typography>
      <LinearProgress
        variant="determinate"
        value={progress}
        sx={{
          backgroundColor: "#000",
          ".MuiLinearProgress-bar": {
            borderRadius: 1,
            backgroundColor: color,
            transition: isLoaded ? "width 1s ease-in-out" : "none",
          },
        }}
      />
    </Box>
  );
};

export default LinearProgressComponent;
