import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import Box from "@mui/material/Box";
import StyledDataGrid from "../../styles/styledDataGrid";

export default function InspectionDataHeader(props: {
  data: InspectionDataModel[];
  pagination: PaginationModel;
}) {
  const { data, pagination } = props;

  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      headerAlign: "center",
      align: "left",
      minWidth: 100,
      flex: 0.5,
      sortable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <Link to="/inspectiondata/inspectiondatadetail" state={{ data: row }} >
          <Button sx={{ minWidth: 0, padding: "4px" }}>
            <VisibilityIcon fontSize="small" />
          </Button>
        </Link>
      ),
    },
    {
      field: "scheduledLineName",
      headerName: "Scheduled Line",
      minWidth: 250,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "lineName",
      headerName: "Line",
      minWidth: 70,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stationName",
      headerName: "Station",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inspectionGroupName",
      headerName: "Inspection Group",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "id_no",
      headerName: "ID No.",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "modelGroupName",
      headerName: "Model Group",
      minWidth: 200,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "modelName",
      headerName: "Model",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "pinCode",
      headerName: "Pin Code",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdOn",
      headerName: "Created On",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <StyledDataGrid
        rowHeight={40}
        rows={data}
        columns={columns}
        getRowId={(row) => row.inspectId}
        initialState={{
          pagination: {
            paginationModel: { page: pagination.pageNo, pageSize: pagination.pageSize  },
          },
        }}
      />
    </Box>
  );
}
