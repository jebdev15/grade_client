import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  List,
  ListItemAvatar,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Menu,
  MenuItem,
  MenuList,
  Paper,
  Toolbar,
  Typography,
} from "@mui/material";
import {
  BeachAccess,
  Logout,
  LooksOne,
  LooksTwo,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLoaderData } from "react-router-dom";
import { useCookies } from "react-cookie";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";
import { urlEncode, urlDecode } from 'url-encode-base64';
const Home = () => {
  const siteCookies = ["picture", "name", "faculty_id", "email", "campus"];
  const [cookies, , removeCookie] = useCookies(siteCookies);
  // const schoolYears = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
  const navigate = useNavigate();
  const {schoolyear, semester} = useLoaderData()
  // const [currentSchoolYear, setCurrentSchoolYear] = useState(
  //   schoolYears[schoolYears.length - 1]
  // );
  const [currentSchoolYear, setCurrentSchoolYear] = useState(0)
  const getCurrentSchoolYear = async (year) => {
    return setCurrentSchoolYear(year)
  }

  const [drawerMinimize, setDrawerMinimize] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const logout = () => {
    siteCookies.forEach((cookie) => removeCookie(cookie, { path: "/" }));
    googleLogout();
    navigate("/");
  };

  const encodedSchoolYear = urlEncode(schoolyear);
  const encodedSemester = urlEncode('2nd');
  useEffect(() => {
    getCurrentSchoolYear(schoolyear)
    console.log(encodedSchoolYear);
    console.log(urlDecode(encodedSchoolYear));
    console.log(encodedSemester);
    console.log(urlDecode(encodedSemester));
  }, [schoolyear])
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "stretch",
      }}
    >
      <Box sx={{ width: "100%", bgcolor: "primary.main", height: 170 }}>
        <AppBar position="static" elevation={0}>
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="inherit"
              aria-label="menu"
              sx={{ mr: 2 }}
              onClick={() => {
                setDrawerMinimize(!drawerMinimize);
              }}
            >
              <MenuIcon />
            </IconButton>
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              {`Academic Year: ${currentSchoolYear} - ${currentSchoolYear+1}`}
            </Typography>
            <Button
              color="inherit"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
            >
              <Avatar
                alt="name"
                sx={{ width: 40, height: 40 }}
                src={cookies.picture}
              />
            </Button>
            <MenuList>
              <Menu
                anchorEl={menuAnchor}
                open={Boolean(menuAnchor)}
                onClose={() => setMenuAnchor(null)}
                PaperProps={{
                  elevation: 0,
                  sx: {
                    overflow: "visible",
                    filter: "drop-shadow(0px 2px 8px rgba(0,0,0,0.32))",
                    mt: 1.5,
                    "& .MuiAvatar-root": {
                      width: 32,
                      height: 32,
                      ml: -0.5,
                      mr: 1,
                    },
                    "&:before": {
                      content: '""',
                      display: "block",
                      position: "absolute",
                      top: 0,
                      right: 14,
                      width: 10,
                      height: 10,
                      bgcolor: "background.paper",
                      transform: "translateY(-50%) rotate(45deg)",
                      zIndex: 0,
                    },
                  },
                }}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                <MenuItem>
                  <ListItemAvatar>
                    <Avatar
                      src={cookies.picture}
                      sx={{ width: 40, height: 40 }}
                    />
                  </ListItemAvatar>
                  <ListItemText primary={cookies.name} />
                </MenuItem>
                <MenuItem onClick={logout}>
                  <ListItemIcon>
                    <Logout />
                  </ListItemIcon>
                  <ListItemText sx={{ ml: 3 }} primary="Logout" />
                </MenuItem>
              </Menu>
            </MenuList>
          </Toolbar>
        </AppBar>
      </Box>

      <Box sx={{ flexGrow: 1, mt: "-100px", display: "flex" }}>
        <Box sx={{ width: drawerMinimize ? 65 : 250, height: "100%" }}>
          <Paper elevation={4} square sx={{ height: "inherit" }}>
            <List>
            {semester && (
          <>
            {(semester === '1st') && (
              <ListItemButton
                onClick={() => {
                  setDrawerMinimize(false);
                  navigate(`/home/1st-${currentSchoolYear}-${cookies.faculty_id}`);
                }}
              >
                <ListItemIcon>
                  <LooksOne />
                </ListItemIcon>
                {drawerMinimize ? null : <ListItemText primary="First Semester" />}
              </ListItemButton>
            )}
            {(semester === '2nd') && (
              <ListItemButton
                onClick={() => {
                  setDrawerMinimize(false);
                  navigate(`/home/2nd-${currentSchoolYear}-${cookies.faculty_id}`);
                }}
              >
                <ListItemIcon>
                  <LooksTwo />
                </ListItemIcon>
                {drawerMinimize ? null : <ListItemText primary="Second Semester" />}
              </ListItemButton>
            )}
            {(semester !== '1st' && semester !== '2nd') && (
              <ListItemButton
                onClick={() => {
                  setDrawerMinimize(false);
                  navigate(`/home/summer-${currentSchoolYear}-${cookies.faculty_id}`);
                }}
              >
                <ListItemIcon>
                  <BeachAccess />
                </ListItemIcon>
                {drawerMinimize ? null : <ListItemText primary="Summer" />}
              </ListItemButton>
            )}
          </>
        )}
            </List>
          </Paper>
        </Box>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet context={[currentSchoolYear]} />
        </Box>
      </Box>
    </Box>
  );
};

export const loader = async () => {
  const {data} = await axios.get(
    `${process.env.REACT_APP_API_URL}/getCurrentSchoolYear?getYear=currentYearSetBySystem`
  )
  const {schoolyear, semester} = data[0]
  return {schoolyear, semester}
}
export default Home;