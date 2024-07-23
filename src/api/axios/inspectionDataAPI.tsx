import toastAlert from "../../ui-components/SweetAlert2/toastAlert";
import instanceAxios from "./instanceAxios";

export async function GetInspectionDataAPI(pageNo:number , pageSize : number ,body : any) {
    let dataApi: any;
    try {
      await instanceAxios
        .post(`/InspectionData/GetList?pageNo=${pageNo}&pageSize=${pageSize}` ,  body)
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


  export async function GetInspectionGroupByParamAPI(body: any) {
    let dataApi: any;
    try {
      await instanceAxios
        .post(`/InspectionGroup/GetInspectionGroupByParam`, body)
        .then(async function (response: any) {
          console.log(response);
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

  export async function GetInspectionDataDetailAPI(inspectId : number) {
    let dataApi: any;
    try {
      await instanceAxios
        .get(`/InspectionData/GetDetail?inspectId=${inspectId}`)
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