import React from "react";
import styles from "./Sidebar.module.scss";
import { Grid, Typography } from "@mui/material";
import Image from "next/image";
import Link from "next/link";
const Sidebar = ({
  children,
  title,
  subtitle,
  actionText,
  linkText,
  navigateLink,
}) => {
  return (
    <Grid container className={styles.sidebarContainer}>
      <Grid item md={6} sm={6} className={styles.sidebar}>
        <img
          className={styles.sideImage}
          src="/images/food.png"
          alt="food"
          priority
        />
        <Typography variant="h6" className={styles.tagLine}>
          Effortless order processing <br></br>and seamless transactions.
        </Typography>
      </Grid>
      <Grid item md={6} sm={6} className={styles.authForm}>
        <div className={styles.formHead}>
          <Typography variant="h5" className={styles.formTitle}>
            {title}
          </Typography>
          <Typography variant="body1" className={styles.formSub}>
            {subtitle}
          </Typography>
          {children}
          <Typography
            variant="body1"
            className={styles.action}
            textAlign={"center"}
          >
            {actionText}
            <Link href={navigateLink} className={styles.link}>
              {" "}
              {linkText}
            </Link>
          </Typography>
        </div>
      </Grid>
    </Grid>
  );
};

export default Sidebar;
