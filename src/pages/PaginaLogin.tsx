import * as yup from "yup";
import {  set, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button,Backdrop, Typography,FormControlLabel, Checkbox, Link, Box, CircularProgress} from "@mui/material";
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from "react";
import alertaMensagem from "../shared/components/AlertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import logo from "../assets/logo-titulo.png";
import type { InferType } from "yup";
import { AppContext } from "../shared/context/context";
import React from "react";

const PaginaLogin = () => {
    const navigate = useNavigate();
    const [alerta, setAlerta] = useState<React.ReactNode | null>(null);
    const {senhaalterada, setSenhaAlterada} = React.useContext(AppContext);
    const [loading, setLoading] = useState(false);
    const [botaoReset, setBotaoReset] = useState(false);
    const {usuarioCriado, setUsuarioCriado} = React.useContext(AppContext);

    useEffect(() =>{
        if (!alerta) return;

        const timer = setTimeout(() => {
            setAlerta(null);
        }, 3000);

        return () => clearTimeout(timer);
    }, [alerta]);

    useEffect(() => {
        if (!senhaalterada) return;

        setAlerta(alertaMensagem("Senha alterada com sucesso.", "success", <CheckCircleIcon />));
        setSenhaAlterada(false);
        
    }, [senhaalterada]);

    useEffect(() => {
        if (!usuarioCriado) return;

        setAlerta(alertaMensagem("Usuário criado com sucesso.", "success", <CheckCircleIcon />));
        setUsuarioCriado(false);
        
    }, [usuarioCriado]);

    const schema = yup.object({
        email: yup.string().email("Email inválido").required("Email é obrigatório"),
        senha: yup.string().min(8, "A senha deve conter no mínimo 8 caracteres").required("Senha é obrigatória"),
        lembrar: yup.boolean().default(() => !!localStorage.getItem('lembrado_email'))
    });

    type LoginFormData  = InferType<typeof schema>;

    const {register, handleSubmit, watch, formState: { errors }} = useForm<LoginFormData>({
        resolver: yupResolver(schema),
        defaultValues: {
            email: localStorage.getItem('lembrado_email') || '',
            senha: '',
            lembrar: !!localStorage.getItem("lembrado_email")
        }
    
    })

    const email = watch("email")
    const lembrar = watch("lembrar")

    const fetchEntrar = async (data: LoginFormData) =>{

        setLoading(true)

        try{

            const response = await axios.post("http://localhost:3000/auth/login", {
                email: data.email,
                senha: data.senha
            })

            if(data.lembrar){
                localStorage.setItem('lembrado_email', data.email);
            }else{
                localStorage.removeItem("lembrado_email");
            }

            localStorage.setItem("token", response.data.token)

            navigate("/dashboard")
            setLoading(false)

        }catch(error:any){
            setLoading(false)
            if(error.response){
                setAlerta(alertaMensagem(error.response.data.message, "error",<ReportProblemIcon />));
            }else{
                setAlerta(alertaMensagem("Ocorreu um erro ao tentar entrar. Por favor, tente novamente mais tarde.", "error",<ReportProblemIcon />));
            }
        }
        
    }

    const fetchResetarSenha = async () => {

        if(loading){
            return;
        }

        if(!email) {
            setAlerta(alertaMensagem("Por favor, insira seu email para receber as instruções de reset de senha.", "warning",<ReportProblemIcon />));
            return;
        }

        setBotaoReset(true);

        try {
            const response = await axios.post("http://localhost:3000/auth/resetar-senha", {
                email: email
            });

            setAlerta(alertaMensagem("Verifique seu email para instruções de reset de senha.", "success",<CheckCircleIcon />));
            setBotaoReset(false);

        }catch(error:any){
            setBotaoReset(false);
            if(error.response){
                setAlerta(alertaMensagem(error.response.data.message, "error",<ReportProblemIcon />));
            }else{
                setAlerta(alertaMensagem("Ocorreu um erro ao tentar entrar. Por favor, tente novamente mais tarde.", "error",<ReportProblemIcon />));
            }
        }
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
            <div className="w-full max-w-5xl min-h-[500px] bg-white shadow-lg rounded-2xl flex flex-col overflow-hidden md:!flex-row">
                <section className="flex w-full md:!flex-1 bg-[#F5613B] p-8 md:p-12 items-center justify-center">
                    <div className="w-full max-w-[280px] md:!max-w-xs text-white font-sans flex items-center justify-center">
                        <figure className="w-full">
                            <img src={logo} alt="Logo" className="w-full h-auto object-contain"/>
                        </figure>
                    </div>
                </section>

                <section className="w-full md:!flex-1 flex flex-col items-center justify-center p-6 md:!p-8">
                    <div className="w-full max-w-md">
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

                            <div className="flex flex-wrap items-center justify-between mt-4 mb-4">
                                <FormControlLabel
                                label="Lembrar-me" 
                                control={
                                    <Checkbox
                                        checked={lembrar} 
                                        {...register("lembrar")} 
                                    />} 
                                 />
                                <Link onClick={fetchResetarSenha} href="#" underline="hover">Esqueceu sua senha?</Link>
                            </div>

                            <Button  disabled={loading} className="mt-4" type="submit" fullWidth sx={{ backgroundColor: "#F5613B", border: "2px solid #F76843", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#f7562d"}, '&.Mui-disabled': { backgroundColor: "#fca38d", color: "#ffffff90"}}}>
                                {loading ? 
                                    (<CircularProgress size={24} color="inherit" /> 
                                        ) : (
                                        'Entrar'
                                    )}    
                            </Button>
                        </form>
                    </div>

                    <footer className="mt-8 text-sm text-gray-600">
                        Novo aqui? <Link href={loading ? undefined : "/criar-usuario"} underline="hover">Crie sua conta </Link>
                    </footer>
                </section> 
            </div>

        {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}

          {botaoReset && 
            <Backdrop sx={{ color: '#fff', zIndex: (theme) => theme.zIndex.drawer + 1 }} open={botaoReset}>
              <CircularProgress color="inherit" />
            </Backdrop>
          }

        </main>
    )
}

export default PaginaLogin