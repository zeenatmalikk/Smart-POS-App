"use client";
import React, { useEffect, useState } from "react";
import styles from "./Cart.module.scss";
import Header from "@/components/header/Header";
import { supabase } from "../../supabase/supabase";
import { useAppContext } from "@/context";
import {
  Box,
  Button,
  ButtonGroup,
  Card,
  CardMedia,
  Divider,
  Grid,
  Modal,
  Typography,
} from "@mui/material";
import Delete from "@mui/icons-material/Delete";
import {
  ArrowRightAlt,
  Cancel,
  CheckCircleOutline,
  ShoppingCart,
} from "@mui/icons-material";
import { useDispatch, useSelector } from "react-redux";
import {
  clearCart,
  decreaseQuantity,
  increaseQuantity,
  removeItem,
} from "@/lib/redux/slices/cartSlice";
import Empty from "@/components/empty/Empty";

let cartItems = [];
let cart = [];
const page = () => {
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
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
  };

  cart = useSelector((state) => state.cart.items);
  const table = useSelector((state) => state.table.tableDetails);
  const { assignedTable: tableNumber = "", totalGuests = "" } = table;

  cartItems = cart;
  const dispatch = useDispatch();
  const { user, setUser } = useAppContext();
  const [quantity, setQuantity] = useState(1);
  const [total, setTotal] = useState(0);
  const [success, setSuccess] = useState(false);
  useEffect(() => {
    if (success) {
      setTimeout(() => {
        setSuccess(false);
        dispatch(clearCart());
      }, 2000);
    }
  }, [success]);
  const fetchUser = async () => {
    const { data, error } = await supabase.auth.getSession();
    console.log("data in cart", data);
    setUser(data);
  };
  function calculateTotal() {
    let total = 0;
    cart.forEach((item) => {
      total += item.amount;
    });
    setTotal(total);
  }
  useEffect(() => {
    fetchUser();
  }, []);
  useEffect(() => {
    console.log("quantyiy", quantity);
    calculateTotal();
  }, [cart]);

  const handleQuantity = (e, type, itemId) => {
    e.preventDefault();
    switch (type) {
      case "decrease":
        dispatch(decreaseQuantity(itemId));
        break;
      case "increase":
        dispatch(increaseQuantity(itemId));
        break;
      default:
        break;
    }
  };
  const placeOrder = async () => {
    const { data: user, error: usererror } = await supabase.auth.getUser();

    // Insert order into Supabase
    const { data, error } = await supabase
      .from("orders")
      .insert([
        {
          waiter_id: user.user.id,
          total_amount: total,
          created_at: new Date(),
          updated_at: null,
          status: "active",
          total_customers: totalGuests,
          table_number: tableNumber,
        },
      ])
      .select();
    if (error) {
      console.log("error in data orders", error);
      throw error;
    } else if (data && data.length > 0) {
      const { order_id } = data[0];
      await updateOrderItem(order_id, user.user.id);
    } else {
      throw new Error("No data available or data is empty.");
    }
  };

  const updateOrderItem = async (orderId, waiter_id) => {
    cartItems.map((item) => {
      insertFoodItem(orderId, item.id, item.quantity, waiter_id);
    });
  };
  const insertFoodItem = async (orderId, food_id, quantity, waiter_id) => {
    const { data, error } = await supabase
      .from("order_items")
      .insert({
        order_id: orderId,
        food_id: food_id,
        quantity,
        waiter_id: waiter_id,
      })
      .select();
    if (error) {
      console.log(error, "error in order");
    } else {
      console.log(data, "data in order insert");
      setSuccess(true);
    }
  };

  const handleRemoveItem = (id) => {
    dispatch(removeItem(id));
  };
  const handleClearCart = () => {
    dispatch(clearCart());
  };
  return (
    <div className={styles.cart}>
      {cart.length > 0 ? (
        <>
          <Header title={"Cart"} />
          <Grid container className={styles.headerWrap}>
            <Grid item md={6} xs={12} sm={12}>
              <Typography variant="h6" className={styles.msg}>
                You have <span>{cart.length} items</span> in your cart
              </Typography>
            </Grid>
            <Grid
              item
              md={6}
              xs={12}
              sm={12}
              display={"flex"}
              justifyContent={"flex-end"}
            >
              <Button
                startIcon={<Delete />}
                variant="contained"
                className={styles.clear}
                onClick={handleClearCart}
              >
                Clear cart
              </Button>
            </Grid>
          </Grid>
          <Grid container>
            <Grid item md={8}>
              <div className={styles.cartItemsContainer}>
                {cart.map((item) => (
                  <>
                    <Grid container className={styles.cartItems}>
                      <Grid item md={1.5} xs={4} sm={4}>
                        <Card
                          component={"image"}
                          sx={{ minWidth: 200, flexGrow: 1 }}
                        >
                          <CardMedia
                            component="img"
                            sx={{ borderRadius: 2 }}
                            height="100%"
                            image={item.image_url}
                          />
                        </Card>
                      </Grid>
                      <Grid item md={5.5}>
                        <Typography variant="body2" className={styles.food}>
                          {item.name}
                        </Typography>
                      </Grid>
                      <Grid item md={2} className={styles.quantityContainer}>
                        <ButtonGroup
                          variant="outlined"
                          className={styles.btnGroup}
                        >
                          <Button
                            className={styles.quantityCount}
                            onClick={(e) =>
                              handleQuantity(e, "decrease", item.id)
                            }
                          >
                            -
                          </Button>
                          <Button className={styles.quantity}>
                            {item.quantity}
                          </Button>
                          <Button
                            className={styles.quantityCount}
                            onClick={(e) =>
                              handleQuantity(e, "increase", item.id)
                            }
                          >
                            +
                          </Button>
                        </ButtonGroup>
                      </Grid>
                      <Grid item md={2} className={styles.priceContainer}>
                        <Typography variant="body2" className={styles.price}>
                          ₹ {item.price * item.quantity}
                        </Typography>
                      </Grid>
                      <Grid item md={1} className={styles.cancel}>
                        <Button
                          variant="text"
                          onClick={() => handleRemoveItem(item.id)}
                        >
                          <Cancel />
                        </Button>
                      </Grid>
                    </Grid>
                    <Divider sx={{ width: "100%", marginBottom: 1 }} />
                  </>
                ))}
              </div>
            </Grid>
            <Grid item md={4} className={styles.totalContainer}>
              <Grid container className={styles.grandTotal}>
                <Grid item md={6}>
                  Total
                </Grid>
                <Grid item md={6} display={"flex"} justifyContent={"flex-end"}>
                  ₹ {total}
                </Grid>
              </Grid>
              <Button
                variant="contained"
                endIcon={<ArrowRightAlt />}
                className={styles.order}
                onClick={() => placeOrder()}
              >
                Place Order
              </Button>
            </Grid>
          </Grid>
        </>
      ) : (
        <Empty icon={<ShoppingCart />} info={"Your cart is empty!"} />
      )}
      <Modal
        open={success}
        disableAutoFocus
        disableRestoreFocus
        onClose={() => setSuccess(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        <Box sx={style}>
          <CheckCircleOutline
            sx={{
              fontSize: "3rem",
              marginBottom: "1rem",
            }}
            color={"success"}
          />
          <Typography className={styles.success}>
            Your order has been placed successfully
          </Typography>
        </Box>
      </Modal>
    </div>
  );
};

export default page;
