import jwt_decode from "jwt-decode";

export const adminAccessLevels = ["Administrator", "Registrar", "Dean", "Chairperson"];
export const facultyAccessLevels = ["Faculty", "Part Time"];
export const AuthUtil = {
    isTokenValid: (token) => {
        if (!token) {
            return false;
        }

        try {
            const decodedToken = jwt_decode(token);
            return Boolean(decodedToken?.exp) && decodedToken.exp * 1000 > Date.now();
        } catch (error) {
            return false;
        }
    },
    statusCodeResponse: (status) => {
        let response = '';
        switch(status){
            case 200:
                response = "Sign-In Successful";
                break;
            case 401:
                response = "Unable to Access the System. Please contact ICT-MIS";
                break;
            case 404:
                response = "User Not Found";
                break;
            default:
                response = "Something went wrong. Please contact Administrator";
                break;
        }
        return response;
    },
    siteCookies: ["picture", "name", "faculty_id", "email", "college_code", "program_code", "campus", "accessLevel", "token"],
    getInitialPath: (cookies) => {
        const accessLevels = [...adminAccessLevels, ...facultyAccessLevels];
        if(accessLevels.includes(cookies.accessLevel)){
            return adminAccessLevels.includes(cookies.accessLevel) ? "/admin" : "/home";
        } else {
            return "/";
        }
    }
}