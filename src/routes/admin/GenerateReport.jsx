import React, { useState } from 'react'
import {
  Box,
  Button,
  Typography, 
  useMediaQuery, 
  Select,
  TextField, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import {
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material'
import axios from 'axios'
import { saveAs } from "file-saver";

const GenerateReport = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const newDate = new Date().toLocaleDateString("en-PH", {year: 'numeric' });
  function formatDate(date) {
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0'); // Months are zero-based
    const day = String(date.getDate()).padStart(2, '0');
    return `${year}-${month}-${day}`;
  }
   function getTodayDate() {
    const today = new Date();
    return formatDate(today);
  }

  function getTomorrowDate() {
      const today = new Date();
      const tomorrow = new Date(today);
      tomorrow.setDate(today.getDate() + 1);
      return formatDate(tomorrow);
  }
  const currentDate = getTodayDate();
  const tomorrowDate = getTomorrowDate();
  const initialTypeOfReportData = {
    toGenerate: "",
    schoolYear: newDate-1,
    semester: "",
    from: currentDate,
    to: tomorrowDate,
  }
  const [typeOfReport, setTypeOfReport] = useState(initialTypeOfReportData);
  const generateReportOptions = [
    {
      value: "gradeSheetSubmission",
      label: "Grade Sheet Submission",
    },
    {
      value: "classStatus",
      label: "Class Status Update Logs",
    },
    {
      value: "accountLogs",
      label: "Account Logs",
    },
    {
      value: "deadlineLogs",
      label: "Grade Sheet Submission Deadline Logs",
    }
  ]
  const semesterOptions = [
    {
      value: "1st",
      label: "First Semester",
    },
    {
      value: "2nd",
      label: "Second Semester",
    },
    {
      value: "summer",
      label: "Summer",
    },
  ]

  let url = '';
  switch (typeOfReport.toGenerate) {
    case "gradeSheetSubmission":
      url="downloadGradeSheetSubmissionLogs"
      break;
    case "classStatus":
      url="downloadClassStatusLogs"
      break;
    case "accountLogs":
      url="downloadAccountLogs"
      break;
    case "deadlineLogs":
      url="downloadDeadlineLogs"
      break;
    default:
      break;
  }
  const toGenerateValueInURL = generateReportOptions.find(({value}) => value === typeOfReport.toGenerate)?.label;
  const downloadLogs = async () => {
    if(typeOfReport.toGenerate === "" || typeOfReport.toGenerate === null){
      alert("Select Report to Generate") 
      return
    }
    const params = ["gradeSheetSubmission","deadlineLogs"].includes(typeOfReport.toGenerate) ? `schoolYear=${typeOfReport.schoolYear}&semester=${typeOfReport.semester}` : `from=${typeOfReport.from}&to=${typeOfReport.to}`
    const {data, status} = await axios.get(`${process.env.REACT_APP_API_URL}/download/${url}?toGenerate=${toGenerateValueInURL}&${params}`,
      {
        responseType: 'arraybuffer',
      }
    )
      if(status === 200) {
        const dateToday = getTodayDate();
        let blob = new Blob([data], {
          type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        saveAs(
          blob,
          `${toGenerateValueInURL}-${dateToday}.xlsx`
        )
      } else {
        alert('Something went wrong');
      }
  }
  const handleChangeParams = (e) => {
    setTypeOfReport((prevState) => ({...prevState, [e.target.name]: e.target.value}))
  }
  return (
    <>
        <Box sx={isSmallScreen ? {height: '100%', width: '100%'} : {height: 600, width: '50%'}}>
          <Typography
          variant="h4"
          fontWeight={700}
          component="div"
          marginBottom={3}
          sx={{ flexGrow: 1 }}
        >
          Generate Report
        </Typography>
        <Typography variant="caption" color="initial">Select the type of report you would like to generate</Typography>
        <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
            <FormControl fullWidth>
              <InputLabel id="select-typeOfReport-label">Select Type of Report</InputLabel>
               <Select
                labelId="select-typeOfReport-label"
                id="select-typeOfReport"
                label="Select Type of Report"
                name="toGenerate"
                value={typeOfReport.toGenerate}
                onChange={handleChangeParams}
                required
              >
                {Object.values(generateReportOptions).map(({value, label}) => (
                  <MenuItem key={value} value={value}>{label}</MenuItem>
                ))}
              </Select>
            </FormControl>
            {["gradeSheetSubmission","deadlineLogs"].includes(typeOfReport.toGenerate) 
            ? (
              <>
                <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                  <TextField
                    label="School Year"
                    type='number'
                    name='schoolYear'
                    value={typeOfReport.schoolYear}
                    onChange={handleChangeParams}
                    fullWidth
                  />
                  <TextField
                    type='number'
                    value={parseInt(typeOfReport.schoolYear)+1}
                    disabled
                    fullWidth
                  />
                </FormControl>
                <FormControl fullWidth>
                <InputLabel id="select-semester-label">Select Type of Report</InputLabel>
                <Select
                  labelId="select-semester-label"
                  id="select-semester"
                  label="Select Semester"
                  name="semester"
                  value={typeOfReport.semester}
                  onChange={handleChangeParams}
                  required
                >
                  {Object.values(semesterOptions).map(({value, label}) => (
                    <MenuItem key={value} value={value}>{label}</MenuItem>
                  ))}
                </Select>
                </FormControl>
              </>
            ) : (
              <>
                <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                  <TextField
                    type='date'
                    name='from'
                    value={typeOfReport.from}
                    onChange={handleChangeParams}
                    fullWidth
                  />
                  <TextField
                    type='date'
                    name='to'
                    value={typeOfReport.to}
                    onChange={handleChangeParams}
                    fullWidth
                  />
                </FormControl>
              </>
            )}
              <Button 
                variant="text"
                color="inherit"
                startIcon={<CloudDownloadIcon />}
                onClick={downloadLogs}
              >
                Generate
              </Button>
            </Box>
      </Box>
    </>
  )
}
export default GenerateReport