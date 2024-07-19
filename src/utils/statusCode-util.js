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