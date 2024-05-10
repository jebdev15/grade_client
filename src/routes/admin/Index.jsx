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
  Backdrop,
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
import chmsuLogo from "../../assets/chmsu-small.jpg";

export default function Admin() {
  const siteCookies = ["picture", "name", "faculty_id", "email", "campus"];
  const [cookies, , removeCookie] = useCookies(siteCookies);
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  // const {schoolyear, semester, from, to} = useLoaderData() || {schoolyear: 2000, semester: '1st', from: '0000-00-00', to: '0000-00-00'};
  const { schoolyear, semester, from, to } = useLoaderData() || {
    schoolyear: 2000,
    semester: "1st",
    from: "0000-00-00",
    to: "0000-00-00",
  };

  const [drawerMinimize, setDrawerMinimize] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [activeItem, setActiveItem] = useState(
    localStorage.getItem("activeItem")
  );

  const [backdropOpen, setBackdropOpen] = useState(false);
  const isMobile = useMediaQuery((theme) => theme.breakpoints.down("sm"));

  useEffect(() => {
    localStorage.setItem("activeItem", activeItem);
  }, [activeItem]);

  useEffect(
    () => {
      if (drawerMinimize) {
        setBackdropOpen(false);
      } else {
        setBackdropOpen(true);
      }
    },
    [drawerMinimize],
    [isMobile]
  );

  const logout = () => {
    siteCookies.forEach((cookie) => removeCookie(cookie, { path: "/" }));
    googleLogout();
    navigate("/");
    localStorage.removeItem("activeItem");
  };

  // const dateNow = new Date().toJSON().split('T')[0];
  // const dueDate = to.split('T')[0];

  useEffect(() => {
    if (!cookies.hasOwnProperty("faculty_id")) {
      navigate("/");
    }
  }, [cookies, navigate]);

  useEffect(() => {
    setDrawerMinimize(isSmallScreen ? true : !true);
  }, [isSmallScreen, setDrawerMinimize]);
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
        height: "100dvh",
        alignItems: "stretch",
      }}
    >
      <Box
        sx={{
          width: "100%",
          height: 67,
          position: "fixed",
          zIndex: "1000",
        }}
      >
        <AppBar
          className="header"
          position="static"
          elevation={0}
          sx={{ position: "relative" }}
        >
          <Toolbar>
            <IconButton
              size="large"
              edge="start"
              color="primary.dark"
              aria-label="menu"
              sx={{ color: "primary.dark", mr: 1 }}
              onClick={() => {
                setDrawerMinimize(!drawerMinimize);
              }}
            >
              <MenuIcon />
            </IconButton>
            <img className="logo" src={chmsuLogo} alt="CHMSU Logo" />
            <Typography
              className="systemName"
              variant="h6"
              component="div"
              sx={{ color: "primary.dark", flexGrow: 1, lineHeight: "1" }}
            >
              <span></span>
              <span></span>
            </Typography>
            <Button
              color="primary"
              onClick={(e) => setMenuAnchor(e.currentTarget)}
              sx={{
                minWidth: "unset",
                borderRadius: "50%",
                padding: "8px",
              }}
            >
              <Avatar
                sx={{
                  height: "35px",
                  width: "35px",
                  outline: "4px solid var(--border-default)",
                }}
                alt="name"
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
                      right: 20,
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

      <Box
        sx={{
          display: "flex",
          flexGrow: 1,
          position: "relative",
        }}
      >
        <Box
          sx={{
            width: drawerMinimize ? 77 : 250,
            height: "100dvh",
            position: "fixed",
            overflow: "hidden",
            zIndex: "500",
            paddingTop: "67px",
            transition: (theme) =>
              theme.transitions.create("width", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.leavingScreen,
              }),
            "@media (max-width: 599px)": {
              width: drawerMinimize ? 0 : 250,
            },
          }}
        >
          <Paper
            className="navigation"
            elevation={4}
            square
            sx={{ height: "inherit", overflow: "auto" }}
          >
            <List>
              <ListItemButton
                className={activeItem === "home" ? "navbtn active" : "navbtn"}
                onClick={() => {
                  setActiveItem("home");
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
                className={activeItem === "grades" ? "navbtn active" : "navbtn"}
                onClick={() => {
                  setActiveItem("grades");
                  navigate(`/admin/grades`);
                }}
              >
                <Tooltip title="Grade Submission">
                  <ListItemIcon>
                    <ScheduleIcon />
                  </ListItemIcon>
                </Tooltip>
                {drawerMinimize ? null : (
                  <ListItemText primary="Grade Submission" />
                )}
              </ListItemButton>

              <ListItemButton
                className={activeItem === "users" ? "navbtn active" : "navbtn"}
                onClick={() => {
                  setActiveItem("users");
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
        <Box
          className="main"
          sx={{
            transition: (theme) =>
              theme.transitions.create("margin", {
                easing: theme.transitions.easing.easeInOut,
                duration: theme.transitions.duration.leavingScreen,
              }),
            marginLeft: drawerMinimize ? "77px" : "250px",
            flexGrow: 1,
            p: 3,
          }}
        >
          {isMobile && (
            <Backdrop
              open={backdropOpen}
              sx={{
                zIndex: "400",
                backgroundColor: "rgba(0, 0, 0, 0.25);",
              }}
            ></Backdrop>
          )}
          <Outlet context={[2022, "1st", from, to]} />
        </Box>
      </Box>
    </Box>
  );
}

export const loader = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/getCurrentSchoolYear?getYear=currentYearSetBySystem`
  );
  const { schoolyear, semester, from, to } = data[0];
  return { schoolyear, semester, from, to };
};
