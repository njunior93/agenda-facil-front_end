import { createContext, useState, type ReactNode } from 'react';

interface IContext {
  setAbrirModalCliente: (open: false | true) => void;
  modalCliente: false | true;

}

interface AppProvideProps{
    children: ReactNode
}

const inicial: IContext = {
  setAbrirModalCliente: () => {},
  modalCliente: false
};

export const AppContext = createContext<IContext>(inicial);

export const AppProvider = ({ children }: AppProvideProps) => {
  const [modalCliente, setAbrirModalCliente] = useState<false | true>(false);

  return (
    <AppContext.Provider value={{ modalCliente, setAbrirModalCliente }}>
      {children}
    </AppContext.Provider>
  );
};