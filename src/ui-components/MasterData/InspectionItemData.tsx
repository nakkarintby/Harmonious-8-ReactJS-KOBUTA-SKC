// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { grey } from "@mui/material/colors";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Backdrop,
  Box,
  Button,
  CircularProgress,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { DataGrid, GridColDef } from "@mui/x-data-grid";

import instanceAxios from "../../api/axios/instanceAxios";
import React from "react";
import { TextField } from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";
import _ from "lodash";
import { styled, css } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import toastAlert from "../SweetAlert2/toastAlert";
import moment from "moment";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';

interface InspectionItem {
  id: number;
  inspectionGroupId: number;
  sequence: number;
  topic: string;
  remark: string;
  type: string;
  min: string;
  max: string;
  target: string;
  unit: string;
  isRequired: boolean;
  isPinCode: boolean;
  isDeleted: boolean;
  createdOn: string;
  createdBy: string;
  modifiedOn: string;
  modifiedBy: string;
}

async function GetInsItemAPI(insItemID: number) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(
        `/InspectionItem/GetInspectionItemByInspectionGroupId?inspectionGroupId=${insItemID}`
      )
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        console.log("Err");
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

async function UpdateInsItemAPI(body: any) {
  try {
    await instanceAxios
      .put(`/InspectionItem/UpdateInspectionItem`, body)
      .then(async function (response: any) {
        toastAlert(`${response.data.status}`, `${response.data.message}`, 5000);
      })
      .catch(function (error: any) {
        toastAlert(`error`, `Admin`, 5000);
      });
  } catch (err) {
    toastAlert(`error`, `${err}`, 5000);
  }
}

async function  DeletedInsItemAPI(insItemId : number) {
  try {
    await instanceAxios
      .put(`/InspectionItem/UpdateInspectionItem`, body)
      .then(async function (response: any) {
        toastAlert(`${response.data.status}`, `${response.data.message}`, 5000);
      })
      .catch(function (error: any) {
        toastAlert(`error`, `Admin`, 5000);
      });
  } catch (err) {
    toastAlert(`error`, `${err}`, 5000);
  }
}

interface DDLModel {
  lable: string;
  value: string;
}

