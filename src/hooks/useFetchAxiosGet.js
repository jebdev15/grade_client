import { useState, useEffect } from 'react';
import axiosInstance from '../api/axiosInstance';

const useFetchAxiosGet = (path) => {
    const [data, setData] = useState(null);
    const [loading, setLoading] = useState(true);
    const [error, setError] = useState(null);
    
    useEffect(() => {
        const fetchData = async () => {
            setLoading(true);
            try {
                const { data } = await axiosInstance.get(path);
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
    }, [path]);
    return { data, loading, error };
};

export default useFetchAxiosGet;