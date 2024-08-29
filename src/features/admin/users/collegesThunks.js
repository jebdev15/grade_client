import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Async thunk to fetch students data
export const fetchColleges = createAsyncThunk('students/fetchColleges', async () => {
    const { data } = await axiosInstance.get(`/admin/getColleges`);
    return data 
});