import axiosInstance from "../api/axiosInstance";

export const AdminFacultyService = {
    getFacultyBySchoolYearAndSemester: async (school_year, semester) => {
        const { data, status } = await axiosInstance.get(`/admin/getFacultyBySchoolYearAndSemester?school_year=${school_year}&semester=${semester}`);
        return { data, status }
    },
    getSubjectLoadByFacultyIdYearAndSemester: async (faculty_id, school_year, semester) => {
        const { data } = await axiosInstance.get(`/admin/getSubjectLoad?faculty_id=${faculty_id}&school_year=${school_year}&semester=${semester}`);
        return { data }
    },
    getStudentsByClassCode: async (class_code) => {
        const { data, status } = await axiosInstance.get(`/admin/getStudentsByClassCode?class_code=${class_code}`);
        return { data, status }
    },
    updateClassStatusByClassCode: async (formData) => {
        const { data, status } = await axiosInstance.patch(`/admin/updateClassStatusByClassCode`, formData);
        return { data, status }
    },
}