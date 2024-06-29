import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Checkbox } from "@mui/material";

const SRDetailData = () => {
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

export default SRDetailData;

const columns: GridColDef[] = [
  {
    field: "page",
    headerName: "Page",
    width: 400,
    headerAlign: "center",
  },

  {
    field: "canDisplay",
    headerName: "Display",
    renderCell: (params) => <Checkbox checked={params.row?.confirmed} />,
  },
  {
    field: "canCreate",
    headerName: "Create",
    renderCell: (params) => <Checkbox checked={params.row?.confirmed} />,
  },
  {
    field: "canUpdate",
    headerName: "Update",
    renderCell: (params) => <Checkbox checked={params.row?.confirmed} />,
  },
  {
    field: "canDelete",
    headerName: "Delete",
    renderCell: (params) => <Checkbox checked={params.row?.confirmed} />,
  },
];

const rows = [
  { id: 1, page: "Schedule Line" },
  { id: 2, page: "Model Group" },
  { id: 3, page: "Line" },
  { id: 4, page: "Inspection Group" },
  { id: 5, page: "Inspection Data" },
  { id: 6, page: "Users" },
  { id: 7, page: "System Role" },
  { id: 8, page: "System Setting" },
];
