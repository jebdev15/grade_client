import { Box, TextField, Button, FormControl, Typography, InputLabel, MenuItem, Select, Paper } from "@mui/material";
import { useState } from "react";
import { dateOnlyFormatter } from "../../utils/formatDate";
import { saveDeadlineServices } from "../../services/admin-settings.services";

const Deadline = ({ activity, schoolyear, semester, status, from, to }) => {
  const initialDeadlineState = {
    activity: activity || "",
    schoolyear: schoolyear || "",
    semester: semester || "",
    status: status || "",
    from: dateOnlyFormatter(from) || "0000-00-00",
    to: dateOnlyFormatter(to) || "0000-00-00",
  };
  const [data, setData] = useState(initialDeadlineState);
  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const updateHandler = async (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const { data, status } = await saveDeadlineServices(formData);
    alert(data.message, status);
  };
  return (
    <>
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
        <Box component="form" onSubmit={updateHandler} sx={{ display: "flex", flexDirection: "column", gap: 2, maxWidth: "100%" }}>
          <FormControl fullWidth>
            <TextField id="select-activity" name="activity" label="Activity" type="text" value={data.activity} onChange={changeHandler} fullWidth />
          </FormControl>
          <FormControl sx={{ display: "flex", flexDirection: "row", gap: 1 }} fullWidth>
            <TextField id="select-schoolyear" name="schoolyear" label="School Year" type="number" value={data.schoolyear} onChange={changeHandler} fullWidth />
            <TextField label="School Year" type="number" value={`${parseInt(data.schoolyear) + 1}`} disabled fullWidth />
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="select-semester-label">Semester</InputLabel>
            <Select id="select-semester" label="Semester" name="semester" value={data.semester} onChange={changeHandler}>
              <MenuItem value="1st">1st Semester</MenuItem>
              <MenuItem value="2nd">2nd Semester</MenuItem>
              <MenuItem value="summer">Summer</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <InputLabel id="select-status-label">Status</InputLabel>
            <Select id="select-status" label="Status" name="status" value={data.status} onChange={changeHandler}>
              <MenuItem value="Open">Open</MenuItem>
              <MenuItem value="Close">Close</MenuItem>
            </Select>
          </FormControl>
          <FormControl fullWidth>
            <TextField id="select-from-label" name="from" label="From" type="date" value={data.from} onChange={changeHandler} fullWidth />
          </FormControl>
          <FormControl fullWidth>
            <TextField id="select-to-label" name="to" label="To" type="date" value={data.to} onChange={changeHandler} fullWidth />
          </FormControl>
          <Button variant="contained" type="submit" sx={{ padding: 2, color: "white" }}>
            SAVE
          </Button>
        </Box>
      </Box>
    </Paper>
    </>
  );
};

export default Deadline;
