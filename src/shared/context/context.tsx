import { createContext, useState, type ReactNode } from 'react';
import type { ICliente } from '../interfaces/ICliente';

interface IContext {
  setAbrirModalCliente: (open: false | true) => void;
  modalCliente: false | true;
  listaClientes: ICliente[];
  setListaClientes: (clientes: ICliente[]) => void;

}

interface AppProvideProps{
    children: ReactNode
}

const inicial: IContext = {
  setAbrirModalCliente: () => {},
  modalCliente: false,
  listaClientes: [],
  setListaClientes: () => {},
};

export const AppContext = createContext<IContext>(inicial);

export const AppProvider = ({ children }: AppProvideProps) => {
  const [modalCliente, setAbrirModalCliente] = useState<false | true>(false);
  const [listaClientes, setListaClientes] = useState<ICliente[]>([]);

  return (
    <AppContext.Provider value={{ modalCliente, setAbrirModalCliente, listaClientes, setListaClientes }}>
      {children}
    </AppContext.Provider>
  );
};