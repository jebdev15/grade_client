import React from "react";
import { Box, Typography } from "@mui/material";
const Start = () => {
  return (
    <Box>
      <Typography variant="h3" fontWeight={700}>
        Welcome to the CHMSU Grading System
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography>Navigate on the sidebar to start.</Typography>
      </Box>
    </Box>
  );
};

export default Start;
