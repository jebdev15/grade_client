// src/features/students/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchProgramCodes } from './programCodesThunks';

const initialState = {
  list: [],
  currentProgramCode: null,
  status: 'idle',
  error: null,
};

const usersSlice = createSlice({
  name: 'programCodes',
  initialState,
  extraReducers: (builder) => {
    builder
      .addCase(fetchProgramCodes.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchProgramCodes.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
      })
      .addCase(fetchProgramCodes.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export default usersSlice.reducer;
