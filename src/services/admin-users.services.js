import axios from "axios";

export const getColleges = async () => {
    const { data, status } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getColleges`);
    return { data, status };
}