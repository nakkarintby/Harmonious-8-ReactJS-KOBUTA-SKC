import LineData from "../ui-components/MasterData/LineData";
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
import { useState } from "react";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";

export function Line() {
  const authRequest = {
    ...loginRequest,
  };

  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [scheduleline, setScheduleline] = useState("400000");

  const handleChange = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setScheduleline(event.target.value);
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
              <ActiveLastBreadcrumb prm1="Master Data" prm2="Line" prm3="" />
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

        <LineData />

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: 600 }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Line
            </h2>
            <Grid container spacing={2}>
              {/* <Grid item xs={6} md={8}>
                {" "}
                <TextField
                  label="Line ID"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 600 }}
                />
              </Grid> */}

              <Grid item xs={6} md={8}>
                {" "}
                <TextField
                  label="Line Name"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 600 }}
                />
              </Grid>
              <Grid item xs={6} md={8}>
                <InputLabel id="demo-simple-select-label">
                  Schedule Line
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={scheduleline}
                  label="Schedule Line"
                  onChange={handleChange}
                  size="small"
                  style={{ width: 600 }}
                >
                  <MenuItem value={300000}>SH</MenuItem>
                  <MenuItem value={400000}>TRACTOR</MenuItem>
                  <MenuItem value={500000}>COMBINE</MenuItem>
                  <MenuItem value={700000}>Rotary</MenuItem>
                  <MenuItem value={800000}>B TRACTOR</MenuItem>
                  <MenuItem value={990000}>TTL Dozer</MenuItem>
                  <MenuItem value={990002}>Line Cell</MenuItem>
                  <MenuItem value={990004}>Line KIT-SET</MenuItem>
                </Select>
              </Grid>
              <Grid item xs={6} md={8}>
                {" "}
                <TextField
                  label="Takt Time"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 600 }}
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
