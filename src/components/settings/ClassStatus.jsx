import React, { useState } from "react";
import { Box, Button, FormControl, Typography, InputLabel, MenuItem, Select, Paper, TextField, Alert } from "@mui/material";
import { useCookies } from "react-cookie";
import { AdminSettingsServices } from "../../services/adminSettingsService";

const ClassStatus = () => {
  const initialDeadlineState = {
    schoolyear: new Date().getFullYear(),
    semester: "1st",
    action: "",
  };
  const [data, setData] = useState(initialDeadlineState);
  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const updateHandler = async (e) => {
    e.preventDefault();
    const confirmation = window.confirm("Are you sure you want to update?");
    if (!confirmation) return;
    const formData = new FormData(e.target);
    for (const pair of formData.entries()) {
      console.log(pair[0], pair[1]);
    }
    const { data, status } = await AdminSettingsServices.updateClassStatusByYearAndSemester(formData);
    alert(data.message, status);
  };
  React.useEffect(() => {
    console.log({schoolyear: data.schoolyear, semester: data.semester});
  }, [data]);
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
          <Box component="form" onSubmit={updateHandler} sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "100%" }}>
            <Typography variant="h5" color="initial">MANAGE SUBJECT LOAD</Typography>
            <Alert severity="info">Adjust School Year and/or Semester</Alert>
            <FormControl sx={{ display: "flex", flexDirection: "row", gap: 1 }} fullWidth>
              <TextField
                id="select-schoolyear-from"
                type="number"
                name="schoolyear"
                label="School Year"
                value={data.schoolyear}
                onChange={changeHandler}
                required
                fullWidth
              />
              <TextField
                id="select-schoolyear-to"
                label="School Year"
                value={data.schoolyear ? parseInt(data.schoolyear) + 1 : ""}
                readonly
                fullWidth
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="select-semester-label">Semester</InputLabel>
              <Select id="select-semester" label="Semester" name="semester" value={data.semester} onChange={changeHandler} required>
                <MenuItem value="summer">Summer</MenuItem>
                <MenuItem value="1st">First Semester</MenuItem>
                <MenuItem value="2nd">Second Semester</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="select-action-label">Action</InputLabel>
              <Select id="select-action" label="Action" name="action" value={data.action} onChange={changeHandler} required>
                  <MenuItem value="Lock">Lock</MenuItem>
                  <MenuItem value="Unlock">Unlock</MenuItem>
              </Select>
            </FormControl>
            <Button 
              sx={{ 
                paddingLeft: 5, 
                paddingRight: 5, 
                color: "white", 
                alignItems: "center" 
              }} 
              type="submit" 
              variant="contained"
              disabled={data.schoolyear === "" || data.semester === "" || data.action === ""}
            >
              SAVE
            </Button>
          </Box>
        </Box>
      </Paper>
    </>
  );
};

export default ClassStatus;
