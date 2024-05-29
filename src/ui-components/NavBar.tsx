import AppBar from "@mui/material/AppBar";
import Toolbar from "@mui/material/Toolbar";
import {
  AuthenticatedTemplate,
  // UnauthenticatedTemplate,
} from "@azure/msal-react";
import Typography from "@mui/material/Typography";
import WelcomeName from "./WelcomeName";
import SignInSignOutButton from "./SignInSignOutButton";
// import { Link as RouterLink } from "react-router-dom";
import Menu from "./Menu";
const NavBar = () => {
  return (
    <div style={{ flexGrow: 1 }}>
      <AppBar position="static">
        <Toolbar>
          <AuthenticatedTemplate>
            <Menu />
          </AuthenticatedTemplate>
          <Typography style={{ flexGrow: 1 }}>
            <Typography variant="h6"> e-Smart Check sheet</Typography>
          </Typography>
          <WelcomeName />
          <SignInSignOutButton />
        </Toolbar>
      </AppBar>
    </div>
  );
};

export default NavBar;
