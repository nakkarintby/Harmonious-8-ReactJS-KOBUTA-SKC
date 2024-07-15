import toastAlert from "../../ui-components/SweetAlert2/toastAlert";
import instanceAxios from "./instanceAxios";

export async function GetModelGroupDetailAPI(modelGroupId : string) {
    let dataApi: any;
    try {
      await instanceAxios
        .get(
          `/ModelGroupMapping/SelectItemByModelGroupId?modelGroupId=${modelGroupId}`
        )
        .then(async function (response: any) {
          dataApi = response.data;
        })
        .catch(function (error: any) {
          toastAlert("error", error, 5000);
        });
    } catch (err: any) {
      toastAlert("error", err, 5000);
    }
    return dataApi;
  }
  
  export  async function GetScheduledLineAPI() {
    let dataApi: any;
    try {
      await instanceAxios
        .get(
         `/ScheduledLine/GetScheduledLine?page=1&perpage=1000`
        )
        .then(async function (response: any) {
          dataApi = response.data;
        })
        .catch(function (error: any) {
          toastAlert("error", error, 5000);
        });
    } catch (err: any) {
      toastAlert("error", err, 5000);
    }
    return dataApi;
  }
  
  export  async function GetListAPI(scheduledLineCod : string) {
    let dataApi: any;
    try {
      await instanceAxios
        .get(
         `/Line/GetLineByScheduledLineCode?scheduledLineCode=${scheduledLineCod}`
        )
        .then(async function (response: any) {
          dataApi = response.data;
        })
        .catch(function (error: any) {
          toastAlert("error", error, 5000);
        });
    } catch (err: any) {
      toastAlert("error", err, 5000);
    }
    return dataApi;
  }
  
  export   async function CreateModelItemAPI(body: any) {
    let dataApi: any;
    try {
      await instanceAxios
        .post(`/ModelGroupMapping/CreateRemoveItemByModelCodeList`, body)
        .then(async function (response: any) {
          dataApi = response.data;
        })
        .catch(function (error: any) {
          toastAlert("error", error, 5000);
        });
    } catch (err: any) {
      toastAlert("error", err, 5000);
    }
    return dataApi;
  }
  