import React from "react";
import { useDropzone } from "react-dropzone";
import {
  Box,
  Typography,
  Grid,
  Backdrop,
  Button,
} from "@mui/material";
import CloudUploadIcon from "@mui/icons-material/CloudUpload";
import { Modal as BaseModal } from "@mui/base/Modal";
import { styled, css } from "@mui/system";
import { grey } from "@mui/material/colors";
import { GridColDef, GridRowClassNameParams } from "@mui/x-data-grid";
import instanceAxios from "@api/axios/instanceAxios";
import { StyledDataGriImport } from "../../styles/styledDataGrid";

interface InspectionItemImportModel {
  id: number;
  SeqItem: number;
  InspectionItem: string;
  InspectionType: string;
  Min: string | null;
  Max: string | null;
  Target: string | null;
  Unit: string | null;
  IsRequired: string | null;
  CheckPinCode: string | null;
  Remark: string | null;
  Msg: string;
}

export default function ImportData(props: {
  inspectionGroupId: number;
  openImportModal: boolean;
  activeIns: boolean;
  onClose: () => void;
}) {
  const { openImportModal, inspectionGroupId, activeIns, onClose } = props;
  const [openModalCreateLine, setOpenModalCreateLine] =
    React.useState<boolean>(openImportModal);

  React.useEffect(() => {
    setOpenModalCreateLine(openImportModal);
  }, [openImportModal]);

  const handleClose = () => {
    setOpenModalCreateLine(false);
    onClose(); // Call the onClose function passed as a prop
  };

  return (
    <Modal
      aria-labelledby="unstyled-modal-title"
      aria-describedby="unstyled-modal-description"
      open={openModalCreateLine}
      slots={{ backdrop: StyledBackdrop }}
      onClose={handleClose}
      disableBackdropClick
      disableEscapeKeyDown
    >
      <ModalContent>
        <h2 id="unstyled-modal-title" className="modal-title">
          Import Inspection Item
        </h2>
        <Box>
          <Grid container spacing={2}>
            <Grid item xs={12}>
              <DropzoneAreaInsItem inspectionGroupId={inspectionGroupId} activeIns={activeIns} />
            </Grid>
            <Grid item xs={12} md={12} container justifyContent="flex-start">
              <Box display="flex" gap={2}>
                <Button variant="outlined" onClick={handleClose}>
                  Close
                </Button>
              </Box>
            </Grid>
          </Grid>
        </Box>
      </ModalContent>
    </Modal>
  );
}

const columns: GridColDef[] = [
  {
    field: "SeqItem",
    headerName: "Sequence Item",
    minWidth: 100,
    flex: 0.5,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "InspectionItem",
    headerName: "Inspection Item",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
  },
  {
    field: "InspectionType",
    headerName: "Inspection Type",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Min",
    headerName: "Min",
    minWidth: 100,
    flex: 0.5,
    headerAlign: "center",
  },
  {
    field: "Max",
    headerName: "Max",
    minWidth: 100,
    flex: 0.5,
    headerAlign: "center",
  },
  {
    field: "Target",
    headerName: "Target",
    minWidth: 100,
    flex: 0.5,
    headerAlign: "center",
  },
  {
    field: "Unit",
    headerName: "Unit",
    minWidth: 100,
    flex: 0.5,
    headerAlign: "center",
  },
  {
    field: "IsRequired",
    headerName: "Required",
    minWidth: 120,
    flex: 0.5,
    headerAlign: "center",
  },
  {
    field: "CheckPinCode",
    headerName: "Pin Code",
    minWidth: 120,
    flex: 0.5,
    headerAlign: "center",
  },
  {
    field: "Remark",
    headerName: "Remark",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
  },
  {
    field: "Msg",
    headerName: "Message",
    minWidth: 150,
    flex: 1,
    headerAlign: "center",
  },
];

const DropzoneAreaInsItem = ({
  inspectionGroupId,
  activeIns
}: {
  inspectionGroupId: number;
  activeIns : boolean
}) => {
  const [itemImportList, setItemImportList] = React.useState<
    InspectionItemImportModel[]
  >([]);

  const onDrop = React.useCallback(async (acceptedFiles: File[]) => {
    const filteredFiles = acceptedFiles.filter((file: File) =>
      /\.(xlsx)$/.test(file.name)
    );

    for (const file of filteredFiles) {
      try {
        const formData = new FormData();
        formData.append("file", file);

        // Upload file to API
        await instanceAxios
          .post(
            `/InspectionItem/ImportInspectionItem?inspectionGroupId=${inspectionGroupId}`,
            formData,
            {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            }
          )
          .then((response) => {
            console.log(response);
            setItemImportList([])
            // Process API response
            //   const jsonData = response.data;
            //   const mappedData = jsonData.map((row: any) => ({
            //     id: row["Seq Item"],
            //     SeqItem: row["Seq Item"],
            //     InspectionItem: row["Inspection Item"],
            //     InspectionType: row["Inspection Type"],
            //     Min: row["Min"] || null,
            //     Max: row["Max"] || null,
            //     Target: row["Target"] || null,
            //     Unit: row["Unit"] || null,
            //     IsRequired: row["IsRequired"] || null,
            //     CheckPinCode: row["Check Pin Code"] || null,
            //     Remark: row["Remark"] || null,
            //     Msg: row["Msg"] || "",
            //   })) as InspectionItemImportModel[];

            //   setItemImportList(mappedData);
          });
      } catch (error) {
        console.error("Error uploading file:", error);
      }
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "application/vnd.ms-excel": [".xls"],
      "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet": [
        ".xlsx",
      ],
    },
  });

  const getRowClassName = (params: GridRowClassNameParams) => {
    // Customize row class based on data
    if (params.row.Msg === "error") {
      return "error-row";
    }
    return "";
  };

  return (
    <Box>
      <Box
        {...getRootProps()}
        sx={{
          border: "2px dashed #1976d2",
          borderRadius: 2,
          padding: 3,
          textAlign: "center",
          backgroundColor: isDragActive ? "#e3f2fd" : "transparent",
          transition: "background-color 0.3s",
          cursor: "pointer",
          marginBottom: 2,
          pointerEvents: activeIns ? 'none' : 'auto', // Disable pointer events if disabled
          opacity: activeIns ? 0.5 : 1, // Reduce opacity if disabled
        }}
      >
        <input {...getInputProps()}  />
        <CloudUploadIcon sx={{ fontSize: 40, color: "#1976d2" }} />
        <Typography variant="body1" color="textSecondary">
          {isDragActive
            ? "Drop the Excel files here ..."
            : "Drag & drop Excel files (.xlsx) here, or click to select files"}
        </Typography>
      </Box>
      {itemImportList.length > 0 && (
        <>
          <Typography variant="h6"> Data:</Typography>
          <StyledDataGriImport
            rows={itemImportList}
            columns={columns}
            getRowClassName={getRowClassName}
            initialState={{
              pagination: {
                paginationModel: {
                  pageSize: 5,
                },
              },
            }}
            autoHeight
          />
        </>
      )}
    </Box>
  );
};

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
    font-weight: 400;
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
    max-width: 90vw; // Adjust the maximum width as needed
    max-height: 80vh; // Adjust the maximum height as needed
    overflow: auto; // Allows scrolling if content overflows

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
