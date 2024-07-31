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
import { useLocation } from "react-router-dom";
import React, { useEffect } from "react";
import { AccordionProps, AccordionSlots, Box, Button, darken, Fade, Grid, lighten, styled, SxProps, TextField, Typography } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import {
  Backdrop,
  ButtonGroup,
  Checkbox
} from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";
import MuiAccordion, {

} from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import instanceAxios from "@api/axios/instanceAxios";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { MenuRole, MenuRoleConvert } from "../ui-components/Interface/MenuRole";

export function SRDetail() {
  const authRequest = {
    ...loginRequest,
  };

  let location = useLocation();
  const valueModelSystemRoleId = location.state.systemRoleId;
  const [valueModelSystemRoleName, setValueModelSystemRoleName] = React.useState(null);
  const [tmpValueModelSystemRoleName, setTmpValueModelSystemRoleName] = React.useState(null);
  const [expanded, setExpanded] = React.useState<boolean>(true);
  const [dataMenuRole, setDataMenuRole] = React.useState<MenuRole[]>([]);
  const [openModalEditSystemRole, setOpenModalEditSystemRole] = React.useState(false)
  const handleCloseModalEditSystemRole = () => setOpenModalEditSystemRole(false)
  useEffect(() => {
    fetchDataSystemRole()
    fetchDataMenuRole()
  }, [])

  async function CloseModalEditSystemRole() {
    setValueModelSystemRoleName(tmpValueModelSystemRoleName)
    handleCloseModalEditSystemRole()
  }

  async function handleExpansion() {
    setExpanded((prevExpanded) => !prevExpanded);
  }


  async function handleChangeValueSystemRoleName(e: any) {
    e.preventDefault()
    setValueModelSystemRoleName(e.target.value)
  }

  async function handleopenModalEditSystemRole() {
    setOpenModalEditSystemRole(true)
  }

  async function fetchDataSystemRole() {
    try {
      await instanceAxios.get(`/SystemRole/GetSystemRoleById?systemRoleId=${location.state.systemRoleId}`).then(async (response) => {
        if (response.data.status == "success") {
          setValueModelSystemRoleName(response.data.data['name'])
          setTmpValueModelSystemRoleName(response.data.data['name'])
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

  async function fetchDataMenuRole() {
    try {
      await instanceAxios.get(`/MenuRole/GetMenuRoleBySystemRoleId?systemRoleId=${location.state.systemRoleId}`).then(async (response) => {
        if (response.data.status == "success") {
          setDataMenuRole(response.data.data)
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

  async function SaveDetail() {
    try {
      await instanceAxios
        .put(`/MenuRole/UpdateMenuRole`, dataMenuRole).then(
          async (response) => {
            if (response.data.status == "success") {
              await fetchDataMenuRole();
              toastAlert("success", "Update MenuRole Success!", 5000);
            } else {
              toastAlert("error", "Error Call Api UpdateMenuRole!", 5000);
            }
          },
          (error) => {
            toastAlert(
              "error",
              error.response.data.detail == null
                ? error.response.data.message
                : error.response.data.detail,
              5000
            );
          }
        );
    } catch (error) {
      console.log("error", error);
    }
  }
  async function SaveSystemRoleEdit() {
    try {
      await instanceAxios.put(`/SystemRole/UpdateSystemRole`,
        {
          name: valueModelSystemRoleName,
          systemRoleId: valueModelSystemRoleId
        }
      ).then(async (response) => {
        if (response.data.status == "success") {
          handleCloseModalEditSystemRole()
          fetchDataSystemRole()
          toastAlert("success", "Edit SystemRole Success!", 3000)
        }
        else {
          toastAlert("error", "Error Call Api UpdateSystemRole!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }


  async function handleChangeCanDisplay(params: any) {
    let MenuRoleModel: MenuRole[] = [];
    const tmpData = dataMenuRole;
    for (let i = 0; i < dataMenuRole.length; i++) {
      if (tmpData[i].menuRoleId == params.menuRoleId) {
        tmpData[i].canDisplay = !tmpData[i].canDisplay
      }
      let Injected = MenuRoleConvert(tmpData[i]);
      MenuRoleModel.push(Injected);
    }
    setDataMenuRole(MenuRoleModel)
  }

  async function handleChangeCanCreate(params: any) {
    let MenuRoleModel: MenuRole[] = [];
    const tmpData = dataMenuRole;
    for (let i = 0; i < dataMenuRole.length; i++) {
      if (tmpData[i].menuRoleId == params.menuRoleId) {
        tmpData[i].canCreate = !tmpData[i].canCreate
      }
      let Injected = MenuRoleConvert(tmpData[i]);
      MenuRoleModel.push(Injected);
    }
    setDataMenuRole(MenuRoleModel)
  }


  async function handleChangeCanEdit(params: any) {
    let MenuRoleModel: MenuRole[] = [];
    const tmpData = dataMenuRole;
    for (let i = 0; i < dataMenuRole.length; i++) {
      if (tmpData[i].menuRoleId == params.menuRoleId) {
        tmpData[i].canEdit = !tmpData[i].canEdit
      }
      let Injected = MenuRoleConvert(tmpData[i]);
      MenuRoleModel.push(Injected);

    }
    setDataMenuRole(MenuRoleModel)
  }



  async function handleChangeCanDelete(params: any) {
    let MenuRoleModel: MenuRole[] = [];
    const tmpData = dataMenuRole;
    for (let i = 0; i < dataMenuRole.length; i++) {
      if (tmpData[i].menuRoleId == params.menuRoleId) {
        tmpData[i].canDelete = !tmpData[i].canDelete
      }
      let Injected = MenuRoleConvert(tmpData[i]);
      MenuRoleModel.push(Injected);

    }
    setDataMenuRole(MenuRoleModel)
  }


  async function handleChangeCanActive(params: any) {
    let MenuRoleModel: MenuRole[] = [];
    const tmpData = dataMenuRole;
    for (let i = 0; i < dataMenuRole.length; i++) {
      if (tmpData[i].menuRoleId == params.menuRoleId) {
        tmpData[i].canActive = !tmpData[i].canActive
      }
      let Injected = MenuRoleConvert(tmpData[i]);
      MenuRoleModel.push(Injected);

    }
    setDataMenuRole(MenuRoleModel)
  }

  const commonStyles: SxProps = {
    boxShadow: 2,
    border: 2,
    borderColor: 'primary.light',
    width: '100%',
    maxHeight: '30vw',
    height: '30vw',
    overflow: 'auto',
    '& .MuiDataGrid-columnHeader': {
      backgroundColor: '#19857B',
    },
    '& .MuiDataGrid-columnHeaderTitle': {
      color: '#FFFFFF',
      fontWeight: 'bold',
    },
    '& .MuiDataGrid-cell:hover': {
      color: 'primary.main',
    },
  };

  const getBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.7) : lighten(color, 0.7);

  const getHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.6) : lighten(color, 0.6);

  const getSelectedBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.5) : lighten(color, 0.5);

  const getSelectedHoverBackgroundColor = (color: string, mode: string) =>
    mode === 'dark' ? darken(color, 0.4) : lighten(color, 0.4);

  const StyledDataGrid = styled(DataGrid)(({ theme }) => ({
    '& .hilight': {
      backgroundColor: getBackgroundColor(
        theme.palette.success.light,
        theme.palette.mode,
      ),
      '&:hover': {
        backgroundColor: getHoverBackgroundColor(
          theme.palette.success.light,
          theme.palette.mode,
        ),
      },
      '&.Mui-selected': {
        backgroundColor: getSelectedBackgroundColor(
          theme.palette.success.light,
          theme.palette.mode,
        ),
        '&:hover': {
          backgroundColor: getSelectedHoverBackgroundColor(
            theme.palette.success.light,
            theme.palette.mode,
          ),
        },
      },
    },
  }));


  const columns: GridColDef[] = [
    {
      field: "nameEN",
      headerName: "Menu",
      width: 200,
      flex: 1
    },
    {
      field: "canDisplay",
      headerName: "canDisplay",
      width: 200,
      flex: 1,
      renderCell: (params) =>
      (params.row.canCheckDisplay ? <Checkbox checked={params.row?.canDisplay} onChange={() => handleChangeCanDisplay(params.row)} />
        : <div></div>)
    },
    {
      field: "canCreate",
      headerName: "canCreate",
      width: 200,
      flex: 1,
      renderCell: (params) =>
      (params.row.canCheckCreate ? <Checkbox checked={params.row?.canCreate} onChange={() => handleChangeCanCreate(params.row)} />
        : <div></div>)
    },
    {
      field: "canEdit",
      headerName: "canEdit",
      width: 200,
      flex: 1,
      renderCell: (params) =>
      (params.row.canCheckEdit ? <Checkbox checked={params.row?.canEdit} onChange={() => handleChangeCanEdit(params.row)} />
        : <div></div>)
    },
    {
      field: "canDelete",
      headerName: "canDelete",
      width: 200,
      flex: 1,
      renderCell: (params) =>
      (params.row.canCheckDelete ? <Checkbox checked={params.row?.canDelete} onChange={() => handleChangeCanDelete(params.row)} />
        : <div></div>)
    },
    {
      field: "canActive",
      headerName: "canActive",
      width: 200,
      flex: 1,
      renderCell: (params) =>
      (params.row.canCheckActive ? <Checkbox checked={params.row?.canActive} onChange={() => handleChangeCanActive(params.row)} />
        : <div></div>)
    },
    // {
    //   field: "canCreate",
    //   headerName: "canCreate",
    //   width: 200,
    //   flex: 1,
    //   renderCell: (params) => <Checkbox checked={params.row?.canCreate} onChange={() => handleChangeCanCreate(params.row)} />,
    // },
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
                prm2="System Role"
                prm3="Detail"
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ height: "100%", width: "100%" }}>
          <Accordion
            defaultExpanded={true}
            expanded={expanded}
            onChange={handleExpansion}
            slots={{ transition: Fade as AccordionSlots["transition"] }}
            slotProps={{ transition: { timeout: 400 } }}
            sx={{
              "& .MuiAccordion-region": { height: expanded ? "auto" : 0 },
              "& .MuiAccordionDetails-root": {
                display: expanded ? "block" : "none",
              },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography sx={{ flexShrink: 0 }}>System Role</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={0}>
                {/* <Grid item xs={12} md={5}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" color="textSecondary">
                      SystemRoleId :
                    </Typography>
                    <Typography variant="body1" ml={1}>
                      {valueModelSystemRoleId}
                    </Typography>
                  </Box>
                </Grid> */}
                <Grid item xs={12} md={5}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Name :
                    </Typography>
                    <Typography variant="body1" ml={1}>
                      {tmpValueModelSystemRoleName}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={7} container justifyContent="flex-end">
                  <ButtonGroup variant="contained" aria-label="btn group">
                    <Button
                      variant="outlined"
                      onClick={() => handleopenModalEditSystemRole()}
                    >
                      EDIT
                    </Button>
                  </ButtonGroup>
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          <Accordion defaultExpanded={true}>
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>Detail</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid
                item
                xs={12}
                md={12}
                container
                justifyContent="flex-end"
                alignItems="center"
              >
                <Button variant="contained" onClick={() => {
                  SaveDetail();
                }}>Save</Button>
              </Grid>
              <Box sx={{ height: "100%", width: "100%", marginTop: "10px" }}>
                <StyledDataGrid
                  sx={commonStyles}
                  getRowClassName={(params) => {
                    return params.row.isGrpHd === true ? "hilight" : "";
                  }}
                  rows={dataMenuRole}
                  getRowId={(dataMenuRole) => dataMenuRole.menuRoleId}
                  columns={columns}
                  rowHeight={40}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 12 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                />
              </Box>
            </AccordionDetails>
          </Accordion>
        </Box>
        {/* edit */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalEditSystemRole}
          // onClose={handleCloseModalCreateModelGroup}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "30vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Edit System Role
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
                    value={valueModelSystemRoleName ? valueModelSystemRoleName : ""}
                    onChange={handleChangeValueSystemRoleName}
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>

                <Grid item xs={12}>
                  <Grid item xs={6} md={12} container justifyContent="flex-end">
                    <Box display="flex" gap={2}>
                      <Button
                        variant="outlined"
                        onClick={CloseModalEditSystemRole}
                      >
                        Close
                      </Button>
                      <Button
                        variant="contained"
                        onClick={SaveSystemRoleEdit}
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
  z-index: 10;
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

const ModalContent = styled("div")(({ theme }) => ({
  fontFamily: "IBM Plex Sans, sans-serif",
  fontWeight: 500,
  textAlign: "start",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  overflow: "hidden",
  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
  borderRadius: 8,
  border: `1px solid ${theme.palette.mode === "dark" ? "#666" : "#ccc"}`,
  boxShadow: `0 4px 12px ${theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.2)"
    }`,
  padding: 24,
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  maxWidth: "90%",
  width: "100%",
  "@media (max-width: 600px)": {
    padding: 16,
    maxWidth: "100%",
  },
  "@media (min-width: 600px)": {
    maxWidth: "80%",
  },
  "@media (min-width: 960px)": {
    maxWidth: "60%",
  },
  "@media (min-width: 1280px)": {
    maxWidth: "50%",
  },
  "& .modal-title": {
    margin: 0,
    lineHeight: "1.5rem",
    marginBottom: 8,
  },
  "& .modal-description": {
    margin: 0,
    lineHeight: "1.5rem",
    fontWeight: 400,
    color: theme.palette.mode === "dark" ? "#ccc" : "#666",
    marginBottom: 4,
  },
}));

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  "&:not(:last-child)": {
    borderBottom: 0,
  },
  "&::before": {
    display: "none",
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: "0.9rem" }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === "dark"
      ? "rgba(255, 255, 255, .05)"
      : "rgba(0, 0, 0, .03)",
  flexDirection: "row-reverse",
  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
    transform: "rotate(90deg)",
  },
  "& .MuiAccordionSummary-content": {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: "1px solid rgba(0, 0, 0, .125)",
}));








