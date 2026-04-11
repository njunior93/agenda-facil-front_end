import { Paper, Typography } from "@mui/material"
import { StaticDatePicker } from '@mui/x-date-pickers';
import dayjs  from 'dayjs';
import { LocalizationProvider } from '@mui/x-date-pickers';
import { AdapterDayjs } from '@mui/x-date-pickers/AdapterDayjs';

const PaginaAgenda = () => {

    dayjs.locale('pt-br');
    return(
        <div className="w-full h-screen flex flex-col">
            <section>
                <div className="flex flex-col  items-center justify-center">
                    <Typography variant="h4" component="h1" fontWeight="bold" color="#707070">
                    <span className="underline decoration-pink-500">Gestão</span> de Agendamentos
                    </Typography>
                </div>
            </section>

            <section className="flex flex-row justify-center items-center gap-3 p-2 flex-1 overflow-hidden">
                <Paper className="basis-2/3 flex-1" elevation={3} sx={{ height:'75%', display: 'flex', flexDirection:'column', backgroundColor: '#1D2937' }}>
                    <Typography variant="h6"  sx={{fontSize: '1rem', backgroundColor: '#1D2937', width: '100%', padding: '0.5rem', color:'#ECECEC' }} gutterBottom  fontWeight="400">Preencha os dados</Typography>

                    <Typography variant="h3"  sx={{fontSize: '0.8rem', backgroundColor: '#1D2937', width: '100%', padding: '0.5rem', color:'#ECECEC' }} gutterBottom  fontWeight="400">Por favor, forneça as seguintes informações</Typography>


                </Paper>
                <Paper className="basis-1/3 flex-1" elevation={3} sx={{ height:'75%',  backgroundColor: '#ECECEC', display:'flex' }}>
                <LocalizationProvider dateAdapter={AdapterDayjs} adapterLocale="pt-br">
                    <StaticDatePicker 
                        displayStaticWrapperAs="desktop"
                        slotProps={{
                            actionBar: {
                                actions: []
                            }
                        }}
                        sx={{width: '100%', height: '100%',flex: 1,'& .MuiPickersLayout-root': {height: '100%'},'& .MuiPickersCalendarHeader-root': {justifyContent: 'space-between'},'& .MuiDayCalendar-monthContainer': {height: '100%'},'& .MuiDayCalendar-weekContainer': {justifyContent: 'space-around'}}}/>
                </LocalizationProvider>
                

                </Paper>                
            </section>
        </div>
    )
}

export default PaginaAgenda