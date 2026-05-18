import {
  AppBar,
  Box,
  Button,
  IconButton,
  Toolbar,
  Typography,
} from "@mui/material";
import MenuIcon from "@mui/icons-material/Menu";
import { useNavigate } from "react-router-dom";
import logo from "../../assets/logo.png";

interface NavBarProps {
  handleDrawerToggle: () => void;
}

const NavBar: React.FC<NavBarProps> = ({ handleDrawerToggle }) => {
  const navigate = useNavigate();
  const drawerWidth = 260;

  return (
    <header className="w-full fixed top-0 left-0 z-50">
      <AppBar position="static" sx={{ bgcolor: "#F45A39", boxShadow: 1 }}>
        <Toolbar
          sx={{
            pl: { xs: 2, md: `${drawerWidth + 16}px !important` },
            transition: "padding-left 0.3s ease",
          }}
        >
          <IconButton
            color="inherit"
            aria-label="open drawer"
            edge="start"
            onClick={handleDrawerToggle}
            sx={{ mr: 2, display: { xs: "flex", md: "none" } }}
          >
            <MenuIcon />
          </IconButton>

          <Box sx={{ display: "flex", alignItems: "center", flexGrow: 1 }}>
            <figure className="mr-3 flex items-center">
              <img src={logo} alt="Logo" className="w-10 h-10 object-contain" />
            </figure>

            <Typography
              className="text-white font-sans"
              variant="h6"
              component="div"
            >
              <span className="font-bold">Agenda</span> Fácil
            </Typography>
          </Box>

          <Button
            onClick={() => navigate("/")}
            sx={{
              backgroundColor: "#F45A39",
              border: "2px solid #F76843",
              borderRadius: "1rem",
              color: "#fff",
              textTransform: "none",
              paddingX: "20px",
              "&:hover": { backgroundColor: "#f7562d" },
            }}
          >
            Sair
          </Button>
        </Toolbar>
      </AppBar>
    </header>
  );
};

export default NavBar;
