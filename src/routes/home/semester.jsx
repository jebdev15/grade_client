import React, { useEffect, useState } from "react";
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
  Task as TaskIcon,
} from "@mui/icons-material";
import axios from "axios";
import { useCookies } from "react-cookie";
import moment from "moment";
import { urlEncode, urlDecode } from "url-encode-base64";
import { dateFormatter } from "../../utils/formatDate";
import { useFetch } from "../../hooks/useFetch";
import { extractSubjectCode, identifyGraduateStudiesLoad, identifyPrintLink } from "../../utils/semester.utils";

const Semester = () => {
  const { code } = useParams();
  const [cookies] = useCookies(["faculty_id", "email"]);
  const [semester, currentSchoolYear] = code.split("-");

  const navigate = useNavigate();
  const { loads, dbSchoolYear, dbSemester, dbTo } = useLoaderData();

  const [manualOpen, setManualOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
  const [graduateStudies, setGraduateStudies] = useState([]);
  const [loading, setLoading] = useState({
    manual: false,
    upload: false,
    lockGradeSheet: false,
    print: false,
  });

  const manualTimer = () => {
    setLoading((prevState) => ({
      ...prevState,
      manual: !prevState.manual,
      upload: !prevState.upload,
      lockGradeSheet: !prevState.lockGradeSheet,
      print: !prevState.print,
    }));
    setTimeout(() => {
      setLoading((prevState) => ({
        ...prevState,
        manual: !prevState.manual,
        upload: !prevState.upload,
        lockGradeSheet: !prevState.lockGradeSheet,
        print: !prevState.print,
      }));
    }, 1500);
  };
  const uploadTimer = () => {
    setLoading((prevState) => ({
      ...prevState,
      manual: !prevState.manual,
      upload: !prevState.upload,
      lockGradeSheet: !prevState.lockGradeSheet,
      print: !prevState.print,
    }));
    setTimeout(() => {
      setLoading((prevState) => ({
        ...prevState,
        manual: !prevState.manual,
        upload: !prevState.upload,
        lockGradeSheet: !prevState.lockGradeSheet,
        print: !prevState.print,
      }));
    }, 1500);
  };
  const lockGradeSheetTimer = () => {
    setLoading((prevState) => ({
      ...prevState,
      manual: !prevState.manual,
      upload: !prevState.upload,
      lockGradeSheet: !prevState.lockGradeSheet,
      print: !prevState.print,
    }));
    setTimeout(() => {
      setLoading((prevState) => ({
        ...prevState,
        manual: !prevState.manual,
        upload: !prevState.upload,
        lockGradeSheet: !prevState.lockGradeSheet,
        print: !prevState.print,
      }));
    }, 3000);
  };

  const decodedSemester = urlDecode(semester);
  const decodedSchoolYear = urlDecode(currentSchoolYear);

  const getcurrentDate = Date.now();
  const currentDate = dateFormatter(getcurrentDate);
  const systemScheduledDueDate = dateFormatter(dbTo);

  const checkDate = new Date(currentDate) <= new Date(systemScheduledDueDate);
  const checkSchoolYear = dbSchoolYear === parseInt(decodedSchoolYear);
  const checkSemester = dbSemester === decodedSemester;
  const canUpload = checkDate && checkSchoolYear && checkSemester;
  const graduateStudiesLoads = useFetch('getGraduateStudiesLoad');
  useEffect(() => {
    const graduateStudiesSubjectCodes = extractSubjectCode(graduateStudiesLoads);
    setGraduateStudies(graduateStudiesSubjectCodes);
  }, [graduateStudiesLoads]);
  const LoadCard = ({
    subject_code,
    status,
    section,
    noStudents,
    class_code,
    timestamp,
    method,
    submittedLog,
  }) => {
    const encodedClassCode = urlEncode(class_code);
    const submitGradeSheetConfirmation = async (classCode) => {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/getClassStudents?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${encodedClassCode}`
      );
      const filterNoMidtermGrade = data.filter(student => ['',0,'null'].includes(student.midTermGrade))
      const filterNoEndtermGrade = data.filter(student => ['',0,'null'].includes(student.endTermGrade))
      const midTermAlert = filterNoMidtermGrade.length > 0 ? `There are ${filterNoMidtermGrade.length} students without a midterm grade` : "";
      const endTermAlert = filterNoEndtermGrade.length > 0 ? `There are ${filterNoEndtermGrade.length} students without an endterm grade` : "";
      const alertMessage = `Are you sure you want to submit this grade sheet? Once submitted, it cannot be edited. \n #Contact Registrar for Grades Revision\n${midTermAlert}\n${endTermAlert}`
      const confirmation = window.confirm(alertMessage)
      if(!confirmation) return
      await submitGradeSheetConfirmed(classCode)
    }

    const submitGradeSheetConfirmed = async (classCode) => {
      lockGradeSheetTimer()
      const formData = new FormData();
      formData.append("class_code", encodedClassCode);
      formData.append("status", 0)
      formData.append("email_used", cookies.email)
      await axios.post(
        `${process.env.REACT_APP_API_URL}/admin/updateClassCodeStatus`,
        formData,
        {
          headers: {
            "Content-Type": "application/json",
          },
        }
      );
      navigate(".", { replace: true });
      setTimeout(() => alert("Grade Sheet has been submitted."), 1000)
    }
    const checkIfGraduateStudiesLoad = identifyGraduateStudiesLoad(graduateStudies, subject_code);
    const printLink = identifyPrintLink(checkIfGraduateStudiesLoad, semester, currentSchoolYear, cookies, encodedClassCode);
    
    return (
      <Card variant="outlined">
        <CardHeader
          title={checkIfGraduateStudiesLoad ? `${subject_code}(Graduate Studies)` : subject_code}
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
                alignItems: "flex-start",
                justifyContent: "center",
              }}
            >
              <Typography variant="caption"><b>Encoded:</b> {timestamp
                  ? moment(timestamp).format("MMM DD, YYYY hh:mm A")
                  : "-"}
                {" - "}
                {method || ""}</Typography>
              <Typography variant="caption"><b>Submitted:</b> {timestamp
                  // ? moment(submittedLog).format("MMM DD, YYYY hh:mm A")
                  ? moment(submittedLog).format("MMM DD, YYYY hh:mm A") === 'Invalid date' 
                    ? '- -' : moment(submittedLog).format("MMM DD, YYYY hh:mm A")
                  : "- -"}</Typography>
            </Box>
          </Box>
        </CardContent>
        <Divider />
        <CardActions sx={{ justifyContent: "space-between" }}>
          <Tooltip title={`${noStudents} students`}>
            <Chip
              icon={<Face />}
              color="primary"
              label={`${noStudents}`}
              sx={{ color: "text.light" }}
            />
          </Tooltip>
          <ButtonGroup>
            <Tooltip
              title={
                canUpload && parseInt(status) === 0
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
                    const url = checkIfGraduateStudiesLoad ? `/home/${semester}-${currentSchoolYear}-${urlEncode(cookies.faculty_id)}/${encodedClassCode}/graduateStudies` : `/home/${semester}-${currentSchoolYear}-${urlEncode(cookies.faculty_id)}/${encodedClassCode}` ;
                    navigate(url);
                    setManualOpen(true);
                    manualTimer();
                  }}
                  disabled={loading.manual || loading.upload || loading.lockGradeSheet || loading.print ? true : false}
                >
                  {
                    (canUpload && parseInt(status) === 0)
                      ? ( <Keyboard /> ) 
                      : ( <Visibility /> )
                  }
                </IconButton>
              </span>
            </Tooltip>
            {(canUpload && parseInt(status) === 0 && (!checkIfGraduateStudiesLoad)) && (
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
                    disabled={loading.manual || loading.upload || loading.lockGradeSheet || loading.print ? true : false}
                  >
                    <FolderOpen />
                  </IconButton>
                </span>
              </Tooltip>
            )}
            {canUpload && parseInt(status) === 0 && (
              <Tooltip title="Submit grade sheet. You may not able to edit or upload grades. To edit or upload grades, please contact your administrator.">
                <span>
                  <IconButton
                    color="primary"
                    size="large"
                    aria-label=""
                    onClick={() => submitGradeSheetConfirmation(encodedClassCode)}
                    disabled={loading.manual || loading.upload || loading.lockGradeSheet || loading.print ? true : false}
                  >
                    <TaskIcon />
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
                    href={printLink}
                    target="_blank"
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
    to: dbTo,
  } = data2[0];

  return { loads, dbSchoolYear, dbSemester, dbTo };
};
export default Semester;
