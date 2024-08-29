import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Async thunk to fetch students data
export const fetchSubjectCodes = createAsyncThunk('students/fetchSubjectCodes', async () => {
    const response = await axiosInstance.get(`/admin/getSubjectCodesGS`);
    return response.data;
});