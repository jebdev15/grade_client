import {
  Box,
  TextField,
  Button,
  FormControl,
  Typography,
  InputLabel,
  MenuItem,
  Select,
  Paper,
  CircularProgress,
} from "@mui/material";
import axiosInstance from "api/axiosInstance";
import React from "react";

const CreditsComponent = () => {
  const [data, setData] = React.useState({
    school_year: new Date().getFullYear(),
    semester: "1st",
    count: 0,
    updated: 0,
    loading: false,
    show: false,
  });
  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const handleCheckAndUpdate = async (e) => {
    e.preventDefault();
    setData((prevState) => ({ ...prevState, loading: true, show: false }));
    try {
      const response = await axiosInstance.get(
        `/admin-student/credits/${data.school_year}/${data.semester}`
      );
      setData((prevState) => ({
        ...prevState,
        count: response.data.rows.count,
        updated: response.data.rows.updated,
      }));
    } catch (error) {
      alert(error);
    } finally {
      setData((prevState) => ({ ...prevState, loading: false, show: true }));
    }
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
              Student Credits Checker & Updater
            </Typography>
            <Box
              component="form"
              onSubmit={handleCheckAndUpdate}
              sx={{
                display: "flex",
                flexDirection: "column",
                gap: 2,
                maxWidth: "100%",
              }}
            >
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 1 }}
                fullWidth
              >
                <TextField
                  id="select-schoolyear"
                  name="school_year"
                  label="School Year"
                  type="number"
                  value={data.school_year}
                  onChange={changeHandler}
                  disabled={data.loading}
                  fullWidth
                />
                <TextField
                  label="School Year"
                  type="number"
                  value={`${
                    data.school_year && parseInt(data.school_year) + 1
                  }`}
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
                  disabled={data.loading}
                  value={data.semester}
                >
                  <MenuItem value="summer">Summer</MenuItem>
                  <MenuItem value="1st">1st Semester</MenuItem>
                  <MenuItem value="2nd">2nd Semester</MenuItem>
                </Select>
              </FormControl>
              <Button
                variant="contained"
                type="submit"
                sx={{ padding: 2, color: "white" }}
                startIcon={data.loading && <CircularProgress size={20} />}
                disabled={data.loading}
              >
                { !data.loading  && "CHECK & UPDATE" }
              </Button>
            </Box>
          </Box>
        </Paper>
        {data.show && (
          <Paper
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: 2,
              mt: 2,
              padding: 2,
            }}
          >
            <Typography
              textAlign={"left"}
              variant="body1"
              color="initial"
              sx={{ minWidth: 320 }}
            >
              Total number of students with no credits: {data.count}
            </Typography>
            <Typography
              textAlign={"left"}
              variant="body1"
              color="initial"
              sx={{ minWidth: 320 }}
            >
              Total updated rows : {data.updated}
            </Typography>
          </Paper>
        )}
      </React.Suspense>
    </>
  );
};
export default React.memo(CreditsComponent);
