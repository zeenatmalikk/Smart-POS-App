"use client"; // This is a client component 👈🏽

import React, { useState, useCallback, useEffect } from "react";
import ActionAreaCard from "../../../../components/card/ActionAreaCard.js";
import styles from "../../menu.module.scss";
import {
  Typography,
  Drawer,
  Grid,
  Modal,
  ButtonGroup,
  Button,
} from "@mui/material";
import { useRouter, useSearchParams } from "next/navigation";
import Image from "next/image.js";
import CustomButton from "@/components/button/CustomButton.js";
import { supabase } from "../../../../supabase/supabase.js";
import { addToCart } from "@/lib/redux/slices/cartSlice.js";
import { useDispatch, useSelector } from "react-redux";
import { useAppContext } from "@/context/index.js";
import Header from "@/components/header/Header.js";
import Card from "@mui/material/Card";
import CardHeader from "@mui/material/CardHeader";
import CardMedia from "@mui/material/CardMedia";
import CardContent from "@mui/material/CardContent";
import CardActions from "@mui/material/CardActions";
import Link from "next/link";
import { ArrowRightAlt, ChevronRight } from "@mui/icons-material";
import { store } from "@/lib/redux/store.js";
import Loading from "@/components/loading/Loading.js";

const SubCategories = () => {
  const subCateg = useSelector((state) => state.sidePanel.subCategory);
  const [openModal, setOpenModal] = useState(false);
  const [loading, setLoading] = useState(true);
  const searchParams = useSearchParams();
  const category_id = searchParams.get("category_id");
  const [quantity, setQuantity] = useState(1);

  const [foodData, setFoodData] = useState({
    image_url: "",
    name: "",
    quantity: "",
    price: "",
  });
  const router = useRouter();
  const [foodItems, setFoodItems] = useState([]);
  const dispatch = useDispatch();
  const { setUser } = useAppContext();

  const getFoodItems = useCallback(async () => {
    try {
      setLoading(true);
      const { data, error } = await supabase
        .from("food_item")
        .select("*")
        .eq("category_id", category_id);

      if (error) {
        throw error;
      }
      if (data) {
        setFoodItems(data);
      }
    } catch (error) {
      alert("Error loading user data!");
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    getFoodItems();
  }, []);

  const toggleDrawer = (open) => (event) => {
    if (
      event.type === "keydown" &&
      (event.key === "Tab" || event.key === "Shift")
    ) {
      return;
    }

    setOpenModal(open);
  };

  const onClickHandle = (data) => {
    console.log("data in drawer", data);
    setFoodData(data);
    setOpenModal(true);
  };
  const onApplyAddToCart = (e, item) => {
    const updatedItem = {
      ...item,
      quantity,
      amount: item.price * quantity,
    };
    try {
      dispatch(addToCart(updatedItem));
      setOpenModal(false);
      setQuantity(1);
      // Dispatch action to add item to cart
    } catch (error) {
      console.log(error);
    }
  };
  const handleQuantity = (type) => {
    switch (type) {
      case "decrease":
        console.log(type);
        if (quantity > 1) {
          setQuantity(quantity - 1);
        }
        break;
      case "increase":
        console.log(type);
        setQuantity(quantity + 1);

        break;
      default:
        break;
    }
  };
  return (
    <>
      {loading ? (
        <Loading />
      ) : (
        <>
          <Header padding={"1rem 2.5rem"} title={"Food Items"} />
          <div className={styles.breadcrumbs}>
            <Link className={styles.links} href={"/menu/categories"}>
              Categories
            </Link>
            <ChevronRight />
            <div className={styles.links2}>{subCateg}</div>
          </div>
          <Grid container className={styles.menu}>
            {foodItems.map((data) => (
              <Grid item md={3} className={styles.SubCategories}>
                <ActionAreaCard data={data} onClick={onClickHandle} />
              </Grid>
            ))}
          </Grid>
          <Modal open={openModal} onClose={toggleDrawer(false)}>
            <Card sx={{ maxWidth: 400 }} className={styles.modal}>
              <CardMedia
                component="img"
                height="199"
                image={foodData.image_url}
              />
              <CardContent className={styles.cardContent}>
                <CardHeader className={styles.title} title={foodData.name} />
                <div className={styles.price}>
                  ₹ {quantity * foodData.price}
                </div>
              </CardContent>
              <CardActions disableSpacing className={styles.actions}>
                <ButtonGroup variant="outlined" className={styles.btnGroup}>
                  <Button
                    className={styles.quantityCount}
                    onClick={() => handleQuantity("decrease")}
                    disableRipple
                  >
                    -
                  </Button>
                  <Button className={styles.quantity}>{quantity}</Button>
                  <Button
                    className={styles.quantityCount}
                    disableRipple
                    onClick={() => handleQuantity("increase")}
                  >
                    +
                  </Button>
                </ButtonGroup>
                <CustomButton
                  text={"Add to cart"}
                  onClick={(e) => onApplyAddToCart(e, foodData)}
                />
              </CardActions>
            </Card>
          </Modal>
        </>
      )}
    </>
  );
};

export default SubCategories;
