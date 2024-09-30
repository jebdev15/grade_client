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
import PrintGradeSheet, { loader as printLoader } from "./routes/home/PrintNew";
import PrintGraduateStudiesGradeSheet, { loader as printGSLoader } from "./routes/home/PrintGS";

// Admin Routes
import Admin from './routes/admin/Index';
import Faculty from "./routes/admin/Faculty";
import DownloadGradeSheetPdf from "./components/faculty/downloadble/DownloadGradeSheetPdf";
import Users from "./routes/admin/Users";
import GenerateReport from "./routes/admin/GenerateReport";
import Settings from "./routes/admin/Settings";
import PrintUnderGraduateGS, { loader as printUnderGraduateGSLoader } from "./components/faculty/printable/PrintUnderGraduateGS";
import PrintGraduateStudiesGS, { loader as printGraduateStudiesGSLoader } from "./components/faculty/printable/PrintGraduateStudiesGS";
import Students from "./routes/admin/Students";
import { Provider } from "react-redux";
import { store } from "./app/store";
import { REACT_APP_GOOGLE_CLIENT_ID } from "./utils/envVariables";
import { QueryClient, QueryClientProvider } from "react-query";
import { RegistrarActivityProvider } from "./context/RegistrarActivityContext";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    errorElement: <ErrorPage />,
    element: <Index />,
  },
  {
    path: "home",
    element: 
      <RegistrarActivityProvider>
          <Home />
      </RegistrarActivityProvider>,
    children: [
      { index: true, element: <Start /> },
      {
        path: "/home/:code",
        element: <Semester />,
        loader: semesterLoader,
        children: [
          {
            path: "/home/:code/:class_code",
            element: <GradeTable />,
            loader: gradeTableLoader,
          },
          {
            path: "/home/:code/:class_code/graduateStudies",
            element: <GraduateStudiesTable />,
            loader: graduateStudiesTableLoader,
          },
          {
            path: "/home/:code/upload/:class_code",
            element: <Upload />,
            loader: uploadLoader,
          },
        ],
      },
    ],
  },
  {
    path: "/print/:code/:class_code",
    element: <PrintGradeSheet />,
    errorElement: <h1>Error PrintGradeSheet</h1>,
    loader: printLoader,
  },
  {
    path: "/print/:code/:class_code/graduateStudies",
    element: <PrintGraduateStudiesGradeSheet />,
    errorElement: <h1>Error PrintGraduateStudiesGradeSheet</h1>,
    loader: printGSLoader,
  },
  {
    path: "/admin/print/:code/:class_code",
    element: <PrintUnderGraduateGS />,
    errorElement: <h1>Error PrintUnderGraduateGS</h1>,
    loader: printUnderGraduateGSLoader,
  },
  {
    path: "/admin/print/:code/:class_code/gs",
    element: <PrintGraduateStudiesGS />,
    errorElement: <h1>Error PrintGraduateStudiesGS</h1>,
    loader: printGraduateStudiesGSLoader,
  },
  {
    path: "admin",
    element: <Admin />,
    errorElement: <h1>Error AdminPage</h1>,
    children: [
      { index: true, element: <AdminStart /> },
      {
        path: "students",
        element: <Students />,
        errorElement: <h1>Error Students</h1>,
      },
      {
        path: "faculty",
        element: <Faculty />,
        errorElement: <h1>Error Faculty</h1>,
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
      },
      {
        path: "download",
        children: [
          {
            path: "gradesheet",
            element: <DownloadGradeSheetPdf />,
          }
        ]
      }
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
