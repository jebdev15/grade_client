import { createAsyncThunk } from '@reduxjs/toolkit';
import axiosInstance from '../../../api/axiosInstance';

// Async thunk to fetch students data
export const fetchUsers = createAsyncThunk('students/fetchUsers', async (cookies) => {
    
    const { data } = await axiosInstance.get(`/admin/getAllEmails`);
    if(cookies.accessLevel !== 'Administrator') {
        const filteredData = data.filter(user => user.accessLevel !== 'Administrator')
        return filteredData
      } else {
        return data 
      }
});