import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import {
  Box,
  IconButton, 
  Typography, 
  Tooltip, 
  ButtonGroup
} from '@mui/material'
import {
  Visibility as VisibilityIcon,
} from '@mui/icons-material'
import { useCookies } from 'react-cookie'
import { initialData } from '../../utils/admin-students.util'
import { useDispatch, useSelector } from 'react-redux'
import { /* addStudent, removeStudent, updateStudent, */ fetchStudents } from '../../features/admin/students/studentsThunks'
import ViewStudentData from '../../components/dialogs/admin/students/View'

const Students = () => {
    const students = useSelector(state => state.students.list);
    const status = useSelector((state) => state.students.status);
    // const error = useSelector((state) => state.students.error);
    const dispatch = useDispatch();

    // const addStudentHandler = () => {
    //     const newStudent = {
    //         id: Math.floor(Math.random() * 1000),
    //         fullName: 'John Doe',
    //     }
    //     dispatch(addStudent(newStudent))
    // }

    // const removeStudentHandler = (id) => {
    //     dispatch(removeStudent(id))
    // }

    // const updateStudentHandler = (student) => {
    //     dispatch(updateStudent(student))
    // }

    const [cookies, ,] = useCookies(initialData.cookies);
    const [loading, setLoading] = useState(true);
    const [studentData, setStudentData] = useState({
        data: {
            id: null,
            fullName: '',
            programMajor: '',
            status: '',
        },
        open: false,
        close: () => setStudentData({ ...studentData, open: false }),
    });
    const columns = [
        { field: 'id', headerName: 'Student ID', hideable: false, width: 150 },
        {
            field: 'fullName',
            headerName: 'Full name',
            hideable: false,
            width: 460,
        },
        {
            field: 'programMajor',
            headerName: 'Program',
            description: 'This column has a value getter and is not sortable.',
            hideable: false,
            sortable: false,
            width: 200,
        },
        {
            field: 'status',
            headerName: 'Status',
            description: 'This column has a value getter and is not sortable.',
            width: 200,
        },
        {
          field: 'action',
          headerName: 'Action',
          description: 'This column has a value getter and is not sortable.',
          hideable: false,
          sortable: false,
          disableColumnMenu: true,
          width: 100,
          renderCell: (params) => {
            const onClick = (e) => {

                setStudentData((prevState) => ({
                    ...prevState,
                    data: params.row,
                    open: true,
                }));
            }
            return (
              <>
                <ButtonGroup variant="text" color="primary" aria-label="">
                  <Tooltip title="View">  
                    <IconButton 
                      name="subjectLoad"
                      aria-label="view" 
                      variant="text" 
                      color="primary" 
                      onClick={onClick}
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
    
    useEffect(() => {
        if (status === 'idle') {
            dispatch(fetchStudents());
        }
        if(['idle','succeeded'].includes(status)) {
            setLoading(false);
        }
    }, [status, dispatch]);
  return (
    <>

        <Box sx={{height: 600, width: '100%'}}>
          <Typography 
          variant="h4"
          fontWeight={700}
          component="div"
          marginBottom={3}
          sx={{ flexGrow: 1 }}
          >LIST OF STUDENTS</Typography>
          <DataGrid
              rows={students}
              columns={columns}
            //   slots={{ toolbar: GridToolbar }}
              initialState={{
                pagination: {
                  paginationModel: {
                    pageSize: 5,
                  },
                },
              }}
              pageSizeOptions={[5, 10, 25]}
              loading={loading}
          />
        </Box>
        {studentData.data.id !== null && <ViewStudentData {...studentData} /> }
    </>
  )
}
export default Students