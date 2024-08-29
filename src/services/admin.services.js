import axiosInstance from "../api/axiosInstance";

export const getEmailsService = async (cookies) => {
    const { college_code, accessLevel } = cookies;
    const { data, status } = await axiosInstance.get(`/admin/getEmails?college_code=${college_code}&accessLevel=${accessLevel}`);
    return { data, status }
}

export const getGradeTableService = async (class_code) => {
    const { data } = await axiosInstance.get(`/admin/getGradeTable?class_code=${class_code}`);
    return { data }
}