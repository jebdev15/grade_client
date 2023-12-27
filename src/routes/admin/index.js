import React, { useState } from "react";
import {
  AppBar,
  Avatar,
  Box,
  Button,
  MenuItem,
  Select,
  Toolbar,
  Typography,
} from "@mui/material";
import { useCookies } from "react-cookie";
const Admin = () => {
  const siteCookies = ["picture", "name", "faculty_id", "email", "campus"];
  const [cookies, setCookie, removeCookie] = useCookies(siteCookies);

  const schoolYears = [2015, 2016, 2017, 2018, 2019, 2020, 2021, 2022];
  // const navigate = useNavigate();

  const [currentSchoolYear, setCurrentSchoolYear] = useState(
    schoolYears[schoolYears.length - 1]
  );

  const [drawerMinimize, setDrawerMinimize] = useState(false);
  const [menuAnchor, setMenuAnchor] = useState(null);

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
            <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
              Academic Year:{" "}
              <Select
                // value={currentSchoolYear}
                // onChange={(e) => setCurrentSchoolYear(e.target.value)}
                size="small"
                sx={{
                  width: 200,
                  bgcolor: "white",
                  p: 0,
                  ml: 1,
                }}
              >
                <MenuItem>Select academic year</MenuItem>
                {/* {schoolYears.map((sy) => (
                  <MenuItem key={sy} value={sy}>{`${sy} - ${sy + 1}`}</MenuItem>
                ))} */}
              </Select>
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
    </Box>
  );
};

export default Admin;
