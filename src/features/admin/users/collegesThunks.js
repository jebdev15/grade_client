import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Async thunk to fetch students data
export const fetchColleges = createAsyncThunk('students/fetchColleges', async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getColleges`);
    return data 
});