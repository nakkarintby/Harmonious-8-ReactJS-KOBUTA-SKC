import toastAlert from "../../ui-components/SweetAlert2/toastAlert";
import instanceAxios from "./instanceAxios";

export async function GetInsItemAPI(insItemID: number) {
    let dataApi: any;
    try {
      await instanceAxios
        .get(
          `/InspectionItem/GetInspectionItemByInspectionGroupId?inspectionGroupId=${insItemID}`
        )
        .then(async function (response: any) {
          dataApi = response.data;
        })
        .catch(function (error: any) {
          toastAlert("error", error.response.data.message, 5000);
        });
    } catch (err) {
      console.log(err);
    }
    return dataApi;
  }
  
  export async function UpdateInsItemAPI(body: any) {
    try {
      await instanceAxios
        .put(`/InspectionItem/UpdateInspectionItem`, body)
        .then(async function (response: any) {
          toastAlert(`${response.data.status}`, `${response.data.message}`, 5000);
        })
        .catch(function (error: any) {
          toastAlert("error", error.response.data.message, 5000);
        });
    } catch (err) {
      toastAlert(`error`, `${err}`, 5000);
    }
  }
  
  export async function CreateInsItemAPI(body: any) {
    let dataAPI : any ;
    try {
      await instanceAxios
        .post(`/InspectionItem/CreateInspectionItem`, body)
        .then(async function (response: any) {
          dataAPI = response.data;
        })
        .catch(function (error: any) {
          toastAlert("error", error.response.data.message, 5000);
        });
    } catch (error) {
      toastAlert(`error`, `Admin`, 5000);
    }
    return dataAPI;
  }
  
  export async function ValidateQRCodeAPI(action : string,qrcode: any[]) {
    let dataAPI: any;
    try {
      await instanceAxios
        .post(`/qrCodeCheck/ValidateImportQrCode?action=${action}`, qrcode)
        .then(async function (response: any) {
          dataAPI = response.data;
        })
        .catch(function (error: any) {
          toastAlert("error", error.response.data.message, 5000);
        });
    } catch (err) {
      toastAlert(`error`, `${err}`, 5000);
    }
    return dataAPI;
  }
  
  export async function DeletedInsItemAPI(insItemId: number) {
    try {
      await instanceAxios
        .put(`/InspectionItem/RemoveInspectionItem?inspectionItemId=${insItemId}`)
        .then(async function (response: any) {
          toastAlert(`${response.data.status}`, `${response.data.message}`, 5000);
        })
        .catch(function (error: any) {
          toastAlert("error", error.response.data.message, 5000);
        });
    } catch (err) {
      toastAlert(`error`, `${err}`, 5000);
    }
  }
  
  export async function GetQRCodeItemAPI(insItemId: number) {
    let dataAPI: any;
    try {
      await instanceAxios
        .get(
          `/qrCodeCheck/SelectQRCodeByInspectionItemId?inspectionItemId=${insItemId}`
        )
        .then(async function (response: any) {
          dataAPI = response.data;
        })
        .catch(function (error: any) {
          toastAlert("error", error.response.data.message, 5000);
        });
    } catch (err) {
      toastAlert(`error`, `${err}`, 5000);
    }
  
    return dataAPI;
  }
  
 export async function GetConstantByGrpAPI(grp: string) {
    let dataApi: any;
    try {
      await instanceAxios
        .get(`/Constant/GetConstantByGRP?grp=${grp}`)
        .then(async function (response: any) {
          dataApi = response.data;
        })
        .catch(function (error: any) {
          toastAlert("error", error.response.data.message, 5000);
        });
    } catch (err) {
      console.log(err);
    }
    return dataApi;
  }