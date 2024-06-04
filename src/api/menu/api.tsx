import instanceAxios from "../axios/instanceAxios";


export async function getData(url: string) {
  let dataApi: any;
  try {
    await instanceAxios.get(url).then(async function (response: any) {
      dataApi = response.data;
    });
    return dataApi;
  } catch (err) {
    return dataApi;
  }
}


export async function getDataByParam(url: string) {
    let dataApi: any;
    try {
      await instanceAxios.get(url).then(async function (response: any) {
        dataApi = response.data;
      });
      return dataApi;
    } catch (err) {
      return dataApi;
    }
  }