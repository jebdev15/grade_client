import { useState, useEffect } from 'react';
import axios from 'axios';
import { useCookies } from 'react-cookie';
import { AuthUtil } from '../utils/authUtil';
import { REACT_APP_API_URL } from '../utils/envVariables';

const useFetchAxiosGet = (path) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    const [cookies,] = useCookies(AuthUtil.siteCookies);

    useEffect(() => {
        const fetchData = async () => {
        setLoading(true);
        try {
            const { data } = await axios.get(`${REACT_APP_API_URL}${path}`, {
            headers: {
                'Content-Type': 'application/json',
            },
            withCredentials: true
            });
            setData(data);
            setError(null);
        } catch (err) {
            setError(err);
            setData(null);
        } finally {
            setLoading(false);
        }
        };

        fetchData();
    }, [path, cookies]);

    return { data, loading, error };
};

export default useFetchAxiosGet;