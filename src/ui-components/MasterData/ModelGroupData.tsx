// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const ModelGroupData = () => {
  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <DataGrid
        sx={{
          boxShadow: 2,
          border: 2,
          borderColor: "primary.light",
          "& .MuiDataGrid-cell:hover": {
            color: "primary.main",
          },
        }}
        rows={rows}
        rowHeight={40}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </Box>
  );
};

export default ModelGroupData;

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    sortable: false,
    renderCell: ({ row }: Partial<GridRowParams>) => (
      <Link
        to={{
          pathname: "/modelgroups/detail",
          state: [{ data: row }],
        }}
      >
        <Button>
          <VisibilityIcon />
        </Button>
      </Link>
    ),
  },
  {
    field: "modelGroup",
    headerName: "Model Group",
    width: 200,
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
    width: 200,
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
    width: 200,
    headerAlign: "center",
  },
];

const rows = [
  {
    id: 1,
    modelGroup: "L5018DT",
    createdBy: "HMS",
    createdOn: "2024-05-09T00:00:00",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 2,
    modelGroup: "L4018DT",
    createdBy: "HMS",
    createdOn: "2024-05-09T00:00:00",
    modifiedBy: "",
    modifiedOn: "",
  },
];
