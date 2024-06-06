// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import VisibilityIcon from "@mui/icons-material/Visibility";
const ScheduleLineData = () => {
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

export default ScheduleLineData;

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    sortable: false,
    renderCell: ({ row }: Partial<GridRowParams>) => (
      <Link
        to={{
          pathname: "/masterData/scheduleLine/model",
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
    field: "scheduleLineCode",
    headerName: "Schedule Line Code",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "scheduleLineName",
    headerName: "Schedule Line Name",
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
    field: "modifiedOn",
    headerName: "Modified On",
    width: 200,
    headerAlign: "center",
  },
];

const rows = [
  {
    id: 1,
    scheduleLineCode: "300000",
    scheduleLineName: "SH",
    createdOn: "2024-05-09T00:00:00",
    modifiedOn: "2024-05-09T00:00:00",
  },
  {
    id: 2,
    scheduleLineCode: "400000",
    scheduleLineName: "TRACTOR",
    createdOn: "2024-05-09T00:00:00",
    modifiedOn: "2024-05-09T00:00:00",
  },
  {
    id: 3,
    scheduleLineCode: "500000",
    scheduleLineName: "COMBINE",
    createdOn: "2024-05-09T00:00:00",
    modifiedOn: "2024-05-09T00:00:00",
  },
  {
    id: 4,
    scheduleLineCode: "700000",
    scheduleLineName: "Rotary",
    createdOn: "2024-05-09T00:00:00",
    modifiedOn: "2024-05-09T00:00:00",
  },
  {
    id: 5,
    scheduleLineCode: "800000",
    scheduleLineName: "B TRACTOR",
    createdOn: "2024-05-09T00:00:00",
    modifiedOn: "2024-05-09T00:00:00",
  },
  {
    id: 6,
    scheduleLineCode: "990000",
    scheduleLineName: "TTL Dozer",
    createdOn: "2024-05-09T00:00:00",
    modifiedOn: "2024-05-09T00:00:00",
  },
  {
    id: 7,
    scheduleLineCode: "990002",
    scheduleLineName: "Line Cell",
    createdOn: "2024-05-09T00:00:00",
    modifiedOn: "2024-05-09T00:00:00",
  },
  {
    id: 8,
    scheduleLineCode: "990004",
    scheduleLineName: "Line KIT-SET",
    createdOn: "2024-05-09T00:00:00",
    modifiedOn: "2024-05-09T00:00:00",
  },
];
