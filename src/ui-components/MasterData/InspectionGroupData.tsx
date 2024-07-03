// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import React from "react";
import instanceAxios from "../../api/axios/instanceAxios";
import moment from "moment";
import toastAlert from "../SweetAlert2/toastAlert";
import Swal from "sweetalert2";

interface InspectionGroupModel{
  inspectionGroupName: string,
  id: number,
  modelGroup: string,
  Status: string,
  createdBy: string,
  modifiedBy: string,
  scheduledLineCode : string,
  scheduledLineName : string,
  modelGroupName : string , 
  stationId : number , 
  stationName : string,
  lineId: number,
  lineName : string,
  version: number,
  taktTime: string,
  createdOn: string,
  modifiedOn: string,
}

async function GetInspectionGroupApi(){
  let dataApi:any ;
  try {
    await instanceAxios
      .get(`/InspectionGroup/GetInspectionGroup?page=1&perpage=1000`)
      .then(async function (response: any) {
        dataApi = response.data
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (err : any) {
    toastAlert("error", err, 5000);
  }
  return dataApi;
}

async function DeleteInspectionGroupApi(insGroupId : number){
  let dataApi:any ;
  try {
    await instanceAxios
      .put(`/InspectionGroup/RemoveInspectionGroupAndItem?inspectionGroupId=${insGroupId}`)
      .then(async function (response: any) {
        dataApi = response.data
        toastAlert(response.data.status , response.data.message, 5000);
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

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
      width: 150,
      sortable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <>
          <Link
            to="/masterData/inspectiongroups/inspectionitem"
            state={{ data: row }}
          >
            <Button>
              <VisibilityIcon />
            </Button>
          </Link>
          {row.status !== "Active" && (
            <Button
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
              <DeleteIcon />
            </Button>
          )}
        </>
      ),
    },
    {
      field: "inspectionGroupName",
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
      field: "scheduledLineName",
      headerName: "scheduledLine",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "lineName",
      headerName: "Line",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "stationName",
      headerName: "Station",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "modelGroupName",
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
      field: "status",
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


