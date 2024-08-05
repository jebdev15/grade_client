// src/features/students/studentsSlice.js
import { createSlice } from '@reduxjs/toolkit';
import { fetchNoAccounts } from './noAccountsThunks';

const initialState = {
  list: [],
  currentNoAccount: null,
  status: 'idle',
  error: null,
};

const noAccountsSlice = createSlice({
  name: 'colleges',
  initialState,
  reducers: {
    addNoAccount: (state, action) => {
      state.list.push(action.payload);
    },
    removeNoAccount: (state, action) => {
      state.list = state.list.filter(noAccount => noAccount.id !== action.payload);
    },
    updateNoAccount: (state, action) => {
      const index = state.list.findIndex(noAccount => noAccount.id === action.payload.id);
      if (index !== -1) {
        state.list[index] = action.payload;
      }
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchNoAccounts.pending, (state) => {
        state.status = 'loading';
      })
      .addCase(fetchNoAccounts.fulfilled, (state, action) => {
        state.status = 'succeeded';
        state.list = action.payload;
        console.log(state.list);
      })
      .addCase(fetchNoAccounts.rejected, (state, action) => {
        state.status = 'failed';
        state.error = action.error.message;
      });
  },
});

export const { addNoAccount, removeNoAccount, updateNoAccount } = noAccountsSlice.actions;
export default noAccountsSlice.reducer;
