import { createContext, useState, type ReactNode } from 'react';

interface IContext {
  setOpenSideBar: (open: false | true) => void;
  openSideBar: false | true;

}

interface AppProvideProps{
    children: ReactNode
}

const inicial: IContext = {
  setOpenSideBar: () => {},
  openSideBar: false
};

export const AppContext = createContext<IContext>(inicial);

export const AppProvider = ({ children }: AppProvideProps) => {
  const [openSideBar, setOpenSideBar] = useState<false | true>(false);

  return (
    <AppContext.Provider value={{ openSideBar, setOpenSideBar }}>
      {children}
    </AppContext.Provider>
  );
};