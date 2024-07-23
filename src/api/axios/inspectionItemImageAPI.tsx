import toastAlert from "../../ui-components/SweetAlert2/toastAlert";
import instanceAxios from "./instanceAxios";

export async function GetImageInsItemAPI(insItemId: number) {
  let dataApi: any;
  try {
    await instanceAxios
      .get(
        `/InspectionItemPicture/GetPictureByInspectionItemId?inspectionItemId=${insItemId}`
      )
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (error) {
    toastAlert(`error`, `Admin`, 5000);
  }
  return dataApi;
}

export async function GetConstantAPI() {
  let dataApi: any;
  try {
    await instanceAxios
      .get(`/Constant/GetConstantByGRP?grp=IMAGE_INSITEM`)
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (error) {
    toastAlert(`error`, `Admin`, 5000);
  }
  return dataApi;
}

export async function CreateImageInsItemAPI(body: any) {
  let dataApi: any;
  try {
    await instanceAxios
      .post(`/InspectionItemPicture/CreateInspectionItemPicture`, body, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      })
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (error) {
    toastAlert(`error`, `Admin`, 5000);
  }
  return dataApi;
}

export async function DeleteImageInsItemAPI(insPictureId: any) {
  let dataApi: any;
  try {
    await instanceAxios
      .delete(
        `/InspectionItemPicture/DeleteInspectionItemPicture?inspectionItemPictureId=${insPictureId}`
      )
      .then(async function (response: any) {
        dataApi = response.data;
      })
      .catch(function (error: any) {
        toastAlert("error", error.response.data.message, 5000);
      });
  } catch (error) {
    toastAlert(`error`, `Admin`, 5000);
  }
  return dataApi;
}
