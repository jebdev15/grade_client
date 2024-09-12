import { Box, Button, FormControl, InputLabel, MenuItem, Select, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { AdminSettingsServices } from "../../services/adminSettingsService";

const GraduateStudies = () => {
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "subject_code", headerName: "SUBJECT CODE", width: 200 },
  ];
  const initialGraduateStudiesData = {
    rows: [],
    loading: true,
    program_codes: [],
    subject_codes: [],
    select: {
      program_code: "",
      subject_code: "",
    },
  };
  const [graduateStudiesData, setGraduateStudiesData] = useState(initialGraduateStudiesData);
  const axiosGetGraduateStudies = async () => {
    const { data, status } = await AdminSettingsServices.getGraduateStudiesServices();
    if (status === 200) {
      setGraduateStudiesData((prevState) => ({ ...prevState, rows: data, loading: false }));
    }
  };
  const axiosGetProgramCodes = async () => {
    const { data, status } = await AdminSettingsServices.getProgramCodesServices();
    if (status === 200) {
      setGraduateStudiesData((prevState) => ({ ...prevState, program_codes: data }));
    }
  };
  useEffect(() => {
    if (graduateStudiesData.loading) {
      axiosGetGraduateStudies();
      setTimeout(() => {
        axiosGetProgramCodes();
      }, 2000);
    }
  }, [graduateStudiesData]);
  const programCodesMenuItems = graduateStudiesData.program_codes.map(({ program_code, curriculum_id }) => (
    <MenuItem key={curriculum_id} value={curriculum_id}>
      {program_code}
    </MenuItem>
  )) || <MenuItem>No program codes found</MenuItem>;
  const handleChangeSelect = (e) => {
    const { name, value } = e.target;
    setGraduateStudiesData((prevState) => ({
      ...prevState,
      select: { ...prevState.select, [name]: value },
    }));

    if (name === "program_code") {
      const getSubjectCodes = async () => {
        const { data } = await AdminSettingsServices.getSubjectCodesServices(value);
        setGraduateStudiesData((prevState) => ({ ...prevState, subject_codes: data || [] }));
      };
      setTimeout(() => {
        getSubjectCodes();
      }, 1000);
      setGraduateStudiesData((prevState) => ({ ...prevState, select: { ...prevState.select, subject_code: "" } }));
    }
  };
  const subjectCodesMenuItems = graduateStudiesData?.subject_codes?.map(({ subject_code, added }, index) => {
    return (
      <MenuItem key={index} value={subject_code}>
        {added ? `${subject_code}(added)` : subject_code}
      </MenuItem>
    );
  }) || <MenuItem>No subject codes found</MenuItem>;
  const addSubjectCodeHandler = async (e) => {
    e.preventDefault();
    if (graduateStudiesData.select.subject_code === "") {
      return alert("Subject code is empty");
    }
    const formData = new FormData();
    formData.append("subject_code", graduateStudiesData.select.subject_code);
    const { data, status } = await AdminSettingsServices.saveSubjectCodeServices(formData);
    alert(data.message, status);
    setGraduateStudiesData(initialGraduateStudiesData);
  };
  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
        }}
      >
        <Typography variant="h5" color="initial">
          MANAGE GRADUATE STUDIES
        </Typography>
        <Box sx={{ display: "flex", flexDirection: "row", gap: 2, maxWidth: "100%" }} component="form" onSubmit={addSubjectCodeHandler}>
          <FormControl fullWidth>
            <InputLabel id="demo-simple-select-label">Program Code</InputLabel>
            <Select name="program_code" labelId="demo-simple-select-label" id="demo-simple-select" value={graduateStudiesData.select.program_code} label="Program Code" onChange={handleChangeSelect}>
              <MenuItem value="">Select Program Code</MenuItem>
              {programCodesMenuItems}
            </Select>
          </FormControl>
          {graduateStudiesData.subject_codes.length > 0 && (
            <FormControl fullWidth>
              <InputLabel id="demo-simple-select-label-sc">Subject Code</InputLabel>
              <Select
                name="subject_code"
                labelId="demo-simple-select-label-sc"
                id="demo-simple-select-sc"
                value={graduateStudiesData.select.program_code !== "" && graduateStudiesData.select.subject_code}
                label="Subject Code"
                onChange={handleChangeSelect}
              >
                <MenuItem value="">Select Subject Code</MenuItem>
                {subjectCodesMenuItems}
              </Select>
            </FormControl>
          )}
          <Button sx={{ paddingLeft: 5, paddingRight: 5, color: "white", alignItems: "center" }} type="submit" variant="contained">
            Save
          </Button>
        </Box>
        <Box
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 1,
          }}
        >
          <DataGrid
            sx={{
              minHeight: "300px",
              width: "100%",
              maxWidth: "100%",
            }}
            loading={graduateStudiesData.loading}
            rows={graduateStudiesData.rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[25, 50]}
          />
        </Box>
      </Box>
    </>
  );
};

export default GraduateStudies;
