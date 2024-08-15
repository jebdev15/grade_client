import React, { useState } from "react";
import { Box, Checkbox, Container, FormControlLabel, Paper, Typography } from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import moment from "moment";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../assets/custom.css";
import "../style.css";
import { authenticationProcess } from "../services/index.services";
import chmsuLogo from "../assets/chmsu-small.jpg";
const Index = () => {
  const [loading, setLoading] = useState(false);
  const [saveCredentials, setSaveCredentials] = useState(false);

  const [cookies, setCookie] = useCookies(["name", "faculty_id", "campus", "picture", "email", "college_code", "accessLevel"]);

  const navigate = useNavigate();

  const setIndividualCookie = (name, value) => {
    setCookie(name, value, {
      path: "/",
      expires: saveCredentials ? moment().add(1, "y").toDate() : moment().add(1, "day").toDate(),
    });
  };

  const login = async (res) => {
    setLoading(true);

    const { credential } = res;
    const jsonObj = jwt_decode(credential);
    const { name, picture, email } = jsonObj;

    try {
      const { data, status } = await authenticationProcess(email);
      if (status === 200 && data.length > 0) {
        setIndividualCookie("faculty_id", data[0].faculty_id);
        setIndividualCookie("accessLevel", data[0].accessLevel);
        setIndividualCookie("name", name);
        setIndividualCookie("picture", picture);
        setIndividualCookie("email", email);
        setIndividualCookie("college_code", data[0].college_code);
        setIndividualCookie("program_code", data[0].program_code);
        navigate(data[1].url);
      }
    } catch (error) {
      alert("Something went wrong. Please contact Administrator");
      setLoading(false);
    }
  };

  useEffect(() => {
    if (cookies.faculty_id && cookies.accessLevel) {
      const checkUser = async () => {
        const { data } = await authenticationProcess(cookies.email);
        navigate(data[1].url);
      };
      checkUser();
    }
  }, [cookies, navigate]);

  return (
    <Box sx={{ bgcolor: "background.light", height: "100dvh", width: "100vw" }}>
      <Container maxWidth="lg" fixed sx={{ height: "inherit" }}>
        <Box
          sx={{
            height: "inherit",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper className="signin_page" sx={{ display: "flex", flexDirection: "row", justifyContent: "center", alignItems: "center", py: 5, px: 6, gap: { sm: 3, md: 6 } }} elevation={8}>
            <Box className="signinMsg">
              <img className="chmsuLogo" src={chmsuLogo} alt="logo" />
              <Typography variant="h5" fontWeight={700} color="primary">
                Carlos Hilado<span>Memorial State University</span>
              </Typography>
              <Typography variant="body1" color="primary">
                Grading Portal
              </Typography>
            </Box>
            <Box
              sx={{
                width: "inherit",
                display: "flex",
                flexDirection: "column",
              }}
            >
              <Typography variant="h6" fontWeight={700} color="primary" textAlign="center">
                {process.env.REACT_APP_TITLE}
              </Typography>
              <Typography variant="h4" fontWeight={400} textAlign={{ xs: "center", md: "left" }} sx={{ mb: 1 }}>
                Sign In
              </Typography>
              <Typography variant="body1" fontWeight={400} textAlign={{ xs: "center", md: "left" }} sx={{ mb: 2 }}>
                Use your CHMSU Google Account
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
                className="loginForm"
              >
                {loading ? <Typography>Signing you in...</Typography> : <GoogleLogin className="googleLoginBtn" onSuccess={login} />}
                <FormControlLabel control={<Checkbox defaultChecked={false} name="save" onChange={(e) => setSaveCredentials(!saveCredentials)} />} label="Save Credentials" />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Index;
