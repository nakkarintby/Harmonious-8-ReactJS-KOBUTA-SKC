import SystemRoleData from "../ui-components/AdministratorData/SystemRoleData";
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
import { Backdrop, Box, Button, Grid, TextField } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from "react";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import Swal from "sweetalert2";
import instanceAxios from "@api/axios/instanceAxios";
import moment from "moment";
import { Link } from "react-router-dom";
import StyledDataGrid from "../styles/styledDataGrid";

export function SystemRole() {
  const authRequest = {
    ...loginRequest,
  };

  const [openModalCreateSystemRole, setOpenModalCreateSystemRole] = React.useState(false)
  const handleCloseModalCreateSystemRole = () => setOpenModalCreateSystemRole(false)
  const [valueSystemRoleName, setValueSystemRoleName] = React.useState('')
  const [dataSystemRole, setDataSystemRole] = useState([])

  useEffect(() => {
    fetchDataSystemRole()
  }, [])

  async function fetchDataSystemRole() {
    try {
      await instanceAxios.get(`/SystemRole/GetSystemRole?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].createdOn != null)
              response.data.data[i].createdOn = moment(response.data.data[i].createdOn).format('YYYY-MM-DD hh:mm');
            if (response.data.data[i].modifiedOn != null)
              response.data.data[i].modifiedOn = moment(response.data.data[i].modifiedOn).format('YYYY-MM-DD hh:mm');
          }
          setDataSystemRole(response.data.data)
        }
        else {
          toastAlert("error", "Error Call Api GetSystemRole!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function handleOpenModalCreateSystemRole() {
    setValueSystemRoleName('')
    setOpenModalCreateSystemRole(true)
  }

  async function handleChangeValueSystemRoleCreate(e: any) {
    e.preventDefault()
    setValueSystemRoleName(e.target.value)
  }


  async function validateSystemRole() {
    if (valueSystemRoleName == null || valueSystemRoleName == '') {
      toastAlert("error", 'Please Enter SystemRole Name', 3000)
      return false;
    }
    return true;
  }


  async function CreateSystemRole() {
    if (await validateSystemRole()) {
      try {
        await instanceAxios.post(`/SystemRole/CreateSystemRole`,
          {
            name: valueSystemRoleName
          }
        ).then(async (response) => {
          if (response.data.status == "success") {
            await fetchDataSystemRole()
            handleCloseModalCreateSystemRole()
            toastAlert("success", "Create System Role Success!", 3000)
          }
          else {
            toastAlert("error", "Error Call Api CreateSystemRole!", 3000)
          }
        }, (error) => {
          toastAlert("error", error.response.data.message, 3000)
        })
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  async function DeleteSystemRole(id: any) {
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
          await instanceAxios.put(`/SystemRole/RemoveSystemRole?systemRoleId=${id}`).then(async (response) => {
            if (response.data.status == "success") {
              await fetchDataSystemRole()
              toastAlert("error", "Deleted SystemRole!", 3000)
            }
            else {
              toastAlert("error", "Error Call Api RemoveSystemRole!", 3000)
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
              to={`/administrator/systemrole/detail`}
              state={{
                systemRoleId: params.row.systemRoleId,
                systemRoleName: params.row.name,
              }}
            >
              <Button>
                <VisibilityIcon />
              </Button>
            </Link>
            <Button onClick={() => DeleteSystemRole(params.row.systemRoleId)} >
              <DeleteIcon />
            </Button></>
        );
      },
    },
    {
      field: "name",
      headerName: "System Role Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "createdOn",
      headerName: "Created On",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
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
        {/* <ActiveLastBreadcrumb prm1="Administrator" prm2="System Role" prm3="" />
        <SystemRoleData /> */}

        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            <Box>
              <ActiveLastBreadcrumb
                prm1="Administrator"
                prm2="System Role"
                prm3=""
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4} container justifyContent="flex-end">
            <Box>
              <Button
                variant="outlined"
                endIcon={<AddBoxIcon />}
                onClick={handleOpenModalCreateSystemRole}
              >
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ height: "100%", width: "100%" }}>
          <StyledDataGrid
            rowHeight={40}
            rows={dataSystemRole}
            getRowId={(dataSystemRole) => dataSystemRole.systemRoleId}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 11 },
              },
            }}
            pageSizeOptions={[5, 11]}
          />
        </Box>


        {/* <Box sx={{ height: "100%", width: "100%", marginTop: "10px" }}>
          <DataGrid
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: "primary.light",
            }}
            rows={dataSystemRole}
            getRowId={(dataSystemRole) => dataSystemRole.systemRoleId}
            columns={columns}
            rowHeight={40}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 10]}
          />
        </Box> */}


        {/* create */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalCreateSystemRole}
          // onClose={handleCloseModalCreateModelGroup}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "30vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create System Role
            </h2>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6} md={12}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="System Role Name"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    onChange={handleChangeValueSystemRoleCreate}
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Grid item xs={6} md={12} container justifyContent="flex-end">
                    <Box display="flex" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={handleCloseModalCreateSystemRole}
                      >
                        Close
                      </Button>
                      <Button
                        variant="contained"
                        onClick={CreateSystemRole}
                        size="small"
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
