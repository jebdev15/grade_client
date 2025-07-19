import {
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
import { HomeSemesterServices } from "@services/homeSemesterService";
import axiosInstance from "api/axiosInstance";
import GPSnackbar from "@components/GPSnackbar";
import { useEncodedFeatureState } from "@hooks/useFeatureState";

const GradeTable = () => {
  const [cookies, ,] = useCookies(["email"]);
  const navigate = useNavigate();
  const { code, class_code } = useParams();
  const theme = useTheme();

  const { rows, loadInfoArr, dbTermType } = useLoaderData();
  const loadInfo = loadInfoArr[0];
  const [...contexts] = useOutletContext();
  const manualOpen = contexts[0];
  const setManualOpen = contexts[1];
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
      minWidth: 100,
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
        // Old way to fetch mid term grade
        // const average = Math.round(
        //   (parseFloat(value) + parseFloat(row.final_grade)) / 2
        // );
        // fix to fetch mid term grade
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
      editable: canUpload,
      sortable: true,
      type: "number",
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
      setEncode((prev) => ({
        ...prev,
        error: true,
        message: "No changes detected. Please update at least one row.",
      }));
    }
  };
  const handleUpdateGrades = async () => {
    setEncode((prev) => ({ ...prev, loading: true }));
    try {
      const payload = {
        grades: encode.toUpdate,
        class_code,
        method: "Manual",
        email_used: cookies.email,
        term_type: dbTermType,
      };
      const { data } = await axiosInstance.post(
        `/student-grades/update-grade/undergraduate`,
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
            justifyContent: "space-between",
            alignItems: "center",
            mt: 2,
            mb: 2,
          }}
        >
          <Typography>
            Subject Code: <strong>{loadInfo.subject_code}</strong>
          </Typography>
          <Typography>
            Section: <strong>{loadInfo.section}</strong>
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
          )}
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
              alignSelf: "left",
              // display: toUpdate.length ? "block" : "none",
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
    await HomeSemesterServices.getStudentsByYearSemesterAndClassCode(
      currentSchoolYear,
      semester,
      class_code
    );

  const rows = data;

  const { facultyLoadData, status } =
    await HomeSemesterServices.getFacultyLoadByFacultyIdYearSemesterAndClassCode(
      faculty_id,
      currentSchoolYear,
      semester,
      class_code
    );
  const loadInfoArr = facultyLoadData;

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
export default GradeTable;
