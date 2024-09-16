import { configureStore } from "@reduxjs/toolkit";
import studentsReducer from "../features/admin/students/studentsSlice";
import subjectCodesReducer from "../features/admin/faculty/subjectCodesSlice";
import usersReducer from "../features/admin/users/usersSlice";
import accessLevelsReducer from "../features/admin/users/accessLevelsSlice";
import collegesReducer from "../features/admin/users/collegesSlice";
import noAccountsReducer from "../features/admin/users/noAccountsSlice";
import programCodesReducer from "../features/admin/users/programCodesSlice";
import facultyReducer from "../features/admin/faculty/facultySlice";
import registrarActivityReducer from "../features/home/index/registrarActivitySlice";

export const store = configureStore({
    reducer: {
        students: studentsReducer,
        subjectCodes: subjectCodesReducer,
        users: usersReducer,
        accessLevels: accessLevelsReducer,
        colleges: collegesReducer,
        noAccounts: noAccountsReducer,
        programCodes: programCodesReducer,
        faculty: facultyReducer,
        registrarActivity: registrarActivityReducer
    },
    middleware: (getDefaultMiddleware) =>
        getDefaultMiddleware({
          serializableCheck: false,
    }),
});