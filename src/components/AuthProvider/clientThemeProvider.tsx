// ClientThemeProvider.tsx
"use client";

import { ThemeProvider, CssBaseline } from "@mui/material";
import React, { useEffect, useState } from "react";
import theme from "@/theme/theme"; // ajuste o caminho conforme sua estrutura
import { usePathname, useRouter } from "next/navigation";
import { ToastContainer } from "react-toastify";

type ClientThemeProviderProps = {
  children: React.ReactNode;
};
/**
 * Lê e parseia os dados de autenticação do localStorage,
 * retornando a role do usuário, se existir.
 */
function getUserRole(): string | null {
  try {
    const dataStr = localStorage.getItem("sgu_authenticated_user");
    if (dataStr) {
      const data = JSON.parse(dataStr);
      return data.usuarioRole || null;
    }
  } catch (error) {
    console.error("Erro ao parsear auth data:", error);
  }
  return null;
}
export default function ClientThemeProvider({ children }: ClientThemeProviderProps) {

  const [userRole, setUserRole] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const router = useRouter();
  const pathname = usePathname();

  // Leitura inicial dos dados de autenticação
  useEffect(() => {
    const role = getUserRole();
    setUserRole(role);
    setLoading(false);
  }, []);
  if (loading) {
    return <div>Carregando...</div>;
  }

  // Se a rota atual for a de login, renderiza os filhos (componente Login)
  if (pathname === "/login") {
    return <>{children}</>;
  }

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />
        {children}
        <ToastContainer />
    </ThemeProvider>
  );
}
