import React from "react";
import styles from "./BillsCard.module.scss";
import { Typography } from "@mui/material";
import { CircleRounded } from "@mui/icons-material";
const BillsCard = (props) => {
  const { order, onClick } = props;
  return (
    <div className={styles.BillsCard} onClick={() => onClick(order)}>
      <div className={styles.details}>
        <div className={styles.status}>
          <Typography
            className={styles.orderNo}
          >{`Order #${order.order_id}`}</Typography>
          <Typography className={styles.active}>
            <CircleRounded
              sx={{
                fontSize: "0.6rem",
                color: order?.status == "active" ? "#FFD049" : "#008000",
              }}
            />
            {order?.status == "active" ? "Active" : "Paid"}
          </Typography>
        </div>
        <Typography className={styles.orderNo}>
          ₹ {order.total_amount}
        </Typography>
      </div>{" "}
      <div className={styles.tableDets}>
        <Typography className={styles.table}>
          Table {order?.table_number}
        </Typography>
        <CircleRounded sx={{ fontSize: "0.6rem", color: "#D9D9D9" }} />
        <Typography className={styles.table}>
          {order?.total_customers} Guests
        </Typography>
      </div>
    </div>
  );
};

export default BillsCard;
