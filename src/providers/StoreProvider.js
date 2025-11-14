import React from 'react';
import { RootStore } from '../stores/root.store';

export const StoreContext = React.createContext(null);
const StoreProvider = ({ children }) => {
  const root = new RootStore();
  return <StoreContext.Provider value={root}>{children}</StoreContext.Provider>;
};

export default StoreProvider;