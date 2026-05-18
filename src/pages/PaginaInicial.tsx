import { Typography } from "@mui/material";
import Paper from "@mui/material/Paper";


const PaginaInicial = () => {
  return (
    <>
      <main>
        <section>
          <div className="flex flex-col  items-start justify-start">
            <div className="flex justify-center flex-row gap-8">
              <Paper
                elevation={3}
                sx={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  width: "240px",
                  height: "120px",
                  backgroundColor: "#FBB11D",
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Agendado
                </Typography>
                <p className="text-black text-[#fff] text-ls font-bold">0</p>
              </Paper>
              <Paper
                elevation={3}
                sx={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  width: "240px",
                  height: "120px",
                  backgroundColor: "#2E89D1",
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Finalizado
                </Typography>
                <p className="text-black text-[#fff] text-ls font-bold">0</p>
              </Paper>
              <Paper
                elevation={3}
                sx={{
                  padding: "1rem",
                  marginBottom: "1rem",
                  width: "240px",
                  height: "120px",
                  backgroundColor: "#DA4A48",
                }}
              >
                <Typography variant="h6" fontWeight="600">
                  Cancelado
                </Typography>
                <p className="text-black text-[#fff] text-ls font-bold">0</p>
              </Paper>
            </div>
          </div>
        </section>
        <section></section>
      </main>
    </>
  );
};

export default PaginaInicial;
