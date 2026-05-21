import React, { useState } from "react";
import {
  Alert,
  Box,
  Container,
  Grid,
  IconButton,
  Typography,
} from "@mui/material";
import {
  useParams,
  useNavigate,
  useLoaderData,
  useNavigation,
  Outlet,
} from "react-router-dom";
import {
  Home,
} from "@mui/icons-material";
import { urlDecode } from "url-encode-base64";
import { HomeSemesterServices } from "../../services/homeSemesterService";
import LoadCard from "./LoadCard";

const Semester = () => {
  const { code } = useParams();
  const [semester, currentSchoolYear] = code.split("-");

  const navigate = useNavigate();
  const navigation = useNavigation();
  const { loads, dbTermType } = useLoaderData();

  const [manualOpen, setManualOpen] = useState(false);
  const [uploadOpen, setUploadOpen] = useState(false);
  const [printOpen, setPrintOpen] = useState(false);

  const decodedSemester = urlDecode(semester);
  const decodedSchoolYear = urlDecode(currentSchoolYear);
  const isLoading = navigation.state === "loading";
  // const extendedLoads = (loads || []).filter(
  //   (load) => !!load.is_deadline_extended
  // );
  // const extendedLabels = extendedLoads
  //   .map((load) => load.section)
  //   .filter(Boolean)
  //   .join(", ");
  if(isLoading) {
    return (
      <Box sx={{ mt: 2 }}>
        <Alert severity="info">
          Loading data. Please wait... 
        </Alert>
      </Box>
    )
  }
  return (
    <React.Suspense fallback={<div>loading...</div>}>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Box>
          <Typography variant="h4" fontWeight={700}>
            {` ${decodedSemester?.toUpperCase()} ${decodedSemester === "summer" ? "" : "SEMESTER"
              }`}{dbTermType === "midterm" ? "(Midterm)" : "(Endterm)"}
          </Typography>
          <Box sx={{ display: "flex", alignItems: "center" }}>
            <IconButton onClick={() => navigate("/home")}>
              <Home sx={{ fontSize: 20 }} />
            </IconButton>
            <span>/</span>
            <Typography variant="caption" fontSize={12} sx={{ mx: 1 }}>
              {decodedSemester === "summer" ? `${decodedSchoolYear}` : `${decodedSchoolYear} - ${parseInt(decodedSchoolYear) + 1}`}
            </Typography>
            <span>/</span>
            <Typography variant="caption" fontSize={12} sx={{ mx: 1 }}>
              {decodedSemester}
            </Typography>
          </Box>
        </Box>
      </Box>

      {/* {extendedLoads.length > 0 && (
        <Alert severity="info" sx={{ mt: 2 }}>
          {dbTo
            ? `Grade submission is open for ${dbTermType || "this term"} until ${new Date(
                dbTo
              ).toLocaleDateString()}.`
            : "Grade submission timeline is not available yet for this term."}
          {extendedLabels
            ? ` Extended class loads: ${extendedLabels}.`
            : " Extended class loads are available."}
        </Alert>
      )} */}

      <Box sx={{ mt: 2, overflowY: "auto" }}>
        <Box sx={{ p: 3, width: "100%" }}>
          <Outlet
            context={[
              manualOpen,
              setManualOpen,
              uploadOpen,
              setUploadOpen,
              printOpen,
              setPrintOpen,
            ]}
          />

          <Container maxWidth="xl" fixed>
            { loads ? (
                <Grid
                  className="semester-grid"
                  container
                  columnSpacing={3}
                  rowSpacing={5}
                >
                  {loads.map((load) => {
                    const classLoad = { ...load, currentSchoolYear, semester, dbTermType, setManualOpen, setUploadOpen }
                    return (
                      <Grid key={load.class_code} item xs={4} md={3}>
                        <LoadCard {...classLoad} />
                      </Grid>
                    )
                  })}
                  {loads.length === 0 ? (
                    <Typography sx={{ mt: 3 }} variant="h5">
                      No class load in record.
                    </Typography>
                  ) : null}
                </Grid>
              ) : (
                <Typography>Loading...</Typography>
              )
            }
          </Container>
        </Box>
      </Box>
    </React.Suspense>
  );
};

export const loader = async ({ params }) => {
  try {
    const { code } = params;

    const [semester, currentSchoolYear, faculty_id,] = code.split("-");
    const { data: loads } = await HomeSemesterServices.getSubjectLoadByFacultyIdYearAndSemester(faculty_id, currentSchoolYear, semester);

    const { data: registrarActivity } = await HomeSemesterServices.getRegistrarActivityBySemester(semester);
    const { schoolyear: dbSchoolYear, semester: dbSemester, to: dbTo, term_type: dbTermType } = registrarActivity || {};
    return { loads, dbSchoolYear, dbSemester, dbTo, dbTermType };
  } catch (error) {
    console.error("Error fetching data:", error);
    throw new Error(error);
  }
};
export default Semester;