import React, { useEffect, useState } from "react";
import styles from "../../app/profile/profile.module.scss";
import {
  FormControl,
  FormControlLabel,
  Grid,
  Input,
  Radio,
  RadioGroup,
  Slide,
  Snackbar,
  Typography
} from "@mui/material";
import CustomInput from "../auth/input/CustomInput";
import CustomButton from "../button/CustomButton";
import { supabase } from "../../supabase/supabase";
import { useAppContext } from "@/context";
import { useSelector } from "react-redux";
const PersonalInfo = ({ formData, setFormData }) => {
  const userData = useSelector((state) => state.auth);
  const { user = {} } = userData;
  const { id: userIDs = "" } = user;

  const [toast, setToast] = useState({
    visible: false,
    msg: "",
    color: "",
  });

  const handleChange = (event) => {
    const { name, value } = event.target;
    console.log(name, value, "nameval");
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSaveInfo = async () => {
    try {
      const payload = {
        ...formData,
        fullname: formData.first_name + " " + formData.last_name,
      };
      const { first_name, last_name, ...newPayload } = payload;
      const { data: profile, error } = await supabase
        .from("profiles")
        .update(newPayload)
        .eq("id", userIDs)
        .select();

      if (error) {
        console.error("Error updating profile:", error);
        setToast({
          msg: "Error updating profile",
          visible: true,
          color: "#C8161D",
        });
      } else {
        if (profile && profile.length > 0) {
          setToast({
            msg: "Profile updated successfully!",
            visible: true,
            color: "#008000",
          });
        } else {
          setToast({
            msg: "No profile found with the provided ID(s)",
            visible: true,
            color: "#C8161D",
          });
        }
      }
      console.log("Profile updated successfully:", profile);
    } catch (error) {
      console.error("Error updating profile:", error);
      setToast({
        msg: "Failed to update Profile, PLease try again later!",
        visible: true,
      });
    }
  };
  return (
    <div>
      <Typography className={styles.infoCopy}>
        Personal Information
      </Typography>
      <FormControl className={styles.genderContainer}>
        <RadioGroup
          row
          aria-labelledby="demo-row-radio-buttons-group-label"
          name="gender"
          className={styles.row}
          value={formData.gender}
          onChange={handleChange}
        >
          <FormControlLabel
            value={"Female"}
            control={<Radio />}
            label="Female"
            defaultValue={formData.gender == "Female"}
            className={styles.gender}
          />
          <FormControlLabel
            value={"Male"}
            className={styles.gender}
            control={<Radio />}
            defaultValue={formData.gender == "Male"}
            label="Male"
          />
        </RadioGroup>
      </FormControl>
      <Grid container>
        <Grid item md={5.8} sm={12} xs={12}>
          <div className={styles.label}>Firstname</div>
          <CustomInput
            inputName={"first_name"}
            height={"2rem"}
            placeholder={"Firstname"}
            type={"text"}
            value={formData.first_name}
            onChange={handleChange}
          />
        </Grid>
        <Grid item md={0.4} />
        <Grid item md={5.8} sm={12} xs={12}>
          <div className={styles.label}>Lastname</div>

          <CustomInput
            height={"2rem"}
            type={"text"}
            inputName={"last_name"}
            placeholder={"Lastname"}
            onChange={handleChange}
            value={formData.last_name}
          />
        </Grid>
      </Grid>
      <Grid item md={12} sm={12} xs={12}>
        <div className={styles.label}>Email</div>

        <CustomInput
          height={"2rem"}
          placeholder={"Email"}
          onChange={handleChange}
          type={"email"}
          inputName={"email"}
          value={formData.email}
        />
      </Grid>
      <Grid container>
        <Grid item md={5.8} sm={12} xs={12}>
          <div className={styles.label}>Phone Number</div>

          <CustomInput
            height={"2rem"}
            placeholder={"Phone number"}
            onChange={handleChange}
            type={"tel"}
            inputName={"phone_number"}
            value={formData.phone_number}
          />
        </Grid>
        <Grid item md={0.4} />
        <Grid item md={5.8} sm={12} xs={12}>
          <div className={styles.label}>D.O.B</div>

          <CustomInput
            height={"2rem"}
            placeholder={"DOB"}
            type={"date"}
            inputName={"date_of_birth"}
            onChange={handleChange}
            value={formData.date_of_birth}
          />
        </Grid>
      </Grid>
      <Grid container>
        <Grid item md={5.8} sm={12} xs={12}>
          <div className={styles.label}>Location</div>

          <CustomInput
            height={"2rem"}
            inputName={"city"}
            placeholder={"City"}
            onChange={handleChange}
            value={formData.city}
          />
        </Grid>
        <Grid item md={0.4} />
        <Grid item md={5.8} sm={12} xs={12}>
          <div className={styles.label}>Pincode</div>

          <CustomInput
            height={"2rem"}
            placeholder={"Pincode"}
            onChange={handleChange}
            inputName={"pincode"}
            type={"number"}
            value={formData.pincode}
          />
        </Grid>
      </Grid>
      <CustomButton text={"Save Changes"} onClick={() => handleSaveInfo()} />
      <div classNa me={styles.alert}>
        
      <Snackbar
        anchorOrigin={{ vertical: "top", horizontal: "right" }}
        open={toast.visible}
        onClose={() => setToast({ visible: false, msg: "" })}
        message={toast.msg}
        autoHideDuration={2000}
      />
      </div>
    </div>
  );
};

export default PersonalInfo;
