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
  Select,
  TextField, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import {
  Close,
  Lock,
  LockOpen,
  Schedule,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import axios from 'axios'
import { 
  useOutletContext, 
} from 'react-router-dom'
import { urlEncode } from 'url-encode-base64'
import { useCookies } from 'react-cookie'

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
    const [cookies, ,] = useCookies(['picture', 'name', 'faculty_id', 'email', 'campus', 'accessLevel']);
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [activity, schoolyear, semester, status, from, to] = useOutletContext();
    
    const [openSubjectLoad, setOpenSubjectLoad] = useState(false);
    const [open, setOpen] = useState(false);
    const [openLockConfirmation, setOpenLockConfirmation] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [subjectInfo, setSubjectInfo] = useState({
      status: 0,
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
                  status: params.row.status,
                }
              ))
            }

            return (
              <>
              <ButtonGroup variant="text" color="primary" aria-label="">
                
                  <Tooltip title={`Currently ${params.row.status ? 'Locked' : 'Unlocked'}. Click to ${params.row.status ? 'Unlock' : 'Lock'} Subject`}>  
                    <IconButton aria-label="view" variant="text" color="primary" onClick={handleOpenConfirmation}>
                      { params.row.status ? <Lock /> : <LockOpen /> }
                    </IconButton>
                  </Tooltip>
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
        setScheduleDueDate((prevState) => ({...prevState, [e.target.name]: e.target.value}))
    }

    const handleOpenLock = () => setOpen(true);
    const handleCloseLock = () => setOpen(!true);
    const handleOpenLockConfirmation = () => lockAction !== '' ? setOpenLockConfirmation(true) : alert('Please select a Status')
    const handleCloseLockConfirmation = () => setOpenLockConfirmation(!true)

    const [lockAction, setLockAction] = useState('');
    const handleChangeAction = (e) => setLockAction(e.target.value)
    const handleUpdateLock = async () => {
      const formData = new FormData();
      formData.append('action', lockAction)
      formData.append('email_used', cookies.email)

      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/updateClassStatus`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      handleCloseLock()
      setOpenLockConfirmation()
    }


    const handleUpdateSchedule = async () => {
      const formData = new FormData();
      formData.append('email_used', cookies.email)
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
      console.log(data);
      alert(data.message)
      handleCloseScheduler()
    }

    const handleCloseScheduler = () => {
      setOpenScheduler(!true)
    };

    const lockSubjectHandler = async (id, status) => {
      const formData = new FormData();
      formData.append('class_code', urlEncode(id))
      formData.append('status', status)
      formData.append('email_used', cookies.email)
      let response;
      try {
        const { data, status } = await axios.post(
          `${process.env.REACT_APP_API_URL}/admin/updateClassCodeStatus`, 
          formData, 
          { 
            headers: {'Content-Type': 'application/json'} 
          },
        )
        if(status === 200) {
          if(data.success) {
            setSubjectInfo((prevState) => ({...prevState, status: data.status}))
            response=data.message;
            handleCloseSubjectLoad()
            handleCloseConfirmation()
          } else {
            response=data.message;
          }
        } else {
          response=data.message;
        }
      } catch (error) {
        response="Error Occured. Contact Administrator";
      }
      alert(response)
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
  
  const [rows, setRows] = useState([]);
  const [loadingDataGrid, setLoadingDataGrid] = useState(true);
  useEffect(() => {
    const loader = async () => {
      const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getEmails`);
      setRows(data);
      status === 200 && setLoadingDataGrid(false);
    }
    loader();
  },[])
  return (
    <>
        <Grid container spacing={0}>
          <Grid item>
            <ButtonGroup variant="text" color="primary" aria-label="">
              {(cookies.accessLevel === "Administrator" || cookies.accessLevel === "Registrar") && (  
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
              )}
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
          <Typography 
          variant="h4"
          fontWeight={700}
          component="div"
          marginBottom={3}
          sx={{ flexGrow: 1 }}
          >LIST OF FACULTY</Typography>
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
              loading={loadingDataGrid}
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

        {/* Modal for Updating Class into Locked/Unlocked Status */}
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
                  <MenuItem value={"Lock"}>Lock</MenuItem>
                  <MenuItem value={"Unlock"}>Unlock</MenuItem>
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
            Confirmation to {Boolean(subjectInfo.status) ? 'Unlock' : 'Lock'} this Subject
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
              Do you really want to update the status as {Boolean(subjectInfo.status) ? 'Unlock' : 'Lock'}? <br />
            </DialogContentText><br />
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
                onClick={() => lockSubjectHandler(subjectInfo.id, subjectInfo.status)}
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
export default GradeSubmission