import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { IconButton, Tooltip, Typography, Box, Dialog, DialogTitle, DialogContent, FormControl, TextField, InputLabel, Select, DialogActions, MenuItem, ButtonGroup, Button, useMediaQuery, Grid } from "@mui/material";
import { Close, NoAccounts as NoAccountsIcon, CloudDownload as CloudDownloadIcon, Schedule as ScheduleIcon, PersonAddAlt1 as PersonAddAlt1Icon } from "@mui/icons-material";
import axios from "axios";
import { useLoaderData } from "react-router-dom";

const Users = () => {
  const { data, accessLevels, noAccounts } = useLoaderData();
  const [rows, setRows] = useState([]);
  const [accessLevelData, setAccessLevelData] = useState([]);
  const [noAccountData, setNoAccountData] = useState([]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const initialCreateUserData = {
    facultyId: '',
    emailAddress: '',
    accessLevel: '',
    campus: '',
  }
  const [createUserData, setCreateUserData] = useState(initialCreateUserData);
  const [openCreateUsersDialog, setOpenCreateUsersDialog] = useState(false);

  const handleOpenCreateUsersDialog = () => setOpenCreateUsersDialog(true);
  const handleCloseCreateUsersDialog = () => setOpenCreateUsersDialog(!true);
  const handleChange = (e) => {
    // if(e.target.name === 'emailAddress' && e.target.name.split('@')[1] !== 'chmsu.edu.ph')
    setCreateUserData((prevState) => (
      {...prevState, [e.target.name]: e.target.value}
    ))
  }
  

  const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 68 },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 5,
      minWidth: 200,
      valueGetter: (value, row) =>
        `${value?.row?.firstName || ""} ${value?.row?.lastName || ""}`,
    },
    {
      field: "email",
      headerName: "Email Address",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 5,
      minWidth: 200,
    },
    {
      field: "status",
      headerName: "Status",
      flex: 2,
      minWidth: 68,
    },
    {
      field: "action",
      headerName: "Action",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      flex: 2,
      minWidth: 68,
      renderCell: (params) => {
        const handleClick = () => {
          console.log(params.row.faculty_id);

          // const { data } = axios.post(`${process.env.REACT_APP_API_URL}/`)
        };

        return (
          <Tooltip title="Disable User Account">
            <IconButton
              aria-label="view"
              size="small"
              color="primary"
              onClick={handleClick}
            >
              <NoAccountsIcon />
            </IconButton>
          </Tooltip>
        );
      },
    },
  ];

  const handleCreateUser = async () => {
    console.log(createUserData);
    const formData = new FormData();
      formData.append('emailAddress', createUserData.emailAddress)
      formData.append('facultyId', createUserData.facultyId)
      formData.append('accessLevel', createUserData.accessLevel)
      formData.append('campus', createUserData.campus)

      const { data, status } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/createUser`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      console.log(data);
      alert(data.message)
      if (data.success === 1) {
        handleCloseCreateUsersDialog()
        setCreateUserData(initialCreateUserData)
      }
  }
  
  useEffect(() => {
    setRows(data);
    setAccessLevelData(accessLevels);
    setNoAccountData(noAccounts);
  }, [data, accessLevels, noAccounts])
  return (
    <>
        <Grid container spacing={0}>
          <Grid item>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Tooltip title="Set Deadline for Grade Submission">  
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<PersonAddAlt1Icon />}
                  onClick={handleOpenCreateUsersDialog}
                >
                  Create User
                </Button>
              </Tooltip>
            </ButtonGroup>
          </Grid>
        </Grid>
      <Typography
        variant="h4"
        fontWeight={700}
        component="div"
        marginBottom={3}
        sx={{ flexGrow: 1 }}
      >
        LIST OF USERS
      </Typography>
      <Box
        borderRadius={"10px"}
        border={"1px solid var(--border-default)"}
        className="usersTable"
      >
        <DataGrid
          autoHeight={"true"}
          rowHeight={40}
          sx={{ borderRadius: "5px" }}
          rows={rows}
          columns={columns}
          initialState={{
            pagination: {
              paginationModel: { page: 0, pageSize: 5 },
            },
          }}
          pageSizeOptions={[5, 10]}
          // checkboxSelection
        />
      </Box>

      {/* Modal for Creating New User Account in the System*/}
      <Dialog open={openCreateUsersDialog} onClose={handleCloseCreateUsersDialog} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
              Create New User
          </DialogTitle>
          <IconButton 
            aria-label="close" 
            onClick={handleCloseCreateUsersDialog}
            sx={{
              position: 'absolute',
              right: 8,
              top: 8,
            }}
          >
            <Close />
          </IconButton>
          <DialogContent sx={isSmallScreen ? { width: '100%' } : { width: 500 }} dividers>
            <Box sx={{ display: 'flex', flexDirection: 'column', rowGap: 1 }}>
            <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                <TextField
                  label="CHMSU Email Address"
                  type='text'
                  value={createUserData.emailAddress} 
                  name="emailAddress"
                  onChange={handleChange}  
                  required
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-accessLevel-label">Access Level</InputLabel>
                <Select
                  labelId="select-accessLevel-label"
                  id="select-accessLevel"
                  label="Access Level"
                  name="accessLevel"
                  value={createUserData.accessLevel}
                  onChange={handleChange}
                  required
                >
                  {accessLevelData.map((accessLevel) => (
                    <MenuItem key={accessLevel} value={accessLevel}>{accessLevel}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }} fullWidth>
                <InputLabel id="select-faculty-label">Faculty</InputLabel>
                <Select
                  labelId="select-faculty-label"
                  id="select-faculty"
                  label="Faculty"
                  name="facultyId"
                  value={createUserData.facultyId}
                  onChange={handleChange}
                  required
                  disabled={createUserData.accessLevel === "Registrar" ? true : false}
                  fullWidth
                >
                  {noAccountData.map((
                    {faculty_id, 
                      lastname, 
                      firstname,
                      middlename,
                      position,
                      specialization,
                    }, index) => (
                      // <MenuItem key={index} value={faculty_id}>{`${lastname}, ${firstname} ${middlename}, ${position}, ${specialization}`}</MenuItem>
                      <MenuItem key={index} value={faculty_id}>{`${lastname}, ${firstname} ${middlename} - ${faculty_id}`}</MenuItem>
                    ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-campus-label">Campus</InputLabel>
                <Select
                  labelId="select-campus-label"
                  id="select-campus"
                  label="Campus"
                  name="campus"
                  value={createUserData.campus}
                  onChange={handleChange}
                  required
                >
                    <MenuItem value={"Talisay"} defaultChecked={true} >Talisay</MenuItem>
                    <MenuItem value={"Fortune Towne"}>Fortune Towne</MenuItem>
                    <MenuItem value={"Binalbagan"}>Binalbagan</MenuItem>
                    <MenuItem value={"Alijis"}>Alijis</MenuItem>
                </Select>
              </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Button
                variant='standard'
                color="primary"
                onClick={handleCreateUser}
              >
                Create
              </Button>
              <Button
                onClick={handleCloseCreateUsersDialog}
              >
                Cancel
              </Button>
            </ButtonGroup>
          </DialogActions>
        </Dialog>
    </>
  );
};

export const loader = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/admin/getEmails`
  );

  const {data:accessLevels} = await axios.get(
    `${process.env.REACT_APP_API_URL}/admin/getAccessLevels`
  );

  const {data:faculties} = await axios.get(
    `${process.env.REACT_APP_API_URL}/admin/getAllNoAccounts`
  );

  const {rows:noAccounts} = faculties;

  return { data, accessLevels, noAccounts };
};

export default Users;
