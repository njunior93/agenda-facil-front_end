import {
  Button,
  List,
  ListItem,
  ListItemText,
  Typography,
} from "@mui/material";
import Paper from "@mui/material/Paper";
import Stack from "@mui/material/Stack";
import PersonIcon from "@mui/icons-material/Person";
import EventIcon from "@mui/icons-material/Event";
import Modal from "../../../shared/modals/Modal";
import { AppContext } from "../../../shared/context/context";
import React, { useContext, useEffect } from "react";

const PaginaDashboard = () => {
  const { setAbrirModal } = useContext(AppContext);
  const { setTituloModal } = useContext(AppContext);
  const [qtdAgendamentos, setQtdAgendamentos] = React.useState(0);
  const [qtdFinalizados, setQtdFinalizados] = React.useState(0);
  const [qtdCancelados, setQtdCancelados] = React.useState(0);
  const { listaAgendamentos, fetchListaAgendamentos, fetchListaClientes } =
    useContext(AppContext);

  const abrirModalCliente = (mov: boolean) => {
    setTituloModal("Cadastrar Cliente");
    setAbrirModal(mov);
  };

  const abrirModalAgendamento = (mov: boolean) => {
    setTituloModal("Cadastrar Agendamento");
    setAbrirModal(mov);
  };

  useEffect(() => {
    let agendamentos = 0;
    let finalizados = 0;
    let cancelados = 0;

    listaAgendamentos.forEach((agendamento) => {
      if (agendamento.status === "a") {
        agendamentos++;
      } else if (agendamento.status === "f") {
        finalizados++;
      } else if (agendamento.status === "c") {
        cancelados++;
      }
    });
    setQtdAgendamentos(agendamentos);
    setQtdFinalizados(finalizados);
    setQtdCancelados(cancelados);
  }, [listaAgendamentos]);

  useEffect(() => {
    fetchListaClientes();
    fetchListaAgendamentos();
  }, []);

  return (
    <>
      <main className="w-full max-w-6xl mx-auto px-2 md:!px-4 min-h-screen py-4">
        <section className="mb-6">
          <div className="flex flex-col items-center justify-center text-center">
            <Typography
              variant="h4"
              component="h1"
              fontWeight="bold"
              color="#707070"
              className="text-xl sm:!text-2xl md:!text-4xl"
            >
              <span className="underline decoration-pink-500">Dashboard</span>{" "}
              Gerenciamento de Agenda
            </Typography>

            <div className="grid grid-cols-1 sm:!grid-cols-3 gap-4 w-full mt-6 max-w-4xl px-2 sm:!px-0">
              <Paper
                elevation={3}
                className="p-4 bg-[#f59e0b] rounded-lg text-left flex flex-col justify-between h-[110px]"
                style={{ backgroundColor: "#f59e0b" }}
              >
                <Typography
                  variant="h6"
                  fontWeight="600"
                  className="text-white"
                >
                  Agendado
                </Typography>
                <p className="text-white text-2xl font-bold">
                  {qtdAgendamentos}
                </p>
              </Paper>

              <Paper
                elevation={3}
                className="p-4 bg-[#10b981] rounded-lg text-left flex flex-col justify-between h-[110px]"
                style={{ backgroundColor: "#10b981" }}
              >
                <Typography
                  variant="h6"
                  fontWeight="600"
                  className="text-white"
                >
                  Finalizado
                </Typography>
                <p className="text-white text-2xl font-bold">
                  {qtdFinalizados}
                </p>
              </Paper>

              <Paper
                elevation={3}
                className="p-4 bg-[#ef4444] rounded-lg text-left flex flex-col justify-between h-[110px]"
                style={{ backgroundColor: "#ef4444" }}
              >
                <Typography
                  variant="h6"
                  fontWeight="600"
                  className="text-white"
                >
                  Cancelado
                </Typography>
                <p className="text-white text-2xl font-bold">{qtdCancelados}</p>
              </Paper>
            </div>
          </div>
        </section>

        <section className="flex flex-col md:!flex-row gap-4 p-1 md:!p-2 items-stretch w-full">
          <Paper
            className="w-full md:!w-2/3 flex flex-col min-h-[250px]"
            elevation={3}
            style={{ backgroundColor: "#F8F9FA" }}
          >
            <Typography
              variant="h6"
              className="text-sm md:!text-base bg-[#ECECEC] w-full p-2 border border-gray-300"
              gutterBottom
              fontWeight="400"
            >
              Agendamentos recentes
            </Typography>

            <List className="w-full bg-white flex-1 overflow-auto max-h-[250px]">
              {listaAgendamentos.slice(0, 5).map((agendamento) => {
                const [ano, mes, dia] = agendamento.data.split("-");
                const dataFormatada = `${dia}/${mes}/${ano}`;
                const horaFormatada = agendamento.hora.slice(0, 5);

                return (
                  <ListItem key={agendamento.id} divider>
                    <ListItemText
                      primary={`Cliente: ${agendamento.cliente.nome}`}
                      secondary={`Data: ${dataFormatada} || Hora: ${horaFormatada} • Status: ${agendamento.status === "a" ? "Agendado" : agendamento.status === "f" ? "Finalizado" : "Cancelado"}`}
                      primaryTypographyProps={{
                        className: "truncate text-sm font-semibold",
                      }}
                      secondaryTypographyProps={{
                        className: "text-xs md:!text-sm",
                      }}
                    />
                  </ListItem>
                );
              })}
            </List>
          </Paper>

          <Paper
            className="w-full md:!w-1/3 flex flex-col min-h-[180px] md:!min-h-[250px]"
            elevation={3}
            style={{ backgroundColor: "#F8F9FA" }}
          >
            <Typography
              variant="h6"
              className="text-sm md:!text-base bg-[#ECECEC] w-full p-2 border border-gray-300"
              gutterBottom
              fontWeight="400"
            >
              Ações rápidas
            </Typography>

            <Stack
              spacing={2}
              direction="column"
              className="mt-2 p-4 flex-1 justify-center"
            >
              <Button
                variant="outlined"
                startIcon={<PersonIcon />}
                className="border-green-600 text-green-600 hover:bg-green-50 font-bold py-2"
                onClick={() => abrirModalCliente(true)}
              >
                Cadastrar Cliente
              </Button>
              <Button
                variant="outlined"
                startIcon={<EventIcon />}
                className="border-blue-600 text-blue-600 hover:bg-blue-50 font-bold py-2"
                onClick={() => abrirModalAgendamento(true)}
              >
                Novo Agendamento
              </Button>
            </Stack>
          </Paper>
        </section>

        <Modal />
      </main>
    </>
  );
};

export default PaginaDashboard;
