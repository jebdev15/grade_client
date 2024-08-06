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

export const getStudentsBySearch = async (formData) => {
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