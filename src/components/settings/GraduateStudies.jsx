import React from "react";
import { Box, Button, Typography } from "@mui/material";
import { DataGrid } from "@mui/x-data-grid";
import { AdminSettingsServices } from "../../services/adminSettingsService";

const GraduateStudies = () => {
  const [rows, setRows] = React.useState([]);
  const [loading, setLoading] = React.useState(true);
  const columns = [
    { field: "id", headerName: "ID", width: 150 },
    { field: "subject_code", headerName: "SUBJECT CODE", width: 200 },
  ];

  const axiosGetGraduateStudies = async () => {
    const { data, status } = await AdminSettingsServices.getGraduateStudiesServices();
    if (status === 200) {
      setRows(data);
      setLoading(false);
    }
  };

  React.useEffect(() => {
    if (loading) {
      axiosGetGraduateStudies();
    }
  }, [loading]);

  return (
    <>
      <Box
        sx={{
          display: "flex",
          flexDirection: "column",
          gap: 3,
          bgcolor: "background.paper",
          padding: 2,
          height: "100%",
        }}
      >
        <Typography variant="h5" color="initial">
          MANAGE GRADUATE STUDIES
        </Typography>
        <Button 
          sx={{ 
            paddingLeft: 5, 
            paddingRight: 5, 
            color: "white", 
            alignItems: 
            "center" 
          }} 
          type="submit" 
          variant="contained"
        >
          Add New
        </Button>

          <DataGrid
            sx={{
              flexGrow: 1,
              height: "100%",
              width: "100%",
            }}
            loading={loading}
            rows={rows}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 5 },
              },
            }}
            pageSizeOptions={[25, 50]}
          />
      </Box>
    </>
  );
};

export default React.memo(GraduateStudies);