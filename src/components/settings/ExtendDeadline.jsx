import { Box, TextField, Button, FormControl, Typography, InputLabel, MenuItem, Select, Paper, Alert, ListItemIcon, ListItemText, Checkbox, List, ListItemButton, Collapse, CircularProgress } from "@mui/material";
import React from "react";
import { dateOnlyFormatter } from "../../utils/formatDate";
import { AdminSettingsServices } from "../../services/adminSettingsService";

const date = new Date();
const currentDate = dateOnlyFormatter(date);
const initialState = {
  id: 0,
  schoolyear: "",
  semester: "",
  from: "0000-00-00",
  to: "0000-00-00",
}

const ExtendDeadline = () => {
  const [faculty, setFaculty] = React.useState([]);
  const [data, setData] = React.useState(initialState);
  const [checked, setChecked] = React.useState([]);
  const [checkedClassCode, setCheckedClassCode] = React.useState([]);
  const [loading, setLoading] = React.useState(false);
  const changeHandler = (event) => {
    setData({ ...data, [event.target.name]: event.target.value });
  };
  const resetArrays = () => {
    setCheckedClassCode([]);
    setChecked([]);
    setFaculty([]);
  }
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
        schoolyear: response.data.schoolyear || "N/A",
        semester: response.data.semester || "N/A",
        from: currentDate,
        to: currentDate,
      };
      resetArrays();
      // Now you can set the state with valid data
      setData(filteredData);
      if(response.status === 200) fetchAllEmailsForExtension(response.data.schoolyear, response.data.semester)
    } catch (error) {
      console.error("Error fetching registrar activity:", error);
    }
  }
  const fetchAllEmailsForExtension = async (school_year, semester) => {
      const { data:facultyData } = await AdminSettingsServices.getAllEmailsForExtension(school_year, semester);
      const filterFacultyData = facultyData.filter(fac => !(["Dean","Chairperson","Registrar","Administrator"].includes(fac.accessLevel))) 
      setFaculty(filterFacultyData);
  }

  const insertHandler = async (e) => {
    e.preventDefault();
    console.log({checkedClassCode});
    const confirmation = window.confirm("Are you sure you want to update?");
    if (!confirmation) return;
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("schoolyear", data.schoolyear);
      formData.append("semester", data.semester);
      formData.append("deadline_extend_start", data.from);
      formData.append("deadline_extend_end", data.to);
      formData.append("class_codes", checkedClassCode);
      const response = await AdminSettingsServices.extendUploadingOfGradeByClassCode(formData);
      alert(response.data.message, response.status);
    } catch (error) {
      alert("Error extending deadline.");
      console.error("Error fetching registrar activity:", error);
    } finally {
      setLoading(false);
    }
  };

  const handleToggle = (faculty_id, classCodes) => () => {
    const currentIndex = checked.indexOf(faculty_id);
    const newChecked = [...checked];
    const class_codes = classCodes.split(', ');
    if (currentIndex === -1) {
      
      newChecked.push(faculty_id);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    class_codes.map((code) => handleToggleClassCode(code));
    setChecked(newChecked);
  }

  const handleToggleClassCode = (value) => () => {
    const currentIndex = checkedClassCode.indexOf(value);
    const newCheckedClassCode = [...checkedClassCode];

    if (currentIndex === -1) {
      newCheckedClassCode.push(value);
    } else {
      newCheckedClassCode.splice(currentIndex, 1);
    }
    setCheckedClassCode(newCheckedClassCode);
  }
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
            Extend Grade Submission Deadline
          </Typography>
          {!data.id && (
            <Alert severity="info">Select Semester to Proceed</Alert>
          )}
          <Box component="form" onSubmit={insertHandler} sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
            <FormControl sx={{ display: "flex", flexDirection: "row", gap: 1 }} fullWidth>
              <TextField 
                id="select-schoolyear" 
                name="schoolyear" 
                label="School Year" 
                type="number" 
                value={data.schoolyear} 
                onChange={changeHandler} 
                disabled={data.schoolyear === ""}
                inputProps={{ readOnly: true }}
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
                sx={{ display: 'none' }}
              />
            </FormControl>
            <FormControl fullWidth>
              <TextField 
                id="select-to-label" 
                name="to" 
                label="Date" 
                type="date" 
                value={data.to} 
                onChange={changeHandler} 
                disabled={data.from === "0000-00-00"}
                required
                fullWidth 
              />
            </FormControl>
            <List
                sx={{
                  width: '100%',
                  height: { sm: 300, md:450 },
                  bgcolor: 'background.paper',
                  overflow: 'auto',
                  border: '1px solid var(--border-default)',
                  borderRadius: 1,
                }}
                dense
                component="div"
                role="list"
              >
              {faculty.map((item, index) => {
                const classCodes = item.class_codes.split(', ');
                const classList = item.class_list.split(', ');
                return (
                  <>
                    <ListItemButton
                      key={index}
                      role="listitem"
                      onClick={handleToggle(item.faculty_id, item.class_codes)}
                    >
                      <ListItemIcon>
                      <Checkbox
                        checked={checked.includes(item.faculty_id)}
                        tabIndex={-1}
                        disableRipple
                        inputProps={{ 'aria-labelledby': `transfer-list-all-item-${index}-label` }}
                      />
                      </ListItemIcon>
                      <ListItemText sx={{ ml: 3 }} primary={`${item.lastName}, ${item.firstName} - ${item.faculty_id} - ${item.email}`} />
                    </ListItemButton>
                    {checked.includes(item.faculty_id) && classCodes.map((classCode, index) => {
                      return (
                        <Collapse 
                          key={index} 
                          in={checked.includes(item.faculty_id)} 
                          timeout="auto" 
                          unmountOnExit
                          onClick={handleToggleClassCode(classCode)}
                        >
                          <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                              <ListItemIcon>
                                <Checkbox
                                  checked={checkedClassCode.includes(classCode)}
                                  tabIndex={-1}
                                  disableRipple
                                  inputProps={{ 'aria-labelledby': `transfer-list-all-item-${index}-label` }}
                                />
                              </ListItemIcon>
                              <ListItemText primary={`${classCode} - ${classList[index]}`} />
                            </ListItemButton>
                          </List>
                        </Collapse>
                      )
                    })}
                  </>
                )
              } )}
            </List>
            <Button 
              variant="contained" 
              type="submit" 
              sx={{ padding: 2, color: "white" }}
              disabled={(!data.id && checked.length < 1) || loading}
            >
              {loading ? (<CircularProgress size={20} />) : "Save"}
            </Button>
          </Box>
        </Box>
      </Paper>
    </React.Suspense>
    </>
  );
};
export default React.memo(ExtendDeadline);