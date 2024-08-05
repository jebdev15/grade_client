// src/features/students/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchFaculty } from './facultyThunks';

const initialState = {
  list: [],
  currentFaculty: null,
  status: 'idle',
  error: null,
};

const facultySlice = createSlice({
  name: 'faculty',
  initialState,
  reducers: {
    addFaculty: (state, action) => {
      state.list.push(action.payload);
    },
    removeFaculty: (state, action) => {
      state.list = state.list.filter(faculty => faculty.id !== action.payload);
    },
    updateFaculty: (state, action) => {
      const index = state.list.findIndex(faculty => faculty.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchFaculty.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchFaculty.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchFaculty.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addFaculty, removeFaculty, updateFaculty } = facultySlice.actions;
export default facultySlice.reducer;
