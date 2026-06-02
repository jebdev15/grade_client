import React, { useMemo, useState } from "react";
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
  // Checkbox,
  // FormControlLabel,
  Paper,
  Alert,
} from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import GPSnackbar from "@components/GPSnackbar";
import { FailureListService } from "@services/failureListService";
import { dateOnlyFormatter } from "@utils/formatDate";

const FailureListSettings = () => {
  const [windowForm, setWindowForm] = useState({
    school_year: "",
    semester: "",
    term_type: "endterm",
    start_date: "",
    end_date: "",
    post_deadline_action: "restrict_only",
  });
  const [windowId, setWindowId] = useState(null);
  const [windowLoading, setWindowLoading] = useState(false);
  const [windowsLoading, setWindowsLoading] = useState(false);
  const [windows, setWindows] = useState([]);
  const [windowDialogOpen, setWindowDialogOpen] = useState(false);

  // const [classForm, setClassForm] = useState({
  //   class_code: "",
  //   status: "draft",
  // });
  // const [rosterRows, setRosterRows] = useState([]);
  // const [rosterPolicy, setRosterPolicy] = useState(null);
  // const [selection, setSelection] = useState([]);
  // const [rosterLoading, setRosterLoading] = useState(false);

  const [snackbar, setSnackbar] = useState({
    open: false,
    message: "",
    error: false,
  });

  const handleCloseSnackbar = () =>
    setSnackbar((prev) => ({ ...prev, open: false }));

  const showMessage = (message, error = false) => {
    setSnackbar({ open: true, message, error });
  };

  const handleWindowChange = (field) => (event) => {
    setWindowForm((prev) => ({ ...prev, [field]: event.target.value }));
  };

  // const handleClassChange = (field) => (event) => {
  //   setClassForm((prev) => ({ ...prev, [field]: event.target.value }));
  // };

  const loadWindows = async () => {
    setWindowsLoading(true);
    try {
      const { windows: data } = await FailureListService.getWindows();
      const formattedData = (data || []).map((window) => ({
        ...window,
        start_date: dateOnlyFormatter(window.start_date) || "",
        end_date: dateOnlyFormatter(window.end_date) || "",
      }));

      setWindows(formattedData);
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      setWindowsLoading(false);
    }
  };

  const handleSelectWindow = (window) => {
    if (!window) return;
    setWindowId(window.id);
    setWindowForm((prev) => ({
      ...prev,
      school_year: window.school_year || "",
      semester: window.semester || "",
      term_type: window.term_type || "endterm",
      start_date: window.start_date?.slice(0, 10) || "",
      end_date: window.end_date?.slice(0, 10) || "",
      post_deadline_action: window.post_deadline_action || "restrict_only",
    }));
    setWindowDialogOpen(true);
  };

  const handleNewWindow = () => {
    setWindowId(null);
    setWindowForm((prev) => ({
      ...prev,
      school_year: "",
      semester: "",
      term_type: "endterm",
      start_date: "",
      end_date: "",
      post_deadline_action: "restrict_only",
    }));
    setWindowDialogOpen(true);
  };

  const handleCloseWindowDialog = () => {
    if (windowLoading) return;
    setWindowDialogOpen(false);
  };

  const handleSaveWindow = async () => {
    if (
      !windowForm.school_year ||
      !windowForm.semester ||
      !windowForm.start_date ||
      !windowForm.end_date
    ) {
      showMessage("Please complete all window fields.", true);
      return;
    }
    setWindowLoading(true);
    try {
      await FailureListService.saveWindow(windowForm);
      showMessage("Window saved.");
      await loadWindows();
      setWindowDialogOpen(false);
    } catch (error) {
      showMessage(error.message, true);
    } finally {
      setWindowLoading(false);
    }
  };

  // const handleDeleteWindow = async () => {
  //   if (!windowId) {
  //     showMessage("No window to delete.", true);
  //     return;
  //   }
  //   const confirm = window.confirm("Delete this failure list window?");
  //   if (!confirm) return;

  //   setWindowLoading(true);
  //   try {
  //     await FailureListService.deleteWindow(windowId);
  //     setWindowId(null);
  //     showMessage("Window deleted.");
  //     await loadWindows();
  //     setWindowDialogOpen(false);
  //   } catch (error) {
  //     showMessage(error.message, true);
  //   } finally {
  //     setWindowLoading(false);
  //   }
  // };

  // const handleLoadRoster = async () => {
  //   if (!classForm.class_code) {
  //     showMessage("Please enter class code.", true);
  //     return;
  //   }
  //   setRosterLoading(true);
  //   try {
  //     const result = await FailureListService.getAdminRoster(
  //       classForm.class_code
  //     );
  //     setRosterPolicy(result.policy || null);
  //     const rows = (result.students || []).map((row, index) => ({
  //       id: row.student_grades_id || index + 1,
  //       ...row,
  //     }));
  //     setRosterRows(rows);
  //     const selectedIds = rows.filter((row) => row.selected).map((row) => row.id);
  //     setSelection(selectedIds);
  //   } catch (error) {
  //     showMessage(error.response?.data?.error || error.message, true);
  //   } finally {
  //     setRosterLoading(false);
  //   }
  // };

  // const handleToggleAll = (event) => {
  //   if (event.target.checked) {
  //     setSelection(rosterRows.map((row) => row.id));
  //   } else {
  //     setSelection([]);
  //   }
  // };

  // const handleSaveList = async () => {
  //   if (!rosterRows.length) {
  //     showMessage("Load class roster first.", true);
  //     return;
  //   }
  //   const confirm = window.confirm("Save the current list of failures?");
  //   if (!confirm) return;

  //   const students = rosterRows
  //     .filter((row) => selection.includes(row.id))
  //     .map((row) => ({
  //       student_id: row.student_id,
  //       student_grades_id: row.student_grades_id,
  //     }));

  //   setRosterLoading(true);
  //   try {
  //     await FailureListService.adminUpsertList({
  //       class_code: classForm.class_code,
  //       status: classForm.status,
  //       students,
  //     });
  //     showMessage("Failure list saved.");
  //     await handleLoadRoster();
  //   } catch (error) {
  //     showMessage(error.response?.data?.error || error.message, true);
  //   } finally {
  //     setRosterLoading(false);
  //   }
  // };

  // const handleDeleteList = async () => {
  //   if (!classForm.class_code) {
  //     showMessage("Please enter class code.", true);
  //     return;
  //   }
  //   const confirm = window.confirm("Remove the failure list for this class?");
  //   if (!confirm) return;

  //   setRosterLoading(true);
  //   try {
  //     await FailureListService.adminDeleteList(
  //       classForm.class_code
  //     );
  //     showMessage("Failure list removed.");
  //     setRosterRows([]);
  //     setSelection([]);
  //   } catch (error) {
  //     showMessage(error.response?.data?.error || error.message, true);
  //   } finally {
  //     setRosterLoading(false);
  //   }
  // };

  // const columns = useMemo(
  //   () => [
  //     { field: "student_id", headerName: "Student ID", width: 120 },
  //     { field: "name", headerName: "Student Name", flex: 1, minWidth: 160 },
  //   ],
  //   []
  // );

  const windowColumns = useMemo(
    () => [
      { field: "school_year", headerName: "School Year", width: 140 },
      { field: "semester", headerName: "Semester", width: 120 },
      { field: "start_date", headerName: "Start Date", width: 140 },
      { field: "end_date", headerName: "End Date", width: 140 },
      { field: "post_deadline_action", headerName: "After Deadline", width: 160 },
    ],
    []
  );

  React.useEffect(() => {
    loadWindows();
  }, []);

  return (
    <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
      <Paper sx={{ p: 2 }} variant="outlined">
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption">
            The Failure List feature allows faculty to submit a list of students who are failing at the end of the term.
          </Typography>
        </Alert>
        <Alert severity="info" sx={{ mb: 2 }}>
          <Typography variant="caption">
            To edit the failure list window, click on a window to modify it.
          </Typography>
        </Alert>
        <Typography variant="h6" gutterBottom>
          Failure List Windows
        </Typography>
        <Box sx={{ mb: 2 }}>
          <DataGrid
            autoHeight
            rows={(windows || []).map((row) => ({
              ...row,
              id: row.id,
              start_date: row.start_date?.slice(0, 10) || "",
              end_date: row.end_date?.slice(0, 10) || "",
            }))}
            columns={windowColumns}
            loading={windowsLoading}
            hideFooter
            disableRowSelectionOnClick
            onRowClick={(params) => handleSelectWindow(params.row)}
          />
        </Box>
        <Box sx={{ display: "flex", gap: 2 }}>
          <Button variant="contained" onClick={handleNewWindow}>
            Add Window
          </Button>
        </Box>
      </Paper>

      <Divider />

      {/* <Paper sx={{ p: 2 }} variant="outlined">
        <Typography variant="h6" gutterBottom>
          Manage Failure List by Class
        </Typography>
        <Box sx={{ display: "grid", gap: 2, gridTemplateColumns: "repeat(auto-fit, minmax(160px, 1fr))" }}>
          <TextField
            label="Class Code"
            value={classForm.class_code}
            onChange={handleClassChange("class_code")}
            size="small"
          />
          <FormControl size="small">
            <InputLabel>Status</InputLabel>
            <Select
              label="Status"
              value={classForm.status}
              onChange={handleClassChange("status")}
            >
              <MenuItem value="draft">Draft</MenuItem>
              <MenuItem value="submitted">Submitted</MenuItem>
            </Select>
          </FormControl>
        </Box>
        <Box sx={{ display: "flex", gap: 2, mt: 2 }}>
          <Button variant="outlined" onClick={handleLoadRoster} disabled={rosterLoading}>
            Load Class
          </Button>
          <Button variant="contained" onClick={handleSaveList} disabled={rosterLoading}>
            Save List
          </Button>
          <Button variant="text" color="error" onClick={handleDeleteList} disabled={rosterLoading}>
            Remove List
          </Button>
        </Box>

        {rosterPolicy && (
          <Typography variant="body2" sx={{ mt: 2 }}>
            Window: {rosterPolicy.window?.start_date?.slice(0, 10) || "--"} to {rosterPolicy.window?.end_date?.slice(0, 10) || "--"} | Status: {rosterPolicy.list?.status || "draft"}
          </Typography>
        )}

        <Box sx={{ mt: 2 }}>
          <FormControlLabel
            control={
              <Checkbox
                checked={selection.length > 0 && selection.length === rosterRows.length}
                indeterminate={selection.length > 0 && selection.length < rosterRows.length}
                onChange={handleToggleAll}
              />
            }
            label="Select all"
          />
          <DataGrid
            autoHeight
            rows={rosterRows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            loading={rosterLoading}
            onSelectionModelChange={(newSelection) => setSelection(newSelection)}
            selectionModel={selection}
            hideFooter
          />
        </Box>
      </Paper> */}

      <GPSnackbar
        open={snackbar.open}
        onClose={handleCloseSnackbar}
        error={snackbar.error}
        message={snackbar.message}
      />
      <Dialog
        open={windowDialogOpen}
        onClose={handleCloseWindowDialog}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>
          {windowId ? "Edit Failure List Window" : "Add Failure List Window"}
        </DialogTitle>
        <DialogContent>
          <Box
            sx={{
              display: "grid",
              gap: 2,
              mt: 1,
              gridTemplateColumns: "repeat(auto-fit, minmax(180px, 1fr))",
            }}
          >
            <TextField
              label="School Year"
              value={windowForm.school_year}
              onChange={handleWindowChange("school_year")}
              size="small"
            />
            <TextField
              label="Semester"
              value={windowForm.semester}
              onChange={handleWindowChange("semester")}
              size="small"
            />
            <TextField
              label="Start Date"
              type="date"
              value={windowForm.start_date}
              onChange={handleWindowChange("start_date")}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <TextField
              label="End Date"
              type="date"
              value={windowForm.end_date}
              onChange={handleWindowChange("end_date")}
              size="small"
              InputLabelProps={{ shrink: true }}
            />
            <FormControl size="small">
              <InputLabel>After Deadline</InputLabel>
              <Select
                label="After Deadline"
                value={windowForm.post_deadline_action}
                onChange={handleWindowChange("post_deadline_action")}
              >
                <MenuItem value="restrict_only">Restrict only</MenuItem>
                {/* <MenuItem value="auto_pass">Auto-pass 75</MenuItem> */}
              </Select>
            </FormControl>
          </Box>
        </DialogContent>
        <DialogActions sx={{ px: 3, pb: 2 }}>
          {/* {windowId && (
            <Button
              variant="text"
              color="error"
              onClick={handleDeleteWindow}
              disabled={windowLoading}
            >
              Delete
            </Button>
          )} */}
          <Button onClick={handleCloseWindowDialog} disabled={windowLoading}>
            Cancel
          </Button>
          <Button
            variant="contained"
            onClick={handleSaveWindow}
            disabled={windowLoading}
          >
            {windowLoading ? "Saving..." : "Save"}
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default FailureListSettings;
