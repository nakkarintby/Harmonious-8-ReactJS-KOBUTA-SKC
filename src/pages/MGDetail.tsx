import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import {
  InteractionType,
} from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";
import { useLocation } from "react-router";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import {  GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react";
import instanceAxios from "../api/axios/instanceAxios";
import { styled } from "@mui/material/styles";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import {
  Backdrop,
  ButtonGroup,
  CircularProgress,
  Fade,
  Grid,
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  tableCellClasses,
} from "@mui/material";
import AddBoxIcon from "@mui/icons-material/AddBox";
import React from "react";
import TextField from "@mui/material/TextField";
import { Modal as BaseModal } from "@mui/base/Modal";
import Autocomplete from "@mui/material/Autocomplete";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordion, {
  AccordionProps,
  AccordionSlots,
} from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import Typography from "@mui/material/Typography";
import Swal from "sweetalert2";
import StyledDataGrid from "../styles/styledDataGrid";

export function MGDetail() {
  const authRequest = {
    ...loginRequest,
  };
  let location = useLocation();

  const [modelList, setModelList] = useState([]);

  const [valueModelGroupId, setValueModelGroupId] = React.useState(null);
  const [valueModelGroupNameEdit, setValueModelGroupNameEdit] =
    React.useState(null);

  const [openModalCreate, setopenModalCreate] = React.useState(false);
  const [openModalModelGroupEdit, setOpenModalModelGroupEdit] =
    React.useState(false);
  const handleopenModalCreate = () => {
    setopenModalCreate(true);
    setDropDownModelListTable([]);
    setValueAutoCompleteModelList(null);
  };
  const handlecloseModalCreate = () => {
    setopenModalCreate(false);
    setDropDownModelListTable([]);
    setValueAutoCompleteModelList(null);
  };

  const [expanded, setExpanded] = React.useState(true);
  const [dropDownModelListAutoComplete, setDropDownModelListAutoComplete] =
    useState([]);
  const [dropDownModelListTable, setDropDownModelListTable] = useState([]);
  const [valueAutoCompleteModelList, setValueAutoCompleteModelList] =
    React.useState(Object);

  const [dropDownScheduledLineAutoComplete, setDropDownScheduledLineAutoComplete] = useState([])
  const [valueAutoCompleteDropDownScheduledLine, setValueAutoCompleteLinedropDownScheduledLine] = React.useState(null);
  const [dropDownLineAutoComplete, setDropDownLineAutoComplete] = useState([])
  const [valueAutoCompleteDropDownLine, setValueAutoCompleteDropDownLine] = React.useState(null);
  const [modelGroupDetail, setModelGroupDetail] = React.useState(Object);
  const [nameTmp, setNameTmp] = React.useState(null);
  const [LineTmp, setLineTmp] = React.useState(null);
  const [scheduledLineDisplay, setScheduledLineDisplay] = React.useState("");
  const [nameTmp2, setNameTmp2] = React.useState(null);
  const [LineTmp2, setLineTmp2] = React.useState(null);
  const [loadingSL, setLoadingSL] = React.useState(false);
  const [loadingLine, setLoadingLine] = React.useState(false);

  useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      await instanceAxios
        .get(
          `/ModelGroupMapping/SelectItemByModelGroupId?modelGroupId=${location.state.modelGroupId}`
        )
        .then(
          async (response) => {
            if (response.data.status == "success") {
              //Set All List
      
              setModelList(response.data.data.modelList);

              //Set Header
              setValueModelGroupId(location.state.modelGroupId);
              setValueModelGroupNameEdit(
                response.data.data.modelGroupDetail["name"]
              );
              setNameTmp(response.data.data.modelGroupDetail["name"])
              setLineTmp(response.data.data.dropDownLineList.filter(
                (item: any) =>
                  item["lineId"] ===
                  response.data.data.modelGroupDetail["lineId"]
              )[0]['name'])
              setScheduledLineDisplay(`${response.data.data.modelGroupDetail.scheduledLineCode} : ${response.data.data.modelGroupDetail.scheduledLineName}`)
              setNameTmp2(response.data.data.modelGroupDetail["name"])
              setLineTmp2(response.data.data.dropDownLineList.filter(
                (item: any) =>
                  item["lineId"] ===
                  response.data.data.modelGroupDetail["lineId"]
              )[0]['name'])
          
              setModelGroupDetail(response.data.data.modelGroupDetail)

              //Set Detail
              setDropDownModelListAutoComplete(
                response.data.data.dropDownModelList
              );
              setValueAutoCompleteModelList(
                response.data.data.dropDownModelList[0]
              );
            } else {
              toastAlert(
                "error",
                "Error Call Api SelectItemByModelGroupId!",
                5000
              );
            }
          },
          (error) => {
            toastAlert("error", error.response.data.message, 5000);
          }
        );
    } catch (error: any) {
      toastAlert("error", error, 5000);
    }
  }

  async function handlecloseModalModelGroup() {
    setOpenModalModelGroupEdit(false);
    setValueModelGroupNameEdit(nameTmp2)
    setNameTmp(nameTmp2)
    setLineTmp(LineTmp2)
    fetchDataDropDownScheduledLine()
    fetchDataDropDownLine(modelGroupDetail['scheduledLineCode'])
  }
  async function handleExpansion() {
    setExpanded((prevExpanded) => !prevExpanded);
  }

  async function handleChangeValueModelGroupNameEdit(e: any) {
    e.preventDefault();
    setValueModelGroupNameEdit(e.target.value);
    setNameTmp(e.target.value)
  }

  async function handleChangeValueDropDownLineListAutoComplete(e: any) {
    setValueAutoCompleteDropDownLine(e);
    setLineTmp(e['label'])
  }

  async function saveHeader() {
    try {
      await instanceAxios
        .put(`ModelGroup/UpdateModelGroup`, {
          modelGroupId: valueModelGroupId,
          name: valueModelGroupNameEdit,
          lineId: valueAutoCompleteDropDownLine ? valueAutoCompleteDropDownLine["value"] : null,
          scheduledLineCode: valueAutoCompleteDropDownScheduledLine ? valueAutoCompleteDropDownScheduledLine['scheduledLineCode'] : null
        })
        .then(
          async (response) => {
            if (response.data.status == "success") {
              await fetchData();
              toastAlert("success", "Edit ModelGroup Success!", 5000);
              setOpenModalModelGroupEdit(false);
            } else {
              toastAlert("error", "Error Call Api UpdateModelGroup!", 5000);
            }
          },
          (error) => {
            toastAlert("error", error.response.data.message, 5000);
          }
        );
    } catch (error: any) {
      toastAlert("error", error, 5000);
    }
  }

  async function deleteModelGroupMapping(id: any) {
    Swal.fire({
      title: "Are you sure confirm?",
      //text: "You won't be able to revert this!",
      icon: "warning",
      showCancelButton: true,
      confirmButtonColor: "#3085d6",
      cancelButtonColor: "#d33",
      confirmButtonText: "Yes, confirm it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await instanceAxios
            .put(
              `/ModelGroupMapping/RemoveModelGroupMapping?modelGroupMappingId=${id}`
            )
            .then(
              async (response) => {
                if (response.data.status == "success") {
                  await fetchData();
                  toastAlert("error", response.data.message, 5000);
                } else {
                  toastAlert(
                    "error",
                    "Error Call Api RemoveModelGroupMapping!",
                    5000
                  );
                }
              },
              (error) => {
                toastAlert("error", error.response.data.message, 5000);
              }
            );
        } catch (error: any) {
          toastAlert("error", error, 5000);
        }
      }
    });
  }

  async function submitModelGroupDetail() {
    try {
      await instanceAxios
        .post(`/ModelGroupMapping/CreateItemByModelCodeList`, {
          modelGroupId: valueModelGroupId,
          modelCode: dropDownModelListTable.map(
            (dropDownModelListTable) => dropDownModelListTable["modelCode"]
          ),
        })
        .then(
          async (response) => {
            if (response.data.status == "success") {
              await fetchData();
              handlecloseModalCreate();
              toastAlert("success", "Add ModelGroupMapping Success!", 5000);
            } else {
              toastAlert(
                "error",
                "Error Call Api CreateItemByModelCodeList!",
                5000
              );
            }
          },
          (error) => {
           
            toastAlert("error", error.response.data.message, 5000);
          }
        );
    } catch (error: any) {
      toastAlert("error", error, 5000);
    }
  }
  async function deleteCellTable(e: any) {
    setDropDownModelListTable(
      dropDownModelListTable.filter(
        (item) => item["modelName"] !== e["modelName"]
      )
    );
    setDropDownModelListAutoComplete(dropDownModelListAutoComplete.concat(e));
  }

  async function handleChangeValueDropDownModelListAutoComplete(e: any) {
    setValueAutoCompleteModelList(e);
  }

  async function addDropDownModelList() {
    //check null and duplicate key
    if (valueAutoCompleteModelList == null) {
      toastAlert("error", "Please Select Data From Dropdown!", 5000);
      return;
    }

    setDropDownModelListTable(
      dropDownModelListTable.concat(valueAutoCompleteModelList)
    );
    setDropDownModelListAutoComplete(
      dropDownModelListAutoComplete.filter(
        (item) => item !== valueAutoCompleteModelList
      )
    );
    setValueAutoCompleteModelList(null);
  }

  async function fetchDataDropDownScheduledLine() {
    try {
      await instanceAxios.get(`/ScheduledLine/GetScheduledLine?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          setDropDownScheduledLineAutoComplete(response.data.data)
          setValueAutoCompleteLinedropDownScheduledLine(
            response.data.data.filter(
              (item: any) =>
                item["scheduledLineCode"] ===
                modelGroupDetail['scheduledLineCode']
            )[0]
          );
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
          setDropDownLineAutoComplete(response.data.data)
          setValueAutoCompleteDropDownLine(
            response.data.data.filter(
              (item: any) =>
                item["value"] ===
                modelGroupDetail['lineId']
            )[0]
          );
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

  async function handleChangeValueDropDownScheduledLineAutoComplete(e: any) {
    setValueAutoCompleteLinedropDownScheduledLine(e)
    fetchDataDropDownLine(e['scheduledLineCode'])
  }

  async function handleopenModalModelGroup() {
    fetchDataDropDownScheduledLine()
    fetchDataDropDownLine(modelGroupDetail['scheduledLineCode'])
    setOpenModalModelGroupEdit(true);
  }


  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      headerAlign: "center",
      sortable: false,
      minWidth: 150,
      flex : 1,
      renderCell: (params: any) => {
        return (
          <>
            <Button
              onClick={() =>
                deleteModelGroupMapping(params.row.modelGroupMappingId)
              }
            >
              <DeleteIcon />
            </Button>
          </>
        );
      },
    },
    {
      field: "modelCode",
      headerName: "Model Code",
      minWidth: 200,
      flex : 1,
      headerAlign: "center",
    },
    {
      field: "modelName",
      headerName: "Model Name",
      minWidth: 200,
      flex : 1,
      headerAlign: "center",
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
                prm1="Master Data"
                prm2="Model Groups"
                prm3={`Detail`}
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
              <Typography sx={{ flexShrink: 0 }}>Model Group</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container spacing={0}>
                <Grid item xs={12} md={5}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Model Group Name :
                    </Typography>
                    <Typography variant="body1" ml={1}>
                      {nameTmp}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Scheduled Line:
                    </Typography>
                    <Typography variant="body1" ml={1}>
                      {scheduledLineDisplay}
                    </Typography>
                  </Box>
                </Grid>
                <Grid item xs={12} md={2} container justifyContent="flex-end">
                  <ButtonGroup variant="contained" aria-label="btn group">
                    <Button
                      variant="outlined"
                      onClick={handleopenModalModelGroup}
                    >
                      EDIT
                    </Button>
                  </ButtonGroup>
                </Grid>
                <Grid item xs={12} md={5}>
                  <Box display="flex" alignItems="center" mb={2}>
                    <Typography variant="subtitle1" color="textSecondary">
                      Line:
                    </Typography>
                    <Typography variant="body1" ml={1}>
                      {LineTmp}
                    </Typography>
                  </Box>
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
              <Typography>Model Group Detail</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Box
                  sx={{ height: "100%", width: "100%", marginBottom: "20px" }}
                >
                  <Grid item xs={6} md={12} container justifyContent="flex-end">
                    <Box>
                      <Button
                        variant="outlined"
                        endIcon={<AddBoxIcon />}
                        onClick={handleopenModalCreate}
                      >
                        Create
                      </Button>
                    </Box>
                  </Grid>
                </Box>

                <Box sx={{ height: "100%", width: "100%" }}>
                  <StyledDataGrid
                    autoHeight
                    rows={modelList}
                    getRowId={(data) => data.modelGroupMappingId}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 1, pageSize: 10 },
                      },
                    }}
                    pageSizeOptions={[5, 10]}
                  />
                </Box>
              </Typography>
            </AccordionDetails>
          </Accordion>
        </Box>

        {/* create */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalCreate}
          slots={{ backdrop: StyledBackdrop }}
          disableBackdropClick
          disableEscapeKeyDown
        >
          <ModalContent sx={{ width: "50vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Add Model
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={12} md={8}>
                <Autocomplete
                  sx={{ width: "100%" }}
                  onChange={(_, newValue) => {
                    handleChangeValueDropDownModelListAutoComplete(newValue);
                  }}
                  id="model-box-create"
                  size="small"
                  value={valueAutoCompleteModelList}
                  options={dropDownModelListAutoComplete.map(
                    (dropDownModelListAutoComplete) =>
                      dropDownModelListAutoComplete
                  )}
                  getOptionLabel={(options: any) => `${options.modelName}`}
                  renderInput={(params) => (
                    <TextField {...params} label="Model Name" />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={4} container justifyContent="flex-end">
                <ButtonGroup
                  variant="contained"
                  aria-label="Basic button group"
                >
                  <Box display="flex" gap={2}>
                    <Button variant="contained"  onClick={addDropDownModelList}>
                      Add
                    </Button>
                  </Box>
                </ButtonGroup>
              </Grid>
              <Grid item xs={12} md={12}>
                <Box>
                  <TableContainer
                    component={Paper}
                    style={{ width: "100%", maxHeight: "200px" }}
                  >
                    <Table sx={{ width: "100%" }} aria-label="customized table">
                      <TableHead>
                        <TableRow>
                        <StyledTableCell></StyledTableCell>
                          <StyledTableCell>Model Code</StyledTableCell>
                          <StyledTableCell>Model Name </StyledTableCell>
                       
                        </TableRow>
                      </TableHead>
                      <TableBody>
                        {dropDownModelListTable.map(
                          (dropDownModelListTable) => (
                            <StyledTableRow
                              key={dropDownModelListTable["modelName"]}
                            >
                               <StyledTableCell align="left">
                                <Button>
                                  <DeleteIcon
                                    onClick={() =>
                                      deleteCellTable(dropDownModelListTable)
                                    }
                                  />
                                </Button>
                              </StyledTableCell>
                              <StyledTableCell component="th" scope="row">
                                {dropDownModelListTable["modelCode"]}
                              </StyledTableCell>

                              <StyledTableCell component="th" scope="row">
                                {dropDownModelListTable["modelName"]}
                              </StyledTableCell>
                             
                            </StyledTableRow>
                          )
                        )}
                      </TableBody>
                    </Table>
                  </TableContainer>
                </Box>
              </Grid>

              <Grid item xs={6} md={6} container justifyContent="flex-start">
                <Box display="flex" gap={2}>
                  <Button variant="outlined" color="secondary" onClick={handlecloseModalCreate}>
                    Close
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={6} md={6} container justifyContent="flex-end">
                <Box display="flex" gap={2}>
                  <Button variant="contained" onClick={submitModelGroupDetail}>
                    Submit
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
          open={openModalModelGroupEdit}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent>
            <h2 id="unstyled-modal-title" className="modal-title">
              Edit Model Group
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Model Group Name"
                  id="outlined-size-small"
                  value={valueModelGroupNameEdit ? valueModelGroupNameEdit : ""}
                  size="small"
                  style={{ width: "100%" }}
                  onChange={handleChangeValueModelGroupNameEdit}
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <Autocomplete
                  sx={{ width: "100%" }}
                  size="small"
                  onOpen={() => {
                    setLoadingSL(true);
                    fetchDataDropDownScheduledLine();
                  }}
                  onClose={() => setLoadingSL(false)}
                  loading={loadingSL}
                  onChange={(_, newValue) => {
                    handleChangeValueDropDownScheduledLineAutoComplete(
                      newValue
                    );
                  }}
                  id="combo-box-demo"
                  value={valueAutoCompleteDropDownScheduledLine}
                  options={dropDownScheduledLineAutoComplete.map(
                    (dropDownScheduledLineAutoComplete) =>
                      dropDownScheduledLineAutoComplete
                  )}
                  getOptionLabel={(options: any) =>
                    `${options.scheduledLineCode} - ${options.name}`
                  }
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
              <Grid item xs={12}>
                <Autocomplete
                  onOpen={() => {
                    setLoadingLine(true);
                    fetchDataDropDownLine(
                      valueAutoCompleteDropDownScheduledLine
                        ? valueAutoCompleteDropDownScheduledLine[
                            "scheduledLineCode"
                          ]
                        : null
                    );
                  }}
                  onClose={() => setLoadingLine(false)}
                  loading={loadingLine}
                  onChange={(_, newValue) => {
                    handleChangeValueDropDownLineListAutoComplete(newValue);
                  }}
                  id="combo-box-demo"
                  value={valueAutoCompleteDropDownLine}
                  options={dropDownLineAutoComplete.map(
                    (dropDownLineAutoComplete) => dropDownLineAutoComplete
                  )}
                  sx={{ width: "100%" }}
                  size="small"
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
                      onClick={handlecloseModalModelGroup}
                    >
                      Close
                    </Button>
                    <Button
                      variant="contained"
                      onClick={saveHeader}
                      size="small"
                    >
                      SAVE
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

const StyledTableCell = styled(TableCell)(({ theme }) => ({
  [`&.${tableCellClasses.head}`]: {
    //backgroundColor: theme.palette.common.black,
    backgroundColor: "rgb(24,132,124)",
    color: theme.palette.common.white,
  },
  [`&.${tableCellClasses.body}`]: {
    fontSize: 14,
  },
}));

const StyledTableRow = styled(TableRow)(({ theme }) => ({
  "&:nth-of-type(odd)": {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  "&:last-child td, &:last-child th": {
    border: 0,
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
