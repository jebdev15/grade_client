import React from "react";
import {
  Box,
  Paper,
  Typography,
  Chip,
  CircularProgress,
} from "@mui/material";
import { dateFormatter } from "@utils/formatDate";
import { AdminSettingsServices } from "@services/adminSettingsService";

const Start = () => {
  const initialRegistrarActivity = {
    activity: "",
    schoolyear: 1970,
    semester: "",
    status: "",
    from: "0000-00-00",
    to: "0000-00-00",
    term_type: "",
    currentSem: 0,
  };
  const [data, setData] = React.useState([initialRegistrarActivity]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchRegistrarActivity = async () => {
      const { data, status } = await AdminSettingsServices.getRegistrarActivity();
      if (status === 200) {
        setData(data);
      }
      setLoading(false);
    };
    fetchRegistrarActivity();
  }, []);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight="50vh">
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h3" fontWeight={700} mb={2}>
        Welcome to {process.env.REACT_APP_TITLE}
      </Typography>
      <Typography mb={4}>Navigate on the sidebar to start.</Typography>

      <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}>
        {data.length > 0 &&
          data
            .sort((a, b) => b.currentSem - a.currentSem)
            .map(
              ({
                id,
                activity,
                schoolyear,
                semester,
                status,
                from,
                to,
                term_type,
                currentSem,
                withinDuration,
              }, index) => (
                <Box key={id || index}>
                  <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                    <Typography variant="subtitle2" color="text.secondary">
                      Academic Year: {semester === "summer" ? schoolyear : `${schoolyear} - ${schoolyear + 1}`}
                    </Typography>

                    <Box display="flex" justifyContent="space-between" alignItems="center" my={1}>
                      <Typography variant="h6">
                        {semester === "summer" ? "Summer" : `${semester} Semester`}
                      </Typography>
                      <Chip
                        label={withinDuration ? "Open" : "Closed"}
                        color={withinDuration ? "primary" : "error"}
                        size="small"
                        sx={{ textTransform: "uppercase", fontWeight: 'bold', color: '#fff' }}
                      />
                    </Box>

                    <Typography variant="body2" color="text.secondary" mb={1}>
                      <span style={{
                        fontWeight: term_type === 'midterm' ? 'bold' : 'normal',
                        color: term_type === 'midterm' ? '#000' : '#b0b0b0',
                        textDecoration: term_type === 'midterm' ? 'none' : 'line-through'
                      }}>
                        Midterm
                      </span>{' '}•{' '}
                      <span style={{
                        fontWeight: term_type === 'endterm' ? 'bold' : 'normal',
                        color: term_type === 'endterm' ? '#000' : '#b0b0b0',
                        textDecoration: term_type === 'endterm' ? 'none' : 'line-through'
                      }}>
                        Endterm
                      </span>
                    </Typography>

                    <Box
                      sx={{
                        backgroundColor: '#eeeeee',
                        padding: 1,
                        borderRadius: 1,
                        borderLeft: '3px solid #666',
                        mt: 1,
                      }}
                    >
                      <Typography variant="caption" color="text.secondary">
                        Duration
                      </Typography>
                      <Typography variant="body1">
                        <strong>{dateFormatter(from)} to {dateFormatter(to)}</strong>
                      </Typography>
                    </Box>
                  </Paper>
                </Box>
              )
            )}
      </Box>
    </Box>
  );
};

export default Start;
