import axiosInstance from "../api/axiosInstance";

export const getGraduateStudiesServices = async () => { 
    const { data, status } = await axiosInstance.get(`/getGraduateStudiesLoad`); 
    return { data, status };
}

export const getCollegesServices = async () => { 
    const { data, status } = await axiosInstance.get(`/admin/getColleges`); 
    return { data, status };
}

export const saveCollegeServices = async (formData) => { 
    const { data, status } = await axiosInstance.post(`/admin/saveCollege`, formData); 
    return { data, status };
}

export const getProgramCodesServices = async () => { 
    const { data, status } = await axiosInstance.get(`/admin/getProgramCodes`); 
    return { data, status };
}

export const getSubjectCodesServices = async (curriculum_id) => { 
    const { data, status } = await axiosInstance.get(`/admin/getSubjectCodes?curriculum_id=${curriculum_id}`); 
    return { data, status };
}

export const saveDeadlineServices = async (formData) => { 
    const { data, status } = await axiosInstance.post(`/admin/updateSchedule`, formData); 
    return { data, status };
}

export const getDeadlineLogsServices = async () => { 
    const { data, status } = await axiosInstance.get(`/admin/getDeadlineLogs`); 
    return { data, status };
}

export const updateClassStatusServices = async (formData) => {
    const { data, status } = await axiosInstance.post(`/admin/updateClassStatus`, formData);
    return { data, status };
}

export const saveSubjectCodeServices = async (formData) => { 
    const { data, status } = await axiosInstance.post(`/admin/saveSubjectCode`, formData); 
    return { data, status };
}