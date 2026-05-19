import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useContext, useEffect, useState } from "react";
import { Box, Typography, IconButton } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { AppContext } from "../context/context";
import type { IAgendamentoOutput } from "../../features/agendamentos/interfaces/IAgendamentoOutput";
import Tooltip from "@mui/material/Tooltip";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { getErrorMessage } from "../utils/getError";
import alertaMensagem from "./AlertaMensagem";
import React from "react";
import ReportProblemIcon from "@mui/icons-material/ReportProblem";
import Modal from "../modals/Modal";

dayjs.locale("pt-br");

export default function CalendarioCustom() {
  const [alerta, setAlerta] = React.useState<React.ReactNode | null>(null);
  const { setTituloModal } = useContext(AppContext);
  const { setAbrirModal } = useContext(AppContext);
  const navigate = useNavigate();
  const { setAgendamentoLocalizado } = useContext(AppContext);

  const [dataAtual, setDataAtual] = useState(dayjs());
  const { listaAgendamentos } = useContext(AppContext);

  const inicioMes = dataAtual.startOf("month");
  const fimMes = dataAtual.endOf("month");

  const inicioCalendario = inicioMes.startOf("week");
  const fimCalendario = fimMes.endOf("week");

  const dias = [];
  let dia = inicioCalendario;

  useEffect(() => {
      if (!alerta) return;
  
    const timer = setTimeout(() => {
      setAlerta(null);
    }, 3000);
  
      return () => clearTimeout(timer);
    }, [alerta]);

  const fetchLocalizarAgendamento = async (id: string) => {
    const token = localStorage.getItem("token");

    if (!token) {
      navigate("/");
      return;
    }

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/agendamento/localizar-agendamento/${id}`,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      setAgendamentoLocalizado(response.data);

      setTituloModal("Editar Agendamento");
      setAbrirModal(true);
    } catch (error: any) {
      const mensagemErro = getErrorMessage(error);
        setAlerta(alertaMensagem(mensagemErro, "error", <ReportProblemIcon />));
    }
  };

  while (dia.isBefore(fimCalendario) || dia.isSame(fimCalendario)) {
    dias.push(dia);
    dia = dia.add(1, "day");
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IconButton
          onClick={() => setDataAtual(dataAtual.subtract(1, "month"))}
        >
          <ChevronLeft />
        </IconButton>

        <Typography variant="h6">{dataAtual.format("MMMM YYYY")}</Typography>

        <IconButton onClick={() => setDataAtual(dataAtual.add(1, "month"))}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box display="grid" gridTemplateColumns="repeat(7, 1fr)" mt={2} mb={1}>
        {["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].map((d) => (
          <Typography key={d} textAlign="center" fontWeight="bold">
            {d}
          </Typography>
        ))}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        gridAutoRows="120px"
        gap={1}
        sx={{
          overflowY: "auto",
          flex: 1,
          minHeight: 0,
        }}
      >
        {dias.map((d, index) => {
          const isMesAtual = d.month() === dataAtual.month();

          const agendamentosDia = listaAgendamentos
            .filter(
              (agendamento: IAgendamentoOutput) =>
                dayjs(agendamento.data).format("YYYY-MM-DD") ===
                d.format("YYYY-MM-DD"),
            )
            .sort((a, b) => a.hora.localeCompare(b.hora));

          return (
            <Box
              key={index}
              sx={{
                overflow: "hidden",
                minHeight: 0,
                border: "1px solid #ccc",
                borderRadius: 1,
                p: 1,
                backgroundColor: isMesAtual ? "#fff" : "#f5f5f5",
                display: "flex",
                flexDirection: "column",
                justifyContent: "space-between",
                cursor: "pointer",
                "&:hover": {
                  backgroundColor: "#e0e0e0",
                },
              }}
            >
              <Typography variant="caption">{d.date()}</Typography>

              <Box
                display="flex"
                flexDirection="column"
                gap={0.5}
                sx={{
                  overflowY: "auto",
                  maxHeight: 120,
                  flex: 1,
                }}
              >
                {agendamentosDia.map((agendamento) => (
                  <>
                    <Tooltip
                      key={agendamento.id}
                      title={
                        <>
                          <div>
                            <strong>Cliente:</strong> {agendamento.cliente.nome}
                          </div>

                          <div>
                            <strong>Serviço:</strong> {agendamento.servico}
                          </div>

                          <div>
                            <strong>Status:</strong>{" "}
                            {agendamento.status === "a"
                              ? "Agendado"
                              : agendamento.status === "c"
                                ? "Cancelado"
                                : "Finalizado"}
                          </div>
                        </>
                      }
                      arrow
                      placement="top"
                    >
                      <Box
                        key={agendamento.id}
                        onClick={() =>
                          fetchLocalizarAgendamento(agendamento.id.toString())
                        }
                        sx={{
                          backgroundColor:
                            agendamento.status === "a"
                              ? "#F59E0B"
                              : agendamento.status === "c"
                                ? "#EF4444"
                                : "#10B981",
                          color: "#fff",
                          borderRadius: 1,
                          px: 0.5,
                          py: 0.3,
                          fontSize: "12px",
                        }}
                      >
                        {agendamento.hora}
                      </Box>
                    </Tooltip>
                  </>
                ))}
              </Box>
            </Box>
          );
        })}
        <Modal />
      </Box>

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
}
