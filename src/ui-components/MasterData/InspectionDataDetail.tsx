import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../../ui-components/Loading";
import { loginRequest } from "../../authProviders/authProvider";
import {
  Backdrop,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  List,
  ListItemButton,
  ListItemText,
  CardHeader,
  Typography,
  ImageList,
  ImageListItem,
} from "@mui/material";
import * as React from "react";
import _ from "lodash";
import MuiAccordion, { AccordionProps } from "@mui/material/Accordion";
import ArrowForwardIosSharpIcon from "@mui/icons-material/ArrowForwardIosSharp";
import MuiAccordionSummary, {
  AccordionSummaryProps,
} from "@mui/material/AccordionSummary";
import MuiAccordionDetails from "@mui/material/AccordionDetails";
import { styled } from "@mui/system";
import { GetInspectionDataDetailAPI } from "@api/axios/inspectionDataAPI";
import { InteractionType } from "@azure/msal-browser";
import { ErrorComponent } from "../ErrorComponent";
import {  useLocation } from "react-router-dom";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import ActiveLastBreadcrumb from "../ActiveLastBreadcrumb";
import { GridColDef, GridRowParams } from "@mui/x-data-grid";
import StyledDataGrid from "../../styles/styledDataGrid";
import { Modal as BaseModal } from "@mui/base/Modal";
import QrCodeIcon from '@mui/icons-material/QrCode';
import CollectionsIcon from '@mui/icons-material/Collections';
import { GetConstantByGrpAPI } from "@api/axios/inspectionItemAPI";

