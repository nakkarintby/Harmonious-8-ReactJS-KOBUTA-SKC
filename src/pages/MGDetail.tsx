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
import { useLocation } from "react-router";
import { GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { useEffect, useState } from "react"
import instanceAxios from "../api/axios/instanceAxios";
import { styled } from '@mui/material/styles';
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { Backdrop, Fade, Grid, Paper, Table, TableBody, TableCell, TableContainer, TableHead, TableRow, css, tableCellClasses } from "@mui/material";
import AddBoxIcon from '@mui/icons-material/AddBox';
import React from "react";
import TextField from "@mui/material/TextField";
import { grey } from "@mui/material/colors";
import { Modal as BaseModal } from "@mui/base/Modal";
import Autocomplete from '@mui/material/Autocomplete';
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import ArrowForwardIosSharpIcon from '@mui/icons-material/ArrowForwardIosSharp';
import MuiAccordion, { AccordionProps, AccordionSlots } from '@mui/material/Accordion';
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from '@mui/material/AccordionSummary';
import MuiAccordionDetails from '@mui/material/AccordionDetails';
import Typography from '@mui/material/Typography';
import SaveIcon from '@mui/icons-material/Save';
import Swal from "sweetalert2";

export function MGDetail() {
  const authRequest = {
    ...loginRequest,
  };
  let location = useLocation();
  const [modelList, setModelList] = useState([])
  const [modelGroupDetail, setModelGroupDetail] = useState(Object)
  const [dropDownModelList, setDropDownModelList] = useState([])
  const [dropDownLineList, setDropDownLineList] = useState([])

  const [valueModelGroupId, setValueModelGroupId] = React.useState(null);
  const [valueModelGroupNameEdit, setValueModelGroupNameEdit] = React.useState(null);

  const [openModalCreate, setopenModalCreate] = React.useState(false)
  const handleopenModalCreate = () => setopenModalCreate(true)
  const handlecloseModalCreate = () => setopenModalCreate(false)
  const [expanded, setExpanded] = React.useState(true);
  const [dropDownModelListAutoComplete, setDropDownModelListAutoComplete] = useState([])
  const [dropDownModelListTable, setDropDownModelListTable] = useState([])
  const [valueAutoCompleteModelList, setValueAutoCompleteModelList] = React.useState(Object);
  const [dropDownLineListAutoComplete, setDropDownLineListAutoComplete] = useState([])
  const [valueAutoCompleteLineDropdown, setValueDropDownLineListAutoComplete] = React.useState(Object);


  useEffect(() => {
    fetchData()
  }, [])

  async function fetchData() {
    try {
      const response = await instanceAxios.get(`/ModelGroupMapping/SelectItemByModelGroupId?modelGroupId=${location.state.modelGroupId}`).then(async (response) => {
        if (response.data.status == "success") {
          //Set All List
          setModelList(response.data.data.modelList)
          setModelGroupDetail(response.data.data.modelGroupDetail)
          setDropDownModelList(response.data.data.dropDownModelList)
          setDropDownLineList(response.data.data.dropDownLineList)

          //Set Header
          setValueModelGroupId(location.state.modelGroupId)
          setValueModelGroupNameEdit(response.data.data.modelGroupDetail['name'])
          setDropDownLineListAutoComplete(response.data.data.dropDownLineList)
          setValueDropDownLineListAutoComplete(response.data.data.dropDownLineList.filter((item: any) => item['lineId'] === response.data.data.modelGroupDetail['lineId'])[0])

          //Set Detail
          setDropDownModelListAutoComplete(response.data.data.dropDownModelList)
          setValueAutoCompleteModelList(response.data.data.dropDownModelList[0])


        }
        else {
          toastAlert("error", "Error Call Api SelectItemByModelGroupId!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function handleExpansion() {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  async function handleChangeValueModelGroupNameEdit(e: any) {
    e.preventDefault()
    setValueModelGroupNameEdit(e.target.value)

  }

  async function handleChangeValueDropDownLineListAutoComplete(e: any) {
    setValueDropDownLineListAutoComplete(e)
  }

  async function saveHeader() {
    try {
      const response = await instanceAxios.put(`ModelGroup/UpdateModelGroup`,
        {
          modelGroupId: valueModelGroupId,
          name: valueModelGroupNameEdit,
          lineId: valueAutoCompleteLineDropdown['lineId'],
        }
      ).then(async (response) => {
        if (response.data.status == "success") {
          await fetchData()
          toastAlert("success", "Edit Model Group Success!", 3000)
        }
        else {
          toastAlert("error", "Error Call Api UpdateModelGroup!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
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
      confirmButtonText: "Yes, confirm it!"
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          const response = await instanceAxios.put(`/ModelGroupMapping/RemoveModelGroupMapping?modelGroupMappingId=${id}`).then(async (response) => {
            if (response.data.status == "success") {
              await fetchData()
              toastAlert("error", response.data.message, 3000)
            }
            else {
              toastAlert("error", "Error Call Api RemoveModelGroupMapping!", 3000)
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


  async function submitModelGroupDetail() {

    try {
      const response = await instanceAxios.post(`/ModelGroupMapping/CreateItemByModelCodeList`,
        {
          modelGroupId: valueModelGroupId,
          modelCode: dropDownModelListTable.map((dropDownModelListTable) => dropDownModelListTable['modelCode'])
        }
      ).then(async (response) => {
        if (response.data.status == "success") {
          await fetchData()
          handlecloseModalCreate()
          toastAlert("success", "Add ModelGroupMapping Success!", 3000)
        }
        else {
          toastAlert("error", "Error Call Api CreateItemByModelCodeList!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }



  async function deleteCellTable(e: any) {
    setDropDownModelListTable(dropDownModelListTable.filter(item => item['modelName'] !== e['modelName']))
    setDropDownModelListAutoComplete(dropDownModelListAutoComplete.concat(e));
  }

  async function handleChangeValueDropDownModelListAutoComplete(e: any) {
    setValueAutoCompleteModelList(e)
  }
  async function setValueDropDownModelListAutoComplete(e: any) {
    setValueAutoCompleteModelList(e)
  }

  async function addDropDownModelList() {
   //check null and duplicate key
    if(valueAutoCompleteModelList == null){
      toastAlert("error", "Please Select Data From Dropdown!", 3000)
      return;
    }
    
    setDropDownModelListTable(dropDownModelListTable.concat(valueAutoCompleteModelList))
    setDropDownModelListAutoComplete(dropDownModelListAutoComplete.filter(item => item !== valueAutoCompleteModelList))
    setValueAutoCompleteModelList(null)
  }

  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      headerAlign: "center",
      sortable: false,
      renderCell: (params: any) => {
        return (
          <>
            <Button onClick={() => deleteModelGroupMapping(params.row.modelGroupMappingId)} >
              <DeleteIcon />
            </Button></>
        );
      },
    },
    {
      field: "modelCode",
      headerName: "Model Code",
      width: 200,
      headerAlign: "center",
    },
    {
      field: "modelName",
      headerName: "Model Name",
      width: 200,
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
                prm1="masterData"
                prm2="modelgroups"
                prm3={`detail`}
              />
            </Box>
          </Grid>
        </Grid>

        <Box sx={{ height: "100%", width: "100%" }}>
          <Accordion
            defaultExpanded={true}
            expanded={expanded}
            onChange={handleExpansion}
            slots={{ transition: Fade as AccordionSlots['transition'] }}
            slotProps={{ transition: { timeout: 400 } }}
            sx={{
              '& .MuiAccordion-region': { height: expanded ? 'auto' : 0 },
              '& .MuiAccordionDetails-root': { display: expanded ? 'block' : 'none' },
            }}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel1-content"
              id="panel1-header"
            >
              <Typography>Header</Typography>
            </AccordionSummary>

            <AccordionDetails>
              <Typography>
                <Box sx={{ height: "100%", width: "100%" }}>
                  <Grid item xs={6} md={12} container justifyContent="flex-end">
                    <Box>
                      <Button variant="outlined" endIcon={<SaveIcon />} onClick={saveHeader}  >
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </Box>
                <Box sx={{ height: "100%", width: "100%" }}>
                  <TextField
                    label="Model Group Name"
                    id="outlined-size-small"
                    value={valueModelGroupNameEdit ? valueModelGroupNameEdit : ''}
                    size="small"
                    style={{ width: 400 }}
                    onChange={handleChangeValueModelGroupNameEdit}
                  />
                </Box>
                <Box sx={{ height: "100%", width: "100%", marginTop: "30px", marginBottom: "20px" }}>
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
                  />
                </Box>
              </Typography>
            </AccordionDetails>
          </Accordion>

          <Accordion
            defaultExpanded={true}
          >
            <AccordionSummary
              expandIcon={<ExpandMoreIcon />}
              aria-controls="panel2-content"
              id="panel2-header"
            >
              <Typography>Model Group Detail</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Box sx={{ height: "100%", width: "100%", marginBottom: "20px" }}>
                  <Grid item xs={6} md={12} container justifyContent="flex-end">
                    <Box>
                      <Button variant="outlined" endIcon={<AddBoxIcon />} onClick={handleopenModalCreate} >
                        Create
                      </Button>
                    </Box>
                  </Grid>
                </Box>

                <Box sx={{ height: "100%", width: "100%" }}>
                  <DataGrid
                    autoHeight
                    sx={{
                      '--DataGrid-overlayHeight': '300px',
                      boxShadow: 2,
                      border: 2,
                      borderColor: "primary.light",
                      "& .MuiDataGrid-cell:hover": {
                        color: "primary.main",
                      },
                    }}
                    slots={{ noRowsOverlay: CustomNoRowsOverlay }}
                    rows={modelList}
                    getRowId={(data) => data.modelGroupMappingId}
                    columns={columns}
                    initialState={{
                      pagination: {
                        paginationModel: { page: 0, pageSize: 10 },
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
          <ModalContent sx={{ height: "80%", width: 800 }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Add Model
            </h2>
            <Grid container spacing={8}>
              <Grid item xs={6}>
                <Autocomplete
                  onChange={(event, newValue) => {
                    handleChangeValueDropDownModelListAutoComplete(newValue)
                  }}
                  disablePortal
                  id="combo-box-demo"
                  value={valueAutoCompleteModelList}
                  options={dropDownModelListAutoComplete.map((dropDownModelListAutoComplete) => dropDownModelListAutoComplete)}
                  sx={{ width: 400 }}
                  getOptionLabel={(options: any) => `${options.modelName}`}
                  renderInput={(params) => <TextField {...params} label="Model Name" />}
                />
              </Grid>
              <Grid item xs={1.2}>
                <Button variant="outlined" onClick={addDropDownModelList} sx={{ height: "100%" }}>
                  Add
                </Button>
              </Grid>

              <Grid item xs={2}>
                <Button variant="outlined" onClick={submitModelGroupDetail} sx={{ height: "100%" }}>
                  Submit
                </Button>
              </Grid>
              <Grid item xs={12}>
                {dropDownModelListTable.length != 0 &&
                  <Box sx={{ height: "100%", width: "100%" }}>
                    <TableContainer component={Paper} style={{ maxWidth: '100%', width: '100%', maxHeight: '100%', height: '500px' }} >
                      <Table sx={{ minWidth: 700 }} aria-label="customized table" >
                        <TableHead>
                          <TableRow>
                            <StyledTableCell>Model Code</StyledTableCell>
                            <StyledTableCell>Model Name </StyledTableCell>
                            <StyledTableCell></StyledTableCell>
                          </TableRow>
                        </TableHead>
                        <TableBody>
                          {dropDownModelListTable.map((dropDownModelListTable) => (
                            <StyledTableRow key={dropDownModelListTable['modelName']}>
                              <StyledTableCell component="th" scope="row">
                                {dropDownModelListTable['modelCode']}
                              </StyledTableCell>

                              <StyledTableCell component="th" scope="row">
                                {dropDownModelListTable['modelName']}
                              </StyledTableCell>
                              <StyledTableCell align="right">
                                <Button onClick={() => deleteCellTable(dropDownModelListTable)}>
                                  <DeleteIcon />
                                </Button></StyledTableCell>

                            </StyledTableRow>
                          ))}
                        </TableBody>
                      </Table>
                    </TableContainer>
                  </Box>
                }
              </Grid>
            </Grid>
          </ModalContent>
        </Modal>

      </MsalAuthenticationTemplate >
    </>
  );
}


const StyledGridOverlay = styled('div')(({ theme }) => ({
  display: 'flex',
  flexDirection: 'column',
  alignItems: 'center',
  justifyContent: 'center',
  height: '100%',
  '& .ant-empty-img-1': {
    fill: theme.palette.mode === 'light' ? '#aeb8c2' : '#262626',
  },
  '& .ant-empty-img-2': {
    fill: theme.palette.mode === 'light' ? '#f5f5f7' : '#595959',
  },
  '& .ant-empty-img-3': {
    fill: theme.palette.mode === 'light' ? '#dce0e6' : '#434343',
  },
  '& .ant-empty-img-4': {
    fill: theme.palette.mode === 'light' ? '#fff' : '#1c1c1c',
  },
  '& .ant-empty-img-5': {
    fillOpacity: theme.palette.mode === 'light' ? '0.8' : '0.08',
    fill: theme.palette.mode === 'light' ? '#f5f5f5' : '#fff',
  },
}));

function CustomNoRowsOverlay() {
  return (
    <StyledGridOverlay>
      <svg
        style={{ flexShrink: 0 }}
        width="240"
        height="200"
        viewBox="0 0 184 152"
        aria-hidden
        focusable="false"
      >
        <g fill="none" fillRule="evenodd">
          <g transform="translate(24 31.67)">
            <ellipse
              className="ant-empty-img-5"
              cx="67.797"
              cy="106.89"
              rx="67.797"
              ry="12.668"
            />
            <path
              className="ant-empty-img-1"
              d="M122.034 69.674L98.109 40.229c-1.148-1.386-2.826-2.225-4.593-2.225h-51.44c-1.766 0-3.444.839-4.592 2.225L13.56 69.674v15.383h108.475V69.674z"
            />
            <path
              className="ant-empty-img-2"
              d="M33.83 0h67.933a4 4 0 0 1 4 4v93.344a4 4 0 0 1-4 4H33.83a4 4 0 0 1-4-4V4a4 4 0 0 1 4-4z"
            />
            <path
              className="ant-empty-img-3"
              d="M42.678 9.953h50.237a2 2 0 0 1 2 2V36.91a2 2 0 0 1-2 2H42.678a2 2 0 0 1-2-2V11.953a2 2 0 0 1 2-2zM42.94 49.767h49.713a2.262 2.262 0 1 1 0 4.524H42.94a2.262 2.262 0 0 1 0-4.524zM42.94 61.53h49.713a2.262 2.262 0 1 1 0 4.525H42.94a2.262 2.262 0 0 1 0-4.525zM121.813 105.032c-.775 3.071-3.497 5.36-6.735 5.36H20.515c-3.238 0-5.96-2.29-6.734-5.36a7.309 7.309 0 0 1-.222-1.79V69.675h26.318c2.907 0 5.25 2.448 5.25 5.42v.04c0 2.971 2.37 5.37 5.277 5.37h34.785c2.907 0 5.277-2.421 5.277-5.393V75.1c0-2.972 2.343-5.426 5.25-5.426h26.318v33.569c0 .617-.077 1.216-.221 1.789z"
            />
          </g>
          <path
            className="ant-empty-img-3"
            d="M149.121 33.292l-6.83 2.65a1 1 0 0 1-1.317-1.23l1.937-6.207c-2.589-2.944-4.109-6.534-4.109-10.408C138.802 8.102 148.92 0 161.402 0 173.881 0 184 8.102 184 18.097c0 9.995-10.118 18.097-22.599 18.097-4.528 0-8.744-1.066-12.28-2.902z"
          />
          <g className="ant-empty-img-4" transform="translate(149.65 15.383)">
            <ellipse cx="20.654" cy="3.167" rx="2.849" ry="2.815" />
            <path d="M5.698 5.63H0L2.898.704zM9.259.704h4.985V5.63H9.259z" />
          </g>
        </g>
      </svg>
      <Box sx={{ mt: 1 }}>No Rows</Box>
    </StyledGridOverlay>
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
  '&:nth-of-type(odd)': {
    backgroundColor: theme.palette.action.hover,
  },
  // hide last border
  '&:last-child td, &:last-child th': {
    border: 0,
  },
}));

const Accordion = styled((props: AccordionProps) => (
  <MuiAccordion disableGutters elevation={0} square {...props} />
))(({ theme }) => ({
  border: `1px solid ${theme.palette.divider}`,
  '&:not(:last-child)': {
    borderBottom: 0,
  },
  '&::before': {
    display: 'none',
  },
}));

const AccordionSummary = styled((props: AccordionSummaryProps) => (
  <MuiAccordionSummary
    expandIcon={<ArrowForwardIosSharpIcon sx={{ fontSize: '0.9rem' }} />}
    {...props}
  />
))(({ theme }) => ({
  backgroundColor:
    theme.palette.mode === 'dark'
      ? 'rgba(255, 255, 255, .05)'
      : 'rgba(0, 0, 0, .03)',
  flexDirection: 'row-reverse',
  '& .MuiAccordionSummary-expandIconWrapper.Mui-expanded': {
    transform: 'rotate(90deg)',
  },
  '& .MuiAccordionSummary-content': {
    marginLeft: theme.spacing(1),
  },
}));

const AccordionDetails = styled(MuiAccordionDetails)(({ theme }) => ({
  padding: theme.spacing(2),
  borderTop: '1px solid rgba(0, 0, 0, .125)',
}));
