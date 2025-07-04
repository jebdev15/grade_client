import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
  Snackbar,
  Typography,
  useTheme,
} from "@mui/material";
import { Close } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { HomeSemesterServices } from "../../../../services/homeSemesterService";
import axiosInstance from "../../../../api/axiosInstance";

const GradeTable = ({ open, handleClose, data }) => {
  const class_code = data[0]?.id;
  const theme = useTheme();
  const [cookies, ,] = useCookies(["email"]);
  const [rows, setRows] = useState([]);
  const [toUpdate, setToUpdate] = useState([]);
  const [tableLoading, setTableLoading] = useState(false);
  const [updatedCount, setUpdatedCount] = useState(null);

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
      minWidth: 100,
      flex: 1,
      hideable: false,
    },
    {
      field: "mid_grade",
      headerName: "Mid Term",
      width: 90,
      type: "number",
      editable: true,
      hideable: false,
      sortable: true,
      preProcessEditCellProps: ({ props }) => {
        const hasError = props.value < 0 || props.value > 100;
        return { ...props, error: hasError };
      },
      valueSetter: ({ row, value }) => {
        const midTermGrade =
          value === "" || isNaN(value) ? 0 : parseFloat(value);
        const endTermGrade =
          row.final_grade === "" || isNaN(row.final_grade)
            ? 0
            : parseFloat(row.final_grade);
        const ave = (midTermGrade + endTermGrade) / 2;
        let status = "";
        const checkGrades = midTermGrade > 0 && endTermGrade > 0;
        const average = checkGrades ? Math.round(ave) : 0;
        if (checkGrades) {
          status = average > 74 ? "passed" : "failed";
        }
        return { ...row, average, status, mid_grade: midTermGrade };
      },
    },
    {
      field: "final_grade",
      headerName: "End Term",
      width: 90,
      type: "number",
      editable: true,
      sortable: true,
      hideable: false,
      preProcessEditCellProps: ({ props }) => {
        const hasError = props.value < 0 || props.value > 100;
        return { ...props, error: hasError };
      },
      valueSetter: ({ row, value }) => {
        const midTermGrade =
          row.mid_grade === "" || isNaN(row.mid_grade)
            ? 0
            : parseFloat(row.mid_grade);
        const endTermGrade =
          value === "" || isNaN(value) ? 0 : parseFloat(value);
        const ave = (midTermGrade + endTermGrade) / 2;
        const checkGrades = midTermGrade > 0 && endTermGrade > 0;
        const average = checkGrades ? Math.round(ave) : 0;
        let status = "";
        if (checkGrades) {
          status = average > 74 ? "passed" : "failed";
        }
        return { ...row, average, status, final_grade: endTermGrade };
      },
    },
    {
      field: "average",
      headerName: "Grade",
      width: 90,
      sortable: true,
      type: "number",
      valueGetter: ({ row }) => {
        if (row.mid_grade > 0 && row.final_grade > 0) {
          const average =
            (parseFloat(row.mid_grade) + parseFloat(row.final_grade)) / 2;
          return Math.round(average);
        } else return "";
      },
    },
    {
      field: "status",
      headerName: "Status",
      valueGetter: ({ row }) => {
        if (row.mid_grade > 0 && row.final_grade > 0) {
          const average = Math.round(
            (parseFloat(row.mid_grade) + parseFloat(row.final_grade)) / 2
          );
          return average > 74 ? "Passed" : "Failed";
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

  const handleProcessRowUpdate = (row, prev) => {
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
  };
  const handleCheckNotUpdated = async () => {
    if (toUpdate.length > 0) {
      let message = `Are you sure you want to update?`;

      const confirmation = window.confirm(message);
      if (!confirmation) return;
      setTableLoading(true);
      const { data } = await HomeSemesterServices.updateGrade({
        grades: toUpdate,
        class_code,
        method: "Manual",
        email_used: cookies.email,
        term_type: data.term_type,
      });
      if (data) {
        setToUpdate([]);
        setTableLoading(false);
        setUpdatedCount(data);
      }
    } else {
      alert("No rows to update");
    }
  };

  React.useEffect(() => {
    const fetchStudentsWithGrades = async () => {
      setTableLoading(true);
      try {
        const { data: students } =
          await axiosInstance.get(`/admin-student/grades/${class_code}`);
        if (students.rows.length > 0) {
          const formattedRows = students.rows.map((student) => ({
            ...student,
            mid_grade: student.mid_grade || "",
            final_grade: student.final_grade || "",
            average: student.average || "",
            status: student.status || "",
            dbRemark: student.dbRemark || "",
          }));
          setRows(formattedRows);
        } else {
          setRows([]);
        }
      } catch (error) {
        console.error("Error fetching students:", error);
      } finally {
        setTableLoading(false);
      }
    }
    fetchStudentsWithGrades();
  }, [])
  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          handleClose();
        }
      }}
      fullWidth
      maxWidth="lg"
      scroll="paper"
    >
      <DialogTitle
        sx={{
          bgcolor: "primary.main",
          color: "text.light",
          padding: "8px 24px",
        }}
      >
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
              handleClose(false);
              // navigate(`/home/${code}`);
            }}
          >
            <Close sx={{ color: "text.light" }} />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box
          sx={{
            color: "primary.dark",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <Typography>
            Subject Code: <strong>{data.subject_code}</strong>
          </Typography>
          <Typography>
            Section: <strong>{data.section}</strong>
          </Typography>
        </Box>
        <Box>
          {rows.length > 0 && (
            <DataGrid
              getRowId={(row) => row.student_id}
              columns={columns}
              rows={rows}
              rowHeight={32}
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
                  bgcolor: theme.palette.text.main,
                },
                "& .MuiSvgIcon-root": {
                  color: theme.palette.placeholder.default,
                },
                color: theme.palette.text.main,
              }}
              processRowUpdate={handleProcessRowUpdate}
            />
          )}

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
      <DialogActions>
        <Button
          variant="contained"
          disabled={tableLoading || toUpdate.length < 1}
          sx={{
            mt: 2,
            justifySelf: "center",
            alignSelf: "left",
            // display: toUpdate.length ? "block" : "none",
          }}
          onClick={handleCheckNotUpdated}
        >
          {tableLoading ? "Updating..." : "Update Record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GradeTable;
