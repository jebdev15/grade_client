// src/features/students/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchUsers } from './usersThunks';
import { v4 as uuidv4 } from 'uuid';

const initialState = {
  list: [],
  currentUser: null,
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'users',
  initialState,
  reducers: {
    addUser: (state, action) => {
      state.list.push({
        id: uuidv4(),
        email: action.payload.emailAddress,
        status: 'Active',
        ...action.payload
        });
    },
    removeUser: (state, action) => {
      state.list = state.list.filter(user => user.id !== action.payload);
    },
    updateUser: (state, action) => {
      const index = state.list.findIndex(user => user.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchUsers.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchUsers.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchUsers.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addUser, removeUser, updateUser } = usersSlice.actions;
export default usersSlice.reducer;
