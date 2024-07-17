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
  CircularProgress,
  Grid,
  TextField,
} from "@mui/material";
import * as React from "react";
import _ from "lodash";
import InspectionDataHeader from "../ui-components/MasterData/InspectionDataHeader";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import moment from "moment";
import "dayjs/locale/en-gb";
import { GetInspectionDataAPI, GetInspectionGroupByParamAPI } from "@api/axios/inspectionDataAPI";
import {
  GetLineAPI,
  GetModelGroupAPI,
  GetScheduledLineAPI,
  GetStationAPI,
} from "@api/axios/inspectionGroupAPI";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";


export default function InspectionData() {
  const authRequest = {
    ...loginRequest,
  };
  const [openBackDrop, setOpenBackDrop] = React.useState(false);
  const [dataList, setDataList] = React.useState<InspectionDataModel[]>([]);
  const [dateFromValue, setDateFromValue] = React.useState<Dayjs | null>( dayjs().subtract(7, "day"));
  const [dateToValue, setDateToValue] = React.useState<Dayjs | null>(dayjs());
  const [filterData, setFilterData] = React.useState<FilterModal>({
    dateFrom: moment().subtract(7, "days").format("YYYY-MM-DD"),
    dateTo: moment().format("YYYY-MM-DD"),
    id_no: "",
    inspectionGroupId: 0,
    modelGroupId: 0,
    stationId: 0,
    lineId: 0,
    scheduledLineCode: "",
  });
  const [paginationValue , setPaginationValue] = React.useState<PaginationModel>({
    pageCount : 10 ,
    pageNo : 1 ,
    pageSize : 10,
    totalRecords : 100
  })

  const handleDateFromChange = (date: Dayjs | null) => {
    if (date) {
      setDateFromValue(date);
      setFilterData((prev) => ({
        ...prev,
        dateFrom: date.format("YYYY-MM-DD"),
      }));
    }
  };

  const handleDateToChange = (date: Dayjs | null) => {
    if (date) {
      setDateToValue(date);
      if (!dateFromValue) {
        setFilterData((prev) => ({
          ...prev,
          dateTo: date.format("YYYY-MM-DD"),
        }));
      } else {
        const newFromDate = date.subtract(7, "day");
        setDateFromValue(newFromDate);
        setFilterData((prev) => ({
          ...prev,
          dateTo: date.format("YYYY-MM-DD"),
          dateFrom: newFromDate.format("YYYY-MM-DD"),
        }));
      }
    }
  };

  const disableDateFrom = (date: Dayjs) => {
    return (
      date.isBefore(dateToValue?.subtract(7, "day")) ||
      date.isAfter(dateToValue)
    );
  };

  const disableDateTo = (date: Dayjs) => {
    if (!dateFromValue) {
      return false; // Allow any date if dateFromValue is not set
    }
    return (
      date.isBefore(dateFromValue) || date.isAfter(dateFromValue.add(7, "day"))
    );
  };

 
  async function GetInspectionDataPage() {
    await GetInspectionDataAPI(1, 10, filterData).then((rs) => {
      if (rs.status === "success") {
        const dataAPI: InspectionDataModel[] = rs.data.data.map((item: any) => ({
          inspectId: item.inspectId ,
          scheduledLineName: `${item.scheduledLineCode} : ${item.scheduledLineName}` ,
          scheduledLineCode: item.scheduledLineCode ,
          lineName: item.lineName ,
          stationName: item.stationName ,
          inspectionGroupId: item.inspectionGroupId ,
          inspectionGroupName: item.inspectionGroupName ,
          id_no: item.id_no ,
          pinCode : item.pinCode,
          modelGroupName: item.modelGroupName ,
          modelName: item.modelName ,
          createdBy: item.createdBy ,
          createdOn:
            item.createdOn == null
              ? ""
              : moment(item.createdOn).format("DD-MM-YYYY HH:mm:ss"),
          modifiedBy: item.modifiedBy ,
          modifiedOn:
            item.modifiedOn == null
              ? ""
              : moment(item.modifiedOn).format("DD-MM-YYYY HH:mm:ss"),
        }));
        const paginationAPI : PaginationModel ={ 
          pageCount : rs.data.pagination.pageCount,
          pageNo : rs.data.pagination.pageNo,
          pageSize : rs.data.pagination.pageSize,
          totalRecords : rs.data.pagination.totalRecords
        }
        setDataList(dataAPI);
        setPaginationValue(paginationAPI);
        setOpenBackDrop(false)
      }else{
        toastAlert(rs.status, rs.message , 5000)
        setOpenBackDrop(false)
      }
    });
  }

  const filterAction = async () => {
    setOpenBackDrop(true)
    try {
      filterData.dateFrom = dayjs(dateFromValue).format("YYYY-MM-DD");
      filterData.dateTo = dayjs(dateToValue).format("YYYY-MM-DD");
      filterData.inspectionGroupId = selectedInsGroup;
      filterData.lineId = selectedLine;
      filterData.modelGroupId = selectedmodelGroup;
      filterData.scheduledLineCode = selectedScheduledLine;
      filterData.stationId = selectedStation;
      await GetInspectionDataPage();
    } catch (error) {
      setOpenBackDrop(false)
      console.error("Error in filterAction:", error);
    }
  };

  const [loadingDDL, setLoadingDDL] = React.useState(false);
  const [selectedScheduledLine, setSelectedScheduledLine] = React.useState<string>("");
  const [scheduledLineDDL, setScheduledLineDDL] = React.useState<DDLModel[]>([]);
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

  const [loadingLineDDL, setLoadingLineDDL] = React.useState(false);
  const [lineDDL, setLineDDL] = React.useState<DDLModel[]>([]);
  const [selectedLine, setSelectedLine] = React.useState<number>(0);
  const handleOpenLine = async (selectedScheduledLine: string) => {
    await GetLineDDL(selectedScheduledLine);
  };
  async function GetLineDDL(ScheduledLineCode: string) {
    await GetLineAPI(ScheduledLineCode).then(async (x) => {
      if (x.status == "success") {
        const ddlLine: DDLModel[] = x.data.map((item: any) => ({
          label: `${item.label}`,
          value: item.value,
        }));
        await setLineDDL(ddlLine);
        setLoadingLineDDL(false);
      } else {
        setLoadingLineDDL(false);
      }
    });
  }

  const [loadingStationDDL, setLoadingStationDDL] = React.useState(false);
  const [stationDDL, setStationDDL] = React.useState<DDLModel[]>([]);
  const [selectedStation, setSelectedStation] = React.useState<number>(0);
  const handleOpenStation = async (lineId: number) => {
    await GetStationDDL(lineId);
  };
  async function GetStationDDL(LineId: number) {
    await GetStationAPI(LineId).then(async (x) => {
      console.log(x);
      if (x.status == "success") {
        const ddlStation: DDLModel[] = x.data.map((item: any) => ({
          label: `${item.name}`,
          value: item.stationId,
        }));
        await setStationDDL(ddlStation);
        setLoadingStationDDL(false);
      } else {
        setLoadingStationDDL(false);
      }
    });
  }

  const [loadingModelGroupDDL, setLoadingModelGroupDDL] = React.useState(false);
  const [modelGroupDDL, setModelGroupDDL] = React.useState<DDLModel[]>([]);
  const [selectedmodelGroup, setSelectedModelGroup] =
  React.useState<number>(0);
  const handleOpenModelGroup = async (lineId: number) => {
    await GetModelGroupDDL(lineId);
  };
  function GetModelGroupDDL(LineId: number) {
    GetModelGroupAPI().then((x) => {
      if (x.status == "success") {
        const ddlModelGroup = _.chain(x.data.modelGroup)
          .filter((item) => item.lineId === LineId) // เงื่อนไข filter ด้วย LineId
          .map((item) => ({
            label: `${item.name}`,
            value: item.modelGroupId,
          }))
          .value();
        setModelGroupDDL(ddlModelGroup);
        setLoadingModelGroupDDL(false);
      } else {
        setLoadingModelGroupDDL(false);
      }
    });
  }




  const [loadingInsGroupDDL, setLoadingInsGroupDDL] = React.useState(false);
  const [insGroupDDL, setInsGroupDDL] = React.useState<DDLModel[]>([]);
  const [selectedInsGroup, setSelectedInsGroup] = React.useState<number>(0);
  const handleOpenInsGroup = async (scheduledLineCode : string, stationId : number ,modelGroupId : number ,lineId: number) => {
    await GetInsGroupDDL(scheduledLineCode , stationId , modelGroupId , lineId);
  };
  async function GetInsGroupDDL(ScheduledLineCode : string, stationId : number ,modelGroupId : number ,lineId: number) {
    let body = {
      scheduledLineCode : ScheduledLineCode ,
      lineId : lineId,
      stationId : stationId ,
      modelGroupId :modelGroupId
    }
    
    await GetInspectionGroupByParamAPI(body).then(async (x) => {
      if (x.status == "success") {
        const ddlInsGroup: DDLModel[] = x.data.map((item: any) => ({
          label: `${item.inspectionGroupName}`,
          value: item.inspectionGroupId,
        }));
        await setInsGroupDDL(ddlInsGroup);
        setLoadingInsGroupDDL(false);
      } else {
        setLoadingInsGroupDDL(false);
      }
    });
  }
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
          <Grid item xs={12} md={3}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"en-gb"}
            >
              <DatePicker
                format="YYYY-MM-DD"
                value={dateFromValue}
                label={"From"}
                onChange={handleDateFromChange}
                shouldDisableDate={disableDateFrom}
                slotProps={{
                  textField: { size: "small"  , fullWidth : true , error: false},
                  field: {
                    clearable: true,
                    onClear: () => {
                      setDateFromValue(null);
                      setFilterData((prev) => ({
                        ...prev,
                        dateFrom: "",
                      }));
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={12} md={3}>
            <LocalizationProvider
              dateAdapter={AdapterDayjs}
              adapterLocale={"en-gb"}
            >
              <DatePicker
                format="YYYY-MM-DD"
                value={dateToValue}
                label={"To"}
                onChange={handleDateToChange}
                shouldDisableDate={disableDateTo}
                slotProps={{
                  textField: { size: "small" , fullWidth : true , error: false},
                  field: {
                    clearable: true,
                    onClear: () => {
                      setDateToValue(dayjs());
                      setDateFromValue(dayjs().subtract(7, "days"));
                      setFilterData((prev) => ({
                        ...prev,
                        dateTo: moment().format("YYYY-MM-DD"),
                        dateFrom: moment()
                          .subtract(7, "days")
                          .format("YYYY-MM-DD"),
                      }));
                    },
                  },
                }}
              />
            </LocalizationProvider>
          </Grid>
          <Grid item xs={6} md={3}>
            <Autocomplete
              id="scheduledLine-box-demo"
              size="small"
              onOpen={() => {
                setLoadingDDL(true);
                GetScheduledLineDDL();
              }}
              onClose={() => setLoadingDDL(false)}
              options={scheduledLineDDL}
              loading={loadingDDL}
              onChange={async (_, value) => {
                setSelectedScheduledLine(value?.value ?? "0");
              }}
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
          <Grid item xs={6} md={2}>
            <Autocomplete
              id="Line-box-demo"
              size="small"
              onOpen={() => {
                setLoadingLineDDL(true);
                handleOpenLine(selectedScheduledLine ?? "");
              }}
              onClose={() => setLoadingLineDDL(false)}
              options={lineDDL}
              loading={loadingLineDDL}
              onChange={(_, value) =>
                setSelectedLine(Number(value?.value ?? 0))
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Line"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingLineDDL ? (
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
          <Grid item xs={6} md={3}>
            <Autocomplete
              id="Station-box-demo"
              size="small"
              onOpen={() => {
                setLoadingStationDDL(true);
                handleOpenStation(selectedLine as number);
              }}
              onClose={() => setLoadingStationDDL(false)}
              options={stationDDL}
              loading={loadingStationDDL}
              onChange={(_, value) =>
                setSelectedStation(Number(value?.value ?? 0))
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Station"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingStationDDL ? (
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
          <Grid item xs={6} md={3}>
            <Autocomplete
              id="ModelGroup-box-demo"
              size="small"
              onOpen={() => {
                setLoadingModelGroupDDL(true);
                handleOpenModelGroup(selectedLine as number);
              }}
              onClose={() => setLoadingModelGroupDDL(false)}
              options={modelGroupDDL}
              loading={loadingModelGroupDDL}
              onChange={(_, value) =>
                setSelectedModelGroup(Number(value?.value ?? 0))
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Model Group"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingModelGroupDDL ? (
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
          <Grid item xs={6} md={3}>
            <Autocomplete
              id="insGroup-box-demo"
              size="small"
              onOpen={() => {
                setLoadingInsGroupDDL(true);
                handleOpenInsGroup(
                  selectedScheduledLine,
                  selectedStation,
                  selectedmodelGroup,
                  selectedLine as number
                );
              }}
              onClose={() => setLoadingInsGroupDDL(false)}
              options={insGroupDDL}
              loading={loadingInsGroupDDL}
              onChange={(_, value) =>
                setSelectedInsGroup(Number(value?.value ?? 0))
              }
              isOptionEqualToValue={(option, value) =>
                option.value === value.value
              }
              getOptionLabel={(option) => option.label}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Inspection Group"
                  InputProps={{
                    ...params.InputProps,
                    endAdornment: (
                      <React.Fragment>
                        {loadingInsGroupDDL ? (
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
          <Grid item xs={6} md={2}>
          <TextField id="outlined-basic" label="ID No" variant="outlined" size="small" fullWidth />
          </Grid>
          <Grid item xs={12} md={1} container justifyContent="flex-end">
            <Box>
              <Button variant="outlined" onClick={filterAction}>
                Search
              </Button>
            </Box>
          </Grid>
          <Grid item xs={12} md={12} container>
          <InspectionDataHeader data={dataList} pagination={paginationValue} />
          </Grid>
        </Grid>
      </MsalAuthenticationTemplate>
    </>
  );
}
