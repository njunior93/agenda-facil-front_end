import {
  Box,
  Divider,
  Drawer,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Typography,
} from "@mui/material";
import DashboardIcon from "@mui/icons-material/Dashboard";
import PeopleIcon from "@mui/icons-material/People";
import EventIcon from "@mui/icons-material/Event";
import { useNavigate } from "react-router-dom";

interface SideBarProps {
  mobileOpen: boolean;
  handleDrawerToggle: () => void;
}

const SideBar: React.FC<SideBarProps> = ({
  mobileOpen,
  handleDrawerToggle,
}) => {
  const navigate = useNavigate();

  const drawerWidth = 260;

  const DrawerList = (
    <Box
      sx={{ width: drawerWidth }}
      role="presentation"
      onClick={handleDrawerToggle}
    >
      <List>
        <Typography
          sx={{ pl: 2, pt: 2, pb: 1, fontWeight: "bold", color: "white" }}
        >
          MENU PRINCIPAL
        </Typography>
        <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemIcon sx={{ color: "white" }}>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>

        <Typography
          sx={{ pl: 2, pt: 2, pb: 1, fontWeight: "bold", color: "white" }}
        >
          GESTÃO
        </Typography>
        {["Clientes", "Agendamentos"].map((text) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate(`/${text.toLowerCase()}`)}>
              <ListItemIcon sx={{ color: "white" }}>
                {text === "Clientes" ? <PeopleIcon /> : <EventIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider sx={{ backgroundColor: "rgba(255,255,255,0.2)" }} />
    </Box>
  );

  return (
    <Box
      component="nav"
      sx={{ width: { md: drawerWidth }, flexShrink: { md: 0 } }}
    >
      <Drawer
        variant="temporary"
        open={mobileOpen}
        onClose={handleDrawerToggle}
        ModalProps={{
          keepMounted: true,
        }}
        sx={{
          display: { xs: "block", md: "none" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#F45A39",
            color: "#fff",
          },
        }}
      >
        {DrawerList}
      </Drawer>

      <Drawer
        variant="permanent"
        anchor="left"
        sx={{
          display: { xs: "none", md: "block" },
          "& .MuiDrawer-paper": {
            width: drawerWidth,
            boxSizing: "border-box",
            backgroundColor: "#F45A39",
            color: "#fff",
          },
        }}
        open
      >
        {DrawerList}
      </Drawer>
    </Box>
  );
};

export default SideBar;
