import React from "react";
import { Box, Paper, Typography } from "@mui/material";
import { dateFormatter } from "../../utils/formatDate";
import { AdminSettingsServices } from "../../services/adminSettingsService";
const Start = () => {
  const initialRegistrarActivity = {
    activity: "",
    schoolyear: 1970,
    semester: "",
    status: "",
    from: "0000-00-00",
    to: "0000-00-00",
  }
  const [data, setData] = React.useState([initialRegistrarActivity])
  React.useEffect(() => {
    const fetchRegistrarActivity = async () => {
      const { data, status } = await AdminSettingsServices.getRegistrarActivity();
      if(status === 200) {
        setData(data)
      }
    }
    fetchRegistrarActivity()
  },[])
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Box >
        <Typography variant="h3" fontWeight={700}>
          Welcome to {process.env.REACT_APP_TITLE}
        </Typography>
        <Typography>Navigate on the sidebar to start.</Typography><br />
        <Box
          sx={{ 
            display: {xs: "column", md: "flex"},
            gap: 2,
           }}
        >
          {data.length > 0 && 
          data.map(({
            id, 
            activity, 
            schoolyear, 
            semester, 
            status, 
            from, 
            to,
            term_type
          }, index) => (
            <Paper 
              key={index} 
              elevation={12}
              sx={{ 
                p: 2, 
                mt: 4, 
                flexGrow: 1 
              }}
            >
              <Typography variant="body1" color="initial"><strong>{activity}</strong></Typography>
              <Typography variant="body1" color="initial">Current Status <strong>{status}</strong></Typography>
              <Typography variant="body1" color="initial">Current School Year: <strong>{`${schoolyear} - ${schoolyear + 1}`}</strong></Typography>
              <Typography variant="body1" color="initial">Current Semester: <strong>{semester === "summer" ? "Summer" : semester }{term_type === 'midterm' ? "(Midterm)" : "(Endterm)"}</strong></Typography>
              <Typography variant="body1" color="initial">From: <strong>{dateFormatter(from)}</strong></Typography>
              <Typography variant="body1" color="initial">To: <strong>{dateFormatter(to)}</strong></Typography>
              <Typography variant="body1" color="initial"><strong>{}</strong></Typography>
            </Paper>
          ))}
        </Box>
      </Box>
    </React.Suspense>
  );
};

export default Start;
