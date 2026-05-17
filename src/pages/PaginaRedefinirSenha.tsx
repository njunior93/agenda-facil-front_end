import React, { useEffect, useState } from 'react';
import { set, useForm } from 'react-hook-form';
import { useSearchParams, useNavigate } from 'react-router-dom'; 
import { Typography, TextField, Button, Link, Box, CircularProgress } from '@mui/material';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import axios from 'axios';
import logo from '../assets/logo.png';
import { getErrorMessage } from '../shared/utils/getError';
import alertaMensagem from '../shared/components/AlertaMensagem';
import { AppContext } from '../shared/context/context';

export default function PaginaRedefinirSenha() {
    const [searchParams] = useSearchParams();
    const navigate = useNavigate();
    const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
    const {setSenhaAlterada} = React.useContext(AppContext);
    const [loading, setLoading] = useState(false);
    
    const token = searchParams.get('token');

    useEffect(() =>{
                if (!alerta) return;
            
                const timer = setTimeout(() => {
                    setAlerta(null);
                }, 3000);
            
                return () => clearTimeout(timer);
        }, [alerta]);

    const { register, handleSubmit, watch, formState: { errors } } = useForm({
        defaultValues: {
            password: '',
            confirmPassword: ''
        }
    });

    const novaSenha = watch('password');

    const fetchConfirmarReset = async (data: any) => {
        if (!token) {
            return;
        }

        setLoading(true);

        try {
            await axios.post("http://localhost:3000/auth/confirmar-reset", {
                token: token,
                password: data.password
            });

            setSenhaAlterada(true);

            setTimeout(() => {
                navigate('/');
            }, 3000);

        }catch(error:any){
            setSenhaAlterada(false);
            setLoading(false);
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
        }
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <div className="w-full max-w-5xl min-h-[500px] bg-white shadow-lg rounded-2xl flex overflow-hidden">
                
                <section className="flex w-1/2 bg-[#F5613B] p-2">
                    <div className="m-auto text-white font-sans">
                        <figure>
                            <img src={logo} alt="Logo" className="w-full"/>
                        </figure>
                    </div>
                </section>
                
                <section className="w-1/2 flex flex-col items-center justify-center">
                    <div className="w-full max-w-md p-8">
                        <Typography variant="h5" fontWeight="600" mb={1}>
                            Criar nova senha
                        </Typography>
                        <Typography variant="body2" color="textSecondary" mb={3}>
                            Digite e confirme sua nova senha de acesso.
                        </Typography>

                        <form onSubmit={handleSubmit(fetchConfirmarReset)}>
                            <TextField 
                                label="Nova Senha"
                                type="password"
                                fullWidth 
                                margin="normal" 
                                {...register("password", { 
                                    required: "A senha é obrigatória", 
                                    minLength: { value: 8, message: "A senha deve ter no mínimo 8 caracteres",  
                                     } 
                                })}
                                error={!!errors.password}
                                helperText={errors.password?.message}
                            />

                            <TextField 
                                label="Confirmar Nova Senha"
                                type="password"
                                fullWidth 
                                margin="normal" 
                                {...register("confirmPassword", { 
                                    required: "Confirme sua senha",
                                    validate: value => value === novaSenha || "As senhas não coincidem"
                                })}
                                error={!!errors.confirmPassword}
                                helperText={errors.confirmPassword?.message}
                            />

                            <Button 
                                className="mt-6" 
                                type="submit" 
                                fullWidth
                                disabled={loading}
                                sx={{ 
                                    backgroundColor: "#F5613B", 
                                    border: "2px solid #F76843", 
                                    borderRadius: "1rem" ,
                                    color: "#fff", 
                                    paddingY: "10px",
                                    '&:hover': { backgroundColor: "#f7562d" },
                                    '&.Mui-disabled': { backgroundColor: "#fca38d", color: "#ffffff90" }
                                }}
                            >
                                {loading ? 
                                (<CircularProgress size={24} color="inherit" /> 
                                ) : (
                                'Salvar Nova Senha'
                                )}
                            </Button>
                        </form>
                    </div>

                    <footer>
                        Lembrou a senha? <Link href="/" underline="hover">Voltar para o login</Link>
                    </footer>
                </section> 
            </div>

            {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}          
            
        </main>
    );
}