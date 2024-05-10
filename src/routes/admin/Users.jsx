import { DataGrid } from "@mui/x-data-grid";
import React, { useEffect } from "react";
import { IconButton, Tooltip, Typography, Box } from "@mui/material";
import { NoAccounts as NoAccountsIcon } from "@mui/icons-material";
import axios from "axios";
import { useLoaderData } from "react-router-dom";

const Users = () => {
  const { data } = useLoaderData();
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

  const rows = data;
  return (
    <>
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
    </>
  );
};

export const loader = async () => {
  const { data } = await axios.get(
    `${process.env.REACT_APP_API_URL}/admin/getEmails`
  );
  return { data };
};

export default Users;
