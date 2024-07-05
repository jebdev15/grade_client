import { Close, Done, CloudUpload as CloudUploadIcon } from "@mui/icons-material";
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
import axios from "axios";
import React, { useState } from "react";
import { useOutletContext, useLoaderData, useParams } from "react-router-dom";
import { useCookies } from "react-cookie";
// import { FileUploader } from "react-drag-drop-files";
import { saveAs } from "file-saver";
import { urlDecode } from "url-encode-base64";

const Upload = () => {
  const { code, class_code } = useParams();
  const [semester, currentSchoolYear] = code?.split("-");
  const [cookies,,] = useCookies(["name", "email"]);
  const { loadInfoArr } = useLoaderData();
  const loadInfo = loadInfoArr[0];

  const [...contexts] = useOutletContext();
  const uploadOpen = contexts[2];
  const setUploadOpen = contexts[3];

  const [uploadFile, setUploadFile] = useState(null);
  const [uploading, setUploading] = useState(false);
  const [openSnackbar, setOpenSnackbar] = useState(false);
  const [errorUpload, setErrorUpload] = useState(false);

  const [downloadStatus, setDownloadStatus] = useState(false)
  const download = async () => {
    setDownloadStatus(true);
    const { data, status } = await axios.get(
      `${process.env.REACT_APP_API_URL}/getExcelFile?semester=${semester}&currentSchoolYear=${currentSchoolYear}&class_code=${class_code}&name=${cookies.name.toUpperCase()}&classSection=${loadInfo.section}`,
      {
        responseType: "arraybuffer",
      }
    );
    if(status === 200) {
      let blob = new Blob([data], {
        type: "vnd.openxmlformats-officedocument.spreadsheetml.sheet;charset=utf-8",
      });
      saveAs(
        blob,
        `${loadInfo.subject_code}-${loadInfo.section}-${urlDecode(class_code)}.xlsx`
      )
      setTimeout(() => {
        setDownloadStatus(!true);
      }, 1000)
    } else {
      setDownloadStatus('Error');
    }
  };

  const handleChangeFile = (e) => {
    setUploadFile(e.target.files[0]);
  }
  const upload = async () => {
    setUploading(true);
    const formData = new FormData();
    formData.append("uploadFile", uploadFile);
    formData.append("class_code", class_code);
    formData.append("method", "Upload");
    formData.append("email_used", cookies.email);
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/uploadGradeSheet`,
      formData,
      {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      }
    );
    const { isOkay, isError } = data
    if (isOkay) {
      
      setUploading(false);
      setOpenSnackbar(true);
      setUploadFile(null);
      setTimeout(() => setUploadOpen(false),3500)
      setErrorUpload(isError ? true : !true);
    }
  };
  return (
    <Dialog
      open={uploadOpen}
      onClose={(e, reason) => {
        if (reason !== "backdropClick") {
          setUploadFile(null);
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
              setUploadFile(null);
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
              <Button variant="contained" onClick={download} disabled={downloadStatus || uploading ? true : false}>
                {/* Download Grade Sheet */}
                {downloadStatus ? "Downloading..." : "Download Grade Sheet"}
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
                    {/* <Typography variant="caption">
                      (Click or drop file to re-upload)
                    </Typography> */}
                  </Box>
                ) : (                  
                <Button
                  component="label"
                  role={undefined}
                  variant=""
                  tabIndex={-1}
                  startIcon={<CloudUploadIcon />}
                  
                >
                  {/* <VisuallyHiddenInput name="file" allowed="xlsx" type="file" /> */}
                  <input hidden type="file" onChange={handleChangeFile} name="file" allowed="xlsx"/>
                  <Typography variant="body1" color="initial">Click to Upload a file</Typography>
                </Button>
                  )}
              </Box>
              {/* <FileUploader
                handleChange={(file) => setUploadFile(file)}
                name="file"
                disabled={!canUpload || uploading }
                types={["xlsx"]}
                children={
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
                  >
                    {uploadFile ? (
                      <Box sx={{ textAlign: "center" }}>
                        <Done color="primary" fontSize="large" />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                          File Inserted!
                        </Typography>
                        <Typography>{uploadFile.name}</Typography>
                        <Typography variant="caption">
                          (Click or drop file to re-upload)
                        </Typography>
                      </Box>
                    ) : (
                      <Box sx={{ textAlign: "center" }}>
                        <UploadFile color="primary" fontSize="large" />
                        <Typography variant="h6" sx={{ mt: 2 }}>
                          Click to upload a file
                        </Typography>
                      </Box>
                    )}
                  </Box>
                }
              /> */}
            </Box>
            <Button
              variant="contained"
              fullWidth
              disabled={uploading}
              onClick={upload}
              sx={{ display: uploadFile ? "flex" : "none", mt: 1 }}
            >
              {uploading ? "Uploading..." : "Submit"}
            </Button>
          </Box>
        </Box>
        <Snackbar
          open={openSnackbar}
          autoHideDuration={3000}
          onClose={(e, reason) => {
            if (reason === "clickaway") return;

            setOpenSnackbar(false);
          }}
        >
          {
            errorUpload 
            ? <Alert severity="error">Sorry, the file you uploaded either didn't upload correctly or does not match the subject.</Alert>
            : <Alert severity="info">Uploaded Successfully</Alert>
          }
        </Snackbar>
      </DialogContent>
    </Dialog>
  );
};
export const loader = async ({ params }) => {
  const { code, class_code } = params;
  const [semester, currentSchoolYear, faculty_id] = code.split("-");
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/getLoad?faculty_id=${faculty_id}&school_year=${currentSchoolYear}&semester=${semester}&class_code=${class_code}`
  );
  const loadInfoArr = data;
  return { loadInfoArr };
};
export default Upload;
