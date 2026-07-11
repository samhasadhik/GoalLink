import { createContext, useContext, useState } from 'react';

const AppContext = createContext(null);

export function AppProvider({ children }) {
  const [searchFilters, setSearchFilters] = useState({
    position: '',
    district: '',
    experienceLevel: ''
  });

  return (
    <AppContext.Provider value={{ searchFilters, setSearchFilters }}>
      {children}
    </AppContext.Provider>
  );
}

export const useApp = () => {
  const context = useContext(AppContext);
  if (!context) throw new Error('useApp must be used within AppProvider');
  return context;
};