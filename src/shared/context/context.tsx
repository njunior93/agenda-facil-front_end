import { createContext, useState, type ReactNode } from "react";
import type { IClienteOutput } from "../../features/clientes/interfaces/IClienteOutput";
import axios from "axios";
import type { IAgendamentoOutput } from "../../features/agendamentos/interfaces/IAgendamentoOutput";

interface IContext {
  setAbrirModal: (open: false | true) => void;
  abrirModal: false | true;
  listaClientes: IClienteOutput[];
  setListaClientes: (clientes: IClienteOutput[]) => void;
  fetchListaClientes: () => Promise<void>;
  fetchListaAgendamentos: () => Promise<void>;
  listaAgendamentos: IAgendamentoOutput[];
  setListaAgendamentos: (agendamento: IAgendamentoOutput[]) => void;
  tituloModal: string;
  setTituloModal: (titulo: string) => void;
  clienteLocalizado: IClienteOutput | null;
  setClienteLocalizado: (cliente: IClienteOutput | null) => void;
  agendamentoLocalizado: IAgendamentoOutput | null;
  setAgendamentoLocalizado: (agendamento: IAgendamentoOutput | null) => void;
  senhaalterada: boolean;
  setSenhaAlterada: (alterada: boolean) => void;
  usuarioCriado: boolean;
  setUsuarioCriado: (criado: boolean) => void;
}

interface AppProvideProps {
  children: ReactNode;
}

const inicial: IContext = {
  setAbrirModal: () => {},
  abrirModal: false,
  listaClientes: [],
  setListaClientes: () => {},
  fetchListaClientes: async () => {},
  fetchListaAgendamentos: async () => {},
  tituloModal: "",
  setTituloModal: () => {},
  clienteLocalizado: null,
  setClienteLocalizado: () => {},
  listaAgendamentos: [],
  setListaAgendamentos: () => {},
  agendamentoLocalizado: null,
  setAgendamentoLocalizado: () => {},
  senhaalterada: false,
  setSenhaAlterada: () => {},
  usuarioCriado: false,
  setUsuarioCriado: () => {},
};

export const AppContext = createContext<IContext>(inicial);

export const AppProvider = ({ children }: AppProvideProps) => {
  const [abrirModal, setAbrirModal] = useState<false | true>(false);
  const [listaClientes, setListaClientes] = useState<IClienteOutput[]>([]);
  const [tituloModal, setTituloModal] = useState<string>("");
  const [clienteLocalizado, setClienteLocalizado] =
    useState<IClienteOutput | null>(null);
  const [listaAgendamentos, setListaAgendamentos] = useState<
    IAgendamentoOutput[]
  >([]);
  const [agendamentoLocalizado, setAgendamentoLocalizado] =
    useState<IAgendamentoOutput | null>(null);
  const [senhaalterada, setSenhaAlterada] = useState<boolean>(false);
  const [usuarioCriado, setUsuarioCriado] = useState<boolean>(false);

  const fetchListaClientes = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/cliente/listar-clientes`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setListaClientes(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  const fetchListaAgendamentos = async () => {
    const token = localStorage.getItem("token");

    try {
      const response = await axios.get(
        `${import.meta.env.VITE_API_URL}/agendamento/listar-agendamentos`,
        {
          headers: { Authorization: `Bearer ${token}` },
        },
      );

      setListaAgendamentos(response.data);
    } catch (error: any) {
      console.log(error);
    }
  };

  return (
    <AppContext.Provider
      value={{
        usuarioCriado,
        setUsuarioCriado,
        senhaalterada,
        setSenhaAlterada,
        fetchListaAgendamentos,
        agendamentoLocalizado,
        setAgendamentoLocalizado,
        clienteLocalizado,
        setClienteLocalizado,
        abrirModal,
        setAbrirModal,
        listaClientes,
        setListaClientes,
        fetchListaClientes,
        tituloModal,
        setTituloModal,
        listaAgendamentos,
        setListaAgendamentos,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};
