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
import {  GridColDef } from "@mui/x-data-grid";
import moment from "moment";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { useEffect, useState } from "react";
import instanceAxios from "../api/axios/instanceAxios";
import StyledDataGrid from "../styles/styledDataGrid";
import { useLocation } from "react-router-dom";

export function Model() {
  const authRequest = {
    ...loginRequest,
  };
  const location = useLocation();
  const [data, setData] = useState([])
  useEffect(() => {
    fetchData(location.state.data.scheduledLineCode)
  }, [])

  async function fetchData(scheduledLineCode : string) {
    try {
      
      await instanceAxios.get(`/Model/GetModelByScheduledLineCode?scheduledLineCode=${scheduledLineCode}`).then(async (response) => {
        if (response.data.status == "success") {
          for (let i = 0; i < response.data.data.length; i++) {
            response.data.data[i].createdOn =  response.data.data[i].createdOn == null ? "" :moment(response.data.data[i].createdOn).format('DD-MM-YYYY hh:mm:ss');
            response.data.data[i].modifiedOn =  response.data.data[i].modifiedOn == null ? "" :moment(response.data.data[i].modifiedOn).format('DD-MM-YYYY hh:mm:ss');
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
            <StyledDataGrid
             
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
    headerName: "Scheduled Line Code",
    minWidth: 200,
    flex:1,
    align:'center',
    headerAlign:'center'

  },
  {
    field: "modelCode",
    headerName: "Model Code",
    minWidth: 200,
    flex:1,
  },
  {
    field: "modelName",
    headerName: "Model Name",
    minWidth: 200,
    flex:1,
  },
  {
    field: "distributorCode",
    headerName: "Distributor Code",
    minWidth: 200,
    flex:1,
  },
  {
    field: "createdOn",
    headerName: "Created On",
    minWidth: 200,
    flex:1,
  },
  {
    field: "modifiedOn",
    headerName: "Modified On",
    minWidth: 200,
    flex:1,
  },
];

