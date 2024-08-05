import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
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
  DialogContentText, 
  DialogActions, 
} from '@mui/material'
import {
  Close,
  Lock,
  LockOpen,
  People,
  Print,
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import axios from 'axios'
import { 
  useOutletContext, 
} from 'react-router-dom'
import { urlEncode } from 'url-encode-base64'
import { useCookies } from 'react-cookie'
import ViewStudentsDialog from '../../components/dialogs/ViewStudentsDialog'
import { getGradeTableService } from '../../services/admin.services'
import { initialLoading, initialOpen } from '../../utils/admin-faculty.util'
import SubjectLoadDialog from '../../components/dialogs/SubjectLoadDialog'
import moment from 'moment'
import { momentFormatDate } from '../../utils/formatDate'
import { useDispatch, useSelector } from 'react-redux'
import { fetchSubjectCodes } from '../../features/admin/faculty/subjectCodesThunks'
import { fetchFaculty } from '../../features/admin/faculty/facultyThunks'

const Faculty = () => {
    const subjectCodesGS = useSelector(state => state.subjectCodes.list);
    const subjectCodesStatus = useSelector((state) => state.subjectCodes.status);
    const dispatch = useDispatch();
    const [cookies, ,] = useCookies(['picture', 'name', 'faculty_id', 'email', 'campus', 'accessLevel']);
    const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
    const [, schoolyear, semester, , , ] = useOutletContext();
    
    
    const [open, setOpen] = useState(initialOpen);
    const [openSubjectLoad, setOpenSubjectLoad] = useState(false);
    const [openConfirmation, setOpenConfirmation] = useState(false);
    const [subjectInfo, setSubjectInfo] = useState({
      status: 0,
      classCode: '',
      code: '',
      section: '',
      noOfStudents: 0,
    });

    const [viewStudents, setViewStudents] = useState({
      rows: [],
      columns: [
        { field: 'id', headerName: 'ID', width: 150, hide: true },
        { field: 'student_id', headerName: 'STUDENT ID', width: 100},
        { field: 'name', headerName: 'Full Name', width: 400 },
        { field: 'mid_grade', headerName: 'Midterm Grade', width: 150 },
        { field: 'final_grade', headerName: 'Endterm Grade', width: 150 },
        { field: 'grade', headerName: 'Grade', width: 100 },
        { field: 'credit', headerName: 'Credit', width: 100 },
        { field: 'remarks', headerName: 'Remarks', width: 100 },
        { field: 'encoder', headerName: 'Encoder', width: 200 },
        { 
          field: 'timestamp', 
          headerName: 'Timestamp', 
          width: 200,
          valueGetter: (params) => {
            const timestamp = moment(params.row.timestamp).format("MMM DD, YYYY hh:mm A")
            return timestamp === 'Invalid date' ? '' : timestamp;
          }
        },
      ]
    }) 

    const [subjectLoad, setSubjectLoad] = useState({
      rows: [],
      columns: [
        { field: 'id', headerName: 'ID', width: 150, hide: true },
        { field: 'subject_code', headerName: 'Subject', width: 150 },
        { field: 'section', headerName: 'Program/Year/Section', width: 200 },
        { field: 'noStudents', headerName: 'No of Students', width: 150 },
        { 
          field: 'timestamp', 
          headerName: 'Encoded', 
          width: 200,
          valueGetter: (params) => {
            return momentFormatDate(params.row.timestamp) === 'Invalid date' ? '--' : momentFormatDate(params.row.timestamp);
          }
        },
        { 
          field: 'method', 
          headerName: 'Method', 
          width: 150 
        },
        { 
          field: 'submittedLog', 
          headerName: 'Submitted', 
          width: 200,
          valueGetter: (params) => {
            return momentFormatDate(params.row.submittedLog) === 'Invalid date' ? '--' : momentFormatDate(params.row.submittedLog);
          }
        },
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

            const openViewStudentsHandler = async () => {
              setOpen((prevState) => ({ ...prevState, viewStudents: true }));
              const encoded = {
                class_code: urlEncode(params.row.id),
              }
              const { data } = await getGradeTableService(encoded.class_code);
              setViewStudents((prevState) => ({...prevState, rows: data}))
            }
            const openSubjectCodesGSHandler = (subjectCode) => {
              const subjectCodeIsGS = subjectCodesGS.some(subject => subject.subject_code === subjectCode);
              const link = subjectCodeIsGS 
                ? `/admin/print/${urlEncode(semester)}-${urlEncode(schoolyear)}/${urlEncode(params.row.id)}/gs` 
                : `/admin/print/${urlEncode(semester)}-${urlEncode(schoolyear)}/${urlEncode(params.row.id)}`
                return link
            }
            const printGradeSheetLink = openSubjectCodesGSHandler(params.row.subject_code)
            return (
              <>
              <ButtonGroup variant="text" color="primary" aria-label="">
                  {["Administrator","Registrar"].includes(cookies.accessLevel) && (
                  <Tooltip title={`Currently ${params.row.status ? 'Locked' : 'Unlocked'}. Click to ${params.row.status ? 'Unlock' : 'Lock'} Subject`}>  
                    <IconButton aria-label="view" variant="text" color="primary" onClick={handleOpenConfirmation}>
                      { params.row.status ? <Lock /> : <LockOpen /> }
                    </IconButton>
                  </Tooltip>
                  )}
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
                        href={printGradeSheetLink}
                        target='_blank'
                      >
                      <Print />
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
          field: 'college_code',
          headerName: 'College',
          description: 'This column has a value getter and is not sortable.',
          sortable: false,
          width: 100,
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
              console.log(data);
              setSubjectLoad((prevState) => ({...prevState, rows: data}))
            };

            return (
              <>
                <ButtonGroup variant="text" color="primary" aria-label="">
                  <Tooltip title="View Subject Load">  
                    <IconButton 
                      name="subjectLoad"
                      aria-label="view" 
                      variant="text" 
                      color="primary" 
                      onClick={handleOpen}
                    >
                      <VisibilityIcon />
                    </IconButton>
                  </Tooltip>
                </ButtonGroup>
              </>
            )
          }
        },
    ];
  
  const facultyRows = useSelector((state) => state.faculty.list);
  const facultyStatus = useSelector((state) => state.faculty.status);
  
  const [loading, setLoading] = useState(initialLoading)
  useEffect(() => {
    if (facultyStatus === 'idle') {
        dispatch(fetchFaculty(cookies));
    }
    if(['idle','succeeded'].includes(facultyStatus)) {
        setLoading({emails: false});
    }
}, [facultyStatus, dispatch, cookies]);
  const closeHandler = {
    viewStudents: () => setOpen({viewStudents: false}),
    subjectLoad: () => setOpen({subjectLoad: false}),
  }
  useEffect(() => {
    if (subjectCodesStatus === 'idle') {
      dispatch(fetchSubjectCodes());
  }
  if(['idle','succeeded'].includes(subjectCodesStatus)) {
      setLoading(false);
  }
  },[subjectCodesStatus, dispatch])
  return (
    <>

        <Box sx={{height: 600, width: '100%'}}>
          <Typography 
          variant="h4"
          fontWeight={700}
          component="div"
          marginBottom={3}
          sx={{ flexGrow: 1 }}
          >LIST OF FACULTY</Typography>
          <DataGrid
              rows={facultyRows}
              columns={columns}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              loading={loading.emails}
          />
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
        <ViewStudentsDialog 
          open={open.viewStudents}
          close={closeHandler.viewStudents}
          data={viewStudents}
        />
    </>
  )
}
export default Faculty