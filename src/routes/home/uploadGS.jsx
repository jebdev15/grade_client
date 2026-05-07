import React from "react";
import { Close, Done, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  Dialog,
  DialogContent,
  DialogTitle,
  IconButton,
  Paper,
  Typography,
} from "@mui/material";
import { useOutletContext, useLoaderData, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
import { saveAs } from "file-saver";
import { urlDecode } from "url-encode-base64";
import { HomeSemesterServices } from "@services/homeSemesterService";
import { useUploadFeatureState } from "@hooks/useFeatureState";
import axiosInstance from "api/axiosInstance";
import GPSnackbar from "@components/GPSnackbar";

const UploadGS = () => {
  const { code, class_code } = useParams();
  const [semester, currentSchoolYear] = code?.split("-");
  const [cookies, ,] = useCookies(["name", "email"]);
  const { loadInfoArr, dbTermType } = useLoaderData();
  const loadInfo = loadInfoArr[0];

  const [...contexts] = useOutletContext();
  const uploadOpen = contexts[2];
  const setUploadOpen = contexts[3];
  const canUpload = (loadInfo.canUpload || loadInfo.is_deadline_extended) && !(loadInfo.classLoadStatus);

  const [download, setDownload] = useUploadFeatureState();
  const [upload, setUpload] = useUploadFeatureState();

  const downloadExcel = async () => {
    setDownload((prev) => ({ ...prev, loading: true }))
    try {
      const { data } = await axiosInstance.get(
        `/getGSExcelFile?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}&name=${cookies.name.toUpperCase()}&classSection=${loadInfo.section
        }`,
        {
          responseType: "arraybuffer",
        }
      );
      let blob = new Blob([data], {
        type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      });
      saveAs(
        blob,
        `${loadInfo.subject_code}-${loadInfo.section}-${urlDecode(class_code)}.xlsx`
      )
      setDownload((prev) => ({
        ...prev,
        message: "Downloaded Successfully",
      }))
    } catch (error) {
      setDownload((prev) => ({
        ...prev,
        error: true,
        message: error.response.data.message || "There was an error downloading the file."
      }))
    } finally {
      setDownload((prev) => ({
        ...prev,
        openSnackbar: true,
        loading: false,
      }))
    }
  };

  const handleChangeFile = (e) => setUpload((prev) => ({ ...prev, file: e.target.files[0] }));

  const uploadExcel = async () => {
    setUpload((prev) => ({
      ...prev,
      loading: true,
    }));
    setDownload((prev) => ({
      ...prev,
      loading: true,
    }));
    try {
      const formData = new FormData();
      formData.append("uploadFile", upload.file);
      formData.append("class_code", class_code);
      formData.append("method", "Upload");
      formData.append("email_used", cookies.email);
      formData.append("term_type", dbTermType);
      const { data } = await axiosInstance.post(
        "/student-grades/upload-grade-sheet/graduate-studies",
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      setUpload((prev) => ({
        ...prev,
        message: data.message,
      }));
      setTimeout(() => setUploadOpen(), 3500);
    } catch (error) {
      setUpload((prev) => ({
        ...prev,
        message: error.response.data.message || "There was an error uploading the file.",
        error: true,
      }));
    } finally {
      setUpload((prev) => ({
        ...prev,
        openSnackbar: true,
        loading: false,
        file: null,
      }));
      setDownload((prev) => ({
        ...prev,
        loading: false,
      }));
    }
  };
  return (
    <Dialog
      open={uploadOpen}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          setUpload((prev) => ({ ...prev, file: null }));
          setUploadOpen(false);
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
          Upload Grade Sheet
          <IconButton
            onClick={() => {
              setUpload((prev) => ({ ...prev, file: null }));
              setUploadOpen(false);
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
                <Typography>{`Class Code: ${loadInfo.class_code}`}</Typography>
                <Typography>{`Subject Code: ${loadInfo.subject_code}`}</Typography>
                <Typography>{`Faculty: ${cookies.name}`}</Typography>
                <Typography>{`Section: ${loadInfo.section}`}</Typography>
                <Typography>{`Total Students: ${loadInfo.noStudents}`}</Typography>
              </Box>
              <Button variant="contained" onClick={downloadExcel} disabled={download.loading || upload.loading ? true : false}>
                {/* Download Grade Sheet */}
                {download.loading ? "Downloading..." : "Download Grade Sheet"}
              </Button>
            </Paper>
          </Box>
          {canUpload
            ? (
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
                      // p: 2,
                      height: "100%",
                      display: "flex",
                      justifyContent: "center",
                      alignItems: "center",
                      cursor: "pointer",
                      flexDirection: "column",
                    }}
                    disabled={upload.loading}
                  >
                    {upload.file ? (
                      <Box sx={{ textAlign: "center" }}>
                        <Done color="primary" fontSize="large" />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                          File Inserted!
                        </Typography>
                        <Typography>{upload.file.name}</Typography>
                      </Box>
                    ) : (
                      <Button
                        component="label"
                        role={undefined}
                        variant=""
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        sx={{ display: "flex", alignItems: "center", height: "100%", width: "100%" }}
                      >
                        <input hidden type="file" onChange={handleChangeFile} name="file" allowed="xlsx" />
                        <Typography variant="body1" color="initial">Click to Upload a file</Typography>
                      </Button>
                    )}
                  </Box>
                </Box>
                <Button
                  variant="contained"
                  fullWidth
                  disabled={upload.loading}
                  onClick={uploadExcel}
                  sx={{ display: upload.file ? "flex" : "none", mt: 1 }}
                >
                  {upload.loading ? "Uploading..." : "Upload"}
                </Button>
              </Box>)
            : (
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  justifyContent: "center",
                  alignItems: "center",
                  flex: 1,
                  m: 2,
                }}
              >
              </Box>
            )
          }
        </Box>
        <GPSnackbar
          open={download.openSnackbar}
          onClose={() => setDownload((prev) => ({ ...prev, openSnackbar: false }))}
          error={download.error}
          message={download.message}
        />
        <GPSnackbar
          open={upload.openSnackbar}
          onClose={() => setUpload((prev) => ({ ...prev, openSnackbar: false }))}
          error={upload.error}
          message={upload.message}
        />
      </DialogContent>
    </Dialog>
  );
};
export const loader = async ({ params }) => {
  const { code, class_code } = params;
  const [semester, currentSchoolYear, faculty_id] = code.split("-");
  const { facultyLoadData: loadInfoArr } = await HomeSemesterServices.getFacultyLoadByFacultyIdYearSemesterAndClassCode(
    faculty_id,
    currentSchoolYear,
    semester,
    class_code
  )
  const { data: registrarActivityData } = await HomeSemesterServices.getRegistrarActivityBySemester(semester);
  const { term_type: dbTermType } = registrarActivityData;
  return { loadInfoArr, dbTermType };
};
export default UploadGS;
