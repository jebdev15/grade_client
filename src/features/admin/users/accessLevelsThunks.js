import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Async thunk to fetch students data
export const fetchAccessLevels = createAsyncThunk('students/fetchAccessLevels', async (cookies) => {
    const { data } = await axiosInstance.get(`/admin/getAccessLevels`);
    return data
});