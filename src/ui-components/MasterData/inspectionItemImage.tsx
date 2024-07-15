import React from 'react';
import { useDropzone } from 'react-dropzone';
import { Box, Typography, Grid, IconButton } from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';
import DeleteIcon from '@mui/icons-material/Delete';
import toastAlert from '../SweetAlert2/toastAlert';
import { CreateImageInsItemAPI, DeleteImageInsItemAPI, GetConstantAPI, GetImageInsItemAPI } from '@api/axios/inspectionItemImageAPI';

const DropzoneArea = ({
  sequence,
  inspectionItemId,
}: {
  sequence: number;
  inspectionItemId: number;

}) => {
  const [files, setFiles] = React.useState<InsItemImageModel[]>([]);
  const [maxImage, setMaxImage] = React.useState<number>(0);


  React.useEffect(() => {
    const FetchMenu = async () => {
      await GetConstantAPI().then(async (rs) => {
        if (rs.status === "success") {
          setMaxImage(Number(rs.data.find((item: any) => item.code === "MAX")?.text ?? "0"));
        }
      });
      await GetImageInsItemAPI(inspectionItemId).then((rs) => {
        if (rs.status === "success") {
          const ddlModel: InsItemImageModel[] = rs.data.map(
            (item: InsItemImageModel) => ({
              inspectionItemId: item.inspectionItemId,
              inspectionItemPictureId: item.inspectionItemPictureId,
              sequence: item.sequence,
              url: item.url,
              fileName: item.fileName,
            })
          );
          setFiles(ddlModel);
        }
      });
    };
  
    FetchMenu();
 
  }, [inspectionItemId]);

  const onDrop = React.useCallback(async (acceptedFiles: any) => {
    const filteredFiles = acceptedFiles.filter((file: File) => {
      const isValidSize = file.size <= 2 * 1024 * 1024; // 2MB
      const isValidType = /image\/(png|jpe?g)/.test(file.type);
      return isValidSize && isValidType;
    });

    if (files.length + filteredFiles.length > maxImage) {
      toastAlert("error", `You can only upload up to ${maxImage} images.`, 5000);
      return;
    }

    if (filteredFiles.length === 0) {
      toastAlert("error", "Only .png, .jpg, and .jpeg files under 2MB are allowed.", 5000);
      return;
    }

    const formData = new FormData();
    filteredFiles.forEach((file: string | Blob) => {
      formData.append("file", file);
    });
    formData.append("sequence", sequence.toString());
    formData.append("inspectionItemId", inspectionItemId.toString());

    await CreateImageInsItemAPI(formData).then((rs) => {
      toastAlert(rs.status, rs.message, 5000);
      if (rs.status === "success") {
        setFiles((prevFiles) => [
          ...prevFiles,
          ...filteredFiles.map(() => ({
            inspectionItemId: rs.data.inspectionItemId,
            inspectionItemPictureId: rs.data.inspectionItemPictureId,
            sequence: rs.data.sequence,
            url: rs.data.url,
            fileName: rs.data.fileName,
          })),
        ]);
      }
    });
  }, [files, maxImage, sequence, inspectionItemId]);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({ onDrop });

  const handleDelete = async (insPictureId: number) => {
    await DeleteImageInsItemAPI(insPictureId).then((rs) => {
      toastAlert(rs.status, rs.message, 5000);
      if (rs.status === "success") {
        setFiles(files.filter((f) => f.inspectionItemPictureId !== insPictureId));
      }
    });
  };



  return (
    <Box>
      {files.length < maxImage && (
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
          }}
        >
          <input {...getInputProps()} />
          <CloudUploadIcon sx={{ fontSize: 40, color: "#1976d2" }} />
          <Typography variant="body1" color="textSecondary">
            {isDragActive
              ? "Drop the image files here ..."
              : "Drag & drop image files .png, .jpg here, or click to select files"}
          </Typography>
        </Box>
      )}
      <Grid container spacing={2}>
        {files.map((file: InsItemImageModel) => (
          <Grid
            item
            key={file.inspectionItemPictureId}
            xs={12}
            sm={6}
            md={4}
            lg={3}
          >
            <Box sx={{ position: "relative", textAlign: "center" }}>
              <a href={file.url} target="_blank" rel="noopener noreferrer">
                <img
                  src={file.url}
                  alt={file.fileName}
                  style={{ width: "100%", borderRadius: 8 }}
                />
              </a>
              <IconButton
                sx={{ position: "absolute", top: 8, right: 8 }}
                onClick={() => handleDelete(file.inspectionItemPictureId)}
              >
                <DeleteIcon
                  sx={{
                    color: "white",
                    backgroundColor: "rgba(0, 0, 0, 0.5)",
                    borderRadius: "50%",
                  }}
                />
              </IconButton>
              <Typography variant="body2" color="textSecondary">
                {file.fileName}
              </Typography>
            </Box>
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};

export default DropzoneArea;



