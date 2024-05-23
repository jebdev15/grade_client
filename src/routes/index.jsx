import React, { useState } from "react";
import {
  Box,
  Checkbox,
  Container,
  FormControl,
  FormControlLabel,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { GoogleLogin } from "@react-oauth/google";
import jwt_decode from "jwt-decode";
import { useCookies } from "react-cookie";
import moment from "moment";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { useEffect } from "react";
import "../style.css";
const Index = () => {
  const [loading, setLoading] = useState(false);
  const [saveCredentials, setSaveCredentials] = useState(false);

  const [cookies, setCookie] = useCookies([
    "name",
    "faculty_id",
    "campus",
    "picture",
    "email",
    "accessLevel"
  ]);

  const navigate = useNavigate();

  const setIndividualCookie = (name, value) => {
    setCookie(name, value, {
      path: "/",
      expires: saveCredentials
        ? moment().add(1, "y").toDate()
        : moment().add(1, "day").toDate(),
    });
  };

  const login = async (res) => {
    setLoading(true);

    const { credential } = res;
    const jsonObj = jwt_decode(credential);
    const { name, picture, email } = jsonObj;
    try {
      const { data } = await axios.get(
        `${process.env.REACT_APP_API_URL}/login?email=${email}`
      );
      if (data.length) {
        setIndividualCookie("faculty_id", data[0].faculty_id);
        setIndividualCookie("accessLevel", data[0].accessLevel);
        setIndividualCookie("name", name);
        setIndividualCookie("picture", picture);
        setIndividualCookie("email", email);
        // setIndividualCookie("campus", campus);
        if (data[0].accessLevel === "Administrator" || data[0].accessLevel === "Registrar") navigate("/admin");
        if (data[0].role === "Administrator") navigate("/admin");
        else navigate("/home");
      }
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    if (cookies.faculty_id) navigate("/home");
  });

  return (
    <Box sx={{ bgcolor: "background.light", height: "100dvh", width: "100vw" }}>
      <Container maxWidth="sm" fixed sx={{ height: "inherit" }}>
        <Box
          sx={{
            height: "inherit",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <Paper
            className="signin_page"
            sx={{ width: "100%", maxWidth: 400 }}
            elevation={8}
          >
            <Box
              sx={{
                width: "inherit",
                display: "flex",
                py: 3,
                px: 5,
                flexDirection: "column",
              }}
            >
              <Typography
                variant="h6"
                fontWeight={700}
                color="primary"
                textAlign="center"
              >
                CHMSU GRADING SYSTEM
              </Typography>
              <Typography
                variant="h5"
                fontWeight={400}
                textAlign="center"
                sx={{ mt: 1, mb: 2 }}
              >
                Sign In
              </Typography>
              <Box
                sx={{
                  width: "100%",
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                }}
              >
                {loading ? (
                  <Typography>Signing you in...</Typography>
                ) : (
                  <GoogleLogin
                    onSuccess={login}
                    onError={() => console.log("Error logging in")}
                  />
                )}
              <FormControlLabel
                control={
                  <Checkbox
                    defaultChecked={false}
                    name="save"
                    onChange={(e) => setSaveCredentials(!saveCredentials)}
                  />
                }
                label="Save Credentials"
              />
              </Box>
            </Box>
          </Paper>
        </Box>
      </Container>
    </Box>
  );
};

export default Index;
