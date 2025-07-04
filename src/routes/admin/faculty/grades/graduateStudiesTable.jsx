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
import {
  useLoaderData,
  useNavigate,
  useOutletContext,
  useParams,
} from "react-router-dom";
import { Close } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { HomeSemesterServices } from "../../services/homeSemesterService";
import { HomeSemesterGraduateStudiesTableService } from "../../services/homeSemesterGraduateStudiesTableService";
import axiosInstance from "../../../../api/axiosInstance";

const GraduateStudiesTable = ({ open, handleClose, data }) => {
  const [cookies, ,] = useCookies(["email"]);
  const navigate = useNavigate();
  const { code, class_code } = useParams();
  const theme = useTheme();

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
      minWidth: 150,
      flex: 1,
      hideable: false,
    },
    {
      field: "mid_grade",
      headerName: "Mid Term",
      width: 90,
      editable: canUpload,
      sortable: true,
      type: "number",
      valueGetter: ({ row }) => parseFloat(row.mid_grade),
    },
    {
      field: "end_grade",
      headerName: "End Term",
      width: 90,
      editable: canUpload,
      sortable: true,
      type: "number",
      valueGetter: ({ row }) => parseFloat(row.end_grade),
    },
    {
      field: "grade",
      headerName: "Grade",
      width: 90,
      editable: canUpload,
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
      const { data } =
        await axiosInstance.get(`/admin-student/grades/${class_code}`);
      if (data) {
        setToUpdate([]);
        setTableLoading(false);
        setUpdatedCount(data);
      }
    } else {
      alert("No rows to update");
    }
  };
  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          handleClose()
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
              handleClose()
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
            <strong>{`${data[0]?.subject_code}(Graduate Studies)`}</strong>
          </Typography>
          <Typography>
            Section: <strong>{data[0]?.section}</strong>
          </Typography>
        </Box>
        <Box>
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
          }}
          onClick={handleCheckNotUpdated}
        >
          {tableLoading ? "Updating..." : "Update Record"}
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default GraduateStudiesTable;
