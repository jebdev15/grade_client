const accessLevels = ["Faculty", "Part Time"];

export const checkHomeAccessLevel = (cookies) => {
   return cookies.hasOwnProperty("faculty_id") && accessLevels.includes(cookies.accessLevel);
}