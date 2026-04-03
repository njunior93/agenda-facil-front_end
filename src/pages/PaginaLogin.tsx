import * as yup from "yup";
import { set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Typography,FormControlLabel, Checkbox, Link, Box } from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import alertaMensagem from "../shared/components/AlertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import logo from "../assets/logo-titulo.png";

const PaginaLogin = () => {
    const navigate = useNavigate();
    const [alerta, setAlerta] = useState<React.ReactNode | null>(null);

    useEffect(() =>{
        if (!alerta) return;

        const timer = setTimeout(() => {
            setAlerta(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [alerta]);

    const schema = yup.object({
        email: yup.string().email("Email inválido").required("Email é obrigatório"),
        senha: yup.string().min(8, "A senha deve conter no mínimo 8 caracteres").required("Senha é obrigatória"),
    })

    const {register, handleSubmit, formState: { errors }} = useForm({resolver: yupResolver(schema)})

    const fetchEntrar = async (data: any) =>{
        try{

            const response = await axios.post("http://localhost:3000/auth/login", {
                email: data.email,
                senha: data.senha
            })

            localStorage.setItem("token", response.data.token)

            navigate("/dashboard")

        }catch(error:any){
            if(error.response){
                setAlerta(alertaMensagem(error.response.data.message, "error",<ReportProblemIcon />));
            }else{
                setAlerta(alertaMensagem("Ocorreu um erro ao tentar entrar. Por favor, tente novamente mais tarde.", "error",<ReportProblemIcon />));
            }
        }
        
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <div className=" w-full max-w-5xl min-h-[500px] bg-white shadow-lg rounded-2xl flex overflow-hidden">
                <section className="flex w-1/2 bg-[#F5613B] p-2">
                    <div className="m-auto text-white font-sans">
                        <figure>
                            <img src={logo} alt="Logo" className="w-full"/>
                        </figure>
                    </div>
                </section>

                <section className="w-1/2 flex flex-col items-center justify-center">
                    <div className="w-full max-w-md p-8">
                        <Typography variant="h5" fontWeight="600" mb={2}>Entrar</Typography>
                        <form  onSubmit={handleSubmit(fetchEntrar)}>
                            <TextField 
                                label="Email"
                                fullWidth 
                                margin="normal" 
                                {...register("email")}
                                error={!!errors.email}
                                helperText={errors.email?.message}
                            />

                            <TextField 
                                label="Senha"
                                fullWidth 
                                margin="normal" 
                                {...register("senha")}
                                error={!!errors.senha}
                                helperText={errors.senha?.message}
                                type="password"
                            />

                            <div className="flex items-center justify-between mt-4 mb-4">
                                <FormControlLabel control={<Checkbox />} label="Lembrar-me" />
                                <Link href="#" underline="hover">Esqueceu sua senha?</Link>
                            </div>

                            <Button className="mt-4" type="submit" fullWidth sx={{ backgroundColor: "#F5613B", border: "2px solid #F76843", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#f7562d",},}}>
                                Entrar
                            </Button>
                        </form>
                    </div>

                    <footer>
                        Novo aqui? <Link href="#" underline="hover">Crie sua conta </Link>
                    </footer>
                </section> 
            </div>

        {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
        </main>
    )
}

export default PaginaLogin