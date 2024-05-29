import SRDetailData from "../ui-components/AdministratorData/SRDetailData";
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

export function SRDetail() {
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
        <ActiveLastBreadcrumb
          prm1="Master Data"
          prm2="System Role"
          prm3="Detail"
        />
        <SRDetailData />
      </MsalAuthenticationTemplate>
    </>
  );
}
