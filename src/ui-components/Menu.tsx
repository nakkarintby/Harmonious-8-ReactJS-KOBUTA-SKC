import * as React from "react";
import Box from "@mui/material/Box";
import Drawer from "@mui/material/Drawer";
import Button from "@mui/material/Button";
import List from "@mui/material/List";
// import ListItem from "@mui/material/ListItem";
import ListItemButton from "@mui/material/ListItemButton";
import ListItemIcon from "@mui/material/ListItemIcon";
import ListItemText from "@mui/material/ListItemText";
// import InboxIcon from "@mui/icons-material/MoveToInbox";
// import MailIcon from "@mui/icons-material/Mail";
import MenuIcon from "@mui/icons-material/Menu";
// import Divider from "@mui/material/Divider";
import { Link } from "react-router-dom";
import HomeIcon from "@mui/icons-material/Home";
import SettingsIcon from "@mui/icons-material/Settings";
import ListSubheader from "@mui/material/ListSubheader";
import DragHandleIcon from "@mui/icons-material/DragHandle";
// import DraftsIcon from "@mui/icons-material/Drafts";
import ExpandLess from "@mui/icons-material/ExpandLess";
import ExpandMore from "@mui/icons-material/ExpandMore";
import Collapse from "@mui/material/Collapse";
import ChecklistRtlIcon from "@mui/icons-material/ChecklistRtl";
import StorageIcon from "@mui/icons-material/Storage";
export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const [openMaster, setOpenMaster] = React.useState(false);

  const [openAdministrator, setOpenAdministrator] = React.useState(false);

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleClick = () => {
    setOpenMaster(!openMaster);
  };

  const handleClickAdministrator = () => {
    setOpenAdministrator(!openAdministrator);
  };

  const DrawerList = (
    // <Box sx={{ width: 250 }} role="presentation" onClick={toggleDrawer(false)}>
    <Box sx={{ width: 250 }} role="presentation">
      <List
        sx={{ width: "100%", maxWidth: 360, bgcolor: "background.paper" }}
        component="nav"
        aria-labelledby="nested-list-subheader"
        subheader={
          <ListSubheader component="div" id="nested-list-subheader">
            e-Smart Check Sheet System
          </ListSubheader>
        }
      >
        <ListItemButton onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <HomeIcon />
          </ListItemIcon>
          <ListItemText primary="Home" />
        </ListItemButton>

        <ListItemButton onClick={handleClick}>
          <ListItemIcon>
            <StorageIcon />
          </ListItemIcon>
          <ListItemText primary="Master Data" />
          {openMaster ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openMaster} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={toggleDrawer(false)}
              component={Link}
              to="/scheduleLine"
            >
              <ListItemIcon>
                <DragHandleIcon />
              </ListItemIcon>
              <ListItemText primary="Schedule Line" />
            </ListItemButton>
            {/* <ListItemButton
              sx={{ pl: 4 }}
              onClick={toggleDrawer(false)}
              component={Link}
              to="/model"
            >
              <ListItemIcon>
                <DragHandleIcon />
              </ListItemIcon>
              <ListItemText primary="Model" />
            </ListItemButton> */}
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={toggleDrawer(false)}
              component={Link}
              to="/modelgroups"
            >
              <ListItemIcon>
                <DragHandleIcon />
              </ListItemIcon>
              <ListItemText primary="Model Group" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={toggleDrawer(false)}
              component={Link}
              to="/line"
            >
              <ListItemIcon>
                <DragHandleIcon />
              </ListItemIcon>
              <ListItemText primary="Line" />
            </ListItemButton>
            {/* <ListItemButton sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <DragHandleIcon />
              </ListItemIcon>
              <ListItemText primary="Station" />
            </ListItemButton> */}
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={toggleDrawer(false)}
              component={Link}
              to="/inspectiongroups"
            >
              <ListItemIcon>
                <DragHandleIcon />
              </ListItemIcon>
              <ListItemText primary="Inspection Group" />
            </ListItemButton>
          </List>
        </Collapse>

        <ListItemButton onClick={toggleDrawer(false)}>
          <ListItemIcon>
            <ChecklistRtlIcon />
          </ListItemIcon>
          <ListItemText primary="Inspection Data" />
        </ListItemButton>

        <ListItemButton onClick={handleClickAdministrator}>
          <ListItemIcon>
            <SettingsIcon />
          </ListItemIcon>
          <ListItemText primary="Administrator" />
          {openAdministrator ? <ExpandLess /> : <ExpandMore />}
        </ListItemButton>
        <Collapse in={openAdministrator} timeout="auto" unmountOnExit>
          <List component="div" disablePadding>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={toggleDrawer(false)}
              component={Link}
              to="/users"
            >
              <ListItemIcon>
                <DragHandleIcon />
              </ListItemIcon>
              <ListItemText primary="Users" />
            </ListItemButton>
            <ListItemButton
              sx={{ pl: 4 }}
              onClick={toggleDrawer(false)}
              component={Link}
              to="/systemrole"
            >
              <ListItemIcon>
                <DragHandleIcon />
              </ListItemIcon>
              <ListItemText primary="System Role" />
            </ListItemButton>
            <ListItemButton sx={{ pl: 4 }} onClick={toggleDrawer(false)}>
              <ListItemIcon>
                <DragHandleIcon />
              </ListItemIcon>
              <ListItemText primary="System Setting" />
            </ListItemButton>
          </List>
        </Collapse>
      </List>

      {/* <List>
        {["Home", "Inspection Data", "Inspection Group", "Station"].map(
          (text, index) => (
            <ListItem key={text} disablePadding component={Link} to="/profile">
              <ListItemButton>
                <ListItemIcon>
                  {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
                </ListItemIcon>
                <ListItemText primary={text} />
              </ListItemButton>
            </ListItem>
          )
        )}
      </List>
      <Divider />
      <List>
        {["User", "System Setting"].map((text, index) => (
          <ListItem key={text} disablePadding component={Link} to="/profile">
            <ListItemButton>
              <ListItemIcon>
                {index % 2 === 0 ? <InboxIcon /> : <MailIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List> */}
    </Box>
  );

  return (
    <div>
      <Button color="inherit" onClick={toggleDrawer(true)}>
        <MenuIcon />
      </Button>
      <Drawer open={open} onClose={toggleDrawer(false)}>
        {DrawerList}
      </Drawer>
    </div>
  );
}
