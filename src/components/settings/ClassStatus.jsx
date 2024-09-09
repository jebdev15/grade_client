import React, { useState } from "react";
import { Box, Button, FormControl, Typography, InputLabel, MenuItem, Select, Paper } from "@mui/material";
import { useCookies } from "react-cookie";
import { updateClassStatusServices } from "../../services/admin-settings.services";

const ClassStatus = ({ schoolyear, semester }) => {
  const [cookies, ,] = useCookies(["email"]);
  const initialDeadlineState = {
    schoolyear: schoolyear || 1970,
    semester: semester || "",
    action: "Lock" || "Unlock",
  };
  const [data, setData] = useState(initialDeadlineState);
  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const updateHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    formData.append("email_used", cookies.email);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    const { data, status } = await updateClassStatusServices(formData);
    console.log(data, status);
    alert(data.message, status);
  };
  React.useEffect(() => {
    console.log({schoolyear,semester});
  }, [schoolyear, semester]);
  return (
    <>
      <Paper elevation={12} sx={{ padding: 2 }}>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h5" color="initial">{`MANAGE SUBJECT LOAD`}</Typography>
          <Box component="form" onSubmit={updateHandler} sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "100%" }}>
            <Typography variant="body1" color="initial">
              {`School Year: ${parseInt(data.schoolyear)} - ${parseInt(data.schoolyear) + 1}`}
            </Typography>

            <Typography variant="body1" color="initial">
              {`Semester: ${data.semester}`}
            </Typography>

            <Box sx={{ display: "flex", flexDirection: "row", gap: 2 }}>
              <FormControl fullWidth>
                <InputLabel id="select-action-label">Action</InputLabel>
                <Select id="select-action" label="Action" name="action" value={data.action} onChange={changeHandler} required>
                  <MenuItem value="Lock">Lock</MenuItem>
                  <MenuItem value="Unlock">Unlock</MenuItem>
                </Select>
              </FormControl>
              <Button sx={{ paddingLeft: 5, paddingRight: 5, color: "white", alignItems: "center" }} type="submit" variant="contained">
                SAVE
              </Button>
            </Box>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default ClassStatus;
