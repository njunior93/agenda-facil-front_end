import { createContext, useState, type ReactNode } from 'react';
import type { IClienteOutput } from '../../features/clientes/interfaces/IClienteOutput';

interface IContext {
  setAbrirModal: (open: false | true) => void;
  abrirModal: false | true;
  listaClientes: IClienteOutput[];
  setListaClientes: (clientes: IClienteOutput[]) => void;
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
  tituloModal: '',
  setTituloModal: () => { },
  clienteLocalizado : null,
  setClienteLocalizado: () => { }
};

export const AppContext = createContext<IContext>(inicial);

export const AppProvider = ({ children }: AppProvideProps) => {
  const [abrirModal, setAbrirModal] = useState<false | true>(false);
  const [listaClientes, setListaClientes] = useState<IClienteOutput[]>([]);
  const [tituloModal, setTituloModal] = useState<string>('');
  const [clienteLocalizado, setClienteLocalizado] = useState<IClienteOutput | null>(null)

  return (
    <AppContext.Provider value={{clienteLocalizado,setClienteLocalizado, abrirModal, setAbrirModal, listaClientes, setListaClientes, tituloModal, setTituloModal }}>
      {children}
    </AppContext.Provider>
  );
};