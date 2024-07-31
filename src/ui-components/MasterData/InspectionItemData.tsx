// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import {
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  FormControl,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import Tabs from "@mui/material/Tabs";
import Tab from "@mui/material/Tab";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import { GridColDef } from "@mui/x-data-grid";
import React from "react";
import { TextField } from "@mui/material";
import { Modal as BaseModal } from "@mui/base/Modal";
import _ from "lodash";
import { styled } from "@mui/system";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import moment from "moment";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";
import StyledDataGrid from "../../styles/styledDataGrid";
import DropzoneArea from "./inspectionItemImage";
import {
  CreateInsItemAPI,
  DeletedInsItemAPI,
  GetConstantByGrpAPI,
  GetInsItemAPI,
  GetQRCodeItemAPI,
  UpdateInsItemAPI,
  ValidateQRCodeAPI,
} from "@api/axios/inspectionItemAPI";
import AddBoxIcon from '@mui/icons-material/AddBox';

import ClearIcon from '@mui/icons-material/Clear';
import toastAlert from "@sweetAlert/toastAlert";

export default function InspectionItemData(props: {
  dataGroupId: number;
  activeIns: boolean;
  OpenBackDrop: React.Dispatch<React.SetStateAction<boolean>>;
}) {
  const { dataGroupId, OpenBackDrop, activeIns } = props;
  const [insTypeDDL, setInsTypeDDL] = React.useState<DDLModel[]>([]);
  const [dataPageList, setDataPageList] = React.useState<InspectionItem[]>([]);
  const [open, setOpen] = React.useState(false);
  const [lableModal, setLabelModal] = React.useState<string>("");
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [insItemId, setInsItemId] = React.useState<number>(0);
  const [insType, setInsType] = React.useState<string>("1");
  const [insItemMin, setInsItemMin] = React.useState<string>("");
  const [insItemMax, setInsItemMax] = React.useState<string>("");
  const [insItemTarget, setInsItemTarget] = React.useState<string | null>("");
  const [insItemUnit, setInsItemUnit] = React.useState<string>("");
  const [insItemRemark, setInsItemRemark] = React.useState<string>("");
  const [insItemSeq, setInsItemSeq] = React.useState<number>(0);
  const [insItemTopic, setInsItemTopic] = React.useState<string>("");
  const [insItemReq, setInsItemReq] = React.useState<boolean>(false);
  const [insItemPin, setInsItemPin] = React.useState<boolean>(true);
  const [showMeasurement, setShowMeasurement] = React.useState(false);
  const [showQRCodeList, setShowQRCodeList] = React.useState(false);
  const [showRecord, setShowRecord] = React.useState(false);
  const [fileName, setFileName] = React.useState<string>("");
  const [isAdd, setIsAdd] = React.useState(true);

  const handleChangeInspectionType = (event: {
    target: { value: React.SetStateAction<string> };
  }) => {
    setInsType(event.target.value);
    if (event.target.value == "2") {
      setShowMeasurement(true);
      setShowQRCodeList(false);
      setShowRecord(false);
      setQRCodeList([]);
      setInsItemQRText("");
      setInsItemQRValue("");
      setFileName("");
    } else {
      setShowMeasurement(false);
      setInsItemMin("");
      setInsItemMax("");
      setInsItemTarget("");
      setInsItemUnit("");
      setMaxError(false);
      setMinError(false);
      setTargetError(false);
    }

    if (event.target.value == "3") {
      setShowRecord(true);
      setShowMeasurement(false);
      setShowQRCodeList(false);
      setQRCodeList([]);
      setInsItemQRText("");
      setInsItemQRValue("");
      setFileName("");
    } else {
      setShowRecord(false);
    }

    if (event.target.value == "4") {
      setShowQRCodeList(true);
    } else {
      setShowQRCodeList(false);
    }
  };

  const [insItemQRValue, setInsItemQRValue] = React.useState("");
  const [insItemQRText, setInsItemQRText] = React.useState("");
  const [qrCodeList, setQRCodeList] = React.useState<QRCodeModel[]>([]);

  async function GetInsItemPage() {
    await GetConstantByGrpAPI("IMAGE").then(async (x) => {
      if (x.status == "success") {
        setImgSizeMB(_.find(x.data, {code : "SIZE"}).text ?? 3 as number)
      }
    });
    await GetConstantByGrpAPI("DD_INSGRP").then(async (x) => {
      if (x.status == "success") {
        const typeDDLModel: DDLModel[] = x.data.map((item: any) => ({
          label: item.text,
          value: item.code,
        }));
        await GetInsItemAPI(dataGroupId).then((x) => {
          if (x.status == "success") {
            const insItemsData: InspectionItem[] = x.data.map((item: any) => ({
              id: item.inspectionItemId,
              inspectionGroupId: item.inspectionGroupId,
              sequence: item.sequence,
              topic: item.topic,
              type: item.type,
              typeName:
                _.find(typeDDLModel, { value: item.type?.toString() })?.label ??
                "",
              min: item.min,
              max: item.max,
              target: item.target,
              unit: item.unit,
              remark: item.remark,
              isRequired: item.isRequired,
              isPinCode: item.isPinCode,
              createdOn: moment(item.createdOn).format("DD-MM-YYYY HH:mm:ss"),
              createdBy: item.createdBy,
              modifiedOn: item.modifiedOn
                ? moment(item.modifiedOn).format("DD-MM-YYYY HH:mm:ss")
                : "",
              modifiedBy: item.modifiedBy,
            }));
            setDataPageList(insItemsData);
            OpenBackDrop(false);
          }
        });
        await setInsTypeDDL(typeDDLModel);
      }
    });
  }

  function SetUpDataEdit(Id: any) {
    const dataSetUp = _.find(dataPageList, { id: Id });
    setDisabledTabDetail(false);
    setDisabledTabPicture(false);
    setIsAdd(false);
    setDisabledBtn(String(dataSetUp?.type ?? "") === "4");
    setMaxError(false);
    setMinError(false);
    setTargetError(false);

    setInsItemId(Id);
    setInsItemSeq(dataSetUp?.sequence ?? 0);
    setInsItemTopic(dataSetUp?.topic ?? "");
    setInsType(String(dataSetUp?.type ?? ""));
    setInsItemRemark(dataSetUp?.remark ?? "");
    setInsItemReq(dataSetUp?.isRequired ?? false);
    setInsItemMin(dataSetUp?.min ?? "0.00");
    setInsItemMax(dataSetUp?.max ?? "0.00");
    setInsItemTarget(dataSetUp?.target ?? "");
    setInsItemPin(dataSetUp?.isPinCode ?? false);
    setInsItemUnit(dataSetUp?.unit ?? "");
    SetUpInsType(dataSetUp?.type ?? "0");
    setQRCodeList([]);
    setInsItemQRText("");
    setInsItemQRValue("");
    setFileName("");
    if (String(dataSetUp?.type) == "4") {
      GetQRCodeItemAPI(Id).then((x) => {
        if (x.status == "success") {
          const formattedData = _.map(x.data, (item) => ({
            id: item.qrCodeCheckId,
            inspectionItemId : Id,
            cell: "WEB",
            value: item.value,
            text: item.text,
            msg : ""
          }));
          setQRCodeList(formattedData);
        }
      });
    }
  }

  function SetUpDataCreate() {
    setIsAdd(true);
    setMaxError(false);
    setMinError(false);
    setTargetError(false);
    setDisabledTabDetail(true);
    setDisabledTabPicture(true);
    const lastSequence = _.maxBy(dataPageList, "sequence")?.sequence ?? 0;
    let nextMultipleOfTen = Math.ceil(lastSequence / 10) * 10;
    if (lastSequence == nextMultipleOfTen) {
      nextMultipleOfTen += 10;
    }

    setInsItemSeq(nextMultipleOfTen);
    setInsItemTopic("");
    setInsType("1");
    setInsItemRemark("");
    setInsItemReq(false);
    setInsItemMin("");
    setInsItemMax("");
    setInsItemTarget("");
    setInsItemPin(false);
    setInsItemUnit("");
    SetUpInsType("1");
    setQRCodeList([]);
    setInsItemQRText("");
    setInsItemQRValue("");
    setFileName("");
    setDisabledBtn(true);
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
      setMaxError(false);
      setMinError(false);
      setTargetError(false);
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
        : null ;
    let body;
    let canUPDATE : boolean = false;
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
          qrItemValues: qrCodeList,
        };
        await ValidateQRCode('UPDATE').then((rs)=>{
          canUPDATE = rs;
        });
        if (!canUPDATE) return;
        break;
      default:
        body = null; // Handle other cases if needed
        break;
    }

    await UpdateInsItemAPI(body);
    GetInsItemPage();
  }

  async function CreateInsItem() {
    
    const min =
      insItemMin !== null && insItemMin.length > 0
        ? parseFloat(insItemMin).toFixed(3)
        : null;
    const max =
      insItemMax !== null && insItemMax.length > 0
        ? parseFloat(insItemMax).toFixed(3)
        : null;
    const target =
      insItemTarget !== null && insItemTarget.length > 0
        ? parseFloat(insItemTarget).toFixed(3)
        : null;
    let body;
    let isCreate : boolean = false;
    switch (insType) {
      case "1":
        body = {
          topic: insItemTopic,
          inspectionGroupId: dataGroupId,
          sequence: insItemSeq,
          type: insType,
          remark: insItemRemark,
        };
        break;
      case "2":
        body = {
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
          topic: insItemTopic,
          inspectionGroupId: dataGroupId,
          sequence: insItemSeq,
          type: insType,
          isPinCode: insItemPin,
          remark: insItemRemark,
          qrItemValues: qrCodeList,
        };
       
         await ValidateQRCode('CREATE').then((rs)=>{
          isCreate = rs;
        });
        if (!isCreate) return
        break;
      default:
        body = null; // Handle other cases if needed
        break;
    }
  
    await CreateInsItemAPI(body).then((rs) => {
      toastAlert(`${rs.status}`, `${rs.message}`, 5000);
      if (rs.status === "success") {
        setValueTab(1);
        setDisabledBtn(true);
        setDisabledTabDetail(true);
        setInsItemId(rs.data.inspectionItemId)
      } 
    });
    GetInsItemPage();
  }

  async function DeletedInsItem(insItemId: number) {
    await DeletedInsItemAPI(insItemId).then(() => {
      GetInsItemPage();
    });
  }
  const [errorQRCodeValue, setErrorQRCodeValue] = React.useState(false);
  const [errorQRCodeText, setErrorQRCodeText] = React.useState(false);

  async function AddQRCodeInsItem() {
    if (insItemQRValue.toLowerCase().trim() === "") {
      return;
    }

    const isValueDuplicate = qrCodeList.some(
      (item) => item.value?.toLowerCase().trim() === insItemQRValue.toLowerCase().trim()
    );
   
    if (isValueDuplicate) {
      setErrorQRCodeValue(isValueDuplicate);

    } else {
      const newItem = {
        id: Date.now(),
        cell: "WEB",
        value: insItemQRValue,
        text: insItemQRText,
        msg : null,
        inspectionItemId : 0,
      };
      setQRCodeList([...qrCodeList, newItem]);
      setInsItemQRValue("");
      setInsItemQRText("");
    }
  }
  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      headerAlign: "center",
      align: "left",
      minWidth: 150,
      flex: 0.5,
      sortable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <>
          <Button
            onClick={() => {
              setLabelModal("Edit Inspection Group Item");
              handleOpen();
              SetUpDataEdit(row.id);
              setValueTab(0);
            }}
            sx={{ minWidth: 0, padding: "4px" }}
          >
            <EditIcon fontSize="small" />
          </Button>
          {!activeIns && (
            <Button
              onClick={() => {
                Swal.fire({
                  title: "Are you sure?",
                  text: `${row.topic}`,
                  icon: "warning",
                  showCancelButton: true,
                  confirmButtonColor: "#3085d6",
                  cancelButtonColor: "#d33",
                  confirmButtonText: "Yes, delete it!",
                }).then((result) => {
                  if (result.isConfirmed) {
                    DeletedInsItem(row.id);
                  }
                });
              }}
              sx={{ minWidth: 0, padding: "4px", marginLeft: "4px" }}
            >
              <DeleteIcon fontSize="small" />
            </Button>
          )}
        </>
      ),
    },
    {
      field: "sequence",
      headerName: "Sequence",
      minWidth: 100,
      flex: 0.5,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "topic",
      headerName: "Topic",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "typeName",
      headerName: "Type",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "createdOn",
      headerName: "Created On",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "createdBy",
      headerName: "Created By",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "modifiedOn",
      headerName: "Modified On",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "modifiedBy",
      headerName: "Modified By",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
    },
  ];

  const columnsQR: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      headerAlign: "center",
      align: "left",
      minWidth: 80,
      flex: 0.3,
      sortable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <>
          <Button
            onClick={() => {
              DeleteQRCodeItem(row.value);
            }}
            sx={{ minWidth: 0, padding: "4px" }}
          >
            <DeleteIcon fontSize="small" />
          </Button>
        </>
      ),
    },
    {
      field: "value",
      headerName: "Value",
      minWidth: 200,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "text",
      headerName: "Text",
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "msg",
      headerName: "Message",
      headerAlign: "center",
      align: "center",
      minWidth: 200,
      flex: 1,
    },
  ];


  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    const newQRCodeList = jsonData.slice(1).map((row, index) => {
      const cellAddressA = XLSX.utils.encode_cell({ r: index + 1, c: 0 });
      const cellAddressB = XLSX.utils.encode_cell({ r: index + 1, c: 1 });
      return {
        id: Date.now() + index,
        cell: cellAddressA,
        value: worksheet[cellAddressA]?.v,
        text: worksheet[cellAddressB]?.v,
        msg : null,
        inspectionItemId : 0,
      };
    });
    await  setQRCodeList((prevList) => [...prevList, ...newQRCodeList]);
  };

  const handleButtonSubmitClick = async () => {
    OpenBackDrop(true);
    // setOpen(false);
    if (isAdd) {
      CreateInsItem();
    } else {
      UpdateData();
    }
    GetInsItemPage();
  };

  const [disabledBtn, setDisabledBtn] = React.useState(true);
  const getRowClassName = (params: { row: { status: string; }; }) => {
    return params.row.status === 'error' ? 'error-row' : '';
  };

  async function ValidateQRCode(action : string) {
    let isOK = false;
    await ValidateQRCodeAPI(action, qrCodeList).then(async (x) => {
      const allSuccess = x.data.every((item : any) => item.status === "success");
      const mappedData: QRCodeModel[] = x.data.map((item: any , index : any) => ({
        id: Date.now + index,
        inspectionItemId: 0,
        value: item.value || null,
        text: item.text || null,
        cell: item.cell || null,
        msg: item.message || null,
        status: item.status
      }));
      
      await setQRCodeList(_.orderBy(mappedData,['msg' ],['asc']));
      isOK = allSuccess;
      // if (!allSuccess) {
      //   setDisabledBtn(true);
      // } else {
      //   setDisabledBtn(false);
      // }
    });
    return isOK;
  }

  function DeleteQRCodeItem(qrValue: string) {
    setQRCodeList((prevList) =>
      prevList.filter((item) => item.value !== qrValue)
    );
  }

  React.useEffect(() => {
    const FetchMenu = async () => {
      GetInsItemPage();
    };
    FetchMenu();
  }, []);

  React.useEffect(() => {
    // Validate Min, Max, Target when component mounts or values change
    if(open){
    validateMinMaxTarget();
    }
  }, [insItemMin, insItemMax]);

  React.useEffect(() => {
    // Check if Type is 2 and set initial button state
    if(open){
  
    if (insType === "2") {
      validateMinMaxTarget();
    } else if (insType === "4") {
      setDisabledBtn(insItemTopic.trim() === "" || insItemSeq === 0 || qrCodeList.length === 0);
    } else {
      setDisabledBtn(insItemTopic.trim() === "" || insItemSeq === 0);
    }
  }
  }, [ open,insType, insItemTopic , insItemSeq , insItemUnit , qrCodeList]);

  const validateMinMaxTarget = () => {
    const numericMin = parseFloat(insItemMin);
    const numericMax = parseFloat(insItemMax);

    let targetCheck = false;
    // Validate Min
    if (
      insItemMin === "" ||
      (!isNaN(numericMin) && (insItemMax === "" || numericMin <= numericMax))
    ) {
      setMinError(false);
    } else {
      setMinError(true);
    }

    // Validate Max
    if (
      insItemMax === "" ||
      (!isNaN(numericMax) && (insItemMin === "" || numericMax >= numericMin))
    ) {
      setMaxError(false);
    } else {
      setMaxError(true);
    }

    setDisabledBtn(insItemMax === "" ||insItemMin === "")

    // Validate Target
    if (insItemTarget) {
      const numericTarget = parseFloat(insItemTarget);

      if (
        insItemTarget === "" ||
        (!isNaN(numericTarget) &&
          numericTarget <= numericMax &&
          numericTarget >= numericMin)
      ) {
        setTargetError(false);
        setDisabledBtn(false);
        targetCheck = false;
      } else {
        setTargetError(true);
        targetCheck = true;
      }

      const d = insItemTopic.trim() === "" ||insItemSeq === 0 || insItemMax === "" ||insItemMin === "" || targetCheck;
      setDisabledBtn(d);
    }
  };

  const isAddButtonDisabled =
    insItemQRValue.trim() === "" || insItemQRText.trim() === "";

  const handleInput = (e: any) => {
    const value = e.target.value;

    const minusCount = (value.match(/-/g) || []).length;
    if (minusCount > 1 || (minusCount === 1 && value[0] !== "-")) {
      e.target.value = value.slice(0, -1);
      return;
    }

    if (value === "-.") {
      e.target.value = "";
      return;
    }

    const dotCount = (value.match(/\./g) || []).length;

    // Check for multiple dots
    if (dotCount > 1) {
      e.target.value = value.slice(0, -1);
      return;
    }

    if (dotCount === 1) {
      const [integerPart, decimalPart] = value.split(".");
      // Limit integer part to 18 digits and decimal part to 3 digits
      const cleanIntegerPart = integerPart.replace(/[^0-9-]/g, "");
      if (cleanIntegerPart.length > 18) {
        e.target.value = `${cleanIntegerPart.slice(0, 18)}.${decimalPart}`;
        return;
      }
      if (decimalPart.length > 3) {
        e.target.value = `${integerPart}.${decimalPart.slice(0, 3)}`;
        return;
      }
    } else {
      // Limit integer part to 18 digits when there's no dot
      const cleanValue = value.replace(/[^0-9-]/g, "");
      if (cleanValue.length > 18) {
        e.target.value = cleanValue.slice(0, 18);
        return;
      }
    }
    e.target.value = value.replace(/[^0-9.-]/g, "");
  };
  const [minError, setMinError] = React.useState<boolean>(false);
  const [maxError, setMaxError] = React.useState<boolean>(false);
  const [targetError, setTargetError] = React.useState<boolean>(false);
  const [valueTab, setValueTab] = React.useState(0);

  function a11yProps(index: number) {
    return {
      id: `simple-tab-${index}`,
      "aria-controls": `simple-tabpanel-${index}`,
    };
  }

  const handleChange = (newValue: number) => {
    setValueTab(newValue);
  };

  const [imgSizeMB , setImgSizeMB] = React.useState<number>(3);
  const [disabledTabDetail , setDisabledTabDetail] = React.useState<boolean>(true);
  const [disabledTabPicture , setDisabledTabPicture] = React.useState<boolean>(true);

  const handleClearQR = async () => {
    setFileName("");
    await setQRCodeList([]);
  };

  function CustomToolbar() {
    return (
      <Box
        display="flex"
        justifyContent="space-between"
        alignItems="center"
        width="100%"
      >
        <Box display="flex" alignItems="center">
          <Button  sx={{ borderRadius:0}}  onClick={handleClearQR} variant="contained" startIcon={<ClearIcon />} size="small" color="error">
            Clear
          </Button>
          <Typography variant="body1" sx={{ marginLeft: 2 }}>
            {fileName.length > 0 ? `File : ${fileName}` : ""}
          </Typography>
        </Box>
        <Button
          component="label"
          variant="contained"
          tabIndex={-1}
          startIcon={<CloudUploadIcon />}
          onChange={handleFileChange}
          size="small"
          disabled={activeIns}
          sx={{
            borderRadius: 0,
            backgroundColor: "#0F67B1"
          }}
        >
          Upload
          <VisuallyHiddenInput type="file" />
        </Button>
      </Box>
    );
  }
  return (
    <>
      <div>
        <Accordion defaultExpanded>
          <AccordionSummary
            expandIcon={<ExpandMoreIcon />}
            aria-controls="panel2-content"
            id="panel2-header"
          >
            <Typography sx={{ flexShrink: 0 }}>
              Inspection Group Items
            </Typography>
          </AccordionSummary>
          <AccordionDetails>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12} container justifyContent="flex-end">
                {!activeIns && (
                  <Box>
                    <Button
                      variant="contained"
                      startIcon={<AddBoxIcon />}
                      onClick={() => {
                        setLabelModal("Create Inspection Group Item");
                        SetUpDataCreate();
                        handleOpen();
                        setValueTab(0);
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={12} container>
                <Box sx={{ height: "100%", width: "100%" }}>
                  <StyledDataGrid
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
              </Grid>
            </Grid>
          </AccordionDetails>
        </Accordion>
      </div>
      <Modal
        aria-labelledby="unstyled-modal-title"
        aria-describedby="unstyled-modal-description"
        open={open}
        disableBackdropClick
        disableEscapeKeyDown
        slots={{ backdrop: StyledBackdrop }}
      >
        <ModalContent>
          <h2 id="unstyled-modal-title" className="modal-title">
            {lableModal}
          </h2>
          <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={valueTab}
              onChange={(_, value) => handleChange(value)}
              aria-label="basic tabs example"
            >
              <Tab
                label="Detail"
                {...a11yProps(0)}
                disabled={disabledTabDetail}
              />
              {
                <Tab
                  label="Picture"
                  {...a11yProps(1)}
                  disabled={disabledTabPicture}
                />
              }
            </Tabs>
          </Box>
          <div
            role="tabpanel"
            hidden={valueTab !== 0}
            id={`simple-tabpanel-${0}`}
            aria-labelledby={`simple-tab-${0}`}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField
                  disabled={activeIns ? true : false}
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span> Sequence
                    </span>
                  }
                  id="outlined-size-small"
                  size="small"
                  defaultValue={insItemSeq}
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setInsItemSeq(Number(e.target.value));
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span> Topic
                    </span>
                  }
                  id="topic-size-small"
                  disabled={activeIns ? true : false}
                  defaultValue={insItemTopic}
                  size="small"
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setInsItemTopic(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Remark"
                  id="remark-size-small"
                  defaultValue={insItemRemark}
                  disabled={activeIns ? true : false}
                  size="small"
                  style={{ width: "100%" }}
                  onChange={(e) => {
                    setInsItemRemark(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <FormControl fullWidth>
                  <InputLabel id="insType-simple-select-helper-label">
                    Inspection Type
                  </InputLabel>
                  <Select
                    labelId="insType-simple-select-label"
                    id="insType-simple-select"
                    defaultValue={insType}
                    disabled={activeIns ? true : false}
                    label="InspectionType"
                    onChange={handleChangeInspectionType}
                    size="small"
                  >
                    {_.map(insTypeDDL, function (i: DDLModel) {
                      return (
                        <MenuItem key={i.value} value={i.value}>
                          {i.label}
                        </MenuItem>
                      );
                    })}
                  </Select>
                </FormControl>
              </Grid>
              {showMeasurement && (
                <>
                <Grid item xs={6} md={4}>
                  <TextField
                    label={
                      <span>
                        <span style={{ color: "red" }}>*</span> Min
                      </span>
                    }
                    id="min-size-small"
                    disabled={activeIns ? true : false}
                    size="small"
                    style={{ width: "100%" }}
                    defaultValue={insItemMin}
                    inputProps={{
                      inputMode: "decimal",
                      pattern: "[0-9]*[.]?[0-9]*",
                    }}
                    onInput={handleInput}
                    error={minError} // Apply error state to TextField
                    helperText={
                      minError
                        ? "Min value must not be greater than Max value."
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericMinValue = parseFloat(value);
                      const numericMaxValue = parseFloat(insItemMax);
                      if (
                        value === "" ||
                        (!isNaN(numericMinValue) &&
                          (insItemMax === "" ||
                            numericMinValue <= numericMaxValue))
                      ) {
                        setMinError(false); // Reset error state
                      } else {
                        setMinError(true); // Set error state
                      }
                      setInsItemMin(value);
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextField
                    label={
                      <span>
                        <span style={{ color: "red" }}>*</span> Max
                      </span>
                    }
                    id="outlined-size-small"
                    defaultValue={insItemMax}
                    size="small"
                    style={{ width: "100%" }}
                    inputProps={{
                      inputMode: "decimal",
                      pattern: "[0-9]*[.]?[0-9]*",
                    }}
                    onInput={handleInput}
                    disabled={activeIns ? true : false}
                    error={maxError} // Apply error state to TextField
                    helperText={
                      maxError
                        ? "Max value must not be less than Min value."
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericMaxValue = parseFloat(value);
                      const numericMinValue = parseFloat(insItemMin);
                      if (
                        value === "" ||
                        (!isNaN(numericMaxValue) &&
                          (insItemMin === "" ||
                            numericMaxValue >= numericMinValue))
                      ) {
                        setMaxError(false); // Reset error state
                      } else {
                        setMaxError(true);
                      }
                      setInsItemMax(value);
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextField
                    label={<span>Target</span>}
                    id="outlined-size-small"
                    defaultValue={insItemTarget}
                    size="small"
                    style={{ width: "100%" }}
                    disabled={activeIns ? true : false}
                    inputProps={{
                      inputMode: "decimal",
                      pattern: "[0-9]*[.]?[0-9]*",
                    }}
                    onInput={handleInput}
                    error={targetError} // Apply error state to TextField
                    helperText={
                      targetError
                        ? "Target value must not be less than Min value and must not be greater than Max value."
                        : ""
                    }
                    onChange={(e) => {
                      const value = e.target.value;
                      const numericTargetValue = parseFloat(value);
                      const numericMaxValue = parseFloat(insItemMax);
                      const numericMinValue = parseFloat(insItemMin);
                      if (
                        value === "" ||
                        (!isNaN(numericTargetValue) &&
                          numericTargetValue <= numericMaxValue &&
                          numericTargetValue >= numericMinValue)
                      ) {
                        setTargetError(false); // Reset error state
                        setDisabledBtn(false);
                      } else {
                        setDisabledBtn(true);
                        setTargetError(true); // Set error state
                      }
                      setInsItemTarget(value);
                    }}
                  />
                </Grid>
           
                <Grid item xs={6} md={12}>
                  <TextField
                    label={
                      <span>
                        <span style={{ color: "red" }}></span> Unit
                      </span>
                    }
                    id="outlined-size-small"
                    disabled={activeIns ? true : false}
                    defaultValue={insItemUnit}
                    size="small"
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setInsItemUnit(e.target.value);
                    }}
                  />
                </Grid>
                </>
              )}
              {showRecord && (
                <Grid item xs={6} md={12}>
                  <FormControlLabel
                    control={<Switch />}
                    checked={insItemReq}
                    label="Required"
                    onChange={(_, value) => {
                      setInsItemReq(value);
                    }}
                    disabled={activeIns ? true : false}
                  />
                </Grid>
              )}
              {showQRCodeList && (
                <>
                  <Grid item xs={12} md={12}>
                    <FormControlLabel
                      control={<Switch />}
                      checked={insItemPin}
                      label="PinCode"
                      disabled={activeIns ? true : false}
                      onChange={(_, value) => {
                        setInsItemPin(value);
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <TextField
                      label="Value"
                      id="valueQR-size-small"
                      size="small"
                      value={insItemQRValue}
                      error={errorQRCodeValue}
                      disabled={activeIns ? true : false}
                      helperText={
                        errorQRCodeValue ? "Value already exists" : ""
                      }
                      style={{ width: "100%" }}
                      onChange={(e) => {
                        setInsItemQRValue(e.target.value);
                        setErrorQRCodeValue(false);
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <TextField
                      label="Text"
                      id="textQR-size-small"
                      size="small"
                      style={{ width: "100%" }}
                      value={insItemQRText}
                      error={errorQRCodeText}
                      disabled={activeIns ? true : false}
                      helperText={errorQRCodeText ? "Text already exists" : ""}
                      onChange={(e) => {
                        setInsItemQRText(e.target.value);
                        setErrorQRCodeText(false);
                      }}
                    />
                  </Grid>
                  <Grid item xs={4} md={4}>
                    <Button
                      component="label"
                      variant="contained"
                      tabIndex={-1}
                      style={{ width: "100%" }}
                      disabled={isAddButtonDisabled || activeIns ? true : false}
                      onClick={() => {
                        AddQRCodeInsItem();
                      }}
                    >
                      ADD QR Code
                    </Button>
                  </Grid>
                </>
              )}
              {showQRCodeList && (
                <Grid item xs={12} md={12}>
                  <StyledDataGrid
                    rows={qrCodeList}
                    columns={
                      activeIns
                        ? columnsQR.filter((col) => col.field !== "action")
                        : columnsQR
                    }
                    getRowClassName={getRowClassName}
                    initialState={{
                      pagination: {
                        paginationModel: {
                          pageSize: 5,
                        },
                      },
                    }}
                    slots={{ toolbar: CustomToolbar }}
                    autoHeight
                  />
                </Grid>
              )}
              <Grid item xs={6} md={6} container justifyContent="flex-start">
                <Box display="flex" gap={2}>
                  <Button variant="outlined" onClick={handleClose} size="small">
                    Close
                  </Button>
                </Box>
              </Grid>
              <Grid item xs={6} md={6} container justifyContent="flex-end">
                <Box display="flex" gap={2}>
                  <ButtonGroup
                    variant="contained"
                    aria-label="Basic button group"
                  >
                    {/* {showQRCodeList && (
                      <Button
                        component="label"
                        variant="contained"
                        tabIndex={-1}
                        startIcon={<CloudUploadIcon />}
                        onClick={ValidateQRCode}
                        disabled={activeIns ? true : false}
                        size="small"
                      >
                        Validate Data
                      </Button>
                    )} */}
                    <Button
                      variant="contained"
                      onClick={handleButtonSubmitClick}
                      disabled={disabledBtn || activeIns ? true : false}
                      size="small"
                    >
                      {isAdd ? "Create" : "Save"}
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
            </Grid>
          </div>
          <div
            role="tabpanel"
            hidden={valueTab !== 1}
            id={`simple-tabpanel-${1}`}
            aria-labelledby={`simple-tab-${1}`}
          >
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <TextField
                  disabled={true}
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span> Sequence
                    </span>
                  }
                  id="outlined-size-small"
                  size="small"
                  defaultValue={insItemSeq}
                  style={{ width: "100%" }}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <DropzoneArea
                  sequence={insItemSeq}
                  inspectionItemId={insItemId}
                  activeIns={activeIns}
                  isAdd={isAdd}
                  imgSize={imgSizeMB}
                />
              </Grid>
              <Grid item xs={12} md={12} container justifyContent="flex-start">
                <Box display="flex" gap={2}>
                  <Button variant="outlined" onClick={handleClose}>
                    Close
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </div>
        </ModalContent>
      </Modal>
    </>
  );
}

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

// Define the styled component for modal content
const ModalContent = styled("div")(({ theme }) => ({
  fontFamily: "IBM Plex Sans, sans-serif",
  fontWeight: 500,
  textAlign: "start",
  position: "relative",
  display: "flex",
  flexDirection: "column",
  gap: 8,
  overflow: "auto",
  backgroundColor: theme.palette.mode === "dark" ? "#333" : "#fff",
  borderRadius: 8,
  border: `1px solid ${theme.palette.mode === "dark" ? "#666" : "#ccc"}`,
  boxShadow: `0 4px 12px ${
    theme.palette.mode === "dark" ? "rgba(0, 0, 0, 0.5)" : "rgba(0, 0, 0, 0.2)"
  }`,
  padding: 20,
  color: theme.palette.mode === "dark" ? "#fff" : "#000",
  width: "70vw",
  maxWidth: "80vw",
  maxHeight: "40vw",
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
  // ปรับแต่ง scrollbar
  "&::-webkit-scrollbar": {
    width: "8px",
  },
  "&::-webkit-scrollbar-thumb": {
    backgroundColor: theme.palette.mode === "dark" ? "#666" : "#ccc",
    borderRadius: "4px",
  },
  "&::-webkit-scrollbar-thumb:hover": {
    backgroundColor: theme.palette.mode === "dark" ? "#555" : "#bbb",
  },
  "&::-webkit-scrollbar-track": {
    backgroundColor: theme.palette.mode === "dark" ? "#333" : "#f0f0f0",
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
