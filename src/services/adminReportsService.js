import axiosInstance from "../api/axiosInstance";
export const AdminReportsService = {
    generateReport: async (url, toGenerateValueInURL, params) => {
        const { data, status } = await axiosInstance.get(`/download/${url}?toGenerate=${toGenerateValueInURL}&${params}`, {
            responseType: "arraybuffer",
        });
        return { data, status };
    }
}