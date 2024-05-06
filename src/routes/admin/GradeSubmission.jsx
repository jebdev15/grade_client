import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import {
  Backdrop,
  Box,
  Button,
  Fade, 
  Grid, 
  IconButton, 
  Modal,
  Typography, 
  Tooltip, 
  useMediaQuery, 
  ButtonGroup, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  List, 
  ListItem,
  Select,
  TextField, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import {
  Close,
  CloudDownload as CloudDownloadIcon,
  Lock,
  LockOpen,
  Schedule,
  Visibility as VisibilityIcon,
  WorkHistory as WorkHistoryIcon,
} from '@mui/icons-material'
import axios from 'axios'
import { 
  useLoaderData,
  useOutletContext, 
} from 'react-router-dom'
import { urlEncode } from 'url-encode-base64'
import { saveAs } from "file-saver";


const styleDefault = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: 500, 
  width: '75%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleForSmallScreen = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '75%', 
  width: '100%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleDefaultForLogs = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: 350, 
  width: '50%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const styleForSmallScreenForLogs = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  height: '60%', 
  width: '80%',
  transform: 'translate(-50%, -50%)',
  bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

const GradeSubmission = () => {
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [openSubjectLoad, setOpenSubjectLoad] = useState(false);
    const [openLogs, setOpenLogs] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [subjectInfo, setSubjectInfo] = useState({
      isLock: 0,
      classCode: '',
      code: '',
      section: '',
      noOfStudents: 0,
    });
    const [openScheduler, setOpenScheduler] = useState(false);
    const [scheduleDueDate, setScheduleDueDate] = useState({
      activity: '',
      schoolyear: '',
      semester: '',
      status: '',
      from: '0000-00-00',
      to: '0000-00-00'
    })

    const [subjectLoad, setSubjectLoad] = useState({
      rows: [],
      columns: [
        { field: 'id', headerName: 'ID', width: 150, hide: true },
        { field: 'subject_code', headerName: 'Subject', width: 200 },
        { field: 'section', headerName: 'Program/Year/Section', width: 300 },
        { field: 'noStudents', headerName: 'No of Students', width: 300 },
        {
          field: 'action',
          headerName: 'Action',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 200,
          renderCell: (params) => {
            const handleOpenConfirmation = () => {
              setOpenConfirmation(true)
              setSubjectInfo((prevState) => (
                {
                  ...prevState,
                  id: params.row.id,
                  code: params.row.subject_code,
                  section: params.row.section,
                  noOfStudents: params.row.noStudents,
                  isLock: params.row.isLock,
                }
              ))
            }

            const checkLogsHandler = async () => {
              setOpenLogs(true)
              const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getGradeSubmissionLogs?class_code=${urlEncode(params.row.id)}`)
              // setLogs((prevState) => ({...prevState, rows: 
              //   {
              //     id: data.id,
              //     timestamp: dateFormatter(data.timestamp),
              //     method: data.method,
              //   }
              // }))
              console.log(data);
            }

            return (
              <>
              <ButtonGroup variant="text" color="primary" aria-label="">
                
                  <Tooltip title={`Currently ${params.row.isLock ? 'Locked' : 'Unlocked'}. Click to ${params.row.isLock ? 'Unlock' : 'Lock'} Subject`}>  
                    <IconButton aria-label="view" variant="text" color="primary" onClick={handleOpenConfirmation}>
                      { params.row.isLock ? <Lock /> : <LockOpen /> }
                    </IconButton>
                  </Tooltip>
                
                  {/* <Tooltip title="View Grade Submission Logs">  
                    <IconButton aria-label="view" variant="text" color="primary" onClick={checkLogsHandler}>
                      <WorkHistoryIcon />
                    </IconButton>
                  </Tooltip> */}
              </ButtonGroup>
              </>
            )
          }
        },
      ]
    })

    const [logs, setLogs] = useState({
      rows: [],
      columns: [
        { field: 'id', headerName: 'ID', width: 150, hide: true },
        { field: 'method', headerName: 'Method', width: 200 },
        { field: 'timestamp', headerName: 'Timestamp', width: 200 },
      ]
    })

    const [schoolyear, semester, from, to] = useOutletContext();
    const { data } = useLoaderData();
    
    
    const dateFormatter = (date) => {
      const newDateTime = new Date(date);
      
      const formattedDate = newDateTime.toLocaleString('en-PH', {
        timeZone: 'UTC', // Set the time zone to UTC
        month: 'long', // Full month name
        day: 'numeric', // Day of the month
        year: 'numeric', // Full year
        hour: 'numeric', // Hour in 12-hour format
        minute: 'numeric', // Minute
        hour12: true // Use 12-hour format
      });
      
      return formattedDate;
    }

    const dateFormat = (date) => {
      const newDateTime = new Date(date);
      
      const formattedDate = newDateTime.toLocaleString('en-PH', {
        month: 'long', // Full month name
        day: 'numeric', // Day of the month
        year: 'numeric', // Full year
      });
      
      return formattedDate;
    }

    const gradeSubmissionDueDate = `${dateFormat(from)} - ${dateFormat(to)}`

    const handleCloseSubjectLoad = () => {
      setOpenSubjectLoad(false)
    };

    const handleCloseLogs = () => {
      setOpenLogs(false)
    };

    const handleCloseConfirmation= () => {
      setOpenConfirmation(false)
    };

    const handleOpenScheduler = () => {
      setOpenScheduler(true)
    };

    const handleChangeSchedule = (e) => {
        console.log(e.target.name, e.target.value);
        setScheduleDueDate((prevState) => ({...prevState, [e.target.name]: e.target.value}))
    }

    const handleDownloadReport = async () => {
      const {data, status} = await axios.get(`${process.env.REACT_APP_API_URL}/admin/downloadLogs`,
      {
        responseType: 'arraybuffer',
      }
    )
      if(status === 200) {
        let blob = new Blob([data], {
          type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        saveAs(
          blob,
          `Test.xlsx`
        )
      } else {
        console.log('Error');
      }
    };



    const handleUpdateSchedule = async () => {
      const formData = new FormData();
      formData.append('activity', scheduleDueDate.activity)
      formData.append('schoolyear', scheduleDueDate.schoolyear)
      formData.append('semester', scheduleDueDate.semester)
      formData.append('status', scheduleDueDate.status)
      formData.append('from', scheduleDueDate.from)
      formData.append('to', scheduleDueDate.to)

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/updateSchedule`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      data.Message && handleCloseScheduler()
    }

    const handleCloseScheduler = () => {
      setOpenScheduler(!true)
    };

    const lockSubjectHandler = async (id, isLock) => {
      console.log("data sent",{"subjectInfo.id": subjectInfo.id, "subjectInfo.isLock": subjectInfo.isLock});
      const formData = new FormData();
      formData.append('class_code', urlEncode(id))
      formData.append('isLock', isLock)
      try {
        const { data, status } = await axios.post(
          `${process.env.REACT_APP_API_URL}/admin/updateClassCodeStatus`, 
          formData, 
          { 
            headers: {'Content-Type': 'application/json'} 
          },
        )
        if(status === 200) {
          if(data.Message) {
            setSubjectInfo((prevState) => ({...prevState, isLock: data.isLock}))
            console.log({"Message: ": "Has Been Updated", "isLock": data.isLock, "subjectInfo.isLock": subjectInfo.isLock});
            handleCloseSubjectLoad()
            handleCloseConfirmation()
          } else {
            console.log({"Message: ": "No Changes", "isLock": data.isLock});
          }
        } else {
          console.log("Status :", status);
        }
      } catch (error) {
        console.error('Error', error);
      }
    }

    const columns = [
        { field: 'id', headerName: 'ID', width: 150 },
        {
            field: 'fullName',
            headerName: 'Full name',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 460,
            valueGetter: (value, row) => `${value?.row?.firstName || ''} ${value?.row?.lastName || ''}`,
        },
        {
            field: 'email',
            headerName: 'Email Address',
            description: 'This column has a value getter and is not sortable.',
            sortable: false,
            width: 400,
        },
        {
          field: 'action',
          headerName: 'Action',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 200,
          renderCell: (params) => {
            const handleOpen = async () => {
              setOpenSubjectLoad(true);
              const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getSubjectLoad?faculty_id=${urlEncode(params.row.faculty_id)}&school_year=${urlEncode(schoolyear)}&semester=${urlEncode(semester)}`)
              
              setSubjectLoad((prevState) => ({...prevState, rows: data}))
            };

            return (
              <>
                <ButtonGroup variant="text" color="primary" aria-label="">
                  <Tooltip title="View Subject Load">  
                    <IconButton aria-label="view" variant="text" color="primary" onClick={handleOpen}>
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              </>
            )
          }
        },
    ];
    
    
    const rows = data;
    
  return (
    <>
        <Grid container spacing={0}>
          <Grid item>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Tooltip title="Set Schedule of Grade Submission">  
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<Schedule />}
                  onClick={handleOpenScheduler}
                >
                  Set Schedule
                </Button>
              </Tooltip>  
              <Tooltip title="Set Schedule of Grade Submission">  
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<CloudDownloadIcon />}
                  onClick={handleDownloadReport}
                >
                  Download Report
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Grid>
        </Grid>
        <Grid container spacing={0}>
          <Grid item xs={5} md={3}>
            <Typography variant='body1' color="initial">CURRENT SCHOOL YEAR: {schoolyear}</Typography>
          </Grid>
          <Grid item xs={5} md={3}>
            <Typography variant='body1'  color="initial">CURRENT SEMESTER: {semester}</Typography>
          </Grid>
          <Grid item xs={12} md={6}>
            <Typography variant='body1'  color="initial">GRADE SUBMISSION PERIOD: {gradeSubmissionDueDate}</Typography>
          </Grid>
        </Grid>
        <Box sx={isSmallScreen ? {height: '100%', width: '100%'} : {height: 600, width: '100%'}}>
          <Typography variant="body1" color="initial">List of Faculty</Typography>
          <DataGrid
              rows={rows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5]}
          />
        </Box>

        {/* Dialog to Create/Extend/Adjust Schedule of Submission of Grades */}
        <Dialog open={openScheduler} onClose={handleCloseScheduler} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
            SET SCHEDULE
          </DialogTitle>
          <IconButton 
            aria-label="close" 
            onClick={handleCloseScheduler}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
          <DialogContent sx={isSmallScreen ? { width: '100%' } : { width: 500 }} dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
              <FormControl fullWidth>
                <InputLabel id="select-activity-label">Activity</InputLabel>
                <TextField
                  labelId="select-activity-label"
                  id="select-activity"
                  name="activity"
                  label="Activity"
                  type='text'
                  value={scheduleDueDate.activity}
                  onChange={handleChangeSchedule}
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-schoolyear-label">School Year</InputLabel>
                <TextField
                  labelId="select-schoolyear-label"
                  id="select-schoolyear"
                  name="schoolyear"
                  label="School Year"
                  type='text'
                  value={scheduleDueDate.schoolyear}
                  onChange={handleChangeSchedule}
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-semester-label">Semester</InputLabel>
                <Select
                  labelId="select-semester-label"
                  id="select-semester"
                  label="Semester"
                  name="semester"
                  value={scheduleDueDate.semester}
                  onChange={handleChangeSchedule}
                >
                  <MenuItem value="1st">1st Semester</MenuItem>
                  <MenuItem value="2nd">2nd Semester</MenuItem>
                  <MenuItem value="summer">Summer</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-status-label">Status</InputLabel>
                <Select
                  labelId="select-status-label"
                  id="select-status"
                  label="Status"
                  name="status"
                  value={scheduleDueDate.status}
                  onChange={handleChangeSchedule}
                >
                  <MenuItem value="Open">Open</MenuItem>
                  <MenuItem value="Close">Close</MenuItem>
                  <MenuItem value="Extend">Extend</MenuItem>
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-from-label">From</InputLabel>
                <TextField
                  id="select-from-label"
                  name="from"
                  label="From"
                  type='date'
                  value={scheduleDueDate.from}
                  onChange={handleChangeSchedule}
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-to-label">To</InputLabel>
                <TextField
                  id="select-to-label"
                  name="to"
                  label="To"
                  type='date'
                  value={scheduleDueDate.to}
                  onChange={handleChangeSchedule}
                  fullWidth
                />
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Button
                variant='standard'
                color="primary"
                onClick={handleUpdateSchedule}
              >
                Save
              </Button>
              <Button
                onClick={handleCloseScheduler}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </DialogActions>
        </Dialog>

        {/* Modal for Subject Load */}
        <Modal
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openSubjectLoad}
          onClose={handleCloseSubjectLoad}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openSubjectLoad}>
            <Box sx={isSmallScreen ? styleForSmallScreen : styleDefault}>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                SUBJECT LOAD
              </Typography>
              <DataGrid
                  rows={subjectLoad.rows}
                  columns={subjectLoad.columns}
                  initialState={{ 
                      pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                      }
                  }}
                  pageSizeOptions={[5, 10]}
              />
            </Box>
          </Fade>
        </Modal>

        {/* Modal for Grade Submission Logs */}
        <Modal
          name="gradeSubmissionLogs"
          aria-labelledby="transition-modal-title"
          aria-describedby="transition-modal-description"
          open={openLogs}
          onClose={handleCloseLogs}
          closeAfterTransition
          slots={{ backdrop: Backdrop }}
          slotProps={{
            backdrop: {
              timeout: 500,
            },
          }}
        >
          <Fade in={openLogs}>
            <Box sx={isSmallScreen ? styleForSmallScreenForLogs : styleDefaultForLogs}>
              <Typography variant="h4" component="div" sx={{ flexGrow: 1 }}>
                Logs
              </Typography>
              <DataGrid
                  rows={logs.rows}
                  columns={logs.columns}
                  initialState={{ 
                      pagination: {
                          paginationModel: { page: 0, pageSize: 5 },
                      }
                  }}
                  pageSizeOptions={[5, 10]}
              />
            </Box>
          </Fade>
        </Modal>

        {/* Dialog for Confirmation of Locking/Unlocking a Subject */}
        <Dialog open={openConfirmation} onClose={handleCloseConfirmation} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
            Confirmation to {Boolean(subjectInfo.isLock) ? 'Unlock' : 'Lock'} this Subject
          </DialogTitle>
          <IconButton 
            aria-label="close" 
            onClick={handleCloseConfirmation}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
          <DialogContent dividers>
            <DialogContentText color={"initial"}>
              Do you really want to {Boolean(subjectInfo.isLock) ? 'Unlock' : 'Lock'} <br />
            </DialogContentText>
            <DialogContentText color={"initial"}>
            Subject Code: {subjectInfo.code} <br />
            </DialogContentText>
            <DialogContentText color={"initial"}>
              Program, Year&Section: {subjectInfo.section}<br />
            </DialogContentText>
            <DialogContentText color={"initial"}>
              No of Students: {subjectInfo.noOfStudents}<br />
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Button
                onClick={() => lockSubjectHandler(subjectInfo.id, subjectInfo.isLock)}
                variant='standard'
                color="primary"
              >
                Confirm
              </Button>
              <Button
                onClick={handleCloseConfirmation}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </DialogActions>
        </Dialog>
    </>
  )
}

export const loader = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getEmails`);
    return { data }
}
export default GradeSubmission