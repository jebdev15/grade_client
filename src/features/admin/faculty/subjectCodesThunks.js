import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Async thunk to fetch students data
export const fetchSubjectCodes = createAsyncThunk('students/fetchSubjectCodes', async () => {
    const response = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getSubjectCodesGS`);
    return response.data;
});