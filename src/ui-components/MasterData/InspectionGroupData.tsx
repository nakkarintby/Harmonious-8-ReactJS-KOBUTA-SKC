// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import {  GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import React from "react";
import moment from "moment";
import Swal from "sweetalert2";
import StyledDataGrid from "../../styles/styledDataGrid";
import { DeleteInspectionGroupApi, GetInspectionGroupApi } from "@api/axios/inspectionGroupAPI";



export default function InspectionGroupData(props : {
  createData : boolean,
}) {
  const {createData} = props;
  const [dataList , setDataList] = React.useState<InspectionGroupModel[]>([]);
  const [deleteData , setDeleteData] = React.useState<boolean>(false);
  React.useEffect(() => {
    const FetchMenu = async () => {
      GetInsGroupPage();
    };
    FetchMenu();
  }, [createData , deleteData]);


  async function GetInsGroupPage() {
    GetInspectionGroupApi().then(async (x) => {
      if (x.status == "success") {
        const insGroupData: InspectionGroupModel[] = x.data.map(
          (item: any) => ({
            id: item.inspectionGroupId,
            inspectionGroupName: item.name,
            modelGroup: item.modelGroupId,
            status: item.status,
            createdBy: item.createdBy,
            modifiedBy: item.modifiedBy,
            scheduledLineCode: item.scheduledLineCode,
            stationId: item.stationId,
            lineId: item.lineId,
            version: item.version,
            taktTime: item.taktTime,
            lineName: item.lineName,
            modelGroupName: item.modelGroupName,
            stationName: item.stationName,
            scheduledLineName: item.scheduledLineName,
            createdOn: moment(item.createdOn).format("DD-MM-YYYY HH:mm:ss"),
            modifiedOn:
              item.modifiedOn == null
                ? ""
                : moment(item.modifiedOn).format("DD-MM-YYYY HH:mm:ss"),
          })
        );
        setDataList(insGroupData);
      }
    });
  }
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
        <>
          <Link
            to="/masterData/inspectiongroups/inspectionitem"
            state={{ data: row }}
          >
            <Button     sx={{ minWidth: 0, padding: "4px" }} >
              <VisibilityIcon  fontSize="small"  />
            </Button>
          </Link>
          {row.status !== "Active" && (
            <Button     sx={{ minWidth: 0, padding: "4px" }}
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: `${row.inspectionGroupName}`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                }).then(async (result) => {
                  if (result.isConfirmed) {
                    await DeleteInspectionGroupApi(row.id).then(
                      async (rs: any) => {
                        if (rs.status === "success") {
                          await setDeleteData(deleteData ? false : true);
                        }
                      }
                    );
                  }
                });
              }}
            >
              <DeleteIcon  fontSize="small" />
            </Button>
          )}
        </>
      ),
    },
    {
      field: "inspectionGroupName",
      headerName: "Name",
      minWidth: 250,
      flex : 1,
      headerAlign: "center",
    },
    {
      field: "version",
      headerName: "Version",
      minWidth: 70,
      flex : 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "scheduledLineName",
      headerName: "Scheduled Line",
      minWidth: 150,
      flex : 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lineName",
      headerName: "Line",
      minWidth: 150,
      flex : 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stationName",
      headerName: "Station",
      minWidth: 150,
      flex : 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "modelGroupName",
      headerName: "Model Group",
      minWidth: 200,
      flex : 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "taktTime",
      headerName: "Takt Time",
      minWidth: 100,
      flex : 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "status",
      headerName: "Status",
      minWidth: 150,
      flex : 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdOn",
      headerName: "Created On",
      minWidth: 150,
      flex : 1,
      headerAlign: "center",
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 150,
      flex : 1,
      headerAlign: "center",
    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      minWidth: 200,
      flex : 1,
      headerAlign: "center",
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      minWidth: 200,
      flex : 1,
      headerAlign: "center",
    },
  ];

  return (
    <Box sx={{ height: "100%", width: "100%" }}>
      <StyledDataGrid
        rowHeight={40}
        rows={dataList}
        columns={columns}
        initialState={{
          pagination: {
            paginationModel: { page: 0, pageSize: 10 },
          },
        }}
        pageSizeOptions={[5, 10]}
      />
    </Box>
  )
}


