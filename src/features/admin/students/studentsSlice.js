// src/features/students/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchStudents } from './studentsThunks';

const initialState = {
  list: [],
  currentStudent: null,
  status: 'idle',
  error: null,
};



const studentsSlice = createSlice({
  name: 'students',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      state.list.push(action.payload);
    },
    removeStudent: (state, action) => {
      state.list = state.list.filter(student => student.id !== action.payload);
    },
    updateStudent: (state, action) => {
      const index = state.list.findIndex(student => student.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchStudents.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchStudents.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchStudents.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addStudent, removeStudent, updateStudent } = studentsSlice.actions;
export default studentsSlice.reducer;
