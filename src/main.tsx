import { StrictMode } from 'react'
import { createRoot } from 'react-dom/client'
import './index.css'
import App from './App.tsx'
import { AppProvider } from './shared/context/context.tsx'
import { RouterProvider, createBrowserRouter } from 'react-router-dom'
import PaginaAgenda from './features/agendamentos/pages/PaginaAgenda.tsx'
import PaginaServicos from './features/servicos/pages/PaginaServicos.tsx'
import PaginaClientes from './features/clientes/pages/PaginaClientes.tsx'
import MainLayout from './layouts/MainLayout.tsx'
import PaginaDashboard from './features/dashboard/pages/PaginaDashboard.tsx'


const router = createBrowserRouter([
  {
    path: "/",
    element: <App />,
  },

  {
    element: <MainLayout />,
    children: [
      {
        path: "/dashboard",
        element: <PaginaDashboard />,
      },

      {
        path: "/clientes",
        element: <PaginaClientes />,
      },

      {
        path: "/serviços",
        element: <PaginaServicos />,
      },

      {
        path: "/agendamentos",
        element: <PaginaAgenda />,
      },
    ]
  } 
]);

createRoot(document.getElementById('root')!).render(
  <StrictMode>
    <AppProvider>
        <RouterProvider router={router} />
    </AppProvider>  
  </StrictMode>,
)
