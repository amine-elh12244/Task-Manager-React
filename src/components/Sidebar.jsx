import React from "react";
import {
  Box,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  useTheme,
} from "@mui/material";
import {
  ChevronRightOutlined,
  AdminPanelSettingsOutlined,
} from "@mui/icons-material";
import { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";

import { useSelector } from "react-redux";
import { isAdmin } from "utils/Roles";

import LineAxisIcon from '@mui/icons-material/LineAxis';
import HailIcon from '@mui/icons-material/Hail';
import AssignmentIcon from '@mui/icons-material/Assignment';
import GroupsIcon from '@mui/icons-material/Groups';
import CalendarMonthIcon from '@mui/icons-material/CalendarMonth';
import PlaylistAddCheckIcon from '@mui/icons-material/PlaylistAddCheck';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

const Sidebar = ({
  drawerWidth,
  isSidebarOpen,
  setIsSidebarOpen,
  isNonMobile,
}) => {
  const storedUser = JSON.parse(localStorage.getItem("user"));
  const user = useSelector((state) => state.auth.user) || storedUser;
  const { pathname } = useLocation();
  const [active, setActive] = useState("");
  const navigate = useNavigate();
  const theme = useTheme();

  const navItems = [
    {
      text: "Admin",
      link: "/gestion-des-utlisateurs",
      canAccess: isAdmin(user),
      icon: <AdminPanelSettingsOutlined sx={{ color: theme.palette.white.first }} />,
    },
    {
      text: "Tableau de bord",
      link: "/tableau-de-bord",
      canAccess: isAdmin(user),
      icon: <LineAxisIcon sx={{ color: theme.palette.white.first }} />,
    },
    {
      text: "Calendrier",
      link: "/calendrier",
      canAccess: true,
      icon: <CalendarMonthIcon sx={{ color: theme.palette.white.first }} />,
    },
    {
      text: "Famille d'utilisateur",
      link: "/famille-utilisateur",
      canAccess: true,
      icon: <GroupsIcon sx={{ color: theme.palette.white.first }} />,
    },
    {
      text: "Utilisateurs",
      link: "/utilisateurs",
      canAccess: true,
      icon: <HailIcon sx={{ color: theme.palette.white.first }} />,
    },
    {
      text: "Tâches",
      link: "/taches",
      canAccess: true,
      icon: <AssignmentIcon sx={{ color: theme.palette.white.first }} />,
    },
    {
      text: "Ajouter une affectation",
      link: "/ajouter-une-affectation",
      canAccess: isAdmin(user),
      icon: <AddCircleOutlineIcon sx={{ color: theme.palette.white.first }} />,
    },
    {
      text: "Gestion des tâches",
      link: "/gestion-taches",
      canAccess: isAdmin(user),
      icon: <PlaylistAddCheckIcon sx={{ fontSize:"28px",color: theme.palette.white.first }} />,
    },  
    
   
   
  ];

  useEffect(() => {
    setActive(pathname);
  }, [pathname]);

  return (
    <Box component="nav">
      {isSidebarOpen && (
        <Drawer
          open={isSidebarOpen}
          onClose={() => setIsSidebarOpen(false)}
          variant="persistent"
          anchor="left"
          sx={{
            width: drawerWidth,
            "& .MuiDrawer-paper": {
              backgroundColor: theme.palette.blue.first,
              boxSizing: "border-box",
              borderWidth: isNonMobile ? 0 : "2px",
              width: drawerWidth,
            },
          }}
        >
          <Box width="100%">
           
            <List>
              {navItems?.map((element, index) => (
                <React.Fragment key={index}>
                  {element?.canAccess && (
                    <ListItem disablePadding>
                      <ListItemButton
                        onClick={() => {
                          navigate(element?.link);
                          setActive(element?.link);
                        }}
                        sx={{ color: theme.palette.white.first }}
                      >
                        <ListItemIcon sx={{ color: theme.palette.white.first }}>
                          {element?.icon}
                        </ListItemIcon>
                        <ListItemText
                          primary={element?.text}
                          sx={{
                            "& span": {
                              fontWeight: active === element?.link && "bold",
                            },
                          }}
                        />
                        {active === element?.link && (
                          <ChevronRightOutlined sx={{ ml: "auto" }} />
                        )}
                      </ListItemButton>
                    </ListItem>
                  )}
                </React.Fragment>
              ))}
            </List>
          </Box>
        </Drawer>
      )}
    </Box>
  );
};

export default Sidebar;
