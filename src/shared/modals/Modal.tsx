import * as React from 'react';
import {Box, Modal, TextField} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AppContext } from '../context/context';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import alertaMensagem from '../components/AlertaMensagem';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useContext, useEffect } from 'react';
import { getErrorMessage } from '../utils/getError';
import type { IClienteInput } from '../interfaces/IClienteInput';
import type { IAgendamentoUpdate } from '../../features/agendamentos/interfaces/IAgendamentoUpdate';


const ModalComponent = () => {
    const {abrirModal, setAbrirModal} = useContext(AppContext);
    const {tituloModal, setTituloModal} = useContext(AppContext)
    const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
    const navigate = useNavigate();
    const {clienteLocalizado} = useContext(AppContext);
    const {agendamentoLocalizado} = useContext(AppContext);
    const {fetchListaAgendamentos} = useContext(AppContext);

    useEffect(() =>{
            if (!alerta) return;
    
            const timer = setTimeout(() => {
                setAlerta(null);
            }, 3000);
    
            return () => clearTimeout(timer);
    }, [alerta]);

    useEffect(() =>{
        fetchListaAgendamentos();
    }, []);

    useEffect(() =>{
        if(tituloModal === 'Editar Cliente' && clienteLocalizado){
            reset({
                nome: clienteLocalizado.nome || '' ,
                email: clienteLocalizado.email || '',
                telefone: formatarFoneCel(clienteLocalizado.telefone) || '',
                celular: formatarFoneCel(clienteLocalizado.celular) || ''
            });
        }
    }, [tituloModal, clienteLocalizado]);

    useEffect(() =>{
        if(tituloModal === 'Cadastrar Cliente'){
            reset({
                nome: '' ,
                email: '',
                telefone:'',
                celular: ''
            });
        }
    }, [tituloModal, clienteLocalizado]);

    const style = {
        position: 'absolute',
        top: '50%',
        left: '50%',
        transform: 'translate(-50%, -50%)',
        bgcolor: '#e2e0e0',
        border: '2px solid #000',
        boxShadow: 24,
        p: 4,
        borderRadius: 2,
    }

    const schema = yup.object({
        nome: yup.string().required("O nome é obrigatório"),
        email: yup.string().email("Email inválido").required("O email é obrigatório"),
        telefone: yup.string().test("telefone-valido", "Formato: (99) 9999-9999", (value) => {if (!value) return true; return /^\(\d{2}\)\s\d{4}-\d{4}$/.test(value)}).optional(),
        celular: yup.string().test("celular-valido", "Formato: (99) 99999-9999", (value) => {if (!value) return true; return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(value)}).required("O celular é obrigatório"),
    })

    const {register, handleSubmit,reset, formState: {errors}} = useForm<IClienteInput>({resolver: yupResolver(schema)} as any);

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

    const sairModal = () =>{
        reset();
        setAbrirModal(false);
        setTituloModal('')
    }

    const fetchCriarCliente = async (data: IClienteInput) => {
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
            
            reset();
            setAbrirModal(false);  
            setTituloModal('')         
            setAlerta(alertaMensagem("Cliente cadastrado com sucesso!", "success", <ReportProblemIcon/>));            
        }catch(error:any){
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
        }
    }

    const fetchEditarCliente = async (data: IClienteInput) =>{
        const token = localStorage.getItem("token");

        if(!token) {
            navigate("/");
        }

        try{
            await axios.patch(`http://localhost:3000/cliente/editar-cliente/${clienteLocalizado?.id}`,{
                nome: data.nome,
                email: data.email,
                telefone: data.telefone,
                celular: data.celular
            },
            {
                headers: {Authorization: `Bearer ${token}`}
            });

            reset();
            setAbrirModal(false);
            setTituloModal('')           
            setAlerta(alertaMensagem("Cliente atualizado com sucesso!", "success", <ReportProblemIcon/>));
        }catch(error: any){
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
        }
    }

    const fetchEditarAgendamento = async (data: IAgendamentoUpdate) =>{
        const token = localStorage.getItem("token");

        if(!token) {
            navigate("/");
        }

        try{
            await axios.patch(`http://localhost:3000/agendamento/editar-agendamento/${agendamentoLocalizado?.id}`,{
                status: data.status
            },
            {
                headers: {Authorization: `Bearer ${token}`}
            });

            await fetchListaAgendamentos();

            reset();
            setAbrirModal(false);
            setTituloModal('')           
            setAlerta(alertaMensagem("Agendamento atualizado com sucesso!", "success", <CheckCircleIcon/>));
        }catch(error: any){
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
        }
    }

    return (
        <>
         <Modal open={abrirModal} onClose={(_event: object,reason) => reason != 'backdropClick' && setAbrirModal(false)}>
                <Box sx={style}>
                    <Typography variant="h6" component="h2">{tituloModal}</Typography>

                    {tituloModal === 'Editar Cliente' && (
                        <form onSubmit={handleSubmit(fetchEditarCliente)}>
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
                        <Box sx={{ mt: 2 }}>
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
                        <Box sx={{ mt: 2 }}>
                            <Button type="submit" sx={{backgroundColor: "rgb(53, 163, 20)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(32, 112, 8)",},}}>
                                Gravar
                            </Button>
                            <Button  onClick={() => sairModal()} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "#fc9208ff",},}}>
                                Sair
                            </Button>
                        </Box>
                        </form>
                    )}

                    {tituloModal === 'Cadastrar Cliente' && (
                        <form onSubmit={handleSubmit(fetchCriarCliente)}>
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
                        <Box sx={{ mt: 2 }}>
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
                        <Box sx={{ mt: 2 }}>
                            <Button type="submit" sx={{backgroundColor: "rgb(53, 163, 20)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(32, 112, 8)",},}}>
                                Gravar
                            </Button>
                            <Button  onClick={() => sairModal()} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "#fc9208ff",},}}>
                                Sair
                            </Button>
                        </Box>
                        </form>
                    )}
                    
                    {tituloModal === 'Editar Agendamento' && agendamentoLocalizado && (
                        <Box sx={{ mt: 2 }}>
                            <Box sx={{ mb: 2, p: 2, backgroundColor: '#f5f5f5', borderRadius: 1 }}>
                                <Typography variant="body1"><strong>Cliente:</strong> {agendamentoLocalizado.cliente?.nome}</Typography>
                                <Typography variant="body2"><strong>Serviço:</strong> {agendamentoLocalizado.servico}</Typography>
                                <Typography variant="body2"><strong>Status:</strong> {agendamentoLocalizado.status === 'a' ? 'Agendado' : agendamentoLocalizado.status === 'f' ? 'Finalizado' : 'Cancelado'}</Typography>
                            </Box>
                            <Box sx={{ display: 'flex', gap: 1, justifyContent: 'flex-end', mt: 2 }}>
                                <Button onClick={() => {fetchEditarAgendamento({ status: 'f' });}} sx={{backgroundColor: "rgb(53, 163, 20)", color: "#fff", fontWeight: "bold", borderRadius: "20px", border: "2px solid #ffffffff", paddingX: 3, "&:hover": {backgroundColor: "rgb(32, 112, 8)"}}}>
                                    Finalizar
                                </Button>
                                <Button  onClick={() => {fetchEditarAgendamento({ status: 'c' });}} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px", border: "2px solid #ffffffff", paddingX: 3, "&:hover": {backgroundColor: "#fc9208ff"}}}>
                                    Cancelar
                                </Button>
                                <Button  onClick={() => sairModal()} sx={{backgroundColor: "rgb(87, 84, 82)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(27, 27, 27)",},}}>
                                    Sair
                                </Button>
                            </Box>
                        </Box>
                    )}

                </Box>
         </Modal>

         {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
        </>
       

    );
};

export default ModalComponent;