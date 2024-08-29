const accessLevels = ["Administrator", "Registrar", "Dean", "Chairperson"];
export const checkAccessLevelForMenu = (accessLevel) =>  ["Administrator", "Registrar"].includes(accessLevel)

export const checkAccessLevel = (cookies) => {
   const allowAccess = cookies.hasOwnProperty("faculty_id") && accessLevels.includes(cookies.accessLevel) 
   return allowAccess
}

export const adminIndexUtil = {
   siteCookies: ["picture", "name", "faculty_id", "email", "college_code", "program_code", "campus", "accessLevel", "token"],
}