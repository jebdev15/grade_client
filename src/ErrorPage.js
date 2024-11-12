import { Container, Typography } from "@mui/material";
import React from "react";
import { Link, useRouteError } from "react-router-dom";
import { sessionResponse } from "./utils/statusCode-util";
const ErrorPage = () => {
  const err = useRouteError();
  console.error(err);
  return (
    <Container maxWidth="md" sx={{ textAlign: "center" }}>
      <Typography variant="h6">
        Oops! Something Went Wrong
      </Typography>
      <Typography variant="body1" color="initial">We’re sorry, but there was an issue loading this page.</Typography>
      <Typography variant="body1" color="initial" sx={{ display: 'inline' }}>Try refreshing the page, or go back to </Typography><Link to="">Homepage</Link>
      {/* <Typography color="error" variant="subtitle1">
        {err.statusText || err.message}
      </Typography> */}
      <Typography variant="body1" color="initial">{sessionResponse(err.response.status)}</Typography>
    </Container>
  );
};

export default ErrorPage;
