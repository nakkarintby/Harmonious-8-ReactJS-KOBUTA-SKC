import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import {
  InteractionType,
} from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";
import SystemSettingData from "../ui-components/MasterData/SystemSettingData";
import { Backdrop, Box, Button, Grid, TextField } from "@mui/material";
import StyledDataGrid from "../styles/styledDataGrid";
import { useEffect, useState } from "react";
import instanceAxios from "@api/axios/instanceAxios";
import toastAlert from "@sweetAlert/toastAlert";
import { GridColDef } from "@mui/x-data-grid";
import EditIcon from '@mui/icons-material/Edit';
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import React from "react";

export function SystemSetting() {
  const authRequest = {
    ...loginRequest,
  };
  const [dataSystemSetting, setDataSystemSetting] = useState([])
  const [openModalEditSystemSetting, setOpenModalEditSystemSetting] = React.useState(false)
  const handleCloseModalEditSystemSetting = () => setOpenModalEditSystemSetting(false)
  const [valueId, setValueId] = React.useState(null)
  const [valueHeaderName, setValueHeaderName] = React.useState(null)
  const [valueName, setValueName] = React.useState(null)
  const [valueConstant, setValueConstant] = React.useState(null)


  useEffect(() => {
    fetchDataSystemSetting()
  }, [])

  async function fetchDataSystemSetting() {
    try {
      await instanceAxios.get(`/Constant/GetConstant`).then(async (response) => {
        if (response.data.status == "success") {
          setDataSystemSetting(response.data.data)
        }
        else {
          toastAlert("error", "Error Call Api GetConstant!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }
  async function SaveEditSystemSetting() {
    if(valueConstant == null || valueConstant == ''){
      toastAlert("error", "Please Enter Data Value!", 3000);
      return
    }
    try {
      await instanceAxios
        .put(`/Constant/UpdateConstant`, {
          constantId: valueId,
          text: valueConstant,
        })
        .then(
          async (response) => {
            if (response.data.status == "success") {
              handleCloseModalEditSystemSetting();
              fetchDataSystemSetting()
              toastAlert("success", "Edit UpdateConstant Success!", 3000);
            } else {
              toastAlert("error", "Error Call Api UpdateConstant!", 3000);
            }
          },
          (error) => {
            toastAlert("error", error.response.data.message, 3000);
          }
        );
    } catch (error) {
      console.log("error", error);
    }
  }


  async function handleOpenModalEditSystemSetting(e: any) {
    setValueId(e['constantId'])
    setValueHeaderName(e['grp'])
    setValueName(e['display'])
    setValueConstant(e['text'])
    setOpenModalEditSystemSetting(true)
  }

  async function handleChangeValueConstant(e: any) {
    e.preventDefault()
    setValueConstant(e.target.value)
  }


  const columns: GridColDef[] = [
    {
      field: "action1",
      headerName: "",
      width: 170,
      renderCell: (params: any) => {
        return (
          <>
            <Button onClick={() => handleOpenModalEditSystemSetting(params.row)} >
              <EditIcon />
            </Button></>
        );
      },
    },
    {
      field: "action2",
      headerName: "Name",
      minWidth: 200,
      flex: 1,
      renderCell: (params: any) => {
        return (
          <>
            <Box  >
              {params.row.grp} | {params.row.display}
            </Box></>
        );
      },
    },
    // {
    //   field: "display",
    //   headerName: "Name",
    //   minWidth: 200,
    //   flex: 1,
    // },
    {
      field: "text",
      headerName: "Value",
      minWidth: 200,
      flex: 1,
    },
  ];



  return (
    <>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={authRequest}
        errorComponent={ErrorComponent}
        loadingComponent={Loading}
      >
        <ActiveLastBreadcrumb prm1="Administrator" prm2="System Setting" prm3="" />
        <Box sx={{ height: "100%", width: "100%" }}>
          <StyledDataGrid
            rowHeight={40}
            rows={dataSystemSetting}
            getRowId={(dataSystemSetting) => dataSystemSetting.constantId}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 12 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Box>


        {/* edit */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalEditSystemSetting}
          // onClose={handleCloseModalCreateModelGroup}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "30vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Edit Sytem Setting
            </h2>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6} md={12}>
                  <TextField
                    disabled
                    sx={{
                      width: "100%",
                      backgroundColor: "whitesmoke",
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "black",
                      },
                    }}
                    label="Name"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    inputProps={{ maxLength: 200 }}
                    value={valueName ? valueHeaderName + ' | ' + valueName : ""}
                  />
                </Grid>

                <Grid item xs={6} md={12}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Value"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    inputProps={{ maxLength: 200 }}
                    onChange={handleChangeValueConstant}
                    value={valueConstant ? valueConstant : ""}
                  />
                </Grid>


                <Grid item xs={12}>
                  <Grid item xs={6} md={12} container justifyContent="flex-end">
                    <Box display="flex" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={handleCloseModalEditSystemSetting}
                      >
                        Close
                      </Button>
                      <Button
                        variant="contained"
                        onClick={SaveEditSystemSetting}
                        size="small"
                      >
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </Grid>
              </Grid>
            </Box>
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
