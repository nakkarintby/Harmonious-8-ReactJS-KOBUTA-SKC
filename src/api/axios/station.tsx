import toastAlert from "../../ui-components/SweetAlert2/toastAlert";
import instanceAxios from "./instanceAxios";

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
    } catch (err: any) {
      toastAlert("error", err, 5000);
    }
    return dataApi;
  }

export async function GetLineByID(lineId: number) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/Line/GetLineById?lineId=${lineId}`)
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
