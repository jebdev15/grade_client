import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect, useState } from "react";
import { IconButton, Tooltip, Typography, Box, Dialog, DialogTitle, DialogContent, FormControl, TextField, InputLabel, Select, DialogActions, MenuItem, ButtonGroup, Button, useMediaQuery, Grid } from "@mui/material";
import { Close, PersonAddAlt1 as PersonAddAlt1Icon, ModeEdit } from "@mui/icons-material";
import axios from "axios";
import { useCookies } from "react-cookie";
import { useDispatch, useSelector } from "react-redux";
import { fetchUsers } from "../../features/admin/users/usersThunks";
import { fetchAccessLevels } from "../../features/admin/users/accessLevelsThunks";
import { fetchColleges } from "../../features/admin/users/collegesThunks";
import { fetchNoAccounts } from "../../features/admin/users/noAccountsThunks";

const Users = () => {
  const [cookies, ,] = useCookies(['email', 'accessLevel']);

  const users = useSelector(state => state.users.list);
  const usersStatus = useSelector((state) => state.users.status);

  const accessLevelData = useSelector((state) => state.accessLevels.list);
  const accessLevelStatus = useSelector((state) => state.accessLevels.status);
  
  const collegeCodes = useSelector((state) => state.colleges.list);
  const collegeStatus = useSelector((state) => state.colleges.status);

  const noAccountData = useSelector((state) => state.noAccounts.list);
  const noAccountStatus = useSelector((state) => state.noAccounts.status);

  const dispatch = useDispatch();

  const isSmallScreen = useMediaQuery((theme) => theme.breakpoints.down('sm'));
  const initialCreateUserData = {
    facultyId: '',
    emailAddress: '',
    college_code: '',
    accessLevel: '',
  }
  const [createUserData, setCreateUserData] = useState(initialCreateUserData);
  const [openCreateUsersDialog, setOpenCreateUsersDialog] = useState(false);

  const initialUpdateAccountData = {
    id: '',
    faculty_id: '',
    email: '',
    college_code: '',
    accessLevel: '',
    status: '',
  }
  const [targetCurrentStatusOfAccount, setTargetCurrentStatusOfAccount] = useState(0);
  const [updateAccountData, setUpdateAccountData] = useState(initialUpdateAccountData);
  const [updateDataToCheck, setUpdateDataToCheck] = useState({});
  const [openEditAccountDialog, setOpenEditAccountDialog] = useState(false);

  const handleOpenCreateUsersDialog = () => setOpenCreateUsersDialog(true)
  const handleCloseCreateUsersDialog = () => setOpenCreateUsersDialog(!true);
  const handleChange = (e) => {
    setCreateUserData((prevState) => (
      {...prevState, [e.target.name]: e.target.value}
    ))
  }
  const handleCreateUser = async () => {
      const formData = new FormData();
      formData.append('emailAddress', createUserData.emailAddress)
      formData.append('college_code', createUserData.college_code)
      formData.append('facultyId', createUserData.facultyId)
      formData.append('accessLevel', createUserData.accessLevel)
      formData.append('emailUsed', cookies.email)
      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/createUser`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      alert(data.message)
      if (data.success === 1) {
        dispatch(fetchUsers(cookies))
        handleCloseCreateUsersDialog()
        setCreateUserData(initialCreateUserData)
      }
  }

  const handleOpenEditAccountDialog = async (params) => {
    const toEditRowData = params.row;
    const findStatus = toEditRowData.status === 'Active' ? 1 : 0;
    const updatedToEditRowData = {...toEditRowData, status: findStatus};
    console.log(updatedToEditRowData);
    setUpdateAccountData(updatedToEditRowData);
    setUpdateDataToCheck(updatedToEditRowData);
    setTargetCurrentStatusOfAccount(findStatus);
    // loadNoAccounts();
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
      formData.append('college_code', updateAccountData.college_code)
      formData.append('faculty_id', updateAccountData.faculty_id)
      formData.append('accessLevel', updateAccountData.accessLevel)
      formData.append('status', updateAccountData.status)
      formData.append('emailUsed', cookies.email)
      formData.append('dataToCheck', JSON.stringify(updateDataToCheck))


      const { data } = await axios.post(`${process.env.REACT_APP_API_URL}/admin/updateAccount`, formData, {
        headers: {
          'Content-Type': 'application/json'
        }
      })
      alert(data.message)
      if (data.success) {
        dispatch(fetchUsers(cookies))
        handleCloseEditAccountDialog()
        setUpdateAccountData(initialUpdateAccountData)
      }
  }

  const columns = [
    { field: "id", headerName: "ID", flex: 1, minWidth: 68, hide: true },
    {
      field: "fullName",
      headerName: "Full name",
      description: "This column has a value getter and is not sortable.",
      sortable: true,
      flex: 5,
      minWidth: 200,
      valueGetter: (value, row) => 
       ['Administrator', 'Registrar', 'Dean', 'Chairperson'].includes(value?.row?.accessLevel) ? value?.row?.accessLevel || "" : `${value?.row?.lastName || ""}, ${value?.row?.firstName || ""}`,
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
      field: "college_code",
      headerName: "College",
      description: "This column has a value getter and is not sortable.",
      sortable: false,
      minWidth: 100,
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
        const handleEditAccount = () => handleOpenEditAccountDialog(params)
        return(
          <>
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
          </>
        )
      },
    },
  ];
  useEffect(() => {
    if (noAccountStatus === 'idle') {
        dispatch(fetchNoAccounts());
    }
    if(['idle','succeeded'].includes(noAccountStatus)) {
        setLoading(false);
    }
  }, [noAccountStatus, dispatch]);

  useEffect(() => {
      if (collegeStatus === 'idle') {
          dispatch(fetchColleges(collegeStatus));
      }
      if(['idle','succeeded'].includes(collegeStatus)) {
          setLoading(false);
      }
  }, [collegeStatus, dispatch]);

  useEffect(() => {
      if (usersStatus === 'idle') {
          dispatch(fetchUsers(cookies));
      }
      if(['idle','succeeded'].includes(usersStatus)) {
          setLoading(false);
      }
  }, [usersStatus, dispatch, cookies]);

  useEffect(() => {
    if (accessLevelStatus === 'idle') {
        dispatch(fetchAccessLevels(cookies));
    }
    if(['idle','succeeded'].includes(accessLevelStatus)) {
        setLoading(false);
    }
  }, [accessLevelStatus, dispatch, cookies]);
  const [loading, setLoading] = useState(true);
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
        height={600}
      >
        <DataGrid
          sx={{ borderRadius: "5px" }}
          rows={users}
          columns={columns}
          loading={loading}
          // initialState={{
          //   pagination: {
          //     paginationModel: { page: 0, pageSize: 5 },
          //   },
          // }}
          pageSizeOptions={[5, 10, 25]}
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
              <FormControl fullWidth>
                <InputLabel id="select-accessLevel-college">College</InputLabel>
                <Select
                  labelId="select-accessLevel-college"
                  id="select-college"
                  label="College"
                  name="college_code"
                  value={createUserData.college_code}
                  onChange={handleChange}
                  disabled={["Administrator", "Registrar"].includes(createUserData?.accessLevel) ? true : false}
                  required
                >
                  {collegeCodes.map(({college_code}) => (
                    <MenuItem key={college_code} value={college_code}>{college_code}</MenuItem>
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
                  disabled={["Administrator", "Registrar", "Dean", "Chairperson"].includes(createUserData?.accessLevel) ? true : false}
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
              <FormControl fullWidth>
                <InputLabel id="select-updateCollege-label">College</InputLabel>
                <Select
                  labelId="select-updateCollege-label"
                  id="select-updateCollege"
                  label="College"
                  name="college_code"
                  value={updateAccountData.college_code}
                  onChange={handleChangeUpdateAccount}
                  disabled={["Administrator", "Registrar"].includes(updateAccountData.accessLevel) ? true : false}
                  required
                >
                  {collegeCodes.map(({college_code}) => (
                    <MenuItem key={college_code} defaultChecked={college_code === updateAccountData.college_code ? true : false} value={college_code}>{college_code}</MenuItem>
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
                  disabled={["Administrator", "Registrar", "Dean", "Chairperson"].includes(updateAccountData.accessLevel) ? true : false}
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
                      <MenuItem value={1} defaultChecked={ updateAccountData.status === 1 ? true : false }>ACTIVE{targetCurrentStatusOfAccount === 1 && `(current status)`}</MenuItem>
                      <MenuItem value={0} defaultChecked={ updateAccountData.status === 0 ? true : false }>INACTIVE{targetCurrentStatusOfAccount === 0 && `(current status)`}</MenuItem>
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

export default Users;
