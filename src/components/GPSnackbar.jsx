import { Alert, Snackbar } from "@mui/material";
import React from "react";

const GPSnackbar = ({ open, onClose, error, message}) => {
  return (
    <Snackbar
      open={open}
      autoHideDuration={5000}
      onClose={(e, reason) => {
        if (reason === "clickaway") return;
        onClose();
      }}
    >
      <Alert
        severity={error ? "error" : "success"}
        sx={{ width: "100%" }}
      >
        {message}
      </Alert>
    </Snackbar>
  );
};

export default GPSnackbar;
