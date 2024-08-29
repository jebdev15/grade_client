import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Async thunk to fetch program code data
export const fetchProgramCodes = createAsyncThunk('students/fetchProgramCodes', async () => {
    const { data } = await axiosInstance.get(`/admin/getProgramCodesByCampus`);
    return data
});