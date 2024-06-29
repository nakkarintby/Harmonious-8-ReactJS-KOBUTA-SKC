// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import { Link } from "react-router-dom";
import Button from "@mui/material/Button";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react"
import axios from "axios";

const ModelGroupData = () => {
  const [data,setData] = useState([])
  
  async function fetchData () {
    const tmp = '2017-10-21T05:31:13.573Z'
    alert(tmp)
    try{
      const response = await axios.get('https://665ecd1f1e9017dc16f173a2.mockapi.io/ModelGroup1')
      setData(response.data);
    }catch (error){
      console.log('error',error)
    }
  }

  useEffect(() => { 
    fetchData();
  }, []);



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
        rows={data}
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

export default ModelGroupData;

const columns: GridColDef[] = [
  {
    field: "action",
    headerName: "",
    headerAlign: "center",
    sortable: false,
    renderCell: ({ row }: Partial<GridRowParams>) => (
      // <Link
      //   to={{
      //     pathname: "/masterData/modelgroups/detail"
      //   }}
      // >
      <Link
      to="/masterData/modelgroups/detail"
      state={{ data: row }}
    >
        <Button>
          <VisibilityIcon />
        </Button>
      </Link>
    ),
  },
  {
    field: "modelGroup",
    headerName: "Model Group",
    width: 150,

  },
  {
    field: "createdOn",
    headerName: "Created On",
    width: 300,
   
  },
  {
    field: "createdBy",
    headerName: "Created By",
    width: 200,

  },
  {
    field: "modifiedOn",
    headerName: "Modified On",
    width: 300,

  },
  {
    field: "modifiedBy",
    headerName: "Modified By",
    width: 300,

  },
];


