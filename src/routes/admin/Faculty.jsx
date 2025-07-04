import { DataGrid } from "@mui/x-data-grid";
import React from "react";
import {
  Box,
  Button,
  IconButton,
  Typography,
  Tooltip,
  useMediaQuery,
  ButtonGroup,
  Dialog,
  DialogTitle,
  DialogContent,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  CircularProgress,
} from "@mui/material";
import {
  Close,
  People,
  Print,
  Subject as SubjectIcon,
  Settings as SettingsIcon,
  Keyboard as KeyboardIcon,
  UploadFile as UploadFileIcon,
} from "@mui/icons-material";
import { urlEncode } from "url-encode-base64";
import ViewStudentsDialog from "../../components/dialogs/ViewStudentsDialog";
// import { initialLoading, initialOpen } from "../../utils/admin-faculty.util";
import SubjectLoadDialog from "../../components/dialogs/SubjectLoadDialog";
import moment from "moment";
import { momentFormatDate, momentFormatDateOnly } from "../../utils/formatDate";
import { AdminSettingsServices } from "../../services/adminSettingsService";
import { AdminFacultyService } from "../../services/adminFacultyService";
import { useCookies } from "react-cookie";
import { useLoaderData, useNavigate } from "react-router";
import GradeTable from "./faculty/grades/gradeTable";
import useFeatureState from "../../hooks/useFeatureState";
const initialOpen = {
  subjectLoad: false,
  lockConfirmation: false,
  confirmation: false,
  scheduler: false,
  viewStudents: false,
  encodeGrades: true,
  uploadGradeSheet: false,
};

