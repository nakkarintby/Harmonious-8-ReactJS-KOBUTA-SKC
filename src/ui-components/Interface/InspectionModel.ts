interface InspectionGroupModel {
  inspectionGroupName: string;
  id: number;
  modelGroup: string;
  Status: string;
  createdBy: string;
  modifiedBy: string;
  scheduledLineCode: string;
  scheduledLineName: string;
  modelGroupName: string;
  stationId: number;
  stationName: string;
  lineId: number;
  lineName: string;
  version: number;
  taktTime: string;
  createdOn: string;
  modifiedOn: string;
}

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
  inspectionItemId : number | null;
  value: string | null;
  text: string | null;
  cell: string | null;
  msg : string | null;
}

interface TabPanelProps {
  children?: React.ReactNode;
  index: number;
  value: number;
}

interface InsItemImageModel {
  inspectionItemId: number;
  inspectionItemPictureId: number;
  sequence: number;
  url: string;
  fileName: string;
}
