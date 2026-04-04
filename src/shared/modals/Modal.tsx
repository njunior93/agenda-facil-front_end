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
import { useEffect } from 'react';


const ModalComponent = () => {
    const {modalCliente, setAbrirModalCliente} = React.useContext(AppContext);
    const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
    const navigate = useNavigate();

    useEffect(() =>{
            if (!alerta) return;
    
            const timer = setTimeout(() => {
                setAlerta(null);
            }, 3000);
    
            return () => clearTimeout(timer);
        }, [alerta]);

    const syle = {
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
        email: yup.string().email("Email inválido"),
        telefone: yup.string().test("telefone-valido", "Formato: (99) 9999-9999", (value) => {if (!value) return true; return /^\(\d{2}\)\s\d{4}-\d{4}$/.test(value)}),
        celular: yup.string().test("celular-valido", "Formato: (99) 99999-9999", (value) => {if (!value) return true; return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(value)}),
    })

    const {register, handleSubmit,reset, formState: {errors}} = useForm({resolver: yupResolver(schema)});

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

    const cancelarCliente = () =>{
        reset();
        setAbrirModalCliente(false);
    }

    const fetchGravarCliente = async (data: any) => {
        const token = localStorage.getItem("token");

        if(!token) {
            navigate("/");
            return;
        }

        try{
             await axios.post("http://localhost:3000/cliente/gravar-cliente",{
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
            setAbrirModalCliente(false);

        }catch(error:any){
            if(error.response){
                setAlerta(alertaMensagem(error.response.data.message, "error", <ReportProblemIcon/>))
            }else{
                setAlerta(alertaMensagem("Ocorreu um erro ao gravar", "error", <ReportProblemIcon/>))
            }
        }
    }


    return (
        <>
         <Modal open={modalCliente} onClose={(_event: object,reason) => reason != 'backdropClick' && setAbrirModalCliente(false)}>
                <Box sx={syle}>
                    <Typography variant="h6" component="h2">Cadastrar Cliente</Typography>
                    <form onSubmit={handleSubmit(fetchGravarCliente)}>
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
                            <Button type="submit" sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "#fc9208ff",},}}>
                                Gravar
                            </Button>
                            <Button  onClick={() => cancelarCliente()} sx={{backgroundColor: "#f1941aff", color: "#fff", fontWeight: "bold", borderRadius: "20px",border: "2px solid #ffffffff",paddingX: 3,"&:hover": {backgroundColor: "#fc9208ff",},}}>
                                Cancelar
                            </Button>
                        </Box>
                    </form>

                </Box>
         </Modal>

         {alerta && <Box sx={{ position: 'fixed', top: '50%', left: '50%', transform: 'translate(-50%, -50%)', zIndex: 1301,pointerEvents: 'none' }}>{alerta}</Box>}
        </>
       

    );
};

export default ModalComponent;