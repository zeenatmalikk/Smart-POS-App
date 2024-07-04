import React from "react";
import {
  Box,
  Card,
  CardActionArea,
  CardContent,
  Typography,
} from "@mui/material";
import styles from "./CustomChip.module.scss";
const CustomChip = ({ name, price, item, onClick }) => {
  return (
    <Card className={styles.orderChip} onClick={() => onClick(item)}>
      <CardActionArea>
        <Typography className={styles.foodItem}>{name}</Typography>
        <Typography className={styles.price}>{price}</Typography>
      </CardActionArea>
    </Card>
  );
};

export default CustomChip;
