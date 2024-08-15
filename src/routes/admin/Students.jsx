import { DataGrid } from "@mui/x-data-grid";
import React, { useState } from "react";
import { Box, IconButton, Typography, Tooltip, ButtonGroup, TextField } from "@mui/material";
import { PersonSearch, Visibility as VisibilityIcon } from "@mui/icons-material";
import ViewStudentData from "../../components/dialogs/admin/students/View";
import { getStudentsBySearch } from "../../services/admin-students.services";
import { useCookies } from "react-cookie";

const Students = () => {
  const [cookies] = useCookies(["college_code", "accessLevel"]);
  const [studentData, setStudentData] = useState({
    data: {
      id: null,
      fullName: "",
      programMajor: "",
      status: "",
    },
    open: false,
    close: () => setStudentData({ ...studentData, open: false }),
  });
  const columns = [
    { field: "id", headerName: "Student ID", hideable: false, width: 150 },
    {
      field: "fullName",
      headerName: "Full name",
      hideable: false,
      width: 460,
    },
    {
      field: "programMajor",
      headerName: "Program",
      description: "This column has a value getter and is not sortable.",
      hideable: false,
      sortable: false,
      width: 200,
    },
    {
      field: "status",
      headerName: "Status",
      description: "This column has a value getter and is not sortable.",
      width: 200,
    },
    {
      field: "action",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      hideable: false,
      sortable: false,
      disableColumnMenu: true,
      width: 100,
      renderCell: (params) => {
        const onClick = (e) => {
          setStudentData((prevState) => ({
            ...prevState,
            data: params.row,
            open: true,
          }));
        };
        return (
          <>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Tooltip title="View">
                <IconButton name="subjectLoad" aria-label="view" variant="text" color="primary" onClick={onClick}>
                  <VisibilityIcon />
                </IconButton>
              </Tooltip>
            </ButtonGroup>
          </>
        );
      },
    },
  ];

  const [searchResultData, setSearchResultData] = useState();
  const [searchParam, setSearchParam] = useState("");
  const searchStudentHandler = async (e) => {
    e.preventDefault();
    const { data, status } = await getStudentsBySearch(searchParam, cookies);
    if (status === 200) {
      setSearchResultData(data);
    }
  };
  const onChangeSearchParam = (e) => {
    setSearchParam(e.target.value);
  };
  return (
    <>
      <Box sx={{ height: 600, width: "100%" }}>
        <Box component="form" onSubmit={searchStudentHandler} sx={{ marginBottom: 2, display: "flex", justifyContent: "center" }}>
          <TextField
            sx={{
              width: "100%",
              backgroundColor: "#ffffff",
            }}
            className="bg-primary"
            name="searchParam"
            label="Search Student ID/Last Name/First Name/Middle Name"
            variant="outlined"
            value={searchParam}
            onChange={onChangeSearchParam}
            InputProps={{
              endAdornment: (
                <IconButton aria-label="search" type="submit">
                  <PersonSearch />
                </IconButton>
              ),
            }}
            required
          />

          {/* <Button type='submit'>Search</Button> */}
        </Box>

        {searchResultData ? (
          searchResultData.length > 0 ? (
            <>
              <Typography variant="h4" fontWeight={700} component="div" marginBottom={3} marginTop={3} sx={{ flexGrow: 1 }}>
                LIST OF STUDENTS
              </Typography>
              <Box borderRadius={"10px"} border={"1px solid var(--border-default)"} className="usersTable" height={600}>
                <DataGrid
                  rows={searchResultData}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  pageSizeOptions={[5, 10, 25]}
                />
              </Box>
            </>
          ) : (
            <Typography variant="body1" color="initial" textAlign={"center"}>
              No Result
            </Typography>
          )
        ) : (
          <Typography variant="body1" color="initial" textAlign={"center"}>
            List of Student Will Appear here...
          </Typography>
        )}
      </Box>
      {studentData.data.id !== null && <ViewStudentData {...studentData} />}
    </>
  );
};
export default Students;
