import { Button, List, ListItem, ListItemText, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import Stack from '@mui/material/Stack';
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import Modal from "../../../shared/modals/Modal";
import { AppContext } from "../../../shared/context/context";
import React, { useContext, useEffect } from "react";


const PaginaDashboard = () => {
    const {setAbrirModal} = useContext(AppContext);
    const {setTituloModal} = useContext(AppContext);
    const [qtdAgendamentos, setQtdAgendamentos] = React.useState(0);
    const [qtdFinalizados, setQtdFinalizados] = React.useState(0);
    const [qtdCancelados, setQtdCancelados] = React.useState(0);
    const {listaAgendamentos, fetchListaAgendamentos, fetchListaClientes} = useContext(AppContext);

    const abrirModalCliente = (mov: boolean) =>{
        setTituloModal('Cadastrar Cliente')
        setAbrirModal(mov);
    }

    const abrirModalAgendamento = (mov: boolean) =>{  
        setTituloModal('Cadastrar Agendamento')
        setAbrirModal(mov);

    }

    useEffect(() => {
        let agendamentos = 0;
        let finalizados = 0;
        let cancelados = 0;


        listaAgendamentos.forEach(agendamento => {
            if(agendamento.status === 'a'){
                agendamentos++;
            } else if(agendamento.status === 'f'){
                finalizados++;
            } else if(agendamento.status === 'c'){
                cancelados++;
            }
        });
        setQtdAgendamentos(agendamentos);
        setQtdFinalizados(finalizados);
        setQtdCancelados(cancelados);
    }, [listaAgendamentos]);

    useEffect(() =>{
        fetchListaClientes();
        fetchListaAgendamentos();
    }, []);

    return (
        <>
            <main className="h-screen">
                <section>
                    <div className="flex flex-col  items-center justify-center">
                        <Typography variant="h4" component="h1" fontWeight="bold" color="#707070">
                            <span className="underline decoration-pink-500">Dashboard</span> Sistema de Gerenciamento de Agenda
                         </Typography>
                        <div className="flex justify-center flex-row gap-8 mt-6">
                            <Paper elevation={3} sx={{ padding: '1rem', marginBottom: '1rem', width: '240px', height: '120px', backgroundColor: '#f59e0b' }}> 
                                <Typography variant="h6" fontWeight="600">Agendado</Typography><p className="text-black text-[#fff] text-ls font-bold">{qtdAgendamentos}</p>
                            </Paper>
                            <Paper elevation={3} sx={{ padding: '1rem', marginBottom: '1rem', width: '240px', height: '120px', backgroundColor: '#10b981' }}>
                                 <Typography variant="h6" fontWeight="600">Finalizado</Typography><p className="text-black text-[#fff] text-ls font-bold">{qtdFinalizados}</p>
                            </Paper>
                            <Paper elevation={3} sx={{ padding: '1rem', marginBottom: '1rem', width: '240px', height: '120px', backgroundColor: '#ef4444' }}>
                                <Typography variant="h6" fontWeight="600">Cancelado</Typography><p className="text-black text-[#fff] text-ls font-bold">{qtdCancelados}</p>
                            </Paper>
                        </div>
                    </div>
                </section>

                <section className="flex flex-row gap-3 p-2 align-items-stretch">
                    <Paper className="basis-2/3 flex flex-col" elevation={3} sx={{marginBottom: '1rem', width: '100%', height: '220px', backgroundColor: '#F8F9FA', justifyContent: 'stretch' }}>
                        <Typography variant="h6" sx={{fontSize: '1rem', backgroundColor: '#ECECEC', width: '100%', padding: '0.5rem', border: '1px solid #ddd' }} gutterBottom  fontWeight="400">Agendamentos recentes</Typography>

                        <List sx={{ width: '100%',bgcolor: 'background.paper', flex:1, overflow: 'auto' }}>
                            {listaAgendamentos.slice(0, 5).map((agendamento) => (
                                <ListItem key={agendamento.id} divider>
                                    <ListItemText primary={`Cliente: ${agendamento.cliente.nome}`} secondary={`Data: ${new Date(agendamento.data).toLocaleString()} - Status: ${agendamento.status === 'a' ? 'Agendado' : agendamento.status === 'f' ? 'Finalizado' : 'Cancelado'}`} />
                                </ListItem>
                            ))}
                        </List>
                    </Paper>
                    <Paper className="basis-1/3 flex flex-col" elevation={3} sx={{marginBottom: '1rem', width: '100%', height: '220px', backgroundColor: '#F8F9FA' }}>
                        <Typography variant="h6" sx={{fontSize: '1rem',  backgroundColor: '#ECECEC', width: '100%', padding: '0.5rem', border: '1px solid #ddd' }} gutterBottom fontWeight="400">Ações rapidas</Typography>

                        <Stack spacing={2} direction="column" sx={{ mt: 2, padding: 1 }}>
                            <Button variant="outlined" startIcon={<PersonIcon />} sx={{ color: "green" }} onClick={() => abrirModalCliente(true)}>Cadastrar Cliente</Button>
                            <Button variant="outlined" startIcon={<EventIcon />} sx={{ color: "blue" }} onClick={() => abrirModalAgendamento(true)}>Novo Agendamento</Button>
                        </Stack>

                    </Paper>
                </section>

                <Modal/>
            </main>
        </>
    )
}

export default PaginaDashboard;