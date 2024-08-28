import { useState } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { AuthUtil } from '../utils/authUtil';

const useFetchAxiosPost = (url, postData) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState(null);
    const [cookies,] = useCookies(AuthUtil.siteCookies);
    const postRequest = async () => {
        setLoading(true);
        try {
        const response = await axios.post(url, postData, {
            headers: {
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${cookies.token}`,
            },
        });
        setData(response.data);
        setError(null);
        } catch (err) {
        setError(err);
        setData(null);
        } finally {
        setLoading(false);
        }
    };

    return { data, loading, error, postRequest };
};

export default useFetchAxiosPost;