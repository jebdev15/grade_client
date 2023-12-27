import React from "react";
import ReactDOM from "react-dom/client";

import { createBrowserRouter, RouterProvider } from "react-router-dom";

import { CssBaseline, ThemeProvider } from "@mui/material";
import { theme } from "./theme";

import { GoogleOAuthProvider } from "@react-oauth/google";

import Index from "./routes";
import Admin from "./routes/admin";
import Home from "./routes/home";
import Start from "./routes/home/start";
import Semester, { loader as semesterLoader } from "./routes/home/semester";

import ErrorPage from "./ErrorPage";
import GradeTable, {
  loader as gradeTableLoader,
} from "./routes/home/gradeTable";
import Upload, { loader as uploadLoader } from "./routes/home/upload";

const root = ReactDOM.createRoot(document.getElementById("root"));

const router = createBrowserRouter([
  {
    path: "/",
    element: <Index />,
    errorElement: <ErrorPage />,
  },
  {
    path: "home",
    element: <Home />,
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
            path: "/home/:code/upload/:class_code",
            element: <Upload />,
            loader: uploadLoader,
          },
        ],
      },
    ],
  },
  {
    path: "admin",
    element: <p>Admin</p>,
  },
]);
root.render(
  <React.StrictMode>
    <GoogleOAuthProvider clientId="716180471328-k91kdip1kj2024jkj5tporlkehffbnb9.apps.googleusercontent.com">
      <ThemeProvider theme={theme}>
        <CssBaseline />
        <RouterProvider router={router} />
      </ThemeProvider>
    </GoogleOAuthProvider>
  </React.StrictMode>
);
