import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import {
  InteractionType,
} from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";
import SystemSettingData from "../ui-components/MasterData/SystemSettingData";

export function SystemSetting() {
  const authRequest = {
    ...loginRequest,
  };

  return (
    <>
      <MsalAuthenticationTemplate
        interactionType={InteractionType.Redirect}
        authenticationRequest={authRequest}
        errorComponent={ErrorComponent}
        loadingComponent={Loading}
      >
        <ActiveLastBreadcrumb prm1="Administrator" prm2="System Setting" prm3="" />
        <SystemSettingData />
      </MsalAuthenticationTemplate>
    </>
  );
}
