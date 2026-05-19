import {
  Box,
  Button,
  List,
  CircularProgress,
  ListItem,
  ListItemAvatar,
  ListItemText,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import Avatar from "@mui/material/Avatar";
import Modal from "../../../shared/modals/Modal";
import * as yup from "yup";
import { useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import React, { useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import alertaMensagem from "../../../shared/components/AlertaMensagem";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { getErrorMessage } from "../../../shared/utils/getError";
import { AppContext } from "../../../shared/context/context";
import type { IClienteInput } from "../../../shared/interfaces/IClienteInput";
import type { IClienteOutput } from "../interfaces/IClienteOutput";
import type { CSSProperties } from "react";

const PaginaClientes = () => {
  const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
  const { listaClientes, fetchListaClientes } = useContext(AppContext);
  const { setTituloModal } = useContext(AppContext);
  const { setAbrirModal } = useContext(AppContext);
  const navigate = useNavigate();
  const { setClienteLocalizado } = useContext(AppContext);
  const { fetchListaAgendamentos } = useContext(AppContext);
  const [loading, setLoading] = React.useState(false);
  const [busca, setBusca] = useState('');

  useEffect(() => {
    if (!alerta) return;

    const timer = setTimeout(() => {
      setAlerta(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alerta]);

  useEffect(() => {
    fetchListaClientes();
    fetchListaAgendamentos();
  }, []);

  const style: CSSProperties = {
    width: "100%",
    padding: "1rem",
    boxSizing: "border-box",
    gap: "1rem",
    display: "flex",
    flexDirection: "column",
  };

  const schema = yup.object({
    nome: yup.string().required("O nome é obrigatório"),
    email: yup
      .string()
      .email("Email inválido")
      .required("O email é obrigatório"),
    telefone: yup
      .string()
      .test("telefone-valido", "Formato: (99) 9999-9999", (value) => {
        if (!value) return true;
        return /^\(\d{2}\)\s\d{4}-\d{4}$/.test(value);
      })
      .optional(),
    celular: yup
      .string()
      .test("celular-valido", "Formato: (99) 99999-9999", (value) => {
        if (!value) return true;
        return /^\(\d{2}\)\s\d{5}-\d{4}$/.test(value);
      })
      .required("O celular é obrigatório"),
  });

  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm<IClienteInput>({ resolver: yupResolver(schema) as any });

  const formatarFoneCel = (numero: string) => {
    const valor = numero.replace(/\D/g, "");

    if (valor.length <= 10) {
      return valor
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{4})(\d)/, "$1-$2");
    } else {
      return valor
        .replace(/^(\d{2})(\d)/g, "($1) $2")
        .replace(/(\d{5})(\d)/, "$1-$2");
    }
  };

  const limparFormCliente = () => {
    reset();
    setLoading(false);
  };

  const fetchGravarCliente = async (data: IClienteInput) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);

    try {
      await axios.post(
        `${import.meta.env.VITE_API_URL}/cliente/criar-cliente`,
        {
          nome: data.nome,
          email: data.email,
          telefone: data.telefone,
          celular: data.celular,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      await fetchListaClientes();

      setAlerta(
        alertaMensagem(
          "Cliente cadastrado com sucesso!",
          "success",
          <ReportProblemIcon />,
        ),
      );
      setLoading(false);
      reset();
    } catch (error: any) {
      setLoading(false);
      const mensagemErro = getErrorMessage(error);
      setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon />));
    }
  };

  const fetchLocalizarCliente = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/cliente/localizar-cliente/${id}`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setClienteLocalizado(response.data);

      setTituloModal("Editar Cliente");
      setAbrirModal(true);
    } catch (error: any) {
      const mensagemErro = getErrorMessage(error);
      setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon />));
    }
  };

  return (
    <>
      <div className="w-full max-w-6xl mx-auto px-2 md:!px-4">
        <section className="mb-4">
          <div className="flex flex-col items-center justify-center text-center">
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="#707070"
              className="text-2xl sm:!text-3xl md:!text-4xl"
            >
              <span className="underline decoration-pink-500">Gestão</span> de
              Clientes
            </Typography>
          </div>
        </section>

        <section className="flex flex-col md:!flex-row justify-center gap-4 p-1 md:!p-2 w-full">
          <div className="w-full flex flex-col md:!flex-row gap-4 items-stretch">
            <Paper
              className="w-full md:!w-2/3 flex flex-col bg-[#F8F9FA]"
              elevation={3}
              style={{ backgroundColor: "#F8F9FA" }}
            >
              <Typography
                variant="h6"
                className="text-sm md:!text-base bg-[#ECECEC] w-full p-2 border border-gray-300"
                gutterBottom
                fontWeight="400"
              >
                Formulário de Cadastro
              </Typography>

              <form
                style={style}
                onSubmit={handleSubmit(fetchGravarCliente)}
                className="p-4 flex flex-col gap-4"
              >
                <TextField
                  label="Nome"
                  {...register("nome")}
                  error={!!errors.nome}
                  helperText={errors.nome?.message}
                  fullWidth
                />

                <TextField
                  label="Email"
                  {...register("email")}
                  error={!!errors.email}
                  helperText={errors.email?.message}
                  fullWidth
                />

                <div className="flex flex-col sm:!flex-row gap-4 w-full">
                  <TextField
                    label="Telefone"
                    className="w-full sm:!flex-1"
                    placeholder="(99) 9999-9999"
                    {...register("telefone")}
                    error={!!errors.telefone}
                    helperText={errors.telefone?.message}
                    onChange={(e) => {
                      e.target.value = formatarFoneCel(e.target.value);
                    }}
                  />

                  <TextField
                    label="Celular"
                    className="w-full sm:!flex-1"
                    placeholder="(99) 99999-9999"
                    {...register("celular")}
                    error={!!errors.celular}
                    helperText={errors.celular?.message}
                    onChange={(e) => {
                      e.target.value = formatarFoneCel(e.target.value);
                    }}
                  />
                </div>

                <div className="flex flex-col sm:!flex-row gap-3 mt-2">
                  <Button
                    disabled={loading}
                    type="submit"
                    sx={{
                      backgroundColor: "rgb(53, 163, 20)",
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      border: "2px solid #ffffffff",
                      paddingX: 3,
                      "&:hover": { backgroundColor: "rgb(32, 112, 8)" },
                      "&.Mui-disabled": {
                        backgroundColor: "#c5f5ac",
                        color: "#ffffff90",
                      },
                    }}
                    className="w-full sm:!w-auto bg-[rgb(53,163,20)] text-white font-bold rounded-[20px] border-2 border-white px-6 py-2 hover:bg-[rgb(32,112,8)] disabled:bg-[#aaf87f] disabled:text-[#ffffff90]"
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Gravar"
                    )}
                  </Button>

                  <Button
                    disabled={loading}
                    sx={{
                      backgroundColor: "#f1941aff",
                      color: "#fff",
                      fontWeight: "bold",
                      borderRadius: "20px",
                      border: "2px solid #ffffffff",
                      paddingX: 3,
                      "&:hover": { backgroundColor: "#fc9208ff" },
                      "&.Mui-disabled": {
                        backgroundColor: "#f3d399",
                        color: "#ffffff90",
                      },
                    }}
                    onClick={() => limparFormCliente()}
                  >
                    {loading ? (
                      <CircularProgress size={24} color="inherit" />
                    ) : (
                      "Limpar"
                    )}
                  </Button>
                </div>
              </form>
            </Paper>

            <Paper
              className="w-full md:!w-1/3 flex flex-col bg-[#F8F9FA] max-h-[450px] md:!max-h-none"
              elevation={3}
              style={{ backgroundColor: "#F8F9FA" }}
            >
              <Typography
                variant="h6"
                className="text-sm md:!text-base bg-[#ECECEC] w-full p-2 border border-gray-300"
                gutterBottom
                fontWeight="400"
              >
                Clientes
              </Typography>

              <div className="p-2">
                <TextField
                  size="small"
                  placeholder="Buscar cliente"
                  value={busca}
                  onChange={(e) => setBusca(e.target.value)}
                  fullWidth
                />
              </div>

              <List className="w-full bg-white flex-1 overflow-auto max-h-[300px] md:!max-h-[500px]">
                {listaClientes?.length === 0 && (
                  <Typography className="p-4 text-center text-gray-400">
                    Nenhum cliente cadastrado.
                  </Typography>
                )}

                {listaClientes.filter((cliente) =>{
                  if(busca.trim() === '') return;

                  const filtro = busca.toLowerCase();

                  const contemCliente = cliente.nome?.toLowerCase().includes(filtro)

                  return contemCliente;

                })?.map((cliente: IClienteOutput) => (
                  <ListItem
                    key={cliente.id}
                    onClick={() => fetchLocalizarCliente(cliente.id)}
                    divider
                    className="cursor-pointer hover:bg-gray-100"
                  >
                    <ListItemAvatar>
                      <Avatar className="bg-[#1976d2]">
                        {cliente.nome.charAt(0).toUpperCase()}
                      </Avatar>
                    </ListItemAvatar>
                    <ListItemText
                      primary={cliente.nome}
                      secondary={`${cliente.celular || ""} ${cliente.email ? "• " + cliente.email : ""}`}
                      primaryTypographyProps={{
                        className: "truncate max-w-[180px] sm:!max-w-none",
                      }}
                      secondaryTypographyProps={{
                        className: "truncate max-w-[180px] sm:!max-w-none",
                      }}
                    />
                  </ListItem>
                ))}
              </List>
            </Paper>
          </div>
        </section>

        <Modal />
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
    </>
  );
};

export default PaginaClientes;
