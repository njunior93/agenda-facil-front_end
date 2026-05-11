import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { use, useContext, useEffect } from "react";
import { Box, Typography, IconButton, Paper, TextField, MenuItem, Button } from "@mui/material";
import CalendarioCustom from '../../../shared/components/CalendarioCustom';
import SaveIcon from '@mui/icons-material/Save';
import { Controller, useForm } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import type { IAgendamentoInput } from '../interfaces/IAgendamentoInput';
import * as yup from "yup";
import { tiposServico, servicosPorTipo } from "../../../data/servicos";
import { useNavigate } from 'react-router-dom';
import axios from 'axios';
import React from 'react';
import alertaMensagem from '../../../shared/components/AlertaMensagem';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import { getErrorMessage } from '../../../shared/utils/getError';
import { AppContext } from "../../../shared/context/context";

const PaginaAgenda = () => {
    dayjs.locale('pt-br');

    const navigate = useNavigate();
    const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
    const {listaClientes, fetchListaClientes} = useContext(AppContext);
    const {listaAgendamentos,setListaAgendamentos} = useContext(AppContext);

    useEffect(() =>{
                if (!alerta) return;
            
                const timer = setTimeout(() => {
                    setAlerta(null);
                }, 3000);
            
                return () => clearTimeout(timer);
    }, [alerta]);

    useEffect(() => {
            if(listaClientes.length === 0){
                fetchListaClientes();
            }
    }, [])

    useEffect(() => {
        if(listaAgendamentos.length === 0){
                fetchListaAgendamento();
            }
    }, [])

    const schema = yup.object({
        tipoServico: yup.string().required("Campo obrigatorio"),
        servico: yup.string().required("Campo obrigatorio"),
        data: yup.string().required('Campo obrigatorio').matches(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido"),
        hora: yup.string().required('Campo obrigatorio'),
        cliente_id: yup.string().required('Campo obrigatorio')
    })

    const { register,handleSubmit,watch,reset,control,formState: { errors }} = useForm<IAgendamentoInput>({resolver: yupResolver(schema) as any});        

    const tipoSelecionado = watch("tipoServico");
    const servico = watch("servico");
    const data = watch("data");
    const hora = watch("hora");
    const cliente_id = watch("cliente_id");

    const formularioPreenchido = tipoSelecionado && servico && data && hora && cliente_id;

    const fetchGravarAgendamento = async (data: IAgendamentoInput) => {
        const token = localStorage.getItem("token");

        if(!token){
            navigate("/");
            return;
        }

        try{
            await axios.post("http://localhost:3000/agendamento/criar-agendamento",{
                tipoServico: data.tipoServico,
                servico: data.servico,
                data: data.data,
                hora: data.hora,
                cliente_id: data.cliente_id
            },
            {
                headers: {Authorization: `Bearer ${token}`}
            });

            setAlerta(alertaMensagem("Agendamento criado com sucesso!", "success", <ReportProblemIcon />));
            await fetchListaAgendamento();
            reset();
        }catch(error:any){
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon />));
        }
    }

    const fetchListaAgendamento = async () => {
        const token = localStorage.getItem("token");

        if(!token){
            navigate("/");
            return;
        }

        try{
            const response = await axios.get("http://localhost:3000/agendamento/listar-agendamentos",{
                headers: {Authorization: `Bearer ${token}`}
            });

            setListaAgendamentos(response.data);
        }catch(error:any){
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon />));
        }
    }

    return(
        <div className="w-full h-screen flex flex-col">
            <section>
                <div className="flex flex-col  items-center justify-center">
                    <Typography variant="h4" component="h1" fontWeight="bold" color="#707070">
                    <span className="underline decoration-pink-500">Gestão</span> de Agendamentos
                    </Typography>
                </div>
            </section>

            <section className="flex flex-col w-full justify-center items-center gap-3 p-2 flex-1 overflow-hidden">
                 
                <Paper  elevation={3} sx={{ width: '100%' , display: 'flex', flexDirection:'column', gap: 2, backgroundColor: '#1D2937', padding: '1rem' }}>
                    <Typography variant="h6"  sx={{fontSize: '1rem', backgroundColor: '#1D2937', width: '100%', padding: '0.5rem', color:'#ECECEC' }} gutterBottom  fontWeight="400">Preencha os dados</Typography>

                    <Typography variant="h3"  sx={{fontSize: '0.8rem', backgroundColor: '#1D2937', width: '100%', padding: '0.5rem', color:'#ECECEC' }} gutterBottom  fontWeight="400">Por favor, forneça as seguintes informações</Typography>

                    <form onSubmit={handleSubmit(fetchGravarAgendamento)}>
                        <Box display="flex" flexDirection='row' gap={1} justifyItems='center' flexWrap="nowrap">
                            <Controller
                                name="tipoServico"
                                control={control}
                                render={({ field }) => (
                                    <TextField
                                    select
                                    label="Tipo de serviço"
                                    {...field}
                                    sx={{
                                        backgroundColor: "#E3F2FD",
                                        borderRadius: 1,
                                        width: 180,
                                        maxWidth: 180,
                                        flexShrink: 0,
                                    }}
                                    error={!!errors.tipoServico}
                                    helperText={errors.tipoServico?.message}
                                    >
                                    {tiposServico.map((tipo) => (
                                        <MenuItem key={tipo} value={tipo}>
                                        {tipo}
                                        </MenuItem>
                                    ))}
                                    </TextField>
                                )}
                             />

                            <Controller
                                name="servico"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                    select
                                    label="Serviço"
                                    {...field}
                                    disabled={!tipoSelecionado}
                                    sx={{
                                        backgroundColor: "#E3F2FD",
                                        borderRadius: 1,
                                        width: 180,
                                        maxWidth: 180,
                                        flexShrink: 0,
                                    }}
                                    error={!!errors.servico}
                                    helperText={errors.servico?.message}
                                    >
                                    {(servicosPorTipo[tipoSelecionado] || []).map((servico) => (
                                        <MenuItem key={servico} value={servico}>
                                        {servico}
                                        </MenuItem>
                                    ))}
                                    </TextField>
                                )}
                            />

                            <Controller
                                name="cliente_id"
                                control={control}
                                defaultValue=""
                                render={({ field }) => (
                                    <TextField
                                    select
                                    label="Cliente"
                                    {...field}
                                    disabled={!tipoSelecionado}
                                    sx={{
                                        backgroundColor: "#E3F2FD",
                                        borderRadius: 1,
                                        width: 180,
                                        maxWidth: 180,
                                        flexShrink: 0,

                                        "& .MuiSelect-select": {
                                            whiteSpace: "nowrap",
                                            overflow: "hidden",
                                            textOverflow: "ellipsis"
                                        }
                                    }}
                                    error={!!errors.cliente_id}
                                    helperText={errors.cliente_id?.message}
                                    >
                                    {(listaClientes || []).map((cliente) => (
                                        <MenuItem key={cliente.id} value={cliente.id} title={cliente.nome}>
                                            {cliente.nome}
                                        </MenuItem>
                                    ))}
                                    </TextField>
                                )}
                            />

                            <Box display="flex" gap={2} flexWrap="nowrap">
                                <TextField
                                    type='date'
                                    disabled={!tipoSelecionado}
                                    {...register('data')}
                                    sx={{
                                        backgroundColor: "#E3F2FD",
                                        borderRadius: 1
                                    }}
                                    error={!!errors.data}
                                    helperText={errors.data?.message}
                                    fullWidth>
                                </TextField>
                            
                                <TextField
                                    type='time'
                                    {...register('hora')}
                                    disabled={!tipoSelecionado}
                                    fullWidth
                                    sx={{
                                        backgroundColor: "#E3F2FD", // azul claro
                                        borderRadius: 1
                                    }}
                                    error={!!errors.hora}
                                    helperText={errors.hora?.message}>
                                </TextField>
                            </Box>
                            
                            <Button disabled={!formularioPreenchido}  startIcon={<SaveIcon />} type='submit' sx={{backgroundColor: "rgb(53, 163, 20)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(32, 112, 8)",},}} variant="contained"></Button>

                        </Box>

                    </form>
                </Paper>    

                <Paper elevation={3} sx={{ width: '100%' ,  display:"flex", flexDirection: "column", p:2  ,backgroundColor: '#ECECEC'}}>
                    <CalendarioCustom/>
                </Paper>           
            </section>
                        
            {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
            
        </div>
    )
}

export default PaginaAgenda