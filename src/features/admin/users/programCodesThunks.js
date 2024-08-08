import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Async thunk to fetch program code data
export const fetchProgramCodes = createAsyncThunk('students/fetchProgramCodes', async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getProgramCodesByCampus`);
    return data
});