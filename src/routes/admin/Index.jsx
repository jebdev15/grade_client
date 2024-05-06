import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  Collapse,
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
  useMediaQuery,
} from "@mui/material";
import {
  ExpandLess,
  ExpandMore,
  Home as HomeIcon,
  Logout,
  Menu as MenuIcon,
  People as PeopleIcon,
  Tune as TuneIcon,
  Schedule as ScheduleIcon,
  WorkHistory as WorkHistoryIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate, useLoaderData } from "react-router-dom";
import { useCookies } from "react-cookie";
import { googleLogout } from "@react-oauth/google";
import axios from "axios";

export default function Admin() {
  const siteCookies = ["picture", "name", "faculty_id", "email", "campus"];
  const [cookies, , removeCookie] = useCookies(siteCookies);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));

  // const {schoolyear, semester, from, to} = useLoaderData() || {schoolyear: 2000, semester: '1st', from: '0000-00-00', to: '0000-00-00'};
  const {schoolyear, semester, from, to} = useLoaderData() || {schoolyear: 2000, semester: '1st', from: '0000-00-00', to: '0000-00-00'};

  const [drawerMinimize, setDrawerMinimize] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const logout = () => {
    siteCookies.forEach((cookie) => removeCookie(cookie, { path: "/" }));
    googleLogout();
    navigate("/");
  };
  
  // const dateNow = new Date().toJSON().split('T')[0];
  // const dueDate = to.split('T')[0];
  
  useEffect(() => {
    if(!cookies.hasOwnProperty('faculty_id')){
      navigate('/')
    }
  }, [cookies, navigate])

  useEffect(() => {
    setDrawerMinimize(isSmallScreen ? true : !true)
  }, [isSmallScreen, setDrawerMinimize])
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
                    navigate(`/admin`);
                  }}
                >
                <Tooltip title="Home">
                  <ListItemIcon>
                    <HomeIcon />
                  </ListItemIcon>
                </Tooltip>
                  {drawerMinimize ? null : <ListItemText primary="Home" />}
                </ListItemButton>
                    <ListItemButton 
                      onClick={() => {
                        navigate(`/admin/grades`);
                      }}
                    >
                      <Tooltip title="Grade Submission">
                        <ListItemIcon>
                          <ScheduleIcon />
                        </ListItemIcon>
                      </Tooltip>
                      {drawerMinimize ? null : <ListItemText primary="Grade Submission" />}
                    </ListItemButton>
                    
                    <ListItemButton
                      onClick={() => {
                        navigate(`/admin/users`);
                      }}
                    >
                      <Tooltip title="Users">
                        <ListItemIcon>
                          <PeopleIcon />
                        </ListItemIcon>
                      </Tooltip>
                      {drawerMinimize ? null : <ListItemText primary="Users" />}
                    </ListItemButton>

            </List>
          </Paper>
        </Box>
        <Box sx={{ flexGrow: 1, p: 3 }}>
          <Outlet context={[2022, '1st', from, to]}/>
        </Box>
      </Box>
    </Box>
  );
};

export const loader = async () => {
  const {data} = await axios.get(
    `${process.env.REACT_APP_API_URL}/getCurrentSchoolYear?getYear=currentYearSetBySystem`
  )
  const {schoolyear, semester, from, to} = data[0]
  return {schoolyear, semester, from, to}
}