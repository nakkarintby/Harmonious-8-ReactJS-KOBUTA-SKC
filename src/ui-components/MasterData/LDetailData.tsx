// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Box from "@mui/material/Box";

const LDetailData = () => {
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

export default LDetailData;

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
            pathname: "/ldetail",
            state: [{ data: row }],
          }}
        >
          <Button>
            <EditIcon />
          </Button>
        </Link>
        <Link
          to={{
            pathname: "/ldetail",
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
    field: "station",
    headerName: "Station",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "stationType",
    headerName: "Station Type",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "sequence",
    headerName: "Sequence",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "firstStation",
    headerName: "First Station",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "refMFG",
    headerName: "ref. MFG",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "refStation",
    headerName: "ref. Station",
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
    station: 1,
    stationType: "Auto Station",
    sequence: 1,
    firstStation: true,
    refMFG: "230401",
    refStation: "",
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 2,
    station: 2,
    stationType: "Auto Station",
    sequence: 2,
    firstStation: "",
    refMFG: "",
    refStation: 1,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 3,
    station: 3,
    stationType: "Auto Station",
    sequence: 3,
    firstStation: "",
    refMFG: "",
    refStation: 1,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
];
