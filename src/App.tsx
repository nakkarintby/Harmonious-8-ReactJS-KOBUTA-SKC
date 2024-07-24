import { Routes, Route, useNavigate } from "react-router-dom";

import Grid from "@mui/material/Grid";

import { MsalProvider } from "@azure/msal-react";
import { IPublicClientApplication } from "@azure/msal-browser";
import { CustomNavigationClient } from "./utils/NavigationClient";

// Sample app imports
import { PageLayout } from "./ui-components/PageLayout";
import { Home } from "./pages/Home";
// import { Profile } from "./pages/Profile";
import { ScheduleLine } from "./pages/ScheduleLine";
import { Model } from "./pages/Model";
import { ModelGroup } from "./pages/ModelGroup";
import { MGDetail } from "./pages/MGDetail";
import { Line } from "./pages/Line";
import { Station } from "./pages/Station";
import { InspectionGroup } from "./pages/InspectionGroup";
import { InspectionItem } from "./pages/InspectionItem";
import { Users } from "./pages/Users";
import { SystemRole } from "./pages/SystemRole";
import { SRDetail } from "./pages/SRDetail";
import { UDetail } from "./pages/UDetail";
import { SystemSetting } from "./pages/SystemSetting";
import { setAuthToken } from "./api/axios/instanceAxios";


type AppProps = {
  pca: IPublicClientApplication;
};

async function GetTokenUser(pca : IPublicClientApplication){
  const account = pca.getActiveAccount();
  if (account) {
    const response = await pca.acquireTokenSilent({
      scopes: ["User.Read"],
      account: account
  });
   await setAuthToken(response.accessToken);
  } 

}


function App({ pca }: AppProps) {
  // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
  const navigate = useNavigate();
  const navigationClient = new CustomNavigationClient(navigate);
  pca.setNavigationClient(navigationClient);
  GetTokenUser(pca)

  return (
    <MsalProvider instance={pca}>
      <PageLayout>
        <Grid container justifyContent="center">
          <Pages />
        </Grid>
      </PageLayout>
    </MsalProvider>
  );
}

function Pages() {
  return (
    <Routes>
      <Route path="/masterData/scheduleLine" element={<ScheduleLine />} />
      <Route path="/masterData/scheduleLine/model" element={<Model />} />
      <Route path="/masterData/modelgroups" element={<ModelGroup />} />
      <Route path="/masterData/modelgroups/detail" element={<MGDetail />} />
      <Route path="/masterData/line" element={<Line />} />
      <Route path="/masterData/line/station" element={<Station />} />
      <Route path="/masterData/inspectiongroups" element={<InspectionGroup />} />
      <Route path="/masterData/inspectiongroups/inspectionitem" element={<InspectionItem />} />


      <Route path="/administrator/systemrole" element={<SystemRole />} />
      <Route path="/administrator/systemrole/detail" element={<SRDetail />} />
      <Route path="/administrator/users" element={<Users />} />
      <Route path="/administrator/users/detail" element={<UDetail />} />
      <Route path="/systemsetting" element={<SystemSetting />} />
      
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;