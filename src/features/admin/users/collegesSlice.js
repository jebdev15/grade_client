// src/features/students/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchColleges } from './collegesThunks';

const initialState = {
  list: [],
  currentCollege: null,
  status: 'idle',
  error: null,
};

const collegesSlice = createSlice({
  name: 'colleges',
  initialState,
  reducers: {
    addAccessLevel: (state, action) => {
      state.list.push(action.payload);
    },
    removeAccessLevel: (state, action) => {
      state.list = state.list.filter(college => college.id !== action.payload);
    },
    updateAccessLevel: (state, action) => {
      const index = state.list.findIndex(college => college.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchColleges.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchColleges.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        console.log(state.list);
      })
      .addCase(fetchColleges.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addCollege, removeCollege, updateCollege } = collegesSlice.actions;
export default collegesSlice.reducer;
