import { useState } from "react";
import { useMsal } from "@azure/msal-react";
import Button from "@mui/material/Button";
import MenuItem from "@mui/material/MenuItem";
import Menu from "@mui/material/Menu";
import { loginRequest } from "../authProviders/authProvider";
import { setAuthToken } from "../api/axios/instanceAxios";

export const SignInButton = () => {
  const { instance } = useMsal();

  const [anchorEl, setAnchorEl] = useState<null | HTMLElement>(null);
  const open = Boolean(anchorEl);

  const handleLogin = (loginType: string) => {
    setAnchorEl(null);

    if (loginType === "popup") {
      // instance.loginPopup(loginRequest);
      instance.loginPopup(loginRequest).then((tokenResponse) => {
        setAuthToken(tokenResponse.accessToken)
      });
    } else if (loginType === "redirect") {
      instance.loginRedirect(loginRequest);
    }
  };

  return (
    <div>
      <Button
        onClick={(event) => setAnchorEl(event.currentTarget)}
        color="inherit"
      >
        Login
      </Button>
      <Menu
        id="menu-appbar"
        anchorEl={anchorEl}
        anchorOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        keepMounted
        transformOrigin={{
          vertical: "top",
          horizontal: "right",
        }}
        open={open}
        onClose={() => setAnchorEl(null)}
      >
        <MenuItem onClick={() => handleLogin("popup")} key="loginPopup">
          Sign in
        </MenuItem>
        {/* <MenuItem onClick={() => handleLogin("redirect")} key="loginRedirect">
          Sign in using Redirect
        </MenuItem> */}
      </Menu>
    </div>
  );
};
