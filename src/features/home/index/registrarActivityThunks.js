import { createAsyncThunk } from '@reduxjs/toolkit';
import { HomeIndexService } from '../../../services/homeIndexService';

// Async thunk to fetch students data
export const fetchRegistrarActivity = createAsyncThunk('home/index/fetchRegistrarActivity', async () => {
    const { data } = await HomeIndexService.getRegistrarActivity();
    return { data }
});