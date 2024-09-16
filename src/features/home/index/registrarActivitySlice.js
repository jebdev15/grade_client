// src/features/students/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchRegistrarActivity } from './registrarActivityThunks';

const initialState = {
  list: [],
  currentRegistrarActivity: null,
  status: 'idle',
  error: null,
};

const registrarActivitySlice = createSlice({
  name: 'registrarActivity',
  initialState,
  reducers: {
    addRegistrarActivity: (state, action) => {
      state.list.push({...action.payload});
    },
    removeRegistrarActivity: (state, action) => {
      state.list = state.list.filter(registrarActivity => registrarActivity.id !== action.payload);
    },
    updateRegistrarActivity: (state, action) => {
      const index = state.list.findIndex(registrarActivity => registrarActivity.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchRegistrarActivity.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchRegistrarActivity.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchRegistrarActivity.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addRegistrarActivity, removeRegistrarActivity, updateRegistrarActivity } = registrarActivitySlice.actions;
export default registrarActivitySlice.reducer;
