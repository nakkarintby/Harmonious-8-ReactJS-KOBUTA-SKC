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
  Autocomplete,
  Backdrop,
  Box,
  Button,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import * as React from "react";
import { useEffect, useState } from "react";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import VisibilityIcon from "@mui/icons-material/Visibility";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from '@mui/icons-material/Delete';
import instanceAxios from "../api/axios/instanceAxios";
import moment from "moment";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { Link } from "react-router-dom";
import Swal from "sweetalert2";

export function Line() {
  const authRequest = {
    ...loginRequest,
  };
  const [data, setData] = useState([])
  const [openModalCreateLine, setOpenModalCreateLine] = React.useState(false);
  const handleOpenModalCreateLine = () => setOpenModalCreateLine(true);
  const handleCloseModalCreateLine = () => setOpenModalCreateLine(false);
  const [valueLineName, setValueLineName] = React.useState('')
  const [dropDownScheduledLineListAutoComplete, setDropDownScheduledLineListAutoComplete] = useState([])
  const [valueAutoCompletedropDownScheduledLineList, setValueAutoCompletedropDownScheduledLineList] = React.useState(Object);
  const [valueTaskTime, setValueTaskTime] = React.useState('')

  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const response = await instanceAxios.get(`/Line/GetLine?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          for (let i = 0; i < response.data.data.lineList.length; i++) {
            if (response.data.data.lineList[i].createdOn != null)
              response.data.data.lineList[i].createdOn = moment(response.data.data.lineList[i].createdOn).format('YYYY-MM-DD hh:mm');
            if (response.data.data.lineList[i].modifiedOn != null)
              response.data.data.lineList[i].modifiedOn = moment(response.data.data.lineList[i].modifiedOn).format('YYYY-MM-DD hh:mm');
          }
          setData(response.data.data.lineList)
          setDropDownScheduledLineListAutoComplete(response.data.data.dropdownScheduledLineList)
          setValueAutoCompletedropDownScheduledLineList(response.data.data.dropdownScheduledLineList[0])
        }
        else {
          toastAlert("error", "Error Call Api GetLine!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function handleChangeValueLineNameCreate(e: any) {
    e.preventDefault()
    setValueLineName(e.target.value)
  }

  async function handleChangeValueAutoCompletedropDownScheduledLineList(e: any) {
    setValueAutoCompletedropDownScheduledLineList(e)
  }

  async function handleChangeValueTaskTime(e: any) {
    e.preventDefault()
    setValueTaskTime(e.target.value)
  }

  async function createLine() {
    try {
      const response = await instanceAxios.post(`/Line/CreateLine`,
        {
          name: valueLineName,
          scheduledLineCode: valueAutoCompletedropDownScheduledLineList['scheduledLineCode'],
          taktTime: valueTaskTime
        }
      ).then(async (response) => {
        if (response.data.status == "success") {
          await fetchData()
          handleCloseModalCreateLine()
          toastAlert("success", "Create Line Success!", 3000)
        }
        else {
          toastAlert("error", "Error Call Api CreateLine!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function deleteLine(id: any) {
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
          const response = await instanceAxios.put(`/Line/RemoveLine?lineId=${id}`).then(async (response) => {
            if (response.data.status == "success") {
              await fetchData()
              toastAlert("error", "Deleted Line!", 3000)
            }
            else {
              toastAlert("error", "Error Call Api RemoveLine!", 3000)
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
              to={`/masterData/line/station`}
              state={{
                lineId: params.row.lineId,
                scheduledLineCode: params.row.scheduledLineCode
              }}
            >
              <Button>
                <VisibilityIcon />
              </Button>
            </Link>

            <Button  >
              <DeleteIcon onClick={() => deleteLine(params.row.lineId)} />
            </Button></>
        );
      },
    },
    {
      field: "name",
      headerName: "LineName",
      width: 140,

    },
    {
      field: "scheduledLineCode",
      headerName: "scheduledLineCode",
      width: 200,

    },
    {
      field: "taktTime",
      headerName: "taktTime",
      width: 140,

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
                prm2="line"
                prm3=""
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4} container justifyContent="flex-end">
            <Box>
              <Button variant="outlined" endIcon={<AddBoxIcon />} onClick={handleOpenModalCreateLine}>
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
            getRowId={(data) => data.lineId}
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

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalCreateLine}
          onClose={handleCloseModalCreateLine}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "30vw", height: "52vh" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Line
            </h2>
            <Box>
              <Grid container spacing={2}>
                <Grid item xs={12} >

                  <TextField sx={{ width: "100%", height: "12vh" }}
                    label="Line Name"
                    id="outlined-size-small"
                    defaultValue=""
                    size="medium"
                    onChange={handleChangeValueLineNameCreate}
                  />

                  <Autocomplete sx={{ width: "100%", height: "12vh" }}
                    onChange={(event, newValue) => {
                      handleChangeValueAutoCompletedropDownScheduledLineList(newValue)
                    }}
                    disablePortal
                    id="combo-box-demo"
                    value={valueAutoCompletedropDownScheduledLineList}
                    options={dropDownScheduledLineListAutoComplete.map((dropDownScheduledLineListAutoComplete) => dropDownScheduledLineListAutoComplete)}
                    getOptionLabel={(options: any) => `${options.name}`}
                    renderInput={(params) => <TextField {...params} label="Schedule Line" />}
                    ListboxProps={
                      {
                        style: {
                          maxHeight: '150px',
                        }
                      }
                    }
                  />

                  <TextField sx={{ width: "100%", height: "12vh" }}
                    label="Task Time"
                    id="outlined-size-small"
                    defaultValue=""
                    size="medium"
                    onChange={handleChangeValueTaskTime}
                  />

                  <Grid item xs={6} md={12} container justifyContent="flex-end"  >
                    <Button variant="outlined" onClick={createLine} sx={{ height: "6vh" }}>
                      Create
                    </Button>
                  </Grid>


                </Grid>

              </Grid>
            </Box>
          </ModalContent>
        </Modal>
      </MsalAuthenticationTemplate >
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
