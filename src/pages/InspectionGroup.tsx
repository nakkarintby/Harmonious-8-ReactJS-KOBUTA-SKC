import InspectionGroupData from "../ui-components/MasterData/InspectionGroupData";
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
import { useState } from "react";

export function InspectionGroup() {
  const authRequest = {
    ...loginRequest,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [line, setLine] = useState("230401");
  const [station, setStation] = useState("1");
  const [modelGroup, setModelGroup] = useState("L5018DT");

  const handleChangeLine = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setLine(event.target.value);
  };

  const handleChangeStation = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setStation(event.target.value);
  };

  const handleChangeModelGroup = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setModelGroup(event.target.value);
  };

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
                {" "}
                <TextField
                  label="Inspection Group Name"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 400 }}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <InputLabel id="demo-simple-select-label">Line</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={line}
                  label="Line"
                  onChange={handleChangeLine}
                  size="small"
                  style={{ width: 400 }}
                >
                  <MenuItem value={230401}>230401 - CH</MenuItem>
                  <MenuItem value={230402}>230402 - TMC</MenuItem>
                  <MenuItem value={233401}>233401 - MAM</MenuItem>
                  <MenuItem value={236401}>236401 - MAR</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={12}>
                <InputLabel id="demo-simple-select-label">Station</InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={station}
                  label="Station"
                  onChange={handleChangeStation}
                  size="small"
                  style={{ width: 400 }}
                >
                  <MenuItem value={1}>1</MenuItem>
                  <MenuItem value={2}>2</MenuItem>
                  <MenuItem value={3}>3</MenuItem>
                  <MenuItem value={4}>4</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={12}>
                <InputLabel id="demo-simple-select-label">
                  Model Group
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={modelGroup}
                  label="ModelGroup"
                  onChange={handleChangeModelGroup}
                  size="small"
                  style={{ width: 400 }}
                >
                  <MenuItem value={"L5018DT"}>L5018DT</MenuItem>
                  <MenuItem value={"L4018DT"}>L4018DT</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={12}>
                {" "}
                <TextField
                  label="Takt Time"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 400 }}
                />
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
