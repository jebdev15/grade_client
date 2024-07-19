import axios from "axios";

export const getAllData = async () => {
    const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/getAllData`
    );
    return data;
}

export const getEmailsService = async () => {
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getEmails`);
    return { data, status }
}

export const getGradeTableService = async (class_code) => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getGradeTable?class_code=${class_code}`);
    return { data }
}