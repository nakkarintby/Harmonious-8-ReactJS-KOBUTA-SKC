interface StationTypeModel {
    text: string;
    code: string;
  }
  
  interface StationModel {
    stationId: number;
    name: string;
    lineId: number;
    sequence: number;
    type: number;
    typeName: string;
    isFirstStation: boolean;
    refMFG: string;
    refStation: string;
    isFinishedStation: boolean;
    refFinishedMFG: string;
    scheduledLindCode: string;
    nextSequence: number;
    isDeleted: boolean;
    createdBy: string;
    createdOn: string;
    modifiedBy: string;
    modifiedOn: string;
  }
  