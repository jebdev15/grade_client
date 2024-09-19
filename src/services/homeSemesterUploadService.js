import axios from "axios";
import axiosInstance from "../api/axiosInstance";

export const HomeSemesterUploadService = {
    getExcelFile: async (semester, currentSchoolYear, class_code, cookies, loadInfo) => {
        const { data, status } = await axiosInstance.get(
            `/getExcelFile?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}&name=${cookies.name.toUpperCase()}&classSection=${loadInfo.section}`,
            {
              responseType: "arraybuffer",
            }
        );
        return { data, status }
    },
    uploadGradeSheet: async (formData) => {
        const { data } = await axios.post(
            `${process.env.REACT_APP_API_URL}/uploadGradeSheet`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
              withCredentials: true
            }
        );
        return { data }
    }
}