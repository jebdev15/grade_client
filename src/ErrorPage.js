import { Container, Typography } from "@mui/material";
import React from "react";
import { Link, useRouteError } from "react-router-dom";
const ErrorPage = () => {
  const err = useRouteError();
  console.error(err);
  return (
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Typography variant="h6">
        Sorry, an unexpected error has occured.
      </Typography>
      <Typography color="error" variant="subtitle1">
        {err.statusText || err.message}
      </Typography>
      <Link to="">Back to Home</Link>
    </Container>
  );
};

export default ErrorPage;
