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
    getRegistrarActivityBySemester: async (semester) => {
        const { data } = await axiosInstance.get(`/getRegistrarActivityBySemester?semester=${semester}`);
        return { data };
    },
    getGraduateStudiesLoad: async () => {
        const { data } = await axiosInstance.get(`/getGraduateStudiesLoad`);
        return { data };
    },
    getStudentsByYearSemesterAndClassCode: async (currentSchoolYear, semester, class_code) => {
        const { data } = await axiosInstance.get(`/getGradeTable?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}`);
        return { data };
    },
    getGraduateStudiesStudentsByYearSemesterAndClassCode: async (currentSchoolYear, semester, class_code) => {
        const { data } = await axiosInstance.get(`/getGraduateStudiesTable?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}`);
        return { data };
    },
    getFacultyLoadByFacultyIdYearSemesterAndClassCode: async (faculty_id, currentSchoolYear, semester, class_code) => {
        const { data: facultyLoadData, status } = await axiosInstance.get(`/getLoad?faculty_id=${faculty_id}&school_year=${currentSchoolYear}&semester=${semester}&class_code=${class_code}`);
        console.log(facultyLoadData);
        
        return { facultyLoadData, status };
    },
    getClassCodeDetails: async (semester, currentSchoolYear, class_code) => {
        const { data } = await axiosInstance.get(`/getClassCodeDetails?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}`);
        return { data };
    },
    getClassStudents: async (semester, currentSchoolYear, class_code) => {
        const { data: students } = await axiosInstance.get(`/getClassStudents?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}`);
        return { students };
    },
    updateGrade: async (data) => {
        const { data: updatedData } = await axiosInstance.post(`/updateGrade`, data);
        return { updatedData };
    },
    submitGradeSheetConfirmation: async (semester, currentSchoolYear, encodedClassCode) => {
        const { data } = await axiosInstance.get(`/getClassStudents?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${encodedClassCode}`);
        return { data };
    },
    submitGradeSheet: async (formData) =>  {
        return await axiosInstance.post(`/submitGradeSheet`,formData);
    }
}