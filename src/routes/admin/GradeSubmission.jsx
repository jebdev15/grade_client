import { DataGrid } from '@mui/x-data-grid'
import React, { useState } from 'react'
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

const GradeSubmission = () => {
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [activity, schoolyear, semester, status, from, to] = useOutletContext();
    const { data } = useLoaderData();

    const [openSubjectLoad, setOpenSubjectLoad] = useState(false);
    const [open, setOpen] = useState(false);
    const [openLockConfirmation, setOpenLockConfirmation] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [subjectInfo, setSubjectInfo] = useState({
      isLock: 0,
      classCode: '',
      code: '',
      section: '',
      noOfStudents: 0,
    });
    const [openScheduler, setOpenScheduler] = useState(false);
    const dateOnlyFormatter = (date) => {
      const newDateTime = new Date(date);
  
      const year = newDateTime.getFullYear();
      const month = String(newDateTime.getMonth() + 1).padStart(2, '0');
      const day = String(newDateTime.getDate()).padStart(2, '0');
  
      return `${year}-${month}-${day}`;
    };
    const initialScheduleDueDate = {
      activity: activity ? activity : '',
      schoolyear: schoolyear ? schoolyear : 1970,
      semester: semester ? semester : '',
      status: status ? status : '',
      from: from ? dateOnlyFormatter(from) : '',
      to: to ? dateOnlyFormatter(to) : '',
    }
    const [scheduleDueDate, setScheduleDueDate] = useState(initialScheduleDueDate)
    // function getCurrentDateFormatted(plus) {
    //     const date = new Date();
    //     const year = date.getFullYear();
    //     const month = String(date.getMonth() + 1 + plus).padStart(2, '0');
    //     const day = String(date.getDate()).padStart(2, '0');
    
    //     return `${year}-${month}-${day}`;
    // }

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

    const handleCloseSubjectLoad = () => {
      setOpenSubjectLoad(false)
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

    const handleOpenLock = () => setOpen(true);
    const handleCloseLock = () => setOpen(!true);
    const handleOpenLockConfirmation = () => lockAction !== '' ? setOpenLockConfirmation(true) : alert('Please select a Status')
    const handleCloseLockConfirmation = () => setOpenLockConfirmation(!true)

    const [lockAction, setLockAction] = useState('');
    const handleChangeAction = (e) => { setLockAction(e.target.value);console.log(e.target.name, e.target.value) }
    const handleUpdateLock = async () => {
      const formData = new FormData();
      formData.append('action', lockAction)
      
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/updateClassStatus`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(data);
      if (data.message === "Updated") {
        alert("Successfully Updated")
        handleCloseLock()
        setOpenLockConfirmation()
      } 
    }


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
      if(data.updated > 0){
        alert(data.message)
        handleCloseScheduler()
      }
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
              <Tooltip title="Set Deadline for Grade Submission">  
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<Schedule />}
                  onClick={handleOpenScheduler}
                >
                  Set Deadline
                </Button>
              </Tooltip>  
              <Tooltip title="Download a Report">  
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<CloudDownloadIcon />}
                  // onClick={handleOpenDownloadReportDialog}
                >
                  Download Report
                </Button>
              </Tooltip>
              <Tooltip title="Lock/Unlock All Subject Load">  
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<Lock />}
                  onClick={handleOpenLock}
                >
                  Lock/Unlock All
                </Button>
              </Tooltip>
            </ButtonGroup>
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
            SET Deadline
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
                {/* <InputLabel id="select-activity-label">Activity</InputLabel> */}
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
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                {/* <InputLabel id="select-schoolyear-label">School Year</InputLabel> */}
                <TextField
                  labelId="select-schoolyear-label"
                  id="select-schoolyear"
                  name="schoolyear"
                  label="School Year"
                  type='number'
                  value={scheduleDueDate.schoolyear}
                  onChange={handleChangeSchedule}       
                />
                <TextField
                  label="School Year"
                  type='number'
                  value={`${parseInt(scheduleDueDate.schoolyear)+1}`}
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
                </Select>
              </FormControl>
              <FormControl fullWidth>
                {/* <InputLabel id="select-from-label">From</InputLabel> */}
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
                {/* <InputLabel id="select-to-label">To</InputLabel> */}
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

        {/* Modal for Updating Class into Lock/Unlock Status */}
        <Dialog open={open} onClose={handleCloseLock} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
              Lock/Unlock All Subject Load
          </DialogTitle>
          <IconButton 
            aria-label="close" 
            onClick={handleCloseLock}
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
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                {/* <InputLabel id="select-schoolyear-label">School Year</InputLabel> */}
                <TextField
                  label="School Year"
                  type='text'
                  value={`${scheduleDueDate.schoolyear}-${parseInt(scheduleDueDate.schoolyear)+1}`}   
                  disabled
                  fullWidth
                />
              </FormControl>
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                {/* <InputLabel id="select-schoolyear-label">School Year</InputLabel> */}
                <TextField
                  label="Semester"
                  type='text'
                  value={scheduleDueDate.semester}   
                  disabled
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-action-label">ACTION</InputLabel>
                <Select
                  labelId="select-action-label"
                  id="select-status"
                  label="ACTION"
                  name="action"
                  value={lockAction}
                  onChange={handleChangeAction}
                  required
                >
                  <MenuItem value="Close">Lock</MenuItem>
                  <MenuItem value="Open">Unlock</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Button
                variant='standard'
                color="primary"
                onClick={handleOpenLockConfirmation}
              >
                Update
              </Button>
              <Button
                onClick={handleCloseLock}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </DialogActions>
        </Dialog>

        {/* Dialog for Confirmation of Locking/Unlocking all Subject Load */}
        <Dialog open={openLockConfirmation} onClose={handleCloseLockConfirmation} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
            Confirmation Dialog
          </DialogTitle>
          <IconButton 
            aria-label="close" 
            onClick={handleCloseLockConfirmation}
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
              Please click <strong>CONFIRM</strong> button to update
            </DialogContentText>
          </DialogContent>
          <DialogActions>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Button
                onClick={handleUpdateLock}
                variant='standard'
                color="primary"
              >
                Confirm
              </Button>
              <Button
                onClick={handleCloseLockConfirmation}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </DialogActions>
        </Dialog>

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