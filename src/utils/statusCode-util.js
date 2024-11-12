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
        return "Session Expired. Please Sign Out and Sign In Again";    
    } else if(code === 403) {
        return "Session Expired. Please Sign Out and Sign In Again";
    } else if(code === 404) {
        return "Session Not Found. Please Sign Out and Sign In Again";
    } else if(code === 500) {
        return "Network Error. Please Contact ICT-MIS Office"
    } else {
        return "Something went wrong. Please contact ICT-MIS Office"
    }
}