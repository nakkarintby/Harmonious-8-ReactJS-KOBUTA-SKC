// import * as React from "react";
// import { GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

const UDetailData = () => {
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
            paginationModel: { page: 0, pageSize: 5 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </Box>
  );
};

export default UDetailData;

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    sortable: false,
    width: 100,
    renderCell: () => (
      <>
        <Link
          to={{
            pathname: "/ldetail",
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
    field: "scheduleLine",
    headerName: "Schedule Line",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "line",
    headerName: "Line",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "station",
    headerName: "Station",
    width: 200,
    headerAlign: "center",
    align: "center",
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
    scheduleLine: "400000 - TRACTOR",
    line: "230401 CH",
    station: 1,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 2,
    scheduleLine: "400000 - TRACTOR",
    line: "230401 CH",
    station: 2,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 3,
    scheduleLine: "400000 - TRACTOR",
    line: "",
    station: "Rework",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
];
