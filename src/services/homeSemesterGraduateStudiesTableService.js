import axiosInstance from "../api/axiosInstance";

export const HomeSemesterGraduateStudiesTableService = {
    updateGraduateStudiesGrade: async (toUpdate, class_code, cookies, dbTermType) => {
        const { data } = await axiosInstance.post(`${process.env.REACT_APP_API_URL}/updateGraduateStudiesGrade`, { grades: toUpdate, class_code, method: "Manual", email_used: cookies.email, term_type: dbTermType });
        return { data }
    }
};