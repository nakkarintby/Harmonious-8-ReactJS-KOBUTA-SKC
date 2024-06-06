// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
const InspectionGroupData = () => {
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
        rowHeight={40}
        rows={rows}
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

export default InspectionGroupData;

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    align: "left",
    width: 150,
    sortable: false,
    renderCell: ({ row }: Partial<GridRowParams>) => (
      <>
        <Link
          to={{
            pathname: "/masterData/inspectiongroups/inspectionitem",
            state: [{ data: row }],
          }}
        >
          <Button>
            <VisibilityIcon />
          </Button>
        </Link>
        <Link
          to={{
            pathname: "/masterData/inspectiongroups/inspectionitem",
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
    field: "inspectionGroup",
    headerName: "Name",
    width: 250,
    headerAlign: "center",
  },
  {
    field: "version",
    headerName: "Version",
    width: 70,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "line",
    headerName: "Line",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "station",
    headerName: "Station",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "modelGroup",
    headerName: "Model Group",
    width: 150,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "taktTime",
    headerName: "Takt Time",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Status",
    headerName: "Status",
    width: 100,
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
    width: 200,
    headerAlign: "center",
  },
];

const rows = [
  {
    id: 1,
    inspectionGroup: "230401 CH - 1 - L5018DT - 150",
    version: 1,
    line: "230401 CH",
    station: 1,
    modelGroup: "L5018DT",
    taktTime: 150,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 2,
    inspectionGroup: "230401 CH - 2 - L5018DT - 150",
    version: 1,
    line: "230401 CH",
    station: 2,
    modelGroup: "L5018DT",
    taktTime: 150,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 3,
    inspectionGroup: "230401 CH - 3 - L5018DT - 150",
    version: 1,
    line: "230401 CH",
    station: 3,
    modelGroup: "L5018DT",
    taktTime: 150,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 4,
    inspectionGroup: "230401 CH - 1 - L5018DT - 240",
    version: 1,
    line: "230401 CH",
    station: 1,
    modelGroup: "L5018DT",
    taktTime: 240,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 5,
    inspectionGroup: "230401 CH - 2 - L5018DT - 240",
    version: 1,
    line: "230401 CH",
    station: 2,
    modelGroup: "L5018DT",
    taktTime: 240,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 6,
    inspectionGroup: "230402 TMC - 1 - L4018DT - 150",
    version: 1,
    line: "230402 TMC",
    station: 1,
    modelGroup: "L4018DT",
    taktTime: 150,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 7,
    inspectionGroup: "230402 TMC - 2 - L4018DT - 150",
    version: 1,
    line: "230402 TMC",
    station: 2,
    modelGroup: "L4018DT",
    taktTime: 150,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 8,
    inspectionGroup: "230402 TMC - 3 - L4018DT - 150",
    version: 1,
    line: "230402 TMC",
    station: 3,
    modelGroup: "L4018DT",
    taktTime: 150,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 9,
    inspectionGroup: "230402 TMC - 1 - L4018DT - 240",
    version: 1,
    line: "230402 TMC",
    station: 1,
    modelGroup: "L4018DT",
    taktTime: 240,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 10,
    inspectionGroup: "230402 TMC - 2 - L4018DT - 240",
    version: 1,
    line: "230402 TMC",
    station: 2,
    modelGroup: "L4018DT",
    taktTime: 240,
    Status: "Active",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
];
