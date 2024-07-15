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