interface FilterModal{
    dateFrom : string,
    dateTo : string,
    id_no : string,
    inspectionGroupId : number,
    modelGroupId:number,
    stationId : number,
    lineId : number,
    scheduledLineCode : string
}


interface InspectionDataModel{
    inspectId : number ,
    scheduledLineName : string,
    scheduledLineCode : string,
    lineName : string,
    stationName : string,
    inspectionGroupId : number,
    inspectionGroupName : string,
    id_no : string,
    pinCode : string,
    modelGroupName : string,
    modelName : string,
    createdBy : string,
    createdOn : string,
    modifiedBy : string,
    modifiedOn : string
}

interface InspectionPicture {
    inspectionItemId: number;
    fileName: string;
    url: string;
  }
  
  interface InspectionDataItem {
    sequence: number;
    topic: string;
    type: number;
    min: number | null;
    max: number | null;
    target: number | null;
    unit: string | null;
    judgement: string;
    inspectValue: number | null;
    inspectionText: string;
    isPinCode : boolean | null;
    comment: string;
    inspectItemId: number;
    inspectionItemId: number;
    inspectionQRCodeMasterList: any[]; 
    inspectQRCodeList: any[]; 
    inspectionPictureList: InspectionPicture[];
  }

  interface PictureModel{
    fileName : string,
    inspectionItemId : number,
    url : string
  }