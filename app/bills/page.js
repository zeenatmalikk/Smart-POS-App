"use client";
import React, { useState, useEffect } from "react";
import styles from "./bills.module.scss";
import {
  Box,
  Divider,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Modal,
  Radio,
  RadioGroup,
  Typography,
  Button,
} from "@mui/material";
import { useSelector } from "react-redux";
import BillsCard from "@/components/billsCard/BillsCard";
import { supabase } from "../../supabase/supabase";
import Loading from "@/components/loading/Loading";
import Script from "next/script";
import Razorpay from "razorpay";
import { Receipt } from "@mui/icons-material";
import Empty from "@/components/empty/Empty";

const PAYMENT_STATUS_COMPLETED = "completed";
const PAYMENT_STATUS_ACTIVE = "active";

const Bills = () => {
  const [paymentModal, setPaymentModal] = useState(false);
  const [paymentValue, setValue] = useState("UPI");
  const [paymentDone, setPaymentStatus] = useState(false);
  const { user } = useSelector((state) => state.auth);
  const [loading, setLoading] = useState(false);
  const [orders, setOrders] = useState([]);
  const [selectedOrder, setSelectedOrder] = useState(undefined);
  const [orderItems, setOrderItems] = useState([]);

  const getAllOrders = async () => {
    setLoading(true);
    try {
      let { data: orders, error } = await supabase
        .from("orders")
        .select("*")
        .eq("waiter_id", user.id);
      const activeOrders = orders.filter((order) => order.status === "active");
      const otherOrders = orders.filter((order) => order.status !== "active");

      const orderedOrders = [...activeOrders, ...otherOrders];

      setOrders(orderedOrders);
      setSelectedOrder(activeOrders.length > 0 ? activeOrders[0] : orders[0]);
    } catch (err) {
      console.log("err", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (user) {
      getAllOrders();
    }
  }, [user]);

  const updateOrder = async () => {
    const { data, error } = await supabase
      .from("orders")
      .update({ status: "completed" })
      .eq("order_id", selectedOrder.order_id)
      .select();
    console.log(data, "updatedorder");
    setPaymentModal(false);
    getAllOrders();
  };

  const getOrderDetails = async () => {
    try {
      let { data: order_items, error } = await supabase
        .from("order_items")
        .select(
          `
            quantity,
            food_item (
              name,
              price,
              image_url
            )
      `
        )
        .eq("order_id", selectedOrder.order_id);

      setOrderItems(order_items);
      setLoading(false);
    } catch (err) {
      setLoading(false);
      console.log("err", err);
    }
  };

  useEffect(() => {
    if (selectedOrder) {
      getOrderDetails();
    }
  }, [selectedOrder]);

  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    boxShadow: 24,
    p: 4,
    borderRadius: 5,
  };
  const createOrderId = async () => {
    try {
      const response = await fetch("/api/order", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          amount: selectedOrder.total_amount * 100,
          currency: "INR",
        }),
      });

      if (!response.ok) {
        throw new Error("Network response was not ok");
      }

      const data = await response.json();
      return data.orderId;
    } catch (error) {
      console.error("There was a problem with your fetch operation:", error);
    }
  };
  const handlePayment = () => {
    setPaymentModal(true);
  };
  const handleUpiPayment = async () => {
    try {
      const orderId = await createOrderId();

      const options = {
        key: process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID,
        amount: selectedOrder?.total_amount * 100,
        currency: "INR",
        name: "Smart POS",
        description: "Test Transaction",
        image: "/images/pos.png",
        order_id: orderId,
        handler: function (response) {
          // Handle successful payment here
          console.log(response, "razorpay response");
          if (response?.razorpay_order_id) {
            setPaymentModal(false);
            updateOrder();
          }
        },
        prefill: {
          name: selectedOrder.customer_name,
          email: "your.email@example.com",
          contact: "",
        },
        notes: {
          address: "Razorpay Corporate Office",
        },
        theme: {
          color: "#ffca40",
        },
        method: {
          card: false, // Disable card payments
          upi: true, // Enable UPI
          netbanking: true, // Enable netbanking
          wallet: true, // Enable wallets
          emi: true, // Enable EMI
        },
      };

      // Ensure Razorpay is available globally
      if (window.Razorpay) {
        const rzp1 = new window.Razorpay(options);
        rzp1.open();
      } else {
        console.error("Razorpay SDK is not loaded.");
      }
    } catch (error) {
      console.error("Error handling payment:", error);
    }
  };
  const handlePaymentMethod = () => {
    console.log(paymentValue, "value");
    switch (paymentValue) {
      case "UPI":
        //upi logic
        handleUpiPayment();
        break;
      case "Cash":
        updateOrder();
        setPaymentModal(false);

        break;
      default:
        break;
    }
  };
  const handleChange = (eve) => {
    setValue(eve.target.value);
  };
  useEffect(() => {
    console.log(paymentValue, "value");
  }, [paymentValue]);
  const onOrderClickHandle = (order) => {
    setSelectedOrder(order);
  };

  return (
    <>
      <Script
        id="razorpay-checkout-js"
        src="https://checkout.razorpay.com/v1/checkout.js"
      />
      {loading ? (
        <Loading />
      ) : orderItems.length > 0 ? (
        <div className={styles.bills}>
          {selectedOrder && (
            <Grid container>
              <Grid item md={6}>
                <Typography className={styles.billsHead}>Bills</Typography>
                {orders.map((order, index) => (
                  <BillsCard
                    key={index}
                    order={order}
                    onClick={onOrderClickHandle}
                  />
                ))}
              </Grid>
              <Grid item md={5} className={styles.details}>
                <div className={styles.header}>
                  <Typography className={styles.orderNo}>
                    Order #{selectedOrder.order_id}
                  </Typography>
                  <div
                    className={
                      selectedOrder.status == "completed"
                        ? styles.completed
                        : styles.active
                    }
                  >
                    {selectedOrder.status == "completed" ? "Paid" : "Active"}
                  </div>
                </div>
                <Divider />
                <div className={styles.detailsContainer}>
                  <Typography variant="body2" className={styles.head}>
                    Details
                  </Typography>
                  <div className={styles.customerDets}>
                    <div>
                      <Typography className={styles.title}>
                        Table Number:{" "}
                        <span className={styles.sub}>
                          {selectedOrder?.table_number}
                        </span>{" "}
                      </Typography>
                    </div>

                    <div>
                      <Typography className={styles.title}>
                        Total Customer :{" "}
                        <span className={styles.sub}>
                          {selectedOrder.total_customers}
                        </span>
                      </Typography>
                    </div>
                    <div>
                      <Typography className={styles.title}>
                        Total Amount :{" "}
                        <span className={styles.sub}>
                          ₹ {selectedOrder.total_amount}
                        </span>
                      </Typography>
                    </div>
                  </div>
                  <div className={styles.orderInfo}>
                    <Typography className={styles.head}>Order Info</Typography>
                    <div className={styles.orderTable}>
                      <Typography className={styles.subs}>Item</Typography>
                      <Typography className={styles.subs}>Price</Typography>
                    </div>

                    <div className={styles.scrollable}>
                      {orderItems.map((item, index) => (
                        <Grid
                          container
                          className={styles.orderCard}
                          key={index}
                        >
                          <Grid item md={7} className={styles.nameContainer}>
                            <div className={styles.imgContainer}>
                              <img src={item.food_item.image_url} />
                            </div>
                            <Typography className={styles.foodItem}>
                              {" "}
                              {item.quantity} x {item.food_item.name}
                            </Typography>
                          </Grid>
                          <Grid item md={5} className={styles.price}>
                            ₹ {item.quantity * item.food_item.price}
                          </Grid>
                        </Grid>
                      ))}
                    </div>
                  </div>
                  <div className={styles.bottomBar}>
                    <div className={styles.grandtotal}>
                      <Typography className={styles.total}>Total</Typography>
                      <Typography className={styles.total}>
                        ₹ {selectedOrder.total_amount}
                      </Typography>
                    </div>
                    <Button
                      className={
                        selectedOrder.status == "completed"
                          ? styles.paidBtn
                          : styles.chargeBtn
                      }
                      onClick={handlePayment}
                    >
                      {selectedOrder.status == "completed"
                        ? `Successfully Paid ₹ ${selectedOrder?.total_amount}`
                        : `Charge customer ₹ ${selectedOrder?.total_amount}`}
                    </Button>
                  </div>
                </div>
              </Grid>
            </Grid>
          )}

          {paymentModal && (
            <Modal
              open={paymentModal}
              onClose={() => setPaymentModal(false)}
              aria-labelledby="modal-modal-title"
              aria-describedby="modal-modal-description"
              className={styles.paymentModal}
            >
              <Box sx={style}>
                <FormControl>
                  <FormLabel
                    className={styles.heading}
                    id="demo-radio-buttons-group-label"
                  >
                    Choose Payment method
                  </FormLabel>
                  <RadioGroup
                    aria-labelledby="demo-radio-buttons-group-label"
                    defaultValue="UPI"
                    name="radio-buttons-group"
                    onChange={handleChange}
                  >
                    <FormControlLabel
                      value="UPI"
                      control={<Radio />}
                      label="Other"
                    />
                    <FormControlLabel
                      value="Cash"
                      control={<Radio />}
                      label="Cash"
                    />
                  </RadioGroup>
                </FormControl>
                <Button
                  className={styles.btn}
                  onClick={() => handlePaymentMethod()}
                >
                  Apply
                </Button>
              </Box>
            </Modal>
          )}
        </div>
      ) : (
        <Empty
          icon={<Receipt />}
          info={"You Have No Orders"}
          desc={"Add items to your cart and place your first order."}
        />
      )}
    </>
  );
};

export default Bills;
