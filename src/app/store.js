import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "../features/students/studentsSlice";

export const store = configureStore({
    reducer: {
        students: studentsReducer,
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
    }),
});