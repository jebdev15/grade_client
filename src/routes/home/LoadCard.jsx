import React from 'react'
import { identifyPrintLink } from "../../utils/semester.utils";
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
    // LockReset,
  } from "@mui/icons-material";
  import moment from "moment";
import { urlEncode } from "url-encode-base64";
import { useCookies } from 'react-cookie';
import { useNavigate } from 'react-router';
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
    midterm_method,
    endterm_method,
    isGraduateStudies,
    midterm_status,
    deadline_extended,
    is_deadline_extended
  }) => {
    const [cookies] = useCookies(["faculty_id", "email"]);
    const navigate = useNavigate()
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

    const encodedClassCode = urlEncode(class_code);
    const printLink = identifyPrintLink(isGraduateStudies, semester, currentSchoolYear, cookies, encodedClassCode);
    const semesterFunctions = {
    encodeToolTipTitle: () => {
      if (canUpload || is_deadline_extended) {
        return "Encoding of Grades";
      }
      return "View Grades";
    },
    encodeRenderIcon: () => {
      if (canUpload || is_deadline_extended) {
        return <Keyboard />;
      }
      return <Article />;
    }
  }
    const handleFolderOpen = () => {
        navigate(uploadLink);
        setUploadOpen(true);
        uploadTimer();
    }
    const handleDirectEncode = () => {
        const url = directEncodeUrl ;
        navigate(url);
        setManualOpen(true);
        manualTimer();
    }
    const handlePrintGradeSheet = () => window.open(printLink, "_blank", `width=800,height=600,left=${(window.screen.width - 800) / 2},top=${(window.screen.height - 600) / 2}`)
    const disableEncodeIcon = loading.manual || loading.upload || loading.print;
    const disableFolderOpenIcon = loading.manual || loading.upload || loading.print;
    const disablePrintIcon = (dbTermType === 'midterm' && !midterm_timestamp) || (dbTermType === 'finalterm' && !endterm_timestamp);
    const uploadLink = `/home/${semester}-${currentSchoolYear}-${urlEncode(cookies.faculty_id)}/upload/${encodedClassCode}${isGraduateStudies ? '/gs' : ''}`
    const midtermTimestamp = midterm_timestamp ? moment(midterm_timestamp).format("MMM DD, YYYY hh:mm A") : "-"
    const endtermTimestamp = endterm_timestamp ? moment(endterm_timestamp).format("MMM DD, YYYY hh:mm A") : "-"
    const directEncodeUrl = isGraduateStudies 
                            ? `/home/${semester}-${currentSchoolYear}-${urlEncode(cookies.faculty_id)}/${encodedClassCode}/graduateStudies` 
                            : `/home/${semester}-${currentSchoolYear}-${urlEncode(cookies.faculty_id)}/${encodedClassCode}`
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
                {
                    dbTermType === 'midterm' 
                    ?<Typography variant="caption"><b>Encoded:</b> {midtermTimestamp} {" - "} {midterm_method || ""}</Typography>
                    : <Typography variant="caption"><b>Encoded:</b> {endtermTimestamp} {" - "} {endterm_method || ""}</Typography>
                }
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
                {/* <Tooltip title="Request an extension for uploading grade">
                <span>
                  <IconButton
                    color="primary"
                    size="small"
                    aria-label=""
                  >
                    <LockReset />
                  </IconButton>
                </span>
              </Tooltip> */}
          </ButtonGroup>
        </CardActions>
      </Card>
    );
  };

export default LoadCard