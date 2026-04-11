import { Box, Button, List, ListItem, ListItemAvatar, ListItemText, Paper, Stack, TextField, Typography } from "@mui/material"
import Avatar from '@mui/material/Avatar';
import Modal from "../../../shared/modals/Modal";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import alertaMensagem from "../../../shared/components/AlertaMensagem";
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { getErrorMessage } from "../../../shared/utils/getError";
import { AppContext } from "../../../shared/context/context";
import type { IClienteInput } from "../../../shared/interfaces/IClienteInput";
import type { IClienteOutput } from "../interfaces/IClienteOutput";

const PaginaClientes = () => {
    const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
    const {listaClientes, setListaClientes} = useContext(AppContext);
    const {setTituloModal} = useContext(AppContext);
    const {setAbrirModal} = useContext(AppContext);
    const navigate = useNavigate();
    const {clienteLocalizado, setClienteLocalizado} = useContext(AppContext);

    useEffect(() =>{
            if (!alerta) return;
        
            const timer = setTimeout(() => {
                setAlerta(null);
            }, 3000);
        
            return () => clearTimeout(timer);
    }, [alerta]);

    useEffect(() => {
        fetchListaClientes();
    }, [listaClientes])

    const style = {
        width: '100%',
        height: '100%',
        padding: '1rem',
    }

   const schema = yup.object({
           nome: yup.string().required("O nome é obrigatório"),
           email: yup.string().email("Email inválido").required("O email é obrigatório"),
           telefone: yup.string().test("telefone-valido", "Formato: (99) 9999-9999", (value) => {if (!value) return true; return /^\(\d{2}\)\s\d{4}-\d{4}$/.test(value)}).optional(),
           celular: yup.string().test("celular-valido", "Formato: (99) 99999-9999", (value) => {if (!value) return true; return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(value)}).required("O celular é obrigatório"),
       })

    const {register, handleSubmit,reset, formState: {errors}} = useForm<IClienteInput>({resolver: yupResolver(schema) as any});

    const formatarFoneCel = (numero: string) => {
            let valor = numero.replace(/\D/g, "");
    
            if (valor.length <= 10) {
                return valor
                .replace(/^(\d{2})(\d)/g, "($1) $2")
                .replace(/(\d{4})(\d)/, "$1-$2");
            } else {
                return valor
                .replace(/^(\d{2})(\d)/g, "($1) $2")
                .replace(/(\d{5})(\d)/, "$1-$2");
            }
    }
    
    const limparFormCliente = () =>{
            reset();
    }
    
    const fetchGravarCliente = async (data: IClienteInput) => {
            const token = localStorage.getItem("token");
    
            if(!token) {
                navigate("/");
            }
    
            try{
                 await axios.post("http://localhost:3000/cliente/criar-cliente",{
                    nome: data.nome,
                    email: data.email,
                    telefone: data.telefone,
                    celular: data.celular
                },
                {
                    headers: {Authorization: `Bearer ${token}`}
                });
    
                setAlerta(alertaMensagem("Cliente cadastrado com sucesso!", "success", <ReportProblemIcon/>));
                reset();
    
            }catch(error:any){
                const mensagemErro = getErrorMessage(error);
                setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
            }
    }

    const fetchListaClientes = async () => {
        const token = localStorage.getItem("token");

        try{
            const response = await axios.get("http://localhost:3000/cliente/listar-clientes", {
                headers: {Authorization: `Bearer ${token}`}
            });

            setListaClientes(response.data);

        }catch(error:any){
                const mensagemErro = getErrorMessage(error);
                setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
            }
    }

    const fetchLocalizarCliente = async (id: string) => {
        const token = localStorage.getItem("token");

        setAbrirModal(true)
        setTituloModal('Editar Cliente')

        try{
            const response = await axios.get(`http://localhost:3000/cliente/localizar-cliente/${id}`, {
                headers: {Authorization: `Bearer ${token}`}
            });

        setClienteLocalizado(response.data);

        }catch(error:any){
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
        }
    }
    
    return (
    <>
            <div className="w-full h-screen flex flex-col">
                <section>
                    <div className="flex flex-col  items-center justify-center">
                        <Typography variant="h4" component="h1" fontWeight="bold" color="#707070">
                            <span className="underline decoration-pink-500">Gestão</span> de Clientes
                         </Typography>
                    </div>
                </section>

                <section className="flex flex-row justify-center items-center gap-3 p-2 flex-1 overflow-hidden">
                    <Paper className="basis-2/3 flex-1" elevation={3} sx={{ height:'75%', display: 'flex', flexDirection:'column', backgroundColor: '#F8F9FA' }}>
                        <Typography variant="h6" sx={{fontSize: '1rem', backgroundColor: '#ECECEC', width: '100%', padding: '0.5rem', border: '1px solid #ddd' }} gutterBottom  fontWeight="400">Formulário de Cadastro</Typography>

                        <form style={style} onSubmit={handleSubmit(fetchGravarCliente)}>
                                                    <TextField
                                                        label="Nome"
                                                        {...register("nome")}
                                                        error={!!errors.nome}
                                                        helperText={errors.nome?.message}
                                                        fullWidth
                                                    />
                        
                                                <Box sx={{ mt: 2 }}>
                                                    <TextField
                                                        label="Email"
                                                        {...register("email")}
                                                        error={!!errors.email}
                                                        helperText={errors.email?.message}
                                                        fullWidth
                                                    />
                                                </Box>
                                                <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                                    <TextField
                                                        label="Telefone"
                                                        placeholder='(99) 9999-9999'
                                                        {...register("telefone")}
                                                        error={!!errors.telefone}
                                                        helperText={errors.telefone?.message}
                                                        onChange={(e) =>{
                                                            e.target.value = formatarFoneCel(e.target.value);
                                                        }}
                                                    />
                        
                                                <TextField
                                                        label="Celular"
                                                        placeholder='(99) 99999-9999'
                                                        {...register("celular")}
                                                        error={!!errors.celular}
                                                        helperText={errors.celular?.message}
                                                        onChange={(e) =>{
                                                            e.target.value = formatarFoneCel(e.target.value);
                                                        }}
                                                    />
                                                </Box>
                                                <Box sx={{ mt: 2, display: 'flex', gap: 2, justifyContent: 'center' }}>
                                                    <Button type="submit" sx={{backgroundColor: "rgb(53, 163, 20)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(32, 112, 8)",},}}>
                                                        Gravar
                                                    </Button>
                                                    <Button  onClick={() => limparFormCliente()} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "#fc9208ff",},}}>
                                                        Limpar
                                                    </Button>
                                                </Box>
                        </form>
                    </Paper>
                    <Paper className="basis-1/3 flex-1" elevation={3} sx={{height: '75%', display: 'flex', flexDirection: 'column', backgroundColor: '#F8F9FA' }}>
                        <Typography variant="h6" sx={{fontSize: '1rem',  backgroundColor: '#ECECEC', width: '100%', padding: '0.5rem', border: '1px solid #ddd' }} gutterBottom fontWeight="400">Clientes</Typography>

                        <TextField 
                            size="small" 
                            placeholder="Buscar cliente"
                            fullWidth
                            sx={{p:1}}/>

                        <List sx={{width: '100%',  bgcolor: 'background.paper', flex: 1, overflow: 'auto' }}>
                            {listaClientes?.length === 0 && (
                                <Typography sx={{ p: 2, textAlign: "center", color: "#999" }}>
                                    Nenhum cliente cadastrado.
                                </Typography>
                            )}
                            
                            {listaClientes?.map((cliente: IClienteOutput) => (
                                <ListItem key={cliente.id} onClick={() => fetchLocalizarCliente(cliente.id)} divider sx={{cursor: "pointer","&:hover": {backgroundColor: "#f5f5f5"}}}>
                                    <ListItemAvatar>
                                        <Avatar sx={{bgcolor: '#1976d2'}}>
                                            {cliente.nome.charAt(0).toUpperCase()}
                                        </Avatar>
                                    </ListItemAvatar>
                                    <ListItemText 
                                        primary={cliente.nome} 
                                        secondary={`${cliente.celular || ""} ${cliente.email ? "• " + cliente.email : ""}`}/>
                                </ListItem>
                            ))}
                        </List>

                    </Paper>
                </section>

                <Modal/>
            </div>

            {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
            
        </>
    )
}

export default PaginaClientes
