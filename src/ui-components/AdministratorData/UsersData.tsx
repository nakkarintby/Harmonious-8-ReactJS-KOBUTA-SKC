// import * as React from "react";
// import { GridRowParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {  GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import StyledDataGrid from "../../styles/styledDataGrid";
const UsersData = () => {
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <StyledDataGrid
       
        rowHeight={40}
        rows={rows}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </Box>
  );
};

export default UsersData;

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    sortable: false,
    width: 150,
    renderCell: () => (
      <>
        <Link
          to={{
            pathname: "/users/detail",
            // state: [{ data: row }],
          }}
        >
          <Button>
            <VisibilityIcon />
          </Button>
        </Link>
        <Link
          to={{
            pathname: "/users/detail",
            // state: [{ data: row }],
          }}
        >
          <Button>
            <DeleteIcon />
          </Button>
        </Link>
      </>
    ),
  },
  {
    field: "empId",
    headerName: "Employee ID",
    width: 100,
    headerAlign: "center",
  },
  {
    field: "firstName",
    headerName: "First Name",
    width: 100,
    headerAlign: "center",
  },
  {
    field: "lastName",
    headerName: "Last Name",
    width: 150,
    headerAlign: "center",
  },
  {
    field: "role",
    headerName: "Role",
    width: 150,
    headerAlign: "center",
  },
  {
    field: "createdOn",
    headerName: "Created On",
    width: 200,
    headerAlign: "center",
  },
  {
    field: "createdBy",
    headerName: "Created By",
    width: 100,
    headerAlign: "center",
  },
  {
    field: "modifiedOn",
    headerName: "Modified On",
    width: 200,
    headerAlign: "center",
  },
  {
    field: "modifiedBy",
    headerName: "Modified By",
    width: 100,
    headerAlign: "center",
  },
];

const rows = [
  {
    id: 1,
    empId: 15271,
    firstName: "Supachai",
    lastName: "Samanjit",
    role: "Operation",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 2,
    empId: 16382,
    firstName: "Namthip",
    lastName: "Saikampha",
    role: "Operation",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 3,
    empId: 15546,
    firstName: "Kittitas",
    lastName: "Utama",
    role: "Admin",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
];
