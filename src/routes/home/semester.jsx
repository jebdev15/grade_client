import React, { useState } from "react";
import {
  Avatar,
  Box,
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
  Tooltip,
} from "@mui/material";
import {
  useParams,
  useNavigate,
  useLoaderData,
  Outlet,
} from "react-router-dom";
import {
  Class,
  Face,
  FolderOpen,
  Home,
  Keyboard,
  Print,
  Visibility,
} from "@mui/icons-material";
import axios from "axios";
import { useCookies } from "react-cookie";
import moment from "moment";
import { urlEncode, urlDecode } from "url-encode-base64";

const Semester = () => {
  const { code } = useParams();
  const [cookies] = useCookies(["faculty_id"]);
  const [semester, currentSchoolYear] = code.split("-");

  const navigate = useNavigate();
  const { loads, dbSchoolYear, dbSemester, dbStatus, dbTo } = useLoaderData();

  const [manualOpen, setManualOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const [loading, setLoading] = useState({
    manual: false,
    upload: false,
    print: false,
  });

  const manualTimer = () => {
    setLoading((prevState) => ({
      ...prevState,
      manual: !prevState.manual,
      upload: !prevState.upload,
      print: !prevState.print,
    }));
    setTimeout(() => {
      setLoading((prevState) => ({
        ...prevState,
        manual: !prevState.manual,
        upload: !prevState.upload,
        print: !prevState.print,
      }));
    }, 1500);
  };
  const uploadTimer = () => {
    setLoading((prevState) => ({
      ...prevState,
      manual: !prevState.manual,
      upload: !prevState.upload,
      print: !prevState.print,
    }));
    setTimeout(() => {
      setLoading((prevState) => ({
        ...prevState,
        manual: !prevState.manual,
        upload: !prevState.upload,
        print: !prevState.print,
      }));
    }, 1500);
  };

  const decodedSemester = urlDecode(semester);
  const decodedSchoolYear = urlDecode(currentSchoolYear);

  const dateFormatter = (date) => {
    const newDateTime = new Date(date);

    const formattedDate = newDateTime.toLocaleString("en-PH", {
      month: "long", // Full month name
      day: "numeric", // Day of the month
      year: "numeric", // Full year
    });

    return formattedDate;
  };
  const getcurrentDate = Date.now();
  const currentDate = dateFormatter(getcurrentDate);
  const systemScheduledDueDate = dateFormatter(dbTo);

  const checkDate = new Date(currentDate) <= new Date(systemScheduledDueDate);
  const checkSchoolYear = dbSchoolYear === parseInt(decodedSchoolYear);
  const checkSemester = dbSemester === decodedSemester;
  const canUpload = checkDate && checkSchoolYear && checkSemester;

  const LoadCard = ({
    subject_code,
    isLock,
    section,
    noStudents,
    class_code,
    timestamp,
    method,
  }) => {
    const encodedClassCode = urlEncode(class_code);
    return (
      <Card variant="outlined">
        <CardHeader
          title={subject_code}
          subheader={section}
          avatar={
            <Avatar sx={{ bgcolor: "white" }}>
              <Class color="primary" />
            </Avatar>
          }
          sx={{
            bgcolor: "primary.main",
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
            </Box>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Chip
            icon={<Face />}
            color="primary"
            label={`${noStudents} students`}
            sx={{ color: "text.light" }}
          />
          <ButtonGroup>
            <Tooltip
              title={
                canUpload && parseInt(isLock) === 0
                  ? "Encoding of Grades"
                  : "View Grades"
              }
            >
              <span>
                <IconButton
                  color="primary"
                  size="large"
                  aria-label=""
                  onClick={() => {
                    navigate(
                      `/home/${semester}-${currentSchoolYear}-${urlEncode(
                        cookies.faculty_id
                      )}/${encodedClassCode}`
                    );
                    setManualOpen(true);
                    manualTimer();
                  }}
                  disabled={loading.manual || loading.upload ? true : false}
                >
                  {canUpload && parseInt(isLock) === 0 ? (
                    <Keyboard />
                  ) : (
                    <Visibility />
                  )}
                </IconButton>
              </span>
            </Tooltip>
            {canUpload && parseInt(isLock) === 0 && (
              <Tooltip title="Grade Sheet">
                <span>
                  <IconButton
                    color="primary"
                    size="large"
                    aria-label=""
                    onClick={() => {
                      navigate(
                        `/home/${semester}-${currentSchoolYear}-${urlEncode(
                          cookies.faculty_id
                        )}/upload/${encodedClassCode}`
                      );
                      setUploadOpen(true);
                      uploadTimer();
                    }}
                    disabled={loading.manual || loading.upload ? true : false}
                  >
                    <FolderOpen />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            <Tooltip title="Print Grade Sheet">
              <span>
                <IconButton
                  color="primary"
                  size="large"
                  aria-label=""
                  onClick={() => {
                    navigate(
                      `/home/${semester}-${currentSchoolYear}-${urlEncode(
                        cookies.faculty_id
                      )}/print/${encodedClassCode}`
                    );
                    setPrintOpen(true);
                    manualTimer();
                  }}
                  // disabled={loading.manual || loading.upload ? true : false}
                >
                  <Print />
                </IconButton>
              </span>
            </Tooltip>
          </ButtonGroup>
        </CardActions>
      </Card>
    );
  };
  return (
    <Box>
      <Typography variant="h4" fontWeight={700}>
        {` ${decodedSemester?.toUpperCase()} ${
          decodedSemester === "summer" ? "" : "SEMESTER"
        }`}
      </Typography>
      <Box sx={{ display: "flex", alignItems: "center" }}>
        <IconButton onClick={() => navigate("/home")}>
          <Home sx={{ fontSize: 20 }} />
        </IconButton>
        <span>/</span>
        <Typography variant="caption" fontSize={12} sx={{ mx: 1 }}>
          {`${decodedSchoolYear} - ${parseInt(decodedSchoolYear) + 1}`}
        </Typography>
        <span>/</span>
        <Typography variant="caption" fontSize={12} sx={{ mx: 1 }}>
          {decodedSemester}
        </Typography>
      </Box>

      <Box sx={{ mt: 2, overflowY: "auto" }}>
        <Box sx={{ p: 3, width: "100%" }}>
          <Outlet
            context={[
              manualOpen,
              setManualOpen,
              uploadOpen,
              setUploadOpen,
              printOpen,
              setPrintOpen,
            ]}
          />

          <Container maxWidth="xl" fixed>
            {loads ? (
              <Grid
                className="semester-grid"
                container
                columnSpacing={3}
                rowSpacing={5}
              >
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

  const { data: data2 } = await axios.get(
    `${process.env.REACT_APP_API_URL}/getCurrentSchoolYear`
  );
  const {
    schoolyear: dbSchoolYear,
    semester: dbSemester,
    status: dbStatus,
    to: dbTo,
  } = data2[0];

  return { loads, dbSchoolYear, dbSemester, dbStatus, dbTo };
};
export default Semester;
