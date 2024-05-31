import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { IconButton, Tooltip, Typography, Box, Dialog, DialogTitle, DialogContent, FormControl, TextField, InputLabel, Select, DialogActions, MenuItem, ButtonGroup, Button, useMediaQuery, Grid } from "@mui/material";
import { Close, PersonAddAlt1 as PersonAddAlt1Icon, ModeEdit } from "@mui/icons-material";
import axios from "axios";
import { useNavigate, useLoaderData } from "react-router-dom";
import { useCookies } from "react-cookie";

const Users = () => {
  const [cookies, ,] = useCookies(['email']);
  const { data, status:dataStatus } = useLoaderData();
  const navigate = useNavigate();
  const [rows, setRows] = useState([]);
  const [accessLevelData, setAccessLevelData] = useState([]);
  const [noAccountData, setNoAccountData] = useState([]);
  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const initialCreateUserData = {
    facultyId: '',
    emailAddress: '',
    accessLevel: '',
  }
  const [createUserData, setCreateUserData] = useState(initialCreateUserData);
  const [openCreateUsersDialog, setOpenCreateUsersDialog] = useState(false);

  const initialUpdateAccountrData = {
    id: '',
    faculty_id: '',
    email: '',
    accessLevel: '',
    status: '',
  }
  const [targetCurrentStatusOfAccount, setTargetCurrentStatusOfAccount] = useState(0);
  const [updateAccountData, setUpdateAccountData] = useState(initialUpdateAccountrData);
  const [updateDataToCheck, setUpdateDataToCheck] = useState({});
  const [openEditAccountDialog, setOpenEditAccountDialog] = useState(false);

  const handleOpenCreateUsersDialog = () => {
    loadAccessLevels();
    loadNoAccounts();
    setTimeout(() => setOpenCreateUsersDialog(true), 1000)
  }
  const handleCloseCreateUsersDialog = () => setOpenCreateUsersDialog(!true);
  const handleChange = (e) => {
    // if(e.target.name === 'emailAddress' && e.target.name.split('@')[1] !== 'chmsu.edu.ph')
    setCreateUserData((prevState) => (
      {...prevState, [e.target.name]: e.target.value}
    ))
  }
  const handleCreateUser = async () => {
      const formData = new FormData();
      formData.append('emailAddress', createUserData.emailAddress)
      formData.append('facultyId', createUserData.facultyId)
      formData.append('accessLevel', createUserData.accessLevel)
      formData.append('emailUsed', cookies.email)
      const { data, status } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/createUser`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      alert(data.message)
      if (data.success === 1) {
        handleCloseCreateUsersDialog()
        setCreateUserData(initialCreateUserData)
        navigate(".", { replace: true })
      }
  }

  const handleOpenEditAccountDialog = async (id) => {
    const formData = new FormData();
    formData.append('id', id)
    const { data } = await axios.post(
      `${process.env.REACT_APP_API_URL}/admin/getAccountDetails`, 
      formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      }
    )
    const { data:accessLevels } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getAccessLevels`);
    setAccessLevelData(accessLevels);
    setUpdateAccountData(data);
    setUpdateDataToCheck(data);
    setTargetCurrentStatusOfAccount(data.status);
    loadNoAccounts();
    setOpenEditAccountDialog(true);
  }
  const handleCloseEditAccountDialog = () => setOpenEditAccountDialog(!true);
  const handleChangeUpdateAccount = (e) => {
    setUpdateAccountData((prevState) => (
      {...prevState, [e.target.name]: e.target.value}
    ))
  }
  const handleUpdateAccount = async () => {
    const confirmation = window.confirm(
      "Are you sure you want to update this account?"
    )
    if(!confirmation) return
    const formData = new FormData();
      formData.append('id', updateAccountData.id)
      formData.append('email', updateAccountData.email)
      formData.append('faculty_id', updateAccountData.faculty_id)
      formData.append('accessLevel', updateAccountData.accessLevel)
      formData.append('status', updateAccountData.status)
      formData.append('emailUsed', cookies.email)
      formData.append('dataToCheck', JSON.stringify(updateDataToCheck))


      const { data, status } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/updateAccount`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      alert(data.message)
      if (data.success) {
        navigate(".", { replace: true })
        handleCloseEditAccountDialog()
        setUpdateAccountData(initialUpdateAccountrData)
      }
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
      field: "accessLevel",
      headerName: "Access Level",
      flex: 2,
      minWidth: 68,
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
        const handleEditAccount = () => handleOpenEditAccountDialog(params.row.faculty_id)

        return (
          <ButtonGroup variant="text" color="primary" aria-label="">
            <Tooltip title="Edit Account">
              <IconButton
                aria-label="Edit"
                size="small"
                color="primary"
                onClick={handleEditAccount}
              >
                <ModeEdit />
              </IconButton>
            </Tooltip>
          </ButtonGroup>
            
        );
      },
    },
  ];

  const loadAccessLevels = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getAccessLevels`);
    setAccessLevelData(data);
  }

  const loadNoAccounts = async () => {
    const { data } = await axios.get(`${process.env.REACT_APP_API_URL}/admin/getAllNoAccounts`);
    setNoAccountData(data.rows);
  }

  useEffect(() => {
    if(dataStatus === 200){
      setRows(data) 
    }  
  }, [data, dataStatus])
  return (
    <>
        <Grid container spacing={0}>
          <Grid item>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Tooltip title="Create Account">  
                <Button
                  variant="text"
                  color="inherit"
                  startIcon={<PersonAddAlt1Icon />}
                  onClick={handleOpenCreateUsersDialog}
                >
                  Create Account
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

      {/* Modal for Creating Account in the System*/}
      <Dialog open={openCreateUsersDialog} onClose={handleCloseCreateUsersDialog} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
              Create Account
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
                  disabled={createUserData?.accessLevel === "Registrar" ? true : false}
                  fullWidth
                >
                  {noAccountData?.map((
                    {faculty_id, 
                      lastname, 
                      firstname,
                      middlename,
                      position,
                      specialization,
                    }, index) => (
                      // <MenuItem key={index} value={faculty_id}>{`${lastname}, ${firstname} ${middlename}, ${position}, ${specialization}`}</MenuItem>
                      <MenuItem key={index} value={faculty_id}>{`${faculty_id} - ${lastname}, ${firstname} ${middlename}`}</MenuItem>
                    ))}
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

      {/* Modal for Editing Account in the System*/}
      <Dialog open={openEditAccountDialog} onClose={handleCloseEditAccountDialog} aria-labelledby={"dialog-confirmation"}>
          <DialogTitle id={"dialog-confirmation-title"}>
              Edit Account
          </DialogTitle>
          <IconButton 
            aria-label="close" 
            onClick={handleCloseEditAccountDialog}
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
                  value={updateAccountData.email} 
                  name="email"
                  onChange={handleChangeUpdateAccount}  
                  required
                  fullWidth
                />
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="select-updateAccessLevel-label">Access Level</InputLabel>
                <Select
                  labelId="select-updateAccessLevel-label"
                  id="select-updateAccessLevel"
                  label="Access Level"
                  name="accessLevel"
                  value={updateAccountData.accessLevel}
                  onChange={handleChangeUpdateAccount}
                  required
                >
                  {accessLevelData.map((accessLevel) => (
                    <MenuItem key={accessLevel} defaultChecked={accessLevel === updateAccountData.accessLevel ? true : false} value={accessLevel}>{accessLevel}</MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl sx={{ display: 'flex', flexDirection: 'row' }}>
                <InputLabel id="select-updateFaculty-label">Faculty</InputLabel>
                <Select
                  labelId="select-updateFaculty-label"
                  id="select-updateFaculty"
                  label="Faculty"
                  name="faculty_id"
                  value={updateAccountData.faculty_id}
                  onChange={handleChangeUpdateAccount}
                  required
                  disabled={updateAccountData.accessLevel === "Registrar" ? true : false}
                  fullWidth
                >
                  {noAccountData?.map((
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
                  <InputLabel id="select-updateStatus-label">Status</InputLabel>
                  <Select
                    labelId="select-updateStatus-label"
                    id="select-updateStatus"
                    label="Status"
                    name="status"
                    value={updateAccountData.status}
                    onChange={handleChangeUpdateAccount}
                    required
                  >
                      <MenuItem value={1} defaultChecked={ updateAccountData.status === 1 ? true : false }>Activate{targetCurrentStatusOfAccount === 1 && `(current status)`}</MenuItem>
                      <MenuItem value={0} defaultChecked={ updateAccountData.status === 0 ? true : false }>Deactivate{targetCurrentStatusOfAccount === 0 && `(current status)`}</MenuItem>
                  </Select>
                </FormControl>
            </Box>
          </DialogContent>
          <DialogActions>
            <ButtonGroup variant="text" color="primary" aria-label="">
              <Button
                variant='standard'
                color="primary"
                onClick={handleUpdateAccount}
              >
                Update
              </Button>
              <Button
                onClick={handleCloseEditAccountDialog}
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
  const { data, status } = await axios.get(
    `${process.env.REACT_APP_API_URL}/admin/getAllEmails`
  );
  return { data, status };
};

export default Users;
