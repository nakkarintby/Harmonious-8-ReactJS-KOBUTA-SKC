import LDetailData from "../ui-components/MasterData/LDetailData";
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
import {
  Backdrop,
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
} from "@mui/material";
import * as React from "react";

import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import Switch from "@mui/material/Switch";
import FormGroup from "@mui/material/FormGroup";
import FormControlLabel from "@mui/material/FormControlLabel";

import { useState } from "react";

export function Station() {
  const authRequest = {
    ...loginRequest,
  };

  const [stationType, setStationType] = useState("1");

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setStationType(event.target.value);

    if (event.target.value == "1") {
      setShowAutoStation(true);
    } else {
      setShowAutoStation(false);
    }
  };

  const [showAutoStation, setShowAutoStation] = useState(true);

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
                prm2="line"
                prm3="station"
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

        <LDetailData />

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: 600 }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Station
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={6} md={12}>
                {" "}
                <TextField
                  label="Station"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 600 }}
                />
              </Grid>
              {/* <Grid item xs={6} md={12}>
                <InputLabel id="demo-simple-select-label">Line</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={230401}
                  label="Line"
                  //onChange={handleChange}
                  size="small"
                  style={{ width: 600 }}
                >
                  <MenuItem value={230401}>CH</MenuItem>
                  <MenuItem value={230402}>TMC</MenuItem>
                  <MenuItem value={233401}>MAM</MenuItem>
                  <MenuItem value={236401}>MAR</MenuItem>
                </Select>
              </Grid> */}
              <Grid item xs={6} md={6}>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={stationType}
                  label="Station Type"
                  onChange={handleChange}
                  size="small"
                  style={{ width: 300 }}
                >
                  <MenuItem value={1}>Auto Station</MenuItem>
                  <MenuItem value={2}>Manual Station</MenuItem>
                  <MenuItem value={3}>Rework Station</MenuItem>
                  <MenuItem value={4}>Special Station</MenuItem>
                  <MenuItem value={5}>Station Finish</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={6}>
                {showAutoStation && (
                  <TextField
                    label="Sequence"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    style={{ width: 300 }}
                  />
                )}
              </Grid>
              <Grid item xs={6} md={6}>
                <Box>
                  {showAutoStation && (
                    <FormControlLabel
                      control={<Switch defaultChecked />}
                      label="First station"
                    />
                  )}
                </Box>
              </Grid>
              <Grid item xs={6} md={6}>
                {showAutoStation && (
                  <TextField
                    label="Ref. MFG/Station"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    style={{ width: 300 }}
                  />
                )}
              </Grid>
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
