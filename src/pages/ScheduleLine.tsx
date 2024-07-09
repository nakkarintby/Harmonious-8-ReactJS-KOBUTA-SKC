
import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import {
  InteractionType,
} from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";
import { Box, Button, Grid } from "@mui/material";
import {  GridColDef, GridRowParams } from "@mui/x-data-grid";
import instanceAxios from "../api/axios/instanceAxios";
import moment from "moment";
import { useEffect, useState } from "react";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { Link } from "react-router-dom";
import StyledDataGrid from "../styles/styledDataGrid";

export function ScheduleLine() {
  const authRequest = {
    ...loginRequest,
  };
  const [data, setData] = useState([])


  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      await instanceAxios.get(`/ScheduledLine/GetScheduledLine?page=1&perpage=1000`).then(async (response) => {
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
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={authRequest}
        errorComponent={ErrorComponent}
        loadingComponent={Loading}
      >
        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            <Box>
              <ActiveLastBreadcrumb prm1="masterData" prm2="scheduleLine" prm3="" />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ height: "100%", width: "100%", marginTop: "10px" }}>
          <StyledDataGrid
        
            rows={data}
            getRowId={(data) => data.name}
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
  );
}

const columns: GridColDef[] = [
  {
    field: "action1",
    headerName: "",
    minWidth: 150,
    flex: 1,
    renderCell: ({ row }: Partial<GridRowParams>) => {
      return (
        <>
          <Link
            to={`/masterData/scheduleLine/model`}
            state={{ data: row }}
          >
            <Button>
              <VisibilityIcon />
            </Button>
          </Link>
        </>
      );
    },
  },
  {
    field: "scheduledLineCode",
    headerName: "Schedule Line Code",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "name",
    headerName: "Schedule Line Name",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "createdOn",
    headerName: "Created On",
    minWidth: 200,
    flex: 1,
  },
  {
    field: "modifiedOn",
    headerName: "Modified On",
    minWidth: 200,
    flex: 1,
  },
];

