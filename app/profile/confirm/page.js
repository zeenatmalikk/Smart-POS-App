"use client";
import React, { useEffect, useState } from "react";
import styles from "./ConfirmPassword.module.scss";
import CustomInput from "@/components/auth/input/CustomInput";
import CustomButton from "@/components/button/CustomButton";
import { supabase } from "@/supabase/supabase";
import { useAppContext } from "@/context";
import { useRouter } from "next/navigation";
const ConfirmPassword = () => {
  const { setUser } = useAppContext();
  const router = useRouter();
  const [data, setData] = useState({
    password: "",
    confirmPassword: "",
  });
  // useEffect(() => {
  //   const fetchSession = async () => {
  //     const { data, error } = await supabase.auth.getSession();
  //     console.log("dashboard data", data);
  //     if (data.session == null) {
  //       router.push("/auth/signin");
  //     } else {
  //       setUser(data);
  //     }
  //   };
  //   fetchSession();
  // }, []);

  const handleConfirm = async () => {
    const { password, confirmPassword } = data;
    // if (password !== confirmPassword) {
    //   alert("Passwords do not match!");
    // }
    // if (password == confirmPassword) {
    const { data: userData, error } = await supabase.auth.getUser();
    console.log("userData", userData.user);
    try {
      const { user = {} } = userData;
      const { data: resetData, error } = await supabase.auth.updateUser({
        password: data.password,
      });
      if (resetData) {
        // router.push("/");
        console.log(resetData, "data in reset");
      }
      console.log("reset data", resetData);
      console.log("reset data", error);
    } catch (error) {
      console.log("error in confirm password", error);
    }
    // }
  };
  return (
    <div className={styles.resetPass}>
      <div className={styles.align}>
        <label>Enter your password</label>
        <CustomInput
          // type={"password"}
          value={data.password}
          placeholder={"Enter Password"}
          onChange={(e) => setData({ password: e.target.value })}
        />
        <label>Confirm your password</label>

        <CustomInput
          // type={"password"}
          value={data.confirmPassword}
          placeholder={"Confirm Password"}
          onChange={(e) => setData({ confirmPassword: e.target.value })}
        />
        <CustomButton text={"Reset Password"} onClick={() => handleConfirm()} />
      </div>
    </div>
  );
};

export default ConfirmPassword;
