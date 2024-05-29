// import Typography from "@mui/material/Typography";
import NavBar from "./NavBar";

type Props = {
  children?: React.ReactNode;
};

export const PageLayout: React.FC<Props> = ({ children }) => {
  return (
    <>
      <NavBar />
      <br />
      {/* <Typography variant="h5" align="center">
        Welcome to E-Smart Check sheet System
      </Typography> */}

      {children}
    </>
  );
};
