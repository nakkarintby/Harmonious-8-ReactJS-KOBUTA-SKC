// import * as React from "react";
import { GridRowParams } from "@mui/x-data-grid";
import Button from "@mui/material/Button";
import DeleteIcon from "@mui/icons-material/Delete";
import EditIcon from "@mui/icons-material/Edit";
import { DataGrid, GridColDef } from "@mui/x-data-grid";
import Box from "@mui/material/Box";
import { Link } from "react-router-dom";
const InspectionItemData = () => {
  return (
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
        rows={rows}
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
  );
};

export default InspectionItemData;

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
        <Link
          to={{
            pathname: "/masterData/inspectiongroups/inspectionitem",
            state: [{ data: row }],
          }}
        >
          <Button>
            <EditIcon />
          </Button>
        </Link>
        <Link
          to={{
            pathname: "/masterData/inspectiongroups/inspectionitem",
            state: [{ data: row }],
          }}
        >
          <Button>
            <DeleteIcon />
          </Button>
        </Link>
      </>
    ),
  },
  {
    field: "Sequence",
    headerName: "Sequence",
    width: 100,
    headerAlign: "center",
    align: "center",
  },
  {
    field: "Topic",
    headerName: "Topic",
    width: 350,
    headerAlign: "center",
  },
  {
    field: "Type",
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

const rows = [
  {
    id: 1,
    "Inspection Item": 1,
    Sequence: 1,
    Topic: "ตรวจสอบการขัน Torque Plug Drain",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 2,
    "Inspection Item": 2,
    Sequence: 2,
    Topic: "ตรวจสอบการหมุน Shaft Gear main (ต้องหมุนฟรีได้)",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 3,
    "Inspection Item": 3,
    Sequence: 3,
    Topic: "ตรวจสอบการหมุน Shaft PTO Counter (ต้องหมุนฟรีได้)",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 4,
    "Inspection Item": 4,
    Sequence: 4,
    Topic: "ตรวจสอบการหมุน Shaft Main Counter (ต้องหมุนฟรีได้)",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 5,
    "Inspection Item": 5,
    Sequence: 5,
    Topic:
      "ตรวจสอบ Bearing ที่ประกอบ Shaft Gear Main (เลข 6305R ต้องหันออกด้านนอก)",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 6,
    "Inspection Item": 6,
    Sequence: 6,
    Topic: "ตรวจสอบขัน Torque Holder Bearing CH (ขันทแยงตามรูป)",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 7,
    "Inspection Item": 7,
    Sequence: 7,
    Topic: "ตรวจสอบ Ball Interlock (ใส่ ball ครบ 3 ลูก)",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 8,
    "Inspection Item": 8,
    Sequence: 8,
    Topic: "ตรวจการใส่ O-Ring ที่ Base, Main Shift",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 9,
    "Inspection Item": 9,
    Sequence: 9,
    Topic: "ตรวจสอบเข้า Gear (สามารถขยับเปลี่ยนเกียร์ 1-2-3-4 ได้ปกติ)",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 10,
    "Inspection Item": 10,
    Sequence: 10,
    Topic: "ตรวจสอบเข้า Gear (ไม่สามารถเข้าเกียร์ได้พร้อมกัน)",
    Type: "Check Item",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
  {
    id: 11,
    "Inspection Item": 11,
    Sequence: 11,
    Topic: "บันทึกความผิดปกติ",
    Type: "Record",
    Min: "",
    Max: "",
    Target: "",
    isRequired: true,
    createdOn: "2024-05-09T00:00:00",
    createdBy: "HMS",
    modifiedBy: "",
    modifiedOn: "",
  },
];
