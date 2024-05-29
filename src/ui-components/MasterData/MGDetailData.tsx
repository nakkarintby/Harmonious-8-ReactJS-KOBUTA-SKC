// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { Link } from "react-router-dom";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";

const MGDetailData = () => {
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

export default MGDetailData;

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    sortable: false,
    renderCell: ({ row }: Partial<GridRowParams>) => (
      <Link
        to={{
          pathname: "/mgdetail",
          state: [{ data: row }],
        }}
      >
        <Button>
          <DeleteIcon />
        </Button>
      </Link>
    ),
  },
  {
    field: "MODEL_CODE",
    headerName: "Model Code",
    width: 200,
    headerAlign: "center",
  },
  {
    field: "MODEL_NAME",
    headerName: "Model Name",
    width: 200,
    headerAlign: "center",
  },
];

const rows = [
  {
    id: 1,
    MODEL_CODE: "TC94415100",
    MODEL_NAME: "L5228-MM                      ",
  },
  {
    id: 2,
    MODEL_CODE: "TC94715300",
    MODEL_NAME: "L5228DT-VN-T                  ",
  },
  {
    id: 3,
    MODEL_CODE: "TC94815300",
    MODEL_NAME: "L5228-PH-T                    ",
  },
  {
    id: 4,
    MODEL_CODE: "TC94915100",
    MODEL_NAME: "L5228-ID                      ",
  },
];
