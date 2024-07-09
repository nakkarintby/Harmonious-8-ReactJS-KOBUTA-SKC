import { Configuration, PopupRequest } from "@azure/msal-browser";

// Config object to be passed to Msal on creation
export const msalConfig: Configuration = {
  auth: {
    // clientId: "b2a960a4-fbe1-41aa-8740-ff49bc2d7e3a",
    // authority:
    //   "https://login.microsoftonline.com/fd342266-e550-4d94-9ad9-cbba1b260ebe",
    redirectUri: "/",

    clientId: "d0c122e2-6864-4f8f-8ad5-3dbf243c9723",
    authority:
      "https://login.microsoftonline.com/eef38a1f-720f-4ede-9c7a-79ef6d5dd342",
    // redirectUri: "https://d742apsi01-wa01skc.azurewebsites.net/",
    // postLogoutRedirectUri: "/",
  },
  system: {
    allowNativeBroker: false, // Disables WAM Broker
  },
  cache: {
    cacheLocation: "sessionStorage", // This configures where your cache will be stored
    storeAuthStateInCookie: false, // Set this to "true" if you are having issues on IE11 or Edge
  },
};

export const protectedResources = {
  toDoListAPI: {
    endpoint: "http://localhost:8000",
    scopes: {
      read: ["api://334eddc1-75b9-427b-8c3f-c1c1e7949c36/user_impersonation"],
    },
  },
};

// Add here scopes for id token to be used at MS Identity Platform endpoints.
export const loginRequest: PopupRequest = {
  // scopes: ["api://334eddc1-75b9-427b-8c3f-c1c1e7949c36/user_impersonation"],
  scopes: ["user.read"],
};

// Add here the endpoints for MS Graph API services you would like to use.
export const graphConfig = {
  graphMeEndpoint: "https://graph.microsoft.com/v1.0/me",
};
