import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Async thunk to fetch students data
export const fetchNoAccounts = createAsyncThunk('students/fetchNoAccounts', async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getAllNoAccounts`);
    return data.rows
});