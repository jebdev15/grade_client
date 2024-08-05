import { Close } from "@mui/icons-material"
import { Box, Card, Dialog, DialogContent, DialogTitle, Divider, IconButton, Typography } from "@mui/material"
import { useEffect, useState } from "react";
import { getStudentGrades, getStudentYearSemesterAndSchoolYear } from "../../../../services/admin-students.services";
import FullWidthTabs from "./Tabs";
import { DataGrid } from "@mui/x-data-grid";

const ViewStudentData = ({
    open,
    close,
    data
}) => {
    const { id } = data;
    const [grades, setGrades] = useState({
        data: [],
        loading: true,
    });
    const [studentYearSemesterAndSchoolYears, setStudentYearSemesterAndSchoolYears] = useState([]);
    useEffect(() => {
        const axiosGetStudentYearSemesterAndSchoolYear = async () => {
            const { data, status } = await getStudentYearSemesterAndSchoolYear(id);
            console.log(data, status);
            if(status === 200 && data.length > 0){
                setStudentYearSemesterAndSchoolYears(data)
            }
        }
        axiosGetStudentYearSemesterAndSchoolYear();
      }, [id]);
      const getStudentGradesHandler = async (student_id, year_level, semester, school_year) => {
        // setGrades({loading: true});
        const { data, status } = await getStudentGrades(student_id, year_level, semester, school_year);
        console.log(data, status);
        if(status === 200 && data.length > 0){
            setGrades((prevState) => ({
                ...prevState,
                data,
                loading: false,
            }));
        }
      }
      const columns = [
        { field: 'id', headerName: 'Student ID', hide: true, width: 150 },
        {
            field: 'subject_code',
            headerName: 'Subject Code',
            description: 'This column has a value getter and is not sortable.',
            hideable: false,
            sortable: false,
            width: 200,
        },
        {
            field: 'mid_grade',
            headerName: 'Mid Grade',
            description: 'This column has a value getter and is not sortable.',
            width: 200,
        },
        {
          field: 'final_grade',
          headerName: 'Final Grade',
          description: 'This column has a value getter and is not sortable.',
          width: 200,
        },
        {
          field: 'grade',
          headerName: 'Grade',
          description: 'This column has a value getter and is not sortable.',
          width: 200,
        },
        {
          field: 'credit',
          headerName: 'Credit',
          description: 'This column has a value getter and is not sortable.',
          width: 200,
        },
    ];
    return (
      <>
        <Dialog 
          open={open} 
          onClose={close} 
          aria-labelledby={"dialog-view"}
          maxWidth={"xl"}
        >
          <DialogTitle id={"dialog-view-title"}>
              View Student
          </DialogTitle>
          <IconButton 
            aria-label="close" 
            onClick={close}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
          <DialogContent dividers sx={{ padding: 0, margin: 0 }}>
          <Box 
            sx={{ 
              margin: 0,
              padding: 0,
              height: 500,
              width: 1500,
              display: 'flex',
              columnGap: 2,
             }}
            >
            <ul>
                <li>{data.id}</li>
                <li>{data.fullName}</li>
                <li>{data.programMajor}</li>
                <li>{data.status}</li>
            </ul>
            <Divider orientation="vertical" flexItem />
            <div style={{ maxWidth: 200, display: 'flex', flexDirection: 'column', gap: 2 }} >
                <h6>YEAR/SEMESTER/SCHOOL YEAR</h6>
                {studentYearSemesterAndSchoolYears.map(({
                  student_grades_id,
                  student_id,
                  year_level,
                  semester,
                  school_year
                }) => (
                  <Card 
                    key={student_grades_id} 
                    sx={{  
                      minHeight: 50,
                      minWidth: 50,
                    }}
                    onClick={() => getStudentGradesHandler(student_id, year_level, semester, school_year)}
                  >
                    <Typography 
                      variant="body1" 
                      color="initial" 
                      
                      sx={{ 
                        textAlign: 'center',
                        verticalAlign: 'middle',
                       }}
                    >
                      {`${year_level} - ${semester} - ${school_year} - ${parseInt(school_year) + 1}`}
                    </Typography>
                  </Card>
                ))}
            </div>
            <Divider orientation="vertical" flexItem />
            <DataGrid
              rows={grades.data}
              columns={columns}
            //   slots={{ toolbar: GridToolbar }}
              // initialState={{
              //   pagination: {
              //     paginationModel: {
              //       pageSize: 5,
              //     },
              //   },
              // }}
              // pageSizeOptions={[5, 10, 25]}
              loading={grades.loading}
          />
    
            </Box>
          </DialogContent>
        </Dialog>
      </>
        
    )
}

export default ViewStudentData;