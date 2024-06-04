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
import { LDetail } from "./pages/LDetail";
import { InspectionGroup } from "./pages/InspectionGroup";
import { InspectionItem } from "./pages/InspectionItem";
import { Users } from "./pages/Users";
import { SystemRole } from "./pages/SystemRole";
import { SRDetail } from "./pages/SRDetail";
import { UDetail } from "./pages/UDetail";
import { SystemSetting } from "./pages/SystemSetting";

type AppProps = {
  pca: IPublicClientApplication;
};

function App({ pca }: AppProps) {
  // The next 3 lines are optional. This is how you configure MSAL to take advantage of the router's navigate functions when MSAL redirects between pages in your app
  const navigate = useNavigate();
  const navigationClient = new CustomNavigationClient(navigate);
  pca.setNavigationClient(navigationClient);

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
      <Route path="/scheduleLine" element={<ScheduleLine />} />
      <Route path="/scheduleLine/model" element={<Model />} />
      <Route path="/modelgroups" element={<ModelGroup />} />
      <Route path="/modelgroups/detail" element={<MGDetail />} />
      <Route path="/line" element={<Line />} />
      <Route path="/line/detail" element={<LDetail />} />
      <Route path="/inspectiongroups" element={<InspectionGroup />} />
      <Route path="/inspectionitem" element={<InspectionItem />} />
      <Route path="/users" element={<Users />} />
      <Route path="/users/detail" element={<UDetail />} />

      <Route path="/systemrole" element={<SystemRole />} />
      <Route path="/systemsetting" element={<SystemSetting />} />
      <Route path="/systemrole/detail" element={<SRDetail />} />
      <Route path="/" element={<Home />} />
    </Routes>
  );
}

export default App;

// function App() {
//   const [count, setCount] = useState(0);

//   return (
//     <>
//       <div>
//         <a href="https://vitejs.dev" target="_blank">
//           <img src={viteLogo} className="logo" alt="Vite logo" />
//         </a>
//         <a href="https://react.dev" target="_blank">
//           <img src={reactLogo} className="logo react" alt="React logo" />
//         </a>
//       </div>
//       <h1>Vite + React +TS</h1>
//       <div className="card">
//         <Button
//           variant="contained"
//           color="success"
//           onClick={() => setCount((count) => count + 1)}
//         >
//           count is {count}
//         </Button>
//         <p>
//           Edit <code>src/App.tsx</code> and save to test HMR
//         </p>
//       </div>
//       <p className="read-the-docs">
//         Click on the Vite and React logos to learn more
//       </p>
//       <MyComponent
//         title="This prop from App.tsx"
//         description="Test description"
//       />
//     </>
//   );
// }

// export default App;
