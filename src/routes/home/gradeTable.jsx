import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import axios from "axios";
import { Close } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import { useEffect, useState } from "react";
import { urlDecode } from "url-encode-base64";
const GradeTable = () => {
  const navigate = useNavigate();
  const { code, class_code } = useParams();
  const theme = useTheme();
  const [semester, currentSchoolYear] = code?.split("-");
  const decode = {
    semester: urlDecode(semester),
    currentSchoolYear: urlDecode(currentSchoolYear),
  }
  const { rows, loadInfoArr, status, dbSchoolYear, dbSemester, dbStatus, dbTo  } = useLoaderData();
  const [manualOpen, setManualOpen] = useOutletContext();
  const loadInfo = loadInfoArr[0];
  const SubjectisLock = loadInfo.isLock

  const [toUpdate, setToUpdate] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [updatedCount, setUpdatedCount] = useState(null);
  
  const dateFormatter = (date) => {
    const newDateTime = new Date(date);
    
    const formattedDate = newDateTime.toLocaleString('en-PH', {
      month: 'long', // Full month name
      day: 'numeric', // Day of the month
      year: 'numeric', // Full year
    });
    
    return formattedDate;
  }

  const currentDate = 'April 25, 2024';
  const systemScheduledDueDate = dateFormatter(dbTo);

  const checkDate = systemScheduledDueDate >= currentDate;
  const checkSchoolYear = dbSchoolYear === parseInt(decode.currentSchoolYear);
  const checkSemester = dbSemester === decode.semester;
  const checkSubjectIsLock = SubjectisLock === 0;

  const canUpload = checkDate && checkSchoolYear && checkSemester && checkSubjectIsLock;
  console.log('canUpload', canUpload);

  console.log({'currentDate' : currentDate, 'systemScheduledDueDate': systemScheduledDueDate});
  console.log('checkDate', checkDate);
  console.log({'dbSchoolYear': dbSchoolYear, decodedSchoolYear: parseInt(decode.currentSchoolYear)});
  console.log('schoolYear', dbSchoolYear === parseInt(decode.currentSchoolYear));
  console.log({'dbSemester': dbSemester, 'decodedSemester': decode.semester});
  console.log('semester', dbSemester === decode.semester);
  console.log({'SubjectisLock': SubjectisLock, 'isLock': 0});
  console.log('checkSubjectIsLock', checkSubjectIsLock);

  const columns = [
    {
      field: "student_id",
      headerName: "Student ID",
      width: 90,
      hideable: false,
    },
    {
      field: "sg_id",
      hide: true,
    },
    {
      field: "name",
      headerName: "Student Name",
      minWidth: 150,
      flex: 1,
      hideable: false,
    },
    {
      field: "mid_grade",
      headerName: "Mid Term",
      width: 90,
      editable: canUpload,
      type: "number",
      hideable: false,
      sortable: true,
      preProcessEditCellProps: ({ props }) => {
        const hasError = props.value < 0 || props.value > 100;
        return { ...props, error: hasError };
      },
      valueSetter: ({ row, value }) => {
        const average = Math.round(
          (parseFloat(value) + parseFloat(row.final_grade)) / 2
        );
        let status = "";
        if (average > 74) status = "Passed";
        else if (average >= 3) status = "Failed";
        else if (average >= 1) status = "Passed";

        return { ...row, average, status, mid_grade: value };
      },
    },
    {
      field: "final_grade",
      headerName: "End Term",
      width: 90,
      editable: canUpload,
      sortable: true,
      type: "number",
      hideable: false,
      preProcessEditCellProps: ({ props }) => {
        const hasError = props.value < 0 || props.value > 100;
        return { ...props, error: hasError };
      },
      valueSetter: ({ row, value }) => {
        const average = Math.round(
          (parseFloat(row.mid_grade) + parseFloat(value)) / 2
        );
        let status = "";
        if (average > 74) status = "Passed";
        else if (average >= 3) status = "Failed";
        else if (average >= 1) status = "Passed";

        return { ...row, average, status, final_grade: value };
      },
    },
    {
      field: "average",
      headerName: "Grade",
      width: 90,
      sortable: true,
      type: "number",
      valueGetter: ({ row }) => {
        if (row.mid_grade && row.final_grade) {
          const average =
            (parseFloat(row.mid_grade) + parseFloat(row.final_grade)) / 2;

          return average < 5 ? average : Math.round(average);
        } else return "";
      },
    },

    {
      field: "status",
      headerName: "Status",
      valueGetter: ({ row }) => {
        if (row.mid_grade && row.final_grade) {
          const average = Math.round(
            (parseFloat(row.mid_grade) + parseFloat(row.final_grade)) / 2
          );
          if (average > 74) return "Passed";
          else if (average >= 3) return "Failed";
          else if (average >= 1) return "Passed";
        } else return "";
      },
    },
    {
      field: "dbRemark",
      headerName: "dbRemark",
      hide: true,
    },
    {
      field: "addRemark",
      flex: 0.5,
      headerName: "Remark",
      editable: canUpload,
      sortable: true,
      type: "singleSelect",
      valueOptions: [
        "Incomplete",
        "Dropped",
        "No Attendance",
        "No Grade",
        "Withdrawn",
        "-",
      ],
      valueGetter: (params) => {
        switch (params.row.dbRemark) {
          case "inc":
            return "Incomplete";
          case "drp":
            return "Dropped";
          case "ng":
            return "No Grade";
          case "na":
            return "No Attendance";
          case "w":
            return "Withdrawn";
          default:
            return "-";
        }
      },
      valueSetter: (params) => {
        let dbRemark = null;
        switch (params.value) {
          case "Incomplete":
            dbRemark = "inc";
            break;
          case "Dropped":
            dbRemark = "drp";
            break;
          case "No Grade":
            dbRemark = "ng";
            break;
          case "No Attendance":
            dbRemark = "na";
            break;
          case "Withdrawn":
            dbRemark = "w";
            break;
          default:
            dbRemark = "";
        }

        return { ...params.row, dbRemark };
      },
    },
  ];
  return (
    <Dialog
      open={manualOpen}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          setManualOpen(false);
        }
      }}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
      <DialogTitle sx={{ bgcolor: "primary.main" }}>
        <Box
          sx={{
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          Grade Sheet
          <IconButton
            onClick={() => {
              setToUpdate([]);
              setManualOpen(false);
              navigate(`/home/${code}`);
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            color: "primary.main",
            display: "flex",
            justifyContent: "space-around",
            alignItems: "center",
            mt: 2,
          }}
        >
          <Typography>
            Subject Code: <strong>{loadInfo.subject_code}</strong>
          </Typography>
          <Typography>
            Section: <strong>{loadInfo.section}</strong>
          </Typography>
        </Box>
        <Box
          sx={{
            width: "100%",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <DataGrid
            getRowId={(row) => row.student_id}
            columns={columns}
            rows={rows}
            autoHeight
            loading={tableLoading}
            editMode="row"
            disableColumnMenu
            hideFooter
            experimentalFeatures={{ newEditingApi: true }}
            sx={{
              '& .MuiDataGrid-booleanCell[data-value="true"]': {
                color: theme.palette.secondary.main,
              },
              "& .MuiCheckbox-root:hover": {
                bgcolor: theme.palette.secondary.light,
              },
              "& .MuiSvgIcon-root": {
                color: theme.palette.secondary.main,
              },
            }}
            processRowUpdate={(row, prev) => {
              const isSame = JSON.stringify(row) === JSON.stringify(prev);
              if (!isSame) {
                const duplicate = toUpdate.find((r) => r.sg_id === row.sg_id);
                let newArr = null;
                if (duplicate) {
                  newArr = toUpdate.filter((r) => r.sg_id !== duplicate.sg_id);
                  setToUpdate([...newArr, row]);
                } else {
                  setToUpdate((prev) => [...prev, row]);
                }
              }
              return row;
            }}
          />
            <Button
              variant="contained"
              disabled={tableLoading}
              sx={{
                mt: 2,
                justifySelf: "center",
                display: toUpdate.length ? "block" : "none",
              }}
              onClick={async () => {
                setTableLoading(true);
                const { data } = await axios.post(
                  `${process.env.REACT_APP_API_URL}/updateGrade`,
                  { grades: toUpdate, class_code, method: "Manual" }
                );
                if (data) {
                  setToUpdate([]);
                  setTableLoading(false);
                  setUpdatedCount(data);
                }
              }}
            >
              {tableLoading ? "Updating..." : "Update Record"}
            </Button>
          <Snackbar
            open={Boolean(updatedCount)}
            onClose={() => setUpdatedCount(null)}
            autoHideDuration={2000}
          >
            <Alert
              severity="success"
              sx={{ width: "100%" }}
            >{`${updatedCount} row${
              updatedCount > 1 ? "s" : ""
            } updated.`}</Alert>
          </Snackbar>
        </Box>
      </DialogContent>
    </Dialog>
  );
};
export const loader = async ({ params }) => {
  const { code, class_code } = params;
  const [semester, currentSchoolYear, faculty_id] = code.split("-");
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/getGradeTable?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}`
  );

  const rows = data;

  const { data: data2, status } = await axios.get(
    `${process.env.REACT_APP_API_URL}/getLoad?faculty_id=${faculty_id}&school_year=${currentSchoolYear}&semester=${semester}&class_code=${class_code}`
  );
  const loadInfoArr = data2;

  const { data: data3 } = await axios.get(
    `${process.env.REACT_APP_API_URL}/getCurrentSchoolYear?getYear=currentYearSetBySystem`
  )
  const { schoolyear:dbSchoolYear, semester:dbSemester, status:dbStatus, to:dbTo } = data3[0]

  return { rows, loadInfoArr, status, dbSchoolYear, dbSemester, dbStatus, dbTo };
};
export default GradeTable;
