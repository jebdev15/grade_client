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
  Task as TaskIcon,
  Article,
  InsertDriveFile,
} from "@mui/icons-material";
import { useCookies } from "react-cookie";
import moment from "moment";
import { urlEncode, urlDecode } from "url-encode-base64";
import { dateFormatter } from "../../utils/formatDate";
import { identifyPrintLink, submittedGradeSheetMessage, submittedMidtermGradeSheetMessage } from "../../utils/semester.utils";
import { HomeSemesterServices } from "../../services/homeSemesterService";

const Semester = () => {
  const { code } = useParams();
  const [cookies] = useCookies(["faculty_id", "email"]);
  const [semester, currentSchoolYear] = code.split("-");

  const navigate = useNavigate();
  const { loads, dbSchoolYear, dbSemester, dbTo, dbTermType } = useLoaderData();

  const [manualOpen, setManualOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);
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
  const LoadCard = ({
    subject_code,
    status,
    section,
    noStudents,
    class_code,
    midterm_timestamp,
    endterm_timestamp,
    midterm_method,
    endterm_method,
    midterm_submittedLog,
    endterm_submittedLog,
    isGraduateStudies,
    midterm_status
  }) => {
    const encodedClassCode = urlEncode(class_code);
    const submitGradeSheetConfirmation = async (classCode) => {
      // const { data } = await axios.get(
      //   `${process.env.REACT_APP_API_URL}/getClassStudents?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${encodedClassCode}`
      // );
      const { data } = await HomeSemesterServices.submitGradeSheetConfirmation(semester, currentSchoolYear, encodedClassCode);
      const alertMessage = submittedGradeSheetMessage(data)
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
      // await axios.post(
      //   `${process.env.REACT_APP_API_URL}/submitGradeSheet`,
      //   formData,
      //   {
      //     headers: {
      //       "Content-Type": "application/json",
      //     },
      //   }
      // );
      const { data } = await HomeSemesterServices.submitGradeSheet(formData);
      console.log(data);
      navigate(".", { replace: true });
      alert("Grade Sheet has been submitted.");
    }

    const submitMidtermGradeSheetConfirmation = async (classCode) => {
      const { data } = await HomeSemesterServices.submitGradeSheetConfirmation(semester, currentSchoolYear, encodedClassCode);
      const alertMessage = submittedMidtermGradeSheetMessage(data)
      const confirmation = window.confirm(alertMessage)
      if(!confirmation) return
      await submitMidtermGradeSheetConfirmed(classCode)
    }

    const submitMidtermGradeSheetConfirmed = async (classCode) => {
      lockGradeSheetTimer()
      const formData = new FormData();
      formData.append("class_code", encodedClassCode);
      formData.append("email_used", cookies.email)

      const { data } = await HomeSemesterServices.submitMidtermGradeSheet(formData);
      console.log(data);
      navigate(".", { replace: true });
      alert("Grade Sheet has been submitted.");
    }
    const printLink = identifyPrintLink(isGraduateStudies, semester, currentSchoolYear, cookies, encodedClassCode);
    const semesterFunctions = {
      encodeToolTipTitle: () => {
        if (canUpload) {
          if(dbTermType === 'midterm') {
            if (midterm_status !== 1) {
              return "Encoding of Grades";
            }
          } else if(dbTermType === 'finalterm') {
            if (parseInt(status) === 0) {
              return "Encoding of Grades"
            } 
            return "View Grades";
          }
          return "View Grades";
        }
        return "View Grades";
      },
      encodeRenderIcon: () => {
        if (canUpload) {
          if(dbTermType === 'midterm') {
            if (midterm_status !== 1) {
              return <Keyboard />;
            }
          } else if(dbTermType === 'finalterm') {
            if (parseInt(status) === 0) {
              return <Keyboard />
            } 
            return <Article />;
          }
          return <Article />;
        }
        return <Article />;
      }
    }
    return (
      <Card variant="outlined">
        <CardHeader
          title={isGraduateStudies ? `${subject_code}(Graduate Studies)` : subject_code}
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
              {dbTermType === 'midterm' 
              ?<Typography variant="caption"><b>Encoded:</b> {midterm_timestamp
                ? moment(midterm_timestamp).format("MMM DD, YYYY hh:mm A")
                : "-"}
              {" - "}
              {midterm_method || ""}</Typography>
              : <Typography variant="caption"><b>Encoded:</b> {endterm_timestamp
                ? moment(endterm_timestamp).format("MMM DD, YYYY hh:mm A")
                : "-"}
              {" - "}
              {endterm_method || ""}</Typography>}
                {dbTermType === 'midterm' 
                ? <Typography variant="caption"><b>Submitted:</b> {midterm_timestamp
                  ? moment(midterm_submittedLog).format("MMM DD, YYYY hh:mm A") === 'Invalid date' 
                    ? '- -' : moment(midterm_submittedLog).format("MMM DD, YYYY hh:mm A")
                  : "- -"}</Typography>
                :  <Typography variant="caption"><b>Submitted:</b> {endterm_timestamp
                  ? moment(endterm_submittedLog).format("MMM DD, YYYY hh:mm A") === 'Invalid date' 
                    ? '- -' : moment(endterm_submittedLog).format("MMM DD, YYYY hh:mm A")
                  : "- -"}</Typography>}
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
            <Tooltip title={semesterFunctions.encodeToolTipTitle()}>
              <span>
                <IconButton
                  color="primary"
                  size="large"
                  aria-label=""
                  onClick={() => {
                    const url = isGraduateStudies ? `/home/${semester}-${currentSchoolYear}-${urlEncode(cookies.faculty_id)}/${encodedClassCode}/graduateStudies` : `/home/${semester}-${currentSchoolYear}-${urlEncode(cookies.faculty_id)}/${encodedClassCode}` ;
                    navigate(url);
                    setManualOpen(true);
                    manualTimer();
                  }}
                  disabled={loading.manual || loading.upload || loading.lockGradeSheet || loading.print ? true : false}
                >
                  {semesterFunctions.encodeRenderIcon()}
                </IconButton>
              </span>
            </Tooltip>
              <Tooltip title="Grade Sheet">
                <span>
                  <IconButton
                    color="primary"
                    size="large"
                    aria-label=""
                    onClick={() => {
                      if(!Boolean(isGraduateStudies)){
                        navigate(
                          `/home/${semester}-${currentSchoolYear}-${urlEncode(
                            cookies.faculty_id
                          )}/upload/${encodedClassCode}`
                        );
                        setUploadOpen(true);
                        uploadTimer();
                      } else {
                        console.log("Clicked.")
                      }
                    }}
                    disabled={loading.manual || loading.upload || loading.lockGradeSheet || loading.print ? true : false || Boolean(isGraduateStudies) || !canUpload || parseInt(status) === 1 || (dbTermType === 'midterm' && midterm_status === 1)}
                  >
                    <FolderOpen />
                  </IconButton>
                </span>
              </Tooltip>
              <Tooltip title="Submit midterm grade sheet ONLY. You may not able to edit or upload grades. To edit or upload grades, please contact your administrator.">
                <span>
                  <IconButton
                    color="primary"
                    size="large"
                    aria-label=""
                    onClick={() => submitMidtermGradeSheetConfirmation(encodedClassCode)}
                    disabled={loading.manual || loading.upload || loading.lockGradeSheet || loading.print ? true : false || dbTermType === 'finalterm' || midterm_status === 1}
                  >
                    <InsertDriveFile />
                  </IconButton>
                </span>
              </Tooltip>
             {canUpload && parseInt(status) === 0 && ( 
              <Tooltip title="Submit grade sheet. You may not able to edit or upload grades. To edit or upload grades, please contact your administrator.">
                <span>
                  <IconButton
                    color="primary"
                    size="large"
                    aria-label=""
                    onClick={() => {
                      submitGradeSheetConfirmation(encodedClassCode)
                    }}
                    disabled={loading.manual || loading.upload || loading.lockGradeSheet || loading.print ? true : false || dbTermType === 'midterm'}
                  >
                    <TaskIcon />
                  </IconButton>
                </span>
              </Tooltip>
             )}
            {(!canUpload || parseInt(status) === 1) && (
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
            )}
          </ButtonGroup>
        </CardActions>
      </Card>
    );
  };
  return (
    <Box>
      <Box
        sx={{ 
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
         }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {` ${decodedSemester?.toUpperCase()} ${
              decodedSemester === "summer" ? "" : "SEMESTER"
            }`}{dbTermType === "midterm" ? "(Midterm)" : "(Endterm)"}
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
        </Box>
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
  const [semester,currentSchoolYear,faculty_id,] = code.split("-");
  const { data:loads } = await HomeSemesterServices.getSubjectLoadByFacultyIdYearAndSemester(faculty_id,currentSchoolYear,semester)

  const { data:registrarActivity } = await HomeSemesterServices.getRegistrarActivityBySemester(semester);
  const { schoolyear: dbSchoolYear, semester: dbSemester, to: dbTo, term_type: dbTermType } = registrarActivity || {};
  return { loads, dbSchoolYear, dbSemester, dbTo, dbTermType };
  // return { dbSchoolYear, dbSemester, dbTo };
  // return { loads };
};
export default Semester;
