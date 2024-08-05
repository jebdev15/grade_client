import axios from "axios";

export const getEmailsService = async (cookies) => {
    const { college_code, accessLevel } = cookies;
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getEmails?college_code=${college_code}&accessLevel=${accessLevel}`);
    return { data, status }
}

export const getGradeTableService = async (class_code) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getGradeTable?class_code=${class_code}`);
    return { data }
}