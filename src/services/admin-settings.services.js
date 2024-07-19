import axios from "axios";

export const getGraduateStudiesServices = async () => { 
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/getGraduateStudiesLoad`); 
    return { data, status };
}

export const getCollegesServices = async () => { 
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getColleges`); 
    return { data, status };
}

export const saveCollegeServices = async (formData) => { 
    const { data, status } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/saveCollege`, formData, { headers: {'Content-Type': 'application/json'} }); 
    return { data, status };
}

export const getProgramCodesServices = async () => { 
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getProgramCodes`); 
    return { data, status };
}

export const getSubjectCodesServices = async (curriculum_id) => { 
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getSubjectCodes?curriculum_id=${curriculum_id}`); 
    return { data, status };
}

export const saveDeadlineServices = async (formData) => { 
    const { data, status } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/updateSchedule`, formData, { headers: {'Content-Type': 'application/json'} }); 
    return { data, status };
}

export const getDeadlineLogsServices = async () => { 
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getDeadlineLogs`); 
    return { data, status };
}

export const updateClassStatusServices = async (formData) => {
    const { data, status } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/updateClassStatus`, formData, { headers: {'Content-Type': 'application/json'} });
    return { data, status };
}

export const saveSubjectCodeServices = async (formData) => { 
    const { data, status } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/saveSubjectCode`, formData, { headers: {'Content-Type': 'application/json'} }); 
    return { data, status };
}