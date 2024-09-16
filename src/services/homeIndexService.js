import axiosInstance from "../api/axiosInstance";

export const HomeIndexService = {
    getRegistrarActivity: async () => {
        const { data } = await axiosInstance.get(`/getRegistrarActivity`);
        return { data };
    },  
}