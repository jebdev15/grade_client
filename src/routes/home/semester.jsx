import React, { useState } from "react";
import {
  Avatar,
  Box,
  Button,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Container,
  Divider,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  useParams,
  useNavigate,
  useLoaderData,
  Outlet,
} from "react-router-dom";
import { Class, Download, Face, Home } from "@mui/icons-material";
import axios from "axios";
import { useCookies } from "react-cookie";
import moment from "moment";
const Semester = () => {
  const { code } = useParams();
  const [cookies] = useCookies(["faculty_id"]);
  const [semester, currentSchoolYear] = code.split("-");

  const navigate = useNavigate();
  const { loads } = useLoaderData();

  const [manualOpen, setManualOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);

  const LoadCard = ({
    subject_code,
    section,
    noStudents,
    class_code,
    timestamp,
    method,
  }) => {
    return (
      <Card variant="outlined" sx={{}}>
        <CardHeader
          title={subject_code}
          subheader={section}
          avatar={
            <Avatar sx={{ bgcolor: "white" }}>
              <Class color="success" />
            </Avatar>
          }
          sx={{
            bgcolor: "success.main",
            "& .MuiCardHeader-title": {
              fontWeight: 600,
              color: "white",
              textTransform: "uppercase",
            },
            "& .MuiCardHeader-subheader": {
              color: "white",
            },
          }}
        />
        <CardContent>
          <Box
            sx={{
              display: "flex",
            }}
          >
            {/* <Box sx={{ display: "flex", flexDirection: "column", flex: 3 }}>
              <Typography variant="body2" textAlign="center">
                Remarks:
              </Typography>
              <Divider />
              <Typography variant="caption" sx={{ ml: 1 }}>
                <strong>Passed: 40</strong>
              </Typography>
              <Typography variant="caption" sx={{ ml: 1 }}>
                Failed: 0
              </Typography>
              <Typography variant="caption" sx={{ ml: 1 }}>
                INC: 0
              </Typography>
              <Typography variant="caption" sx={{ ml: 1 }}>
                Dropped: 0
              </Typography>
              <Typography variant="caption" sx={{ ml: 1 }}>
                No Attendance: 0
              </Typography>
            </Box> */}

            <Box
              sx={{
                flex: 5,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
              }}
            >
              <Typography variant="body2">Last Update</Typography>
              <Typography variant="body2" fontWeight={600}>
                {timestamp
                  ? moment(timestamp).format("MMM DD, YYYY hh:mm A")
                  : "-"}
                {" - "}
                {method || ""}
              </Typography>
              {/* <Box sx={{ width: 150, bgcolor: "success.light", py: 2 }}>
                <Typography
                  variant="body2"
                  textAlign="center"
                  sx={{ color: "white" }}
                >
                  Progress
                </Typography>{" "}
                <Typography
                  variant="h4"
                  sx={{
                    fontWeight: 700,
                    textAlign: "center",
                    color: "success.dark",
                  }}
                >
                  100%
                </Typography>
              </Box> */}
            </Box>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Chip
            icon={<Face />}
            color="success"
            label={`${noStudents} students`}
          />
          <ButtonGroup>
            <Button
              variant="contained"
              color="success"
              size="small"
              onClick={() => {
                navigate(
                  `/home/${semester}-${currentSchoolYear}-${cookies.faculty_id}/${class_code}`
                );
                setManualOpen(true);
              }}
            >
              Manual
            </Button>
            <Button
              color="success"
              variant="contained"
              size="small"
              onClick={() => {
                navigate(
                  `/home/${semester}-${currentSchoolYear}-${cookies.faculty_id}/upload/${class_code}`
                );
                setUploadOpen(true);
              }}
            >
              Upload
            </Button>
           
          </ButtonGroup>
        </CardActions>
      </Card>
    );
  };
  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>
        {` ${semester?.toUpperCase()} ${
          semester === "summer" ? "" : "SEMESTER"
        }`}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/home")}>
          <Home sx={{ fontSize: 20 }} />
        </IconButton>
        <span>/</span>
        <Typography variant="caption" fontSize={12} sx={{ mx: 1 }}>
          {`${currentSchoolYear} - ${currentSchoolYear + 1}`}
        </Typography>
        <span>/</span>
        <Typography variant="caption" fontSize={12} sx={{ mx: 1 }}>
          {semester}
        </Typography>
      </Box>

      <Box sx={{ mt: 2, overflowY: "auto", maxHeight: "75vh" }}>
        <Box sx={{ p: 3, width: "100%" }}>
          <Outlet
            context={[manualOpen, setManualOpen, uploadOpen, setUploadOpen]}
          />

          <Container maxWidth="xl" fixed>
            {loads ? (
              <Grid container columnSpacing={3} rowSpacing={5}>
                {loads.map((load) => (
                  <Grid key={load.class_code} item xs={4} md={3}>
                    <LoadCard {...load} />
                  </Grid>
                ))}
                {loads.length === 0 ? (
                  <Typography sx={{ mt: 3 }} variant="h5">
                    No class load in record.
                  </Typography>
                ) : null}
              </Grid>
            ) : (
              <Typography>Loading...</Typography>
            )}
          </Container>
        </Box>
        {/* <Outlet context={[currentSchoolYear]} /> */}
      </Box>
    </Box>
  );
};
export const loader = async ({ params }) => {
  const { code } = params;
  const [semester, currentSchoolYear, faculty_id] = code.split("-");

  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/getLoad?faculty_id=${faculty_id}&school_year=${currentSchoolYear}&semester=${semester}`
  );
  const loads = data;

  return { loads };
};
export default Semester;
