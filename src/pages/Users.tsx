import UsersData from "../ui-components/AdministratorData/UsersData";
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
import { Autocomplete, Backdrop, Box, Button, Checkbox, CircularProgress, createFilterOptions, FormControlLabel, Grid, IconButton, Switch, TextField } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import StyledDataGrid from "../styles/styledDataGrid";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import VisibilityIcon from "@mui/icons-material/Visibility";
import moment from "moment";
import { json, Link } from "react-router-dom";
import DeleteIcon from '@mui/icons-material/Delete';
import React, { useEffect, useState } from "react";
import instanceAxios from "@api/axios/instanceAxios";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import SearchIcon from '@mui/icons-material/Search';
import CheckBoxOutlineBlankIcon from '@mui/icons-material/CheckBoxOutlineBlank';
import CheckBoxIcon from '@mui/icons-material/CheckBox';
import Swal from "sweetalert2";

export function Users() {
  const authRequest = {
    ...loginRequest,
  };

  //GetEmployeeInfo?empId=11968
  const [openModalCreateUser, setOpenModalCreateUser] = React.useState(false)
  const handleCloseModalCreateUser = () => setOpenModalCreateUser(false)
  const [dataUsers, setDataUsers] = useState([])
  const [valueEmpId, setValueEmpId] = React.useState(null)
  const [valueFirstName, setValueFirstName] = React.useState(null)
  const [valueLastName, setValueLastName] = React.useState(null)
  const [valueEmail, setValueEmail] = React.useState(null)
  const [valueSuperUser, setValueSuperUser] = React.useState(false)
  const [dropDownSystemRoleListAutoComplete, setDropDownSystemRoleListAutoComplete,] = useState([]);
  const [valueAutoCompletedropDownSystemRoleList, setValueAutoCompletedropDownSystemRoleList,] = React.useState(Object);
  const [dropDownScheduledLineListAutoComplete, setDropDownScheduledLineListAutoComplete] = useState([]);
  const [valueAutoCompleteScheduledLineList, setValueAutoCompleteScheduledLineList] = React.useState([]);
  const [loadingSL, setLoadingSL] = React.useState(false);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;
  const [showDetailCreateUser, setShowDetailCreateUser] = React.useState(false);
  const [valuePersonalId, setValuePersonalId] = React.useState(null)

  useEffect(() => {
    fetchDataUsers()
  }, [])

  async function fetchDataUsers() {
    try {
      await instanceAxios.get(`/User/GetUser?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          for (let i = 0; i < response.data.data.length; i++) {
            if (response.data.data[i].createdOn != null)
              response.data.data[i].createdOn = moment(response.data.data[i].createdOn).format('YYYY-MM-DD hh:mm');
            if (response.data.data[i].modifiedOn != null)
              response.data.data[i].modifiedOn = moment(response.data.data[i].modifiedOn).format('YYYY-MM-DD hh:mm');
          }
          setDataUsers(response.data.data)
        }
        else {
          toastAlert("error", "Error Call Api GetUser!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }


  async function fetchDataSystemRole() {
    try {
      await instanceAxios.get(`/SystemRole/GetSystemRole?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          setDropDownSystemRoleListAutoComplete(response.data.data)
          setLoadingSL(false)
        }
        else {
          setLoadingSL(false)
          toastAlert("error", "Error Call Api GetSystemRole!", 3000)
        }
      }, (error) => {
        setLoadingSL(false)
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function fetchDataScheduledLine() {
    try {
      await instanceAxios.get(`/ScheduledLine/GetScheduledLine?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          setDropDownScheduledLineListAutoComplete(response.data.data)
        }
        else {
          toastAlert("error", "Error Call Api GetScheduledLine!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function searchUser() {
    try {
      await instanceAxios.get(`/User/GetEmployeeInfo?empId=${valueEmpId}`).then(async (response) => {
        if (response.data.status == "success") {
          setValueFirstName(response.data.data.nameEN)
          setValueLastName(response.data.data.lastnameEN)
          setValueEmail(response.data.data.email)
          setValuePersonalId(response.data.data.personal_Id)
          setShowDetailCreateUser(true)
        }
        else {
          toastAlert("error", "Error Call Api GetEmployeeInfo!", 3000)
          setValueFirstName(null)
          setValueLastName(null)
          setValueEmail(null)
          setShowDetailCreateUser(false)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
        setValueFirstName(null)
        setValueLastName(null)
        setValueEmail(null)
        setShowDetailCreateUser(false)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function validateCreateUser() {
    if ((valueEmpId == null || valueEmpId == '') || (valueFirstName == null || valueFirstName == '')) {
      toastAlert("error", "Plase Enter Data EmployeeId", 3000)
      return false;
    }
    if (valueAutoCompletedropDownSystemRoleList == null) {
      toastAlert("error", "Plase Enter Data SystemRole", 3000)
      return false;
    }
    if (valueSuperUser == false) {
      if (valueAutoCompleteScheduledLineList.length == 0) {
        toastAlert("error", "Plase Enter Data ScheduledLine ", 3000)
        return false;
      }
    }
    return true;
  }


  async function createUser() {
    if (await validateCreateUser()) {
      try {
        await instanceAxios.post(`/User/CreateUser`,
          {
            empId: valueEmpId,
            firstName: valueFirstName,
            lastName: valueLastName,
            email: valueEmail,
            systemRoleId: valueAutoCompletedropDownSystemRoleList['systemRoleId'],
            personalId: valuePersonalId,
            isSuperUser: valueSuperUser,
            scheduledLine: valueAutoCompleteScheduledLineList
          }
        ).then(async (response) => {
          if (response.data.status == "success") {
            await fetchDataUsers()
            handleCloseModalCreateUser()
            toastAlert("success", "CreateUser Success!", 3000)
          }
          else {
            handleCloseModalCreateUser()
            toastAlert("error", "Error Call Api CreateUser!", 3000)
          }
        }, (error) => {
          handleCloseModalCreateUser()
          toastAlert("error", error.response.data.message, 3000)
        })
      } catch (error) {
        console.log('error', error)
      }
    }
  }

  async function deleteUser(id: any) {
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
          await instanceAxios.put(`/User/RemoveUser?userId=${id}`).then(async (response) => {
            if (response.data.status == "success") {
              await fetchDataUsers()
              toastAlert("error", "Deleted User!", 3000)
            }
            else {
              toastAlert("error", "Error Call Api RemoveUser!", 3000)
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

  async function handleOpenModalCreateUser() {
    setValueEmpId(null)
    setValueFirstName(null)
    setValueLastName(null)
    setValueEmail(null)
    setValueSuperUser(false)
    setDropDownSystemRoleListAutoComplete([])
    setValueAutoCompletedropDownSystemRoleList(null)
    setDropDownScheduledLineListAutoComplete([])
    setValueAutoCompleteScheduledLineList([])
    fetchDataScheduledLine()
    setShowDetailCreateUser(false)
    setOpenModalCreateUser(true)
  }

  async function handleChangeValueEmpId(e: any) {
    e.preventDefault()
    setValueEmpId(e.target.value)
  }


  async function handleChangeValueAutoCompletedropDownSystemRoleList(
    e: any
  ) {
    setValueAutoCompletedropDownSystemRoleList(e);
  }

  async function handleChangeValueAutoCompletedropDownScheduledLineList(
    e: any
  ) {
    setValueAutoCompleteScheduledLineList(e);
  }


  async function handleChangeSwitchSuperUser(e: any) {
    setValueSuperUser(e.target.checked)
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
              to={`/administrator/users/detail`}
              state={{
                userId: params.row.userId,
              }}
            >
              <Button>
                <VisibilityIcon />
              </Button>
            </Link>
            <Button onClick={() => deleteUser(params.row.userId)} >
              <DeleteIcon />
            </Button></>
        );
      },
    },
    {
      field: "empId",
      headerName: "Employee ID",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "firstName",
      headerName: "First Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "lastName",
      headerName: "Last Name",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "role",
      headerName: "Role",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "scheduledLine",
      headerName: "ScheduledLine",
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
        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            <Box>
              <ActiveLastBreadcrumb
                prm1="Administrator"
                prm2="Users"
                prm3=""
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4} container justifyContent="flex-end">
            <Box>
              <Button
                variant="outlined"
                endIcon={<AddBoxIcon />}
                onClick={handleOpenModalCreateUser}
              >
                Create
              </Button>
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ height: "100%", width: "100%" }}>
          <StyledDataGrid
            rowHeight={40}
            rows={dataUsers}
            getRowId={(dataUsers) => dataUsers.userId}
            columns={columns}
            initialState={{
              pagination: {
                paginationModel: { page: 0, pageSize: 10 },
              },
            }}
            pageSizeOptions={[5, 11]}
          />
        </Box>

        {/* create */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalCreateUser}
          // onClose={handleCloseModalCreateModelGroup}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "30vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create User
            </h2>

            <Grid container spacing={2}>
              <Grid item xs={6} md={12}>
                <TextField
                  sx={{ width: "100%" }}
                  
                  label="Employee ID"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  inputProps={{ maxLength: 200 }}
                  onChange={handleChangeValueEmpId}
                  InputProps={{
                    endAdornment: (
                        <IconButton>
                          <SearchIcon onClick={searchUser} />
                        </IconButton>
                    )
                  }}
                />
              </Grid>
              {/* <Grid item xs={6} md={2}>
                <Box>
                  <Button
                    variant="outlined"
                    endIcon={<SearchIcon />}
                    onClick={searchUser}
                  >
                    Search
                  </Button>
                </Box>
              </Grid> */}

              <Grid item xs={6} md={12}>
                <TextField
                  disabled
                  sx={{
                    width: "100%", backgroundColor: 'whitesmoke',
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "black",
                    },
                  }}
                  label="First Name"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  inputProps={{ maxLength: 200 }}
                  value={valueFirstName ? valueFirstName : ""}
                />
              </Grid>

              <Grid item xs={6} md={12}>
                <TextField
                  disabled
                  sx={{
                    width: "100%", backgroundColor: 'whitesmoke',
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "black",
                    },
                  }}
                  label="Last Name"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  inputProps={{ maxLength: 200 }}
                  value={valueLastName ? valueLastName : ""}
                />
              </Grid>

              <Grid item xs={6} md={12}>
                <TextField
                  disabled
                  sx={{
                    width: "100%", backgroundColor: 'whitesmoke',
                    "& .MuiInputBase-input.Mui-disabled": {
                      WebkitTextFillColor: "black",
                    },
                  }}
                  label="Email"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  inputProps={{ maxLength: 200 }}
                  value={valueEmail ? valueEmail : ""}

                />
              </Grid>



              {showDetailCreateUser && (
                <Grid item xs={6} md={12}>
                  <Autocomplete
                    sx={{ width: "100%" }}
                    size="small"
                    onOpen={() => {
                      setLoadingSL(true);
                      fetchDataSystemRole();
                    }}
                    onClose={() => setLoadingSL(false)}
                    loading={loadingSL}
                    onChange={(_, newValue) => {
                      handleChangeValueAutoCompletedropDownSystemRoleList(
                        newValue
                      );
                    }}
                    id="combo-box-demo"
                    value={valueAutoCompletedropDownSystemRoleList}
                    options={dropDownSystemRoleListAutoComplete.map(
                      (dropDownSystemRoleListAutoComplete) =>
                        dropDownSystemRoleListAutoComplete
                    )}
                    getOptionLabel={(options: any) =>
                      `${options.name}`
                    }
                    renderInput={(params) => (
                      <TextField
                        {...params}
                        label="SystemRole"
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
              )}

              {showDetailCreateUser && (
                <Grid item xs={6} md={12}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={valueSuperUser}
                        onChange={handleChangeSwitchSuperUser}
                      />
                    }
                    label="Super User"
                  />
                </Grid>
              )}

              {showDetailCreateUser && (
                <Grid item xs={6} md={12}>
                  <Autocomplete
                    multiple
                    id="checkboxes-tags-demo"
                    // onOpen={() => {
                    //   setValueAutoCompleteScheduledLineList([])
                    //   setLoadingSL(true);
                    //   fetchDataScheduledLine();
                    // }}
                    // onClose={() => setLoadingSL(false)}
                    // loading={loadingSL}
                    onChange={(_, newValue) => {
                      handleChangeValueAutoCompletedropDownScheduledLineList(
                        newValue
                      );
                    }}
                    options={dropDownScheduledLineListAutoComplete.map(
                      (dropDownScheduledLineListAutoComplete) =>
                        dropDownScheduledLineListAutoComplete
                    )}
                    disableCloseOnSelect
                    getOptionLabel={(options: any) =>
                      `${options.name}`
                    }
                    renderOption={(props, option, { selected }) => {
                      const { key, ...optionProps } = props;
                      return (
                        <li key={key} {...optionProps}>
                          <Checkbox
                            icon={icon}
                            checkedIcon={checkedIcon}
                            style={{ marginRight: 8 }}
                            checked={selected}
                          />
                          {option.name}
                        </li>
                      );
                    }}
                    // renderInput={(params) => (
                    //   <TextField
                    //     {...params}
                    //     label="ScheduledLine"
                    //     InputProps={{
                    //       ...params.InputProps,
                    //       endAdornment: (
                    //         <React.Fragment>
                    //           {loadingSL ? (
                    //             <CircularProgress color="inherit" size={20} />
                    //           ) : null}
                    //           {params.InputProps.endAdornment}
                    //         </React.Fragment>
                    //       ),
                    //     }}
                    //   />
                    // )}
                    renderInput={(params) => (
                      <TextField {...params} label="ScheduledLine" />
                    )}
                    ListboxProps={{
                      style: {
                        maxHeight: "10vw",
                      },
                    }}

                  />
                </Grid>
              )}

              <Grid item xs={12}>
                <Grid item xs={6} md={12} container justifyContent="flex-end">
                  <Box display="flex" gap={2}>
                    <Button
                      variant="outlined"
                      onClick={handleCloseModalCreateUser}
                    >
                      Close
                    </Button>
                    <Button
                      variant="contained"
                      onClick={createUser}
                      size="small"
                    >
                      Create
                    </Button>
                  </Box>
                </Grid>
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