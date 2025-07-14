import React, { useState } from "react";
import {
  Close,
  Done,
  CloudUpload as CloudUploadIcon,
} from "@mui/icons-material";
import {
  Alert,
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Snackbar,
  Typography,
} from "@mui/material";
import { useCookies } from "react-cookie";
import { saveAs } from "file-saver";
import axiosInstance from "@/api/axiosInstance";
import { useUploadFeatureState } from "@hooks/useFeatureState";

const UploadGS = ({ open, handleClose, classLoadData }) => {
  const class_code = classLoadData[0]?.id;
  const [cookies, ,] = useCookies(["name", "email"]);

  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [download, setDownload] = useUploadFeatureState();
  const [upload, setUpload] = useUploadFeatureState();
  const downloadExcel = async () => {
    setDownload((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const { semester, school_year, section, subject_code } = classLoadData[0];
      const { data } = await axiosInstance.get(
        `/excel-export/grades/graduate-studies?semester=${semester}&currentSchoolYear=${school_year}&class_code=${class_code}&name=${cookies.name.toUpperCase()}&classSection=${section}`,
        {
          responseType: "arraybuffer",
        }
      );
      let blob = new Blob([data], {
        type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      });
      saveAs(blob, `${subject_code}-${section}-${class_code}.xlsx`);
      setDownload((prev) => ({
        ...prev,
        message: "Downloaded Successfully",
      }));
    } catch (error) {
      console.error("Error downloading file:", error);
      setDownload((prev) => ({
        ...prev,
        error: true,
        message: "Failed to download the grade sheet.",
      }));
      return;
    } finally {
      setTimeout(() => {
        setDownload((prev) => ({
          ...prev,
          openSnackbar: true,
          loading: false,
        }));
      }, 1000);
    }
  };

  const handleChangeFile = (e) => {
    setUploadFile(e.target.files[0]);
  };
  const uploadExcel = async () => {
    setUpload((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const formData = new FormData();
      formData.append("uploadFile", uploadFile);
      formData.append("class_code", class_code);
      formData.append("method", "Upload");
      formData.append("email_used", cookies.email);
      formData.append("term_type", classLoadData[0].term_type);
      const { data } = await axiosInstance.put(
        "/admin-student/grades/upload-graduate-studies",
        formData
      );
      const { isOkay, isError } = data;
      setUpload((prev) => ({
        ...prev,
        file: null,
        error: isError ? true : false,
        message: isOkay
          ? "Uploaded Successfully"
          : "The file you uploaded either didn'\t upload correctly or does not match the subject.",
      }));
    } catch (error) {
      console.error("Error uploading file:", error);
      setUploading(false);
      setUpload((prev) => ({
        ...prev,
        error: true,
        message: "The file you uploaded either didn'\t upload correctly or does not match the subject."
      }));
      setUploadFile(null);
      return;
    } finally {
      setUpload((prev) => ({
        ...prev,
        openSnackbar: true,
        loading: false,
      }));
      setTimeout(() => handleClose(), 3500);
    }
  };
  return (
    <Dialog
      open={open}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          setUploadFile(null);
          handleClose();
        }
      }}
      fullWidth
      maxWidth="md"
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
          Upload Grade Sheet(GS)
          <IconButton
            onClick={() => {
              setUploadFile(null);
              handleClose();
            }}
          >
            <Close />
          </IconButton>
        </Box>
      </DialogTitle>
      <DialogContent>
        <Box sx={{ display: "flex", pt: 3 }}>
          <Box sx={{ display: "flex", flexDirection: "column", flex: 1, m: 2 }}>
            <Box sx={{ display: "flex", alignItems: "center", mb: 1 }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>A</Avatar>
              <Typography>
                Download the grade sheet of the class and fill it up.
              </Typography>
            </Box>
            <Paper
              sx={{ display: "flex", flexDirection: "column", flex: 1 }}
              variant="outlined"
            >
              <Typography
                sx={{ bgcolor: "primary.light", py: 1 }}
                variant="h6"
                textAlign="center"
              >
                Load Info
              </Typography>
              <Box sx={{ p: 2 }}>
                <Typography>{`Class Code: ${classLoadData[0].class_code}`}</Typography>
                <Typography>{`Subject Code: ${classLoadData[0].subject_code}`}</Typography>
                <Typography>{`Faculty: ${cookies.name}`}</Typography>
                <Typography>{`Section: ${classLoadData[0].section}`}</Typography>
                <Typography>{`Total Students: ${classLoadData[0].noStudents}`}</Typography>
              </Box>
              <Button
                variant="contained"
                onClick={downloadExcel}
                disabled={download.loading || uploading ? true : false}
              >
                {/* Download Grade Sheet */}
                {download.loading ? "Downloading..." : "Download Grade Sheet"}
              </Button>
            </Paper>
          </Box>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              flex: 1,
              m: 2,
            }}
          >
            <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
              <Avatar sx={{ bgcolor: "primary.main", mr: 2 }}>B</Avatar>
              <Typography>Upload the grade sheet.</Typography>
            </Box>
            <Box sx={{ width: "100%", flex: 1 }}>
              <Box
                sx={{
                  borderColor: "primary.light",
                  border: "2px dashed",
                  p: 2,
                  height: "100%",
                  display: "flex",
                  justifyContent: "center",
                  alignItems: "center",
                  cursor: "pointer",
                  flexDirection: "column",
                }}
                disabled={uploading}
              >
                {uploadFile ? (
                  <Box sx={{ textAlign: "center" }}>
                    <Done color="primary" fontSize="large" />
                    <Typography variant="h6" sx={{ mt: 2 }}>
                      File Inserted!
                    </Typography>
                    <Typography>{uploadFile.name}</Typography>
                  </Box>
                ) : (
                  <Button
                    component="label"
                    role={undefined}
                    variant=""
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    <input
                      hidden
                      type="file"
                      onChange={handleChangeFile}
                      name="file"
                      allowed="xlsx"
                    />
                    <Typography variant="body1" color="initial">
                      Click to Upload a file
                    </Typography>
                  </Button>
                )}
              </Box>
            </Box>
            <Button
              variant="contained"
              fullWidth
              disabled={upload.loading}
              onClick={uploadExcel}
              sx={{ display: uploadFile ? "flex" : "none", mt: 1 }}
            >
              {upload.loading ? "Uploading..." : "Upload"}
            </Button>
          </Box>
        </Box>
        {/* Upload Grade Sheet Snackbar */}
        {upload.openSnackbar && (
          <Snackbar
            open={upload.openSnackbar}
            autoHideDuration={3000}
            onClose={(e, reason) => {
              if (reason === "clickaway") return;
              setUpload((prevState) => ({ ...prevState, openSnackbar: false }));
            }}
          >
            <Alert severity={upload.error ? "error" : "info"}>
              {upload.message}
            </Alert>
          </Snackbar>
        )}
        {/* Download Grade Sheet Snackbar */}
        {download.openSnackbar && (
          <Snackbar
            open={download.openSnackbar}
            autoHideDuration={3000}
            onClose={(e, reason) => {
              if (reason === "clickaway") return;
              setDownload((prevState) => ({
                ...prevState,
                openSnackbar: false,
              }));
            }}
          >
            <Alert severity={download.error ? "error" : "info"}>
              {download.message}
            </Alert>
          </Snackbar>
        )}
      </DialogContent>
    </Dialog>
  );
};
export default UploadGS;
