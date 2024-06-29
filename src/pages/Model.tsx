import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import {
  // InteractionStatus,
  InteractionType,
  // InteractionRequiredAuthError,
  // AccountInfo,
} from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";
import { Box, Grid } from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { useEffect, useState } from "react";
import instanceAxios from "../api/axios/instanceAxios";

export function Model() {
  const authRequest = {
    ...loginRequest,
  };

  const [data, setData] = useState([])

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      await instanceAxios.get(`/Model/GetModel?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          for (let i = 0; i < response.data.data.length; i++) {
            response.data.data[i].createdOn = moment(response.data.data[i].createdOn).format('YYYY-MM-DD hh:mm');
          }
          setData(response.data.data)
        }
        else {
          toastAlert("error", "Error Call Api GetModelGroup!", 3000)
        }
      }, (error) => {
        console.log(error)
      })
    } catch (error) {
      console.log('error', error)
    }
  }


  return (
    <>
      <>
        <MsalAuthenticationTemplate
          interactionType={InteractionType.Redirect}
          authenticationRequest={authRequest}
          errorComponent={ErrorComponent}
          loadingComponent={Loading}
        >
          <Grid container spacing={2}>
            <Grid item xs={6} md={8}>
              <Box>
                <ActiveLastBreadcrumb prm1="masterData" prm2="scheduleLine" prm3="model" />
              </Box>
            </Grid>
          </Grid>

          <Box sx={{ height: "100%", width: "100%", marginTop: "10px" }}>
            <DataGrid
              sx={{
                boxShadow: 2,
                border: 2,
                borderColor: "primary.light",

              }}
              rows={data}
              getRowId={(data) => data.modelName}
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
        </MsalAuthenticationTemplate>

      </>
    </>
  );
}


const columns: GridColDef[] = [
  {
    field: "scheduledLineCode",
    headerName: "ScheduledLineCode",
    width: 200,
    align:'center',
    headerAlign:'center'

  },
  {
    field: "modelCode",
    headerName: "ModelCode",
    width: 200,
  },
  {
    field: "modelName",
    headerName: "ModelName",
    width: 200,
  },
  {
    field: "distributorCode",
    headerName: "DistributorCode",
    width: 200,
  },
  {
    field: "createdOn",
    headerName: "Created On",
    width: 200,
  },
  {
    field: "modifiedOn",
    headerName: "Modified On",
    width: 200,
  },
];

