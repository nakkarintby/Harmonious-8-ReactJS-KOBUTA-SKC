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
import { Autocomplete, Backdrop, Box, Button, Grid } from "@mui/material";
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



export function ModelGroup() {
  const authRequest = {
    ...loginRequest,
  }

  const [openModalCreateModelGroup, setOpenModalCreateModelGroup] = React.useState(false)
  const handleOpenModalCreateModelGroup = () => setOpenModalCreateModelGroup(true)
  const handleCloseModalCreateModelGroup = () => setOpenModalCreateModelGroup(false)
  const [valueModelGroupName, setValueModelGroupName] = React.useState('')
  const [data, setData] = useState([])
  const [dropDownLineListAutoComplete, setDropDownLineListAutoComplete] = useState([])
  const [valueAutoCompleteLineDropdown, setValueDropDownLineListAutoComplete] = React.useState(Object);


  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const response = await instanceAxios.get(`/ModelGroup/GetModelGroup?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          for (let i = 0; i < response.data.data.modelGroup.length; i++) {
            if (response.data.data.modelGroup[i].createdOn != null)
              response.data.data.modelGroup[i].createdOn = moment(response.data.data.modelGroup[i].createdOn).format('YYYY-MM-DD hh:mm');
            if (response.data.data.modelGroup[i].modifiedOn != null)
              response.data.data.modelGroup[i].modifiedOn = moment(response.data.data.modelGroup[i].modifiedOn).format('YYYY-MM-DD hh:mm');
          }
          setData(response.data.data.modelGroup)
          setDropDownLineListAutoComplete(response.data.data.linedropdownList)
          setValueDropDownLineListAutoComplete(response.data.data.linedropdownList[0])
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

  async function handleChangeValueModelGroupNameCreate(e: any) {
    e.preventDefault()
    setValueModelGroupName(e.target.value)
  }

  async function handleChangeValueDropDownLineListAutoComplete(e: any) {
    setValueDropDownLineListAutoComplete(e)
  }


  async function CreateModelGroup() {
    try {
      const response = await instanceAxios.post(`/ModelGroup/CreateModelGroup`,
        {
          name: valueModelGroupName,
          lineId: valueAutoCompleteLineDropdown['lineId']
        }
      ).then(async (response) => {
        if (response.data.status == "success") {
          await fetchData()
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
          const response = await instanceAxios.put(`/ModelGroup/RemoveModelGroup?modelGroupId=${id}`).then(async (response) => {
            if (response.data.status == "success") {
              await fetchData()
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
      width: 170,
      renderCell: (params: any) => {
        return (
          <>
            <Link
              to={`/masterData/modelgroups/detail`}
              state={{
                modelGroupId: params.row.modelGroupId,
              }}
            >
              <Button>
                <VisibilityIcon />
              </Button>
            </Link>

            <Button onClick={() => deleteModelGroup(params.row.modelGroupId)} >
              <DeleteIcon />
            </Button></>
        );
      },
    },
    {
      field: "lineName",
      headerName: "Line Name",
      width: 200,

    },
    {
      field: "name",
      headerName: "Model Group Name",
      width: 200,

    },
    {
      field: "createdOn",
      headerName: "Created On",
      width: 200,

    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 280,

    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      width: 280,

    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      width: 300,

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
        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            <Box>
              <ActiveLastBreadcrumb
                prm1="masterData"
                prm2="modelgroups"
                prm3=""
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4} container justifyContent="flex-end">
            <Box>
              <Button variant="outlined" endIcon={<AddBoxIcon />} onClick={handleOpenModalCreateModelGroup}>
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ height: "100%", width: "100%", marginTop: "10px" }}>
          <DataGrid
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: "primary.light",

            }}
            rows={data}
            getRowId={(data) => data.modelGroupId}
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
          onClose={handleCloseModalCreateModelGroup}
          slots={{ backdrop: StyledBackdrop }}
          style={{
            content: {
              top: '50%',
              left: '50%',
              right: 'auto',
              bottom: 'auto',
              marginRight: '-50%',
              transform: 'translate(-50%, -50%)',
            },
          }}
        >
          <ModalContent sx={{ width: 400, height: "30%" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Model Group
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={6} md={8}>
              <Box sx={{ height: "35%", width: "100%", marginTop: "20px" }}>
                  <TextField
                    label="Model Group Name"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    style={{ width: 400 }}
                    onChange={handleChangeValueModelGroupNameCreate}

                  />
                </Box>

                <Box sx={{ height: "50%", width: "100%", marginTop: "20px" }}>
                  <Autocomplete
                    onChange={(event, newValue) => {
                      handleChangeValueDropDownLineListAutoComplete(newValue)
                    }}
                    disablePortal
                    id="combo-box-demo"
                    value={valueAutoCompleteLineDropdown}
                    options={dropDownLineListAutoComplete.map((dropDownLineListAutoComplete) => dropDownLineListAutoComplete)}
                    sx={{ width: 400 }}
                    getOptionLabel={(options: any) => `${options.name}`}
                    renderInput={(params) => <TextField {...params} label="Line Name" />}
                    ListboxProps={
                      {
                        style: {
                          maxHeight: '80px',
                        }
                      }
                    }
                  />
                </Box>
              </Grid>

              <Grid item xs={6} md={12} container justifyContent="flex-end" sx={{ marginTop: "20px" }} >
                <Button variant="outlined" onClick={CreateModelGroup}>
                  Create
                </Button>
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


