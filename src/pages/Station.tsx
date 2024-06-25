import LDetailData from "../ui-components/MasterData/LDetailData";
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
  Fade,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  TableCell,
  TableRow,
  tableCellClasses,
} from "@mui/material";
import * as React from "react";

import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
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
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import instanceAxios from "../api/axios/instanceAxios";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import AddBoxIcon from '@mui/icons-material/AddBox';
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FormGroup from '@mui/material/FormGroup';
import FormControlLabel from '@mui/material/FormControlLabel';


export function Station() {
  const authRequest = {
    ...loginRequest,
  };

  let location = useLocation();
  const [expanded, setExpanded] = React.useState(true);
  const [valueLineId, setValueLineId] = React.useState(null)
  const [valueScheduledLineCode, setValueScheduledLineCode] = React.useState(null)
  const [valueLineName, setValueLineName] = React.useState(null)
  const [valueTaskTime, setValueTaskTime] = React.useState(null)
  const [dropDownScheduledLineListAutoComplete, setDropDownScheduledLineListAutoComplete] = useState([])
  const [valueAutoCompletedropDownScheduledLineList, setValueAutoCompletedropDownScheduledLineList] = React.useState(Object);
  const [stationList, setStationList] = useState([])
  const [openModalCreate, setopenModalCreate] = React.useState(false)
  const handleopenModalCreate = () => setopenModalCreate(true)
  const handlecloseModalCreate = () => setopenModalCreate(false)
  const [openModalEdit, setopenModalEdit] = React.useState(false)
  const handleopenModalEdit = () => setopenModalEdit(true)
  const handlecloseModalEdit = () => setopenModalEdit(false)
  const [valueStationName, setValueStationName] = React.useState(null)
  const [dropDownStationListAutoComplete, setDropDownStationListAutoComplete] = useState([])
  const [valueAutoCompletedropDownStationListAutoComplete, setValueAutoCompletedropDownStationListAutoComplete] = React.useState(Object);
  const [valueSequence, setValueSequence] = React.useState(null)
  const [valueRefMFG, setValueRefMFG] = React.useState(null)
  const [valueRefMFGFinish, setValueRefMFGFinish] = React.useState(null)
  const [valueStationId, setValueStationId] = React.useState(null)

  const [showSequence, setShowSequence] = React.useState(false)
  const [showFirstStationSwitch, setShowFirstStationSwitch] = React.useState(false)
  const [showFinishStationSwitch, setShowFinishStationSwitch] = React.useState(false)
  const [showRefFirst, setShowRefFirst] = React.useState(false)
  const [showRefFinish, setShowRefFinish] = React.useState(false)
  const [ischeckedFirstStation, setIscheckedFirstStation] = React.useState(false)
  const [ischeckedFinishStation, setIscheckedFinishStation] = React.useState(false)

  useEffect(() => {
    fetchDataHeader()
    fetchDataDetail()
    fetchDataDropDownStationListAutoComplete()
  }, [])


  async function fetchDataHeader() {
    try {
      const response = await instanceAxios.get(`/Line/GetLine?page=1&perpage=1000`).then(async (response) => {
        if (response.data.status == "success") {
          //Set Header
          setValueLineId(location.state.lineId)
          setValueScheduledLineCode(location.state.scheduledLineCode)
          setValueLineName(response.data.data.lineList.filter((item: any) => item['lineId'] === location.state.lineId)[0]['name'])
          setValueTaskTime(response.data.data.lineList.filter((item: any) => item['lineId'] === location.state.lineId)[0]['taktTime'])
          setDropDownScheduledLineListAutoComplete(response.data.data.dropdownScheduledLineList)
          setValueAutoCompletedropDownScheduledLineList(response.data.data.dropdownScheduledLineList.filter((item: any) => item['scheduledLineCode'] === (response.data.data.lineList.filter((item: any) => item['lineId'] === location.state.lineId))[0]['scheduledLineCode'])[0])
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

  async function fetchDataDetail() {
    try {
      const response = await instanceAxios.get(`/Station/GetStationByLineId?lineId=${location.state.lineId}`).then(async (response) => {
        if (response.data.status == "success") {
          //Set Detail
          setStationList(response.data.data)
        }
        else {
          toastAlert("error", "Error Call Api GetStationByLineId!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function fetchDataDropDownStationListAutoComplete() {
    setShowSequence(true)
    setShowFirstStationSwitch(true)
    setShowFinishStationSwitch(true)
    setShowRefFirst(true)
    setShowRefFinish(true)

    //fetch detail data
    try {
      const response = await instanceAxios.get(`/Constant/GetConstantByGRP?grp=DD_STATION`).then(async (response) => {
        if (response.data.status == "success") {
          setDropDownStationListAutoComplete(response.data.data)
          setValueAutoCompletedropDownStationListAutoComplete(response.data.data[0])
        }
        else {
          toastAlert("error", "Error Call Api GetConstantByGRP!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }
  }


  async function updateLine() {
    try {
      const response = await instanceAxios.put(`/Line/UpdateLine`,
        {
          lineId: valueLineId,
          name: valueLineName,
          scheduledLineCode: valueAutoCompletedropDownScheduledLineList['scheduledLineCode'],
          taktTime: valueTaskTime
        }
      ).then(async (response) => {
        if (response.data.status == "success") {
          await fetchDataHeader()
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



  async function handleExpansion() {
    setExpanded((prevExpanded) => !prevExpanded);
  };

  async function handleChangeValueLineName(e: any) {
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


  async function handleChangeValueStationName(e: any) {
    e.preventDefault()
    setValueStationName(e.target.value)
  }

  async function handleChangeValueAutoCompletedropDownStationList(e: any) {
    if (e['text'] == 'Auto Station') {
      setShowSequence(true)
      setValueSequence(null)
      setShowFirstStationSwitch(true)
      setIscheckedFinishStation(false)
      setShowFinishStationSwitch(true)
      setIscheckedFinishStation(false)
      setShowRefFirst(true)
      setValueRefMFG(null)
      setShowRefFinish(true)
      setValueRefMFGFinish(null)
    }
    else if (e['text'] == 'Manual Station') {
      setShowSequence(false)
      setValueSequence(null)
      setShowFirstStationSwitch(false)
      setIscheckedFirstStation(false)
      setShowFinishStationSwitch(true)
      setIscheckedFinishStation(false)
      setShowRefFirst(false)
      setValueRefMFG(null)
      setShowRefFinish(true)
      setValueRefMFGFinish(null)
    }
    else if (e['text'] == 'Rework Station') {
      setShowSequence(false)
      setValueSequence(null)
      setShowFirstStationSwitch(false)
      setIscheckedFirstStation(false)
      setShowFinishStationSwitch(false)
      setIscheckedFinishStation(false)
      setShowRefFirst(false)
      setValueRefMFG(null)
      setShowRefFinish(false)
      setValueRefMFGFinish(null)
    }

    else if (e['text'] == 'Special Station') {
      setShowSequence(false)
      setValueSequence(null)
      setShowFirstStationSwitch(false)
      setIscheckedFirstStation(false)
      setShowFinishStationSwitch(false)
      setIscheckedFinishStation(false)
      setShowRefFirst(false)
      setValueRefMFG(null)
      setShowRefFinish(false)
      setValueRefMFGFinish(null)
    }
    setValueAutoCompletedropDownStationListAutoComplete(e)
  }

  async function handleChangeValueSequence(e: any) {
    e.preventDefault()
    setValueSequence(e.target.value)
  }


  async function handleChangeShowFirstStationSwitch(e: any) {
    setIscheckedFirstStation(e.target.checked)
  }

  async function handleChangeValueMFG(e: any) {
    e.preventDefault()
    setValueRefMFG(e.target.value)
  }


  async function handleChangeShowFinishStationSwitch(e: any) {
    setIscheckedFinishStation(e.target.checked)
  }

  async function handleChangeValueMFGFinish(e: any) {
    setValueRefMFGFinish(e.target.value)
  }

  async function createStation() {
    console.log(valueStationName)
    console.log(valueLineId)
    console.log(valueScheduledLineCode)
    console.log(valueSequence)
    console.log(valueAutoCompletedropDownStationListAutoComplete['code'])
    console.log(ischeckedFirstStation)
    console.log(ischeckedFinishStation)
    console.log(valueRefMFG)
    console.log(valueRefMFGFinish)

    try {
      const response = await instanceAxios.post(`/Station/CreateStation`,
        {
          name: valueStationName,
          lineId: valueLineId,
          scheduledLineCode: valueScheduledLineCode,
          sequence: valueSequence,
          type: valueAutoCompletedropDownStationListAutoComplete['code'],
          isFirstStation: ischeckedFirstStation,
          isFinishedStation: ischeckedFinishStation,
          refMFG: valueRefMFG,
          refFinishedMFG: valueRefMFGFinish,
          refStation: '1',

        }
      ).then(async (response) => {
        if (response.data.status == "success") {
          await fetchDataDetail()
          handlecloseModalCreate()
          toastAlert("success", "Create Station Success!", 3000)
        }
        else {
          toastAlert("error", "Error Call Api CreateStation!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }

  }

  async function editStation() {
    console.log(valueStationName)
    console.log(valueLineId)
    console.log(valueScheduledLineCode)
    console.log(valueSequence)
    console.log(valueAutoCompletedropDownStationListAutoComplete['code'])
    console.log(ischeckedFirstStation)
    console.log(ischeckedFinishStation)
    console.log(valueRefMFG)
    console.log(valueRefMFGFinish)
    console.log(valueStationId)

    try {
      const response = await instanceAxios.put(`/Station/UpdateStation`,
        {
          name: valueStationName,
          lineId: valueLineId,
          scheduledLineCode: valueScheduledLineCode,
          sequence: valueSequence,
          type: valueAutoCompletedropDownStationListAutoComplete['code'],
          isFirstStation: ischeckedFirstStation,
          isFinishedStation: ischeckedFinishStation,
          refMFG: valueRefMFG,
          refFinishedMFG: valueRefMFGFinish,
          refStation: '1',
          stationId: valueStationId
        }
      ).then(async (response) => {
        if (response.data.status == "success") {
          await fetchDataDetail()
          handlecloseModalEdit()
          toastAlert("success", "Update Station Success!", 3000)
        }
        else {
          toastAlert("error", "Error Call Api UpdateStation!", 3000)
        }
      }, (error) => {
        toastAlert("error", error.response.data.message, 3000)
      })
    } catch (error) {
      console.log('error', error)
    }

  }


  async function deleteStation(id: any) {
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
          const response = await instanceAxios.put(`/Station/RemoveStation?stationId=${id}`).then(async (response) => {
            if (response.data.status == "success") {
              await fetchDataDetail()
              toastAlert("error", "Deleted Station!", 3000)
            }
            else {
              toastAlert("error", "Error Call Api RemoveStation!", 3000)
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
  async function setValueModalEdit(rows: any) {
    setValueStationId(rows['stationId'])
    setValueStationName(rows['name'])
    console.log(rows)
    if (rows['type'] == 1) {
      setShowSequence(true)
      setValueSequence(rows['sequence'])
      setShowFirstStationSwitch(true)
      setIscheckedFirstStation(rows['isFirstStation'])
      setShowFinishStationSwitch(true)
      setIscheckedFinishStation(rows['isFinishedStation'])
      setShowRefFirst(true)
      setValueRefMFG(rows['refMFG'])
      setShowRefFinish(true)
      setValueRefMFGFinish(rows['refFinishedMFG'])
    }
    else if (rows['type'] == 2) {
      setShowSequence(false)
      setValueSequence(null)
      setShowFirstStationSwitch(false)
      setIscheckedFirstStation(false)
      setShowFinishStationSwitch(true)
      setIscheckedFinishStation(false)
      setShowRefFirst(false)
      setValueRefMFG(null)
      setShowRefFinish(true)
      setValueRefMFGFinish(null)
    }
    else if (rows['type'] == 3) {
      setShowSequence(false)
      setValueSequence(null)
      setShowFirstStationSwitch(false)
      setIscheckedFirstStation(false)
      setShowFinishStationSwitch(false)
      setIscheckedFinishStation(false)
      setShowRefFirst(false)
      setValueRefMFG(null)
      setShowRefFinish(false)
      setValueRefMFGFinish(null)
    }

    else if (rows['type'] == 4) {
      setShowSequence(false)
      setValueSequence(null)
      setShowFirstStationSwitch(false)
      setIscheckedFirstStation(false)
      setShowFinishStationSwitch(false)
      setIscheckedFinishStation(false)
      setShowRefFirst(false)
      setValueRefMFG(null)
      setShowRefFinish(false)
      setValueRefMFGFinish(null)
    }
    setValueAutoCompletedropDownStationListAutoComplete(dropDownStationListAutoComplete.filter((item: any) => item['code'] === rows['type'] + '')[0])
    handleopenModalEdit()
  }


  async function setValueModalCreate(rows: any) {
    setValueStationName(null)
    setShowSequence(true)
    setShowFirstStationSwitch(true)
    setShowFinishStationSwitch(true)
    setShowRefFirst(true)
    setShowRefFinish(true)

    setValueSequence(null)
    setIscheckedFirstStation(false)
    setIscheckedFinishStation(false)
    setValueRefMFG(null)
    setValueRefMFGFinish(null)
    setValueAutoCompletedropDownStationListAutoComplete(dropDownStationListAutoComplete[0])
    handleopenModalCreate()
  }


  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      headerAlign: "center",
      sortable: false,
      width: 180,
      renderCell: (params: any) => {
        return (
          <>
            <Button >
              <EditIcon onClick={() => setValueModalEdit(params.row)} />
            </Button>

            <Button >
              <DeleteIcon onClick={() => deleteStation(params.row.stationId)} />
            </Button>
          </>

        );
      },
    },
    {
      field: "name",
      headerName: "Station",
      width: 100,
    },
    {
      field: "type",
      headerName: "Station Type",
      width: 100,
    },
    {
      field: "sequence",
      headerName: "Sequence",
      width: 100,
    },
    {
      field: "isFirstStation",
      headerName: "First Station",
      width: 150,
    },
    {
      field: "isFinishedStation",
      headerName: "Finished Station",
      width: 150,
    },
    {
      field: "refMFG",
      headerName: "refMFG",
      width: 150,
    },
    {
      field: "refStation",
      headerName: "refStation",
      width: 150,
    },
    {
      field: "createdOn",
      headerName: "createdOn",
      width: 200,
    },
    {
      field: "createdBy",
      headerName: "createdBy",
      width: 200,
    },
    {
      field: "modifiedOn",
      headerName: "modifiedOn",
      width: 200,
    },
    {
      field: "modifiedBy",
      headerName: "modifiedBy",
      width: 200,
    }
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
                prm3="station"
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
                      <Button variant="outlined" endIcon={<SaveIcon />} onClick={updateLine}   >
                        Save
                      </Button>
                    </Box>
                  </Grid>
                </Box>
                <Box sx={{ height: "100%", width: "100%", marginTop: "20px" }}>
                  <TextField
                    label="Line Name"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueLineName ? valueLineName : ''}
                    size="small"
                    style={{ width: 400 }}
                    onChange={handleChangeValueLineName}

                  />
                </Box>

                <Box sx={{ height: "30%", width: "100%", marginTop: "20px" }}>
                  <Autocomplete
                    onChange={(event, newValue) => {
                      handleChangeValueAutoCompletedropDownScheduledLineList(newValue)
                    }}
                    disablePortal
                    id="combo-box-demo"
                    value={valueAutoCompletedropDownScheduledLineList}
                    options={dropDownScheduledLineListAutoComplete.map((dropDownScheduledLineListAutoComplete) => dropDownScheduledLineListAutoComplete)}
                    sx={{ width: 400 }}
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
                </Box>

                <Box sx={{ height: "100%", width: "100%", marginTop: "20px", marginBottom: "20px" }}>
                  <TextField
                    label="Task Time"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueTaskTime ? valueTaskTime : ''}
                    size="small"
                    style={{ width: 400 }}
                    onChange={handleChangeValueTaskTime}

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
              <Typography>Station</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Typography>
                <Box sx={{ height: "100%", width: "100%", marginBottom: "20px" }}>
                  <Grid item xs={6} md={12} container justifyContent="flex-end">
                    <Box>
                      <Button variant="outlined" endIcon={<AddBoxIcon />} onClick={setValueModalCreate}  >
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
                    rows={stationList}
                    getRowId={(data) => data.stationId}
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
        >
          <ModalContent sx={{ width: "50vw", height: "70vh" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Station
            </h2>
            <Grid container spacing={2}>

              <Grid item xs={12}>
                <TextField sx={{ width: "100%", height: "12vh" }}
                  label="Station Name"
                  id="outlined-size-small"
                  defaultValue=""
                  value={valueStationName ? valueStationName : ''}
                  size="medium"
                  onChange={handleChangeValueStationName}
                />
              </Grid>


              <Grid item xs={6} md={6}>
                <Autocomplete sx={{ width: "100%", height: "12vh" }}
                  onChange={(event, newValue) => {
                    handleChangeValueAutoCompletedropDownStationList(newValue)
                  }}
                  disablePortal
                  id="combo-box-demo"
                  value={valueAutoCompletedropDownStationListAutoComplete}
                  options={dropDownStationListAutoComplete.map((dropDownStationListAutoComplete) => dropDownStationListAutoComplete)}
                  getOptionLabel={(options: any) => `${options.text}`}
                  renderInput={(params) => <TextField {...params} label="Station Type" />}
                  ListboxProps={
                    {
                      style: {
                        maxHeight: '150px',
                      }
                    }
                  }
                />

              </Grid>
              <Grid item xs={6} md={6}>
                {showSequence && (
                  <TextField sx={{ width: "100%", height: "12vh" }}
                    label="Sequence"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueSequence ? valueSequence : ''}
                    size="medium"
                    onChange={handleChangeValueSequence}

                  />
                )}
              </Grid>


              <Grid item xs={6} md={6}>
                {showFirstStationSwitch && (
                  <FormGroup sx={{ width: "100%", height: "12vh" }}>
                    <FormControlLabel control={<Switch checked={ischeckedFirstStation}
                      onChange={handleChangeShowFirstStationSwitch} />} label="First Station" />
                  </FormGroup>
                )}
              </Grid>

              <Grid item xs={6} md={6}>
                {showRefFirst && (
                  <TextField sx={{ width: "100%", height: "12vh" }}
                    label="Ref. MFG (First Station)"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueRefMFG ? valueRefMFG : ''}
                    size="medium"
                    onChange={handleChangeValueMFG}
                  />
                )}
              </Grid>

              <Grid item xs={6} md={6}>
                {showFinishStationSwitch && (
                  <FormGroup sx={{ width: "100%", height: "12vh" }}>
                    <FormControlLabel control={<Switch checked={ischeckedFinishStation}
                      onChange={handleChangeShowFinishStationSwitch} />} label="Finish Station" />
                  </FormGroup>
                )}
              </Grid>
              <Grid item xs={6} md={6}>
                {showRefFinish && (
                  <TextField sx={{ width: "100%", height: "12vh" }}
                    label="Ref. MFG (Finish Station)"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueRefMFGFinish ? valueRefMFGFinish : ''}
                    size="medium"
                    onChange={handleChangeValueMFGFinish}
                  />
                )}
              </Grid>

              <Grid item xs={6} md={12} container justifyContent="flex-end" >
                <Button variant="outlined" onClick={createStation} sx={{ height: "6vh" }}>
                  Create
                </Button>
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
        >
          <ModalContent sx={{ width: "50vw", height: "70vh" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Edit Station
            </h2>
            <Grid container spacing={2}>

              <Grid item xs={12}>
              <TextField sx={{ width: "100%", height: "12vh" }}
                  label="Station Name"
                  id="outlined-size-small"
                  defaultValue=""
                  value={valueStationName ? valueStationName : ''}
                  size="medium"
                  onChange={handleChangeValueStationName}
                />
              </Grid>


              <Grid item xs={6} md={6}>
                <Autocomplete sx={{ width: "100%", height: "12vh" }}
                  onChange={(event, newValue) => {
                    handleChangeValueAutoCompletedropDownStationList(newValue)
                  }}
                  disablePortal
                  id="combo-box-demo"
                  value={valueAutoCompletedropDownStationListAutoComplete}
                  options={dropDownStationListAutoComplete.map((dropDownStationListAutoComplete) => dropDownStationListAutoComplete)}
                  getOptionLabel={(options: any) => `${options.text}`}
                  renderInput={(params) => <TextField {...params} label="Station Type" />}
                  ListboxProps={
                    {
                      style: {
                        maxHeight: '150px',
                      }
                    }
                  }
                />

              </Grid>
              <Grid item xs={6} md={6}>
                {showSequence && (
                    <TextField  sx={{ width: "100%", height: "12vh" }}
                    label="Sequence"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueSequence ? valueSequence : ''}
                    size="medium"
                    onChange={handleChangeValueSequence}
     
                  />
                )}
              </Grid>


              <Grid item xs={6} md={6}>
                {showFirstStationSwitch && (
                <FormGroup sx={{ width: "100%", height: "12vh" }}>
                    <FormControlLabel control={<Switch checked={ischeckedFirstStation}
                      onChange={handleChangeShowFirstStationSwitch} />} label="First Station" />
                  </FormGroup>
                )}
              </Grid>

              <Grid item xs={6} md={6}>
                {showRefFirst && (
                <TextField sx={{ width: "100%", height: "12vh" }}
                    label="Ref. MFG (First Station)"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueRefMFG ? valueRefMFG : ''}
                    size="medium"
                    onChange={handleChangeValueMFG}
                  />
                )}
              </Grid>

              <Grid item xs={6} md={6}>
                {showFinishStationSwitch && (
                     <FormGroup sx={{ width: "100%", height: "12vh" }}>
                    <FormControlLabel control={<Switch checked={ischeckedFinishStation}
                      onChange={handleChangeShowFinishStationSwitch} />} label="Finish Station" />
                  </FormGroup>
                )}
              </Grid>
              <Grid item xs={6} md={6}>
                {showRefFinish && (
                    <TextField sx={{ width: "100%", height: "12vh" }}
                    label="Ref. MFG (Finish Station)"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueRefMFGFinish ? valueRefMFGFinish : ''}
                    size="medium"
                    onChange={handleChangeValueMFGFinish}
                  />
                )}
              </Grid>

              <Grid item xs={6} md={12} container justifyContent="flex-end" >
                <Button variant="outlined" onClick={editStation}  sx={{ height: "6vh" }}>
                  Save
                </Button>
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