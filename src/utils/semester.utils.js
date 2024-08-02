import { urlEncode } from "url-encode-base64";

export const identifyGraduateStudiesLoad = (subject_codes, subject_code) => subject_codes.includes(subject_code) ? true : false

export const extractSubjectCode = (subject_codes) => subject_codes.map((subject) => subject?.subject_code);

export const identifyPrintLink = (checkIfGraduateStudiesLoad, semester, currentSchoolYear, cookies, encodedClassCode) => {
    return checkIfGraduateStudiesLoad ? `/print/${semester}-${currentSchoolYear}-${urlEncode(cookies.faculty_id)}/${encodedClassCode}/graduateStudies` : `/print/${semester}-${currentSchoolYear}-${urlEncode(cookies.faculty_id)}/${encodedClassCode}`
}

// Function to extract a cookie value by name
export const getCookieValue = (cookies, name) => {
  const value = `; ${cookies}`;
  const parts = value.split(`; ${name}=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
};

export const submittedGradeSheetMessage = (data) => {
      const filterNoMidtermGrade = data.filter(student => ['',0,'null'].includes(student.midTermGrade))
      const filterNoEndtermGrade = data.filter(student => ['',0,'null'].includes(student.endTermGrade))
      const midTermAlert = filterNoMidtermGrade.length > 0 ? `There are ${filterNoMidtermGrade.length} students without a midterm grade` : "";
      const endTermAlert = filterNoEndtermGrade.length > 0 ? `There are ${filterNoEndtermGrade.length} students without an endterm grade` : "";
      const alertMessage = `Are you sure you want to submit this grade sheet? Once submitted, it cannot be edited. \n #Contact Registrar for Grades Revision\n${midTermAlert}\n${endTermAlert}`
      return alertMessage;
}