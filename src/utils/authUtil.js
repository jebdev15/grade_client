const adminAccessLevels = ["Administrator", "Registrar", "Dean", "Chairperson"];
const facultyAccessLevels = ["Faculty", "Part Time"];
export const AuthUtil = {
    statusCodeResponse: (status) => {
        let response = '';
        switch(status){
            case 200:
                response = "Success";
                break;
            case 401:
                response = "Invalid Credentials";
                break;
            case 404:
                response = "Not Found";
                break;
            default:
                response = "Something went wrong. Please contact Administrator";
                break;
        }
        return response;
    },
    siteCookies: ["picture", "name", "faculty_id", "email", "college_code", "program_code", "campus", "accessLevel", "token"],
    getInitialPath: (cookies) => {
        console.log(cookies);
        const accessLevels = [...adminAccessLevels, ...facultyAccessLevels];
        if(accessLevels.includes(cookies.accessLevel)){
            return adminAccessLevels.includes(cookies.accessLevel) ? "/admin" : "/home";
        } else {
            return "/";
        }
    }
}