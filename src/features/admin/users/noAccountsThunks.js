import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Async thunk to fetch students data
export const fetchNoAccounts = createAsyncThunk('students/fetchNoAccounts', async () => {
    const { data } = await axiosInstance.get(`/admin/getAllNoAccounts`);
    return data.rows
});