import InspectionGroupData from "../ui-components/MasterData/InspectionGroupData";
import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Grid,
} from "@mui/material";
import * as React from "react";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import instanceAxios from "../api/axios/instanceAxios";
import Swal from "sweetalert2";

interface DDLModel {
  label: string;
  value: string;
}
async function GetScheduledLineAPI() {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/ScheduledLine/GetScheduledLine?page=1&perpage=1000`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        console.log("Err");
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

async function GetModelGroupAPI() {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/ModelGroup/GetModelGroup?page=1&perpage=1000`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        console.log("Err");
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

async function GetLineAPI(scheduledLineCode: string) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(
        `/Line/GetLineByScheduledLineCode?scheduledLineCode=${scheduledLineCode}`
      )
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        console.log("Err");
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

async function GetStationAPI(lineId: number) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/Station/GetStationByLineId?lineId=${lineId}`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        console.log("Err");
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}





export function InspectionGroup() {
  const authRequest = {
    ...loginRequest,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);


  const [selectedInsGroupName, setInsGroupName] = React.useState<string>("");
  const [sheduledLineDDL, setShudeledLineDDL] = React.useState<DDLModel[]>([]);
  const [selectedScheduledLine, setSelectedScheduledLine] =
    React.useState<string>("");
  const [lineDDL, setLineDDL] = React.useState<DDLModel[]>([]);
  const [selectedLine, setSelectedLine] = React.useState<number>(0);
  const [stationDDL, setStationDDL] = React.useState<DDLModel[]>([]);
  const [selectedStation, setSelectedStation] = React.useState<number>(0);
  const [modelGroupDDL, setsetModelGroupDDL] = React.useState<DDLModel[]>([]);
  const [selectedmodelGroupDDL, setSelectedModelGroupDDL] = React.useState<number>(0);
  const [selectedTrackTime, setSelectedTrackTime] = React.useState<string>("");

  function GetModelGroupDDL(LineId: number) {
    GetModelGroupAPI().then((x) => {
      if (x.status == "success") {
        const ddlModelGroup: DDLModel[] = x.data.modelGroup.map(
          (item: any) => ({
            label: `${item.name}`,
            value: item.modelGroupId,
          })
        );
        setsetModelGroupDDL(ddlModelGroup);
      }
    });
  }

  async function GetLineDDL(ScheduledLineCode: string) {
    await GetLineAPI(ScheduledLineCode).then(async (x) => {
      if (x.status == "success") {
        const ddlLine: DDLModel[] = x.data.map((item: any) => ({
          label: `${item.label}`,
          value: item.value,
        }));
        await setLineDDL(ddlLine);
      }
    });
  }

  async function GetStationDDL(LineId: number) {
    await GetStationAPI(LineId).then(async (x) => {
      console.log(x);
      if (x.status == "success") {
        const ddlStation: DDLModel[] = x.data.map((item: any) => ({
          label: `${item.name}`,
          value: item.stationId,
        }));
        await setStationDDL(ddlStation);
      }
    });
  }

  async function CreateInsGroup(name : string , scheduledLineCode : string , lineId : number , stationId : number , modelGroupId : number ,taktTime : string ){
    let body = {
      name,
      scheduledLineCode,
      lineId,
      stationId,
      modelGroupId,
      taktTime,
    };
    await instanceAxios.post("/InspectionGroup/CreateInspectionGroup", body).then((x) => {
      if(x.data.status == "success"){
        Swal.fire({
          title: "Good job!",
          text: "You clicked the button!",
          icon: "success"
        });
      }
    })
  }
  const handleOpenLine = async (selectedScheduledLine: string) => {
    await GetLineDDL(selectedScheduledLine);
  };
  const handleOpenStation = async (lineId: number) => {
    await GetStationDDL(lineId);
  };

  const handleOpenModelGroup = async (lineId: number) => {
    await GetModelGroupDDL(lineId);
  };


  React.useEffect(() => {
    const FetchMenu = async () => {
      GetScheduledLineAPI().then(async (x) => {
        if (x.status == "success") {
          const ddlSheduLine: DDLModel[] = x.data.map((item: any) => ({
            label: `${item.scheduledLineCode} : ${item.name}`,
            value: item.scheduledLineCode,
          }));
          setShudeledLineDDL(ddlSheduLine);
        }
      });
    };
    FetchMenu();
  }, []);


  

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
              <ActiveLastBreadcrumb
                prm1="masterData"
                prm2="inspectiongroups"
                prm3=""
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4} container justifyContent="flex-end">
            <Box>
              <Button variant="outlined" onClick={handleOpen}>
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>

        <InspectionGroupData />

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: 400 }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Inspection Group
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={6} md={12}>
                <TextField
                  label="Inspection Group Name"
                  id="Inspection-Group-Name"
                  defaultValue=""
                  size="small"
                  style={{ width: 400 }}
                  onChange={(e) =>{
                    setInsGroupName(e.target.value)
                  }}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <Autocomplete
                  id="scheduledLine-box-demo"
                  size="small"
                  options={sheduledLineDDL}
                  onChange={async (event, value) => {
                    await setSelectedScheduledLine(value?.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="scheduledLine" />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <Autocomplete
                  id="Line-box-demo"
                  size="small"
                  onOpen={() => {
                    handleOpenLine(selectedScheduledLine);
                  }}
                  options={lineDDL}
                  onChange={async (event, value) => {
                    await setSelectedLine(value?.value);
                  }}
                  renderInput={(params) => (
                    <TextField {...params} label="Line" />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <Autocomplete
                  id="ModelGroup-box-demo"
                  size="small"
                  onOpen={() => {
                    handleOpenModelGroup(selectedLine);
                  }}
                  options={modelGroupDDL}
                  renderInput={(params) => (
                    <TextField {...params} label="ModelGroup" />
                  )}
                  onChange={(e, v) => {
                    setSelectedModelGroupDDL(v?.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <Autocomplete
                  id="Station-box-demo"
                  size="small"
                  onOpen={() => {
                    handleOpenStation(selectedLine);
                  }}
                  onChange={(e, v) => {
                    alert(v?.value)
                    setSelectedStation(v?.value);
                  }}
                  options={stationDDL}
                  renderInput={(params) => (
                    <TextField {...params} label="Station" />
                  )}
                />
              </Grid>

              <Grid item xs={6} md={12}>
                <TextField
                  label="Takt Time"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 400 }}
                  onChange={(e)=>{
                    setSelectedTrackTime(e.target.value)
                  }}
                />
              </Grid>
              <Grid item xs={6} md={12} container justifyContent="flex-end">
                <Box>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      CreateInsGroup(selectedInsGroupName , selectedScheduledLine ,selectedLine ,  selectedStation ,selectedmodelGroupDDL  , selectedTrackTime  )
                      handleClose();
                      /// ReData 
                    }}
                  >
                    Create
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </ModalContent>
        </Modal>
      </MsalAuthenticationTemplate>
    </>
  );
}

const Modal = styled(BaseModal)`
  position: fixed;
  z-index: 1300;
  inset: 0;
  display: flex;

  align-items: center;
  justify-content: center;
`;
const StyledBackdrop = styled(Backdrop)`
  z-index: -1;
  position: fixed;
  inset: 0;
  background-color: rgb(0 0 0 / 0.5);
  -webkit-tap-highlight-color: transparent;
`;
const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: hidden;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};

    & .modal-title {
      margin: 0;
      line-height: 1.5rem;
      margin-bottom: 8px;
    }

    & .modal-description {
      margin: 0;
      line-height: 1.5rem;
      font-weight: 400;
      color: ${theme.palette.mode === "dark" ? grey[400] : grey[800]};
      margin-bottom: 4px;
    }
  `
);
