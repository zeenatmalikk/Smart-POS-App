"use client"; // This is a client component 👈🏽
import CustomInput from "@/components/auth/input/CustomInput";
import Sidebar from "@/components/auth/sidebar/Sidebar";
import CustomButton from "@/components/button/CustomButton";
import {
  FormControl,
  FormControlLabel,
  MenuItem,
  Radio,
  RadioGroup,
  Snackbar,
  TextField,
  Typography,
} from "@mui/material";
import styles from "../auth.module.scss";
import React, { useEffect, useState } from "react";
import Link from "next/link";
import { setUserData } from "@/lib/redux/slices/userSlice";
import { supabase } from "../../../supabase/supabase";
import { useRouter } from "next/navigation";

const Signup = () => {
  const router = useRouter();
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    role: "",
    password: "",
    confirmPassword: "",
  });
  const [user, setUser] = useState(undefined);
  const [toast, setToast] = useState({ visible: false, msg: " " });
  const handleUserData = (e) => {
    const { name, value } = e.target;

    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  useEffect(() => {
    console.log("formdata", formData);
  }, [formData]);

  const handleSignup = async (e) => {
    e.preventDefault();
    if (
      !formData.fullName ||
      !formData.email ||
      !formData.password ||
      !formData.confirmPassword
    ) {
      setToast({ msg: "All fields are required", visible: true });
      console.log("All fields are required");
      return;
    }

    if (formData.password !== formData.confirmPassword) {
      console.log("Passwords do not match");
      setToast({ msg: "Passwords do not match", visible: true });
      return;
    }
    const { data, error } = await supabase.auth.signUp({
      email: formData.email,
      password: formData.password,
      options: {
        emailRedirectTo: `${location.origin}/auth/signin`,
        data: {
          full_name: formData.fullName,
          role: formData.role,
        },
      },
    });
    if (data.user) {
      setUser(data);
    }
    console.log("signup data", data);
    if (error) {
      setToast({
        visible: true,
        msg: error.message,
      });
      console.log("error msg", error);
    }
  };

  return (
    <div className={styles.signup}>
      <Sidebar
        title={"Welcome!"}
        subtitle={"Please, sign up to continue"}
        actionText={
          user
            ? "Success! Please check your email for further instructions "
            : "Already have an account?"
        }
        linkText={user ? "" : "Go to Login"}
        navigateLink={"/auth/signin"}
      >
        <FormControl className={styles.genderContainer}>
          <RadioGroup
            row
            aria-labelledby="demo-row-radio-buttons-group-label"
            name="role"
            className={styles.row}
            value={formData.gender}
            onChange={handleUserData}
          >
            <FormControlLabel
              value={"Manager"}
              control={<Radio />}
              label="Manager"
              className={styles.gender}
            />
            <FormControlLabel
              value={"Waiter"}
              className={styles.gender}
              control={<Radio />}
              label="Waiter"
            />
          </RadioGroup>
        </FormControl>
        <CustomInput
          placeholder={"Fullname"}
          onChange={handleUserData}
          inputName={"fullName"}
          type={"text"}
        />

        <CustomInput
          placeholder={"Email"}
          onChange={handleUserData}
          inputName={"email"}
          type={"email"}
        />

        <CustomInput
          placeholder={"Password"}
          onChange={handleUserData}
          inputName={"password"}
          type={"password"}
        />
        <CustomInput
          placeholder={"Confirm password"}
          onChange={handleUserData}
          inputName={"confirmPassword"}
          type={"password"}
        />
        <CustomButton text={"Sign up"} onClick={handleSignup} />
      </Sidebar>
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={toast.visible}
        onClose={() => setToast({ visible: false, msg: "" })}
        message={toast.msg}
      />
    </div>
  );
};

export default Signup;
