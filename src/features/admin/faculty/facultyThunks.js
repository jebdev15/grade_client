import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Async thunk to fetch students data
export const fetchFaculty = createAsyncThunk('students/fetchFaculty', async (cookies) => {
    const { college_code, accessLevel } = cookies;
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getEmails?college_code=${college_code}&accessLevel=${accessLevel}`);    
    console.log(data);
    
    return data;
});