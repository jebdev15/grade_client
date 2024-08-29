import axiosInstance from "../api/axiosInstance";

export const AuthService = {
    login: async (token, email) => {
        const { data, status } = await axiosInstance.post(`/auth/login`,{ token, email });
        return { data, status };
    },
} 