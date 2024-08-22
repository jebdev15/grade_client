import axios from "axios";

export const AuthService = {
    login: async (token, email) => {
        const { data, status } = await axios.post(
            `${process.env.REACT_APP_API_URL}/auth/login`,
            {
                token,
                email
            }, 
            {
                withCredentials: true
            }
        );
        return { data, status };
        // return { data: token, status:200 }
    },
} 