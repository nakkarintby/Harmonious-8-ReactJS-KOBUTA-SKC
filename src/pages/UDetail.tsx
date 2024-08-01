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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import React, { useEffect, useState } from "react";
import {
  AccordionProps,
  AccordionSlots,
  Autocomplete,
  Box,
  Button,
  Fade,
  FormControlLabel,
  Grid,
  styled,
  Switch,
  TextField,
  Typography,
} from "@mui/material";
import {
  Backdrop,
  ButtonGroup,
  Card,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";
import MuiAccordion from "@mui/material/Accordion";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import instanceAxios from "@api/axios/instanceAxios";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";

import { useLocation } from "react-router-dom";
import CheckBoxOutlineBlankIcon from "@mui/icons-material/CheckBoxOutlineBlank";
import CheckBoxIcon from "@mui/icons-material/CheckBox";

export function UDetail() {
  const authRequest = {
    ...loginRequest,
  };
  const [expanded, setExpanded] = React.useState<boolean>(true);

  let location = useLocation();
  const [valueUserId, setValueUserId] = React.useState(location.state.userId);
  const [valueEmpId, setValueEmpId] = React.useState(null);
  const [valueFirstName, setValueFirstName] = React.useState(null);
  const [valueLastName, setValueLastName] = React.useState(null);
  const [valueEmail, setValueEmail] = React.useState(null);
  const [valueSuperUser, setValueSuperUser] = React.useState(false);
  const [valueSuperUserTmp, setValueSuperUserTmp] = React.useState(false);
  const [
    dropDownSystemRoleListAutoComplete,
    setDropDownSystemRoleListAutoComplete,
  ] = useState([]);
  const [
    valueAutoCompletedropDownSystemRoleList,
    setValueAutoCompletedropDownSystemRoleList,
  ] = React.useState(Object);
  const [
    dropDownScheduledLineListAutoComplete,
    setDropDownScheduledLineListAutoComplete,
  ] = useState([]);
  const [
    valueAutoCompleteScheduledLineList,
    setValueAutoCompleteScheduledLineList,
  ] = React.useState([]);
  const [
    valueAutoCompleteScheduledLineListTmp,
    setValueAutoCompleteScheduledLineListTmp,
  ] = React.useState([]);
  const [loadingSL, setLoadingSL] = React.useState(false);
  const [valuePersonalId, setValuePersonalId] = React.useState(null);
  const [valueSystemRoleId, setValueSystemRoleId] = React.useState(null);
  const [valueSystemRoleName, setValueSystemRoleName] = React.useState(null);
  const [openModalEditUser, setOpenModalEditUser] = React.useState(false);
  const handleCloseModalEditUser = () => setOpenModalEditUser(false);
  const icon = <CheckBoxOutlineBlankIcon fontSize="small" />;
  const checkedIcon = <CheckBoxIcon fontSize="small" />;

  useEffect(() => {
    fetchDataUser();
  }, []);

  const [addModel, setAddModel] = React.useState<Item[]>([]);
  const [removeModel, setRemoveModel] = React.useState<Item[]>([]);
  const [modelData, setModelData] = React.useState<Item[]>([]);

  const [checked, setChecked] = React.useState<readonly Item[]>([]);
  const [left, setLeft] = React.useState<readonly Item[]>([]);
  const [right, setRight] = React.useState<readonly Item[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  interface Item {
    scheduledLineCode: string;
    scheduledLineName: string;
    lineId: number;
    lineName: string;
    stationId: number;
    stationName: string;
  }

  function not(a: readonly Item[], b: readonly Item[]) {
    return a.filter((value) => b.indexOf(value) === -1);
  }

  function intersection(a: readonly Item[], b: readonly Item[]) {
    return a.filter((value) => b.indexOf(value) !== -1);
  }

  function union(a: readonly Item[], b: readonly Item[]) {
    return [...a, ...not(b, a)];
  }

  const handleToggle = (value: Item) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly Item[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly Item[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  async function fetchDataUser() {
    try {
      await instanceAxios.get(`/User/GetUserById?userId=${valueUserId}`).then(
        async (response) => {
          if (response.data.status == "success") {
            setValueUserId(response.data.data.userInfo["userId"]);
            setValueEmpId(response.data.data.userInfo["empId"]);
            setValueFirstName(response.data.data.userInfo["firstName"]);
            setValueLastName(response.data.data.userInfo["lastName"]);
            setValueEmail(response.data.data.userInfo["email"]);
            setValueSuperUser(response.data.data.userInfo["isSuperUser"]);
            setValueSuperUserTmp(response.data.data.userInfo["isSuperUser"]);
            setValuePersonalId(response.data.data.userInfo["personalId"]);
            setValueSystemRoleId(response.data.data.userInfo["systemRoleId"]);
            setValueSystemRoleName(
              response.data.data.userInfo["systemRoleName"]
            );
            setValueAutoCompleteScheduledLineListTmp(
              response.data.data.scheduledLine
            );
            setLeft(response.data.data.dropDownLineStationList);
            setRight(response.data.data.lineStationList);
            setModelData(response.data.data.lineStationList);
          } else {
            toastAlert("error", "Error Call Api GetUserById!", 3000);
          }
        },
        (error) => {
          toastAlert("error", error.response.data.message, 3000);
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchDataSystemRole() {
    try {
      await instanceAxios
        .get(`/SystemRole/GetSystemRole?page=1&perpage=1000`)
        .then(
          async (response) => {
            if (response.data.status == "success") {
              setDropDownSystemRoleListAutoComplete(response.data.data);
              setValueAutoCompletedropDownSystemRoleList(
                response.data.data.filter(
                  (item: any) => item["systemRoleId"] === valueSystemRoleId
                )[0]
              );
              setLoadingSL(false);
            } else {
              setLoadingSL(false);
              toastAlert("error", "Error Call Api GetSystemRole!", 3000);
            }
          },
          (error) => {
            setLoadingSL(false);
            toastAlert("error", error.response.data.message, 3000);
          }
        );
    } catch (error) {
      console.log("error", error);
    }
  }

  async function fetchDataScheduledLine() {
    try {
      await instanceAxios
        .get(`/ScheduledLine/GetScheduledLine?page=1&perpage=1000`)
        .then(
          async (response) => {
            if (response.data.status == "success") {
              setDropDownScheduledLineListAutoComplete(response.data.data);
              handleChangeValueAutoCompletedropDownScheduledLineList(
                response.data.data.filter((x: any) =>
                  valueAutoCompleteScheduledLineListTmp.some(
                    (y) => x["scheduledLineCode"] === y["scheduledLineCode"]
                  )
                )
              );
            } else {
              toastAlert("error", "Error Call Api GetScheduledLine!", 3000);
            }
          },
          (error) => {
            toastAlert("error", error.response.data.message, 3000);
          }
        );
    } catch (error) {
      console.log("error", error);
    }
  }

  async function validateSaveEditUser() {
    if (valueAutoCompletedropDownSystemRoleList == null) {
      toastAlert("error", "Plase Enter Data SystemRole", 3000);
      return false;
    }
    if (valueSuperUser == false) {
      if (valueAutoCompleteScheduledLineList.length == 0) {
        toastAlert("error", "Plase Enter Data ScheduledLine ", 3000);
        return false;
      }
    }
    return true;
  }

  async function SaveEditUser() {
    if (await validateSaveEditUser()) {
      try {
        if (valueSuperUser) {
          await instanceAxios
            .put(`/User/UpdateUser`, {
              userId: valueUserId,
              empId: valueEmpId,
              firstName: valueFirstName,
              lastName: valueLastName,
              email: valueEmail,
              systemRoleId:
                valueAutoCompletedropDownSystemRoleList["systemRoleId"],
              personalId: valuePersonalId,
              isSuperUser: valueSuperUser,
              scheduledLine: [],
            })
            .then(
              async (response) => {
                if (response.data.status == "success") {
                  CloseModalEditUser();
                  toastAlert("success", "Edit UpdateUser Success!", 3000);
                } else {
                  toastAlert("error", "Error Call Api UpdateUser!", 3000);
                }
              },
              (error) => {
                toastAlert("error", error.response.data.message, 3000);
              }
            );
        } else {
          await instanceAxios
            .put(`/User/UpdateUser`, {
              userId: valueUserId,
              empId: valueEmpId,
              firstName: valueFirstName,
              lastName: valueLastName,
              email: valueEmail,
              systemRoleId:
                valueAutoCompletedropDownSystemRoleList["systemRoleId"],
              personalId: valuePersonalId,
              isSuperUser: valueSuperUser,
              scheduledLine: valueAutoCompleteScheduledLineList,
            })
            .then(
              async (response) => {
                if (response.data.status == "success") {
                  CloseModalEditUser();
                  toastAlert("success", "Edit UpdateUser Success!", 3000);
                } else {
                  toastAlert("error", "Error Call Api UpdateUser!", 3000);
                }
              },
              (error) => {
                toastAlert("error", error.response.data.message, 3000);
              }
            );
        }
      } catch (error) {
        console.log("error", error);
      }
    }
  }

  async function handleExpansion() {
    setExpanded((prevExpanded) => !prevExpanded);
  }
  async function CloseModalEditUser() {
    handleCloseModalEditUser();
    await fetchDataUser();
    await fetchDataScheduledLine();
    await fetchDataSystemRole();
  }
  async function handleopenModalEditSystemRole() {
    setDropDownSystemRoleListAutoComplete([]);
    setValueAutoCompletedropDownSystemRoleList(null);
    setDropDownScheduledLineListAutoComplete([]);
    setValueAutoCompleteScheduledLineList([]);
    await fetchDataUser();
    await fetchDataScheduledLine();
    await fetchDataSystemRole();
    setOpenModalEditUser(true);
  }

  async function handleChangeValueAutoCompletedropDownSystemRoleList(e: any) {
    setValueAutoCompletedropDownSystemRoleList(e);
  }

  async function handleChangeValueAutoCompletedropDownScheduledLineList(
    e: any
  ) {
    setValueAutoCompleteScheduledLineList(e);
  }

  async function handleChangeSwitchSuperUser(e: any) {
    setValueSuperUser(e.target.checked);
  }

  async function SaveModel() {
    try {
      await instanceAxios
        .post(`/MappingUserStation/CreateRemoveMappingUserStation`, {
          userId: valueUserId,
          add: addModel,
          remove: removeModel,
        })
        .then(
          async (response) => {
            if (response.data.status == "success") {
              setLeft([]);
              setRight([]);
              setModelData([]);
              setAddModel([]);
              setRemoveModel([]);
              await fetchDataUser();
              toastAlert("success", "Save MappingUserStatation Success!", 3000);
            } else {
              toastAlert(
                "error",
                "Error Call Api CreateRemoveMappingUserStation!",
                3000
              );
            }
          },
          (error) => {
            toastAlert("error", error.response.data.message, 3000);
          }
        );
    } catch (error) {
      console.log("error", error);
    }
  }

  const handleCheckedRight = () => {
    const leftCheckedValues = leftChecked.map((item: any) => item);
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    setAddModel((prevAddModel) => [
      ...prevAddModel,
      ...leftCheckedValues.filter(
        (item) =>
          !prevAddModel.includes(item) &&
          !modelData.some((model) => model === item)
      ),
    ]);

    setRemoveModel((prevRemoveModel) =>
      prevRemoveModel.filter((item) => !leftCheckedValues.includes(item))
    );
  };

  const handleCheckedLeft = () => {
    const rightCheckedValues = rightChecked.map((item: any) => item);
    const rightCheckedValuesModel = modelData
      .filter((item: any) => rightCheckedValues.includes(item))
      .map((item: any) => item);

    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    setAddModel((prevAddModel) =>
      prevAddModel.filter((item) => !rightCheckedValues.includes(item))
    );
    setRemoveModel((prevRemoveModel) => [
      ...prevRemoveModel,
      ...rightCheckedValuesModel.filter(
        (item) => !prevRemoveModel.includes(item)
      ),
    ]);
  };

  const modelDetailList = (title: React.ReactNode, items: readonly Item[]) => (
    <Card>
      <StyledCardHeader
        sx={{ px: 2, py: 1 }}
        avatar={
          <>
            <StyledCheckbox
              onClick={handleToggleAll(items)}
              checked={
                numberOfChecked(items) === items.length && items.length !== 0
              }
              indeterminate={
                numberOfChecked(items) !== items.length &&
                numberOfChecked(items) !== 0
              }
              sx={{
                color:
                  checked ||
                  (numberOfChecked(items) !== items.length &&
                    numberOfChecked(items) !== 0)
                    ? "white"
                    : "inherit",
                "&.Mui-checked": {
                  color: "white",
                },
                "&.MuiCheckbox-indeterminate": {
                  color: "white",
                },
              }}
              disabled={items.length === 0}
              inputProps={{
                "aria-label": "all items selected",
              }}
            />
          </>
        }
        title={title}
        subheader={`${numberOfChecked(items)}/${items.length} selected`}
      />
      <Divider />
      <List
        sx={{
          width: "100%",
          height: "70vh",
          bgcolor: "background.paper",
          overflow: "auto",
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: Item) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItemButton
              key={`cus_${value.stationId}`}
              role="listitem"
              onClick={handleToggle(value)}
              sx={{ py: 0 }}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    "aria-labelledby": labelId,
                  }}
                  sx={{ py: 0 }}
                />
              </ListItemIcon>
              <ListItemText
                id={labelId}
                primary={`${value.scheduledLineCode} - ${value.lineName} - ${value.stationName}`}
              />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

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
              <Typography sx={{ flexShrink: 0 }}>User Information</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item xs={10} md={10} xl={10}>
                  <Grid container>
                    <Grid item xs={12} md={7}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          EmployeeID :
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {valueEmpId}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          SystemRole :
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {valueSystemRoleName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          First Name :
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {valueFirstName}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          Last Name :
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {valueLastName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={7}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          SuperUser :
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {valueSuperUserTmp + ""}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          ScheduleLine :
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {valueAutoCompleteScheduledLineListTmp
                            .map(
                              (valueAutoCompleteScheduledLineListTmp) =>
                                valueAutoCompleteScheduledLineListTmp[
                                  "scheduledLineCode"
                                ] +
                                ":" +
                                valueAutoCompleteScheduledLineListTmp[
                                  "scheduledLineName"
                                ]
                            )
                            .join(" | ")}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={12}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          Email :
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {valueEmail}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
                  <Grid container>
                    <Grid
                      item
                      xs={12}
                      md={12}
                      container
                      justifyContent="flex-end"
                    >
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
                </Grid>
              </Grid>
            </AccordionDetails>
          </Accordion>

          {!valueSuperUserTmp && (
            <Accordion defaultExpanded={true}>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel2-content"
                id="panel2-header"
              >
                <Typography>Station</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Grid
                  container
                  spacing={1}
                  justifyContent="center"
                  alignItems="center"
                >
                  <Grid
                    item
                    xs={12}
                    md={12}
                    container
                    justifyContent="flex-end"
                    alignItems="center"
                  >
                    <Button
                      variant="contained"
                      onClick={() => {
                        SaveModel();
                      }}
                    >
                      Save
                    </Button>
                  </Grid>
                  <Grid item md={5} xs={5}>
                    {modelDetailList("Station Items", left)}
                  </Grid>
                  <Grid item md={2} xs={2}>
                    <Grid container direction="column" alignItems="center">
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedRight}
                        disabled={leftChecked.length === 0}
                        aria-label="move selected right"
                      >
                        &gt;
                      </Button>
                      <Button
                        sx={{ my: 0.5 }}
                        variant="outlined"
                        size="small"
                        onClick={handleCheckedLeft}
                        disabled={rightChecked.length === 0}
                        aria-label="move selected left"
                      >
                        &lt;
                      </Button>
                    </Grid>
                  </Grid>
                  <Grid item md={5} xs={5}>
                    {modelDetailList("Used", right)}
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          )}
        </Box>

        {/* edit */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalEditUser}
          // onClose={handleCloseModalCreateModelGroup}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "30vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Edit User
            </h2>

            <Box>
              <Grid container spacing={2}>
                <Grid item xs={6} md={12}>
                  <TextField
                    disabled
                    sx={{
                      width: "100%",
                      backgroundColor: "whitesmoke",
                      "& .MuiInputBase-input.Mui-disabled": {
                        WebkitTextFillColor: "black",
                      },
                    }}
                    label="Employee ID"
                    id="outlined-size-small"
                    defaultValue=""
                    size="small"
                    inputProps={{ maxLength: 200 }}
                    value={valueEmpId ? valueEmpId : ""}
                  />
                </Grid>

                <Grid item xs={6} md={12}>
                  <TextField
                    disabled
                    sx={{
                      width: "100%",
                      backgroundColor: "whitesmoke",
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
                      width: "100%",
                      backgroundColor: "whitesmoke",
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
                      width: "100%",
                      backgroundColor: "whitesmoke",
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

                <Grid item xs={6} md={12}>
                  <Autocomplete
                    sx={{ width: "100%" }}
                    size="small"
                    // onOpen={() => {
                    //   setLoadingSL(true);
                    //   fetchDataSystemRole();
                    // }}
                    // onClose={() => setLoadingSL(false)}
                    // loading={loadingSL}
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
                    getOptionLabel={(options: any) => `${options.name}`}
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
                {!valueSuperUser && (
                  <Grid item xs={6} md={12}>
                    <Autocomplete
                      multiple
                      value={valueAutoCompleteScheduledLineList}
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
                        `${options.scheduledLineCode}:${options.name} `
                      }
                      renderOption={(props, option: any, { selected }) => {
                        const { key, ...optionProps } = props;
                        return (
                          <li key={key} {...optionProps}>
                            <Checkbox
                              icon={icon}
                              checkedIcon={checkedIcon}
                              style={{ marginRight: 8 }}
                              checked={selected}
                            />
                            {option.scheduledLineCode}:{option.name}
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
                      <Button variant="outlined" onClick={CloseModalEditUser}>
                        Close
                      </Button>
                      <Button
                        variant="contained"
                        onClick={SaveEditUser}
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
  boxShadow: `0 4px 12px ${
    theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.2)"
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

const StyledCardHeader = styled(CardHeader)(() => ({
  backgroundColor: "#19857b",
  color: "white",
  "& .MuiCardHeader-avatar": {
    color: "white",
  },
  "& .MuiCardHeader-title": {
    color: "white",
  },
  "& .MuiCardHeader-subheader": {
    color: "white",
  },
}));
const StyledCheckbox = styled(Checkbox)(() => ({
  color: "white",
}));
