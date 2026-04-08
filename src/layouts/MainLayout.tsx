import { Outlet } from "react-router-dom";
import NavBar from "../shared/components/NavBar";
import SideBar from "../shared/components/SideBar";

const MainLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <div style={{ flexGrow: 1 }}>
        <NavBar />

        <main className="h-screen w-full" style={{ padding: 20 }}>
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