import * as React from 'react';
import {Box, CircularProgress, MenuItem, Modal, TextField} from '@mui/material';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import { AppContext } from '../context/context';
import * as yup from "yup";
import { yupResolver } from '@hookform/resolvers/yup';
import { Controller, set, useForm } from 'react-hook-form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import alertaMensagem from '../components/AlertaMensagem';
import ReportProblemIcon from '@mui/icons-material/ReportProblem';
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import { useContext, useEffect } from 'react';
import { getErrorMessage } from '../utils/getError';
import type { IClienteInput } from '../interfaces/IClienteInput';
import type { IAgendamentoInput } from '../../features/agendamentos/interfaces/IAgendamentoInput';
import { tiposServico, servicosPorTipo } from "../../data/servicos";
import type { IAgendamentoUpdate } from '../../features/agendamentos/interfaces/IAgendamentoUpdate';


const ModalComponent = () => {
    const {abrirModal, setAbrirModal} = useContext(AppContext);
    const {tituloModal, setTituloModal} = useContext(AppContext)
    const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
    const navigate = useNavigate();
    const {clienteLocalizado, setClienteLocalizado} = useContext(AppContext);
    const {agendamentoLocalizado, setAgendamentoLocalizado} = useContext(AppContext);
    const {fetchListaAgendamentos} = useContext(AppContext);
    const {fetchListaClientes, listaClientes} = useContext(AppContext);
    const [loading, setLoading] = React.useState(false);

    useEffect(() =>{
            if (!alerta) return;
    
            const timer = setTimeout(() => {
                setAlerta(null);
            }, 3000);
    
            return () => clearTimeout(timer);
    }, [alerta]);

    useEffect(() =>{
        if(tituloModal === 'Editar Cliente' && clienteLocalizado){
            resetCliente({
                nome: clienteLocalizado.nome || '' ,
                email: clienteLocalizado.email || '',
                telefone: formatarFoneCel(clienteLocalizado.telefone) || '',
                celular: formatarFoneCel(clienteLocalizado.celular) || ''
            });
        }
    }, [tituloModal, clienteLocalizado]);

    useEffect(() =>{
        if(tituloModal === 'Cadastrar Cliente'){
            resetCliente({
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

    const schemaCliente = yup.object({
        nome: yup.string().required("O nome é obrigatório"),
        email: yup.string().email("Email inválido").required("O email é obrigatório"),
        telefone: yup.string().test("telefone-valido", "Formato: (99) 9999-9999", (value) => {if (!value) return true; return /^\(\d{2}\)\s\d{4}-\d{4}$/.test(value)}).optional(),
        celular: yup.string().test("celular-valido", "Formato: (99) 99999-9999", (value) => {if (!value) return true; return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(value)}).required("O celular é obrigatório"),
    })

    const schemaAgendamento = yup.object({
        tipoServico: yup.string().required("Campo obrigatorio"),
        servico: yup.string().required("Campo obrigatorio"),
        data: yup.string().required('Campo obrigatorio').matches(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido"),
        hora: yup.string().required('Campo obrigatorio'),
        cliente_id: yup.string().required('Campo obrigatorio')
    })

  
    const {register: registerCliente, handleSubmit: handleSubmitCliente,reset: resetCliente, watch: watchCliente,formState: {errors: errorsCliente}} = useForm<IClienteInput>({resolver: yupResolver(schemaCliente)} as any);
    const {register: registerAgendamento, handleSubmit: handleSubmitAgendamento,reset: resetAgendamento, control: controlAgendamento, watch: watchAgendamento,formState: {errors: errorsAgendamento}} = useForm<IAgendamentoInput>({resolver: yupResolver(schemaAgendamento)} as any);


    const tipoSelecionado = watchAgendamento("tipoServico");


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
        resetCliente();
        resetAgendamento();
        setAbrirModal(false);
        setTituloModal('');
        setClienteLocalizado(null);
        setAgendamentoLocalizado(null);
    }

    const fetchCriarCliente = async (data: IClienteInput) => {
        const token = localStorage.getItem("token");

        if(!token) {
            navigate("/");
        }

        setLoading(true);

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

            await fetchListaClientes();
            
            resetCliente();
            setLoading(false)
            setAbrirModal(false);  
            setTituloModal('');      
            setAlerta(alertaMensagem("Cliente cadastrado com sucesso!", "success", <ReportProblemIcon/>));            
        }catch(error:any){
            setLoading(false);
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
        }
    }

    const fetchEditarCliente = async (data: IClienteInput) =>{
        const token = localStorage.getItem("token");

        if(!token) {
            navigate("/");
        }

        setLoading(true);

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

            await fetchListaClientes();
            
            resetCliente();
            setLoading(false)
            setAbrirModal(false);
            setTituloModal('')
            setClienteLocalizado(null);
            setAlerta(alertaMensagem("Cliente atualizado com sucesso!", "success", <ReportProblemIcon/>));
        }catch(error: any){
            setLoading(false);
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
        }
    }

    const fetchExcluirCliente = async (clienteId: string | undefined) =>{
        const token = localStorage.getItem("token");

        if(!token) {
            navigate("/");
            return;
        }

        setLoading(true);

        try{

            await axios.delete(`http://localhost:3000/cliente/excluir-cliente/${clienteId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            });

            await fetchListaClientes();

            resetCliente();
            setLoading(false)
            setAbrirModal(false);
            setTituloModal('')
            setClienteLocalizado(null);           
            setAlerta(alertaMensagem("Cliente excluido com sucesso!", "success", <CheckCircleIcon/>));
        }catch(error: any){
            setLoading(false);
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
        }
    }

    const fetchCriarAgendamento = async (data: IAgendamentoInput) => {
            const token = localStorage.getItem("token");
    
            if(!token){
                navigate("/");
                return;
            }

            setLoading(true);
    
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

                await fetchListaAgendamentos();
    
                setAlerta(alertaMensagem("Agendamento criado com sucesso!", "success", <ReportProblemIcon />));
                resetAgendamento();
                setLoading(false)
                setAbrirModal(false);  
                setTituloModal('');
                resetAgendamento();
            }catch(error:any){
                setLoading(false);
                const mensagemErro = getErrorMessage(error);
                setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon />));
            }
    }

    const fetchEditarAgendamento = async (data: IAgendamentoUpdate) =>{
        const token = localStorage.getItem("token");

        if(!token) {
            navigate("/");
        }

        setLoading(true)

        try{
            await axios.patch(`http://localhost:3000/agendamento/editar-agendamento/${agendamentoLocalizado?.id}`,{
                status: data.status
            },
            {
                headers: {Authorization: `Bearer ${token}`}
            });

            await fetchListaAgendamentos();

            resetAgendamento();
            setLoading(false)
            setAbrirModal(false);
            setTituloModal('')
            setAgendamentoLocalizado(null);          
            setAlerta(alertaMensagem("Agendamento atualizado com sucesso!", "success", <CheckCircleIcon/>));
        }catch(error: any){
            setLoading(false);
            const mensagemErro = getErrorMessage(error);
            setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon/>));
        }
    }

    const fetchExcluirAgendamento = async (agendamentoId: string | undefined)=>{
        const token = localStorage.getItem("token");

        if(!token) {
            navigate("/");
            return;
         }

         setLoading(true);

        try{

            await axios.delete(`http://localhost:3000/agendamento/excluir-agendamento/${agendamentoId}`,
            {
                headers: {Authorization: `Bearer ${token}`}
            });

            await fetchListaAgendamentos();
            await fetchListaClientes();

            resetAgendamento();
            setLoading(false)
            setAbrirModal(false);
            setTituloModal('')
            setAgendamentoLocalizado(null);           
            setAlerta(alertaMensagem("Agendamento excluido com sucesso!", "success", <CheckCircleIcon/>));
        }catch(error: any){
            setLoading(false);
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
                        <form onSubmit={handleSubmitCliente(fetchEditarCliente)}>
                            <TextField
                                label="Nome"
                                {...registerCliente("nome")}
                                error={!!errorsCliente.nome}
                                helperText={errorsCliente.nome?.message}
                                fullWidth
                            />

                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Email"
                                {...registerCliente("email")}
                                error={!!errorsCliente.email}
                                helperText={errorsCliente.email?.message}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Telefone"
                                placeholder='(99) 9999-9999'
                                {...registerCliente("telefone")}
                                error={!!errorsCliente.telefone}
                                helperText={errorsCliente.telefone?.message}
                                onChange={(e) =>{
                                    e.target.value = formatarFoneCel(e.target.value);
                                }}
                            />

                        <TextField
                                label="Celular"
                                placeholder='(99) 99999-9999'
                                {...registerCliente("celular")}
                                error={!!errorsCliente.celular}
                                helperText={errorsCliente.celular?.message}
                                onChange={(e) =>{
                                    e.target.value = formatarFoneCel(e.target.value);
                                }}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Button disabled={loading} type="submit" sx={{backgroundColor: "rgb(53, 163, 20)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(32, 112, 8)"},'&.Mui-disabled': { backgroundColor: "#c5f5ac", color: "#ffffff90" }}}>
                                {loading ? 
                                (<CircularProgress size={28} color="inherit" /> 
                                ) : (
                                    'Gravar'
                                )}
                            </Button>
                            <Button  disabled={loading} onClick={() => sairModal()} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "#fc9208ff"}, '&.Mui-disabled': { backgroundColor: "#f3d399", color: "#ffffff90" }}}>
                                {loading ? 
                                (<CircularProgress size={28} color="inherit" /> 
                                ) : (
                                    'Sair'
                                )}
                            </Button>
                            <Button disabled={loading} onClick={() => { if (clienteLocalizado) fetchExcluirCliente(clienteLocalizado.id) }} sx={{backgroundColor: "rgb(241, 40, 26)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(255, 0, 0)"}, '&.Mui-disabled': { backgroundColor: "#f1aaaa", color: "#ffffff90" }}}>
                                {loading ? 
                                (<CircularProgress size={28} color="inherit" /> 
                                ) : (
                                    'Excluir'
                                )}
                            </Button>
                        </Box>
                        </form>
                    )}

                    {tituloModal === 'Cadastrar Cliente' && (
                        <form onSubmit={handleSubmitCliente(fetchCriarCliente)}>
                            <TextField
                                label="Nome"
                                {...registerCliente("nome")}
                                error={!!errorsCliente.nome}
                                helperText={errorsCliente.nome?.message}
                                fullWidth
                            />

                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Email"
                                {...registerCliente("email")}
                                error={!!errorsCliente.email}
                                helperText={errorsCliente.email?.message}
                                fullWidth
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <TextField
                                label="Telefone"
                                placeholder='(99) 9999-9999'
                                {...registerCliente("telefone")}
                                error={!!errorsCliente.telefone}
                                helperText={errorsCliente.telefone?.message}
                                onChange={(e) =>{
                                    e.target.value = formatarFoneCel(e.target.value);
                                }}
                            />

                        <TextField
                                label="Celular"
                                placeholder='(99) 99999-9999'
                                {...registerCliente("celular")}
                                error={!!errorsCliente.celular}
                                helperText={errorsCliente.celular?.message}
                                onChange={(e) =>{
                                    e.target.value = formatarFoneCel(e.target.value);
                                }}
                            />
                        </Box>
                        <Box sx={{ mt: 2 }}>
                            <Button disabled={loading}  type="submit" sx={{backgroundColor: "rgb(53, 163, 20)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(32, 112, 8)"}, '&.Mui-disabled': { backgroundColor: "#8bee55", color: "#ffffff90" }}}>
                                 {loading ? 
                                (<CircularProgress size={28} color="inherit" /> 
                                ) : (
                                    'Gravar'
                                )}
                            </Button>
                            <Button disabled={loading} onClick={() => sairModal()} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "#fc9208ff"}, '&.Mui-disabled': { backgroundColor: "#f3d399", color: "#ffffff90" }}}>
                                {loading ? 
                                (<CircularProgress size={28} color="inherit" /> 
                                ) : (
                                    'Sair'
                                )}
                            </Button>
                        </Box>
                        </form>
                    )}

                    {tituloModal === 'Cadastrar Agendamento' && (
                        <form className='flex flex-col gap-2' onSubmit={handleSubmitAgendamento(fetchCriarAgendamento)}>
                            <Controller
                                name="tipoServico"
                                    control={controlAgendamento}
                                    render={({ field }) => (
                                        <TextField
                                            select
                                            fullWidth
                                            label="Tipo de serviço"
                                            {...field}
                                            sx={{
                                                backgroundColor: "#E2E0E0",
                                                borderRadius: 1,
                                                flexShrink: 0,
                                                }}
                                                error={!!errorsAgendamento.tipoServico}
                                                helperText={errorsAgendamento.tipoServico?.message}
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
                                    control={controlAgendamento}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                        select
                                        fullWidth
                                        label="Serviço"
                                        {...field}
                                        disabled={!tipoSelecionado}
                                        sx={{
                                            backgroundColor: "#E2E0E0",
                                            borderRadius: 1,
                                            flexShrink: 0,
                                        }}
                                        error={!!errorsAgendamento.servico}
                                        helperText={errorsAgendamento.servico?.message}
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
                                    control={controlAgendamento}
                                    defaultValue=""
                                    render={({ field }) => (
                                        <TextField
                                        fullWidth
                                        select
                                        label="Cliente"
                                        {...field}
                                        disabled={!tipoSelecionado}
                                        sx={{
                                            backgroundColor: "#E2E0E0",
                                            borderRadius: 1,
                                            flexShrink: 0,

                                            "& .MuiSelect-select": {
                                                whiteSpace: "nowrap",
                                                overflow: "hidden",
                                                textOverflow: "ellipsis"
                                            }
                                        }}
                                        error={!!errorsAgendamento.cliente_id}
                                        helperText={errorsAgendamento.cliente_id?.message}
                                        >

                                        {listaClientes?.length === 0 && (
                                            <MenuItem value="" disabled>
                                                Nenhum cliente cadastrado
                                            </MenuItem>
                                        )}

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
                                    {...registerAgendamento('data')}
                                    sx={{
                                         backgroundColor: "#E2E0E0",
                                         borderRadius: 1
                                    }}
                                    error={!!errorsAgendamento.data}
                                    helperText={errorsAgendamento.data?.message}
                                    fullWidth>
                                </TextField>
                                                            
                                <TextField
                                    type='time'
                                    {...registerAgendamento('hora')}
                                    disabled={!tipoSelecionado}
                                    fullWidth
                                    sx={{
                                         backgroundColor: "#E2E0E0",
                                         borderRadius: 1
                                    }}
                                    error={!!errorsAgendamento.hora}
                                    helperText={errorsAgendamento.hora?.message}>
                                </TextField>
                            </Box>

                        <Box sx={{ mt: 2 }}>
                            <Button disabled={loading}type="submit" sx={{backgroundColor: "rgb(53, 163, 20)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(32, 112, 8)"}, '&.Mui-disabled': { backgroundColor: "#8bee55", color: "#ffffff90" }}}>
                               {loading ? 
                                (<CircularProgress size={28} color="inherit" /> 
                                ) : (
                                    'Gravar'
                                )}
                            </Button>
                            <Button disabled={loading} onClick={() => sairModal()} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "#fc9208ff"}, '&.Mui-disabled': { backgroundColor: "#f3d399", color: "#ffffff90" }}}>
                                {loading ? 
                                (<CircularProgress size={28} color="inherit" /> 
                                ) : (
                                    'Sair'
                                )}
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
                                {agendamentoLocalizado.status === 'a' && (
                                    <>
                                        <Button onClick={() => {fetchEditarAgendamento({ status: 'f' });}} sx={{backgroundColor: "rgb(53, 163, 20)", color: "#fff", fontWeight: "bold", borderRadius: "20px", border: "2px solid #ffffffff", paddingX: 3, "&:hover": {backgroundColor: "rgb(32, 112, 8)"}, '&.Mui-disabled': { backgroundColor: "#c5f5ac", color: "#ffffff90" }}}>
                                             {loading ? 
                                                (<CircularProgress size={28} color="inherit" /> 
                                                ) : (
                                                    'Finalizar'
                                                )}
                                        </Button>

                                        <Button  onClick={() => {fetchEditarAgendamento({ status: 'c' });}} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px", border: "2px solid #ffffffff", paddingX: 3, "&:hover": {backgroundColor: "#fc9208ff"}, '&.Mui-disabled': { backgroundColor: "#f5deac", color: "#ffffff90" }}}>
                                            {loading ? 
                                                (<CircularProgress size={28} color="inherit" /> 
                                                ) : (
                                                    'Cancelar'
                                            )}
                                        </Button>
                                    </>
                                )}
                                {agendamentoLocalizado.status === 'c' && (
                                    <Button disabled={loading} onClick={() => {fetchExcluirAgendamento(agendamentoLocalizado.id)}} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px", border: "2px solid #ffffffff", paddingX: 3, "&:hover": {backgroundColor: "#fc9208ff"}, '&.Mui-disabled': { backgroundColor: "#f5deac", color: "#ffffff90" }}}>
                                        {loading ? 
                                            (<CircularProgress size={28} color="inherit" /> 
                                            ) : (
                                                    'Excluir'
                                        )}
                                    </Button>
                                )}
                                <Button disabled={loading} onClick={() => sairModal()} sx={{backgroundColor: "rgb(87, 84, 82)", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "rgb(27, 27, 27)"}, '&.Mui-disabled': { backgroundColor: "#9c9c9c", color: "#ffffff90" }}}>
                                    {loading ? 
                                            (<CircularProgress size={28} color="inherit" /> 
                                            ) : (
                                                    'Sair'
                                        )}
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
