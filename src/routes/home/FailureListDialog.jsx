import React from "react";
import {
  Alert,
  Box,
  Button,
  Checkbox,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControlLabel,
  IconButton,
  Typography,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { DataGrid } from "@mui/x-data-grid";
import GPSnackbar from "@components/GPSnackbar";
import { FailureListService } from "@services/failureListService";

const FailureListDialog = ({
  open,
  onClose,
  class_code,
  term_type,
  isGraduateStudies,
}) => {
  const [loading, setLoading] = React.useState(false);
  const [rosterRows, setRosterRows] = React.useState([]);
  const [policy, setPolicy] = React.useState(null);
  const [selection, setSelection] = React.useState([]);
  const [confirmOpen, setConfirmOpen] = React.useState(false);
  const [snackbar, setSnackbar] = React.useState({
    open: false,
    error: false,
    message: "",
  });

  const showMessage = (message, error = false) =>
    setSnackbar({ open: true, error, message });

  const fetchRoster = React.useCallback(async () => {
    if (!open || !class_code) return;
    setLoading(true);
    try {
      const result = await FailureListService.getFacultyRoster(
        class_code,
        term_type,
      );
      const students = (result.students || []).map((row, index) => ({
        id: row.student_grades_id || `${row.student_id}-${index + 1}`,
        ...row,
      }));
      setRosterRows(students);
      setPolicy(result.policy || null);
      setSelection(students.filter((row) => row.selected).map((row) => row.id));
    } catch (error) {
      showMessage(error.response?.data?.error || error.message, true);
    } finally {
      setLoading(false);
    }
  }, [class_code, open, term_type]);

  React.useEffect(() => {
    fetchRoster();
  }, [fetchRoster]);

  const handleToggleAll = (event) => {
    if (event.target.checked) {
      setSelection(rosterRows.map((row) => row.id));
    } else {
      setSelection([]);
    }
  };

  const handleConfirm = () => {
    if (!policy?.isApplicable) {
      showMessage("List of Failures is not applicable for this class.", true);
      return;
    }
    if (!policy?.isWindowOpen) {
      showMessage("Failure-list window is closed.", true);
      return;
    }
    setConfirmOpen(true);
  };

  const handleSubmit = async () => {
    const students = rosterRows
      .filter((row) => selection.includes(row.id))
      .map((row) => ({
        student_id: row.student_id,
        student_grades_id: row.student_grades_id,
      }));

    setLoading(true);
    try {
      await FailureListService.submitList({
        class_code,
        term_type,
        students,
      });
      showMessage("List of Failures submitted.");
      setConfirmOpen(false);
      await fetchRoster();
    } catch (error) {
      showMessage(error.response?.data?.error || error.message, true);
    } finally {
      setLoading(false);
    }
  };

  const columns = [
    { field: "student_id", headerName: "Student ID", width: 130 },
    { field: "name", headerName: "Student Name", flex: 1, minWidth: 180 },
  ];

  const selectedCount = selection.length;
  const totalCount = rosterRows.length;

  return (
    <>
      <Dialog open={open} onClose={onClose} fullWidth maxWidth="md">
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
                onClose();
                // setEncode((prev) => ({ ...prev, toUpdate: [], open: false }));
                // navigate(`/home/${code}`);
              }}
            >
              <CloseIcon sx={{ color: "text.light" }} />
            </IconButton>
          </Box>
        </DialogTitle>
        <DialogContent>
          {isGraduateStudies && (
            <Alert severity="info" sx={{ mb: 2 }}>
              This feature is not available for graduate studies classes.
            </Alert>
          )}
          {policy && !policy.isApplicable && !isGraduateStudies && (
            <Alert severity="info" sx={{ mb: 2 }}>
              This class is not covered by the List of Failures policy.
            </Alert>
          )}
          {policy && policy.isApplicable && (
            <Alert
              severity={policy.isWindowOpen ? "success" : "warning"}
              sx={{ mb: 2 }}
            >
              {policy.isWindowOpen
                ? "Window is open. Select students to fail and finalize submission."
                : "Window is closed. You can review but cannot submit changes."}
            </Alert>
          )}

          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              alignItems: "center",
              mb: 1,
            }}
          >
            <Typography variant="body2">
              Selected: {selectedCount} / {totalCount}
            </Typography>
            <FormControlLabel
              control={
                <Checkbox
                  checked={selectedCount > 0 && selectedCount === totalCount}
                  indeterminate={
                    selectedCount > 0 && selectedCount < totalCount
                  }
                  onChange={handleToggleAll}
                  disabled={!policy?.isWindowOpen}
                />
              }
              label="Check all"
            />
          </Box>

          <DataGrid
            autoHeight
            rows={rosterRows}
            columns={columns}
            checkboxSelection
            disableRowSelectionOnClick
            loading={loading}
            hideFooter
            selectionModel={selection}
            isRowSelectable={() => Boolean(policy?.isWindowOpen)}
            onSelectionModelChange={(newSelection) =>
              setSelection(newSelection)
            }
          />
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            onClick={handleConfirm}
            disabled={
              loading ||
              isGraduateStudies ||
              !policy?.isApplicable ||
              !policy?.isWindowOpen
            }
          >
            Finalize List
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={confirmOpen}
        onClose={() => setConfirmOpen(false)}
        fullWidth
        maxWidth="sm"
      >
        <DialogTitle>Confirm Final Submission</DialogTitle>
        <DialogContent>
          <Typography>
            You are about to submit {selectedCount} student(s) in the List of
            Failures for class {class_code}.
          </Typography>
          <Typography sx={{ mt: 1 }}>
            After the window closes, students not on this list cannot receive
            failing grades.
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            color="error"
            onClick={handleSubmit}
            disabled={loading}
          >
            Confirm Submission
          </Button>
        </DialogActions>
      </Dialog>

      <GPSnackbar
        open={snackbar.open}
        onClose={() => setSnackbar((prev) => ({ ...prev, open: false }))}
        error={snackbar.error}
        message={snackbar.message}
      />
    </>
  );
};

export default FailureListDialog;
