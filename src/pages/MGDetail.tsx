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
import Box from "@mui/material/Box";
import instanceAxios from "../api/axios/instanceAxios";
import { styled } from "@mui/material/styles";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import {
  Backdrop,
  ButtonGroup,
  Card,
  CardHeader,
  Checkbox,
  CircularProgress,
  Divider,
  Fade,
  Grid,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText
} from "@mui/material";
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
import { CreateModelItemAPI, GetListAPI, GetModelGroupDetailAPI, GetScheduledLineAPI } from "@api/axios/modelGroupAPI";

export function MGDetail() {
  const authRequest = {
    ...loginRequest,
  };
  let location = useLocation();
  const valueModelGroupId = location.state.data.modelGroupId;
  const [openModalModelGroupEdit, setOpenModalModelGroupEdit] = React.useState<boolean>(false);
  const [expanded, setExpanded] = React.useState<boolean>(true);
  // Display  ModelGroup Detail 
  const [modelGroupNameDisplay, setModelGroupNameDisplay] = React.useState<string>("");
  const [lineNameDisplay, setLineNameDisplay] = React.useState<string>("");
  const [scheduledLineDisplay, setScheduledLineDisplay] = React.useState<string>("");
  // Modal ModelGroup Detail
  const [scheduledLineDDL,setScheduledLineDDL,] = React.useState<DDLModel[]>([]);
  const [lineNameDDLDisplay, setLineNameDDLDisplay] = React.useState<DDLModel | null>(null);
  const [scheduledLineDDLDisplay, setScheduledLineDDLDisplay] = React.useState<DDLModel | null>(null);
  const [lineDDL, setLineDDL] = React.useState<DDLModel[]>([]);
  // State for post
  // const [valueLine, setValueLine] = React.useState<number>(0);
  const [scheduledLine, setScheduledLine] = React.useState<string>("");
  const [valueModelGroupName, setValueModelGroupName] = React.useState<string>("");
  
  // loading DDL
  const [loadingSL, setLoadingSL] = React.useState<boolean>(false);
  const [loadingLine, setLoadingLine] = React.useState<boolean>(false);

  // Transfer List
  const [addModel , setAddModel] = React.useState<string[]>([]);
  const [removeModel , setRemoveModel] = React.useState<string[]>([]);
  const [modelData , setModelData] = React.useState<DDLModel[]>([]);

  React.useEffect(() => {
    fetchData();
  }, []);

  async function fetchData() {
    try {
      await GetModelGroupDetailAPI(valueModelGroupId).then(async (rs) => {
        if (rs.status === "success") {
          setValueModelGroupName(rs.data.modelGroupDetail.name);
          setModelGroupNameDisplay(rs.data.modelGroupDetail.name);
          setLineNameDisplay(rs.data.modelGroupDetail.lineName);
          setLineNameDDLDisplay({label : rs.data.modelGroupDetail.lineName , value : rs.data.modelGroupDetail.lineId});
          // setValueLine(rs.data.modelGroupDetail.lineId);
          setScheduledLine(rs.data.modelGroupDetail.scheduledLineCode);
          setScheduledLineDisplay(
            `${rs.data.modelGroupDetail.scheduledLineCode}:${rs.data.modelGroupDetail.scheduledLineName}`
          );
          const ddlModel: DDLModel[] = rs.data.dropDownModelList.map(
            (item: any) => ({
              label: `${item.modelName} : ${item.modelCode}`,
              value: item.modelCode,
            })
          );
          setLeft(ddlModel);
          const itemsModel: DDLModel[] = rs.data.modelList.map((item: any) => ({
            label: `${item.modelName} : ${item.modelCode}`,
            value: item.modelCode,
          }));
          setRight(itemsModel);
          setModelData(itemsModel);
        }
      });
    } catch (error: any) {
      toastAlert("error", error, 5000);
    }
  }

  async function handlecloseModalModelGroup() {
    setOpenModalModelGroupEdit(false);
  }
  async function handleExpansion() {
    setExpanded((prevExpanded) => !prevExpanded);
  }

  async function handleChangeValueModelGroupNameEdit(e: any) {
    e.preventDefault();
    setValueModelGroupName(e.target.value);
  }

  async function saveHeader() {
    try {
      await instanceAxios
        .put(`ModelGroup/UpdateModelGroup`, {
          modelGroupId: valueModelGroupId,
          name: valueModelGroupName
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

  async function fetchDataDropDownScheduledLine() {
    try {
      await GetScheduledLineAPI().then(async (rsScheduledLine) => {
        if (rsScheduledLine.status === "success") {
          const scheduledLineDDLModel: DDLModel[] = rsScheduledLine.data.map(
            (item: any) => ({
              label: `${item.scheduledLineCode} : ${item.name}`,
              value: item.scheduledLineCode,
            })
          );
          await  setScheduledLineDDL(scheduledLineDDLModel);
          setLoadingSL(false);
        } else {
          setLoadingSL(false);
        }
      });
    } catch (error) {
      console.log('error', error)
      setLoadingSL(false);
    }
  }

  async function fetchDataDropDownLine(params: any) {
    try {
      await GetListAPI(params).then(async (rs) =>{
        if(rs.status === "success"){
          const ddlList: DDLModel[] = rs.data.map(
            (item: any) => ({
              label: `${item.label}`,
              value: item.value,
            })
          );
         await setLineDDL(ddlList);
          setLoadingLine(false)
        }else{
          setLoadingLine(false)
        }
      })
    } catch (error) {
      console.log('error', error)
    }
  }

  async function handleOpenModalModelGroup() {
    setIsSave(false)
    setOpenModalModelGroupEdit(true);
    setValueModelGroupName(modelGroupNameDisplay);
    setScheduledLineDDLDisplay({label : scheduledLineDisplay , value : scheduledLine})
  }

  const [checked, setChecked] = React.useState<readonly DDLModel[]>([]);
  const [left, setLeft] = React.useState<readonly DDLModel[]>([]);
  const [right, setRight] = React.useState<readonly DDLModel[]>([]);

  const leftChecked = intersection(checked, left);
  const rightChecked = intersection(checked, right);

  function not(a: readonly DDLModel[], b: readonly DDLModel[]) {
    return a.filter((value) => b.indexOf(value) === -1);
  }
  
  function intersection(a: readonly DDLModel[], b: readonly DDLModel[]) {

    return a.filter((value) => b.indexOf(value) !== -1);
  }
  
  function union(a: readonly DDLModel[], b: readonly DDLModel[]) {
    return [...a, ...not(b, a)];
  }

  const handleToggle = (value: DDLModel) => () => {
    const currentIndex = checked.indexOf(value);
    const newChecked = [...checked];

    if (currentIndex === -1) {
      newChecked.push(value);
    } else {
      newChecked.splice(currentIndex, 1);
    }

    setChecked(newChecked);
  };

  const numberOfChecked = (items: readonly DDLModel[]) =>
    intersection(checked, items).length;

  const handleToggleAll = (items: readonly DDLModel[]) => () => {
    if (numberOfChecked(items) === items.length) {
      setChecked(not(checked, items));
    } else {
      setChecked(union(checked, items));
    }
  };

  async function SaveModel() {
    let body = {
      modelGroupId: valueModelGroupId,
      modelCodeAdd: addModel,
      modelCodeRemove: removeModel,
    };
    await CreateModelItemAPI(body).then((rs) => {
      toastAlert(rs.status, rs.message, 5000);
    });
  }

  const handleCheckedRight = () => {
    const leftCheckedValues = leftChecked.map(item => item.value);
    setRight(right.concat(leftChecked));
    setLeft(not(left, leftChecked));
    setChecked(not(checked, leftChecked));
    setAddModel(prevAddModel => [
      ...prevAddModel,
      ...leftCheckedValues.filter(item => 
        !prevAddModel.includes(item) && 
        !modelData.some(model => model.value === item)
      )
    ]);
    setRemoveModel(prevRemoveModel => 
      prevRemoveModel.filter(item => !leftCheckedValues.includes(item))
    );
  };

  const handleCheckedLeft = () => {
    const rightCheckedValues = rightChecked.map(item => item.value);
    const rightCheckedValuesModel = modelData
    .filter(item => rightCheckedValues.includes(item.value))
    .map(item => item.value);

    setLeft(left.concat(rightChecked));
    setRight(not(right, rightChecked));
    setChecked(not(checked, rightChecked));
    setAddModel(prevAddModel => prevAddModel.filter(item => !rightCheckedValues.includes(item)));
    setRemoveModel(prevRemoveModel => [
    ...prevRemoveModel,
    ...rightCheckedValuesModel.filter(item => !prevRemoveModel.includes(item))
  ]);
  };

  const modelDetailList = (title: React.ReactNode, items: readonly DDLModel[]) => (
    <Card>
      <StyledCardHeader
        sx={{ px: 2, py: 1}}
        avatar={
          <>
           <StyledCheckbox
            onClick={handleToggleAll(items)}
            checked={numberOfChecked(items) === items.length && items.length !== 0}
            indeterminate={
              numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0
            }
            sx={{
              color: checked ||  numberOfChecked(items) !== items.length && numberOfChecked(items) !== 0 ? "white" : "inherit",
              "&.Mui-checked": {
                color: "white",
              },
              "&.MuiCheckbox-indeterminate": {
                color: "white",
              },
            }}
            disabled={items.length === 0}
            inputProps={{
              'aria-label': 'all items selected',
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
          width: '100%',
          height: '70vh',
          bgcolor: 'background.paper',
          overflow: 'auto',
        }}
        dense
        component="div"
        role="list"
      >
        {items.map((value: DDLModel) => {
          const labelId = `transfer-list-all-item-${value}-label`;
          return (
            <ListItemButton
              key={`cus_${value.value}`}
              role="listitem"
              onClick={handleToggle(value)}
              sx={{ py:0}}
            >
              <ListItemIcon>
                <Checkbox
                  checked={checked.indexOf(value) !== -1}
                  tabIndex={-1}
                  disableRipple
                  inputProps={{
                    'aria-labelledby': labelId,
                  }}
                  sx={{ py:0}}
                />
              </ListItemIcon>
              <ListItemText id={labelId} primary={`${value.label}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  const [isSave, setIsSave] = React.useState<boolean>(false);
  React.useEffect(() => {
    const isSave = !valueModelGroupName.trim();
    setIsSave(isSave);
  }, [valueModelGroupName]);
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
              <Grid container>
                <Grid item xs={12} md={10} xl={10}>
                  <Grid container spacing={0}>
                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          Model Group Name :
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {modelGroupNameDisplay}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          Scheduled Line:
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {scheduledLineDisplay}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          Line:
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {lineNameDisplay}
                        </Typography>
                      </Box>
                    </Grid>
                  </Grid>
                </Grid>
                <Grid item xs={12} md={2} xl={2}>
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
                        onClick={() => handleOpenModalModelGroup()}
                      >
                        EDIT
                      </Button>
                    </ButtonGroup>
                  </Grid>
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
              <Typography>Model</Typography>
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
                  {modelDetailList("Model Items", left)}
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
        </Box>

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
                  value={valueModelGroupName ? valueModelGroupName : ""}
                  size="small"
                  style={{ width: "100%" }}
                  onChange={handleChangeValueModelGroupNameEdit}
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <Autocomplete
                  id="combo-SCLine-box-demo"
                  sx={{ width: "100%" }}
                  size="small"
                  onOpen={async () => {
                    setLoadingSL(true);
                    await fetchDataDropDownScheduledLine();
                  }}
                  disabled={true}
                  loading={loadingSL}
                  options={scheduledLineDDL}
                  value={scheduledLineDDLDisplay}
                  onChange={(_, value) => {
                    if (value?.value) {
                      setScheduledLine(value?.value ?? "");
                      setScheduledLineDDLDisplay(
                        scheduledLineDDL.find(
                          (it) => it.value == value?.value
                        ) ?? null
                      );
                    }
                   
                  }}
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  getOptionLabel={(options: any) => `${options.label}`}
                  onClose={() => setLoadingSL(false)}
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
                  onOpen={async () => {
                    setLoadingLine(true);
                    await fetchDataDropDownLine(scheduledLine);
                  }}
                  onClose={() => setLoadingLine(false)}
                  size="small"
                  id="Line-box"
                  value={lineNameDDLDisplay}
                  options={lineDDL}
                  loading={loadingLine}
                  disabled={true}
                  // onChange={(_, value) => {
                  //   setValueLine(Number(value?.value ?? 0));
                  //   setLineNameDDLDisplay(
                  //     lineDDL.find(
                  //       (it) => it.value == value?.value
                  //     ) ?? null
                  //   );
                  // }}

                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
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
                      disabled={isSave}
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

