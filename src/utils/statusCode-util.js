export const authenticationResponse = (code) => {
    if (code === 200) {
        return;
    } else if(code === 401) {
        return "INVALID CREDENTIALS";    
    } else if(code === 404) {
        return "USER NOT FOUND";
    } else if(code === 500) {
        return "NETWORK ERROR"
    } 
};

export const sessionResponse = (code) => {
    if (code === 200) {
        return;
    } else if(code === 401) {
        return "SESSION EXPIRED. PLEASE SIGN OUT AND SIGN IN AGAIN";    
    } else if(code === 403) {
        return "SESSION EXPIRED. PLEASE SIGN OUT AND SIGN IN AGAIN";
    } else if(code === 404) {
        return "SESSION NOT FOUND. PLEASE SIGN OUT AND SIGN IN AGAIN";
    } else if(code === 500) {
        return "NETWORK ERROR. CONTACT ICT-MIS OFFICE ADMINISTRATOR"
    } else {
        return "Something went wrong. Please contact Administrator"
    }
}