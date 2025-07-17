import React, { useState } from "react";
import {
  Box,
  Button,
  Typography,
  useMediaQuery,
  Select,
  TextField,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
} from "@mui/material";
import { CloudDownload as CloudDownloadIcon } from "@mui/icons-material";
import { saveAs } from "file-saver";
import axiosInstance from "api/axiosInstance";
const generateReportOptions = [
  {
    value: "gradeSheetSubmission",
    label: "Grade Sheet Submission Log",
  },
  {
    value: "classStatus",
    label: "Class Load Unlock Log",
  },
  {
    value: "accountLogs",
    label: "User Account Activity Log",
  },
  {
    value: "deadlineLogs",
    label: "Deadline Adjustment Log",
  },
  {
    value: "studentGradeUpdateLog",
    label: "Student Grade Update Log",
  },
];
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
];

const getUrl = (typeOfReport) => {
  let url = "";
  switch (typeOfReport.toGenerate) {
    case "gradeSheetSubmission":
      url = "grade-sheet-submission-log";
      break;
    case "classStatus":
      url = "class-status-log";
      break;
    case "accountLogs":
      url = "account-log";
      break;
    case "deadlineLogs":
      url = "deadline-log";
      break;
    case "studentGradeUpdateLog":
      url = "student-grade-update-log";
      break;
    default:
      break;
  }
  return url;
};
function formatDate(date) {
  const year = date.getFullYear();
  const month = String(date.getMonth() + 1).padStart(2, "0"); // Months are zero-based
  const day = String(date.getDate()).padStart(2, "0");
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
const newDate = new Date().toLocaleDateString("en-PH", { year: "numeric" });
const currentDate = getTodayDate();
const tomorrowDate = getTomorrowDate();
const getCurrentTimestamp = () => {
  const now = new Date();

  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  const seconds = String(now.getSeconds()).padStart(2, '0');

  return `${year}-${month}-${day}-${hours}${minutes}${seconds}`;
};
const initialTypeOfReportData = {
  toGenerate: "",
  schoolYear: newDate - 1,
  semester: "",
  from: currentDate,
  to: tomorrowDate,
};

const GenerateReport = () => {
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down("md"));
  const [loading, setLoading] = useState(false);
  const [typeOfReport, setTypeOfReport] = useState(initialTypeOfReportData);
  const url = getUrl(typeOfReport);
  const toGenerateValueInURL = generateReportOptions.find(
    ({ value }) => value === typeOfReport.toGenerate
  )?.label;
  const downloadLogs = async () => {
    if (typeOfReport.toGenerate === "" || typeOfReport.toGenerate === null) {
      alert("Select Report to Generate");
      return;
    }
    setLoading(true);
    try {
      const params = ["gradeSheetSubmission", "deadlineLogs", "studentGradeUpdateLog"].includes(
        typeOfReport.toGenerate
      )
        ? `schoolYear=${typeOfReport.schoolYear}&semester=${typeOfReport.semester}`
        : `from=${typeOfReport.from}&to=${typeOfReport.to}`;
      const { data, status } = await axiosInstance.get(
        `/admin-report/${url}?toGenerate=${toGenerateValueInURL}&${params}`,
        {
          responseType: "arraybuffer",
        }
      );
      if (status === 200) {
        // const dateToday = getTodayDate();
        const currentTimestamp = getCurrentTimestamp();
        let blob = new Blob([data], {
          type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
        });
        saveAs(blob, `${toGenerateValueInURL}-${currentTimestamp}.xlsx`);
      } else {
        alert("Something went wrong");
      }
    } catch (error) {
      alert(
        error.response.data.message ||
          "There was an error. Please try again later."
      );
      console.log(error);
    } finally {
      setLoading(false);
    }
  };
  const handleChangeParams = (e) => {
    setTypeOfReport((prevState) => ({
      ...prevState,
      [e.target.name]: e.target.value,
    }));
  };
  return (
    <>
      <Box
        sx={
          isSmallScreen
            ? { height: "100%", width: "100%" }
            : { height: 600, width: "100%" }
        }
      >
        <Typography
          variant="h4"
          fontWeight={700}
          component="div"
          marginBottom={3}
          sx={{ flexGrow: 1 }}
        >
          Reports
        </Typography>
        <Box
          sx={{ display: "flex", flexDirection: "column", gap: 2 }}
          borderRadius={"10px"}
          border={"1px solid var(--border-default)"}
          className="usersTable"
        >
          <Typography variant="caption" color="initial">
            Select the type of report you would like to generate
          </Typography>
          <FormControl fullWidth>
            <InputLabel id="select-typeOfReport-label">
              Select Type of Report
            </InputLabel>
            <Select
              labelId="select-typeOfReport-label"
              id="select-typeOfReport"
              label="Select Type of Report"
              name="toGenerate"
              value={typeOfReport.toGenerate}
              onChange={handleChangeParams}
              required
            >
              {Object.values(generateReportOptions).map(({ value, label }) => (
                <MenuItem key={value} value={value}>
                  {label}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          {[
            "gradeSheetSubmission",
            "deadlineLogs",
            "studentGradeUpdateLog",
          ].includes(typeOfReport.toGenerate) ? (
            <>
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                fullWidth
              >
                <TextField
                  label="School Year"
                  type="number"
                  name="schoolYear"
                  value={typeOfReport.schoolYear}
                  onChange={handleChangeParams}
                  fullWidth
                />
                {typeOfReport.semester !== "summer" && (
                  <TextField
                    type="number"
                    value={parseInt(typeOfReport.schoolYear) + 1}
                    disabled
                    fullWidth
                  />
                )}
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-semester-label">
                  Semester
                </InputLabel>
                <Select
                  labelId="select-semester-label"
                  id="select-semester"
                  label="Select Semester"
                  name="semester"
                  value={typeOfReport.semester}
                  onChange={handleChangeParams}
                  required
                >
                  {Object.values(semesterOptions).map(({ value, label }) => (
                    <MenuItem key={value} value={value}>
                      {label}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </>
          ) : (
            <>
              <FormControl
                sx={{ display: "flex", flexDirection: "row", gap: 2 }}
                fullWidth
              >
                <TextField
                  type="date"
                  name="from"
                  value={typeOfReport.from}
                  onChange={handleChangeParams}
                  fullWidth
                />
                <TextField
                  type="date"
                  name="to"
                  value={typeOfReport.to}
                  onChange={handleChangeParams}
                  fullWidth
                />
              </FormControl>
            </>
          )}
          <Button
            variant="contained"
            sx={{
              backgroundColor: "var(--primary-color)",
              color: "var(--background-main)",
              padding: 2,
            }}
            startIcon={<CloudDownloadIcon />}
            onClick={downloadLogs}
            disabled={loading}
          >
            {loading ? <CircularProgress size={20} /> : "Generate Report"}
          </Button>
        </Box>
      </Box>
    </>
  );
};
export default GenerateReport;
