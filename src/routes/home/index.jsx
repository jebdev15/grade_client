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
  BeachAccess,
  Logout,
  LooksOne,
  LooksTwo,
  Menu as MenuIcon,
} from "@mui/icons-material";
import { Outlet, useNavigate } from "react-router-dom";
import { useCookies } from "react-cookie";
import { googleLogout } from "@react-oauth/google";
import { urlEncode } from "url-encode-base64";
import chmsuLogo from "../../assets/chmsu-small.jpg";
// import { checkRegistrarActivityDueDate } from "../../services/index.services";
import { getCampus } from "../../utils/header.util";
import { homeIndexUtil } from "../../utils/home-index.util";
import { RegistrarActivityContext } from "../../context/RegistrarActivityContext";

const Home = () => {
  const [cookies, , removeCookie] = useCookies(homeIndexUtil.siteCookies);
  const navigate = useNavigate();
  const [schoolyear, setSchoolYear] = useState({
    summer: 1970,
    firstSemester: 1970,
    secondSemester: 1970,
  });

  const { data, error, status:registrarActivityStatus } = React.useContext(RegistrarActivityContext);
  useEffect(() => {
    if(registrarActivityStatus === "succeeded" && !error) {
      const { data:registrarActivityData } = data;
      const {
        schoolyear:summerSchoolYear,
        semester:summerSemester,
      } = registrarActivityData[0];
      const {
        schoolyear:firstSemesterSchoolYear,
        semester:firstSemester,
      } = registrarActivityData[1];
      const {
        schoolyear:secondSemesterSchoolYear,
        semester:secondSemester,
      } = registrarActivityData[2];
      setSchoolYear((prevState) => ({
          ...prevState, 
          summer: summerSemester === 'summer' ? summerSchoolYear : prevState.summer,
          firstSemester: firstSemester === '1st' ? firstSemesterSchoolYear : prevState.firstSemester,
          secondSemester: secondSemester === '2nd' ? secondSemesterSchoolYear : prevState.secondSemester,
        })
      );
      console.log({
        summer: summerSchoolYear,
        firstSemester: registrarActivityData[1],
        secondSemester: registrarActivityData[2],
      });
    } 
  }, [data, registrarActivityStatus, error]);

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
    homeIndexUtil.siteCookies.forEach((cookie) => removeCookie(cookie, { path: "/" }));
    googleLogout();
    navigate("/");
    localStorage.removeItem("activeItem");
  };

  const params = (semester, schoolYear, facultyID) => {
    const encodedSchoolYear = urlEncode(schoolYear);
    const encodedSemester = urlEncode(semester);
    const encodedFacultyID = urlEncode(facultyID);

    return `${encodedSemester}-${encodedSchoolYear}-${encodedFacultyID}`;
  };

  useEffect(() => {
    if (!homeIndexUtil.checkHomeAccessLevel(cookies)) {
      navigate("/");
    }
  }, [cookies, navigate]);
  const campusAccessing = getCampus();
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
            <Typography variant="body1" color="initial" sx={{ mr: 2 }}>{`${campusAccessing}(${cookies.accessLevel})`}</Typography>
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
                  className={activeItem === "summer" ? "navbtn active" : "navbtn"}
                  onClick={() => {
                    // setDrawerMinimize(false);
                    navigate(
                      `/home/${params("summer", parseInt(schoolyear.summer), cookies.faculty_id)}`
                    );
                    setActiveItem("summer");
                  }}
                >
                  <Tooltip title="Summer">
                    <ListItemIcon>
                      <BeachAccess />
                    </ListItemIcon>
                  </Tooltip>
                  {drawerMinimize ? null : <ListItemText primary="Summer" />}
                </ListItemButton>
                <ListItemButton
                  className={activeItem === "1st" ? "navbtn active" : "navbtn"}
                  onClick={() => {
                    navigate(
                      `/home/${params("1st", parseInt(schoolyear.firstSemester), cookies.faculty_id)}`
                    );
                    setActiveItem("1st");
                  }}
                >
                  <Tooltip title="First Semester">
                    <ListItemIcon>
                      <LooksOne />
                    </ListItemIcon>
                  </Tooltip>
                  {drawerMinimize ? null : (
                    <ListItemText primary="First Semester" />
                  )}
                </ListItemButton>

                <ListItemButton
                  className={activeItem === "2nd" ? "navbtn active" : "navbtn"}
                  onClick={() => {
                    navigate(
                      `/home/${params("2nd", parseInt(schoolyear.secondSemester), cookies.faculty_id)}`
                    );
                    setActiveItem("2nd");
                  }}
                >
                  <Tooltip title="Second Semester">
                    <ListItemIcon>
                      <LooksTwo />
                    </ListItemIcon>
                  </Tooltip>
                  {drawerMinimize ? null : (
                    <ListItemText primary="Second Semester" />
                  )}
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
          <Outlet context={[schoolyear]} />
        </Box>
      </Box>
    </Box>
  );
};
export default Home;
