import { AppBar, Button, IconButton, Toolbar, Typography } from "@mui/material"
import MenuIcon from "@mui/icons-material/Menu"
import { useContext } from "react"
import { AppContext } from "../context/context"
import { useNavigate } from "react-router-dom"
import logo from "../../assets/logo.png";

const NavBar = () => {
    const navigate = useNavigate();

    return (
        <header className="w-full mb-4">
            <AppBar position="static" sx={{bgcolor: "#F45A39"}}>
                <Toolbar>
                    <figure>
                        <img src={logo} alt="Logo" className="w-10"/>
                    </figure>
                    <Typography className="text-white font-sans text-bold" variant="h6" component="div" sx={{ flexGrow: 1 }}>
                        <span className="font-bold">Agenda</span> Fácil
                    </Typography>

                    <Button onClick={() => navigate('/')} sx={{ backgroundColor: "#F45A39", border: "2px solid #F76843", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#f7562d",},}}>Sair</Button>
                </Toolbar>
            </AppBar>
        </header>
        
    )
}

export default NavBar