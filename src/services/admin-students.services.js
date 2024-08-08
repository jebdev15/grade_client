import axios from "axios";

export const getStudentsInitialData = async (cookies) => {
    const { college_code, accessLevel } = cookies;
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getStudentsInitialData?college_code=${college_code}&accessLevel=${accessLevel}`);
    return { data, status }
}

export const getStudentGrades = async (student_id, year_level, semester, school_year) => {
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getStudentGrades?student_id=${student_id}&year_level=${year_level}&semester=${semester}&school_year=${school_year}`);
    return { data, status }
}

export const getStudentYearSemesterAndSchoolYear = async (student_id) => {
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getStudentYearSemesterAndSchoolYear?student_id=${student_id}`);
    return { data, status }
}

export const getStudentsBySearch = async (searchParam, cookies) => {
    const { college_code, accessLevel, program_code } = cookies;
    const formData = new FormData();
    formData.append('searchParam', searchParam);
    formData.append('accessLevel', accessLevel);
    formData.append('college_code', college_code);
    formData.append('program_code', program_code);
    const { data, status } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/getStudentsBySearch`, 
        formData, 
        { 
            headers: {
                'Content-Type': 'application/json'
            } 
        }
    );
    return { data, status }
}