export default function InspectionItemData(props: {
  dataGroupId: number;
  InsType: DDLModel[];
}) {
  const { dataGroupId, InsType } = props;
  const [openBackDrop, setOpenBackDrop] = React.useState(true);
  const [dataPageList, setDataPageList] = React.useState<InspectionItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);
  
  const [insItemId, setInsItemId] = React.useState<number>(0);
  const [insType, setInsType] = React.useState<string>("1");
  const [insItemMin, setInsItemMin] = React.useState<string>("");
  const [insItemMax, setInsItemMax] = React.useState<string>("");
  const [insItemTarget, setInsItemTarget] = React.useState<string>("");
  const [insItemUnit, setInsItemUnit] = React.useState<string | null>(null);
  const [insItemRemark, setInsItemRemark] = React.useState<string>("");
  const [insItemSeq, setInsItemSeq] = React.useState<number>(0);
  const [insItemTopic, setInsItemTopic] = React.useState<string>("");
  const [insItemReq, setInsItemReq] = React.useState<boolean>(false);
  const [insItemPin, setInsItemPin] = React.useState<boolean>(true);
  const [showMeasurement, setShowMeasurement] = React.useState(false);
  const [showQRCodeList, setShowQRCodeList] = React.useState(false);
  const [showRecord, setShowRecord] = React.useState(false);
  const handleChangeInspectionType = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInsType(event.target.value);
    if (event.target.value == "2") {
      setShowMeasurement(true);
      setShowQRCodeList(false);
      setShowRecord(false);
    } else {
      setShowMeasurement(false);
      setInsItemMin("");
      setInsItemMax("");
      setInsItemTarget("");
      setInsItemUnit("");
    }

    if (event.target.value == "3") {
      setShowRecord(true);
      setShowMeasurement(false);
      setShowQRCodeList(false);
    } else {
      setShowRecord(false);
    }

    if (event.target.value == "4") {
      setShowQRCodeList(true);
    } else {
      setShowQRCodeList(false);
    }
  };

  function GetInsItemPage(){
    GetInsItemAPI(dataGroupId).then((x) => {
      if (x.status == "success") {
        const insItemsData: InspectionItem[] = x.data.map((item: any) => ({
          id: item.inspectionItemId,
          inspectionGroupId: item.inspectionGroupId,
          sequence: item.sequence,
          topic: item.topic,
          type: item.type,
          min: item.min,
          max: item.max,
          target: item.target,
          unit: item.unit,
          remark: item.remark,
          isRequired: item.isRequired,
          isPinCode: item.isPinCode,
          createdOn: moment(item.createdOn).format("DD-MM-YYYY HH:mm:ss"),
          createdBy: item.createdBy,
          modifiedOn: item.modifiedOn ? moment(item.modifiedOn).format("DD-MM-YYYY HH:mm:ss") : "",
          modifiedBy: item.modifiedBy,
        }));
        setDataPageList(insItemsData);
        setOpenBackDrop(false)
      }
    });
  }

  function SetUpDataEdit(Id: any) {
    const dataSetUp = _.find(dataPageList, { id: Id });
    setInsItemId(Id);
    setInsItemSeq(dataSetUp.sequence);
    setInsItemTopic(dataSetUp.topic);
    setInsType(String(dataSetUp.type));
    setInsItemRemark(dataSetUp.remark);
    setInsItemReq(dataSetUp.isRequired);
    setInsItemMin(dataSetUp.min);
    setInsItemMax(dataSetUp.max);
    setInsItemTarget(dataSetUp.target);
    setInsItemPin(dataSetUp.isPinCode);
    setInsItemUnit(dataSetUp.unit);
    SetUpInsType(dataSetUp.type);
  }

  function SetUpInsType(val: string) {
    if (val == "2") {
      setShowMeasurement(true);
      setShowQRCodeList(false);
      setShowRecord(false);
    } else {
      setShowMeasurement(false);
      setInsItemMin("");
      setInsItemMax("");
      setInsItemTarget("");
      setInsItemUnit("");
    }

    if (val == "3") {
      setShowRecord(true);
      setShowMeasurement(false);
      setShowQRCodeList(false);
    } else {
      setInsItemReq(true);
      setShowRecord(false);
    }

    if (val == "4") {
      setShowQRCodeList(true);
    } else {
      setShowQRCodeList(false);
    }
  }

  async function UpdateData() {
    const min =
      insItemMin !== null && insItemMin.length > 0
        ? parseFloat(insItemMin).toFixed(3)
        : insItemMin;
    const max =
      insItemMax !== null && insItemMax.length > 0
        ? parseFloat(insItemMax).toFixed(3)
        : insItemMax;
    const target =
      insItemTarget !== null && insItemTarget.length > 0
        ? parseFloat(insItemTarget).toFixed(3)
        : insItemTarget;
    let body;
    switch (insType) {
      case "1":
        body = {
          inspectionItemId: insItemId,
          topic: insItemTopic,
          inspectionGroupId: dataGroupId,
          sequence: insItemSeq,
          type: insType,
          remark: insItemRemark,
        };
        break;
      case "2":
        body = {
          inspectionItemId: insItemId,
          topic: insItemTopic,
          inspectionGroupId: dataGroupId,
          sequence: insItemSeq,
          type: insType,
          min: min,
          max: max,
          target: target,
          unit: insItemUnit,
          remark: insItemRemark,
        };
        break;
      case "3":
        body = {
          inspectionItemId: insItemId,
          topic: insItemTopic,
          inspectionGroupId: dataGroupId,
          sequence: insItemSeq,
          type: insType,
          isRequired: insItemReq,
          remark: insItemRemark,
        };
        break;
      case "4":
        body = {
          inspectionItemId: insItemId,
          topic: insItemTopic,
          inspectionGroupId: dataGroupId,
          sequence: insItemSeq,
          type: insType,
          isPinCode: insItemPin,
          remark: insItemRemark,
          qrItemValue: [],
        };
        break;
      default:
        body = null; // Handle other cases if needed
        break;
    }
    console.log(body)
    await UpdateInsItemAPI(body);
  }



  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      headerAlign: "center",
      align: "left",
      width: 150,
      sortable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <>
          <Button
            onClick={() => {
              handleOpen();
              SetUpDataEdit(row.id);
            }}
          >
            <EditIcon />
          </Button>
          <Button>
            <DeleteIcon />
          </Button>
        </>
      ),
    },
    {
      field: "sequence",
      headerName: "Sequence",
      width: 100,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "topic",
      headerName: "topic",
      width: 350,
      headerAlign: "center",
    },
    {
      field: "type",
      headerName: "Type",
      width: 150,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdOn",
      headerName: "Created On",
      width: 200,
      headerAlign: "center",
    },
    {
      field: "createdBy",
      headerName: "Created By",
      width: 100,
      headerAlign: "center",
    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      width: 200,
      headerAlign: "center",
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      width: 100,
      headerAlign: "center",
    },
  ];

  React.useEffect(() => {
    const FetchMenu = async () => {
      GetInsItemPage();
    };
    FetchMenu();
  }, []);

  return (
    <>
      <Backdrop
        sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
        open={openBackDrop}
      >
        <CircularProgress color="inherit" />
      </Backdrop>
      <div>
     
        <Accordion>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            Items
          </AccordionSummary>
          <AccordionDetails>
            <Box sx={{ height: "100%", width: "100%" }}>
              <DataGrid
                sx={{
                  boxShadow: 2,
                  border: 2,
                  borderColor: "primary.light",
                  "& .MuiDataGrid-cell:hover": {
                    color: "primary.main",
                  },
                }}
                rows={dataPageList}
                rowHeight={40}
                columns={columns}
                initialState={{
                  pagination: {
                    paginationModel: { page: 0, pageSize: 20 },
                  },
                }}
                pageSizeOptions={[5, 10]}
              />
            </Box>
          </AccordionDetails>
        </Accordion>
      </div>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        onClose={handleClose}
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent sx={{ width: 400 }}>
          <h2 id="unstyled-modal-title" className="modal-title">
            Edit Inspection Group Item
          </h2>
          <Grid container spacing={2}>
            <Grid item xs={6} md={12}>
              <TextField
                label="Sequence"
                id="outlined-size-small"
                size="small"
                defaultValue={insItemSeq}
                style={{ width: 400 }}
                onChange={(e) => {
                  setInsItemSeq(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6} md={12}>
              <TextField
                label="Topic"
                id="outlined-size-small"
                defaultValue={insItemTopic}
                size="small"
                style={{ width: 400 }}
                onChange={(e) => {
                  setInsItemTopic(e.target.value);
                }}
              />
            </Grid>
            <Grid item xs={6} md={12}>
              <TextField
                label="Remark"
                id="outlined-size-small"
                defaultValue={insItemRemark}
                size="small"
                style={{ width: 400 }}
                onChange={(e) => {
                  setInsItemRemark(e.target.value);
                }}
              />
            </Grid>

            <Grid item xs={6} md={12}>
              <FormControl>
                <InputLabel id="demo-simple-select-helper-label">
                  Inspection Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  defaultValue={insType}
                  label="InspectionType"
                  onChange={handleChangeInspectionType}
                  size="small"
                  style={{ width: 400 }}
                >
                  {_.map(InsType, function (i: DDLModel) {
                    return (
                      <MenuItem key={i.value} value={i.value}>
                        {i.lable}
                      </MenuItem>
                    );
                  })}
                </Select>
              </FormControl>
            </Grid>
            {showMeasurement && (
              <Grid item xs={6} md={4}>
                <TextField
                  label="Min"
                  id="outlined-size-small"
                  defaultValue={insItemMin}
                  size="small"
                  style={{ width: 120 }}
                  onChange={(e) => {
                    setInsItemMin(e.target.value);
                  }}
                />
              </Grid>
            )}

            {showMeasurement && (
              <Grid item xs={6} md={4}>
                <TextField
                  label="Max"
                  id="outlined-size-small"
                  defaultValue={insItemMax}
                  size="small"
                  style={{ width: 120 }}
                  onChange={(e) => {
                    setInsItemMax(e.target.value);
                  }}
                />
              </Grid>
            )}
            {showMeasurement && (
              <Grid item xs={6} md={4}>
                <TextField
                  label="Target"
                  id="outlined-size-small"
                  defaultValue={insItemTarget}
                  size="small"
                  style={{ width: 120 }}
                  onChange={(e) => {
                    setInsItemTarget(e.target.value);
                  }}
                />
              </Grid>
            )}
            {showMeasurement && (
              <Grid item xs={6} md={12}>
                <TextField
                  label="Unit"
                  id="outlined-size-small"
                  defaultValue={insItemUnit}
                  size="small"
                  style={{ width: 400 }}
                  onChange={(e) => {
                    setInsItemUnit(e.target.value);
                  }}
                />
              </Grid>
            )}
            {showRecord && (
              <Grid item xs={6} md={12}>
                <FormControlLabel
                  control={<Switch />}
                  checked={insItemReq}
                  label="Required"
                  onChange={(event, value) => {
                    setInsItemReq(value);
                  }}
                />
              </Grid>
            )}
            {showQRCodeList && (
              <>
                <Grid item xs={6} md={6}>
                  <Button
                    component="label"
                    role={undefined}
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                  >
                    Upload file
                    <VisuallyHiddenInput type="file" />
                  </Button>
                </Grid>
                <Grid item xs={6} md={6}>
                  <FormControlLabel
                    control={<Switch />}
                    checked={insItemPin}
                    label="PinCode"
                    onChange={(event, value) => {
                      setInsItemPin(value);
                    }}
                  />
                </Grid>
              </>
            )}
            {showQRCodeList && (
              <Grid item xs={6} md={12}>
                <DataGrid
                  sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: "primary.light",
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  rows={rows}
                  rowHeight={40}
                  columns={columns}
                  initialState={{
                    pagination: {
                      paginationModel: { page: 0, pageSize: 5 },
                    },
                  }}
                  pageSizeOptions={[5, 10]}
                />
              </Grid>
            )}
            <Grid item xs={6} md={12} container justifyContent="flex-end">
              <Box>
                <Button
                  variant="outlined"
                  onClick={async () => {
                    setOpenBackDrop(true);
                    setOpen(false);
                    await UpdateData().then((x) => {});
                    GetInsItemPage();
                  }}
                >
                  Edit
                </Button>
              </Box>
            </Grid>
          </Grid>
        </ModalContent>
      </Modal>
    </>
  );
}

const rows = [
  { id: 1, qrcode: "TC430-49543" },
  { id: 2, qrcode: "TC832-49462" },
  { id: 3, qrcode: "3C319-98291" },
  { id: 4, qrcode: "TC402-98413" },
];

const VisuallyHiddenInput = styled("input")({
  clip: "rect(0 0 0 0)",
  clipPath: "inset(50%)",
  height: 1,
  overflow: "hidden",
  position: "absolute",
  bottom: 0,
  left: 0,
  whiteSpace: "nowrap",
  width: 1,
});

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