export const initialLoading = {
  fetchFaculty: false,
  encodeGrades: false,
  uploadGradeSheet: false,
  classLoad: false,
  viewStudents: false,
};
const Faculty = () => {
  const navigate = useNavigate();
  const { registrarActivityData } = useLoaderData();
  const [cookie] = useCookies(["accessLevel", "college_code"]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [loading, setLoading] = React.useState(initialLoading);
  const [open, setOpen] = React.useState(initialOpen);
  const [openSubjectLoad, setOpenSubjectLoad] = React.useState(false);
  const [encodeGrades, setEncodeGrades] = useFeatureState();
  const [encodeGradesGraduate, setEncodeGradesGraduate] = useFeatureState();
  const [uploadGradeSheet, setUploadGradeSheet] = useFeatureState();
  const [uploadGradeSheetGraduate, setUploadGradeSheetGraduate] = useFeatureState();
  const [filterData, setFilterData] = React.useState({
    schoolyear: new Date().getFullYear(),
    semester: "summer",
  });
  const handleChangeFilterData = (event) => {
    setFilterData((prevState) => ({
      ...prevState,
      [event.target.name]: event.target.value,
    }));
  };
  const [viewStudents, setViewStudents] = React.useState({
    rows: [],
    columns: [
      { field: "id", headerName: "ID", width: 150, hide: true },
      { field: "student_id", headerName: "STUDENT ID", width: 100 },
      { field: "name", headerName: "Full Name", width: 400 },
      { field: "mid_grade", headerName: "Midterm Grade", width: 150 },
      { field: "final_grade", headerName: "Endterm Grade", width: 150 },
      { field: "grade", headerName: "Grade", width: 100 },
      { field: "credit", headerName: "Credit", width: 100 },
      { field: "remarks", headerName: "Remarks", width: 100 },
      { field: "encoder", headerName: "Encoder", width: 200 },
      {
        field: "timestamp",
        headerName: "Timestamp",
        width: 200,
        valueGetter: (params) => {
          const timestamp = moment(params.row.timestamp).format(
            "MMM DD, YYYY hh:mm A"
          );
          return timestamp === "Invalid date" ? "" : timestamp;
        },
      },
    ],
  });

  const [subjectLoad, setSubjectLoad] = React.useState({
    rows: [],
    columns: [
      { field: "id", headerName: "ID", width: 150, hide: true },
      { field: "subject_code", headerName: "Subject Code", width: 150 },
      { field: "section", headerName: "Program/Year/Section", width: 200 },
      { field: "noStudents", headerName: "No of Students", width: 150 },
      {
        field: "timestamp",
        headerName: "Last Update",
        width: 200,
        valueGetter: (params) => {
          return momentFormatDate(params.row.timestamp) === "Invalid date"
            ? "--"
            : momentFormatDate(params.row.timestamp);
        },
      },
      {
        field: "submittedLog",
        headerName: "Submitted At",
        width: 200,
        valueGetter: (params) => {
          return momentFormatDate(params.row.submittedLog) === "Invalid date"
            ? "--"
            : momentFormatDate(params.row.submittedLog);
        },
      },
      {
        field: "deadline_extended",
        headerName: "Deadline Extended",
        width: 200,
        valueGetter: (params) => {
          return momentFormatDateOnly(params.row.deadline_extended) ===
            "Invalid date"
            ? "--"
            : momentFormatDateOnly(params.row.deadline_extended);
        },
      },
      {
        field: "classLoadStatus",
        headerName: "Status",
        width: 200,
        valueGetter: (params) => {
          return params.row.classLoadStatus ? "Locked" : "";
        },
      },
      {
        field: "action",
        headerName: "Action",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 200,
        renderCell: (params) => {
          const openViewStudentsHandler = async () => {
            setOpen((prevState) => ({ ...prevState, viewStudents: true }));
            const encoded = {
              class_code: urlEncode(params.row.id),
            };
            const { data } = await AdminFacultyService.getStudentsByClassCode(
              encoded.class_code
            );
            setViewStudents((prevState) => ({ ...prevState, rows: data.rows }));
          };
          const openSubjectCodesGSHandler = (isGraduate) => {
            const link = `/admin/print/${urlEncode(
              filterData.semester
            )}-${urlEncode(filterData.schoolyear)}/${urlEncode(params.row.id)}${
              isGraduate ? "/gs" : ""
            }`;
            return link;
          };
          const printGradeSheetLink = openSubjectCodesGSHandler(
            params.row.isGraduate
          );
          const handleClick = async (name) => {
            switch (name) {
              case "encodeGrades":
                setEncodeGrades((prevState) => ({
                  ...prevState,
                  open: true,
                  data: [params.row],
                }));
                break;
              case "uploadGradeSheet":
                setUploadGradeSheet((prevState) => ({
                  ...prevState,
                  open: true,
                  data: [params.row],
                }));
                break;
              default:
                console.warn(`No action defined for ${name}`);
            }
            // Here you can add the logic for each action
            // Simulate async action
            // await new Promise((res) => setTimeout(res, 2000));
          };
          return (
            <>
              <ButtonGroup variant="text" color="primary" aria-label="actions">
                <Tooltip title="Encode Grades">
                  <IconButton
                    aria-label="encode-grades"
                    color="primary"
                    onClick={() => handleClick(params.row.isGraduate ? "encodeGradesGraduate" : "encodeGrades")}
                    disabled={loading.encodeGrades}
                  >
                    {loading.encodeGrades ? (
                      <UploadFileIcon />
                    ) : (
                      <KeyboardIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title="Upload Grade Sheet">
                  <IconButton
                    aria-label="upload-grade-sheet"
                    color="primary"
                    onClick={() => handleClick("uploadGradeSheet")}
                    disabled={loading.uploadGradeSheet}
                  >
                    {loading.uploadGradeSheet ? (
                      <CircularProgress size={24} />
                    ) : (
                      <UploadFileIcon />
                    )}
                  </IconButton>
                </Tooltip>

                <Tooltip title="View Students">
                  <IconButton
                    aria-label="view"
                    variant="text"
                    color="primary"
                    name="viewStudents"
                    onClick={openViewStudentsHandler}
                  >
                    <People />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Print Grade Sheet">
                  <IconButton
                    aria-label="view"
                    variant="text"
                    color="primary"
                    onClick={() =>
                      window.open(
                        printGradeSheetLink,
                        "_blank",
                        `width=800,height=600,left=${
                          (window.screen.width - 800) / 2
                        },top=${(window.screen.height - 600) / 2}`
                      )
                    }
                  >
                    <Print />
                  </IconButton>
                </Tooltip>
              </ButtonGroup>
            </>
          );
        },
      },
    ],
  });

  const handleCloseSubjectLoad = () => {
    setOpenSubjectLoad(false);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150, hide: true },
    {
      field: "facultyName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      width: 460,
    },
    {
      field: "email",
      headerName: "Email Address",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 400,
    },
    {
      field: "college_code",
      headerName: "College",
      width: 150,
    },
    {
      field: "action",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 200,
      renderCell: (params) => {
        const handleOpen = async () => {
          setOpenSubjectLoad(true);
          const { data } =
            await AdminFacultyService.getSubjectLoadByFacultyIdYearAndSemester(
              urlEncode(params.row.faculty_id),
              urlEncode(filterData.schoolyear),
              urlEncode(filterData.semester)
            );
          setSubjectLoad((prevState) => ({ ...prevState, rows: data }));
        };

        return (
          <>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Tooltip title="View">
                <IconButton
                  name="subjectLoad"
                  aria-label="view"
                  variant="text"
                  color="primary"
                  onClick={handleOpen}
                >
                  <SubjectIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </>
        );
      },
    },
  ];

  const closeHandler = {
    viewStudents: () => setOpen({ viewStudents: false }),
    subjectLoad: () => setOpen({ subjectLoad: false }),
  };
  const [openFilterModal, setOpenFilterModal] = React.useState(false);
  const handleOpenFilterYearAndSemester = () => {
    setOpenFilterModal(true);
  };
  const handleCloseFilterYearAndSemester = (panel) => {
    setOpenFilterModal(false);
  };
  const [data, setData] = React.useState({
    faculty: [],
  });
  const handleFetchData = async () => {
    if (data.faculty.length > 0) {
      setData((prevState) => ({ ...prevState, faculty: [] }));
    }
    const { data: queryData } =
      await AdminFacultyService.getFacultyBySchoolYearAndSemester(
        filterData.schoolyear,
        filterData.semester,
        cookie.accessLevel,
        cookie.college_code
      );
    setData((prevState) => ({ ...prevState, faculty: queryData.rows }));
  };
  React.useEffect(() => {
    const handleFetchFacultyList = async () => {
      setLoading((prevState) => ({ ...prevState, fetchFaculty: true }));
      const { data: queryData } =
        await AdminFacultyService.getFacultyBySchoolYearAndSemester(
          registrarActivityData[0].schoolyear,
          registrarActivityData[0].semester,
          cookie.accessLevel,
          cookie.college_code
        );
      setData((prevState) => ({ ...prevState, faculty: queryData.rows }));
      setLoading((prevState) => ({ ...prevState, fetchFaculty: false }));
    };
    if (registrarActivityData.length > 0) {
      setFilterData({
        schoolyear: registrarActivityData[0].schoolyear,
        semester: registrarActivityData[0].semester,
      });
      handleFetchFacultyList();
    }
  }, [registrarActivityData]);
  React.useEffect(() => {
    console.log("Encode Grades State: ", encodeGrades);
  }, [encodeGrades]);
  React.useEffect(() => {
    console.log("Upload Grade Sheet State: ", uploadGradeSheet);
  }, [uploadGradeSheet]);
  return (
    <>
      <Alert severity="info">
        FILTER SCHOOL YEAR AND SEMESTER TO SHOW LIST OF FACULTY IN FILTER BUTTON
      </Alert>
      <br />
      <Box
        sx={{
          display: "flex",
          flexDirection: "row",
          justifyContent: "space-between",
          alignItems: "center",
          width: "100%",
        }}
      >
        <Typography
          variant="h4"
          fontWeight={700}
          component="div"
          marginBottom={3}
          sx={{ flexGrow: 1 }}
        >
          LIST OF FACULTY
        </Typography>
        <Button
          variant="contained"
          onClick={handleOpenFilterYearAndSemester}
          sx={{ color: "white" }}
          startIcon={<SettingsIcon />}
        >
          FILTER
        </Button>
      </Box>
      <Box sx={{ width: "100%" }}>
        <Box
          borderRadius={"10px"}
          border={"1px solid var(--border-default)"}
          className="usersTable"
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
            height: 500,
          }}
        >
          <Typography variant="h6" gutterBottom>
            {`Academic Year: ${
              filterData.semester === "summer"
                ? filterData.schoolyear
                : filterData.schoolyear +
                  "-" +
                  (parseInt(filterData.schoolyear) + 1)
            }, ${
              filterData.semester === "summer"
                ? "Summer"
                : filterData.semester + " Semester"
            } `}
          </Typography>
          <DataGrid
            rows={data.faculty}
            columns={columns}
            loading={loading.fetchFaculty}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            pageSizeOptions={[5, 10, 25]}
          />
        </Box>
      </Box>

      {/* Modal for Subject Load */}
      <SubjectLoadDialog
        open={openSubjectLoad}
        close={handleCloseSubjectLoad}
        isSmallScreen={isSmallScreen}
        data={subjectLoad}
      />

      <ViewStudentsDialog
        open={open.viewStudents}
        close={closeHandler.viewStudents}
        data={viewStudents}
      />

      <Dialog
        open={openFilterModal}
        onClose={handleCloseFilterYearAndSemester}
        aria-labelledby={"dialog-confirmation"}
      >
        <DialogTitle id={"dialog-confirmation-title"}>
          FILTER YEAR AND SEMESTER
        </DialogTitle>
        <IconButton
          aria-label="close"
          onClick={handleCloseFilterYearAndSemester}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
        <DialogContent dividers>
          <Box sx={{ display: "flex", flexDirection: "column", gap: 1 }}>
            <FormControl
              sx={{
                display: "flex",
                flexDirection: "row",
                gap: 1,
                flexGrow: 1,
              }}
              fullWidth
            >
              <TextField
                id="select-schoolyear-from"
                name="schoolyear"
                label="School Year"
                type="number"
                value={filterData.schoolyear}
                onChange={handleChangeFilterData}
                fullWidth
              />
              <TextField
                id="select-schoolyear-to"
                name="schoolyear"
                label="School Year"
                value={
                  filterData.schoolyear
                    ? parseInt(filterData.schoolyear) + 1
                    : ""
                }
                readOnly
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="select-semester-label">Semester</InputLabel>
              <Select
                id="select-semester"
                label="Semester"
                name="semester"
                value={filterData.semester}
                onChange={handleChangeFilterData}
                required
              >
                <MenuItem value="summer">Summer</MenuItem>
                <MenuItem value="1st">1st Semester</MenuItem>
                <MenuItem value="2nd">2nd Semester</MenuItem>
              </Select>
            </FormControl>
            <Button
              variant="contained"
              onClick={handleFetchData}
              sx={{ color: "white" }}
              disabled={
                filterData.schoolyear === "" || filterData.semester === ""
              }
            >
              Filter
            </Button>
            <Typography variant="body1" color="initial">
              Result: {data.faculty.length}
            </Typography>
          </Box>
        </DialogContent>
      </Dialog>
      {encodeGrades.open && (
        <GradeTable
          open={true}
          handleClose={encodeGrades.handleClose}
          data={encodeGrades.data}
        />
      )}

      {encodeGradesGraduate.open && (
        <GradeTable
          open={true}
          handleClose={encodeGradesGraduate.handleClose}
          data={encodeGradesGraduate.data}
        />
      )}
    </>
  );
};
export default Faculty;

export const loader = async () => {
  const { data } = await AdminSettingsServices.getRegistrarActivity();
  const filteredData = Array.isArray(data)
    ? data.filter((item) => item.currentSem === 1)
    : [];

  return { registrarActivityData: filteredData };
};
