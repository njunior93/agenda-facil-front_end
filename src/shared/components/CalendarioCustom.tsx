import dayjs from "dayjs";
import "dayjs/locale/pt-br";
import { useContext, useState } from "react";
import { Box, Typography, IconButton, Paper } from "@mui/material";
import { ChevronLeft, ChevronRight } from "@mui/icons-material";
import { AppContext } from "../context/context";
import type { IAgendamento } from "../../features/agendamentos/interfaces/IAgendamento";

dayjs.locale("pt-br");

export default function CalendarioCustom() {

  const [dataAtual, setDataAtual] = useState(dayjs());
  const {listaAgendamentos} = useContext(AppContext);

  const inicioMes = dataAtual.startOf("month");
  const fimMes = dataAtual.endOf("month");

  const inicioCalendario = inicioMes.startOf("week");
  const fimCalendario = fimMes.endOf("week");

  const dias = [];
  let dia = inicioCalendario;

  while (dia.isBefore(fimCalendario) || dia.isSame(fimCalendario)) {
    dias.push(dia);
    dia = dia.add(1, "day");
  }

  return (
    <>
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <IconButton onClick={() => setDataAtual(dataAtual.subtract(1, "month"))}>
          <ChevronLeft />
        </IconButton>

        <Typography variant="h6">
          {dataAtual.format("MMMM YYYY")}
        </Typography>

        <IconButton onClick={() => setDataAtual(dataAtual.add(1, "month"))}>
          <ChevronRight />
        </IconButton>
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        mt={2}
        mb={1}
      >
        {["dom", "seg", "ter", "qua", "qui", "sex", "sáb"].map((d) => (
          <Typography key={d} textAlign="center" fontWeight="bold">
            {d}
          </Typography>
        ))}
      </Box>

      <Box
        display="grid"
        gridTemplateColumns="repeat(7, 1fr)"
        flex={1}
        gap={1}
      >
        {dias.map((d, index) => {
          const isMesAtual = d.month() === dataAtual.month();

          const agendamentosDia = listaAgendamentos.filter(
            (agendamento: IAgendamento) =>
              dayjs(agendamento.data).format("YYYY-MM-DD") ===
              d.format("YYYY-MM-DD")
          );

          return (
            <Box
              key={index}
              sx={{
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
                    maxHeight: 100,
                }}
                >
                {agendamentosDia.map((agendamento) => (
                  <Box
                    key={agendamento.id}
                    sx={{
                      backgroundColor: "#1976d2",
                      color: "#fff",
                      borderRadius: 1,
                      px: 0.5,
                      py: 0.3,
                      fontSize: "10px",
                    }}
                  >
                    {agendamento.hora}
                  </Box>
                ))}
              </Box>
            </Box>
          );
        })}
      </Box>
      </>
  );
}