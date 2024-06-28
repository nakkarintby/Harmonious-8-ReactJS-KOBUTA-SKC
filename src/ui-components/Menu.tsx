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
import { Link, defer } from "react-router-dom";
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
import instanceAxios from "../api/axios/instanceAxios";


interface Header {
  userId: number;
  empId: string;
  firstName: string;
  lastName: string;
  email: string;
  personalId: string;
  systemRoleId: number;
  isSuperUser: boolean;
  menuRoleId: number;
  menuId: number;
  code: string;
  nameTH: string;
  nameEN: string;
  icon: string | null;
  href: string;
  visible: boolean;
  menuGroup: string;
  refCode: string | null;
  isGrpHd: boolean;
  canCheckDisplay: boolean;
  canCheckCreate: boolean;
  canCheckEdit: boolean;
  canCheckDelete: boolean;
  canCheckActive: boolean;
  canDisplay: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canActive: boolean;
  sequence: number;
}

interface Item {
  menuRoleId: number;
  menuId: number;
  code: string;
  nameTH: string;
  nameEN: string;
  icon: string | null;
  href: string;
  visible: boolean;
  menuGroup: string;
  refCode: string | null;
  isGrpHd: boolean;
  canCheckDisplay: boolean;
  canCheckCreate: boolean;
  canCheckEdit: boolean;
  canCheckDelete: boolean;
  canCheckActive: boolean;
  canDisplay: boolean;
  canCreate: boolean;
  canEdit: boolean;
  canDelete: boolean;
  canActive: boolean;
  sequence: number;
}

interface Menu {
  headers: Header[];
  items: Item[];
}

function convertToMenu(data: any[]): Menu {
  const headers: Header[] = data.filter(item => item.isGrpHd).map(item => ({
      userId: item.userId,
      empId: item.empId,
      firstName: item.firstName,
      lastName: item.lastName,
      email: item.email,
      personalId: item.personalId,
      systemRoleId: item.systemRoleId,
      isSuperUser: item.isSuperUser,
      menuRoleId: item.menuRoleId,
      menuId: item.menuId,
      code: item.code,
      nameTH: item.nameTH,
      nameEN: item.nameEN,
      icon: item.icon,
      href: item.href,
      visible: item.visible,
      menuGroup: item.menuGroup,
      refCode: item.refCode,
      isGrpHd: item.isGrpHd,
      canCheckDisplay: item.canCheckDisplay,
      canCheckCreate: item.canCheckCreate,
      canCheckEdit: item.canCheckEdit,
      canCheckDelete: item.canCheckDelete,
      canCheckActive: item.canCheckActive,
      canDisplay: item.canDisplay,
      canCreate: item.canCreate,
      canEdit: item.canEdit,
      canDelete: item.canDelete,
      canActive: item.canActive,
      sequence: item.sequence
  }));

  const items: Item[] = data.filter(item => !item.isGrpHd).map(item => ({
      menuRoleId: item.menuRoleId,
      menuId: item.menuId,
      code: item.code,
      nameTH: item.nameTH,
      nameEN: item.nameEN,
      icon: item.icon,
      href: item.href,
      visible: item.visible,
      menuGroup: item.menuGroup,
      refCode: item.refCode,
      isGrpHd: item.isGrpHd,
      canCheckDisplay: item.canCheckDisplay,
      canCheckCreate: item.canCheckCreate,
      canCheckEdit: item.canCheckEdit,
      canCheckDelete: item.canCheckDelete,
      canCheckActive: item.canCheckActive,
      canDisplay: item.canDisplay,
      canCreate: item.canCreate,
      canEdit: item.canEdit,
      canDelete: item.canDelete,
      canActive: item.canActive,
      sequence: item.sequence
  }));

  return {
      headers,
      items
  };
}

async function getMenuAPI() {
  let dataApi:any ;
  try {
    await instanceAxios
      .get(`/Menu/GetMenuByUser`)
      .then(async function (response: any) {
        dataApi = response.data
      })
      .catch(function (error: any) {
        console.log("Err");
      });
  } catch (err) {
    console.log(err);
  }
  return dataApi;
}

export default function TemporaryDrawer() {
  const [open, setOpen] = React.useState(false);

  const [openMaster, setOpenMaster] = React.useState(false);

  const [openAdministrator, setOpenAdministrator] = React.useState(false);

  const [menuDataList, setMenuDataList] = React.useState<Menu|undefined>(undefined);
  

  const toggleDrawer = (newOpen: boolean) => () => {
    setOpen(newOpen);
  };

  const handleClick = () => {
    setOpenMaster(!openMaster);
  };

  const handleClickAdministrator = () => {
    setOpenAdministrator(!openAdministrator);
  };

  const GetIcon = (str: string) => {
    switch (str) {
      case 'HomeIcon':
        return <HomeIcon />;
      case 'StorageIcon':
        return <StorageIcon />;
      case 'DragHandleIcon':
        return <DragHandleIcon />;
      case 'ChecklistRtlIcon':
        return <ChecklistRtlIcon />;
      case 'SettingsIcon':
        return <SettingsIcon />;
      default:
        return null;
    }
  };

  const DrawerList = (
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
        {menuDataList?.headers.map((row) => (
          <div key={row.nameEN}>
            <ListItemButton
              key={row.menuId}
              onClick={() => {
                if (row.menuGroup === "MASTERDATA") {
                  handleClick();
                } else if (row.menuGroup === "ADMINISTRATOR") {
                  handleClickAdministrator();
                } else {
                  toggleDrawer(false)();
                }
              }}
            >
              <ListItemIcon>
              {GetIcon(row.icon ??"")}
              </ListItemIcon>
              <ListItemText primary={row.nameEN} />
              {row.menuGroup == "MASTERDATA" ? (
                openMaster ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              ) : row.menuGroup == "ADMINISTRATOR" ? (
                openAdministrator ? (
                  <ExpandLess />
                ) : (
                  <ExpandMore />
                )
              ) : (
                ""
              )}
            </ListItemButton>
            {menuDataList.items
              .filter((item) => item.menuGroup === row.menuGroup)
              .map((item) => (
                <Collapse in={row.menuGroup == "MASTERDATA" ? openMaster : row.menuGroup == "ADMINISTRATOR" ? openAdministrator : ""} timeout="auto" unmountOnExit>
                  <List component="div" disablePadding>
                    <ListItemButton
                      sx={{ pl: 4 }}
                      onClick={toggleDrawer(false)}
                      component={Link}
                      to={item.href}
                    >
                      <ListItemIcon>
                      {GetIcon(item.icon ??"")}
                      </ListItemIcon>
                      <ListItemText primary={item.nameEN} />
                    </ListItemButton>
                  </List>
                </Collapse>
              ))}
          </div>
        ))}
      </List>
    </Box>
  );

  React.useEffect(() => {
    const FetchMenu = async () => {
      getMenuAPI().then(async (x) => {
        if(x.status == "success"){
        const menuPage = await convertToMenu(x.data);
        
        setMenuDataList(menuPage)
   
        }
      });
    };
    FetchMenu();
  }, []);

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
