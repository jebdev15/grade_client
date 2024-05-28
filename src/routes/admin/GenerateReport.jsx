import { DataGrid } from '@mui/x-data-grid'
import React, { useEffect, useState } from 'react'
import {
  Backdrop,
  Box,
  Button,
  Fade, 
  Grid, 
  IconButton, 
  Modal,
  Typography, 
  Tooltip, 
  useMediaQuery, 
  ButtonGroup, 
  Dialog, 
  DialogTitle, 
  DialogContent, 
  DialogContentText, 
  DialogActions, 
  Select,
  TextField, MenuItem, FormControl, InputLabel,
} from '@mui/material'
import {
  CloudDownload as CloudDownloadIcon,
} from '@mui/icons-material'
import axios from 'axios'
import { urlEncode } from 'url-encode-base64'
import { saveAs } from "file-saver";

const GenerateReport = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('md'));
  const newDate = new Date().toLocaleDateString("en-PH", {year: 'numeric' });
  const [typeOfReport, setTypeOfReport] = useState({
    toGenerate: "",
    schoolYear: newDate-1,
    semester: "",
  });
  const generateReportOptions = [
    {
      value: "gradeSheetSubmission",
      label: "Grade Sheet Submission",
    },
    {
      value: "subjectLoadLockOrUnlock",
      label: "Subject Load Lock/Unlock",
    },
    {
      value: "userAccountLogs",
      label: "User Account Logs",
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
      
      default:
        break;
      }
  const downloadLogs = async () => {
    const toGenerateValueInURL = generateReportOptions.find(({value}) => value === typeOfReport.toGenerate)?.label;
    const {data, status} = await axios.get(`${process.env.REACT_APP_API_URL}/admin/${url}?toGenerate=${toGenerateValueInURL}&schoolYear=${typeOfReport.schoolYear}&semester=${typeOfReport.semester}`,
      {
        responseType: 'arraybuffer',
      }
    )
      if(status === 200) {
        let blob = new Blob([data], {
          type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        saveAs(
          blob,
          `Logs.xlsx`
        )
      } else {
        console.log('Error');
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
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                {/* <InputLabel id="select-schoolyear-label">School Year</InputLabel> */}
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