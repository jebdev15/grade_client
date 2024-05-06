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
  Tooltip,
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
import { urlEncode } from 'url-encode-base64';
const Home = () => {
  const siteCookies = ["picture", "name", "faculty_id", "email", "campus", "role"];
  const [cookies, , removeCookie] = useCookies(siteCookies);
  const navigate = useNavigate();
  const {dbSchoolYear, dbSemester} = useLoaderData();
  const [schoolyear, setSchoolYear] = useState(dbSchoolYear)
  const [semester, setSemester] = useState(dbSemester)


  const [drawerMinimize, setDrawerMinimize] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const logout = () => {
    siteCookies.forEach((cookie) => removeCookie(cookie, { path: "/" }));
    googleLogout();
    navigate("/");
  };

  const params = (semester, schoolYear, facultyID) => {
    const encodedSchoolYear = urlEncode(2022);
    const encodedSemester = urlEncode(semester);
    const encodedFacultyID = urlEncode(facultyID);

    return `${encodedSemester}-${encodedSchoolYear}-${encodedFacultyID}`;
  }

  // const dateNow = new Date().toJSON().split('T')[0];
  // const dueDate = to.split('T')[0];

  useEffect(() => {
    if(!cookies.hasOwnProperty('faculty_id') && cookies.role !== 'Faculty'){
      navigate('/')
      console.log('User is\'nt allowed access');
    }
  }, [cookies, navigate])

  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100vh",
        alignItems: "stretch",
      }}
    >
      <Box sx={{ width: "100%", bgcolor: "primary.main", /* height: 170 */ height: '4rem' }}>
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
              CHMSU Grading System
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

      <Box sx={{ flexGrow: 1, /*mt: "-100px"*/mt: 'auto', display: "flex" }}>
        <Box sx={{ width: drawerMinimize ? 65 : 250, height: "100%" }}>
          <Paper elevation={4} square sx={{ height: "inherit" }}>
            <List>
                <ListItemButton
                  onClick={() => {
                    setDrawerMinimize(false);
                    navigate(`/home/${params('1st',schoolyear,cookies.faculty_id)}`);
                  }}
                >
                <Tooltip title="First Semester">
                  <ListItemIcon>
                    <LooksOne />
                  </ListItemIcon>
                </Tooltip>
                  {drawerMinimize ? null : <ListItemText primary="First Semester" />}
                </ListItemButton>

                <ListItemButton
                  onClick={() => {
                    setDrawerMinimize(false);
                    navigate(`/home/${params('2nd',schoolyear,cookies.faculty_id)}`);
                  }}
                >
                  <Tooltip title="Second Semester">
                    <ListItemIcon>
                      <LooksTwo />
                    </ListItemIcon>
                  </Tooltip>
                  {drawerMinimize ? null : <ListItemText primary="Second Semester" />}
                </ListItemButton>

                <ListItemButton
                  onClick={() => {
                    setDrawerMinimize(false);
                    navigate(`/home/${params('summer',schoolyear,cookies.faculty_id)}`);
                  }}
                >
                  <Tooltip title="Summer">
                    <ListItemIcon>
                      <BeachAccess />
                    </ListItemIcon>
                  </Tooltip>
                  {drawerMinimize ? null : <ListItemText primary="Summer" />}
                </ListItemButton>
            </List>
          </Paper>
        </Box>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet context={[schoolyear]} />
        </Box>
      </Box>
    </Box>
  );
};

export const loader = async () => {
  const {data} = await axios.get(
    `${process.env.REACT_APP_API_URL}/getCurrentSchoolYear`
  )
  const {schoolyear:dbSchoolYear, semester:dbSemester, from, to} = data[0]
  return {dbSchoolYear, dbSemester, from, to}
}
export default Home;