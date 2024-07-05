import axios from "axios";
import { useEffect, useState } from "react";

export const useFetch = (route) => {
    const [data, setData] = useState([]);
    useEffect(() => {
        const fetchData = async () => {
            const response = await axios.get(`${process.env.REACT_APP_API_URL}/${route}`);
            setData(response.data);
        }
        fetchData();
    },[route])
    return data;
}
