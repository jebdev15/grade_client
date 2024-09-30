export const getCampus = () => {
    const referer = getURLReferer();
    let campus;
    switch (referer) {
        case "https://staging-gs.chmsu.edu.ph" || "https://www.staging-gs.chmsu.edu.ph":
            campus= "Staging Campus";
            break;
        case "https://gs.chmsu.edu.ph" || "https://www.gs.chmsu.edu.ph":
            campus= "Talisay Campus";
            break;
        case "https://ft-gs.chmsu.edu.ph" || "https://www.ft-gs.chmsu.edu.ph":
            campus= "Fortune Towne Campus";
            break;
        case "https://bin-gs.chmsu.edu.ph" || "https://www.bin-gs.chmsu.edu.ph":
            campus= "Binalbagan Campus";
            break;
        case "https://ali-gs.chmsu.edu.ph" || "https://www.ali-gs.chmsu.edu.ph":
            campus= "Alijis Campus";
            break;
        case "https://test-gs.chmsu.edu.ph" || "https://www.test-gs.chmsu.edu.ph":
                campus= "Test Talisay Campus";
            break;    
        default:
            campus= "Campus";
            break;
    }
    return campus;
}

export const getURLReferer = () => {
    // console.log(window.location.origin);
    // console.log(window.location.href);
    return window.location.origin;
}