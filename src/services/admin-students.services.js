import axiosInstance from "../api/axiosInstance";

export const getStudentsInitialData = async (cookies) => {
    const { college_code, accessLevel } = cookies;
    const { data, status } = await axiosInstance.get(`/admin/getStudentsInitialData?college_code=${college_code}&accessLevel=${accessLevel}`);
    return { data, status }
}

export const getStudentGrades = async (student_id, year_level, semester, school_year) => {
    const { data, status } = await axiosInstance.get(`/admin/getStudentGrades?student_id=${student_id}&year_level=${year_level}&semester=${semester}&school_year=${school_year}`);
    return { data, status }
}

export const getStudentYearSemesterAndSchoolYear = async (student_id) => {
    const { data, status } = await axiosInstance.get(`/admin/getStudentYearSemesterAndSchoolYear?student_id=${student_id}`);
    return { data, status }
}

export const getStudentsBySearch = async (searchParam) => {
    const formData = new FormData();
    formData.append('searchParam', searchParam);
    const { data, status } = await axiosInstance.post(`/admin/getStudentsBySearch`, 
        formData, 
        { 
            headers: {
                'Content-Type': 'application/json'
            },
        }
    );
    return { data, status }
}