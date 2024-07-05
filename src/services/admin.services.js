import axios from "axios";

export const getAllData = async () => {
    const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/admin/getAllData`
    );
    return data;
}