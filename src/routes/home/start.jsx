import React from "react";
import { Box, Chip, CircularProgress, Paper, Typography } from "@mui/material";
import { dateFormatter } from "@utils/formatDate";
import axiosInstance from "api/axiosInstance";
const Start = () => {
  const initialRegistrarActivity = {
    activity: "",
    schoolyear: 1970,
    semester: "",
    status: "",
    from: "0000-00-00",
    to: "0000-00-00",
  };
  const [data, setData] = React.useState([initialRegistrarActivity]);
  const [loading, setLoading] = React.useState(false);
  React.useEffect(() => {
    const getRegistrarActivity = async () => {
      setLoading(true);
      try {
        const { data } = await axiosInstance.get(`/getRegistrarActivity`);
        setData(data);
      } catch (error) {
        console.error("Error fetching registrar activity:", error);
      } finally {
        setLoading(false);
      }
    }
    getRegistrarActivity();
  },[])
  if(loading) return <CircularProgress sx={{ position: "absolute", top: "50%", left: "50%" }} />
  return (
    <React.Suspense fallback={<div>Loading...</div>}>
      <Box>
        <Typography variant="h3" fontWeight={700}>
          Welcome to {process.env.REACT_APP_TITLE}
        </Typography>
        <Typography>Navigate on the sidebar to start.</Typography>
        <br />
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fill, minmax(350px, 1fr))" }}>
          {data?.length > 0 &&
            data.map(
              (
                {
                  id,
                  schoolyear,
                  semester,
                  status,
                  from,
                  to,
                  currentSem,
                  term_type,
                  withinDuration,
                },
                index
              ) => {
                if (Boolean(currentSem)) {
                  return (
                    <Box item sx={{display: "block" }} key={id || index}>
                      <Paper elevation={3} sx={{ p: 3, borderRadius: 2 }}>
                        <Typography variant="subtitle2" color="text.secondary">
                          Academic Year:{" "}
                          {semester === "summer"
                            ? schoolyear
                            : `${schoolyear} - ${schoolyear + 1}`}
                        </Typography>

                        <Box
                          display="flex"
                          justifyContent="space-between"
                          alignItems="center"
                          my={1}
                        >
                          <Typography variant="h6">
                            {semester === "summer"
                              ? "Summer"
                              : `${semester} Semester`}
                          </Typography>
                          <Chip
                            label={withinDuration ? "Open" : "Closed"}
                            color={withinDuration ? "primary" : "error"}
                            size="small"
                            sx={{
                              textTransform: "uppercase",
                              fontWeight: "bold",
                              color: "#fff",
                            }}
                          />
                        </Box>

                        <Typography
                          variant="body2"
                          color="text.secondary"
                          mb={1}
                        >
                          <span
                            style={{
                              fontWeight:
                                term_type === "midterm" ? "bold" : "normal",
                              color:
                                term_type === "midterm" ? "#000" : "#b0b0b0",
                              textDecoration:
                                term_type === "midterm"
                                  ? "none"
                                  : "line-through",
                            }}
                          >
                            Midterm
                          </span>{" "}
                          •{" "}
                          <span
                            style={{
                              fontWeight:
                                term_type === "endterm" ? "bold" : "normal",
                              color:
                                term_type === "endterm" ? "#000" : "#b0b0b0",
                              textDecoration:
                                term_type === "endterm"
                                  ? "none"
                                  : "line-through",
                            }}
                          >
                            Endterm
                          </span>
                        </Typography>

                        <Box
                          sx={{
                            backgroundColor: "#eeeeee",
                            padding: 1,
                            borderRadius: 1,
                            borderLeft: "3px solid #666",
                            mt: 1,
                          }}
                        >
                          <Typography variant="caption" color="text.secondary">
                            Duration
                          </Typography>
                          <Typography variant="body1">
                            <strong>
                              {dateFormatter(from)} to {dateFormatter(to)}
                            </strong>
                          </Typography>
                        </Box>
                      </Paper>
                    </Box>
                  );
                } else {
                  return "";
                }
              }
            )}
        </Box>
      </Box>
    </React.Suspense>
  );
};

export default Start;
