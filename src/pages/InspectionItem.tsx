import InspectionItemData from "../ui-components/MasterData/InspectionItemData";
import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import { InteractionType } from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";
import * as React from "react";
import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Autocomplete,
  Backdrop,
  Box,
  Button,
  FormControlLabel,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Switch,
  Typography,
} from "@mui/material";
import { styled, css } from "@mui/system";
import { Modal as BaseModal } from "@mui/base/Modal";
import { grey } from "@mui/material/colors";
import TextField from "@mui/material/TextField";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import { useState } from "react";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import instanceAxios from "../api/axios/instanceAxios";
import _ from "lodash";
import { useLocation } from "react-router-dom";
import toastAlert from "../ui-components/SweetAlert2/toastAlert";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";

interface DDLModel {
  lable: string;
  value: string;
}

interface qrItemModel {
  value: string;
  text: string;
  cell: string;
  status: string;
  message: string;
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
        console.log("Err");
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

async function CreateInsItemAPI(body: any) {
  try {
    await instanceAxios
      .post(`/InspectionItem/CreateInspectionItem`, body)
      .then(async function (response: any) {
        toastAlert(`${response.data.status}`, `${response.data.message}`, 5000);
      })
      .catch(function (error: any) {
        toastAlert(`error`, `Admin`, 5000);
      });
  } catch (error) {
    toastAlert(`error`, `Admin`, 5000);
  }
}

export function InspectionItem() {
  const authRequest = {
    ...loginRequest,
  };
  const location = useLocation();
  const { data } = location.state || {};
console.log(data)
  const [open, setOpen] = React.useState(false);
  const handleOpen = () => setOpen(true);
  const handleClose = () => setOpen(false);

  const [lableModel, setLableModel] = React.useState<string>("");
  const [insGroupId, setInsGroupId] = React.useState(data.id);
  const [insType, setInsType] = React.useState<string>("1");
  const [insItemMin, setInsItemMin] = React.useState<string>("");
  const [insItemMax, setInsItemMax] = React.useState<string>("");
  const [insItemTarget, setInsItemTarget] = React.useState<string>("");
  const [insItemUnit, setInsItemUnit] = React.useState<string | null>(null);
  const [insItemRemark, setInsItemRemark] = React.useState<string>("");
  const [insItemSeq, setSelectInsItemSeq] = React.useState<number>(0);
  const [insItemTopic, setInsItemTopic] = React.useState<string>("");
  const [insItemReq, setInsItemReq] = React.useState<boolean>(false);
  const [insItemPin, setInsItemPin] = React.useState<boolean>(true);
  const [typeDDL, setTypeDDL] = React.useState<DDLModel[]>([]);
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
  const [showMeasurement, setShowMeasurement] = useState(false);
  const [showQRCodeList, setShowQRCodeList] = useState(false);
  const [showRecord, setShowRecord] = useState(false);

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
          inspectionGroupId: insGroupId,
          sequence: insItemSeq,
          type: insType,
          remark: insItemRemark,
        };
        break;
      case "2":
        body = {
          topic: insItemTopic,
          inspectionGroupId: insGroupId,
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
          inspectionGroupId: insGroupId,
          sequence: insItemSeq,
          type: insType,
          isRequired: insItemReq,
          remark: insItemRemark,
        };
        break;
      case "4":
        body = {
          topic: insItemTopic,
          inspectionGroupId: insGroupId,
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

    await CreateInsItemAPI(body);
  }

