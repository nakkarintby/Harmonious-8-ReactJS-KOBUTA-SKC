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
  CircularProgress,
  Grid,
} from "@mui/material";
import * as React from "react";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import instanceAxios from "../api/axios/instanceAxios";
import _ from 'lodash';
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { GetLineAPI, GetModelGroupAPI, GetScheduledLineAPI, GetStationAPI } from "@api/axios/inspectionGroupAPI";
import AddBoxIcon from '@mui/icons-material/AddBox';


export function InspectionGroup() {
  const authRequest = {
    ...loginRequest,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => {
    setOpen(true);
    setLineDDLDisplay(null)
    setSelectedLine(0)
    setModelGroupDDLDisplay(null)
    setSelectedModelGroup(0)
    setSelectedStation(0)
    setStationDDLDisplay(null)
    setSelectedTaktTime("")
  } 
  const handleClose = () => setOpen(false);
  const [createData, setCreateData] = React.useState(false);
  const [selectedInsGroupName, setInsGroupName] = React.useState<string>("");
  const [scheduledLineDDL, setScheduledLineDDL] = React.useState<DDLModel[]>(
    []
  );
  const [lineDDL, setLineDDL] = React.useState<DDLModel[]>([]);
  const [stationDDL, setStationDDL] = React.useState<DDLModel[]>([]);
  const [modelGroupDDL, setModelGroupDDL] = React.useState<DDLModel[]>([]);
  const [selectedScheduledLine, setSelectedScheduledLine] =
    React.useState<string>("");
  const [selectedLine, setSelectedLine] = React.useState<number>(0);
  const [selectedStation, setSelectedStation] = React.useState<number>(0);
  const [selectedmodelGroup, setSelectedModelGroup] =
    React.useState<number>(0);
  const [selectedTaktTime, setSelectedTaktTime] = React.useState<string>("");

  const [loadingDDL, setLoadingDDL] = React.useState(false);
  const [loadingLineDDL, setLoadingLineDDL] = React.useState(false);
  const [loadingStationDDL, setLoadingStationDDL] = React.useState(false);
  const [loadingModelGroupDDL, setLoadingModelGroupDDL] = React.useState(false);

  function GetModelGroupDDL(LineId: number) {
    GetModelGroupAPI().then((x) => {
      if (x.status == "success") {
        const ddlModelGroup = _.chain(x.data.modelGroup)
          .filter((item) => item.lineId === LineId) // เงื่อนไข filter ด้วย LineId
          .map((item) => ({
            label: `${item.name}`,
            value: item.modelGroupId,
          }))
          .value();
        setModelGroupDDL(ddlModelGroup);
        setLoadingModelGroupDDL(false);
      } else {
        setLoadingModelGroupDDL(false);
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
        setLoadingLineDDL(false);
      } else {
        setLoadingLineDDL(false);
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
        setLoadingStationDDL(false);
      } else {
        setLoadingStationDDL(false);
      }
    });
  }

  async function CreateInsGroup(
    name: string,
    scheduledLineCode: string,
    lineId: number,
    stationId: number,
    modelGroupId: number,
    taktTime: string
  ) {
    let body = {
      name,
      scheduledLineCode,
      lineId,
      stationId,
      modelGroupId,
      taktTime,
    };
    await instanceAxios
      .post("/InspectionGroup/CreateInspectionGroup", body)
      .then((x) => {
        toastAlert(x.data.status ,x.data.message , 5000 );
        if (x.data.status == "success") {
          setCreateData(createData ? false : true)
        }
      });
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

  async function GetScheduledLineDDL() {
    await GetScheduledLineAPI().then(async (x) => {
      if (x.status == "success") {
        const ddlSheduLine: DDLModel[] = x.data.map((item: any) => ({
          label: `${item.scheduledLineCode} : ${item.name}`,
          value: item.scheduledLineCode,
        }));

        setScheduledLineDDL(ddlSheduLine);
        setLoadingDDL(false);
      } else {
        setLoadingDDL(false);
      }
    });
  }
  const [lineDDLDisplay , setLineDDLDisplay] = React.useState<DDLModel | null>(null);
  const [modelGroupDDLDisplay , setModelGroupDDLDisplay] = React.useState<DDLModel | null>(null);
  const [stationDDLDisplay , setStationDDLDisplay] = React.useState<DDLModel | null>(null);
  React.useEffect(() => {
    setLineDDLDisplay(
      lineDDL.find((it) => it.value == selectedLine.toString()) ?? null
    );
    setSelectedStation(0)
    setStationDDL([])
    setStationDDLDisplay(null)
  }, [selectedLine]);

  React.useEffect(() => {
    setModelGroupDDLDisplay(
      modelGroupDDL.find(
        (it) => it.value == selectedmodelGroup.toString()
      ) ?? null
    );
  }, [selectedmodelGroup]);
  React.useEffect(() => {
    setStationDDLDisplay(
      stationDDL.find((it) => it.value == selectedStation.toString()) ?? null
    );
  }, [selectedStation]);

  React.useEffect(() => {
    // setLineDDLDisplay(null);
    // setModelGroupDDLDisplay(null);
    // setStationDDLDisplay(null);
    setLineDDLDisplay(null)
    setLineDDL([])
    setSelectedLine(0)
    setModelGroupDDLDisplay(null)
    setModelGroupDDL([])
    setSelectedModelGroup(0)
    setSelectedStation(0)
    setStationDDL([])
    setStationDDLDisplay(null)
    setSelectedTaktTime("")
  }, [selectedScheduledLine]);

  const isCreate =  selectedInsGroupName.length > 0 && selectedScheduledLine.length >0
   && selectedLine >0 && selectedmodelGroup > 0
    && selectedStation >0 && selectedTaktTime.length >0
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
                prm1="Master Data"
                prm2="Inspection Groups"
                prm3=""
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4} container justifyContent="flex-end">
            <Box>
              <Button variant="outlined"  startIcon={<AddBoxIcon/>} onClick={handleOpen} >
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>

        <InspectionGroupData  createData={createData} />

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "30vw"}}>
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
                  onChange={(e) => {
                    setInsGroupName(e.target.value);
                  }}
                  inputProps={{ maxLength: 200 }}
                  fullWidth
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <Autocomplete
                  id="scheduledLine-box-demo"
                  size="small"
                  onOpen={() => {
                    setLoadingDDL(true);
                    GetScheduledLineDDL();
                  }}
                  onClose={() => setLoadingDDL(false)}
                  options={scheduledLineDDL}
                  loading={loadingDDL}
                  onChange={(_, value) =>
                    setSelectedScheduledLine(value?.value ?? "0")
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ScheduledLine"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingDDL ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <Autocomplete
                  id="Line-box-demo"
                  size="small"
                  onOpen={() => {
                    setLoadingLineDDL(true);
                    handleOpenLine(selectedScheduledLine ?? "");
                  }}
                  onClose={() => setLoadingLineDDL(false)}
                  options={lineDDL}
                  loading={loadingLineDDL}
                  onChange={async (_, value) => await setSelectedLine(Number(value?.value ?? 0))}
                  value={lineDDLDisplay}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Line"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingLineDDL ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={6}>
                <Autocomplete
                  id="ModelGroup-box-demo"
                  size="small"
                  onOpen={() => {
                    setLoadingModelGroupDDL(true);
                    handleOpenModelGroup(selectedLine as number);
                  }}
                  onClose={() => setLoadingModelGroupDDL(false)}
                  options={modelGroupDDL}
                  loading={loadingModelGroupDDL}
                  onChange={(_, value) =>
                    setSelectedModelGroup(Number(value?.value ?? 0))
                  }
                  value={modelGroupDDLDisplay}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Model Group"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingModelGroupDDL ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <Autocomplete
                  id="Station-box-demo"
                  size="small"
                  onOpen={() => {
                    setLoadingStationDDL(true);
                    handleOpenStation(selectedLine as number);
                  }}
                  onClose={() => setLoadingStationDDL(false)}
                  options={stationDDL}
                  loading={loadingStationDDL}
                  onChange={(_, value) => setSelectedStation(Number(value?.value ?? 0))}
                  value={stationDDLDisplay}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                 
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Station"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingStationDDL ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <TextField
                  label="Takt Time"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  fullWidth
                  inputProps={{ maxLength: 200 }}
                  onChange={(e) => {
                    setSelectedTaktTime(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} md={12} container justifyContent="flex-end">
                <Box display="flex" gap={2}>
                  <Button variant="outlined" onClick={handleClose}>
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    disabled={!isCreate}
                    onClick={() => {
                      CreateInsGroup(
                        selectedInsGroupName,
                        selectedScheduledLine,
                        selectedLine,
                        selectedStation,
                        selectedmodelGroup,
                        selectedTaktTime
                      );
                      handleClose();
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
  z-index: 10;
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
