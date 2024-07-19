import { Box, Typography, TextField, Button } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { getCollegesServices, saveCollegeServices } from "../../services/admin-settings.services";
import { v4 } from "uuid";
import { useNavigate } from "react-router";

const Colleges = () => {
    const navigate = useNavigate();
    const initialColleges = {
        rows: [],
        loading: true,
        inputs: {
            college_code: '',
            college_desc: '',
        }
    }
    const [colleges, setColleges] = useState(initialColleges);
    const columns= [
        { 
          field: 'id', 
          headerName: 'ID', 
          width: 150, 
          hide: true,
      },
        { field: 'college_code', headerName: 'College', width: 100},
        { field: 'college_desc', headerName: 'Description', width: 400 },
      ]
      useEffect(() => { 
        const getColleges = async () => {
            const { data, status } = await getCollegesServices();
            if(status === 200) {
                const collegesData = data.map(college => {
                    const uuid = v4();
                    return {
                        id: uuid,
                        ...college
                    }
                })
                setColleges((prevState) => ({...prevState, rows: collegesData, loading: false}))
            }
        }  
        getColleges();
    },[])

    const handleChangeCollegeInputs = (e) => {
        console.log(e.target.name,e.target.value);
        setColleges((prevState) => ({
            ...prevState,
            inputs: {
                ...prevState.inputs,
                [e.target.name]: e.target.value
            }
        }))
    }

    const handleSubmitCollege = async (e) => {
        e.preventDefault();
        console.log(e.target);
        const formData = new FormData(e.target);
        // for(const pair of formData.entries()) {
        //     console.log(pair[0], pair[1]);
        // }
        const { data, status } = await saveCollegeServices(formData);
        alert(data.message, status);
        navigate(".", { replace: true });
        setTimeout(() => {
            setColleges((prevState) => ({
                ...prevState,
                inputs: {
                    college_code: '',
                    college_desc: '',
                }
            }));
        },500)
    }
    return (
        <>
        <Box
            sx={{
                display: 'flex',
                mb: 2,
                gap: 2,
            }}
            component='form'
            onSubmit={handleSubmitCollege}
        >
            <Typography>MANAGE COLLEGES</Typography>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    width: 600,
                    gap: 1
                }}
            >
                <TextField
                    name="college_code"
                    label="College Code"
                    value={colleges.inputs.college_code}
                    onChange={handleChangeCollegeInputs}
                    fullWidth
                    required
                />
                <TextField
                    name="college_desc"
                    label="College Description"
                    value={colleges.inputs.college_desc}
                    onChange={handleChangeCollegeInputs}
                    fullWidth
                    required
                />
                <Button type="submit" variant="contained">Save</Button>
            </Box>
            <Box
                sx={{
                    display: 'flex',
                    flexDirection: 'column',
                    alignItems: 'center',
                    gap: 1
                }}
            >
                
                <DataGrid 
                sx={{ 
                    minHeight: "300px",
                    maxWidth: "600px",
                    flexGrow: 1
                }}
                rows={colleges.rows}
                columns={columns}
                initialState={{ 
                    pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                    }
                }}
                pageSizeOptions={[5, 10]}
                loading={colleges.loading}
                />
            </Box>
        </Box>
        </>
    )
}

export default Colleges;