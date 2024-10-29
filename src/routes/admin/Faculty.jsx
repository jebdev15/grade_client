import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { Box, Button, IconButton, Typography, Tooltip, useMediaQuery, ButtonGroup, Dialog, DialogTitle, DialogContent, DialogContentText, DialogActions, FormControl, InputLabel, Select, MenuItem, TextField, Alert } from "@mui/material";
import { Close, Lock, LockOpen, People, Print, Subject as SubjectIcon, Settings as SettingsIcon, Subject } from "@mui/icons-material";
import { urlEncode } from "url-encode-base64";
import ViewStudentsDialog from "../../components/dialogs/ViewStudentsDialog";
import { initialOpen } from "../../utils/admin-faculty.util";
import SubjectLoadDialog from "../../components/dialogs/SubjectLoadDialog";
import moment from "moment";
import { momentFormatDate } from "../../utils/formatDate";
import { useDispatch, useSelector } from "react-redux";
import { fetchSubjectCodes } from "../../features/admin/faculty/subjectCodesThunks";
import { AdminFacultyService } from "../../services/adminFacultyService";

const Faculty = () => {
  const subjectCodesGS = useSelector((state) => state.subjectCodes.list);
  const subjectCodesStatus = useSelector((state) => state.subjectCodes.status);
  const dispatch = useDispatch();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  const [open, setOpen] = useState(initialOpen);
  const [openSubjectLoad, setOpenSubjectLoad] = React.useState(false);
  const [openConfirmation, setOpenConfirmation] = React.useState(false);
  const [subjectInfo, setSubjectInfo] = React.useState({
    status: "",
    classCode: "",
    code: "",
    section: "",
    noOfStudents: 0,
    midterm_status : ""
  });
  const [midtermSubjectInfo, setMidtermSubjectInfo] = React.useState({
    status : "",
    classCode: "",
    code: "",
    section: "",
    noOfStudents: 0,
    midterm_status : "",
    open: false,
    handleOpen: () => setMidtermSubjectInfo((prevState) => ({ ...prevState, open: true })),
    handleClose: () => setMidtermSubjectInfo((prevState) => ({ ...prevState, open: false })),
  })
  const [filterData, setFilterData] = React.useState({
    schoolyear: new Date().getFullYear(),
    semester: ""
  })
  const handleChangeFilterData = (event) => {
    setFilterData((prevState) => ({ ...prevState, [event.target.name]: event.target.value }));
  }
  const [viewStudents, setViewStudents] = useState({
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
          const timestamp = moment(params.row.timestamp).format("MMM DD, YYYY hh:mm A");
          return timestamp === "Invalid date" ? "" : timestamp;
        },
      },
    ],
  });

  const [subjectLoad, setSubjectLoad] = useState({
    rows: [],
    columns: [
      { field: "id", headerName: "ID", width: 150, hide: true },
      { field: "subject_code", headerName: "Subject", width: 150 },
      { field: "section", headerName: "Program/Year/Section", width: 200 },
      { field: "noStudents", headerName: "No of Students", width: 150 },
      {
        field: "timestamp",
        headerName: "Encoded",
        width: 200,
        valueGetter: (params) => {
          return momentFormatDate(params.row.timestamp) === "Invalid date" ? "--" : momentFormatDate(params.row.timestamp);
        },
      },
      {
        field: "method",
        headerName: "Method",
        width: 150,
      },
      {
        field: "submittedLog",
        headerName: "Submitted",
        width: 200,
        valueGetter: (params) => {
          return momentFormatDate(params.row.submittedLog) === "Invalid date" ? "--" : momentFormatDate(params.row.submittedLog);
        },
      },
      {
        field: "action",
        headerName: "Action",
        description: "This column has a value getter and is not sortable.",
        sortable: false,
        width: 200,
        renderCell: (params) => {
          const handleOpenConfirmation = () => {
            setOpenConfirmation(true);
            setSubjectInfo((prevState) => ({
              ...prevState,
              id: params.row.id,
              code: params.row.subject_code,
              section: params.row.section,
              noOfStudents: params.row.noStudents,
              status: params.row.status,
            }));
          };
          const handleOpenMidtermConfirmation = () => {
            setMidtermSubjectInfo((prevState) => ({ ...prevState, open: true }));
            setMidtermSubjectInfo((prevState) => ({
              ...prevState,
              id: params.row.id,
              code: params.row.subject_code,
              section: params.row.section,
              noOfStudents: params.row.noStudents,
              status: params.row.midterm_status,
            }));
          };
          const openViewStudentsHandler = async () => {
            setOpen((prevState) => ({ ...prevState, viewStudents: true }));
            const encoded = {
              class_code: urlEncode(params.row.id),
            };
            const { data } = await AdminFacultyService.getStudentsByClassCode(encoded.class_code);
            setViewStudents((prevState) => ({ ...prevState, rows: data.rows }));
          };
          const openSubjectCodesGSHandler = (isGraduate) => {
            const link = `/admin/print/${urlEncode(filterData.semester)}-${urlEncode(filterData.schoolyear)}/${urlEncode(params.row.id)}${isGraduate ? "/gs" : ""}`;
            return link;
          };
          const printGradeSheetLink = openSubjectCodesGSHandler(params.row.isGraduate);
          return (
            <>
              <ButtonGroup variant="text" color="primary" aria-label="actions">
                  <Tooltip title={`Midterm is Currently ${params.row.midterm_status ? "Locked" : "Unlocked"}. Click to ${params.row.midterm_status ? "Lock" : "Unlock"} Subject`}>
                    <IconButton aria-label="view" variant="text" color="primary" onClick={handleOpenMidtermConfirmation}>
                      {(params.row.midterm_status) ? <Lock /> : <LockOpen />}
                    </IconButton>
                  </Tooltip>
                  <Tooltip title={`Endterm is Currently ${params.row.status ? "Locked" : "Unlocked"}. Click to ${params.row.status ? "Unlock" : "Lock"} Subject`}>
                    <IconButton aria-label="view" variant="text" color="primary" onClick={handleOpenConfirmation}>
                      {(params.row.status) ? <Lock /> : <LockOpen />}
                    </IconButton>
                  </Tooltip>
                <Tooltip title="View Students">
                  <IconButton aria-label="view" variant="text" color="primary" name="viewStudents" onClick={openViewStudentsHandler}>
                    <People />
                  </IconButton>
                </Tooltip>
                <Tooltip title="Print Grade Sheet">
                  <IconButton 
                    aria-label="view" 
                    variant="text" 
                    color="primary" 
                    href={printGradeSheetLink} 
                    target="_blank"
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

  const handleCloseConfirmation = () => {
    setOpenConfirmation(false);
  };

  const lockSubjectHandler = async (id, status) => {
    const formData = new FormData();
    formData.append("class_code", urlEncode(id));
    formData.append("status", status);
    let response;
    try {
      const { data, status } = await AdminFacultyService.updateClassStatusByClassCode(formData);
      if (status === 200) {
        if (data.success) {
          response = data.message;
          setSubjectInfo((prevState) => ({ ...prevState, status: data.newStatus }));
          handleCloseSubjectLoad();
          handleCloseConfirmation();
        } else {
          response = data.message;
        }
      } else {
        response = data.message;
      }
    } catch (error) {
      response = "Something went wrong. Contact Administrator";
    }
    alert(response);
  };

  const lockMidtermSubjectHandler = async (id, status) => {
    const formData = new FormData();
    formData.append("class_code", urlEncode(id));
    formData.append("status", status);
    let response;
    try {
      const { data, status } = await AdminFacultyService.updateMidtermClassStatusByClassCode(formData);
      if (status === 200) {
        if (data.success) {
          response = data.message;
          setMidtermSubjectInfo((prevState) => ({ ...prevState, status: data.newStatus, open: false }));
          handleCloseSubjectLoad();
        } else {
          response = data.message;
        }
      } else {
        response = data.message;
      }
    } catch (error) {
      response = "Something went wrong. Contact Administrator";
    }
    alert(response);
  };

  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 460,
      valueGetter: (value, row) => `${value?.row?.firstName || ""} ${value?.row?.lastName || ""}`,
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
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      width: 100,
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
          const { data } = await AdminFacultyService.getSubjectLoadByFacultyIdYearAndSemester(urlEncode(params.row.faculty_id),urlEncode(filterData.schoolyear),urlEncode(filterData.semester));
          setSubjectLoad((prevState) => ({ ...prevState, rows: data }));
        };

        return (
          <>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Tooltip title="View Subject Load">
                <IconButton name="subjectLoad" aria-label="view" variant="text" color="primary" onClick={handleOpen}>
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
  useEffect(() => {
    if (subjectCodesStatus === "idle") {
      dispatch(fetchSubjectCodes());
    }
  }, [subjectCodesStatus, dispatch]);
  const [openFilterModal, setOpenFilterModal] = React.useState(false)
  const handleOpenFilterYearAndSemester = () => {
    setOpenFilterModal(true);
  }
  const handleCloseFilterYearAndSemester = (panel) => {
    setOpenFilterModal(false);
  }
  const [data, setData] = React.useState({
    faculty: []
  })
  const handleFetchData = async () => {
    if(data.faculty.length > 0) {
      setData((prevState) => ({ ...prevState, faculty: [] }));
    }
    const { data:queryData } = await AdminFacultyService.getFacultyBySchoolYearAndSemester(filterData.schoolyear, filterData.semester)
    setData((prevState) => ({ ...prevState, faculty: queryData.rows }))
  }
  return (
    <>
      <Alert severity="info">FILTER SCHOOL YEAR AND SEMESTER TO SHOW LIST OF FACULTY IN FILTER BUTTON</Alert><br />
      <Box
        sx={{ 
          display: "flex", 
          flexDirection: "row", 
          justifyContent: "space-between", 
          alignItems: "center", 
          width: "100%" 
        }}
      >
          <Typography variant="h4" fontWeight={700} component="div" marginBottom={3} sx={{ flexGrow: 1 }}>
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
            // sx={{ height: {xs: "auto", md: 500} }}
            sx={{ 
              display: "flex",
              flexDirection: "column",
              gap: 3,
              height: 500
            }}
          >
              <DataGrid
                rows={data.faculty}
                columns={columns}
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

      {/* Dialog for Confirmation of Locking/Unlocking a Subject */}
      <Dialog open={openConfirmation} onClose={handleCloseConfirmation} aria-labelledby={"dialog-confirmation"}>
        <DialogTitle id={"dialog-confirmation-title"}>Confirmation to {Boolean(subjectInfo.status) ? "Unlock" : "Lock"} this Subject(Endterm)</DialogTitle>
        <DialogContent dividers>
          <DialogContentText color={"initial"}>
            Do you really want to update the status as {Boolean(subjectInfo.status) ? "Unlock" : "Lock"}? <br />
          </DialogContentText>
          <br />
          <DialogContentText color={"initial"}>
            Subject Code: {subjectInfo.code} <br />
          </DialogContentText>
          <DialogContentText color={"initial"}>
            Program, Year&Section: {subjectInfo.section}
            <br />
          </DialogContentText>
          <DialogContentText color={"initial"}>
            No of Students: {subjectInfo.noOfStudents}
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="text" color="primary" aria-label="">
            <Button onClick={() => lockSubjectHandler(subjectInfo.id, subjectInfo.status)} variant="standard" color="primary">
              Confirm
            </Button>
            <Button onClick={handleCloseConfirmation}>Cancel</Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>


      {/* Dialog for Confirmation of Locking/Unlocking a Midterm Subject */}
      <Dialog open={midtermSubjectInfo.open} onClose={midtermSubjectInfo.handleClose} aria-labelledby={"dialog-confirmation"}>
        <DialogTitle id={"dialog-confirmation-title"}>Confirmation to {Boolean(midtermSubjectInfo.status) ? "Unlock" : "Lock"} this Subject(Midterm)</DialogTitle>
        <DialogContent dividers>
          <DialogContentText color={"initial"}>
            Do you really want to update the status as {Boolean(midtermSubjectInfo.status) ? "Unlock" : "Lock"}? <br />
          </DialogContentText>
          <br />
          <DialogContentText color={"initial"}>
            Subject Code: {midtermSubjectInfo.code} <br />
          </DialogContentText>
          <DialogContentText color={"initial"}>
            Program, Year&Section: {midtermSubjectInfo.section}
            <br />
          </DialogContentText>
          <DialogContentText color={"initial"}>
            No of Students: {midtermSubjectInfo.noOfStudents}
            <br />
          </DialogContentText>
        </DialogContent>
        <DialogActions>
          <ButtonGroup variant="text" color="primary" aria-label="">
            <Button onClick={() => lockMidtermSubjectHandler(midtermSubjectInfo.id, midtermSubjectInfo.status)} variant="standard" color="primary">
              Confirm
            </Button>
            <Button onClick={midtermSubjectInfo.handleClose}>Cancel</Button>
          </ButtonGroup>
        </DialogActions>
      </Dialog>


      <ViewStudentsDialog open={open.viewStudents} close={closeHandler.viewStudents} data={viewStudents} />

      <Dialog open={openFilterModal} onClose={handleCloseFilterYearAndSemester} aria-labelledby={"dialog-confirmation"}>
        <DialogTitle id={"dialog-confirmation-title"}>FILTER YEAR AND SEMESTER</DialogTitle>
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
                flexGrow: 1
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
                value={filterData.schoolyear ? parseInt(filterData.schoolyear) + 1 : ""} 
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
              disabled={filterData.schoolyear === "" || filterData.semester === ""}
            >
              Filter
            </Button>
            <Typography variant="body1" color="initial" >Result: {data.faculty.length}</Typography>
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};
export default Faculty;
