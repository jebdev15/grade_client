const accessLevels = ["Faculty", "Part Time"];

export const homeIndexUtil = {
   checkHomeAccessLevel: (cookies) => {
      // return cookies.hasOwnProperty("faculty_id") && accessLevels.includes(cookies.accessLevel);
      return cookies.hasOwnProperty('token') && accessLevels.includes(cookies.accessLevel);
       
   },
   siteCookies: ["picture", "name", "faculty_id", "email", "college_code", "program_code", "campus", "accessLevel", "token"],
}