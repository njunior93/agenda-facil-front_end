import { Box, Divider, Drawer, List, ListItem, ListItemButton, ListItemIcon, ListItemText, Typography } from "@mui/material";
import DashboardIcon from '@mui/icons-material/Dashboard';
import PeopleIcon from '@mui/icons-material/People';
import EventIcon from '@mui/icons-material/Event';
import BuildIcon from '@mui/icons-material/Build';
import { useNavigate } from "react-router-dom";


const SideBar = () => {
    const navigate = useNavigate();

    const DrawerList = (
    <Box sx={{ width: 250 }} role="presentation">
      <List>
         <Typography sx={{ pl: 2, pt: 2, pb: 1, fontWeight: "bold", color: "white" }}>
          MENU PRINCIPAL
        </Typography>
         <ListItem disablePadding>
          <ListItemButton onClick={() => navigate("/dashboard")}>
            <ListItemIcon>
              <DashboardIcon />
            </ListItemIcon>
            <ListItemText primary="Dashboard" />
          </ListItemButton>
        </ListItem>
        <Typography sx={{ pl: 2, pt: 2, pb: 1, fontWeight: "bold", color: "white" }}>
          GESTÃO
        </Typography>
        {['Clientes', 'Agendamentos', 'Serviços'].map((text, index) => (
          <ListItem key={text} disablePadding>
            <ListItemButton onClick={() => navigate(`/${text.toLowerCase()}`)}>
              <ListItemIcon>
                {text === 'Clientes' ? <PeopleIcon/> : text === 'Agendamentos' ? <EventIcon /> : <BuildIcon />}
              </ListItemIcon>
              <ListItemText primary={text} />
            </ListItemButton>
          </ListItem>
        ))}
      </List>
      <Divider />
    </Box>
  );
    return (
        <Drawer 
        variant="permanent" 
        anchor='left'
        sx={{
    width: 240,
    flexShrink: 0,
    "& .MuiDrawer-paper": {
      width: 260,
      boxSizing: "border-box",
      backgroundColor: "#F45A39",
      color: "#fff"
    }
  }}
        >
            {DrawerList}
        </Drawer>
    )
}

export default SideBar;