  React.useEffect(() => {
    const FetchMenu = async () => {
      GetConstantByGrpAPI("DD_INSGRP").then(async (x) => {
        if (x.status == "success") {
          const typeDDLModel: DDLModel[] = x.data.map((item: any) => ({
            lable: item.text,
            value: item.code,
          }));
          setTypeDDL(typeDDLModel);
        }
      });
    };
    FetchMenu();
  }, []);

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
                prm2="inspectiongroups"
                prm3="inspectionitem"
              />
            </Box>
          </Grid>
          <Grid item xs={6} md={4} container justifyContent="flex-end">
            <Box>
              <Button variant="outlined" onClick={handleOpen}>
                Copy
              </Button>
            </Box>
            <Box>
              <Button
                variant="outlined"
                onClick={() => {
                  setLableModel("Create Inspection Item");
                  handleOpen();
                }}
              >
                Add
              </Button>
            </Box>
          </Grid>
        </Grid>
        <Grid container spacing={2}>
        <Grid item xs={12}>
      <Accordion>
        <AccordionSummary
          expandIcon={<ExpandMoreIcon />}
          aria-controls="panel1-content"
          id="panel1-header"
        >
          <Typography sx={{ flexShrink: 0 }}>
            InspectionGroup
          </Typography>
          <Typography sx={{ color: 'text.secondary', marginLeft: 'auto' }}>
            Version: {data.version}
          </Typography>
        </AccordionSummary>
        <AccordionDetails>
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                id="inspection-group-name"
                label="InspectionGroup Name"
                variant="outlined"
                size="small"
                fullWidth
                defaultValue={data.inspectionGroupName}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                id="scheduled-line"
                options={top100Films}
                defaultValue={`${data.scheduledLineCode} : ${data.scheduledLineName}`}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Scheduled Line" variant="outlined" size="small" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                id="line"
                options={top100Films}
                defaultValue={data.lineName}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Line" variant="outlined" size="small" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                id="station"
                options={top100Films}
                defaultValue={data.stationName}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Station" variant="outlined" size="small" />
                )}
              />
            </Grid>
            <Grid item xs={12} md={6}>
              <Autocomplete
                disablePortal
                id="model-group"
                options={top100Films}
                defaultValue={data.modelGroupName}
                fullWidth
                renderInput={(params) => (
                  <TextField {...params} label="Model Group" variant="outlined" size="small" />
                )}
              />
              
            </Grid>
            <Grid item xs={12} md={6}>
            <TextField
                id="inspection-group-name"
                label="Time"
                variant="outlined"
                size="small"
                fullWidth
                defaultValue={data.taktTime}
              />
              
            </Grid>
            
          </Grid>
        </AccordionDetails>
      </Accordion>
    </Grid>
          <Grid item xs={12} md={12}>
            <InspectionItemData dataGroupId={insGroupId} InsType={typeDDL} />
          </Grid>
        </Grid>
        <Modal
          aria-labelledby="unstyled-modal-title"
          aria-describedby="unstyled-modal-description"
          open={open}
          onClose={handleClose}
          slots={{ backdrop: StyledBackdrop }}
        >
          <ModalContent sx={{ width: 400 }}>
            <h2 id="unstyled-modal-title" className="modal-title">
              {lableModel}
            </h2>
            <Grid container spacing={2}>
              <Grid item xs={6} md={12}>
                <TextField
                  label="Sequence"
                  id="outlined-size-small"
                  defaultValue=""
                  size="small"
                  style={{ width: 400 }}
                  onChange={(e) => {
                    setSelectInsItemSeq(e.target.value);
                  }}
                />
              </Grid>
              <Grid item xs={6} md={12}>
                <TextField
                  label="Topic"
                  id="outlined-size-small"
                  defaultValue=""
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
                  defaultValue=""
                  size="small"
                  style={{ width: 400 }}
                  onChange={(e) => {
                    setInsItemRemark(e.target.value);
                  }}
                />
              </Grid>

              <Grid item xs={6} md={12}>
                <InputLabel id="demo-simple-select-label">
                  Inspection Type
                </InputLabel>
                <Select
                  labelId="demo-simple-select-label"
                  id="demo-simple-select"
                  value={insType}
                  label="InspectionType"
                  onChange={handleChangeInspectionType}
                  size="small"
                  style={{ width: 400 }}
                >
                  {_.map(typeDDL, function (i: DDLModel) {
                    return (
                      <MenuItem key={i.value} value={i.value}>
                        {i.lable}
                      </MenuItem>
                    );
                  })}
                </Select>
              </Grid>
              {showMeasurement && (
                <Grid item xs={6} md={4}>
                  <TextField
                    label="Min"
                    id="outlined-size-small"
                    defaultValue=""
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
                    defaultValue=""
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
                    defaultValue=""
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
                    defaultValue=""
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
                    control={<Switch defaultChecked />}
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
                    onClick={() => {
                      CreateInsItem();
                      setOpen(false);
                    }}
                  >
                    Create
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

const columns: GridColDef[] = [
  {
    field: "qrcode",
    headerName: "QRCode",
    width: 200,
    headerAlign: "center",
  },
];

const rows = [
  { id: 1, qrcode: "TC430-49543" },
  { id: 2, qrcode: "TC832-49462" },
  { id: 3, qrcode: "3C319-98291" },
  { id: 4, qrcode: "TC402-98413" },
];

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


const top100Films = [
  { label: 'The Shawshank Redemption', year: 1994 },
  { label: 'The Godfather', year: 1972 },
  { label: 'The Godfather: Part II', year: 1974 },
  { label: 'The Dark Knight', year: 2008 },
  { label: '12 Angry Men', year: 1957 },
  { label: "Schindler's List", year: 1993 },
  { label: 'Pulp Fiction', year: 1994 },
  {
    label: 'The Lord of the Rings: The Return of the King',
    year: 2003,
  },
  { label: 'The Good, the Bad and the Ugly', year: 1966 },
  { label: 'Fight Club', year: 1999 },
  {
    label: 'The Lord of the Rings: The Fellowship of the Ring',
    year: 2001,
  },
  {
    label: 'Star Wars: Episode V - The Empire Strikes Back',
    year: 1980,
  },
  { label: 'Forrest Gump', year: 1994 },
  { label: 'Inception', year: 2010 },
  {
    label: 'The Lord of the Rings: The Two Towers',
    year: 2002,
  },
  { label: "One Flew Over the Cuckoo's Nest", year: 1975 },
  { label: 'Goodfellas', year: 1990 },
  { label: 'The Matrix', year: 1999 },
  { label: 'Seven Samurai', year: 1954 },
  {
    label: 'Star Wars: Episode IV - A New Hope',
    year: 1977,
  },
  { label: 'City of God', year: 2002 },
  { label: 'Se7en', year: 1995 },
  { label: 'The Silence of the Lambs', year: 1991 },
  { label: "It's a Wonderful Life", year: 1946 },
  { label: 'Life Is Beautiful', year: 1997 },
  { label: 'The Usual Suspects', year: 1995 },
  { label: 'Léon: The Professional', year: 1994 },
  { label: 'Spirited Away', year: 2001 },
  { label: 'Saving Private Ryan', year: 1998 },
  { label: 'Once Upon a Time in the West', year: 1968 },
  { label: 'American History X', year: 1998 },
  { label: 'Interstellar', year: 2014 },
  { label: 'Casablanca', year: 1942 },
  { label: 'City Lights', year: 1931 },
  { label: 'Psycho', year: 1960 },
  { label: 'The Green Mile', year: 1999 },
  { label: 'The Intouchables', year: 2011 },
  { label: 'Modern Times', year: 1936 },
  { label: 'Raiders of the Lost Ark', year: 1981 },
  { label: 'Rear Window', year: 1954 },
  { label: 'The Pianist', year: 2002 },
  { label: 'The Departed', year: 2006 },
  { label: 'Terminator 2: Judgment Day', year: 1991 },
  { label: 'Back to the Future', year: 1985 },
  { label: 'Whiplash', year: 2014 },
  { label: 'Gladiator', year: 2000 },
  { label: 'Memento', year: 2000 },
  { label: 'The Prestige', year: 2006 },
  { label: 'The Lion King', year: 1994 },
  { label: 'Apocalypse Now', year: 1979 },
  { label: 'Alien', year: 1979 },
  { label: 'Sunset Boulevard', year: 1950 },
  {
    label: 'Dr. Strangelove or: How I Learned to Stop Worrying and Love the Bomb',
    year: 1964,
  },
  { label: 'The Great Dictator', year: 1940 },
  { label: 'Cinema Paradiso', year: 1988 },
  { label: 'The Lives of Others', year: 2006 },
  { label: 'Grave of the Fireflies', year: 1988 },
  { label: 'Paths of Glory', year: 1957 },
  { label: 'Django Unchained', year: 2012 },
  { label: 'The Shining', year: 1980 },
  { label: 'WALL·E', year: 2008 },
  { label: 'American Beauty', year: 1999 },
  { label: 'The Dark Knight Rises', year: 2012 },
  { label: 'Princess Mononoke', year: 1997 },
  { label: 'Aliens', year: 1986 },
  { label: 'Oldboy', year: 2003 },
  { label: 'Once Upon a Time in America', year: 1984 },
  { label: 'Witness for the Prosecution', year: 1957 },
  { label: 'Das Boot', year: 1981 },
  { label: 'Citizen Kane', year: 1941 },
  { label: 'North by Northwest', year: 1959 },
  { label: 'Vertigo', year: 1958 },
  {
    label: 'Star Wars: Episode VI - Return of the Jedi',
    year: 1983,
  },
  { label: 'Reservoir Dogs', year: 1992 },
  { label: 'Braveheart', year: 1995 },
  { label: 'M', year: 1931 },
  { label: 'Requiem for a Dream', year: 2000 },
  { label: 'Amélie', year: 2001 },
  { label: 'A Clockwork Orange', year: 1971 },
  { label: 'Like Stars on Earth', year: 2007 },
  { label: 'Taxi Driver', year: 1976 },
  { label: 'Lawrence of Arabia', year: 1962 },
  { label: 'Double Indemnity', year: 1944 },
  {
    label: 'Eternal Sunshine of the Spotless Mind',
    year: 2004,
  },
  { label: 'Amadeus', year: 1984 },
  { label: 'To Kill a Mockingbird', year: 1962 },
  { label: 'Toy Story 3', year: 2010 },
  { label: 'Logan', year: 2017 },
  { label: 'Full Metal Jacket', year: 1987 },
  { label: 'Dangal', year: 2016 },
  { label: 'The Sting', year: 1973 },
  { label: '2001: A Space Odyssey', year: 1968 },
  { label: "Singin' in the Rain", year: 1952 },
  { label: 'Toy Story', year: 1995 },
  { label: 'Bicycle Thieves', year: 1948 },
  { label: 'The Kid', year: 1921 },
  { label: 'Inglourious Basterds', year: 2009 },
  { label: 'Snatch', year: 2000 },
  { label: '3 Idiots', year: 2009 },
  { label: 'Monty Python and the Holy Grail', year: 1975 },
];
