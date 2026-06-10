import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

import { GoogleOAuthProvider } from "@react-oauth/google";

import ErrorPage from "./ErrorPage";

// Faculty Routes
import Index from "./routes";
import Home from "./routes/home";

import Start from "./routes/home/start";
import AdminStart from "./routes/admin/start";
import Semester, { loader as semesterLoader } from "./routes/home/semester";
import GradeTable, {
  loader as gradeTableLoader,
} from "./routes/home/gradeTable";
import GraduateStudiesTable, {
  loader as graduateStudiesTableLoader,
} from "./routes/home/graduateStudiesTable";
import Upload, { loader as uploadLoader } from "./routes/home/upload";
import UploadGS, { loader as uploadGSLoader } from "./routes/home/uploadGS";
import PrintGradeSheet, { loader as printLoader } from "./routes/home/PrintNew";
import PrintGraduateStudiesGradeSheet, { loader as printGSLoader } from "./routes/home/PrintGS";

// Admin Routes
import Admin from "./routes/admin/Index";
import Faculty, { loader as facultyLoader } from "./routes/admin/Faculty";
import DownloadGradeSheetPdf from "./components/faculty/downloadble/DownloadGradeSheetPdf";
import Users from "./routes/admin/Users";
import GenerateReport from "./routes/admin/GenerateReport";
import Settings from "./routes/admin/Settings";
import PrintUnderGraduateGS, { loader as printUnderGraduateGSLoader } from "./components/faculty/printable/PrintUnderGraduateGS";
import PrintGraduateStudiesGS, { loader as printGraduateStudiesGSLoader } from "./components/faculty/printable/PrintGraduateStudiesGS";
import Students from "./routes/admin/Students";
import Deadline from "./components/settings/Deadline";
import ExtendDeadline from "./components/settings/ExtendDeadline";
import ClassLoad from "./components/settings/ClassLoad";
import FailureListSettings from "./components/settings/FailureListSettings";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { REACT_APP_GOOGLE_CLIENT_ID } from "./utils/envVariables";
import { QueryClient, QueryClientProvider } from "react-query";
import { RegistrarActivityProvider } from "./context/RegistrarActivityContext";
import FacultyErrorPage from "./components/errors/FacultyErrorPage";
import CreditsComponent from "@components/settings/CreditsComponent";
import ProtectedRoute from "./components/routes/ProtectedRoute";
import { adminAccessLevels, facultyAccessLevels } from "./utils/authUtil";
import { protectLoader } from "./utils/routeAuth";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Index />,
  },
  {
    path: "home",
    element: (
      <ProtectedRoute allowedAccessLevels={facultyAccessLevels}>
        <RegistrarActivityProvider>
          <Home />
        </RegistrarActivityProvider>
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <Start /> },
      {
        path: "/home/:code",
        element: <Semester />,
        loader: protectLoader(facultyAccessLevels, semesterLoader),
        children: [
          {
            path: "/home/:code/:class_code",
            element: <GradeTable />,
            loader: protectLoader(facultyAccessLevels, gradeTableLoader),
          },
          {
            path: "/home/:code/:class_code/graduateStudies",
            element: <GraduateStudiesTable />,
            loader: protectLoader(facultyAccessLevels, graduateStudiesTableLoader),
          },
          {
            path: "/home/:code/upload/:class_code",
            element: <Upload />,
            loader: protectLoader(facultyAccessLevels, uploadLoader),
          },
          {
            path: "/home/:code/upload/:class_code/gs",
            element: <UploadGS />,
            loader: protectLoader(facultyAccessLevels, uploadGSLoader),
          },
        ],
      },
    ],
  },
  {
    path: "/print/:code/:class_code",
    element: (
      <ProtectedRoute allowedAccessLevels={facultyAccessLevels}>
        <PrintGradeSheet />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    loader: protectLoader(facultyAccessLevels, printLoader),
  },
  {
    path: "/print/:code/:class_code/graduateStudies",
    element: (
      <ProtectedRoute allowedAccessLevels={facultyAccessLevels}>
        <PrintGraduateStudiesGradeSheet />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    loader: protectLoader(facultyAccessLevels, printGSLoader),
  },
  {
    path: "/admin/print/:code/:class_code",
    element: (
      <ProtectedRoute allowedAccessLevels={adminAccessLevels}>
        <PrintUnderGraduateGS />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    loader: protectLoader(adminAccessLevels, printUnderGraduateGSLoader),
  },
  {
    path: "/admin/print/:code/:class_code/gs",
    element: (
      <ProtectedRoute allowedAccessLevels={adminAccessLevels}>
        <PrintGraduateStudiesGS />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    loader: protectLoader(adminAccessLevels, printGraduateStudiesGSLoader),
  },
  {
    path: "admin",
    element: (
      <ProtectedRoute allowedAccessLevels={adminAccessLevels}>
        <Admin />
      </ProtectedRoute>
    ),
    errorElement: <ErrorPage />,
    children: [
      { index: true, element: <AdminStart /> },
      {
        path: "students",
        element: <Students />,
      },
      {
        path: "faculty",
        element: <Faculty />,
        loader: protectLoader(adminAccessLevels, facultyLoader),
        errorElement: <FacultyErrorPage />,
      },
      {
        path: "users",
        element: <Users />,
      },
      {
        path: "reports",
        element: <GenerateReport />,
      },
      {
        path: "settings",
        element: <Settings />,
        children: [
          {
            path: "deadline",
            element: <Deadline />,
          },
          {
            path: "extend-deadline",
            element: <ExtendDeadline />,
          },
          {
            path: "class-load",
            element: <ClassLoad />,
          },
          {
            path: "credits",
            element: <CreditsComponent />,
          },
          {
            path: "failure-list",
            element: <FailureListSettings />,
          },
        ],
      },
      {
        path: "download",
        children: [
          {
            path: "gradesheet",
            element: <DownloadGradeSheetPdf />,
          },
        ],
      },
    ],
  },
]);
const queryClient = new QueryClient();
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId={REACT_APP_GOOGLE_CLIENT_ID}>
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <Provider store={store}>
          <QueryClientProvider client={queryClient}>
            <RouterProvider router={router} />
          </QueryClientProvider>
        </Provider>
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);