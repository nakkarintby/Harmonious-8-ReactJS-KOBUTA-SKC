// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import {  GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import VisibilityIcon from "@mui/icons-material/Visibility";
import StyledDataGrid from "../../styles/styledDataGrid";
import instanceAxios from "src/api/axios/instanceAxios";
import toastAlert from "../SweetAlert2/toastAlert";
import React from "react";

async function GetScheduleLineDataApi(){
  let dataApi:any ;
  try {
    await instanceAxios
      .get(`/ScheduledLine/GetScheduledLine?page=1&perpage=1000`)
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


const ScheduleLineData = () => {
  const [dataList , setDataList] = React.useState([]);
  React.useEffect(() => {
    const FetchMenu = async () => {
      GetScheduleLineDataApi().then((x)=>{
        if(x.status === "success"){
          setDataList(x.data);
        }


      });
    };
    FetchMenu();
  }, []);
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
      <>
        <Link to="/masterData/scheduleLine/model" state={{ data: row }}>
          <Button>
        
            <VisibilityIcon />
          </Button>
        </Link>
      </>
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

