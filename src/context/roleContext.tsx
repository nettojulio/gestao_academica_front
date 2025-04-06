import React, { createContext, useContext, useMemo } from 'react';

interface RoleContextProps {
  activeRole: string;
  userRoles: string[];
}

const RoleContext = createContext<RoleContextProps | undefined>(undefined);

export const useRole = () => {
  const context = useContext(RoleContext);
  if (!context) {
    throw new Error('useRole must be used within a RoleProvider');
  }
  return context;
};

interface RoleProviderProps {
  activeRole: string;
  userRoles: string[];
  children: React.ReactNode;
}

export const RoleProvider = ({ activeRole, userRoles, children }: RoleProviderProps) => {
  // Memoriza o valor para que ele só mude quando activeRole ou userRoles mudarem
  const value = useMemo(() => ({ activeRole, userRoles }), [activeRole, userRoles]);

  return <RoleContext.Provider value={value}>{children}</RoleContext.Provider>;
};
