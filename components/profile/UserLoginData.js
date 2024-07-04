import React, { useEffect, useState } from "react";
import styles from "../../app/profile/profile.module.scss";
import { Box, Button, Grid, Modal, Typography } from "@mui/material";
import CustomInput from "../auth/input/CustomInput";
import KeyIcon from "@mui/icons-material/Key";
import CustomButton from "../button/CustomButton";
import { supabase } from "../../supabase/supabase";
import { useRouter } from "next/navigation";
const UserLoginData = ({ setFormData, formData }) => {
  const router = useRouter();
  const [resetPassword, setResetPassword] = useState(false);
  const [success, setSuccess] = useState(false);
  const [isError, setError] = useState(false);
  const [modal, setModal] = useState(false);

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value, "nameval");
    setFormData({
      ...formData,
      [name]: value,
    });
  };
  const style = {
    position: "absolute",
    top: "50%",
    left: "50%",
    transform: "translate(-50%, -50%)",
    width: 400,
    bgcolor: "background.paper",
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
    flexDirection: "column",
    boxShadow: 24,
    p: 4,
  };
  const handleReset = async () => {
    const { data: userData, error } = await supabase.auth.getUser();
    console.log("userData", userData.user);
    try {
      const { user = {} } = userData;
      const { data, error } = await supabase.auth.resetPasswordForEmail(
        user.email,
        {
          redirectTo: `${window.location.origin}/confirm`,
        }
      );
      if (error) {
        setError(true);
      }

      console.log("resetData", data);
      setSuccess(true);
    } catch (error) {}
    setModal(false);
  };
  return (
    <div>
      <Typography variant="h5" className={styles.infoCopy}>
        Login & Password
      </Typography>
      <Grid container className={styles.loginForm}>
        <Grid item md={12} sm={5}>
          <div className={styles.label}>Username</div>
          <CustomInput
            placeholder={"email"}
            inputName={"email"}
            onChange={handleChange}
            height={"2rem"}
            value={formData.email}
          />
        </Grid>
        {/* <Grid item md={0.4} sm={1} /> */}
        {/* <Grid item md={5.8} sm={5}>
          <div className={styles.label}>Your sales ID number</div>
          <CustomInput
            placeholder={"sales-id"}
            inputName={"salesId"}
            onChange={handleChange}
            height={"2rem"}
            disabled={true}
          />
        </Grid> */}
        {/* <Grid item md={5.8} sm={5}>
          <div className={styles.label}>Password</div>
          <CustomInput
            placeholder={"password"}
            inputName={"password"}
            onChange={handleChange}
            height={"2rem"}
          />
        </Grid>
        <Grid item md={0.4} />*/}
        <Grid item md={12} sm={5} className={styles.changePass}>
          <Typography
            variant="body2"
            className={styles.copy}
            onClick={() => setModal(true)}
          >
            <KeyIcon /> Change Password
          </Typography>
          {success && (
            <div className={styles.password}>
              <span>Success! </span>Reset link has been sent to your registered
              e-mail address
            </div>
          )}
          {isError && (
            <div className={styles.password}>
              <span className={styles.error}>Error! </span> Rate limit Exceeded
            </div>
          )}
        </Grid>
      </Grid>
      <CustomButton text={"Save changes"} />
      <Modal
        open={modal}
        onClose={() => setModal(false)}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
        className={styles.modalContainer}
      >
        <Box sx={style}>
          <Typography className={styles.head}>Forgot your Password?</Typography>
          <Typography className={styles.copy}>
            You'll get a link on your registered E-mail address{" "}
          </Typography>
          <CustomButton
            text="Reset Password"
            onClick={() => handleReset()}
          ></CustomButton>
        </Box>
      </Modal>
    </div>
  );
};

export default UserLoginData;
