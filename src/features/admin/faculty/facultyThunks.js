import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';
// Async thunk to fetch students data
export const fetchFaculty = createAsyncThunk('students/fetchFaculty', async () => {
    const { data } = await axiosInstance.get(`/admin/getEmails`);    
    return data;
});