export default function InspectionDataDetail() {
  const authRequest = {
    ...loginRequest,
  };
  const location = useLocation();
  const { data } = location.state || {};

  const [openBackDrop, setOpenBackDrop] = React.useState(true);
  const [dataDetail, setDataDetail] = React.useState<InspectionDataItem[]>([]);
//   const createdOn = data.createdOn;
//   const createdBy = data.createdBy;
  const idNo = data.id_no;
//   const inspectId = data.inspectId;
  const pinCode = data.pinCode;
  const stationName = data.stationName;
//   const inspectionGroupId = data.inspectionGroupId;
  const inspectionGroupName = data.inspectionGroupName;
  const lineName = data.lineName;
  const modelGroupName = data.modelGroupName;
  const modelName = data.modelName;
//   const scheduledLineCode = data.scheduledLineCode;
  const scheduledLineName = data.scheduledLineName;
//   const [paginationValue, setPaginationValue] = React.useState<PaginationModel>(
//     {
//       pageCount: 10,
//       pageNo: 1,
//       pageSize: 10,
//       totalRecords: 100,
//     }
//   );
  const [openQR, setOpenQR] = React.useState(false);
  const handleOpenQR = () => setOpenQR(true);
  const handleCloseQR = () => setOpenQR(false);

  const [openPicture, setOpenPicture] = React.useState(false);
  const handleOpenPicture = () => setOpenPicture(true);
  const handleClosePicture= () => setOpenPicture(false);

  const [qrCodeMaster, setQRCodeMaster] = React.useState<DDLModel[]>([]);
  const [qrCodeList, setQRCodeList] = React.useState<DDLModel[]>([]);
  
  function GetQRCode(insItemId: number) {
    setQRCodeMaster([]);
    setQRCodeList([]);
    const filteredData = dataDetail.find(
      (item) => item.inspectItemId === insItemId
    );

    if (filteredData != null) {
      const dataListQRMaster: DDLModel[] =
        filteredData.inspectionQRCodeMasterList.map((items: any) => ({
          label: `${items.value}`,
          value: `${items.value}`,
        }));
      const dataListQRList: DDLModel[] = filteredData.inspectQRCodeList.map(
        (items: any) => ({
          label: `${items.value}`,
          value: `${items.value}`,
        })
      );
      if (filteredData.isPinCode) {
        dataListQRMaster.push({
          label: `${pinCode} (Pin Code)`,
          value: pinCode,
        });
      }
      setQRCodeMaster(dataListQRMaster);
      setQRCodeList(dataListQRList);
    } else {
      setQRCodeMaster([]);
      setQRCodeList([]);
    }
  }
  const [pictureList, setPictureList] = React.useState<PictureModel[]>([]);
  
  function GetPicture(insItemId: number) {
    const filteredData = dataDetail.find(
      (item) => item.inspectItemId === insItemId
    );
    if (filteredData != null) {
        const pictureListQRMaster: PictureModel[] =
        filteredData.inspectionPictureList.map((items: any) => ({
          fileName: items.fileName,
          inspectionItemId : items.inspectionItemId,
          url : items.url
        }));
        setPictureList(pictureListQRMaster)
    }else{
        setPictureList([])
    }
  }

  const [typeNameList, setTypeNameList] = React.useState<DDLModel[]>([]);
  async function GetTypeName() {
    await GetConstantByGrpAPI("DD_INSGRP").then((rs)=>{
        if (rs.status == "success") {
            const typeDDLModel: DDLModel[] = rs.data.map((item: any) => ({
              label: item.text,
              value: item.code,
            }));
            setTypeNameList(typeDDLModel);
        }
    })
  }

  async function GetInspectionDataDetail() {
    await GetInspectionDataDetailAPI(data.inspectId).then((rs) => {
      if (rs.status === "success") {
       
        const inspectionData: InspectionDataItem[] = rs.data.inspectItemList.map(
          (item: any) => ({
            sequence: item.sequence,
            topic: item.topic,
            type: typeNameList.find((it)=> it.value ===  item.type.toString())?.label ?? "",
            min: item.min,
            max: item.max,
            target: item.target,
            unit: item.unit,
            judgement: item.judgement,
            inspectValue: item.inspectValue,
            inspectionText: item.inspectionText,
            comment: item.comment,
            isPinCode : item.isPinCode,
            inspectItemId: item.inspectItemId,
            inspectionItemId: item.inspectionItemId,
            inspectionQRCodeMasterList: item.inspectionQRCodeMasterList,
            inspectQRCodeList: item.inspectQRCodeList,
            inspectionPictureList: item.inspectionPictureList,
          })
        );
        setDataDetail(inspectionData);
        setOpenBackDrop(false);
      } else {
        setOpenBackDrop(false);
      }
    });
  }

  const QRDetailList = (
    title: React.ReactNode,
    items: readonly DDLModel[]
  ) => (
    <Card>
      <StyledCardHeader title={title}   sx={{ px: 2, py: 1 }} />
      <Divider />
      <List
        sx={{
          width: "100%",
          maxHeight: "70vh",
          height: "30vh",
          bgcolor: "background.paper",
          overflow: "auto",
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
              sx={{ py: 0 }}
            >
              <ListItemText id={labelId} primary={`${value.label}`} />
            </ListItemButton>
          );
        })}
      </List>
    </Card>
  );

  const QRDetailDifList = (
    title: React.ReactNode,
    itemsMaster: readonly DDLModel[],
    items: readonly DDLModel[]
  ) => {
    const sortedItems = [...items].sort((a, b) => {
      const aMatched = itemsMaster.some((masterItem) => masterItem.value === a.value);
      const bMatched = itemsMaster.some((masterItem) => masterItem.value === b.value);
      return aMatched === bMatched ? 0 : aMatched ? -1 : 1;
    });
  
    return (
      <Card>
        <StyledCardHeader title={title} sx={{ px: 2, py: 1 }} />
        <Divider />
        <List
          sx={{
            width: "100%",
            maxHeight: "70vh",
            height: "30vh",
            bgcolor: "background.paper",
            overflow: "auto",
          }}
          dense
          component="div"
          role="list"
        >
          {sortedItems.map((value: DDLModel) => {
            const labelId = `transfer-list-all-item-${value.value}-label`;
            const isMatched = itemsMaster.some(
              (masterItem) => masterItem.value === value.value
            );
  
            return (
              <ListItemButton
                key={`cus_${value.value}`}
                role="listitem"
                sx={{
                  py: 0,
                  backgroundColor: isMatched ? "lightgreen" : "lightcoral",
                }}
              >
                <ListItemText id={labelId} primary={value.label} />
              </ListItemButton>
            );
          })}
        </List>
      </Card>
    );
  };
  
  

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
        
          {row.inspectionQRCodeMasterList.length > 0 && (
            <Button
              sx={{ minWidth: 0, padding: "4px" }}
              onClick={() => {
                handleOpenQR();
                GetQRCode(row.inspectItemId);
              }}
            >
              <QrCodeIcon fontSize="small" />
            </Button>
          )}
          
          {row.inspectionPictureList.length > 0 && (
            <Button sx={{ minWidth: 0, padding: "4px" }}
            onClick={() => {
                handleOpenPicture();
                GetPicture(row.inspectItemId)
              }}>
              <CollectionsIcon fontSize="small" />
            </Button>
          )}
        </>
      ),
    },
    {
      field: "sequence",
      headerName: "Sequence",
      minWidth: 80,
      flex: 1,
      headerAlign: "center",
    },
    {
      field: "topic",
      headerName: "Topic",
      minWidth: 500,
      flex: 1,
      headerAlign: "center",
      align: "left",
    },
    {
      field: "type",
      headerName: "Type",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "min",
      headerName: "min",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "max",
      headerName: "max",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "target",
      headerName: "target",
      minWidth: 100,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "unit",
      headerName: "Unit",
      minWidth: 120,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "judgement",
      headerName: "judgement",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inspectValue",
      headerName: "inspectValue",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "inspectionText",
      headerName: "inspectionText",
      minWidth: 150,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
    {
      field: "comment",
      headerName: "comment",
      minWidth: 250,
      flex: 1,
      headerAlign: "center",
      align: "center",
    },
  ];

  React.useEffect(() => {
    const FetchData = async () => {
      await GetTypeName();
    };
    FetchData();
  }, []);


  React.useEffect(() => {
    const FetchDataDetail = async () => {
      if (typeNameList.length > 0) {
        await GetInspectionDataDetail();
      }
    };
    FetchDataDetail();
  }, [typeNameList]);
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
                prm1="Inspection Data"
                prm2="inspection DataDetail"
                prm3=""
              />
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
          <Grid item xs={12} md={12}>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: "rgba(0, 0, 0, .03)",
                  flexDirection: "row-reverse",
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Typography sx={{ flexShrink: 0 }}>Inspection Data</Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  borderTop: "1px solid rgba(0, 0, 0, .125)",
                }}
              >
                <Grid container>
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Scheduled Line :
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {scheduledLineName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Line:
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {lineName}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Station :
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {stationName}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Model Group:
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {modelGroupName}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Model :
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {modelName}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Inspection Group :
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {inspectionGroupName}
                      </Typography>
                    </Box>
                  </Grid>

                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        ID No. :
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {idNo}
                      </Typography>
                    </Box>
                  </Grid>
                  <Grid item xs={12} md={4}>
                    <Box display="flex" alignItems="center" mb={2}>
                      <Typography variant="subtitle1" color="textSecondary">
                        Pin Code :
                      </Typography>
                      <Typography variant="body1" ml={1}>
                        {pinCode}
                      </Typography>
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
            <Accordion defaultExpanded>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon />}
                aria-controls="panel1-content"
                id="panel1-header"
                sx={{
                  backgroundColor: "rgba(0, 0, 0, .03)",
                  flexDirection: "row-reverse",
                  "& .MuiAccordionSummary-expandIconWrapper.Mui-expanded": {
                    transform: "rotate(90deg)",
                  },
                }}
              >
                <Typography sx={{ flexShrink: 0 }}>
                  Inspection Detail
                </Typography>
              </AccordionSummary>
              <AccordionDetails
                sx={{
                  borderTop: "1px solid rgba(0, 0, 0, .125)",
                }}
              >
                <Grid container>
                  <Grid item xs={12} md={12}>
                    <Box sx={{ height: "100%", width: "100%" }}>
                      <StyledDataGrid
                        rowHeight={40}
                        rows={dataDetail}
                        columns={columns}
                        getRowClassName={(params) =>
                          params.row.judgement === 'NG' ? 'NG' : ''
                        }
                        getRowId={(row) => row.inspectItemId}
                        initialState={{
                          pagination: {
                            paginationModel: { page: 0, pageSize: 10 },
                          },
                        }}
                        pageSizeOptions={[5, 10]}
                      />
                    </Box>
                  </Grid>
                </Grid>
              </AccordionDetails>
            </Accordion>
          </Grid>
        </Grid>

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openQR}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <h2 id="unstyled-modal-title" className="modal-title">
                QR Code
              </h2>
            </Box>
            <Grid container spacing={2}>
              <Grid item md={6} xs={6}>
                {QRDetailList("QR Master", qrCodeMaster)}
              </Grid>
              <Grid item md={6} xs={6}>
                {QRDetailDifList("QR Upload", qrCodeMaster ,qrCodeList)}
              </Grid>
              <Grid item xs={12} md={12} container justifyContent="flex-start">
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={handleCloseQR}
                    size="small"
                  >
                    Close
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </ModalContent>
        </Modal>

        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={openPicture}
          disableBackdropClick
          disableEscapeKeyDown
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent>
            <Box sx={{ borderBottom: 1, borderColor: "divider" }}>
              <h2 id="unstyled-modal-title" className="modal-title">
                Picture
              </h2>
            </Box>
            <Grid container spacing={2}>
              <Grid item xs={12} md={12}>
                <ImageList
                  sx={{ width: 500, height: 450 }}
                  cols={3}
                  rowHeight={164}
                >
                  {pictureList.map((item : PictureModel) => (
                    <ImageListItem key={item.inspectionItemId}>
                      <img
                        srcSet={`${item.url}?w=164&h=164&fit=crop&auto=format&dpr=2 2x`}
                        src={`${item.url}?w=164&h=164&fit=crop&auto=format`}
                        loading="lazy"
                      />
                    </ImageListItem>
                  ))}
                </ImageList>
              </Grid>
              <Grid item xs={12} md={12} container justifyContent="flex-start">
                <Box display="flex" gap={2}>
                  <Button
                    variant="outlined"
                    onClick={handleClosePicture}
                    size="small"
                  >
                    Close
                  </Button>
                </Box>
              </Grid>
            </Grid>
          </ModalContent>
        </Modal>
      </MsalAuthenticationTemplate>
    </>
  );
}

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
  width: "80vw",
  maxWidth: "100vw",
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
