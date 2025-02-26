import axiosInstance from "../api/axiosInstance";

const getAllEmailsForExtension = async (school_year, semester) => {
    const { data, status } = await axiosInstance.get(`/admin/getAllEmailsForExtension?school_year=${school_year}&semester=${semester}`);
    return { data, status };
}
const getGraduateStudiesServices = async () => { 
    const { data, status } = await axiosInstance.get(`/getGraduateStudiesLoad`); 
    return { data, status };
}

const getCollegesServices = async () => { 
    const { data, status } = await axiosInstance.get(`/admin/getColleges`); 
    return { data, status };
}

const saveCollegeServices = async (formData) => { 
    const { data, status } = await axiosInstance.post(`/admin/saveCollege`, formData); 
    return { data, status };
}

const getProgramCodesServices = async () => { 
    const { data, status } = await axiosInstance.get(`/admin/getProgramCodes`); 
    return { data, status };
}

const getSubjectCodesServices = async (curriculum_id) => { 
    const { data, status } = await axiosInstance.get(`/admin/getSubjectCodes?curriculum_id=${curriculum_id}`); 
    return { data, status };
}

const saveDeadlineServices = async (formData) => { 
    const { data, status } = await axiosInstance.post(`/admin/updateSchedule`, formData); 
    return { data, status };
}

const getDeadlineLogsServices = async () => { 
    const { data, status } = await axiosInstance.get(`/admin/getDeadlineLogs`); 
    return { data, status };
}

const updateClassStatusServices = async (formData) => {
    const { data, status } = await axiosInstance.post(`/admin/updateClassStatus`, formData);
    return { data, status };
}

const saveSubjectCodeServices = async (formData) => { 
    const { data, status } = await axiosInstance.post(`/admin/saveSubjectCode`, formData); 
    return { data, status };
}

const getRegistrarActivity = async () => {
    const { data, status } = await axiosInstance.get(`/admin/getRegistrarActivity`);
    return { data, status };
}
const getRegistrarActivityBySemester = async (semester) => {
    const { data, status } = await axiosInstance.get(`/admin/getRegistrarActivityBySemester?semester=${semester}`);
    return { data, status };
}

const updateRegistrarActivityById = async (formData) => {
    const { data, status } = await axiosInstance.put(`/admin/updateRegistrarActivityById`, formData);
    return { data, status };
}

const updateClassStatusByYearAndSemester = async (formData) => {
    const { data, status } = await axiosInstance.put(`/admin/updateClassStatusByYearAndSemester`, formData);
    return { data, status };
}
export const AdminSettingsServices = {
    getAllEmailsForExtension,
    getGraduateStudiesServices,
    getCollegesServices,
    saveCollegeServices,
    getProgramCodesServices,
    getSubjectCodesServices,
    saveDeadlineServices,
    getDeadlineLogsServices,
    updateClassStatusServices,
    saveSubjectCodeServices,
    getRegistrarActivity,
    getRegistrarActivityBySemester,
    updateRegistrarActivityById,
    updateClassStatusByYearAndSemester
}