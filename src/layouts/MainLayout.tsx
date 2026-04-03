import { Outlet } from "react-router-dom";
import NavBar from "../shared/components/NavBar";
import SideBar from "../shared/components/SideBar";

const MainLayout = () => {
  return (
    <div style={{ display: "flex" }}>
      <SideBar />

      <div style={{ flexGrow: 1 }}>
        <NavBar />

        <main style={{ padding: 20 }}>
          <Outlet />
        </main>
      </div>
    </div>
  );
};

export default MainLayout;