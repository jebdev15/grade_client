import React, { useEffect, useState } from "react";
import { Box, Typography } from "@mui/material";
import axios from "axios";
import { dateFormatter } from "../../utils/formatDate";
import useFetchAxiosGet from "../../hooks/useFetchAxiosGet";
const Start = () => {
  const initialRegistrarActivity = {
    activity: "",
    schoolyear: 1970,
    semester: "",
    status: "",
    from: "0000-00-00",
    to: "0000-00-00",
  }
  const [registrarActivity, setRegistrarActivity] = useState(initialRegistrarActivity);
  const { data, loading, error } = useFetchAxiosGet('/getCurrentSchoolYear');
  useEffect(() => {
    const handleGetRegistrarActivity = async () => {
      try {
        const {data} = await axios.get(`${process.env.REACT_APP_API_URL}/getCurrentSchoolYear`);
        setRegistrarActivity(data[0]);
      } catch (error) {
        console.log(error);
      }
    }
    handleGetRegistrarActivity();
  },[data, loading, error])
  return (
    <Box>
      <Typography variant="h3" fontWeight={700}>
        Welcome to the {process.env.REACT_APP_TITLE}
      </Typography>
      <Box sx={{ mt: 4 }}>
        <Typography>Navigate on the sidebar to start.</Typography><br />
        <Typography variant="body1" color="initial"><strong>{registrarActivity.activity}</strong></Typography>
        <Typography variant="body1" color="initial">Current Status <strong>{registrarActivity.status}</strong></Typography>
        <Typography variant="body1" color="initial">Current School Year: <strong>{`${registrarActivity.schoolyear} - ${registrarActivity.schoolyear + 1}`}</strong></Typography>
        <Typography variant="body1" color="initial">Current Semester: <strong>{registrarActivity.semester === "summer" ? "Summer" : registrarActivity.semester }</strong></Typography>
        <Typography variant="body1" color="initial">From: <strong>{dateFormatter(registrarActivity.from)}</strong></Typography>
        <Typography variant="body1" color="initial">To: <strong>{dateFormatter(registrarActivity.to)}</strong></Typography>
      </Box>
    </Box>
  );
};

export default Start;
