import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import { TextField, Button, Typography,FormControlLabel, Checkbox, Link } from "@mui/material";
import axios from 'axios';
// import { useNavigate } from 'react-router-dom';

const PaginaLogin = () => {
    // const navigate = useNavigate();

    const schema = yup.object({
        email: yup.string().email("Email inválido").required("Email é obrigatório"),
        senha: yup.string().min(8, "A senha deve conter no mínimo 8 caracteres").required("Senha é obrigatória"),
    })

    const {register, handleSubmit, formState: { errors }} = useForm({resolver: yupResolver(schema)})

    const fetchEntrar = async (data: any) =>{
        try{

            const response = await axios.post("http://localhost:3000/auth/login", {
                email: data.email,
                senha: data.senha
            })

            localStorage.setItem("token", response.data.token)

            window.alert("logado!")

        }catch(error:any){
            if(error.response){
                window.alert("Erro ao fazer login: " + error.response.data.message);
            }
        }
        
    }

    return (
        <main className="min-h-screen w-full flex items-center justify-center bg-gray-100">
            <div className=" w-full max-w-5xl min-h-[500px] bg-white shadow-lg rounded-2xl flex overflow-hidden">
                <section className="flex w-1/2 bg-[#F76843] p-2">
                    <div className="m-auto text-white font-sans">
                        <h1 className="text-4xl font-bold mb-4 underline decoration-pink-500 ">Bem-vindo!</h1>
                        <p className="text-white/90 leading-relaxed">Organize sua agenda, evite conflitos de horários e tenha controle total dos seus atendimentos em um só lugar</p>
                    </div>
                </section>

                <section className="w-1/2 flex flex-col items-center justify-center">
                    <div className="w-full max-w-md p-8">
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

                            <div className="flex items-center justify-between mt-4 mb-4">
                                <FormControlLabel control={<Checkbox />} label="Lembrar-me" />
                                <Link href="#" underline="hover">Esqueceu sua senha?</Link>
                            </div>

                            <Button className="mt-4" type="submit" fullWidth sx={{ backgroundColor: "#F76843", border: "2px solid #F76843", borderRadius: "1rem" ,color: "#fff", '&:hover': { backgroundColor: "#f7562d",},}}>
                                Entrar
                            </Button>
                        </form>
                    </div>

                    <footer>
                        Novo aqui? <Link href="#" underline="hover">Crie sua conta </Link>
                    </footer>
                </section> 
            </div>
        </main>
    )
}

export default PaginaLogin