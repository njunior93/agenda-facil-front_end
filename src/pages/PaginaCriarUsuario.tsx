import React, { useEffect, useState } from "react";
import { useForm } from "react-hook-form";
import {  useNavigate } from "react-router-dom";
import {
  Typography,
  TextField,
  Button,
  Link,
  Box,
  CircularProgress,
} from "@mui/material";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import axios from "axios";
import logo from "../assets/logo.png";
import { yupResolver } from "@hookform/resolvers/yup";
import { getErrorMessage } from "../shared/utils/getError";
import alertaMensagem from "../shared/components/AlertaMensagem";
import { AppContext } from "../shared/context/context";
import * as yup from "yup";
import { type IUsuarioInput } from "./usuario/interfaces/IUsuarioInput";

export default function PaginaCriarUsuario() {
  const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { setUsuarioCriado } = React.useContext(AppContext);

  useEffect(() => {
    if (!alerta) return;

    const timer = setTimeout(() => {
      setAlerta(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alerta]);

  const schema = yup.object({
    nome: yup.string().required("O nome é obrigatório"),
    email: yup
      .string()
      .email("Email inválido")
      .required("O email é obrigatório"),
    senha: yup
      .string()
      .min(8, "A senha deve ter no mínimo 8 caracteres")
      .required("A senha é obrigatória"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IUsuarioInput>({ resolver: yupResolver(schema) as any });

  const fetchCadastroUsuario = async (data: IUsuarioInput) => {
    try {
      setLoading(true);

      await axios.post("http://localhost:3000/usuario/cadastro-usuario", {
        nome: data.nome,
        email: data.email,
        senha: data.senha,
      });

      setLoading(false);
      reset();
      setUsuarioCriado(true);
      navigate("/");
    } catch (error: any) {
      setUsuarioCriado(false);
      setLoading(false);
      const mensagemErro = getErrorMessage(error);
      setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon />));
    }
  };

  return (
    <main className="min-h-screen w-full flex items-center justify-center bg-gray-100 p-4">
      <div className="w-full max-w-4xl min-h-[500px] bg-white shadow-lg rounded-2xl flex flex-col md:!flex-row overflow-hidden">
        <section className="flex w-full md:w-1/2 bg-[#F5613B] p-8 md:p-12 items-center justify-center">
          <div className="w-full max-w-[200px] md:max-w-[280px] text-white flex items-center justify-center">
            <figure className="w-full flex items-center justify-center">
              <img
                src={logo}
                alt="Logo"
                className="w-full h-auto object-contain"
              />
            </figure>
          </div>
        </section>

        <section className="w-full md:w-1/2 flex flex-col items-center justify-center p-6 md:p-8 bg-white">
          <div className="w-full max-w-md">
            <Typography variant="h5" fontWeight="600" mb={1}>
              Criar seu cadastro
            </Typography>
            <Typography variant="body2" color="textSecondary" mb={3}>
              Preencha os campos abaixo para criar seu cadastro.
            </Typography>

            <form onSubmit={handleSubmit(fetchCadastroUsuario)}>
              <TextField
                label="Nome Completo"
                fullWidth
                margin="normal"
                {...register("nome")}
                error={!!errors.nome}
                helperText={errors.nome?.message}
              />

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
                type="password"
                fullWidth
                margin="normal"
                {...register("senha")}
                error={!!errors.senha}
                helperText={errors.senha?.message}
              />

              <Button
                className="mt-6"
                type="submit"
                fullWidth
                disabled={loading}
                sx={{
                  backgroundColor: "#F5613B",
                  border: "2px solid #F76843",
                  borderRadius: "1rem",
                  color: "#fff",
                  paddingY: "12px",
                  "&:hover": { backgroundColor: "#f7562d" },
                  "&.Mui-disabled": {
                    backgroundColor: "#fca38d",
                    color: "#ffffff90",
                  },
                }}
              >
                {loading ? (
                  <CircularProgress size={24} color="inherit" />
                ) : (
                  "Finalizar Cadastro"
                )}
              </Button>
            </form>
          </div>

          <footer className="mt-8 text-sm text-gray-600">
            <Link href={loading ? "#" : "/"} underline="hover">
              Voltar para o login
            </Link>
          </footer>
        </section>
      </div>

      {alerta && (
        <Box
          sx={{
            position: "fixed",
            top: "50%",
            left: "50%",
            transform: "translate(-50%, -50%)",
            zIndex: 1301,
            pointerEvents: "none",
          }}
        >
          {alerta}
        </Box>
      )}
    </main>
  );
}
