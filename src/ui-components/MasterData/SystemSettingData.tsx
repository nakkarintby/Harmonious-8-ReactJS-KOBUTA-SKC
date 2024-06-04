// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import EditIcon from "@mui/icons-material/Edit";
import Button from "@mui/material/Button";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import Swal from "sweetalert2";
import toastAlert from "../SweetAlert2/toastAlert";
import withReactContent from "sweetalert2-react-content";
import { Grid, TextField } from "@mui/material";
const MySwal = withReactContent(Swal);
export default function SystemSettingData() {
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
}

function EditModal(grp: string, code: string, text: string) {
  MySwal.fire({
    title: "Edit",
    text: "You won't be able to revert this!",
    icon: "warning",
    showCancelButton: false,
    confirmButtonText: "Yes, delete it!",
    showConfirmButton: false,
    cancelButtonText: "No, cancel!",
    reverseButtons: false,
    html: (
      <>
        <Grid container spacing={2} py={2}>
          <Grid item xs={12}>
            <TextField
              label="Grp"
              id="outlined-size-small"
              defaultValue={grp}
              size="small"
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Code"
              id="outlined-size-small"
              defaultValue={code}
              size="small"
              disabled
              fullWidth
            />
          </Grid>
          <Grid item xs={12}>
            <TextField
              label="Text"
              id="outlined-size-small"
              defaultValue={text}
              size="small"
              fullWidth
            />
          </Grid>
          <Grid item xs={6}>
            <Button variant="contained" color="error">
              Cancel
            </Button>
          </Grid>
          <Grid item xs={6}>
            <Button
              variant="contained"
              color="success"
              onClick={() => {
                toastAlert("success", "Your file has been deleted", 3000);
              }}
            >
              Save
            </Button>
          </Grid>
        </Grid>
      </>
    ),
  });
}

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    renderCell: ({ row }: Partial<GridRowParams>) => (
      <Button
        onClick={() => {
          EditModal("3000", "codexx", "xxxx");
        }}
      >
        <EditIcon />
      </Button>
    ),
  },
  {
    field: "Grp",
    headerName: "Group",
    width: 200,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Code",
    headerName: "Code",
    width: 200,
    headerAlign: "center",
  },
  {
    field: "Text",
    headerName: "Text",
    width: 200,
    headerAlign: "center",
  },
];

const rows = [
  {
    id: 1,
    Grp: "300000",
    Code: "SH",
    Text: "2024-05-09T00:00:00",
  },
  {
    id: 2,
    Grp: "400000",
    Code: "TRACTOR",
    Text: "2024-05-09T00:00:00",
  },
  {
    id: 3,
    Grp: "500000",
    Code: "COMBINE",
    Text: "2024-05-09T00:00:00",
  },
  {
    id: 4,
    Grp: "700000",
    Code: "Rotary",
    Text: "2024-05-09T00:00:00",
  },
  {
    id: 5,
    Grp: "800000",
    Code: "B TRACTOR",
    Text: "2024-05-09T00:00:00",
  },
  {
    id: 6,
    Grp: "990000",
    Code: "TTL Dozer",
    Text: "2024-05-09T00:00:00",
  },
  {
    id: 7,
    Grp: "990002",
    Code: "Line Cell",
    Text: "2024-05-09T00:00:00",
  },
  {
    id: 8,
    Grp: "990004",
    Code: "Line KIT-SET",
    Text: "2024-05-09T00:00:00",
  },
];
