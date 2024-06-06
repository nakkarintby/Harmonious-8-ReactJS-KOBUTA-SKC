// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";

import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
const LineData = () => {
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

export default LineData;

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    sortable: false,
    width: 150,
    renderCell: ({ row }: Partial<GridRowParams>) => (
      <>
        <Link
          to={{
            pathname: "/masterData/line/station",
            state: [{ data: row }],
          }}
        >
          <Button>
            <VisibilityIcon />
          </Button>
        </Link>
        <Link
          to={{
            pathname: "/masterData/line/station",
            state: [{ data: row }],
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
    field: "name",
    headerName: "Name",
    width: 100,
    headerAlign: "center",
  },
  {
    field: "scheduleLine",
    headerName: "Schedule Line",
    width: 150,
    headerAlign: "center",
  },
  {
    field: "currentTaktTime",
    headerName: "Current Takt Time",
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
    line: 230401,
    name: "CH",
    scheduleLine: "400000 - TRACTOR",
    currentTaktTime: "150",
    createdBy: "HMS",
    createdOn: "2024-05-09T00:00:00",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 2,
    line: 230402,
    name: "TMC",
    scheduleLine: "400000 - TRACTOR",
    currentTaktTime: "150",
    createdBy: "HMS",
    createdOn: "2024-05-09T00:00:00",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 3,
    line: 233401,
    name: "MAM",
    scheduleLine: "400000 - TRACTOR",
    currentTaktTime: "150",
    createdBy: "HMS",
    createdOn: "2024-05-09T00:00:00",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 4,
    line: 236401,
    name: "MAR",
    scheduleLine: "400000 - TRACTOR",
    currentTaktTime: "150",
    createdBy: "HMS",
    createdOn: "2024-05-09T00:00:00",
    modifiedBy: "",
    modifiedOn: "",
  },
];
