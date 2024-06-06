import ScheduleLineData from "../ui-components/MasterData/ScheduleLineData";
import ActiveLastBreadcrumb from "../ui-components/ActiveLastBreadcrumb";
import { ErrorComponent } from "../ui-components/ErrorComponent";
import { MsalAuthenticationTemplate } from "@azure/msal-react";
import { Loading } from "../ui-components/Loading";
import {
  // InteractionStatus,
  InteractionType,
  // InteractionRequiredAuthError,
  // AccountInfo,
} from "@azure/msal-browser";
import { loginRequest } from "../authProviders/authProvider";

export function ScheduleLine() {
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
        <ActiveLastBreadcrumb prm1="masterData" prm2="scheduleLine" prm3="" />
        <ScheduleLineData />
      </MsalAuthenticationTemplate>
    </>
  );
}
