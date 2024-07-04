"use client"; // This is a client component 👈🏽
import CustomInput from "@/components/auth/input/CustomInput";
import Sidebar from "@/components/auth/sidebar/Sidebar";
import CustomButton from "@/components/button/CustomButton";
import React from "react";

const page = () => {
  return (
    <div>
      <Sidebar
        title={"Reset Password"}
        subtitle={"Please enter your mail"}
        navigateLink={""}
      >
        <CustomInput placeholder={"Email"} />
        <CustomButton text={"Reset Password"} />
      </Sidebar>
    </div>
  );
};

export default page;
