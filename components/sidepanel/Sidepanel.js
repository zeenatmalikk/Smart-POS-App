"use client";
import React, { useEffect, useState } from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  ListItemIcon,
  Avatar,
  Badge,
  Button,
  Card,
  Typography,
} from "@mui/material";
import { Dashboard, Fastfood, Receipt } from "@mui/icons-material";
import styles from "./Sidepanel.module.scss";
import { useRouter } from "next/navigation";
import Logo from "../logo/Logo";
import { supabase } from "../../supabase/supabase";
import ShoppingCartIcon from "@mui/icons-material/ShoppingCart";
import { useDispatch, useSelector } from "react-redux";
import { setSelectedTab } from "@/lib/redux/slices/sidePanelSlice";
import { setProfileData } from "@/lib/redux/slices/userSlice";
const drawerWidth = 240;

export default function Sidepanel() {
  const cart = useSelector((state) => state.cart.items);
  const panel = useSelector((state) => state.sidePanel.selectedTab);
  const [selectedIndex, setSelectedIndex] = useState(panel);
  const [profileData, setProfile] = useState({});
  const router = useRouter();
  const userData = useSelector((state) => state.auth);
  const { user = {}, profile = {} } = userData;
  const { id: userId = "" } = user;
  const { id: profileId = "" } = profile;
  useEffect(() => {
    if (panel == selectedIndex) {
      if (panel == 4) {
        router.push("/profile");
      } else {
        router.push(menuData[panel].href);
      }
    }
  }, []); 
  const getProfileDetails = async () => {
    let { data: profiles, error } = await supabase
      .from("profiles")
      .select("*")
      .eq("id", userId);
    setProfile(profiles[0]);
    dispatch(setProfileData(profiles[0]));
  };
  useEffect(() => {
    if (user && !profileId) {
      getProfileDetails();
    }
  }, [user]);
  const menuData = [
    {
      href: "/dashboard",
      icon: <Dashboard />,
      primary: "Dashboard",
    },
    { href: "/menu/categories", icon: <Fastfood />, primary: "Food & Drinks" },
    { href: "/cart", icon: <ShoppingCartIcon />, primary: "Cart" },
    { href: "/bills", icon: <Receipt />, primary: "Bills" },
  ];
  const dispatch = useDispatch();
  const handleRoute = (href, index) => {
    dispatch(setSelectedTab(index));
    setSelectedIndex(index);
    router.push(href);
  };

  const handleProfile = () => {
    dispatch(setSelectedTab(4));
    setSelectedIndex(4);

    router.push("/profile");
  };
  return (
    <Box sx={{ display: "flex" }}>
      <Drawer
        variant="permanent"
        sx={{
          width: drawerWidth,
          height: "100%",
          position: "relative",
          flexShrink: 0,
          [`& .MuiDrawer-paper`]: {
            width: drawerWidth,
            boxSizing: "border-box",
          },
        }}
      >
        <Logo font={"1.2rem"} />
        <Box className={styles.sidePanelContainer}>
          <List className={styles.tabContainer}>
            {menuData.map((text, index) => (
              <ListItem key={text} disablePadding>
                <ListItemButton
                  onClick={() => handleRoute(text.href, index)}
                  selected={selectedIndex === index}
                  className={`${styles.tabBtn} ${
                    selectedIndex === index && styles.tabActiveBtn
                  }`}
                >
                  {text.href == "/cart" ? (
                    <ListItemIcon className={styles.icon}>
                      <Badge
                        badgeContent={cart.length}
                        color={"primary"}
                        className={styles.badge}
                      >
                        {text.icon}
                      </Badge>
                    </ListItemIcon>
                  ) : (
                    <ListItemIcon className={styles.icon}>
                      {text.icon}
                    </ListItemIcon>
                  )}

                  <ListItemText
                    className={styles.tabTxt}
                    primary={text.primary}
                    disableTypography
                  />
                </ListItemButton>
              </ListItem>
            ))}
          </List>
          {user && (
            <Box className={styles.profileSection}>
              <Card elevation={2} className={styles.profileCard}>
                <Avatar src={"/images/avatar.png"} className={styles.avatar}>
                  Z
                </Avatar>
                <Typography variant="h6" className={styles.profileName}>
                  {profile.fullname}
                </Typography>
                <Typography variant="body2" className={styles.desig}>
                  {profileData.role}
                </Typography>
                <Button onClick={handleProfile} className={styles.profileBtn}>
                  Show Profile
                </Button>
              </Card>
            </Box>
          )}
        </Box>
      </Drawer>
    </Box>
  );
}
