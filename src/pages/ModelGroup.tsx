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
import { Autocomplete, Backdrop, Box, Button, CircularProgress, Grid } from "@mui/material";
import * as React from "react";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { useEffect, useState } from "react"
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";
import moment from "moment";
import instanceAxios from "../api/axios/instanceAxios";
import StyledDataGrid from "../styles/styledDataGrid";



export function ModelGroup() {
  const authRequest = {
    ...loginRequest,
  }

  const [openModalCreateModelGroup, setOpenModalCreateModelGroup] = React.useState(false)

  const handleCloseModalCreateModelGroup = () => setOpenModalCreateModelGroup(false)
  const [valueModelGroupName, setValueModelGroupName] = React.useState('')
  const [dataModelGroup, setDataModelGroup] = useState([])
  const [dropDownScheduledLineAutoComplete, setDropDownScheduledLineAutoComplete] = useState([])
  const [valueAutoCompleteDropDownScheduledLine, setValueAutoCompleteLinedropDownScheduledLine] = React.useState(null);
  const [dropDownLineAutoComplete, setDropDownLineAutoComplete] = useState([])
  const [valueAutoCompleteDropDownLine, setValueAutoCompleteDropDownLine] = React.useState(null);
  const [loadingSL, setLoadingSL] = React.useState(false);
  const [loadingLine, setLoadingLine] = React.useState(false);

  useEffect(() => {
    fetchDataModelGroup()
  }, [])

  async function fetchDataModelGroup() {
    try {
      await instanceAxios.get(`/ModelGroup/GetModelGroup?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          for (let i = 0; i < response.data.data.modelGroup.length; i++) {
            if (response.data.data.modelGroup[i].createdOn != null)
              response.data.data.modelGroup[i].createdOn = moment(response.data.data.modelGroup[i].createdOn).format('YYYY-MM-DD hh:mm');
            if (response.data.data.modelGroup[i].modifiedOn != null)
              response.data.data.modelGroup[i].modifiedOn = moment(response.data.data.modelGroup[i].modifiedOn).format('YYYY-MM-DD hh:mm');
          }
          setDataModelGroup(response.data.data.modelGroup)
        }
        else {
          toastAlert("error", "Error Call Api GetModelGroup!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function fetchDataDropDownScheduledLine() {
    try {
      await instanceAxios.get(`/ScheduledLine/GetScheduledLine?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          setDropDownScheduledLineAutoComplete(response.data.data)
          setLoadingSL(false)
        }
        else {
          setLoadingSL(false)
          toastAlert("error", "Error Call Api GetScheduledLine!", 3000)
        }
      }, (error) => {
        setLoadingSL(false)
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }


  async function fetchDataDropDownLine(params: any) {
    try {
      await instanceAxios.get(`/Line/GetLineByScheduledLineCode?scheduledLineCode=${params}`).then(async (response) => {
        if (response.data.status == "success") {
          if (response.data.data.length > 0) {
            setDropDownLineAutoComplete(response.data.data)
            setLoadingLine(false)
            return;
          }
          setDropDownLineAutoComplete([])
          setValueAutoCompleteDropDownLine(null)
          setLoadingLine(false)
        }
        else {
          setLoadingLine(false)
          toastAlert("error", "Error Call Api GetLineByScheduledLineCode!", 3000)
        }
      }, (error) => {
        setLoadingLine(false)
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function handleOpenModalCreateModelGroup() {
    setValueModelGroupName('')
    setValueAutoCompleteDropDownLine(null)
    setValueAutoCompleteLinedropDownScheduledLine(null)
    setOpenModalCreateModelGroup(true)
  }



  async function handleChangeValueModelGroupNameCreate(e: any) {
    e.preventDefault()
    setValueModelGroupName(e.target.value)
  }

  async function handleChangeValueDropDownScheduledLineAutoComplete(e: any) {
    setValueAutoCompleteLinedropDownScheduledLine(e)
    setValueAutoCompleteDropDownLine(null)
    fetchDataDropDownLine(e['scheduledLineCode'])
  }

  async function handleChangeValueDropDownLineAutoComplete(e: any) {
    setValueAutoCompleteDropDownLine(e)
  }

  async function validateModelGroup() {
    if (valueModelGroupName == null || valueModelGroupName == '') {
      toastAlert("error", 'Please Enter ModelGroup Name', 3000)
      return false;
    }
    if (valueAutoCompleteDropDownScheduledLine == null) {
      toastAlert("error", 'Please Enter ScheduledLine', 3000)
      return false;
    }
    if (valueAutoCompleteDropDownLine == null) {
      toastAlert("error", 'Please Enter Line', 3000)
      return false;
    }
    return true;
  }



  async function CreateModelGroup() {
    if (await validateModelGroup()) {
      try {
        await instanceAxios.post(`/ModelGroup/CreateModelGroup`,
          {
            name: valueModelGroupName,
            lineId: valueAutoCompleteDropDownLine ? valueAutoCompleteDropDownLine['value'] : null,
            scheduledLineCode: valueAutoCompleteDropDownScheduledLine ? valueAutoCompleteDropDownScheduledLine['scheduledLineCode'] : null
          }
        ).then(async (response) => {
          if (response.data.status == "success") {
            await fetchDataModelGroup()
            handleCloseModalCreateModelGroup()
            toastAlert("success", "Create ModelGroup Success!", 3000)
          }
          else {
            toastAlert("error", "Error Call Api CreateModelGroup!", 3000)
          }
        }, (error) => {
          toastAlert("error", error.response.data.message, 3000)
        })
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  async function deleteModelGroup(id: any) {
    Swal.fire({
      title: "Are you sure confirm?",
      //text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!"
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await instanceAxios.put(`/ModelGroup/RemoveModelGroup?modelGroupId=${id}`).then(async (response) => {
            if (response.data.status == "success") {
              await fetchDataModelGroup()
              toastAlert("error", "Deleted ModelGroup!", 3000)
            }
            else {
              toastAlert("error", "Error Call Api RemoveModelGroup!", 3000)
            }
          }, (error) => {
            toastAlert("error", error.response.data.message, 3000)
          })
        } catch (error) {
          console.log('error', error)
        }
      }
    });

  }


  const columns: GridColDef[] = [
    {
      field: "action1",
      headerName: "",
      minWidth: 150,
      flex: 0.5,
      renderCell: (params: any) => {
        return (
          <>
            <Link
              to={`/masterData/modelgroups/detail`}
              state={{
                data: params.row,
              }}
            >
              <Button  sx={{ minWidth: 0, padding: "4px" }}>
                <VisibilityIcon fontSize="small"  />
              </Button>
            </Link>
            <Button sx={{ minWidth: 0, padding: "4px" }} onClick={() => deleteModelGroup(params.row.modelGroupId)} >
              <DeleteIcon fontSize="small"  />
            </Button></>
        );
      },
    },
    {
      field: "name",
      headerName: "Model Group Name",
      width: 250,
      flex:1

    },
    {
      field: "lineName",
      headerName: "Line Name",
      width: 250,
      flex:1
    },
    {
      field: "createdOn",
      headerName: "Created On",
      width: 250,
      flex:1
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 250,
      flex:1
    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      width: 250,
      flex:1
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      width: 300,
      flex:1
    },
  ];

  const isCreate = valueModelGroupName.length > 0 && valueAutoCompleteDropDownScheduledLine != null && valueAutoCompleteDropDownLine != null
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
                prm2="Model Groups"
                prm3=""
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4} container justifyContent="flex-end">
            <Box>
              <Button
                variant="outlined"
                endIcon={<AddBoxIcon />}
                onClick={handleOpenModalCreateModelGroup}
              >
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ height: "100%", width: "100%", marginTop: "10px" }}>
          <StyledDataGrid
            rows={dataModelGroup}
            getRowId={(dataModelGroup) => dataModelGroup.modelGroupId}
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

        {/* create */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalCreateModelGroup}
          // onClose={handleCloseModalCreateModelGroup}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "30vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Model Group
            </h2>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6} md={12}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Model Group Name"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    onChange={handleChangeValueModelGroupNameCreate}
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>

                <Grid item xs={6} md={12}>
                  <Autocomplete
                    sx={{ width: "100%" }}
                    size="small"
                    onOpen={() => {
                      setLoadingSL(true);
                      fetchDataDropDownScheduledLine()
                    }}
                    onClose={() => setLoadingSL(false)}
                    loading={loadingSL}
                    onChange={(_, newValue) => {
                      handleChangeValueDropDownScheduledLineAutoComplete(newValue);
                    }}
                    id="combo-box-demo"
                    value={valueAutoCompleteDropDownScheduledLine}
                    options={dropDownScheduledLineAutoComplete.map(
                      (dropDownScheduledLineAutoComplete) =>
                        dropDownScheduledLineAutoComplete
                    )}
                    getOptionLabel={(options: any) => `${options.scheduledLineCode} - ${options.name}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="ScheduledLine"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingSL ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                    ListboxProps={{
                      style: {
                        maxHeight: "10vw",
                      },
                    }}
                  />
                </Grid>

                <Grid item xs={6} md={12}>
                  <Autocomplete
                    sx={{ width: "100%" }}
                    size="small"
                    onOpen={() => {
                      setLoadingLine(true);
                      fetchDataDropDownLine(valueAutoCompleteDropDownScheduledLine ? valueAutoCompleteDropDownScheduledLine['scheduledLineCode'] : null)
                    }}
                    onClose={() => setLoadingLine(false)}
                    loading={loadingLine}
                    onChange={(_, newValue) => {
                      handleChangeValueDropDownLineAutoComplete(newValue);
                    }}
                    id="combo-box-demo"
                    value={valueAutoCompleteDropDownLine}
                    options={dropDownLineAutoComplete.map(
                      (dropDownLineAutoComplete) =>
                        dropDownLineAutoComplete
                    )}
                    getOptionLabel={(options: any) => `${options.label}`}
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="Line Name"
                        InputProps={{
                          ...params.InputProps,
                          endAdornment: (
                            <React.Fragment>
                              {loadingLine ? (
                                <CircularProgress color="inherit" size={20} />
                              ) : null}
                              {params.InputProps.endAdornment}
                            </React.Fragment>
                          ),
                        }}
                      />
                    )}
                    ListboxProps={{
                      style: {
                        maxHeight: "10vw",
                      },
                    }}

                  />
                </Grid>

                <Grid item xs={12}>
                  <Grid item xs={6} md={12} container justifyContent="flex-end">
                    <Box display="flex" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={handleCloseModalCreateModelGroup}
                      >
                        Close
                      </Button>
                      <Button
                        variant="contained"
                        onClick={CreateModelGroup}
                        size="small"
                        disabled={!isCreate}
                      >
                        Create
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


