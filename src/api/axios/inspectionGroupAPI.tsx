import toastAlert from "../../ui-components/SweetAlert2/toastAlert";
import instanceAxios from "./instanceAxios";

export async function GetInspectionGroupApi() {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/InspectionGroup/GetInspectionGroup?page=1&perpage=1000`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (err: any) {
    toastAlert("error", err, 5000);
  }
  return dataApi;
}

export async function DeleteInspectionGroupApi(insGroupId: number) {
  let dataApi: any;
  try {
    await instanceAxios
      .put(
        `/InspectionGroup/RemoveInspectionGroupAndItem?inspectionGroupId=${insGroupId}`
      )
      .then(async function (response: any) {
        dataApi = response.data;
        toastAlert(response.data.status, response.data.message, 5000);
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

export async function GetInsGroupAPI(InsId: number) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/InspectionGroup/GetInspectionGroupById?inspectionGroupId=${InsId}`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error, 5000);
      });
  } catch (err : any) {
    toastAlert("error", err, 5000);
  }
  return dataApi;
}

export async function ActiveInsGroupAPI(InsId: number) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/InspectionGroup/UpdateStatus?inspectionGroupId=${InsId}`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error, 5000);
      });
  } catch (err : any) {
    toastAlert("error", err, 5000);
  }
  return dataApi;
}

export async function GetModelGroupAPI() {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/ModelGroup/GetModelGroup?page=1&perpage=1000`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
         toastAlert("error", error, 5000);
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

export async function SaveInsGroupAPI(body: any) {
  let dataApi: any;
  try {
    await instanceAxios
      .put("/InspectionGroup/UpdateInspectionGroup", body)
      .then(async function (response: any) {
        return (dataApi = response.data);
      });
  } catch (err : any) {
    toastAlert("error", err, 5000);
  }
  return dataApi;
}

export async function GetLineAPI(scheduledLineCode: string) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(
        `/Line/GetLineByScheduledLineCode?scheduledLineCode=${scheduledLineCode}`
      )
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error, 5000);
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

export async function GetStationAPI(lineId: number) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/Station/GetStationByLineId?lineId=${lineId}`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error, 5000);
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

export async function GetScheduledLineAPI() {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/ScheduledLine/GetScheduledLine?page=1&perpage=1000`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error, 5000);
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

export async function CopyInspectionGroupAPI(id : number) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/InspectionGroup/CopyInspectionGroupAndItem?inspectionGroupId=${id}`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error, 5000);
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi ;
}