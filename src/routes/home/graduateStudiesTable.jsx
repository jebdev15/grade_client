import {
  Alert,
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  IconButton,
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
import React from "react";
import { useCookies } from "react-cookie";
import { HomeSemesterServices } from "../../services/homeSemesterService";
import { useEncodedFeatureState } from "@hooks/useFeatureState";
import axiosInstance from "api/axiosInstance";
import GPSnackbar from "@components/GPSnackbar";

const GraduateStudiesTable = () => {
  const [cookies, ,] = useCookies(["email"]);
  const navigate = useNavigate();
  const { code, class_code } = useParams();
  const theme = useTheme();
  const { rows, loadInfoArr, dbTermType } = useLoaderData();

  const [...contexts] = useOutletContext();
  const manualOpen = contexts[0];
  const setManualOpen = contexts[1];
  const loadInfo = loadInfoArr[0];
  const canUpload =
    (loadInfo.canUpload || loadInfo.is_deadline_extended) &&
    !loadInfo.classLoadStatus;
  const [encode, setEncode] = useEncodedFeatureState();
  const columns = [
    {
      field: "id",
      headerName: "No.",
      width: 90,
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
      editable: canUpload,
      sortable: true,
      type: "number",
      valueGetter: ({ row }) => parseFloat(row.mid_grade),
    },
    {
      field: "final_grade",
      headerName: "End Term",
      width: 90,
      editable: canUpload,
      sortable: true,
      type: "number",
      valueGetter: ({ row }) => parseFloat(row.final_grade),
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
      const duplicate = encode.toUpdate.find((r) => r.sg_id === row.sg_id);
      let newArr = null;
      if (duplicate) {
        newArr = encode.toUpdate.filter((r) => r.sg_id !== duplicate.sg_id);
        setEncode((prev) => ({ ...prev, toUpdate: [...newArr, row] }));
      } else {
        setEncode((prev) => ({ ...prev, toUpdate: [...prev.toUpdate, row] }));
      }
    }
    return row;
  };

  const handleCheckNotUpdated = async () => {
    if (encode.toUpdate.length > 0) {
      let message = `Are you sure you want to update?`;
      const confirmation = window.confirm(message);

      if (!confirmation) return;
      await handleUpdateGrades();
    } else {
      alert("No rows to update");
    }
  };

  const handleUpdateGrades = async () => {
    setEncode((prev) => ({ ...prev, loading: true }));
    try {
      const payload = {
        grades: encode.toUpdate.map(row => ({
          ...row,
          status: row.grade > 0 ? (row.grade >= 1 && row.grade <= 2 ? "Passed" : "Failed") : "",
        })),
        class_code,
        method: "Manual",
        email_used: cookies.email,
        term_type: dbTermType,
      };
      const { data } = await axiosInstance.post(
        `/student-grades/update-grade/graduate-studies`,
        payload
      );
      if (data.affectedRows < 0) {
        return setEncode((prev) => ({
          ...prev,
          error: true,
          message: "Failed to update. Please try again later.",
        }));
      }
      setEncode((prev) => ({
        ...prev,
        toUpdate: [],
        message: "Successfully updated",
        updatedCount: data.affectedRows,
      }));
    } catch (error) {
      setEncode((prev) => ({ ...prev, error: true, message: error.message }));
    } finally {
      setEncode((prev) => ({ ...prev, openSnackbar: true, loading: false }));
    }
  };
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
              setEncode((prev) => ({ ...prev, toUpdate: [], open: false }));
              navigate(`/home/${code}`);
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
            flexDirection: "column",
            mt: 2,
          }}
        >
          <Alert severity="info">
            <Typography>
              To avoid issues in grade submission, Graduate School subjects follow the point-based grading system (e.g., 1.0, 1.25, 1.5, 1.75, 2.0, ... 3.0).
            </Typography>
          </Alert>
          <Typography sx={{ my: 2 }}>
            <strong>{loadInfo.subject_code} {loadInfo.section}</strong>
          </Typography>
        </Box>
        <Box>
          <DataGrid
            getRowId={(row) => row.student_id}
            columns={columns}
            rows={rows}
            rowHeight={32}
            autoHeight
            loading={encode.loading}
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
          <GPSnackbar
            open={encode.openSnackbar}
            onClose={() =>
              setEncode((prev) => ({ ...prev, openSnackbar: false }))
            }
            error={encode.error}
            message={encode.message}
          />
        </Box>
      </DialogContent>
      <DialogActions>
        {canUpload && (
          <Button
            variant="contained"
            disabled={encode.loading || encode.toUpdate.length < 1}
            sx={{
              mt: 2,
              justifySelf: "center",
            }}
            onClick={handleCheckNotUpdated}
          >
            {encode.loading ? "Updating..." : "Update Record"}
          </Button>
        )}
      </DialogActions>
    </Dialog>
  );
};
export const loader = async ({ params }) => {
  const { code, class_code } = params;
  const [semester, currentSchoolYear, faculty_id] = code.split("-");
  const { data } =
    await axiosInstance.get(`/student-grades/graduate-studies/class-code/${class_code}/school-year/${currentSchoolYear}/semester/${semester}`);

  const rows = data.rows;

  const { facultyLoadData: loadInfoArr, status } =
    await HomeSemesterServices.getFacultyLoadByFacultyIdYearSemesterAndClassCode(
      faculty_id,
      currentSchoolYear,
      semester,
      class_code
    );

  const { data: registrarActivityData } =
    await HomeSemesterServices.getRegistrarActivityBySemester(semester);
  const {
    schoolyear: dbSchoolYear,
    semester: dbSemester,
    to: dbTo,
    term_type: dbTermType,
  } = registrarActivityData;
  return {
    rows,
    loadInfoArr,
    status,
    dbSchoolYear,
    dbSemester,
    dbTo,
    dbTermType,
  };
};

export default GraduateStudiesTable;
