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
import React from "react";
import axiosInstance from "@/api/axiosInstance";
import { useEncodedFeatureState } from "@hooks/useFeatureState";

const GraduateStudiesTable = ({ open, handleClose, classLoadData }) => {
  const class_code = classLoadData[0]?.id;
  const theme = useTheme();
  const [encoded, setEncoded] = useEncodedFeatureState();
  const columns = [
    {
      field: "id",
      headerName: "No.",
      width: 50,
      hideable: false,
    },
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
      editable: true,
      sortable: true,
      type: "number",
      valueGetter: ({ row }) => parseFloat(row.mid_grade),
    },
    {
      field: "end_grade",
      headerName: "End Term",
      width: 90,
      editable: true,
      sortable: true,
      type: "number",
      valueGetter: ({ row }) => parseFloat(row.end_grade),
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 90,
      editable: true,
      sortable: true,
      type: "number",
      valueGetter: ({ row }) => parseFloat(row.grade),
    },
    {
      field: "status",
      headerName: "Status",
      valueGetter: ({ row }) => {
        if (row.grade > 0) {
          return row.grade >= 1 && row.grade <= 2 ? "Passed" : "Failed";
        } else {
          return "";
        }
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
      editable: true,
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
      const duplicate = encoded.toUpdate.find((r) => r.sg_id === row.sg_id);
      let newArr = null;
      if (duplicate) {
        newArr = encoded.toUpdate.filter((r) => r.sg_id !== duplicate.sg_id);
        setEncoded((prev) => ({ ...prev, toUpdate: [...newArr, row] }));
      } else {
        setEncoded((prev) => ({ ...prev, toUpdate: [...prev.toUpdate, row] }));
      }
    }
    return row;
  };
  const handleCheckNotUpdated = async () => {
    if (encoded.toUpdate.length > 0) {
      let message = `Are you sure you want to update?`;
      const confirmation = window.confirm(message);
      if (!confirmation) return;
      await handleUpdateGrades();
    } else {
      setEncoded((prev) => ({
        ...prev,
        error: true,
        message: "No changes detected. Please update at least one row.",
      }));
    }
  };
  const handleUpdateGrades = async () => {
    setEncoded((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const payload = {
        class_code,
        term_type: classLoadData[0].term_type,
        grades: encoded.toUpdate,
      };
      const response = await axiosInstance.put(
        `/admin-student/grades/graduate-studies`,
        payload
      );
      if (response.data) {
        setEncoded((prev) => ({
          ...prev,
          toUpdate: [],
          updatedCount: response.data.totalAffectedRows,
          message: response.data.message,
        }));
      }
    } catch (error) {
      // Handle error appropriately
      setEncoded((prev) => ({
        ...prev,
        error: true,
        message: "There was an error updating the grades. Please try again.",
      }));
    } finally {
      setEncoded((prev) => ({
        ...prev,
        openSnackbar: true,
        loading: false,
      }));
    }
  };

  React.useEffect(() => {
    const fetchStudentsWithGrades = async () => {
      setEncoded((prev) => ({
        ...prev,
        loading: true,
      }));
      try {
        const { data: students } = await axiosInstance.get(
          `/admin-student/grades/${class_code}/graduate`
        );
        if (students.rows.length > 0) {
          const formattedRows = students.rows.map((row, index) => ({
            ...row,
            id: index + 1,
          }));
          setEncoded((prev) => ({
            ...prev,
            rows: formattedRows,
          }));
          return;
        }
        setEncoded((prev) => ({
          ...prev,
          rows: [],
        }));
      } catch (error) {
        console.error("Error fetching students:", error);
        setEncoded((prev) => ({
          ...prev,
          error: true,
          message: "Failed to fetch students with grades. Please try again.",
          rows: [],
        }));
      } finally {
        setEncoded((prev) => ({
          ...prev,
          loading: false,
        }));
      }
    };
    fetchStudentsWithGrades();
  }, [class_code]);
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
              setEncoded((prev) => ({ ...prev, toUpdate: [] }));
              handleClose();
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
            Subject Code:{" "}
            <strong>{`${classLoadData[0]?.subject_code}(Graduate Studies)`}</strong>
          </Typography>
          <Typography>
            Section: <strong>{classLoadData[0]?.section}</strong>
          </Typography>
        </Box>
        <Box>
          <DataGrid
            getRowId={(row) => row.student_id}
            columns={columns}
            rows={encoded.rows}
            rowHeight={32}
            autoHeight
            loading={encoded.loading}
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
          <Snackbar
            open={encoded.openSnackbar}
            autoHideDuration={5000}
            onClose={(e, reason) => {
              if (reason === "clickaway") return;
              setEncoded((prev) => ({
                ...prev,
                openSnackbar: false,
              }));
            }}
          >
            <Alert
              severity={encoded.error ? "error" : "success"}
              sx={{ width: "100%" }}
            >
              {encoded.message}
            </Alert>
          </Snackbar>
        </Box>
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          disabled={encoded.loading || encoded.toUpdate.length < 1}
          sx={{
            mt: 2,
            justifySelf: "center",
          }}
          onClick={handleCheckNotUpdated}
        >
          {encoded.loading ? "Updating..." : "Update Record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GraduateStudiesTable;
