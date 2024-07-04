// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { grey } from "@mui/material/colors";
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
import MuiAccordion, {
  AccordionProps,
} from "@mui/material/Accordion";
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
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import Swal from "sweetalert2";
import * as XLSX from "xlsx";


interface InspectionItem {
  id: number;
  inspectionGroupId: number;
  sequence: number;
  topic: string;
  remark: string;
  type: string;
  typeName: string;
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

interface QRCodeModel {
  id: number | null;
  value: string | null;
  text: string | null;
  cell: string | null;
}

interface DDLModel {
  label: string;
  value: string;
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
        toastAlert("error", error.response.data.message, 5000);
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
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (err) {
    toastAlert(`error`, `${err}`, 5000);
  }
}

async function CreateInsItemAPI(body: any) {
  try {
    await instanceAxios
      .post(`/InspectionItem/CreateInspectionItem`, body)
      .then(async function (response: any) {
        toastAlert(`${response.data.status}`, `${response.data.message}`, 5000);
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (error) {
    toastAlert(`error`, `Admin`, 5000);
  }
}

async function ValidateQRCodeAPI(qrcode: any[]) {
  let dataAPI: any;
  try {
    await instanceAxios
      .post(`/qrCodeCheck/ValidateImportQrCode`, qrcode)
      .then(async function (response: any) {
        console.log(response);
        dataAPI = response.data;
        // toastAlert(`${response.data.status}`, `${response.data.message}`, 5000);
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (err) {
    toastAlert(`error`, `${err}`, 5000);
  }
  return dataAPI;
}

async function DeletedInsItemAPI(insItemId: number) {
  try {
    await instanceAxios
      .put(`/InspectionItem/RemoveInspectionItem?inspectionItemId=${insItemId}`)
      .then(async function (response: any) {
        toastAlert(`${response.data.status}`, `${response.data.message}`, 5000);
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (err) {
    toastAlert(`error`, `${err}`, 5000);
  }
}

async function GetQRCodeItemAPI(insItemId: number) {
  let dataAPI: any;
  console.log(insItemId);
  try {
    await instanceAxios
      .get(
        `/qrCodeCheck/SelectQRCodeByInspectionItemId?inspectionItemId=${insItemId}`
      )
      .then(async function (response: any) {
        dataAPI = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (err) {
    toastAlert(`error`, `${err}`, 5000);
  }

  return dataAPI;
}

async function GetConstantByGrpAPI(grp: string) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/Constant/GetConstantByGRP?grp=${grp}`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

export default function InspectionItemData(props: {
  dataGroupId: number;
  activeIns: Boolean;
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
    setIsAdd(false);
    setDisabledBtn(true);
    setMaxError(false);
    setMinError(false);
    setTargetError(false);
    const dataSetUp = _.find(dataPageList, { id: Id });
    setInsItemId(Id);
    setInsItemSeq(dataSetUp?.sequence ?? 0);
    setInsItemTopic(dataSetUp?.topic ?? "");
    setInsType(String(dataSetUp?.type ?? ""));
    setInsItemRemark(dataSetUp?.remark ?? "");
    setInsItemReq(dataSetUp?.isRequired ?? false);
    setInsItemMin(dataSetUp?.min ?? "0.00");
    setInsItemMax(dataSetUp?.max ?? "0.00");
    setInsItemTarget(dataSetUp?.target ?? "0.00");
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
            cell: "",
            value: item.value,
            text: item.text,
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
          qrItemValues: qrCodeList,
        };
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
        break;
      default:
        body = null; // Handle other cases if needed
        break;
    }
    await CreateInsItemAPI(body);
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
    if (insItemQRValue.trim() === "" || insItemQRText.trim() === "") {
      return;
    }

    const isValueDuplicate = qrCodeList.some(
      (item) => item.value === insItemQRValue
    );
    const isTextDuplicate = qrCodeList.some(
      (item) => item.text === insItemQRText
    );

    if (isValueDuplicate || isTextDuplicate) {
      setErrorQRCodeValue(isValueDuplicate);
      setErrorQRCodeText(isTextDuplicate);
    } else {
      const newItem = {
        id: Date.now(),
        cell: "WEB",
        value: insItemQRValue,
        text: insItemQRText,
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
      flex: 1,
      sortable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <>
          <Button
                onClick={() => {
                  setLabelModal("Edit Inspection Group Item");
                  handleOpen();
                  SetUpDataEdit(row.id);
                }}
              >
                <EditIcon />
              </Button>
          {!activeIns && (
            <>
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
              >
                <DeleteIcon />
              </Button>
            </>
          )}
        </>
      ),
    },
    {
      field: "sequence",
      headerName: "Sequence",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "topic",
      headerName: "topic",
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
      minWidth: 150,
      flex: 1,
      sortable: false,
      renderCell: ({ row }: Partial<GridRowParams>) => (
        <>
          <Button
            onClick={() => {
              DeleteQRCodeItem(row.value);
            }}
          >
            <DeleteIcon />
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
  ];

  const handleFileChange = async (event: any) => {
    const file = event.target.files[0];
    setFileName(file.name);

    const arrayBuffer = await file.arrayBuffer();
    const workbook = XLSX.read(arrayBuffer, { type: "array" });
    const worksheet = workbook.Sheets[workbook.SheetNames[0]];
    const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 });

    jsonData.slice(1).map((_row, index) => {
      const cellAddressA = XLSX.utils.encode_cell({ r: index + 1, c: 0 });
      const cellAddressB = XLSX.utils.encode_cell({ r: index + 1, c: 1 });
      setQRCodeList((prevList) => [
        ...prevList,
        {
          id: Date.now(),
          cell: cellAddressA,
          value: worksheet[cellAddressA]?.v,
          text: worksheet[cellAddressB]?.v,
        },
      ]);
    });
  };

  const handleButtonSubmitClick = async () => {
    OpenBackDrop(true);
    setOpen(false);
    if (isAdd) {
      CreateInsItem();
    } else {
      UpdateData();
    }
    GetInsItemPage();
  };

  const [disabledBtn, setDisabledBtn] = React.useState(true);

  function ValidateQRCode() {
    ValidateQRCodeAPI(qrCodeList).then((x) => {
      if (x.status == "success") {
        setDisabledBtn(false);
      }
    });
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
    validateMinMaxTarget();
  }, [insItemMin, insItemMax]);

  React.useEffect(() => {
    // Check if Type is 2 and set initial button state
    if (insType === "2") {
      validateMinMaxTarget();
    }else{
      setDisabledBtn(insItemTopic.trim() === "" || insItemSeq === 0)
    }
  }, [insType , insItemTopic , insItemSeq , insItemUnit]);

  const validateMinMaxTarget = () => {
    const numericMin = parseFloat(insItemMin);
    const numericMax = parseFloat(insItemMax);
    const numericTarget = parseFloat(insItemTarget);

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

    // Validate Target
    if (
      insItemTarget === "" ||
      (!isNaN(numericTarget) &&
        numericTarget <= numericMax &&
        numericTarget >= numericMin)
    ) {
      setTargetError(false);
    } else {
      setTargetError(true);
    }

    // Enable/disable button based on validation and Type
    if (
      !minError &&
      !maxError &&
      !targetError &&
      (insType !== "2" ||
        (insType === "2" &&
          insItemTopic.trim() !== "" &&
          insItemSeq !== 0 &&
          (insItemUnit === null || insItemUnit.trim() !== "") &&
          (insItemMax === null || (typeof insItemMax === 'string' && insItemMax.trim() !== "")) &&
          (insItemMin === null || (typeof insItemMin === 'string' && insItemMin.trim() !== "")) 
        )
      )
    ) {
      setDisabledBtn(false);
    } else {
      setDisabledBtn(true);
    }
  };

  const isAddButtonDisabled =
    insItemQRValue.trim() === "" || insItemQRText.trim() === "";
  

  const handleInput = (e : any) => {
    const value = e.target.value;

    const minusCount = (value.match(/-/g) || []).length;
    if (minusCount > 1 || (minusCount === 1 && value[0] !== '-')) {
      e.target.value = value.slice(0, -1);
      return;
    }

    if (value === '-.') {
      e.target.value = ''
      return;
    }

    const dotCount = (value.match(/\./g) || []).length;

    // Check for multiple dots
    if (dotCount > 1) {
      e.target.value = value.slice(0, -1);
      return;
    }

    if (dotCount === 1) {
      const [integerPart, decimalPart] = value.split('.');
      // Limit integer part to 18 digits and decimal part to 3 digits
      const cleanIntegerPart = integerPart.replace(/[^0-9-]/g, '');
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
      const cleanValue = value.replace(/[^0-9-]/g, '');
      if (cleanValue.length > 18) {
        e.target.value = cleanValue.slice(0, 18);
        return;
      }
    }

    e.target.value = value.replace(/[^0-9.-]/g, '');
  };
  const [minError, setMinError] = React.useState<boolean>(false);
  const [maxError, setMaxError] = React.useState<boolean>(false);
  const [targetError, setTargetError] = React.useState<boolean>(false);



  
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
                      onClick={() => {
                        setLabelModal("Create Inspection Group Item");
                        SetUpDataCreate();
                        handleOpen();
                      }}
                    >
                      Add
                    </Button>
                  </Box>
                )}
              </Grid>
              <Grid item xs={12} md={12} container>
                <Box sx={{ height: "100%", width: "100%" }}>
                  <DataGrid
                    sx={{
                      boxShadow: 2,
                      border: 2,
                      borderColor: "primary.light",
                      width: "100%",
                      "& .MuiDataGrid-columnHeader": {
                        backgroundColor: "#19857B",
                        width: "100%", // ทำให้ column headers ขยายเต็มความกว้าง // เปลี่ยนสีพื้นหลังของ header
                      },
                      "& .MuiDataGrid-columnHeaderTitle": {
                        color: "#FFFFFF", // เปลี่ยนสีตัวอักษรของ header ให้เป็นสีขาวเพื่อให้มองเห็นชัดเจน
                        fontWeight: "bold", // ทำให้ตัวอักษรใน header หนา
                      },
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
        <ModalContent sx={{ width: "40vw" }}>
          <h2 id="unstyled-modal-title" className="modal-title">
            {lableModal}
          </h2>
          <Grid container spacing={2}>
            <Grid item xs={6} md={12}>
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
            <Grid item xs={6} md={12}>
              <TextField
                label={
                  <span>
                    <span style={{ color: "red" }}>*</span> Topic
                  </span>
                }
                // label="Topic"
                
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
            )}

            {showMeasurement && (
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
                    maxError ? "Max value must not be less than Min value." : ""
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
            )}
            {showMeasurement && (
              <Grid item xs={6} md={4}>
                <TextField
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span> Target
                    </span>
                  }
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
                    } else {
                      setTargetError(true); // Set error state
                    }
                    setInsItemTarget(value);
                  }}
                />
              </Grid>
            )}
            {showMeasurement && (
              <Grid item xs={6} md={12}>
                <TextField
                  label={
                    <span>
                      <span style={{ color: "red" }}>*</span> Unit
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
                <Grid item xs={6} md={6}>
                  <Button
                    component="label"
                    variant="contained"
                    tabIndex={-1}
                    startIcon={<CloudUploadIcon />}
                    onChange={handleFileChange}
                    disabled={activeIns ? true : false}
                  >
                    Upload file
                    <VisuallyHiddenInput type="file" />
                  </Button>
                </Grid>
                <Grid item xs={6} md={6}>
                  <Box>
                    <Typography variant="body1">File : {fileName}</Typography>
                  </Box>
                </Grid>
                <Grid item xs={6} md={12}>
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
                <Grid item xs={6} md={4}>
                  <TextField
                    label="Value"
                    id="outlined-size-small"
                    size="small"
                    value={insItemQRValue}
                    error={errorQRCodeValue}
                    disabled={activeIns ? true : false}
                    helperText={errorQRCodeValue ? "Value already exists" : ""}
                    style={{ width: "100%" }}
                    onChange={(e) => {
                      setInsItemQRValue(e.target.value);
                      setErrorQRCodeValue(false);
                    }}
                  />
                </Grid>
                <Grid item xs={6} md={4}>
                  <TextField
                    label="Text"
                    id="outlined-size-small"
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
                <Grid item xs={6} md={4}>
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
                <DataGrid
                  sx={{
                    boxShadow: 2,
                    border: 2,
                    borderColor: "primary.light",
                    width: "100%",
                    "& .MuiDataGrid-columnHeader": {
                      backgroundColor: "#19857B",
                      width: "100%", // ทำให้ column headers ขยายเต็มความกว้าง // เปลี่ยนสีพื้นหลังของ header
                    },
                    "& .MuiDataGrid-columnHeaderTitle": {
                      color: "#FFFFFF", // เปลี่ยนสีตัวอักษรของ header ให้เป็นสีขาวเพื่อให้มองเห็นชัดเจน
                      fontWeight: "bold", // ทำให้ตัวอักษรใน header หนา
                    },
                    "& .MuiDataGrid-cell:hover": {
                      color: "primary.main",
                    },
                  }}
                  rows={qrCodeList}
                  columns={activeIns ? columnsQR.filter((col) => col.field !== "action" ) : columnsQR}
                  
                  initialState={{
                    pagination: {
                      paginationModel: {
                        pageSize: 5,
                      },
                    },
                  }}
                  autoHeight
                />
              </Grid>
            )}
            <Grid item xs={6} md={6} container justifyContent="flex-start">
              <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={handleClose}>
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
                  {showQRCodeList && (
                    <Button
                      component="label"
                      variant="contained"
                      tabIndex={-1}
                      startIcon={<CloudUploadIcon />}
                      onClick={ValidateQRCode}
                      disabled={activeIns ? true : false}
                    >
                      Validate Data
                    </Button>
                  )}
                  <Button
                    variant="contained"
                    onClick={handleButtonSubmitClick}
                    disabled={disabledBtn || activeIns ? true : false}
                  >
                    {isAdd ? "Create" : "Save"}
                  </Button>
                </ButtonGroup>
              </Box>
            </Grid>
          </Grid>
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

const ModalContent = styled("div")(
  ({ theme }) => css`
    font-family: "IBM Plex Sans", sans-serif;
    font-weight: 500;
    text-align: start;
    position: relative;
    display: flex;
    flex-direction: column;
    gap: 8px;
    overflow: auto;
    background-color: ${theme.palette.mode === "dark" ? grey[900] : "#fff"};
    border-radius: 8px;
    border: 1px solid ${theme.palette.mode === "dark" ? grey[700] : grey[200]};
    box-shadow: 0 4px 12px
      ${theme.palette.mode === "dark" ? "rgb(0 0 0 / 0.5)" : "rgb(0 0 0 / 0.2)"};
    padding: 24px;
    color: ${theme.palette.mode === "dark" ? grey[50] : grey[900]};
    max-height: 90vh;
    max-width: 90vw;

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