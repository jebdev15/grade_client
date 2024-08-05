// src/features/students/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchAccessLevels } from './accessLevelsThunks';

const initialState = {
  list: [],
  currentAccessLevel: null,
  status: 'idle',
  error: null,
};

const accessLevelsSlice = createSlice({
  name: 'accessLevels',
  initialState,
  reducers: {
    addAccessLevel: (state, action) => {
      state.list.push(action.payload);
    },
    removeAccessLevel: (state, action) => {
      state.list = state.list.filter(accessLevel => accessLevel.id !== action.payload);
    },
    updateAccessLevel: (state, action) => {
      const index = state.list.findIndex(accessLevel => accessLevel.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchAccessLevels.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchAccessLevels.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        console.log(state.list);
      })
      .addCase(fetchAccessLevels.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addAccessLevel, removeAccessLevel, updateAccessLevel } = accessLevelsSlice.actions;
export default accessLevelsSlice.reducer;
