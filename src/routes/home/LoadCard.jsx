import React from "react";
import { identifyPrintLink, submittedGradeSheetMessage } from "../../utils/semester.utils";
import {
  Avatar,
  Box,
  ButtonGroup,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  Divider,
  IconButton,
  Typography,
  Tooltip,
} from "@mui/material";
import {
  Class,
  Face,
  FolderOpen,
  Keyboard,
  Print,
  Article,
  Task as TaskIcon,
} from "@mui/icons-material";
import moment from "moment";
import { urlEncode } from "url-encode-base64";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router";
import { HomeSemesterServices } from "../../services/homeSemesterService";
const LoadCard = ({
  canUpload,
  currentSchoolYear,
  semester,
  dbTermType,
  setManualOpen,
  setUploadOpen,
  subject_code,
  section,
  noStudents,
  class_code,
  midterm_timestamp,
  endterm_timestamp,
  midterm_submitted_timestamp,
  endterm_submitted_timestamp,
  isGraduateStudies,
  is_deadline_extended,
  classLoadStatus
}) => {
  const [cookies] = useCookies(["faculty_id", "email"]);
  const navigate = useNavigate();
  const [loading, setLoading] = React.useState({
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
    }, 2000);
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

  const encodedClassCode = urlEncode(class_code);
  const printLink = identifyPrintLink(
    isGraduateStudies,
    semester,
    currentSchoolYear,
    cookies,
    encodedClassCode
  );
  const semesterFunctions = {
    encodeToolTipTitle: () => {
      if ((canUpload || is_deadline_extended) && !(classLoadStatus)) {
        return "Encoding of Grades";
      }
      return "View Grades";
    },
    encodeRenderIcon: () => {
      if ((canUpload || is_deadline_extended) && !(classLoadStatus)) {
        return <Keyboard />;
      }
      return <Article />;
    },
  };
  const handleFolderOpen = () => {
    navigate(uploadLink);
    setUploadOpen(true);
    uploadTimer();
  };
  const handleDirectEncode = () => {
    const url = directEncodeUrl;
    navigate(url);
    setManualOpen(true);
    manualTimer();
  };
  const handlePrintGradeSheet = () =>
    window.open(
      printLink,
      "_blank",
      `width=800,height=600,left=${(window.screen.width - 800) / 2},top=${
        (window.screen.height - 600) / 2
      }`
    );
  const handleSubmitGradeSheetConfirmation = async (class_code, term_type) => {
      const { data } = await HomeSemesterServices.submitGradeSheetConfirmation(semester, currentSchoolYear, class_code);
      const alertMessage = submittedGradeSheetMessage(data)
      const confirmation = window.confirm(alertMessage)
      if(!confirmation) return
      await submitGradeSheetConfirmed(class_code, term_type)
  }

  const submitGradeSheetConfirmed = async (class_code, term_type) => {
    const formData = new FormData();
    formData.append("class_code", class_code);
    formData.append("email_used", cookies.email);
    formData.append("term_type", term_type);

    const { data } = await HomeSemesterServices.submitGradeSheet(formData);
    console.log(data);
    navigate(".", { replace: true });
    alert("Grade Sheet has been submitted.");
  }
  const disableEncodeIcon = loading.manual || loading.upload || loading.print;
  const disableFolderOpenIcon =
    loading.manual || loading.upload || loading.print || !canUpload || classLoadStatus;
  const disablePrintIcon =
    (dbTermType === "midterm" && !midterm_timestamp) ||
    (dbTermType === "finalterm" && !endterm_timestamp);
  const disableSubmitIcon = loading.manual || loading.upload || loading.print || !canUpload || classLoadStatus;
  const uploadLink = `/home/${semester}-${currentSchoolYear}-${urlEncode(
    cookies.faculty_id
  )}/upload/${encodedClassCode}${isGraduateStudies ? "/gs" : ""}`;
  const midtermTimestamp = midterm_timestamp
    ? moment(midterm_timestamp).format("MMM DD, YYYY hh:mm A")
    : "-";
  const endtermTimestamp = endterm_timestamp
    ? moment(endterm_timestamp).format("MMM DD, YYYY hh:mm A")
    : "-";
  const midtermSubmittedTimestamp = midterm_submitted_timestamp
    ? moment(midterm_submitted_timestamp).format("MMM DD, YYYY hh:mm A")
    : "-";
  const endtermSubmittedTimestamp = endterm_submitted_timestamp
    ? moment(endterm_submitted_timestamp).format("MMM DD, YYYY hh:mm A")
    : "-";
  const directEncodeUrl = isGraduateStudies
    ? `/home/${semester}-${currentSchoolYear}-${urlEncode(
        cookies.faculty_id
      )}/${encodedClassCode}/graduateStudies`
    : `/home/${semester}-${currentSchoolYear}-${urlEncode(
        cookies.faculty_id
      )}/${encodedClassCode}`;
  return (
    <Card variant="outlined">
      <CardHeader
        title={
          isGraduateStudies ? `${subject_code}(Graduate Studies)` : subject_code
        }
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
            <Typography variant="caption">
              <b>Last Update:</b>{" "}
              {dbTermType === "midterm" ? midtermTimestamp : endtermTimestamp}
            </Typography>
            <Typography variant="caption">
              <b>Submitted:</b>{" "}
              {dbTermType === "midterm" ? midtermSubmittedTimestamp : endtermSubmittedTimestamp}
            </Typography>
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
                size="small"
                aria-label=""
                onClick={handleDirectEncode}
                disabled={disableEncodeIcon}
              >
                {semesterFunctions.encodeRenderIcon()}
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Grade Sheet">
            <span>
              <IconButton
                color="primary"
                size="small"
                aria-label=""
                onClick={handleFolderOpen}
                disabled={disableFolderOpenIcon}
              >
                <FolderOpen />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Submit gradesheet">
            <span>
              <IconButton 
                onClick={() => handleSubmitGradeSheetConfirmation(class_code, dbTermType)}
                color="primary" 
                size="small" 
                aria-label=""
                disabled={disableSubmitIcon}
              >
                <TaskIcon />
              </IconButton>
            </span>
          </Tooltip>
          <Tooltip title="Print Grade Sheet">
            <span>
              <IconButton
                color="primary"
                size="small"
                aria-label=""
                onClick={handlePrintGradeSheet}
                disabled={disablePrintIcon}
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

export default LoadCard;