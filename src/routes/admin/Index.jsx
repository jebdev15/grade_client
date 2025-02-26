import React, { useEffect, useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  IconButton,
  List,
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
  Collapse,
} from "@mui/material";
import {
  Logout,
  Menu as MenuIcon,
  AccountCircle as AccountCircleIcon,
  Home as HomeIcon,
  People as PeopleIcon,
  Groups as GroupsIcon,
  Groups2 as Groups2Icon,
  WorkHistory as WorkHistoryIcon,
  Settings as SettingsIcon,
  AccessTime as AccessTimeIcon,
  MoreTime as MoreTimeIcon,
  Subject as SubjectIcon,
  ExpandLess,
  ExpandMore
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { googleLogout } from "@react-oauth/google";
import chmsuLogo from "../../assets/chmsu-small.jpg";
import { getCampus } from "../../utils/header.util";
import { adminIndexUtil, checkAccessLevel, checkAccessLevelForMenu } from "../../utils/admin-index.util";
const SideNavListItems = [
  {
    text: "Home",
    activeItem: "home",
    link: '/admin',
    icon: <HomeIcon />,
    path: "/admin/home",
  },
  {
    text: "Students",
    activeItem: "students",
    link: '/admin/students',
    icon: <PeopleIcon />,
    path: "/admin/students",
  },
  {
    text: "Faculty",
    activeItem: "faculty",
    link: "/admin/faculty",
    icon: <GroupsIcon />,
    path: "/admin/faculty",
  },
  {
    text: "Users",
    activeItem: "users",
    link: "/admin/users",
    icon: <Groups2Icon />,
    path: "/admin/users",
  },
  {
    text: "Reports",
    activeItem: "reports",
    link: "/admin/reports",
    icon: <WorkHistoryIcon />,
    path: "/admin/reports",
  },
  {
    text: "Settings",
    activeItem: "settings",
    link: "/admin/settings",
    icon: <SettingsIcon />,
    path: "/admin/settings",
  }
]

const SettingsListItems = [
  {
    text: "Deadline",
    activeItem: "deadline",
    icon: <AccessTimeIcon />,
    link: "/admin/settings/deadline",
  },
  {
    text: "Extend Deadline",
    activeItem: "extend-deadline",
    icon: <MoreTimeIcon />,
    link: "/admin/settings/extend-deadline",
  },
  {
    text: "Graduate Studies",
    activeItem: "graduate-studies",
    icon: <SubjectIcon />,
    link: "/admin/settings/graduate-studies",
  }
]

const MenuPaperProps = {
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
}

export default function Admin() {
  const [cookies, , removeCookie] = useCookies(adminIndexUtil.siteCookies);
  const campusAccessing = getCampus();
  const menuListItems = [
    {
      text: cookies.name,
      icon: <AccountCircleIcon />,
    },
    {
      text: campusAccessing,
      icon: <HomeIcon />,
    },
    {
      text: cookies.accessLevel,
      icon: <AccountCircleIcon />,
    },
  ]
  const navigate = useNavigate();
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("sm"));
  const [drawerMinimize, setDrawerMinimize] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

  const [activeItem, setActiveItem] = useState(localStorage.getItem("activeItem"));

  const [backdropOpen, setBackdropOpen] = useState(false);
  const [open, setOpen] = React.useState(false)
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

  useEffect(() => {
    if (!checkAccessLevel(cookies)) {
      navigate("/");
    }
  }, [cookies, navigate]);

  const logout = () => {
    adminIndexUtil.siteCookies.forEach((cookie) => removeCookie(cookie, { path: "/" }));
    googleLogout();
    navigate("/");
    localStorage.removeItem("activeItem");
  };
  useEffect(() => {
    setDrawerMinimize(isSmallScreen ? true : !true);
  }, [isSmallScreen, setDrawerMinimize, navigate]);
  
  const isAdminAccessing = checkAccessLevelForMenu(cookies.accessLevel);
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
                PaperProps={MenuPaperProps}
                transformOrigin={{ horizontal: "right", vertical: "top" }}
                anchorOrigin={{ horizontal: "right", vertical: "bottom" }}
              >
                {menuListItems.map((item, index) => (
                  <MenuItem key={++index}>
                    <ListItemIcon>
                      {item.icon}
                    </ListItemIcon>
                    <ListItemText sx={{ ml: 3 }} primary={item.text} />
                  </MenuItem>
                ))}
                <MenuItem onClick={logout}>
                    <ListItemIcon>
                      <Logout />
                    </ListItemIcon>
                    <ListItemText sx={{ ml: 3 }} primary={"Sign Out"} />
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
              {isAdminAccessing ? (
                SideNavListItems.map((item, index) => {
                  const isSettings = item.text === "Settings";
                  return (
                    <>
                      <ListItemButton
                        key={++index}
                        className={activeItem === item.activeItem ? "navbtn active" : "navbtn"}
                        onClick={() => {
                          setActiveItem(item.activeItem);
                          navigate(item.link);
                          if(isSettings) setOpen(!open);
                        }}
                      >
                        <Tooltip title={item.text}>
                          <ListItemIcon>
                            {item.icon}
                          </ListItemIcon>
                        </Tooltip>
                        {drawerMinimize ? null : <ListItemText primary={item.text} />}
                        { isSettings && (open ? <ExpandLess /> : <ExpandMore />)}
                      </ListItemButton>
                      {isSettings && 
                        SettingsListItems.map((item, index) => {
                          return (
                            <Collapse 
                              key={++index} 
                              in={open} 
                              timeout="auto" 
                              unmountOnExit
                              className={activeItem === item.activeItem ? "navbtn active" : "navbtn"}
                              onClick={() => setActiveItem(item.activeItem)}
                            >
                              <List component="div" disablePadding>
                                <ListItemButton sx={{ pl: 4 }} onClick={() => navigate(item.link)}>
                                  <ListItemIcon>
                                    {item.icon}
                                  </ListItemIcon>
                                  <ListItemText primary={item.text} />
                                </ListItemButton>
                              </List>
                            </Collapse>
                          )
                        })}
                    </>
                  )
                })
              ) : SideNavListItems.filter((item) => ["Home", "Students", "Faculty"].includes(item.text)).map((item, index) => {
                const isSettings = item.text === "Settings";
                return (
                  <>
                    <ListItemButton
                      key={++index}
                      className={activeItem === item.activeItem ? "navbtn active" : "navbtn"}
                      onClick={() => {
                        setActiveItem(item.activeItem);
                        navigate(item.link);
                        if(isSettings) setOpen(!open);
                      }}
                    >
                      <Tooltip title={item.text}>
                        <ListItemIcon>
                          {item.icon}
                        </ListItemIcon>
                      </Tooltip>
                      {drawerMinimize ? null : <ListItemText primary={item.text} />}
                    </ListItemButton>
                  </>
                )
              })}
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
          <Outlet />
        </Box>
      </Box>
    </Box>
  );
}
