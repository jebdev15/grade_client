import axiosInstance from "../api/axiosInstance";

export const HomeSemesterServices = {
    getSubjectLoadByFacultyIdYearAndSemester: async (faculty_id, currentSchoolYear, semester) => {
        const { data } = await axiosInstance.get(`/getLoad?faculty_id=${faculty_id}&school_year=${currentSchoolYear}&semester=${semester}`);
        return { data };
    },
    getRegistrarActivity: async () => {
        const { data } = await axiosInstance.get(`/getRegistrarActivity`);
        return { data };
    },
    getGraduateStudiesLoad: async () => {
        const { data } = await axiosInstance.get(`/getGraduateStudiesLoad`);
        return { data };
    }
}