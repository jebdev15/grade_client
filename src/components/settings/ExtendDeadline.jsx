import { Box, TextField, Button, FormControl, Typography, InputLabel, MenuItem, Select, Paper, Alert, ListItemIcon, ListItemText, Checkbox, List, ListItemButton, Collapse } from "@mui/material";
import React from "react";
import { dateOnlyFormatter } from "../../utils/formatDate";
import { AdminSettingsServices } from "../../services/adminSettingsService";

const initialState = {
  id: 0,
  activity: "",
  schoolyear: "",
  semester: "",
  status: "",
  from: "0000-00-00",
  to: "0000-00-00",
  termType: "",
}

const ExtendDeadline = () => {
  const [faculty, setFaculty] = React.useState([]);
  const [data, setData] = React.useState(initialState);
  const [checked, setChecked] = React.useState([]);
  const [checkedClassCode, setCheckedClassCode] = React.useState([]);
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
        activity: response.data.activity || "N/A",  // Default to "N/A" if undefined
        schoolyear: response.data.schoolyear || "N/A",
        semester: response.data.semester || "N/A",
        status: response.data.status || "N/A",
        from: response.data.from && response.data.from !== "0000-00-00" ? dateOnlyFormatter(response.data.from) : "Invalid Date",
        to: response.data.to && response.data.to !== "0000-00-00" ? dateOnlyFormatter(response.data.to) : "Invalid Date",
        termType: response.data.term_type || "",
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
    // const response = await AdminSettingsServices.updateRegistrarActivityById(formData);
    // alert(response.data.message, response.status);
  };

  const handleToggle = (item) => () => {
    const faculty_id = item.faculty_id;
    const class_codes = item.class_codes.split(', ');
    const currentIndex = checked.indexOf(faculty_id);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(faculty_id);
      class_codes.map((code) => handleToggleClassCode(code))
    } else {
      newChecked.splice(currentIndex, 1);
      class_codes.map((code) => handleToggleClassCode(code))
    }
    console.log(newChecked)
    setChecked(newChecked);
  }

  const handleToggleClassCode = (value) => () => {
    const currentIndex = checkedClassCode.indexOf(value);
    const newChecked = [...checkedClassCode];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }
    console.log([...checkedClassCode])
    setCheckedClassCode(newChecked);
  }
  const handleFetchFacultyAndClassCode = async () => {
    console.log({checked, checkedClassCode});
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
            EXTEND DEADLINE
          </Typography>
          {!data.id && (
            <Alert severity="info">Select Semester to Proceed</Alert>
          )}
          <Box component="form" onSubmit={updateHandler} sx={{ display: "flex", flexDirection: "column", gap: 2, width: "100%" }}>
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
                      onClick={handleToggle(item)}
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
                    {classCodes.map((classCode, index) => {
                      return (
                        <Collapse 
                          key={index} 
                          in={true} 
                          checked={checkedClassCode.includes(classCode)} 
                          timeout="auto" 
                          unmountOnExit
                          onClick={handleToggleClassCode(classCode)}
                        >
                          <List component="div" disablePadding>
                            <ListItemButton sx={{ pl: 4 }}>
                              <ListItemIcon>
                                <Checkbox
                                  checked={checkedClassCode.includes(item.faculty_id)}
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
              disabled={!data.id && checked.length < 1}
              onClick={handleFetchFacultyAndClassCode}
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
export default React.memo(ExtendDeadline);