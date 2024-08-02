import axios from "axios";

export const getStudentsInitialData = async (cookies) => {
    const { college_code, accessLevel } = cookies;
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getStudentsInitialData?college_code=${college_code}&accessLevel=${accessLevel}`);
    return { data, status }
}

export const getStudentGrades = async (student_id) => {
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getStudentGrades?student_id=${student_id}`);
    return { data, status }
}