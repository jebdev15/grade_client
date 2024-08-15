import { Close } from "@mui/icons-material";
import { Box, Dialog, DialogContent, DialogTitle, Divider, IconButton } from "@mui/material";
import { useEffect, useState } from "react";
import { getStudentYearSemesterAndSchoolYear } from "../../../../services/admin-students.services";
import NestedList from "./NestedList";

const StudentInitialData = ({ data }) => {
  return (
    <ul>
      <li>{data.id}</li>
      <li>{data.fullName}</li>
      <li>{data.programMajor}</li>
      <li>{data.status}</li>
    </ul>
  );
};
const ViewStudentData = ({ open, close, data }) => {
  const { id } = data;

  const [studentYearSemesterAndSchoolYears, setStudentYearSemesterAndSchoolYears] = useState([]);
  useEffect(() => {
    const axiosGetStudentYearSemesterAndSchoolYear = async () => {
      const { data, status } = await getStudentYearSemesterAndSchoolYear(id);
      if (status === 200 && data.length > 0) {
        setStudentYearSemesterAndSchoolYears(data);
      }
    };
    axiosGetStudentYearSemesterAndSchoolYear();
  }, [id]);
  return (
    <>
      <Dialog open={open} onClose={close} aria-labelledby={"dialog-view"} fullScreen>
        <DialogTitle id={"dialog-view-title"}>View Student</DialogTitle>
        <IconButton
          aria-label="close"
          onClick={close}
          sx={{
            position: "absolute",
            right: 8,
            top: 8,
          }}
        >
          <Close />
        </IconButton>
        <DialogContent dividers sx={{ padding: 0, margin: 0 }}>
          <Box
            sx={{
              margin: 0,
              padding: 0,
              height: "calc(100% - 41px)",
              width: "100%",
              display: "flex",
              columnGap: 2,
              lineHeight: 2,
            }}
          >
            <StudentInitialData data={data} />
            <Divider sx={{ height: "calc(100% + 41px)" }} orientation="vertical" flexItem />
            <NestedList data={studentYearSemesterAndSchoolYears} />
          </Box>
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ViewStudentData;
