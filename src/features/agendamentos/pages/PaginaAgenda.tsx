import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useContext, useEffect } from "react";
import {
  Box,
  Typography,
  Paper,
  TextField,
  MenuItem,
  Button,
  CircularProgress,
} from "@mui/material";
import CalendarioCustom from "../../../shared/components/CalendarioCustom";
import SaveIcon from "@mui/icons-material/Save";
import { Controller, useForm } from "react-hook-form";
import { yupResolver } from "@hookform/resolvers/yup";
import type { IAgendamentoInput } from "../interfaces/IAgendamentoInput";
import * as yup from "yup";
import { tiposServico, servicosPorTipo } from "../../../data/servicos";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import React from "react";
import alertaMensagem from "../../../shared/components/AlertaMensagem";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import { getErrorMessage } from "../../../shared/utils/getError";
import { AppContext } from "../../../shared/context/context";

const PaginaAgenda = () => {
  dayjs.locale("pt-br");

  const navigate = useNavigate();
  const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
  const { listaClientes, fetchListaClientes } = useContext(AppContext);
  const { setListaAgendamentos } = useContext(AppContext);
  const [loading, setLoading] = React.useState(false);

  useEffect(() => {
    if (!alerta) return;

    const timer = setTimeout(() => {
      setAlerta(null);
    }, 3000);

    return () => clearTimeout(timer);
  }, [alerta]);

  useEffect(() => {
    fetchListaClientes();
    fetchListaAgendamento();
  }, []);

  const schema = yup.object({
    tipoServico: yup.string().required("Campo obrigatorio"),
    servico: yup.string().required("Campo obrigatorio"),
    data: yup
      .string()
      .required("Campo obrigatorio")
      .matches(/^\d{4}-\d{2}-\d{2}$/, "Formato inválido"),
    hora: yup.string().required("Campo obrigatorio"),
    cliente_id: yup.string().required("Campo obrigatorio"),
  });

  const {
    register,
    handleSubmit,
    watch,
    reset,
    control,
    formState: { errors },
  } = useForm<IAgendamentoInput>({ resolver: yupResolver(schema) as any });

  const tipoSelecionado = watch("tipoServico");
  const servico = watch("servico");
  const data = watch("data");
  const hora = watch("hora");
  const cliente_id = watch("cliente_id");

  const formularioPreenchido =
    tipoSelecionado && servico && data && hora && cliente_id;

  const fetchGravarAgendamento = async (data: IAgendamentoInput) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    setLoading(true);

    try {await axios.post(`${import.meta.env.VITE_API_URL}/agendamento/criar-agendamento`,
        {
          tipoServico: data.tipoServico,
          servico: data.servico,
          data: data.data,
          hora: data.hora,
          cliente_id: data.cliente_id,
        },
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setAlerta(
        alertaMensagem(
          "Agendamento criado com sucesso!",
          "success",
          <ReportProblemIcon />,
        ),
      );
      setLoading(false);
      await fetchListaAgendamento();
      reset();
    } catch (error: any) {
      setLoading(false);
      const mensagemErro = getErrorMessage(error);
      setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon />));
    }
  };

  const fetchListaAgendamento = async () => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/agendamento/listar-agendamentos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setListaAgendamentos(response.data);
    } catch (error: any) {
      const mensagemErro = getErrorMessage(error);
      setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon />));
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto px-2 md:px-4">
      <section className="mb-4">
        <div className="flex flex-col items-center justify-center text-center">
          <Typography
            variant="h4"
            component="h1"
            fontWeight="bold"
            color="#707070"
            className="text-2xl sm:text-3xl md:text-4xl"
          >
            <span className="underline decoration-pink-500">Gestão</span> de
            Agendamentos
          </Typography>
        </div>
      </section>

      <section className="flex flex-col items-center gap-4 p-1 md:!p-2 w-full">
        <div className="w-full max-w-6xl flex flex-col gap-4">
          <Paper
            elevation={3}
            className="w-full flex flex-col items-center gap-4 bg-[#1D2937] p-4 md:!p-6"
            style={{ backgroundColor: "#1D2937" }}
          >
            <Typography
              variant="h6"
              className="text-base w-full px-2 text-[#ECECEC]"
              gutterBottom
              fontWeight="200"
            >
              Preencha os dados
            </Typography>

            <Typography
              className="text-base w-full px-2 text-[#ECECEC] -mt-2"
              gutterBottom
              fontWeight="200"
            >
              Por favor, forneça as seguintes informações
            </Typography>

            <form
              onSubmit={handleSubmit(fetchGravarAgendamento)}
              className="w-full"
            >
              <div className="flex flex-col md:!flex-row gap-4 items-stretch md:!items-center justify-center flex-wrap w-full">
                <Controller
                  name="tipoServico"
                  control={control}
                  render={({ field }) => (
                    <TextField
                      select
                      label="Tipo de serviço"
                      {...field}
                      className="bg-[#E3F2FD] rounded w-full md:!w-auto md:!flex-1 md:!min-w-[160px]"
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
                      className="bg-[#E3F2FD] rounded w-full md:!w-auto md:!flex-1 md:!min-w-[160px]"
                      error={!!errors.servico}
                      helperText={errors.servico?.message}
                    >
                      {(servicosPorTipo[tipoSelecionado] || []).map(
                        (servico) => (
                          <MenuItem key={servico} value={servico}>
                            {servico}
                          </MenuItem>
                        ),
                      )}
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
                      className="bg-[#E3F2FD] rounded w-full md:!w-auto md:!flex-1 md:!min-w-[180px]"
                      sx={{
                        "& .MuiSelect-select": {
                          whiteSpace: "nowrap",
                          overflow: "hidden",
                          textOverflow: "ellipsis",
                        },
                      }}
                      error={!!errors.cliente_id}
                      helperText={errors.cliente_id?.message}
                    >
                      {(listaClientes || []).map((cliente) => (
                        <MenuItem
                          key={cliente.id}
                          value={cliente.id}
                          title={cliente.nome}
                        >
                          {cliente.nome}
                        </MenuItem>
                      ))}
                    </TextField>
                  )}
                />

                <div className="flex gap-4 w-full md:!w-auto md:!flex-1 md:!min-w-[280px]">
                  <TextField
                    type="date"
                    disabled={!tipoSelecionado}
                    {...register("data")}
                    inputProps={{
                      min: new Date().toISOString().split("T")[0],
                    }}
                    className="bg-[#E3F2FD] rounded"
                    error={!!errors.data}
                    helperText={errors.data?.message}
                    fullWidth
                  />

                  <TextField
                    type="time"
                    {...register("hora")}
                    disabled={!tipoSelecionado}
                    className="bg-[#E3F2FD] rounded"
                    error={!!errors.hora}
                    helperText={errors.hora?.message}
                    fullWidth
                  />
                </div>

                <Button
                  disabled={!formularioPreenchido || loading}
                  type="submit"
                  className="text-white font-bold rounded-[20px] border-2 border-white px-8 py-3 w-full md:!w-auto hover:bg-[#1976D3] disabled:bg-[#E0E0E0] disabled:text-[#FFFFFF]"
                  variant="contained"
                  disableElevation
                >
                  {loading ? (
                    <CircularProgress size={24} color="inherit" />
                  ) : (
                    <SaveIcon />
                  )}
                </Button>
              </div>
            </form>
          </Paper>

          <Paper
            elevation={3}
            className="w-full flex flex-col bg-[#ECECEC] p-2 overflow-hidden"
          >
            <div className="w-full overflow-x-auto scrollbar-thin">
              <div className="min-w-[600px] sm:min-w-full">
                <CalendarioCustom />
              </div>
            </div>
          </Paper>
        </div>
      </section>

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
    </div>
  );
};

export default PaginaAgenda;
