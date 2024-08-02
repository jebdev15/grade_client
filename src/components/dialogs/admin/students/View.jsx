import { Close } from "@mui/icons-material"
import { Box, Dialog, DialogContent, DialogTitle, IconButton } from "@mui/material"
import { useEffect, useState } from "react";
import { getStudentGrades } from "../../../../services/admin-students.services";

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
    useEffect(() => {
        const axiosGetStudentGrades = async () => {
            const { data, status } = await getStudentGrades(id);
            console.log(data, status);
            if(status === 200 && data.length > 0){
                setGrades((prevState) => ({
                    ...prevState,
                    data,
                    loading: false,
                }));
            }
        }
        axiosGetStudentGrades();
      }, [id]);
    return (
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
          <DialogContent dividers>
          <Box 
            
            sx={{ 
              height: 500,
              width: 1500,
             }}
            >
            <ul>
                <li>{data.id}</li>
                <li>{data.fullName}</li>
                <li>{data.programMajor}</li>
                <li>{data.status}</li>
            </ul>
            <div>
                <h2>Student Grades</h2>
                {grades.loading 
                ? (<div>Loading...</div>) 
                : (grades.data.length > 0) 
                    ? (
                        <ul>
                        {grades.data.map((grade, index) => (
                            <li key={index}>{`Subject Code: ${grade.subject_code}`} - {`Mid Grade: ${grade.mid_grade}`} - {`Final Grade: ${grade.final_grade}`} - {`Grade: ${grade.grade}`} - {`Remarks: ${grade.remarks}`}</li>
                        ))}
                        </ul>
                    )
                    : (<div>No grades found</div>)}
            </div>
    
            </Box>
          </DialogContent>
        </Dialog>
    )
}

export default ViewStudentData;