// import * as React from "react";

import Button from "@mui/material/Button";
// import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {  GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import StyledDataGrid from "../../styles/styledDataGrid";
const SystemRoleData = () => {
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

export default SystemRoleData;

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    align: "left",
    width: 150,
    sortable: false,
    renderCell: () => (
    // renderCell: ({ row }: Partial<GridRowParams>) => (
      <>
        {/* <Link
          // to={{
          //   pathname: "/systemrole/detail",
          //   state: [{ data: row }],
          // }}
        > */}
          <Button>
            <VisibilityIcon />
          </Button>
        {/* </Link> */}
        {/* <Link
          to={{
            pathname: "/systemrole/detail",
            state: [{ data: row }],
          }}
        > */}
          <Button>
            <DeleteIcon />
          </Button>
        {/* </Link> */}
      </>
    ),
  },
  {
    field: "systemRole",
    headerName: "System Role",
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
    width: 150,
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
    width: 150,
    headerAlign: "center",
  },
];

const rows = [
  {
    id: 1,
    systemRole: "Admin",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 2,
    systemRole: "Operation",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
];
