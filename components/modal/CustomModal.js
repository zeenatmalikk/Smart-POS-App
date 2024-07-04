import React from "react";
import { Modal, Paper } from "@mui/material";
import styles from "./CustomModal.module.scss";

const CustomModal = ({ openModal, onClose, children }) => {
  return (
    <Modal disableAutoFocus open={openModal} onClose={onClose}>
      <Paper className={styles.paper}>{children}</Paper>
    </Modal>
  );
};

export default CustomModal;
