"use client";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import {
  Avatar,
  Card,
  List,
  ListItem,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import { Dashboard, Fastfood, Receipt, Settings } from "@mui/icons-material";
import styles from "./Sidepanel.module.scss";
import Logo from "../logo/Logo";
import CustomButton from "../button/CustomButton";
import { setSelectedTab } from "@/lib/redux/slices/sidePanelSlice";

const demo = ({ style }) => {
  const router = useRouter();
  console.log("sidePanel", sidePanel);
  const items = [
    {
      href: "/dashboard",
      icon: Dashboard,
      primary: "Dashboard",
    },
    { href: "/menu/categories", icon: Fastfood, primary: "Food & Drinks" },
    { href: "/bills", icon: Receipt, primary: "Bills" },
    { href: "/settings", icon: Settings, primary: "Settings" },
  ];

  const [activeTab, setActiveTab] = useState({ href: "", index: 0 });

  const handleProfile = () => {
    router.push("/profile");
  };
  const handleTabClick = (e, href, index) => {
    e.preventDefault();
    setActiveTab({ href, index });
    router.push(href);
    dispatch(setSelectedTab(href));
  };


  return (
    <div className={styles.sidePanel}>
      <Logo />
      <List className={styles.navContainer}>
        {items.map((item, index) => (
          <ListItem
            button
            key={index}
            component="a"
            href={item.href}
            className={`${styles.navTab} ${
              activeTab.index === index ? styles.active : ""
            }`}
            onClick={(e) => handleTabClick(e, item.href, index)}
          >
            <ListItemIcon className={styles.icon}>
              <item.icon />
            </ListItemIcon>
            <ListItemText primary={item.primary} />
          </ListItem>
        ))}
      </List>
      <Card className={styles.profile} elevation={10}>
        <Avatar className={styles.avatar}>Z</Avatar>
        <Typography variant="body1" className={styles.name}>
          Theresa Web
        </Typography>
        <Typography variant="body2" className={styles.designation}>
          Waiter
        </Typography>
        <div className={styles.profileBtn}>
          <CustomButton onClick={handleProfile} text={"Open Profile"} />
        </div>
      </Card>
    </div>
  );
};

export default demo;
