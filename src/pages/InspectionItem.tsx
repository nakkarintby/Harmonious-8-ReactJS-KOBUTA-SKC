import InspectionItemData from "../ui-components/MasterData/InspectionItemData";
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
import * as React from "react";
import {
  Backdrop,
  Box,
  Button,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
} from "@mui/material";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import { DataGrid, GridColDef, GridRowParams } from "@mui/x-data-grid";
import { useState } from "react";
import { Padding } from "@mui/icons-material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";

export function InspectionItem() {
  const authRequest = {
    ...loginRequest,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  const [inspectionType, setInspectionType] = useState("1");

  const handleChangeInspectionType = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInspectionType(event.target.value);

    if (event.target.value == "2") {
      setShowMeasurement(true);
      setShowQRCodeList(false);
      setShowRecord(false);
    } else {
      setShowMeasurement(false);
    }

    if (event.target.value == "3") {
      setShowRecord(true);
      setShowMeasurement(false);
      setShowQRCodeList(false);
    } else {
      setShowRecord(false);
    }

    if (event.target.value == "4") {
      setShowQRCodeList(true);
    } else {
      setShowQRCodeList(false);
    }
  };

  const [showMeasurement, setShowMeasurement] = useState(false);
  const [showQRCodeList, setShowQRCodeList] = useState(false);
  const [showRecord, setShowRecord] = useState(false);

  const VisuallyHiddenInput = styled("input")({
    clip: "rect(0 0 0 0)",
    clipPath: "inset(50%)",
    height: 1,
    overflow: "hidden",
    position: "absolute",
    bottom: 0,
    left: 0,
    whiteSpace: "nowrap",
    width: 1,
  });
  // const toggleButton = () => {
  //   setShowButton(!showButton);
  // };

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
                prm3="inspectionitem"
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4} container justifyContent="flex-end">
            <Box>
              <Button variant="outlined" onClick={handleOpen}>
                Copy
              </Button>
            </Box>
            <Box>
              <Button variant="outlined" onClick={handleOpen}>
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>

        <InspectionItemData />

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: 400 }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Inspection Item
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={6} md={12}>
                {" "}
                <TextField
                  label="Sequence"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 400 }}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                {" "}
                <TextField
                  label="Topic"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 400 }}
                />
              </Grid>

              <Grid item xs={6} md={12}>
                <InputLabel id="demo-simple-select-label">
                  Inspection Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={inspectionType}
                  label="InspectionType"
                  onChange={handleChangeInspectionType}
                  size="small"
                  style={{ width: 400 }}
                >
                  <MenuItem value={1}>Check Item</MenuItem>
                  <MenuItem value={2}>Measurement</MenuItem>
                  <MenuItem value={3}>Record</MenuItem>
                  <MenuItem value={4}>QR Code Check</MenuItem>
                </Select>
              </Grid>
              {showMeasurement && (
                <Grid item xs={6} md={4}>
                  <TextField
                    label="Min"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    style={{ width: 120 }}
                  />
                </Grid>
              )}

              {showMeasurement && (
                <Grid item xs={6} md={4}>
                  <TextField
                    label="Max"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    style={{ width: 120 }}
                  />
                </Grid>
              )}
              {showMeasurement && (
                <Grid item xs={6} md={4}>
                  <TextField
                    label="Target"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    style={{ width: 120 }}
                  />
                </Grid>
              )}
              {showMeasurement && (
                <Grid item xs={6} md={12}>
                  <TextField
                    label="Unit"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    style={{ width: 400 }}
                  />
                </Grid>
              )}
              {showRecord && (
                <Grid item xs={6} md={12}>
                  <FormControlLabel
                    control={<Switch defaultChecked />}
                    label="Required"
                  />
                </Grid>
              )}
              {showQRCodeList && (
                <Grid item xs={6} md={12}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput type="file" />
                  </Button>
                </Grid>
              )}
              {showQRCodeList && (
                <Grid item xs={6} md={12}>
                  <DataGrid
                    sx={{
                      boxShadow: 2,
                      border: 2,
                      borderColor: "primary.light",
                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                    }}
                    rows={rows}
                    rowHeight={40}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 5 },
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                  />
                </Grid>
              )}

              <Grid item xs={6} md={12} container justifyContent="flex-end">
                <Box>
                  <Button variant="outlined" onClick={handleOpen}>
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

const columns: GridColDef[] = [
  {
    field: "qrcode",
    headerName: "QRCode",
    width: 200,
    headerAlign: "center",
  },
];

const rows = [
  { id: 1, qrcode: "TC430-49543" },
  { id: 2, qrcode: "TC832-49462" },
  { id: 3, qrcode: "3C319-98291" },
  { id: 4, qrcode: "TC402-98413" },
];

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
