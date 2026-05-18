import { Outlet } from "react-router-dom";
import NavBar from "../shared/components/NavBar";
import SideBar from "../shared/components/SideBar";
import { useState } from "react";

const MainLayout: React.FC = () => {
  const [mobileOpen, setMobileOpen] = useState<boolean>(false);

  const handleDrawerToggle = () => {
    setMobileOpen(!mobileOpen);
  };

  return (
    <div className="flex h-screen w-screen overflow-hidden bg-gray-50">
      <SideBar
        mobileOpen={mobileOpen}
        handleDrawerToggle={handleDrawerToggle}
      />
      <div className="flex flex-1 flex-col min-w-0 h-full relative">
        <NavBar handleDrawerToggle={handleDrawerToggle} />

        <main className="flex-1 p-4 overflow-auto bg-gray-50 flex justify-center items-start pt-[80px]">
          <div className="w-full max-w-7xl">
            <Outlet />
          </div>
        </main>

        <footer className="text-center p-3 bg-gray-100 border-t border-gray-200 text-sm text-gray-600">
          &copy; {new Date().getFullYear()} Agenda Fácil. Todos os direitos
          reservados.
        </footer>
      </div>
    </div>
  );
};

export default MainLayout;
