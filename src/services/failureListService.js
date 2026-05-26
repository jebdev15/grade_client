import axiosInstance from "api/axiosInstance";

export const FailureListService = {
  getWindow: async (school_year, semester, term_type) => {
    const termQuery = term_type ? `&term_type=${term_type}` : "";
    const { data } = await axiosInstance.get(
      `/failure-list/admin/window?school_year=${school_year}&semester=${semester}${termQuery}`
    );
    return data;
  },
  getWindows: async () => {
    const { data } = await axiosInstance.get(`/failure-list/admin/window/list`);
    return data;
  },
  saveWindow: async (payload) => {
    const { data } = await axiosInstance.post(`/failure-list/admin/window`, payload);
    return data;
  },
  deleteWindow: async (id) => {
    const { data } = await axiosInstance.delete(`/failure-list/admin/window/${id}`);
    return data;
  },
  getAdminRoster: async (class_code, term_type) => {
    const termQuery = term_type ? `&term_type=${term_type}` : "";
    const { data } = await axiosInstance.get(
      `/failure-list/admin/class?class_code=${class_code}${termQuery}`
    );
    return data;
  },
  getFacultyRoster: async (class_code, term_type) => {
    const termQuery = term_type ? `&term_type=${term_type}` : "";
    const { data } = await axiosInstance.get(
      `/failure-list/faculty/class?class_code=${class_code}${termQuery}`
    );
    return data;
  },
  submitList: async (payload) => {
    const { data } = await axiosInstance.post(`/failure-list/faculty/submit`, payload);
    return data;
  },
  adminUpsertList: async (payload) => {
    const { data } = await axiosInstance.put(`/failure-list/admin/class`, payload);
    return data;
  },
  adminDeleteList: async (class_code, term_type) => {
    const termQuery = term_type ? `&term_type=${term_type}` : "";
    const { data } = await axiosInstance.delete(
      `/failure-list/admin/class?class_code=${class_code}${termQuery}`
    );
    return data;
  },
};
