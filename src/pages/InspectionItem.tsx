import InspectionItemData from "../ui-components/MasterData/InspectionItemData";
import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";
import CircularProgress from "@mui/material/CircularProgress";
import * as React from "react";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  Grid,
  Typography,
} from "@mui/material";
import MuiAccordion, {
  AccordionProps,
} from "@mui/material/Accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import { useState } from "react";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { ActiveInsGroupAPI, GetInsGroupAPI, GetLineAPI, GetModelGroupAPI, GetScheduledLineAPI, GetStationAPI, SaveInsGroupAPI } from "@api/axios/inspectionGroupAPI";




export function InspectionItem() {
  const authRequest = {
    ...loginRequest,
  };
  const location = useLocation();
  const { data } = location.state || {};
  const [openBackDrop, setOpenBackDrop] = React.useState(true);

  const handleOpenInsGroup = () => setOpenInsGroup(true);
  const handleCloseInsGroup = () => setOpenInsGroup(false);
  const [openInsGroup, setOpenInsGroup] = React.useState(false);
  const [scheduledLineDDL, setScheduledLineDDL] = React.useState<DDLModel[]>(
    []
  );
  const [lineDDL, setLineDDL] = React.useState<DDLModel[]>([]);
  const [stationDDL, setStationDDL] = React.useState<DDLModel[]>([]);
  const [modelGroupDDL, setModelGroupDDL] = React.useState<DDLModel[]>([]);

  const [insGroupNameDisplay, setInsGroupNameDisplay] =
    React.useState<string>("");
  const [scheduledLineDisplay, setScheduledLineDisplay] =
    React.useState<string>("");
  const [lineDisplay, setLineDisplay] = React.useState<string>("");
  const [stationDisplay, setStationDisplay] = React.useState<string>("");
  const [modelGroupDisplay, setModelGroupDisplay] = React.useState<string>("");
  const [taktTimeDisplay, setTaktTimeDisplay] = React.useState<string>("");

  const [InsGroupName, setInsGroupName] = React.useState<string>("");
  const [selectedScheduledLine, setSelectedScheduledLine] = React.useState<
    string | null
  >(null);
  const [selectedLine, setSelectedLine] = React.useState<number | null>(null);
  const [selectedStation, setSelectedStation] = React.useState<number | null>(
    null
  );
  const [selectedModelGroup, setselectedModelGroup] = React.useState<
    number | null
  >(null);
  const [selectedTaktTime, setSelectedTaktTime] = React.useState<string | null>(
    null
  );

  const [loadingDDL, setLoadingDDL] = useState(false);
  const [loadingLineDDL, setLoadingLineDDL] = useState(false);
  const [loadingStationDDL, setLoadingStationDDL] = useState(false);
  const [loadingModelGroupDDL, setLoadingModelGroupDDL] = useState(false);

  const insGroupId = data.id;
  const [activeIns , setActiveIns] = useState<boolean>(data.status === "Active")
  const [activeInsDisplay , setActiveInsDisplay] = useState<string>(data.status)

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

  const handleOpenLine = async (selectedScheduledLine: string) => {
    await GetLineDDL(selectedScheduledLine);
  };
  const handleOpenStation = async (lineId: number) => {
    await GetStationDDL(lineId);
  };

  const handleOpenModelGroup = async (lineId: number) => {
    await GetModelGroupDDL(lineId);
  };

  async function SaveInsGroup() {
    const body = {
      name: InsGroupName,
      scheduledLineCode: selectedScheduledLine,
      lineId: selectedLine,
      stationId: selectedStation,
      modelGroupId: selectedModelGroup,
      taktTime: selectedTaktTime,
      inspectionGroupId: data.id,
    };

    await SaveInsGroupAPI(body).then((rs) => {
      if (rs.status == "success") {
        toastAlert(rs.status, rs.message, 5000);
        InsGroupPage();
      }
    });
    setOpenBackDrop(false);
  }

  async function InsGroupPage() {
    let dataInsGroup: any;
    await GetInsGroupAPI(data.id).then(async (x) => {
      if (x.status == "success") {
        setInsGroupNameDisplay(x.data.name);
        setLineDisplay(x.data.lineName);
        setScheduledLineDisplay(
          `${x.data.scheduledLineCode} : ${x.data.scheduledLineName}`
        );
        setModelGroupDisplay(x.data.modelGroupName);
        setTaktTimeDisplay(x.data.taktTime);
        setStationDisplay(x.data.stationName);
        setActiveIns(x.data.status === "Active")
        setActiveInsDisplay(x.data.status)
        setInsGroupName(x.data.name);
        setSelectedLine(x.data.lineId);
        setSelectedScheduledLine(x.data.scheduledLineCode);
        setselectedModelGroup(x.data.modelGroupId);
        setSelectedTaktTime(x.data.taktTime);
        setSelectedStation(x.data.stationId);
      }
      dataInsGroup = x;
    });
    return dataInsGroup;
  }

  async function ActiveInsGroupPage(insId: number) {
    await ActiveInsGroupAPI(insId).then((rs) => {
      console.log(rs)
      if (rs.status == "success") {
        toastAlert(rs.status, rs.message, 5000);
        InsGroupPage();
      }
    });
  
  }

  React.useEffect(() => {
    const FetchMenu = async () => {
      InsGroupPage();
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
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackDrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            <Box>
              <ActiveLastBreadcrumb
              prm1="Master Data"
              prm2="Inspection Groups"
              prm3="Inspection Item"
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Accordion defaultExpanded >
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: "rgba(0, 0, 0, .03)",
                  flexDirection: "row-reverse",
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Typography sx={{ flexShrink: 0 }}>Inspection Group</Typography>
                <Typography
                  sx={{
                    color:
                      data.status === "Active" ? "green" : "text.secondary",
                    marginLeft: "auto",
                  }}
                >
                  <b>{activeInsDisplay}</b>
                </Typography>
                <Typography
                  sx={{
                    color: "text.secondary",
                  }}
                >
                  <b>:</b>Version:<b>{data.version}</b>
                </Typography>
              </AccordionSummary>
              <AccordionDetails sx={{
                borderTop: "1px solid rgba(0, 0, 0, .125)",
              }}>
                <Grid container >
                  <Grid item xs={12} md={5}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        InspectionGroup Name:
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {insGroupNameDisplay}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={5}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Scheduled Line:
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {scheduledLineDisplay}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={2} container justifyContent="flex-end">
                    {!activeIns && (
                      <ButtonGroup variant="contained" aria-label="btn group">
                        <Button
                          variant="contained"
                          onClick={() => ActiveInsGroupPage(insGroupId)}
                        >
                          Active
                        </Button>
                        <Button variant="outlined" onClick={handleOpenInsGroup}>
                          EDIT
                        </Button>
                      </ButtonGroup>
                    )}
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Line:
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {lineDisplay}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Station:
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {stationDisplay}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={5}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Model Group:
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {modelGroupDisplay}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={7}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                       Takt Time:
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {taktTimeDisplay}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <InspectionItemData
              dataGroupId={insGroupId}
              activeIns={activeIns}
              OpenBackDrop={setOpenBackDrop}
            />
          </Grid>
        </Grid>

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openInsGroup}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: 400 }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Edit Inspection Group
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={6} md={12}>
                <TextField
                  label="Inspection Group Name"
                  id="Inspection-Group-Name"
                  defaultValue={insGroupNameDisplay}
                  size="small"
                  style={{ width: 400 }}
                  inputProps={{ maxLength: 200 }}
                  onChange={(e) => {
                    setInsGroupName(e.target.value);
                  }}
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
                  defaultValue={{
                    label: `${scheduledLineDisplay}`,
                    value: selectedScheduledLine,
                  }}
                  options={scheduledLineDDL}
                  loading={loadingDDL}
                  onChange={(_, value) =>
                    setSelectedScheduledLine(value?.value ?? "")
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
                  defaultValue={{
                    label: `${lineDisplay}`,
                    value: selectedLine?.toString(),
                  }}
                  options={lineDDL}
                  loading={loadingLineDDL}
                  onChange={(_, value) => setSelectedLine(Number(value?.value))}
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
                  defaultValue={{
                    label: `${modelGroupDisplay}`,
                    value: selectedModelGroup?.toString() ?? "",
                  }}
                  options={modelGroupDDL}
                  loading={loadingModelGroupDDL}
                  onChange={(_, value) =>
                    setselectedModelGroup(Number(value?.value))
                  }
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
                  defaultValue={{
                    label: `${stationDisplay}`,
                    value: selectedStation?.toString(),
                  }}
                  options={stationDDL}
                  loading={loadingStationDDL}
                  onChange={(_, value) =>
                    setSelectedStation(Number(value?.value))
                  }
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
                  defaultValue={`${selectedTaktTime}`}
                  size="small"
                  style={{ width: '100%' }}
                  inputProps={{ maxLength: 200 }}
                  onChange={(e) => {
                    setSelectedTaktTime(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} md={12} container justifyContent="flex-end">
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handleCloseInsGroup();
                    }}
                  >
                    Close
                  </Button>
                  <Button
                    variant="contained"
                    onClick={() => {
                      handleCloseInsGroup();
                      setOpenBackDrop(true);
                      SaveInsGroup();
                    }}
                  >
                    SAVE
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

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));