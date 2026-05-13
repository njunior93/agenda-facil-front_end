import { Outlet } from "react-router-dom";
import NavBar from "../shared/components/NavBar";
import SideBar from "../shared/components/SideBar";

const MainLayout = () => {
  return (
    <div style={{ display: "flex", height: "100vh" }}>
      <SideBar />

      <div style={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        <NavBar />

        <main className="min-h-screen w-full flex justify-center" style={{ padding: 20, flex:1, overflow: "auto" }}>
          <Outlet />
        </main>

        <footer style={{ textAlign: "center", padding: 10, backgroundColor: "#f0f0f0" }}>
          &copy; {new Date().getFullYear()} Agenda Fácil. Todos os direitos reservados.
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;