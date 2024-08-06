import { createAsyncThunk } from '@reduxjs/toolkit';
import axios from 'axios';
// Async thunk to fetch students data
export const fetchUsers = createAsyncThunk('students/fetchUsers', async (cookies) => {
    
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getAllEmails`);
    if(cookies.accessLevel !== 'Administrator') {
        const filteredData = data.filter(user => user.accessLevel !== 'Administrator')
        return filteredData
      } else {
        return data 
      }
});