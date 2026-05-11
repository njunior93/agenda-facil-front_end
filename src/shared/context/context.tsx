import { createContext, useState, type ReactNode } from 'react';
import type { IClienteOutput } from '../../features/clientes/interfaces/IClienteOutput';
import axios from 'axios';
import type { IAgendamento } from '../../features/agendamentos/interfaces/IAgendamento';

interface IContext {
  setAbrirModal: (open: false | true) => void;
  abrirModal: false | true;
  listaClientes: IClienteOutput[];
  setListaClientes: (clientes: IClienteOutput[]) => void;
  fetchListaClientes: () => Promise<void>;
  listaAgendamentos: IAgendamento[];
  setListaAgendamentos: (agendamento: IAgendamento[]) => void;
  tituloModal: string;
  setTituloModal: (titulo: string) => void;
  clienteLocalizado: IClienteOutput | null;
  setClienteLocalizado:(cliente: IClienteOutput) => void;
}

interface AppProvideProps{
    children: ReactNode
}

const inicial: IContext = {
  setAbrirModal: () => { },
  abrirModal: false,
  listaClientes: [],
  setListaClientes: () => { },
  fetchListaClientes: async () => { },
  tituloModal: '',
  setTituloModal: () => { },
  clienteLocalizado: null,
  setClienteLocalizado: () => { },
  listaAgendamentos: [],
  setListaAgendamentos: () => { },
};

export const AppContext = createContext<IContext>(inicial);

export const AppProvider = ({ children }: AppProvideProps) => {
  const [abrirModal, setAbrirModal] = useState<false | true>(false);
  const [listaClientes, setListaClientes] = useState<IClienteOutput[]>([]);
  const [tituloModal, setTituloModal] = useState<string>('');
  const [clienteLocalizado, setClienteLocalizado] = useState<IClienteOutput | null>(null);
  const [listaAgendamentos, setListaAgendamentos] = useState<IAgendamento[]>([]);

  const fetchListaClientes = async () => {
          const token = localStorage.getItem("token");
  
          try{
              const response = await axios.get("http://localhost:3000/cliente/listar-clientes", {
                  headers: {Authorization: `Bearer ${token}`}
              });
  
              setListaClientes(response.data);
  
          }catch(error:any){
              console.log(error);
          }
  }

  return (
    <AppContext.Provider value={{clienteLocalizado,setClienteLocalizado, abrirModal, setAbrirModal, listaClientes, setListaClientes, fetchListaClientes,tituloModal, setTituloModal,listaAgendamentos, setListaAgendamentos}}>
      {children}
    </AppContext.Provider>
  );
};