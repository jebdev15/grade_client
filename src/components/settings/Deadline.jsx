import { Box, TextField, Button, FormControl, Typography, InputLabel, MenuItem, Select, Paper, Alert } from "@mui/material";
import React from "react";
import { dateOnlyFormatter } from "../../utils/formatDate";
import { AdminSettingsServices } from "../../services/adminSettingsService";

const Deadline = () => {
  
  const initialState = {
    id: 0,
    activity: "",
    schoolyear: "",
    semester: "",
    status: "",
    from: "0000-00-00",
    to: "0000-00-00",
    currentSem: "",
    termType: "",
  }
  const [data, setData] = React.useState(initialState);
  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const changeSemesterHandler = async (event) => {
    try {
      // Fetch data for the selected semester
      const response = await AdminSettingsServices.getRegistrarActivityBySemester(event.target.value);
      
      if (!response.data) {
        console.error("No data returned from the API.");
        return;
      }
  
      // Ensure the data has valid properties and handle invalid/empty date values
      const filteredData = {
        id: response.data.id || 0,
        activity: response.data.activity || "N/A",  // Default to "N/A" if undefined
        schoolyear: response.data.schoolyear || "N/A",
        semester: response.data.semester || "N/A",
        status: response.data.status || "N/A",
        from: response.data.from && response.data.from !== "0000-00-00" ? dateOnlyFormatter(response.data.from) : "Invalid Date",
        to: response.data.to && response.data.to !== "0000-00-00" ? dateOnlyFormatter(response.data.to) : "Invalid Date",
        currentSem: response.data.currentSem || "",
        termType: response.data.term_type || "",
      };
  
      // Now you can set the state with valid data
      setData(filteredData);
      console.log(filteredData, response.status);
    } catch (error) {
      console.error("Error fetching registrar activity:", error);
    }
  }
  const updateHandler = async (e) => {
    e.preventDefault();
    const confirmation = window.confirm("Are you sure you want to update?");
    if (!confirmation) return;
    const formData = new FormData();
    formData.append("id", data.id);
    formData.append("activity", data.activity);
    formData.append("schoolyear", data.schoolyear);
    formData.append("semester", data.semester);
    formData.append("status", data.status);
    formData.append("from", data.from);
    formData.append("to", data.to);
    formData.append("currentSem", data.currentSem);
    formData.append("termType", data.termType);
    const response = await AdminSettingsServices.updateRegistrarActivityById(formData);
    alert(response.data.message, response.status);
  };
  return (
    <>
    <React.Suspense fallback={<div>Loading...</div>}>
      <Paper 
        elevation={12}
        sx={{ 
          padding: 2,
        }}
      >
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            gap: 3,
          }}
        >
          <Typography variant="h5" color="initial">
            MANAGE DEADLINE
          </Typography>
          {!data.id && (
            <Alert severity="info">Select Semester to Proceed</Alert>
          )}
          <Box component="form" onSubmit={updateHandler} sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "100%" }}>
            <FormControl fullWidth>
              <TextField 
                id="select-activity" 
                name="activity" 
                label="Activity" 
                type="text" 
                value={data.activity} 
                onChange={changeHandler} 
                disabled={data.activity === ""}
                fullWidth 
              />
            </FormControl>
            <FormControl sx={{ display: "flex", flexDirection: "row", gap: 1 }} fullWidth>
              <TextField 
                id="select-schoolyear" 
                name="schoolyear" 
                label="School Year" 
                type="number" 
                value={data.schoolyear} 
                onChange={changeHandler} 
                disabled={data.schoolyear === ""}
                fullWidth 
              />
              <TextField 
                label="School Year" 
                type="number" 
                value={`${data.schoolyear && parseInt(data.schoolyear) + 1}`} 
                disabled 
                fullWidth 
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="select-semester-label">Semester</InputLabel>
              <Select 
                id="select-semester" 
                label="Semester" 
                name="semester" 
                value={data.semester} 
                onChange={(event) => {
                  changeHandler(event)
                  setTimeout(() => changeSemesterHandler(event), 500); 
                }}
              >
                <MenuItem value="summer">Summer</MenuItem>
                <MenuItem value="1st">1st Semester</MenuItem>
                <MenuItem value="2nd">2nd Semester</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="select-termType-label">Term Type(Mid/Final)</InputLabel>
              <Select 
                id="select-termType" 
                label="Term Type" 
                name="termType" 
                value={data.termType} 
                onChange={changeHandler}
                disabled={data.termType === ""}
                required
              >
                <MenuItem value="midterm">Mid Term</MenuItem>
                <MenuItem value="finalterm">End Term</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="select-status-label">Status</InputLabel>
              <Select 
                id="select-status" 
                label="Status" 
                name="status" 
                value={data.status} 
                onChange={changeHandler}
                disabled={data.status === ""}
                required
              >
                <MenuItem value="Open">Open</MenuItem>
                <MenuItem value="Close">Close</MenuItem>
              </Select>
            </FormControl>
            <FormControl fullWidth>
              <TextField 
                id="select-from-label" 
                name="from" 
                label="From" 
                type="date" 
                value={data.from} 
                onChange={changeHandler} 
                disabled={data.from === "0000-00-00"}
                required
                fullWidth 
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField 
                id="select-to-label" 
                name="to" 
                label="To" 
                type="date" 
                value={data.to} 
                onChange={changeHandler} 
                disabled={data.from === "0000-00-00"}
                required
                fullWidth 
              />
            </FormControl>
            <FormControl fullWidth>
              <InputLabel id="select-currentSem-label">Set as Current Semester</InputLabel>
              <Select 
                id="select-currentSem" 
                label="Set as Current Semester" 
                name="currentSem" 
                value={data.currentSem} 
                onChange={changeHandler}
                disabled={data.semester === ""}
                required
              >
                <MenuItem value=""></MenuItem>
                <MenuItem value="1">Yes</MenuItem>
                <MenuItem value="0">No</MenuItem>
              </Select>
            </FormControl>
            <Button 
              variant="contained" 
              type="submit" 
              sx={{ padding: 2, color: "white" }}
              disabled={!data.id}
              >
              SAVE
            </Button>
          </Box>
        </Box>
      </Paper>
    </React.Suspense>
    </>
  );
};
export default Deadline;
