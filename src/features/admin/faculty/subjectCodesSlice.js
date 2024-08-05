// src/features/students/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchSubjectCodes } from './subjectCodesThunks';

const initialState = {
  list: [],
  currentSubjectCode: null,
  status: 'idle',
  error: null,
};

const subjectCodesSlice = createSlice({
  name: 'subjectCodes',
  initialState,
  reducers: {
    addStudent: (state, action) => {
      state.list.push(action.payload);
    },
    removeStudent: (state, action) => {
      state.list = state.list.filter(subjectCode => subjectCode.id !== action.payload);
    },
    updateStudent: (state, action) => {
      const index = state.list.findIndex(subjectCode => subjectCode.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchSubjectCodes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchSubjectCodes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchSubjectCodes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addSubjectCode, removeSubjectCode, updateSubjectCode } = subjectCodesSlice.actions;
export default subjectCodesSlice.reducer;
