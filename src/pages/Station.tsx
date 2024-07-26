import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";
import {
  Autocomplete,
  Backdrop,
  Box,
  Button,
  ButtonGroup,
  CircularProgress,
  Fade,
  Grid,
  Switch,
} from "@mui/material";
import * as React from "react";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
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
import { useLocation } from "react-router";
import { useEffect, useState } from "react";
import instanceAxios from "../api/axios/instanceAxios";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import { GridColDef } from "@mui/x-data-grid";
import AddBoxIcon from "@mui/icons-material/AddBox";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import FormControlLabel from "@mui/material/FormControlLabel";
import StyledDataGrid from "../styles/styledDataGrid";
import moment from "moment";
import _ from "lodash";
import { GetScheduledLineAPI } from "@api/axios/station";
import BorderColorIcon from '@mui/icons-material/BorderColor';

export function Station() {
  const authRequest = {
    ...loginRequest,
  };

  let location = useLocation();
  const [expanded, setExpanded] = React.useState(true);
  //Line Detail Data
  const [valueLineId, setValueLineId] = React.useState(location.state.lineId);
  const [valueScheduledLineCode, setValueScheduledLineCode] =
    React.useState<string>("");
  const [valueLineName, setValueLineName] = React.useState<string>("");
  const [valueTaktTime, setValueTaskTime] = React.useState<string>("");
  //Line Detail Display
  const [displayLineName, setDisplayLineName] = React.useState("");
  const [displayTaktTime, setDisplayTaskTime] = React.useState("");
  const [scheduledLineDisplay, setScheduledLineDisplay] =
    React.useState<string>("");
  // Line Edit
  const [openModalLineEdit, setopenModalLineEdit] = React.useState(false);
  const [openModalCreate, setopenModalCreate] = React.useState(false);
  const [scheduledLineDDL, setScheduledLineDDL] = React.useState<DDLModel[]>(
    []
  );
  const handleopenModalLineEdit = async () => {
    setopenModalLineEdit(true);
    setDisalbedEdit(false);
    await fetchDataHeader();
  };
  const [selectedScheduledLine, setSelectedScheduledLine] =
    React.useState<string>("");
  // Station Type List
  const [stationList, setStationList] = useState<StationModel[]>([]);
  // Station Create
  const handleopenModalCreate = () => setopenModalCreate(true);
  const handlecloseModalCreate = () => setopenModalCreate(false);
  const [isCreateStation, setIsCreateStation] = React.useState<boolean>(false);
  const [valueStationName, setValueStationName] = React.useState<string>("");
  const [selectedStationType, setSelectedStationType] =
    React.useState<string>("");
  const [valueSequence, setValueSequence] = React.useState<number>(0);
  const [valueRefMFG, setValueRefMFG] = React.useState<string | null>(null);
  const [valueRefMFGFinish, setValueRefMFGFinish] = React.useState<
    string | null
  >(null);
  // Station Edit
  const [stationTypeListDisplay, setStationTypeListDisplay] =
    React.useState<StationTypeModel | null>(null);
  const [stationTypeList, setStationTypeList] = React.useState<
    StationTypeModel[]
  >([]);
  const [openModalEdit, setopenModalEdit] = React.useState(false);
  const handleopenModalEdit = () => setopenModalEdit(true);
  const handlecloseModalEdit = () => setopenModalEdit(false);
  const [valueStationId, setValueStationId] = React.useState(null);
  const [showSequence, setShowSequence] = React.useState(false);
  const [showFirstStationSwitch, setShowFirstStationSwitch] =
    React.useState(false);
  const [showFinishStationSwitch, setShowFinishStationSwitch] =
    React.useState(false);
  const [showRefFirst, setShowRefFirst] = React.useState(false);
  const [showRefFinish, setShowRefFinish] = React.useState(false);
  const [ischeckedFirstStation, setIscheckedFirstStation] =
    React.useState(false);
  const [ischeckedFinishStation, setIscheckedFinishStation] =
    React.useState(false);
  const [disalbedEdit, setDisalbedEdit] = React.useState<boolean>(false);
  const [disalbedSwitchFirstStation, setDisalbedSwitchFirstStation] =
    React.useState<boolean>(false);
  const [disalbedSwitchFinishStation, setDisalbedSwitchFinishStation] =
    React.useState<boolean>(false);
  const [disalbedRefMFG, setDisalbedRefMFG] = React.useState<boolean>(false);
  const [disalbedRefFinish, setDisalbedRefFinish] =
    React.useState<boolean>(false);
  const [disalbedSeq, setDisalbedSeq] = React.useState<boolean>(false);
  const [loadingDDL, setLoadingDDL] = React.useState(false);

  const [typeDDL, setTypeDDL] = React.useState<number>(0);
  useEffect(() => {
    // Check if all required fields have values
    setDisalbedEdit(
      valueLineName === null ||
        valueLineName.trim() === "" ||
        selectedScheduledLine === null ||
        selectedScheduledLine === "" ||
        valueTaktTime === null ||
        valueTaktTime === ""
    );
  }, [valueLineName, selectedScheduledLine, valueTaktTime]);

  useEffect(() => {
    const FetchPage = async () => {
      await fetchDataDropDownStationListAutoComplete();
      await fetchDataHeader();
    };
    FetchPage();
  }, []);

  useEffect(() => {
    fetchDataDetail();
  }, [stationTypeList]);

  async function fetchDataHeader() {
    setOpenBackDrop(true);
    try {
      await instanceAxios
        .get(`/Line/GetLineById?lineId=${location.state.lineId}`)
        .then(
          async (response) => {
            if (response.data.status == "success") {
              //Set Header
              setValueLineId(location.state.lineId);
              setValueScheduledLineCode(location.state.scheduledLineCode);
              setSelectedScheduledLine(location.state.scheduledLineCode);
              setScheduledLineDisplay(
                `${response.data.data.scheduledLineCode} : ${response.data.data.scheduledLineName}`
              );
              setValueLineName(response.data.data.name);
              setDisplayLineName(response.data.data.name);
              setValueTaskTime(response.data.data.taktTime);
              setDisplayTaskTime(response.data.data.taktTime);
              setOpenBackDrop(false);
            } else {
              toastAlert("error", "Error call api", 5000);
              setOpenBackDrop(false);
            }
          },
          (error) => {
            toastAlert("error", error.response.data.message, 5000);
            setOpenBackDrop(false);
          }
        );
    } catch (error) {
      console.log("error", error);
      setOpenBackDrop(false);
    }
  }

  async function fetchDataDetail() {
    try {
      await instanceAxios
        .get(`/Station/GetStationByLineId?lineId=${location.state.lineId}`)
        .then(
          async (response) => {
            if (response.data.status == "success") {
              const stationList: StationModel[] = response.data.data.map(
                (item: any) => {
                  const typeData = stationTypeList.find(
                    (x) => x.code === item.type.toString()
                  );
                  return {
                    ...item,
                    typeName: typeData ? typeData.text : "",
                    sequence: item.sequence === 0 ? "" : item.sequence,
                    valueRefMFG:
                      item.valueRefMFG === null ? "" : item.valueRefMFG,
                    createdOn: item.createdOn
                      ? moment(item.createdOn).format("DD-MM-YYYY hh:mm:ss")
                      : "",
                    modifiedOn: item.modifiedOn
                      ? moment(item.modifiedOn).format("DD-MM-YYYY hh:mm:ss")
                      : "",
                  };
                }
              );
              setStationList(stationList);
              setOpenBackDrop(false);
            } else {
              toastAlert("error", "Error Call Api GetStationByLineId!", 5000);
              setOpenBackDrop(false);
            }
          },
          (error) => {
            toastAlert("error", error.response.data.message, 5000);
            setOpenBackDrop(false);
          }
        );
    } catch (error) {
      console.log("error", error);
      setOpenBackDrop(false);
    }
  }

  async function fetchDataDropDownStationListAutoComplete() {
    setShowSequence(true);
    setShowFirstStationSwitch(true);
    setShowFinishStationSwitch(true);
    setShowRefFirst(true);
    setShowRefFinish(true);

    //fetch detail data
    try {
      await instanceAxios.get(`/Constant/GetConstantByGRP?grp=DD_STATION`).then(
        async (response) => {
          if (response.data.status == "success") {
            const stationTypeList: StationTypeModel[] = response.data.data.map(
              (item: any) => ({
                code: item.code,
                text: item.text,
              })
            );
            setStationTypeList(stationTypeList);
          } else {
            toastAlert("error", "Error Call Api GetConstantByGRP!", 5000);
          }
        },
        (error) => {
          toastAlert("error", error.response.data.message, 5000);
        }
      );
    } catch (error) {
      console.log("error", error);
    }
  }

  async function updateLine() {
    try {
      await instanceAxios
        .put(`/Line/UpdateLine`, {
          lineId: valueLineId,
          name: valueLineName,
          scheduledLineCode: selectedScheduledLine,
          taktTime: valueTaktTime,
        })
        .then(
          async (response) => {
            if (response.data.status == "success") {
              await fetchDataHeader();
              toastAlert("success", response.data.message, 5000);
            } else {
              toastAlert("error", response.data.message, 5000);
            }
            setopenModalLineEdit(false);
          },
          (error) => {
            toastAlert("error", error.response.data.message, 5000);
          }
        );
    } catch (error) {
      console.log("error", error);
    }
  }

  async function handleExpansion() {
    setExpanded((prevExpanded) => !prevExpanded);
  }

  async function handleChangeValueLineName(e: any) {
    e.preventDefault();
    setValueLineName(e.target.value);
  }

  async function handleChangeValueTaktTime(e: any) {
    e.preventDefault();
    setValueTaskTime(e.target.value);
  }

  async function handlecloseModalLineEdit() {
    setopenModalLineEdit(false);
    setValueLineName(valueLineName);
  }

  async function handleChangeStationType(e: any) {
    setTypeDDL(e["code"]);
    if (e["code"] == 1) {
      setShowSequence(true);
      setShowFirstStationSwitch(true);
      setShowFinishStationSwitch(true);
      setShowRefFirst(true);
      setShowRefFinish(true);
      setDisalbedSeq(false);
      setDisalbedRefMFG(false);
      setDisalbedRefFinish(true);
      setDisalbedSwitchFirstStation(false);
      setDisalbedSwitchFinishStation(false);
      setValueSequence(1);
      setIscheckedFirstStation(true);
      setIscheckedFinishStation(false);
      setValueRefMFG(null);
      setValueRefMFGFinish(null);
    } else if (e["code"] == 2) {
      setShowSequence(true);
      setDisalbedSeq(true);
      setDisalbedRefMFG(false);
      setValueSequence(0);
      setShowFirstStationSwitch(true);
      setDisalbedSwitchFirstStation(true);
      setIscheckedFirstStation(false);
      setShowFinishStationSwitch(true);
      setIscheckedFinishStation(false);
      setDisalbedSwitchFinishStation(false);
      setShowRefFirst(true);
      setValueRefMFG(null);
      setShowRefFinish(true);
      setValueRefMFGFinish(null);
    } else if (e["code"] == 3) {
      setShowSequence(false);
      setValueSequence(0);
      setShowFirstStationSwitch(false);
      setIscheckedFirstStation(false);
      setShowFinishStationSwitch(false);
      setIscheckedFinishStation(false);
      setShowRefFirst(false);
      setValueRefMFG(null);
      setShowRefFinish(false);
      setValueRefMFGFinish(null);
    } else if (e["code"] == 4) {
      setShowSequence(false);
      setValueSequence(0);
      setShowFirstStationSwitch(false);
      setIscheckedFirstStation(false);
      setShowFinishStationSwitch(false);
      setIscheckedFinishStation(false);
      setShowRefFirst(false);
      setValueRefMFG(null);
      setShowRefFinish(false);
      setValueRefMFGFinish(null);
    }
    setSelectedStationType(e.code);
  }

  async function handleChangeValueSequence(e: any) {
    e.preventDefault();
    setValueSequence(e.target.value ?? 0);
  }

  async function handleChangeShowFirstStationSwitch(e: any) {
    setIscheckedFirstStation(e.target.checked);
    setDisalbedRefMFG(!e.target.checked);
    setValueRefMFG(null);
  }

  async function handleChangeValueMFG(e: any) {
    e.preventDefault();
    setValueRefMFG(e.target.value);
  }

  async function handleChangeShowFinishStationSwitch(e: any) {
    setIscheckedFinishStation(e.target.checked);
    setDisalbedRefFinish(!e.target.checked);

    // if (!ischeckedFirstStation && selectedStationType !== "2") {
    //   setValueRefMFG(null);
    // }

    setValueRefMFGFinish(null);
  }

  async function handleChangeValueMFGFinish(e: any) {
    setValueRefMFGFinish(e.target.value);
  }

  async function validateStation() {
    switch (selectedStationType) {
      case "1": {
        if (valueStationName === null || valueStationName === "") {
          toastAlert("error", "Please Enter Station Name", 5000);
          return false;
        }
        if (valueSequence == null) {
          toastAlert("error", "Please Enter Sequence ", 5000);
          return false;
        }

        if (ischeckedFirstStation) {
          if (valueRefMFG === null || valueRefMFG === "") {
            toastAlert("error", "Please Enter Value Ref. MFG", 5000);
            return false;
          }
        }

        if (ischeckedFinishStation) {
          if (valueRefMFGFinish == null || valueRefMFGFinish == "") {
            toastAlert(
              "error",
              "Please Enter Value Ref. MFG(Finish Station)",
              5000
            );
            return false;
          }
        }
        break;
      }
      case "2": {
        setValueSequence(0);
        if (valueStationName == null || valueStationName == "") {
          toastAlert("error", "Please Enter Station Name", 5000);
          return false;
        }
        if (valueRefMFG == null || valueRefMFG == "") {
          toastAlert("error", "Please Enter Value Ref. MFG", 5000);
          return false;
        }
        if (ischeckedFinishStation) {
          if (valueRefMFGFinish == null || valueRefMFGFinish == "") {
            toastAlert(
              "error",
              "Please Enter Value Ref. MFG(Finish Station)",
              5000
            );
            return false;
          }
        }
        break;
      }
      case "3": {
        if (valueStationName == null || valueStationName == "") {
          toastAlert("error", "Please Enter Station Name", 5000);
          return false;
        }
        break;
      }
      case "4": {
        if (valueStationName == null || valueStationName == "") {
          toastAlert("error", "Please Enter Station Name", 5000);
          return false;
        }
        break;
      }
      default: {
        //statements;
        break;
      }
    }
    return true;
  }

  async function createStation() {
    if (await validateStation()) {
      try {
        await instanceAxios
          .post(`/Station/CreateStation`, {
            name: valueStationName,
            lineId: valueLineId,
            scheduledLineCode: valueScheduledLineCode,
            sequence: valueSequence,
            type: selectedStationType,
            isFirstStation: ischeckedFirstStation,
            isFinishedStation: ischeckedFinishStation,
            refMFG: valueRefMFG,
            refFinishedMFG: valueRefMFGFinish,
          })
          .then(
            async (response) => {
              if (response.data.status == "success") {
                await fetchDataDetail();
                handlecloseModalCreate();
                toastAlert("success", "Create Station Success!", 5000);
              } else {
                toastAlert("error", response.data.message, 5000);
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
  }

  async function editStation() {
    if (await validateStation()) {
      try {
        await instanceAxios
          .put(`/Station/UpdateStation`, {
            name: valueStationName,
            lineId: valueLineId,
            scheduledLineCode: valueScheduledLineCode,
            sequence: valueSequence,
            type: selectedStationType,
            isFirstStation: ischeckedFirstStation,
            isFinishedStation: ischeckedFinishStation,
            refMFG: valueRefMFG,
            refFinishedMFG: valueRefMFGFinish,
            stationId: valueStationId,
          })
          .then(
            async (response) => {
              if (response.data.status == "success") {
                await fetchDataDetail();
                handlecloseModalEdit();
                toastAlert("success", "Update Station Success!", 5000);
              } else {
                toastAlert("error", "Error Call Api UpdateStation!", 5000);
              }
            },
            (error) => {
              toastAlert("error", error.response.data.message, 5000);
            }
          );
      } catch (error) {
        console.log("error", error);
      }
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
      confirmButtonText: "Yes, confirm it!",
    }).then(async (result: any) => {
      if (result.isConfirmed) {
        try {
          await instanceAxios
            .put(`/Station/RemoveStation?stationId=${id}`)
            .then(
              async (response) => {
                if (response.data.status == "success") {
                  await fetchDataDetail();
                  toastAlert("error", "Deleted Station!", 5000);
                } else {
                  toastAlert("error", "Error Call Api RemoveStation!", 5000);
                }
              },
              (error) => {
                toastAlert("error", error.response.data.message, 5000);
              }
            );
        } catch (error) {
          console.log("error", error);
        }
      }
    });
  }

  async function setValueModalCreate() {
    setIsCreateStation(true);
    setShowSequence(true);
    setShowFirstStationSwitch(true);
    setShowFinishStationSwitch(true);
    setShowRefFirst(true);
    setShowRefFinish(true);
    setTypeDDL(1);
    setValueStationName("");
    const lastSequence = _.maxBy(stationList, "sequence")?.sequence ?? 0;
    let nextMultipleOfTen = Math.ceil(lastSequence / 10) * 10;
    if (lastSequence == nextMultipleOfTen) {
      nextMultipleOfTen += 10;
    }
    const isFirstStation = _.find(stationList, function (it) {
      return it.isFirstStation === true;
    });
    if (!isFirstStation) {
      nextMultipleOfTen = 1;
      setIscheckedFirstStation(true);
      setDisalbedRefMFG(false);
    } else {
      setIscheckedFirstStation(false);
      setDisalbedRefMFG(true);
    }
    setValueSequence(nextMultipleOfTen);
    setIscheckedFinishStation(false);
    setDisalbedSeq(false);
    setDisalbedSwitchFirstStation(false);

    setDisalbedRefFinish(true);
    setValueRefMFG(null);
    setValueRefMFGFinish(null);
    setSelectedStationType("1");
    handleopenModalCreate();
  }

  async function setValueModalEdit(rows: any) {
    setStationTypeListDisplay(
      stationTypeList.find((it) => it.code === rows["type"].toString()) ?? null
    );
    setSelectedStationType(rows["type"].toString());
    setValueStationId(rows["stationId"]);
    setValueStationName(rows["name"]);
    setValueSequence(0);
    setTypeDDL(rows["type"]);
    if (rows["type"] == 1) {
      setValueSequence(rows["sequence"]);
      setShowSequence(true);
      setDisalbedSwitchFirstStation(false);
      setShowFirstStationSwitch(true);
      setIscheckedFirstStation(rows["isFirstStation"]);
      setShowFinishStationSwitch(true);
      setIscheckedFinishStation(rows["isFinishedStation"]);
      setDisalbedSeq(rows["isFirstStation"]);
      setDisalbedRefMFG(!rows["isFirstStation"]);
      setShowRefFirst(true);
      setValueRefMFG(rows["refMFG"]);
      setShowRefFinish(true);
      setValueRefMFGFinish(rows["refFinishedMFG"]);
    } else if (rows["type"] == 2) {
      setShowSequence(true);
      setShowFirstStationSwitch(true);
      setIscheckedFirstStation(false);
      setShowFinishStationSwitch(true);
      setIscheckedFinishStation(rows["isFinishedStation"]);
      setShowRefFirst(true);
      setValueRefMFG(rows["refMFG"]);
      setDisalbedRefMFG(false);
      setShowRefFinish(true);
      setValueRefMFGFinish(rows["refFinishedMFG"]);
      setDisalbedRefFinish(!rows["refFinishedMFG"]);
      setDisalbedSeq(true);
      setDisalbedSwitchFirstStation(true);
    } else if (rows["type"] == 3) {
      setShowSequence(false);
      setShowFirstStationSwitch(false);
      setIscheckedFirstStation(false);
      setShowFinishStationSwitch(false);
      setIscheckedFinishStation(false);
      setShowRefFirst(false);
      setValueRefMFG(null);
      setShowRefFinish(false);
      setValueRefMFGFinish(null);
    } else if (rows["type"] == 4) {
      setShowSequence(false);
      setShowFirstStationSwitch(false);
      setIscheckedFirstStation(false);
      setShowFinishStationSwitch(false);
      setIscheckedFinishStation(false);
      setShowRefFirst(false);
      setValueRefMFG(null);
      setShowRefFinish(false);
      setValueRefMFGFinish(null);
    }

    handleopenModalEdit();
  }

  async function GetScheduledLineDDL() {
    await GetScheduledLineAPI().then(async (x) => {
      if (x.status == "success") {
        const ddlSheduLine: DDLModel[] = x.data.map((item: any) => ({
          label: `${item.scheduledLineCode} : ${item.name}`,
          value: item.scheduledLineCode,
        }));

        setScheduledLineDDL(ddlSheduLine);
        setLoadingDDL(false);
      } else {
        setLoadingDDL(false);
      }
    });
  }

  const columns: GridColDef[] = [
    {
      field: "action",
      headerName: "",
      headerAlign: "center",
      sortable: false,
      minWidth: 100,
      flex: 0.5,
      renderCell: (params: any) => {
        return (
          <>
            <Button sx={{ minWidth: 0, padding: "4px" }}>
              <EditIcon
                onClick={() => setValueModalEdit(params.row)}
                fontSize="small"
              />
            </Button>

            <Button sx={{ minWidth: 0, padding: "4px" }}>
              <DeleteIcon
                onClick={() => deleteStation(params.row.stationId)}
                fontSize="small"
              />
            </Button>
          </>
        );
      },
    },
    {
      field: "name",
      headerName: "Station",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "typeName",
      headerName: "Station Type",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "sequence",
      headerName: "Sequence",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "isFirstStation",
      headerName: "First Station",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "isFinishedStation",
      headerName: "Finished Station",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "refMFG",
      headerName: "refMFG",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "refStationName",
      headerName: "refStation",
      minWidth: 150,
      flex: 1,
    },
    {
      field: "createdOn",
      headerName: "createdOn",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "createdBy",
      headerName: "createdBy",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "modifiedOn",
      headerName: "modifiedOn",
      minWidth: 200,
      flex: 1,
    },
    {
      field: "modifiedBy",
      headerName: "modifiedBy",
      minWidth: 200,
      flex: 1,
    },
  ];

  const [openBackDrop, setOpenBackDrop] = React.useState(true);

  const isSaveDisabled =
    (selectedStationType === "1" &&
      (valueStationName === null ||
        valueStationName.trim() === "" ||
        valueSequence === null ||
        valueSequence.toString().trim() === "" ||
        (ischeckedFirstStation &&
          (valueRefMFG === null ||
            valueRefMFG.trim() === "" ||
            valueStationName === null ||
            valueStationName.trim() === "" ||
            valueSequence === null ||
            valueSequence.toString().trim() === "")) ||
        (ischeckedFinishStation &&
          (valueRefMFGFinish === null ||
            valueRefMFGFinish.trim() === "" ||
            valueStationName === null ||
            valueStationName.trim() === "" ||
            valueSequence === null ||
            valueSequence.toString().trim() === "")))) ||
    (selectedStationType === "2" &&
      (valueStationName === null ||
        valueStationName.trim() === "" ||
        valueRefMFG === null ||
        valueRefMFG.trim() === "" ||
        (ischeckedFinishStation &&
          (valueRefMFGFinish === null ||
            valueRefMFGFinish.trim() === "" ||
            valueStationName === null ||
            valueStationName.trim() === "")))) ||
    (selectedStationType === "3" &&
      (valueStationName === null || valueStationName.trim() === "")) ||
    (selectedStationType === "4" &&
      (valueStationName === null || valueStationName.trim() === ""));
  return (
    <>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={authRequest}
        errorComponent={ErrorComponent}
        loadingComponent={Loading}
      >
        <Backdrop
          sx={{ color: "#fff", zIndex: (theme) => theme.zIndex.drawer + 1 }}
          open={openBackDrop}
        >
          <CircularProgress color="inherit" />
        </Backdrop>
        <Grid container spacing={2}>
          <Grid item xs={6} md={8}>
            <Box>
              <ActiveLastBreadcrumb
                prm1="Master Data"
                prm2="Line"
                prm3="Station"
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
              <Typography>Line</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Grid container>
                <Grid item xs={12} md={10} xl={10}>
                  <Grid container spacing={0}>
                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          Line Name:
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {displayLineName}
                        </Typography>
                      </Box>
                    </Grid>
                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          Schedule Line:
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {scheduledLineDisplay}
                        </Typography>
                      </Box>
                    </Grid>

                    <Grid item xs={12} md={5}>
                      <Box display="flex" alignItems="center">
                        <Typography variant="subtitle1" color="textSecondary">
                          Takt Time:
                        </Typography>
                        <Typography variant="body1" ml={1}>
                          {displayTaktTime}
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
                        onClick={handleopenModalLineEdit}
                        startIcon={<BorderColorIcon />}
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
              <Typography>Station</Typography>
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
                        startIcon={<AddBoxIcon />}
                        onClick={setValueModalCreate}
                      >
                        Create
                      </Button>
                    </Box>
                  </Grid>
                </Box>

                <Box sx={{ height: "100%", width: "100%" }}>
                  <StyledDataGrid
                    rows={stationList}
                    getRowId={(data) => data.stationId}
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
        {/* Line edit */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalLineEdit}
          // onClose={handlecloseModalLineEdit}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "50vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Edit Line
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  label="Line Name"
                  id="outlined-size-small"
                  defaultValue=""
                  value={valueLineName ? valueLineName : ""}
                  size="small"
                  style={{ width: "100%" }}
                  onChange={handleChangeValueLineName}
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <Autocomplete
                  id="scheduledLine-box-demo"
                  size="small"
                  onOpen={() => {
                    setLoadingDDL(true);
                    GetScheduledLineDDL();
                  }}
                  onClose={() => setLoadingDDL(false)}
                  defaultValue={{
                    label: `${scheduledLineDisplay}`,
                    value: selectedScheduledLine,
                  }}
                  options={scheduledLineDDL}
                  loading={loadingDDL}
                  onChange={(_, value) =>
                    setSelectedScheduledLine(value?.value ?? "")
                  }
                  isOptionEqualToValue={(option, value) =>
                    option.value === value.value
                  }
                  getOptionLabel={(option) => option.label}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="ScheduledLine"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {loadingDDL ? (
                              <CircularProgress color="inherit" size={20} />
                            ) : null}
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              <Grid item xs={12} md={12}>
                <TextField
                  label="Takt Time"
                  id="outlined-size-small"
                  defaultValue=""
                  value={valueTaktTime ? valueTaktTime : ""}
                  size="small"
                  style={{ width: "100%" }}
                  onChange={handleChangeValueTaktTime}
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>
              <Grid item xs={6} md={6} container justifyContent="flex-start">
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handlecloseModalLineEdit();
                    }}
                  >
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
                    <Button
                      variant="contained"
                      onClick={updateLine}
                      disabled={disalbedEdit}
                    >
                      Save
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
            </Grid>
          </ModalContent>
        </Modal>
        {/* create */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalCreate}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "50vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Create Station
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Station Name"
                  id="stationName-size-small"
                  size="small"
                  onChange={async (value) => {
                    await setValueStationName(value.target.value);
                  }}
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>
              <Grid item xs={6} md={typeDDL == 3 || typeDDL == 4 ? 12 : 6}>
                <Autocomplete
                  sx={{ width: "100%" }}
                  size="small"
                  disableClearable
                  onChange={(_, newValue) => {
                    handleChangeStationType(newValue);
                  }}
                  id="station-Create-box"
                  defaultValue={stationTypeList[0]}
                  options={stationTypeList}
                  getOptionLabel={(options: any) => `${options.text}`}
                  renderInput={(params) => (
                    <TextField
                      {...params}
                      label="Station Type"
                      InputProps={{
                        ...params.InputProps,
                        endAdornment: (
                          <React.Fragment>
                            {params.InputProps.endAdornment}
                          </React.Fragment>
                        ),
                      }}
                    />
                  )}
                />
              </Grid>
              {showSequence && (
                <Grid item xs={6} md={6}>
                  <TextField
                    type="number"
                    sx={{ width: "100%" }}
                    label="Sequence"
                    id="sequence-size-small"
                    defaultValue=""
                    value={valueSequence ? valueSequence : ""}
                    disabled={disalbedSeq}
                    size="small"
                    onChange={handleChangeValueSequence}
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>
              )}
              {showFirstStationSwitch && (
                <Grid item xs={6} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={ischeckedFirstStation}
                        onChange={handleChangeShowFirstStationSwitch}
                        disabled={disalbedSwitchFirstStation}
                      />
                    }
                    label="First Station"
                  />
                </Grid>
              )}
              {showRefFirst && (
                <Grid item xs={6} md={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Ref. MFG"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueRefMFG ? valueRefMFG : ""}
                    size="small"
                    onChange={handleChangeValueMFG}
                    inputProps={{ maxLength: 200 }}
                    disabled={disalbedRefMFG}
                  />
                </Grid>
              )}
              {showFinishStationSwitch && (
                <Grid item xs={6} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={ischeckedFinishStation}
                        onChange={handleChangeShowFinishStationSwitch}
                        disabled={disalbedSwitchFinishStation}
                      />
                    }
                    label="Finish Station"
                  />
                </Grid>
              )}
              {showRefFinish && (
                <Grid item xs={6} md={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Ref. MFG (Finish Station)"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueRefMFGFinish ? valueRefMFGFinish : ""}
                    size="small"
                    onChange={handleChangeValueMFGFinish}
                    disabled={disalbedRefFinish}
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>
              )}
              <Grid item xs={6} md={6} container justifyContent="flex-start">
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handlecloseModalCreate();
                    }}
                  >
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
                    <Button
                      variant="contained"
                      onClick={createStation}
                      disabled={isSaveDisabled}
                    >
                      Create
                    </Button>
                  </ButtonGroup>
                </Box>
              </Grid>
            </Grid>
          </ModalContent>
        </Modal>

        {/* edit */}
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openModalEdit}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: "50vw" }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              Edit Station
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={12}>
                <TextField
                  sx={{ width: "100%" }}
                  label="Station Name"
                  id="outlined-size-small"
                  defaultValue={valueStationName}
                  size="small"
                  onChange={(value) => {
                    setValueStationName(value.target.value);
                  }}
                  inputProps={{ maxLength: 200 }}
                />
              </Grid>
              <Grid item xs={12} md={typeDDL == 3 || typeDDL == 4 ? 12 : 6}>
                <Autocomplete
                  sx={{ width: "100%" }}
                  disableClearable={true}
                  onChange={(_, newValue) => {
                    handleChangeStationType(newValue);
                  }}
                  size="small"
                  id="combo-Station-box-demo"
                  defaultValue={stationTypeListDisplay ?? undefined}
                  isOptionEqualToValue={(option, value) =>
                    option.code === value.code
                  }
                  options={stationTypeList}
                  getOptionLabel={(options: any) => `${options.text}`}
                  renderInput={(params) => (
                    <TextField {...params} label="Station Type" />
                  )}
                  ListboxProps={{
                    style: {
                      maxHeight: "100px",
                    },
                  }}
                />
              </Grid>

              {showSequence && (
                <Grid item xs={6} md={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Sequence"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueSequence ? valueSequence : ""}
                    size="small"
                    onChange={handleChangeValueSequence}
                    inputProps={{ maxLength: 200 }}
                    disabled={disalbedSeq}
                  />
                </Grid>
              )}

              {showFirstStationSwitch && (
                <Grid item xs={6} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={ischeckedFirstStation}
                        onChange={handleChangeShowFirstStationSwitch}
                        disabled={disalbedSwitchFirstStation}
                      />
                    }
                    label="First Station"
                  />
                </Grid>
              )}
              {showRefFirst && (
                <Grid item xs={6} md={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Ref. MFG"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueRefMFG ? valueRefMFG : ""}
                    size="small"
                    onChange={handleChangeValueMFG}
                    disabled={disalbedRefMFG}
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>
              )}
              {showFinishStationSwitch && (
                <Grid item xs={6} md={6}>
                  <FormControlLabel
                    control={
                      <Switch
                        checked={ischeckedFinishStation}
                        onChange={handleChangeShowFinishStationSwitch}
                        disabled={disalbedSwitchFinishStation}
                      />
                    }
                    label="Finish Station"
                  />
                </Grid>
              )}
              {showRefFinish && (
                <Grid item xs={6} md={6}>
                  <TextField
                    sx={{ width: "100%" }}
                    label="Ref. MFG (Finish Station)"
                    id="outlined-size-small"
                    defaultValue=""
                    value={valueRefMFGFinish ? valueRefMFGFinish : ""}
                    disabled={disalbedRefFinish}
                    size="small"
                    onChange={handleChangeValueMFGFinish}
                    inputProps={{ maxLength: 200 }}
                  />
                </Grid>
              )}
              <Grid item xs={6} md={6} container justifyContent="flex-start">
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={() => {
                      handlecloseModalEdit();
                    }}
                  >
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
                    <Button variant="contained" onClick={editStation} disabled={isSaveDisabled}>
                      Save
                    </Button>
                  </ButtonGroup>
                </Box>
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
