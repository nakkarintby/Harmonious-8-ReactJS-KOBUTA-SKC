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
import { Backdrop, Box, Button, Grid } from "@mui/material";
import * as React from "react";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { useEffect, useState } from "react"
import axios from "axios";
import { Link } from "react-router-dom";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import AddBoxIcon from '@mui/icons-material/AddBox';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
import Swal from "sweetalert2";
import moment from "moment";
import instanceAxios from "../api/axios/instanceAxios";


export function ModelGroup() {
  const authRequest = {
    ...loginRequest,
  }

  const [openModalCreate, setopenModalCreate] = React.useState(false)
  const handleopenModalCreate = () => setopenModalCreate(true)
  const handlecloseModalCreate = () => setopenModalCreate(false)
  const [openModalEdit, setopenModalEdit] = React.useState(false)
  const handleopenModalEdit = () => setopenModalEdit(true)
  const handlecloseModalEdit = () => setopenModalEdit(false)
  const [modelGroupNameCreate, setModelGroupNameCreate] = React.useState('')
  const [modelGroupNameEdit, setModelGroupNameEdit] = React.useState('')
  const [modelGroupIdEdit, setModelGroupIdEdit] = React.useState('')
  const [data, setData] = useState([])
  const BASE_URL = 'https://665ecd1f1e9017dc16f173a2.mockapi.io'
  // async function fetchData() {
  //   try {
  //     instanceAxios.get()
      
  //     const response = await axios.get(` ${BASE_URL}/ModelGroup1`)
  //     for (let i = 0; i < response.data.length; i++) {
  //       response.data[i].createdOn = moment(response.data[i].createdOn).format('YYYY-MM-DD hh:mm:ss');
  //       response.data[i].modifiedOn = moment(response.data[i].createdOn).format('YYYY-MM-DD hh:mm:ss');
  //     }
  //     setData(response.data)
  //   } catch (error) {
  //     console.log('error', error)
  //   }
  // }
  async function fetchData() {
    try {
      instanceAxios.get("/Menu/GetMenu?page=1&perpage=1000").then((x) => {
        console.log(x)
      })

    } catch (error) {
      console.log('error', error)
    }
  }


  useEffect(() => {
    fetchData()

  }, [])


  const handleChangeModelGroupNameCreate = (e: any) => {
    e.preventDefault()
    setModelGroupNameCreate(e.target.value)
  }

  const handleChangeModelGroupNameEdit = (e: any) => {
    e.preventDefault()
    setModelGroupNameEdit(e.target.value)
  }


  async function CreateModelGroup() {
    try {
      await axios.post(` ${BASE_URL}/ModelGroup1`, {
        modelGroup: modelGroupNameCreate
      }).then(async (response) => {
        console.log(response)
        await fetchData()
        handlecloseModalCreate()
        toastAlert("success", "Add Model Group Success!", 3000)
      }, (error) => {
        console.log(error)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function DeleteModelGroup(id: any) {
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
          await axios.delete(`${BASE_URL}/ModelGroup1/${id}`, {
          }).then(async (response) => {
            console.log(response)
            await fetchData()
            toastAlert("error", "Deleted ModelGroup!", 3000)
          }, (error) => {
            console.log(error)
          })
        } catch (error) {
          console.log('error', error)
        }
      }
    });

  }

  async function HandleModalEdit(id: any, name: any) {
    setModelGroupNameEdit(name)
    setModelGroupIdEdit(id)
    handleopenModalEdit()
  }

  async function EditModelGroup() {
    try {
      await axios.put(`${BASE_URL}/ModelGroup1/${modelGroupIdEdit}`, {
        modelGroup: modelGroupNameEdit
      }).then(async (response) => {
        console.log(response)
        await fetchData()
        handlecloseModalEdit()
        toastAlert("success", "Edit Model Group Success!", 3000)
      }, (error) => {
        console.log(error)
      })
    } catch (error) {
      console.log('error', error)
    }
  }



  const columns: GridColDef[] = [
    {
      field: "action1",
      headerName: "",
      width: 220,
      renderCell: (params: any) => {
        return (
          <>

            <Link
              to={`/masterData/modelgroups/${params.row.modelGroup}/detail/`}
              state={{
                name: params.row.id,
              }}
            >
              <Button>
                <VisibilityIcon />
              </Button>
            </Link>
            <Button onClick={() => HandleModalEdit(params.row.id, params.row.modelGroup)}>
              <EditIcon />
            </Button>

            <Button onClick={() => DeleteModelGroup(params.row.id)} >
              <DeleteIcon />
            </Button></>
        );
      },
    },
    {
      field: "modelGroup",
      headerName: "Model Group",
      width: 150,

    },
    {
      field: "createdOn",
      headerName: "Created On",
      width: 300,

    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 200,

    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      width: 300,

    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      width: 120,

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
              <Button variant="outlined" endIcon={<AddBoxIcon />} onClick={handleopenModalCreate}>
                Create
              </Button>
              {/* <Button variant="outlined" onClick={CreateModal}>
                Create
              </Button> */}
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ height: "100%", width: "100%" }}>
          <DataGrid
            sx={{
              boxShadow: 2,
              border: 2,
              borderColor: "primary.light",

            }}
            rows={data}
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
          open={openModalCreate}
          onClose={handlecloseModalCreate}
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
          <ModalContent sx={{ width: 400 }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Model Group
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={6} md={8}>
                {" "}
                <TextField
                  label="Model Group Name"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 400 }}
                  onChange={handleChangeModelGroupNameCreate}

                />
              </Grid>
              <Grid item xs={6} md={12} container justifyContent="flex-end">
                <Box>
                  <Button variant="outlined" onClick={CreateModelGroup}>
                    Create
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </ModalContent>
        </Modal>

        {/* edit */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalEdit}
          onClose={handlecloseModalEdit}
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
          <ModalContent sx={{ width: 400 }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Edit Model Group
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={6} md={8}>
                {" "}
                <TextField
                  label="Model Group Name"
                  id="outlined-size-small"
                  size="small"
                  defaultValue={modelGroupNameEdit}
                  style={{ width: 400 }}
                  onChange={handleChangeModelGroupNameEdit}

                />
              </Grid>
              <Grid item xs={6} md={12} container justifyContent="flex-end">
                <Box>
                  <Button variant="outlined" onClick={EditModelGroup}>
                    Save
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


