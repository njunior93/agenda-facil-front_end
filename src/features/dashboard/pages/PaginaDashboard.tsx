import { Button, Typography } from "@mui/material";
import Paper from '@mui/material/Paper';
import { useNavigate } from "react-router-dom";
import Stack from '@mui/material/Stack';
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";



const PaginaDashboard = () => {
    const navigate = useNavigate();
    
    return (
        <>
            <main>
                <section>
                    <div className="flex flex-col  items-center justify-center">
                        <Typography variant="h4" fontWeight="bold" color="#707070">
                            <span className="underline decoration-pink-500">Dashboard</span> Sistema de Gerenciamento de Agenda
                         </Typography>
                        <div className="flex justify-center flex-row gap-8 mt-6">
                            <Paper elevation={3} sx={{ padding: '1rem', marginBottom: '1rem', width: '240px', height: '120px', backgroundColor: '#f59e0b' }}> 
                                <Typography variant="h6" fontWeight="600">Agendado</Typography><p className="text-black text-[#fff] text-ls font-bold">0</p>
                            </Paper>
                            <Paper elevation={3} sx={{ padding: '1rem', marginBottom: '1rem', width: '240px', height: '120px', backgroundColor: '#10b981' }}>
                                 <Typography variant="h6" fontWeight="600">Finalizado</Typography><p className="text-black text-[#fff] text-ls font-bold">0</p>
                            </Paper>
                            <Paper elevation={3} sx={{ padding: '1rem', marginBottom: '1rem', width: '240px', height: '120px', backgroundColor: '#ef4444' }}>
                                <Typography variant="h6" fontWeight="600">Cancelado</Typography><p className="text-black text-[#fff] text-ls font-bold">0</p>
                            </Paper>
                        </div>
                    </div>
                </section>
                <section className="flex flex-row gap-3">
                    <Paper className="basis-2/3" elevation={3} sx={{marginBottom: '1rem', width: '100%', height: '100px', backgroundColor: '#F8F9FA' }}>
                        <Typography variant="h6" sx={{fontSize: '1rem', backgroundColor: '#ECECEC', width: '100%', padding: '0.5rem', border: '1px solid #ddd' }} gutterBottom  fontWeight="400">Agendamentos recentes</Typography>
                    </Paper>
                    <Paper className="basis-1/3" elevation={3} sx={{marginBottom: '1rem', width: '100%', height: '200px', backgroundColor: '#F8F9FA' }}>
                        <Typography variant="h6" sx={{fontSize: '1rem',  backgroundColor: '#ECECEC', width: '100%', padding: '0.5rem', border: '1px solid #ddd' }} gutterBottom fontWeight="400">Ações rapidas</Typography>

                        <Stack spacing={2} direction="column" sx={{ mt: 2, padding: 1 }}>
                            <Button variant="outlined" startIcon={<PersonIcon />} sx={{ color: "green" }}>Cadastrar Cliente</Button>
                            <Button variant="outlined" startIcon={<EventIcon />} sx={{ color: "blue" }}>Novo Agendamento</Button>
                        </Stack>

                    </Paper>
                </section>
            </main>
        </>
    )
}

export default PaginaDashboard;